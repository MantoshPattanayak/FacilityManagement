const express = require("express");
const router = express.Router();
const api_version = process.env.API_VERSION;
const grievanceController = require("../../../../controllers/" + api_version + "/activity/grievance.controller");

//user submit grievance
router.post('/submit-grievance', grievanceController.addGrievance);

// view grievance list
router.post('/viewgrievancelist', grievanceController.viewGrievanceList);
// view grievance by id
router.get('/viewgrievance/:grievanceId', grievanceController.viewGrievanceById);
// create feedack
router.post("/createFeedback", grievanceController.createFeedback); 
module.exports = router;