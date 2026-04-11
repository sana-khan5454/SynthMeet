const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getUploadsDirectory } = require('../lib/uploads');
const {
  handleMeetingUpload,
  getAllMeetings,
  getMeetingById,
  deleteMeeting,
  searchMeetings,
  getMeetingSegments,
  exportMeetingPdf,
} = require('../controllers/meetingController');

const allowedMimeTypes = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/webm',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/ogg',
  'audio/flac',
  'audio/x-flac',
  'audio/mpga',
  'video/webm',
  'application/octet-stream',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, getUploadsDirectory()),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^\w.\-() ]+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.has(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
      return;
    }

    cb(new Error('Unsupported audio format. Please upload MP3, WAV, M4A, OGG, FLAC, MP4, or WEBM audio.'));
  },
});

router.post('/', upload.single('audio'), handleMeetingUpload);
router.get('/', getAllMeetings);
router.get('/search', searchMeetings);
router.get('/:id/segments', getMeetingSegments);
router.get('/:id/export/pdf', exportMeetingPdf);
router.get('/:id', getMeetingById);
router.delete('/:id', deleteMeeting);

module.exports = router;
