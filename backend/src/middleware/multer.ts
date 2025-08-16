import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads')); // Uploads to the 'uploads' directory in the backend root
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export default upload;
