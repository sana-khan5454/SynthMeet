require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const axiosRetry = require('axios-retry').default; // <- this is the correct way for CommonJS
const { OpenAI } = require('openai');
const Meeting = require('../models/Meeting');
const mongoose = require('mongoose');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,
});

// Enable retry for Axios on 429 errors (Too Many Requests)
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return error.response?.status === 429;
  }
});

// Simple delay function
const delay = (ms) => new Promise(res => setTimeout(res, ms));

exports.handleMeetingUpload = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded." });
    }

    const audioPath = path.join(__dirname, '..', req.file.path);

    // Step 1: Transcribe with Whisper
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath));
    formData.append('model', 'whisper-1');

    const transcriptionResponse = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          ...formData.getHeaders(),
        },
        timeout: 60000,
      }
    );

    const transcriptText = transcriptionResponse.data.text;

    // Optional cooldown to avoid hitting GPT limits
    await delay(1000);

    // Step 2: Summarize with GPT
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

    // Step 3: Extract tasks
    const tasks = summaryText
      .split('\n')
      .filter(line => line.startsWith('-') || line.startsWith('*'))
      .map(line => line.replace(/^[-*]\s/, ''));

    // Step 4: Save to MongoDB
    const meeting = new Meeting({
      title: req.body.title || 'Untitled Meeting',
      transcript: transcriptText,
      summary: summaryText,
      tasks,
    });

    await meeting.save();
    res.json(meeting);

  } catch (err) {
    console.error('Upload error:', err.message || err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
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

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
