const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const hosteventdetails = require("../../../../controllers/" +
  api_version +
  "/configuration/hosteventdetails.controller");
router.post("/createHosteventdetails", hosteventdetails.createHosteventdetails);
router.get("/bankService", hosteventdetails.bankService);
router.get("/eventDropdown", hosteventdetails.eventDropdownData);

module.exports = router;
