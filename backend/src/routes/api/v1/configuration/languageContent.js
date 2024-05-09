const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const languageContentController = require("../../../../controllers/" + api_version + "/configuration/languageContent.controllers");

router.post('/view', languageContentController.viewLanguageContent);
router.post('/add', languageContentController.insertLanguageContent);

module.exports = router;