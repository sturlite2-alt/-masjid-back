import multer from 'multer';

// Set up memory storage to process uploads directly in memory without disk writes
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype.startsWith('image/') // Accept images for QR code uploads
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel sheets (.xls, .xlsx) or images are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
