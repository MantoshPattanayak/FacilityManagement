const express = require("express");
const router = express.Router();
const api_version = process.env.API_VERSION;
const grievanceController = require("../../../../controllers/" + api_version + "/activity/grievance.controller");
const {userUpload} = require("../../../../middlewares/multer.middleware");

//user submit grievance
router.post('/submit-grievance', userUpload.fields([{ name: 'filepath', maxCount: 1 }]), grievanceController.addGrievance);

router.get('/initial-data', grievanceController.fetchInitialData);      // no use of authentication token

// view grievance list
router.post('/viewgrievancelist', grievanceController.viewGrievanceList);
// view grievance by id
router.get('/viewgrievance/:grievanceId', grievanceController.viewGrievanceById);
//action taken against grievance
router.post('/action-grievance', grievanceController.actionTaken);
// create feedack
router.post("/createFeedback", grievanceController.createFeedback); 
module.exports = router;