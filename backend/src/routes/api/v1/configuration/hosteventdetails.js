const express = require("express");
const { eventUpload } = require("../../../../middlewares/multer.middleware");
const router = express.Router();
let api_version = process.env.API_VERSION;
let authenticateToken = require('../../../../middlewares/authToken.middlewares')
const hosteventdetails = require("../../../../controllers/" +
  api_version +
  "/configuration/hosteventdetails.controller");
router.post("/createHosteventdetails",eventUpload.fields([
  { name: 'eventImage', maxCount: 1 },
  { name: 'additionalFile', maxCount: Infinity }]),authenticateToken, hosteventdetails.createHosteventdetails);

router.get("/bankService",authenticateToken, hosteventdetails.bankService);
router.get("/eventDropdown", authenticateToken,hosteventdetails.eventDropdownData);
router.get("/findEventHostDetailsData", hosteventdetails.findEventHostDetailsData);


module.exports = router;
