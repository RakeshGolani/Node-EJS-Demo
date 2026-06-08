const fs = require('fs');
const path = require('path');
require('dotenv').config();

const moveUploadedFile = async (file, targetRoot = 'admin', userId, fieldname = 'profile') => {
    if (!file || !userId) return null;

    const oldPath = file.path;
    const newDir = path.join('storage', targetRoot, `${userId}`, fieldname);
    fs.mkdirSync(newDir, { recursive: true });

    const newPath = path.join(newDir, file.filename);
    fs.renameSync(oldPath, newPath);

    // Convert system path to public URL (e.g., /admin/storage/...)
    const rawPath = newPath.replace(/\\/g, '/');
    const publicPath = rawPath.replace('storage', '/admin/storage');

    return publicPath;
};

const deleteFile = async (filePath) => {
    if (!filePath) return null;

    // If filePath is a URL (starts with http), strip domain
    const baseUrl = process.env.APP_URL || 'http://localhost:5000';
    let localPath = filePath;

    if (filePath.startsWith(baseUrl)) {
        localPath = filePath.replace(baseUrl, '');
    }

    // Remove "/admin" prefix if you serve files from `/admin/storage`
    localPath = localPath.replace(/^\/admin/, '');

    // Construct actual file system path
    const absolutePath = path.join(__dirname, '..', localPath); // adjust as needed
    console.log('Unlinking File:', absolutePath);

    try {
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log('File deleted successfully');
        } else {
            console.log('File does not exist');
        }
    } catch (err) {
        console.error('Error deleting file:', err);
    }
};

module.exports = { moveUploadedFile, deleteFile };