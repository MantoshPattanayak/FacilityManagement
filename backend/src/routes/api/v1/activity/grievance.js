const express = require("express");
const router = express.Router();
const api_version = process.env.API_VERSION;
const grievanceController = require("../../../../controllers/" + api_version + "/activity/grievance.controller");

//user submit grievance
router.post('/submit-grievance', grievanceController.addGrievance);

module.exports = router;