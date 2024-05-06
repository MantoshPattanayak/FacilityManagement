const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const eventactivites = require("../../../../controllers/" +
  api_version +
  "/configuration/eventactivities.controller");
router.post("/viewEventactivities", eventactivites.viewEventactivities);
module.exports = router;
