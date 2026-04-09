require('dotenv').config();
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { OpenAI } = require('openai');
const Meeting = require('../models/Meeting');
const mongoose = require('mongoose');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 90000,
});

const summaryModel = process.env.OPENAI_SUMMARY_MODEL || 'gpt-4o-mini';

const formatTimestamp = (seconds = 0) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const buildAudioUrl = (req, audioPath) => {
  if (!audioPath) {
    return null;
  }

  return `${req.protocol}://${req.get('host')}/${audioPath.replace(/\\/g, '/')}`;
};

const ensureConfigured = () => {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('OPENAI_API_KEY is not configured on the server.');
    error.statusCode = 500;
    throw error;
  }
};

const normalizeSegments = (segments = []) => (
  segments
    .filter((segment) => typeof segment?.text === 'string' && segment.text.trim())
    .map((segment) => ({
      start: Number(segment.start) || 0,
      end: Number(segment.end) || Number(segment.start) || 0,
      text: segment.text.trim(),
    }))
);

const deriveSectionsFromSegments = (segments = []) => {
  if (!segments.length) {
    return [];
  }

  const chunkSize = 6;
  const sections = [];

  for (let index = 0; index < segments.length; index += chunkSize) {
    const chunk = segments.slice(index, index + chunkSize);
    sections.push({
      title: `Section ${sections.length + 1}`,
      start: chunk[0].start,
      end: chunk[chunk.length - 1].end,
      overview: chunk.map((segment) => segment.text).join(' ').slice(0, 500),
    });
  }

  return sections;
};

const parseSummaryPayload = (content, segments) => {
  try {
    const parsed = JSON.parse(content);
    return {
      summary: typeof parsed.summary === 'string' && parsed.summary.trim()
        ? parsed.summary.trim()
        : 'Summary unavailable.',
      tasks: Array.isArray(parsed.tasks)
        ? parsed.tasks.map((task) => String(task).trim()).filter(Boolean)
        : [],
      sections: Array.isArray(parsed.sections)
        ? parsed.sections
          .filter((section) => section && typeof section.overview === 'string')
          .map((section, index) => ({
            title: String(section.title || `Section ${index + 1}`).trim(),
            start: Number(section.start) || 0,
            end: Number(section.end) || Number(section.start) || 0,
            overview: section.overview.trim(),
          }))
          .filter((section) => section.overview)
        : [],
    };
  } catch (error) {
    return {
      summary: typeof content === 'string' && content.trim() ? content.trim() : 'Summary unavailable.',
      tasks: [],
      sections: deriveSectionsFromSegments(segments),
    };
  }
};

const summarizeTranscript = async (transcriptText, segments) => {
  const prompt = [
    'You are an AI meeting assistant.',
    'Return strict JSON with this shape only:',
    '{"summary":"string","tasks":["string"],"sections":[{"title":"string","start":0,"end":0,"overview":"string"}]}',
    'Write a concise but complete summary, extract actionable tasks, and create timeline sections that follow the conversation order.',
    'Use seconds for start and end.',
    'If there are no action items, return an empty array.',
    '',
    transcriptText,
  ].join('\n');

  const response = await openai.chat.completions.create({
    model: summaryModel,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You summarize meeting transcripts into structured JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return parseSummaryPayload(response.choices[0]?.message?.content || '', segments);
};

const serializeMeeting = (meeting, req) => ({
  ...meeting.toObject(),
  audioUrl: buildAudioUrl(req, meeting.audioPath),
});

const writeParagraph = (doc, text) => {
  if (!text) {
    return;
  }

  doc.font('Helvetica').fontSize(11).fillColor('#3F3F46').text(text, {
    lineGap: 4,
  });
  doc.moveDown(0.8);
};

const writeBulletList = (doc, items) => {
  items.forEach((item) => {
    doc.font('Helvetica').fontSize(11).fillColor('#3F3F46').text(`• ${item}`, {
      lineGap: 3,
    });
  });
  doc.moveDown(0.8);
};

const writeSectionHeading = (doc, text) => {
  doc.font('Helvetica-Bold').fontSize(15).fillColor('#2563EB').text(text);
  doc.moveDown(0.5);
};

exports.handleMeetingUpload = async (req, res) => {
  try {
    ensureConfigured();

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }

    const title = typeof req.body.title === 'string' && req.body.title.trim()
      ? req.body.title.trim().slice(0, 120)
      : 'Untitled Meeting';
    const audioPath = path.resolve(req.file.path);

    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'],
    });

    const transcriptText = transcriptionResponse.text?.trim();

    if (!transcriptText) {
      return res.status(422).json({ error: 'Transcription completed without any transcript text.' });
    }

    const segments = normalizeSegments(transcriptionResponse.segments);
    const summaryPayload = await summarizeTranscript(transcriptText, segments);

    const meeting = new Meeting({
      title,
      transcript: transcriptText,
      summary: summaryPayload.summary,
      tasks: summaryPayload.tasks,
      sections: summaryPayload.sections.length
        ? summaryPayload.sections
        : deriveSectionsFromSegments(segments),
      segments,
      audioPath: path.relative(path.join(__dirname, '..'), audioPath).replace(/\\/g, '/'),
      originalFilename: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      durationSeconds: segments.length ? segments[segments.length - 1].end : 0,
    });

    await meeting.save();
    res.status(201).json(serializeMeeting(meeting, req));
  } catch (err) {
    console.error('Upload error:', err);
    if (err?.code === 'invalid_api_key' || err?.status === 401) {
      return res.status(502).json({
        error: 'OpenAI authentication failed. Update OPENAI_API_KEY on the server and try again.',
      });
    }

    res.status(err.statusCode || 500).json({ error: err.message || 'Something went wrong' });
  }
};

exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json(meetings.map((meeting) => serializeMeeting(meeting, req)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid meeting ID' });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json(serializeMeeting(meeting, req));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMeetingSegments = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid meeting ID' });
    }

    const meeting = await Meeting.findById(req.params.id).select('title segments audioPath durationSeconds');
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json({
      _id: meeting._id,
      title: meeting.title,
      durationSeconds: meeting.durationSeconds,
      audioUrl: buildAudioUrl(req, meeting.audioPath),
      segments: meeting.segments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid meeting ID' });
    }

    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    if (meeting.audioPath) {
      const absoluteAudioPath = path.join(__dirname, '..', meeting.audioPath);
      fs.promises.unlink(absoluteAudioPath).catch(() => null);
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchMeetings = async (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q) {
      return res.status(400).json({ error: 'Missing query' });
    }

    const meetings = await Meeting.find({
      $or: [
        { transcript: { $regex: q, $options: 'i' } },
        { summary: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    const matcher = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const results = meetings.map((meeting) => ({
      ...serializeMeeting(meeting, req),
      matches: (meeting.segments || [])
        .filter((segment) => matcher.test(segment.text))
        .slice(0, 5)
        .map((segment) => ({
          start: segment.start,
          end: segment.end,
          timestamp: formatTimestamp(segment.start),
          text: segment.text,
        })),
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.exportMeetingPdf = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid meeting ID' });
    }

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const safeTitle = meeting.title.replace(/[^\w\-]+/g, '-').replace(/^-+|-+$/g, '') || 'meeting';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);

    const doc = new PDFDocument({
      margin: 48,
      size: 'A4',
      info: {
        Title: meeting.title,
        Author: 'SynthMeet',
      },
    });

    doc.pipe(res);

    doc.font('Helvetica-Bold').fontSize(22).fillColor('#2563EB').text(meeting.title);
    doc.moveDown(0.3);
    doc.font('Helvetica').fontSize(10).fillColor('#71717A').text(`Created: ${new Date(meeting.createdAt).toLocaleString()}`);
    doc.moveDown(1.2);

    writeSectionHeading(doc, 'Summary');
    writeParagraph(doc, meeting.summary);

    writeSectionHeading(doc, 'Action Items');
    if (meeting.tasks.length) {
      writeBulletList(doc, meeting.tasks);
    } else {
      writeParagraph(doc, 'No explicit action items were extracted from this meeting.');
    }

    writeSectionHeading(doc, 'Conversation Sections');
    const sections = meeting.sections.length ? meeting.sections : deriveSectionsFromSegments(meeting.segments);
    if (sections.length) {
      sections.forEach((section) => {
        doc.font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#111827')
          .text(`${formatTimestamp(section.start)} - ${formatTimestamp(section.end)}  ${section.title}`);
        writeParagraph(doc, section.overview);
      });
    } else {
      writeParagraph(doc, 'No timestamped sections were available for this meeting.');
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
