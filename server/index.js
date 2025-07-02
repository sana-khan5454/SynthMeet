require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const meetingRoutes = require('./routes/meetingRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/meetings', meetingRoutes);
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});


const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Error:', err);
  });
