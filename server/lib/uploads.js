const fs = require('fs');
const os = require('os');
const path = require('path');

const uploadsDirectory = process.env.VERCEL
  ? path.join(os.tmpdir(), 'synthmeet-uploads')
  : path.join(__dirname, '..', 'uploads');

const getUploadsDirectory = () => {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
  return uploadsDirectory;
};

module.exports = {
  getUploadsDirectory,
};
