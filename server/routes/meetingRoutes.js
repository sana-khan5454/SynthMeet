const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  handleMeetingUpload,
  getAllMeetings,
  getMeetingById,
  deleteMeeting,
} = require('../controllers/meetingController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/', upload.single('audio'), handleMeetingUpload);
router.get('/', getAllMeetings);
router.get('/:id', getMeetingById);
router.delete('/:id', deleteMeeting);

module.exports = router;
