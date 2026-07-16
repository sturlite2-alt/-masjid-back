import { Router } from 'express';
import { login, register, getMe } from '../controllers/AuthController';
import {
  getTodayTiming,
  getTimingsByDate,
  getAllTimings,
  createOrUpdateTiming,
  deleteTiming,
  bulkImportTimings,
} from '../controllers/PrayerController';
import {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/AnnouncementController';
import {
  getActiveHadith,
  getAllHadiths,
  createHadith,
  updateHadith,
  deleteHadith,
  activateHadith,
} from '../controllers/HadithController';
import {
  getCharityDetails,
  updateCharityDetails,
} from '../controllers/CharityController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/ArabicClassController';
import {
  getContactInfo,
  updateContactInfo,
} from '../controllers/ContactInfoController';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);

// --- Prayer Timings Routes ---
router.get('/prayers/today', getTodayTiming);
router.get('/prayers/search', getTimingsByDate);
router.get('/prayers', getAllTimings);
router.post('/prayers', protect, createOrUpdateTiming);
router.delete('/prayers/:id', protect, deleteTiming);
router.post('/prayers/bulk', protect, upload.single('file'), bulkImportTimings);

// --- Announcements Routes ---
router.get('/announcements/active', getActiveAnnouncements);
router.get('/announcements', getAllAnnouncements); // Public or admin
router.post('/announcements', protect, createAnnouncement);
router.put('/announcements/:id', protect, updateAnnouncement);
router.delete('/announcements/:id', protect, deleteAnnouncement);

// --- Hadith Routes ---
router.get('/hadiths/active', getActiveHadith);
router.get('/hadiths', getAllHadiths);
router.post('/hadiths', protect, createHadith);
router.put('/hadiths/:id', protect, updateHadith);
router.delete('/hadiths/:id', protect, deleteHadith);
router.post('/hadiths/:id/activate', protect, activateHadith);

// --- Charity Routes ---
router.get('/charity', getCharityDetails);
router.post('/charity', protect, upload.single('qrImage'), updateCharityDetails);

// --- Arabic Classes (Blog) Routes ---
router.get('/classes', getAllClasses);
router.post('/classes', protect, createClass);
router.put('/classes/:id', protect, updateClass);
router.delete('/classes/:id', protect, deleteClass);

// --- Contact details Routes ---
router.get('/contact', getContactInfo);
router.post('/contact', protect, updateContactInfo);

export default router;
