const multer = require('multer');
const path = require('path');

// STORAGE_DRIVER=local  -> saves to backend/uploads (old behavior, for local dev)
// STORAGE_DRIVER=supabase (or unset) -> keeps file in memory, controller uploads it to Supabase Storage
const driver = process.env.STORAGE_DRIVER || 'supabase';

const storage = driver === 'local'
    ? multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/'),
        filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
    })
    : multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;