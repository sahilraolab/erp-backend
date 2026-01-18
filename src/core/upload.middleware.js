// src/core/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_BASE = process.env.UPLOAD_DIR || 'uploads';

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(UPLOAD_BASE, folder);
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const safeName = file.originalname
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');

      const name = `${Date.now()}-${Math.round(
        Math.random() * 1e6
      )}-${safeName}`;

      cb(null, name);
    }
  });

const upload = (
  folder,
  {
    maxSizeMB = 10,
    allowedTypes = []
  } = {}
) =>
  multer({
    storage: storage(folder),
    limits: {
      fileSize: maxSizeMB * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      if (
        allowedTypes.length &&
        !allowedTypes.includes(file.mimetype)
      ) {
        return cb(
          new Error('Invalid file type'),
          false
        );
      }
      cb(null, true);
    }
  });

module.exports = upload;