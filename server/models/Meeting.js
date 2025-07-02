const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const Meeting = require('../models/Meeting');
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: String,
  transcript: String,
  summary: String,
  tasks: [String],
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
   timeout:60000 ,
  });

exports.handleMeetingUpload = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded." });
    }

    const audioPath = path.join(__dirname, '..', req.file.path);

    // 1. Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
    });

    const transcriptText = transcription.text;

    // 2. Summarize with GPT
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI meeting assistant. Summarize the transcript and extract key action items as bullet points.',
        },
        {
          role: 'user',
          content: transcriptText,
        },
      ],
    });

    const summaryText = gptResponse.choices[0].message.content;

    // 3. Extract tasks from summary
    const tasks = summaryText
      .split('\n')
      .filter(line => line.startsWith('-') || line.startsWith('*'))
      .map(line => line.replace(/^[-]\s/, ''));

    // 4. Save to MongoDB
    const meeting = new Meeting({
      title: req.body.title || 'Untitled Meeting',
      transcript: transcriptText,
      summary: summaryText,
      tasks,
    });

    await meeting.save();
    res.json(meeting);

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};