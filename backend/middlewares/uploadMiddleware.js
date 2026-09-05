const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const uploadPath = path.join(__dirname, '../public/images');
fs.mkdirSync(uploadPath, { recursive: true });

const allowedImageTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadPath);
  },
  filename: (_req, file, callback) => {
    const extension = allowedImageTypes.get(file.mimetype) || '';
    callback(null, `image-${crypto.randomUUID()}${extension}`);
  },
});

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
  storage,
  fileFilter,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
