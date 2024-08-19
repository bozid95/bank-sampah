import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter file berdasarkan tipe
const fileFilter = (req, file, cb) => {
  const filetypes = /xlsx||xls/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  const error = new Error("File type not supported");
  error.status = 400;
  cb(error, false);
};

// Middleware untuk menangani error dari Multer
const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
  next();
};

// Inisialisasi Multer dengan konfigurasi penyimpanan dan filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Batas ukuran file 5MB
});

export { upload, errorHandler };
