const express = require("express");
const router = express.Router();
const api_version = process.env.API_VERSION;
const faqcontroller = require("../../../../controllers/" +
  api_version +
  "/activity/faq.controller");

router.post("/createFaq", faqcontroller.createFaq);
module.exports = router;
