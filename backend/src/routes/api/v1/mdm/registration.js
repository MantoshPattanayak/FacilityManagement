const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const registration = require("../../../../controllers/"+api_version+"/mdm/registration.controllers");

router.post("/facilityRegistration", registration.registerFacility);


module.exports = router;
