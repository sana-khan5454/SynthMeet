
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: String,
  transcript: String,
  summary: String,
  tasks: [String],
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);

