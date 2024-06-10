const express = require("express");
const { eventUpload } = require("../../../../middlewares/multer.middleware");
const router = express.Router();
let api_version = process.env.API_VERSION;
const hosteventdetails = require("../../../../controllers/" +
  api_version +
  "/configuration/hosteventdetails.controller");
router.post("/createHosteventdetails",eventUpload.fields([
  { name: 'eventImage', maxCount: 1 },
  { name: 'additionalFile', maxCount: Infinity }]), hosteventdetails.createHosteventdetails);

router.get("/bankService", hosteventdetails.bankService);
router.get("/eventDropdown", hosteventdetails.eventDropdownData);
router.get("/findEventHostDetailsData", hosteventdetails.findEventHostDetailsData);


module.exports = router;
