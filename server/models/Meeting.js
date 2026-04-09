
const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema(
  {
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    overview: { type: String, required: true },
  },
  { _id: false }
);

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  transcript: { type: String, required: true },
  summary: { type: String, required: true },
  tasks: { type: [String], default: [] },
  segments: { type: [segmentSchema], default: [] },
  sections: { type: [sectionSchema], default: [] },
  audioPath: { type: String, required: true },
  originalFilename: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  durationSeconds: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);

