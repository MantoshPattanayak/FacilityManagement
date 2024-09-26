const express = require("express");
const router = express.Router();
const api_version = process.env.API_VERSION;
const grievanceController = require("../../../../controllers/" + api_version + "/activity/grievance.controller");
const {userUpload} = require("../../../../middlewares/multer.middleware");
let authenticateToken = require('../../../../middlewares/authToken.middlewares')
//user submit grievance
router.post('/submit-grievance', grievanceController.addGrievance);

router.get('/initial-data', grievanceController.fetchInitialData);      // no use of authentication token

// view grievance list
router.post('/viewgrievancelist', authenticateToken, grievanceController.viewGrievanceList);
// view grievance by id
router.post('/viewgrievance/:grievanceId', authenticateToken,grievanceController.viewGrievanceById);
//action taken against grievance
router.post('/action-grievance',authenticateToken, grievanceController.actionTaken);
// create feedack
router.post("/createFeedback", grievanceController.createFeedback);

//view feedback list - start
router.post("/viewfeedbacklist", authenticateToken, grievanceController.viewFeedbackList);
//view feedback list - end
// view feedback by id - start
router.get("/viewfeedback/:feedbackId", authenticateToken, grievanceController.viewFeedbackById);
// view feedback by id - end
router.post("/createFeedback", grievanceController.createFeedback); 

router.post("/contactUs",grievanceController.contactRequest)
// advertisement

router.post("/advertisementTariffInsert",authenticateToken,grievanceController.advertisementTariffInsert)

router.post("/advertisementMasterInsert", authenticateToken,grievanceController.advertisementMasterInsert)

router.post("/viewAdvertisementMaster", authenticateToken,grievanceController.viewAdvertisementMaster)

router.post("/viewAdvertisementTariffData", authenticateToken,grievanceController.viewAdvertisementTariffData)


router.put("/updateAdvertisementTariffData", authenticateToken, grievanceController.updateAdvertisementTariffData)

router.put("/updateAdvertisementInsert", authenticateToken, grievanceController.updateAdvertisementInsert)

router.post("/initialTariffDropdownData", authenticateToken, grievanceController.initialTariffDropdownData)

router.post("/insertToAdvertisementDetails", authenticateToken, grievanceController.insertToAdvertisementDetails)

router.put("/actionForAdvertisement", authenticateToken, grievanceController.actionForAdvertisement)


// advertisement

module.exports = router;