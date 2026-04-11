require('dotenv').config();
const app = require('./app');
const connectToDatabase = require('./lib/connectToDatabase');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectToDatabase()
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('MongoDB Error:', err.message);
    console.warn('API started in degraded mode. Configure MONGO_URI to enable meeting features.');
  });
