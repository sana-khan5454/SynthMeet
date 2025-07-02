require('dotenv').config();
const axios=require('axios');
const FormData=require('form-data');
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


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Error:', err);
  });