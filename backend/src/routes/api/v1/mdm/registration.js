const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const registration = require("../../../../controllers/"+api_version+"/mdm/registration.controllers");

let authenticateToken = require('../../../../middlewares/authToken.middlewares')
router.post("/facilityRegistration",authenticateToken, registration.registerFacility);

router.get("/initialData", authenticateToken,registration.initialDataFetch);

router.post("/getFacilityWrtId", authenticateToken,registration.getFacilityWrtId);

module.exports = router;
