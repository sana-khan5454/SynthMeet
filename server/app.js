require('dotenv').config();
const express = require('express');
const cors = require('cors');
const meetingRoutes = require('./routes/meetingRoutes');
const { getUploadsDirectory } = require('./lib/uploads');
const { getDatabaseStatus } = require('./lib/connectToDatabase');

const app = express();
const uploadsPath = getUploadsDirectory();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(cors({
  origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : true,
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));
app.use('/api/uploads', express.static(uploadsPath));
app.get('/api/health', (req, res) => {
  const dbStatus = getDatabaseStatus();
  const openAiConfigured = Boolean(process.env.OPENAI_API_KEY);

  res.status(dbStatus.isConnected ? 200 : 503).json({
    status: dbStatus.isConnected ? 'ok' : 'degraded',
    database: dbStatus,
    services: {
      openaiConfigured: openAiConfigured,
    },
  });
});
app.use('/api/meetings', meetingRoutes);
app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  if (err) {
    return res.status(400).json({ error: err.message || 'Request failed' });
  }

  next();
});

module.exports = app;
