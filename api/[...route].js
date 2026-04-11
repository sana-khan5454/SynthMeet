const app = require('../server/app');
const connectToDatabase = require('../server/lib/connectToDatabase');

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Vercel API bootstrap error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to initialize the API runtime.',
    });
  }
};
