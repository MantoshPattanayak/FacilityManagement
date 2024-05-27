const express = require("express");
const {userUpload} = require("../../../../middlewares/multer.middleware");
const router = express.Router();
let api_version = process.env.API_VERSION;
const grievance = require("../../../../controllers/" +
  api_version +
  "/configuration/grievance.controller");
router.post("/creategrievance",userUpload.fields([
  { name: 'filepath', maxCount: 1 }]),grievance.createGrievance);

module.exports = router;
