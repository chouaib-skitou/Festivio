const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/images');
    cb(null, uploadPath); // Destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
