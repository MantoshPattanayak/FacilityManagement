const multer = require('multer');
let dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const fs = require('fs')

const storage = multer.memoryStorage();

const upload = multer({ storage: storage, 
  limits: { fileSize: process.env.MAX_FILE_SIZE || '200KB' } 
});




module.exports = { upload };