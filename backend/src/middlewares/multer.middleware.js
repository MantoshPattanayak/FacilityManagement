const multer = require('multer');
let dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const fs = require('fs')

const eventStorage = multer.memoryStorage();
const userStorage = multer.memoryStorage();

const eventUpload = multer({ storage: eventStorage, 
  limits: { fileSize: process.env.MAX_FILE_SIZE || '200KB' } 
});
const userUpload = multer({storage: userStorage, 
  limits: { fileSize: process.env.MAX_FILE_SIZE || '200KB' } 
});

module.exports = { eventUpload, userUpload };