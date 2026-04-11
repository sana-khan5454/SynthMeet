const mongoose = require('mongoose');

let cachedConnection = null;
let cachedPromise = null;
let lastConnectionError = null;

const getDatabaseStatus = () => ({
  isConnected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  lastError: lastConnectionError ? lastConnectionError.message : null,
});

const connectToDatabase = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured.');
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    }).catch((error) => {
      lastConnectionError = error;
      cachedPromise = null;
      throw error;
    });
  }

  cachedConnection = await cachedPromise;
  lastConnectionError = null;
  return cachedConnection;
};

module.exports = connectToDatabase;
module.exports.getDatabaseStatus = getDatabaseStatus;
