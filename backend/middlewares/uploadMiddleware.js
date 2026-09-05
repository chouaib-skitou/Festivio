const multer = require('multer');

const allowedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const fileFilter = (_req, file, callback) => {
  if (allowedImageTypes.has(file.mimetype)) {
    callback(null, true);
    return;
  }

  const error = new Error('Only JPEG, PNG and WebP images are allowed');
  error.status = 400;
  callback(error);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
