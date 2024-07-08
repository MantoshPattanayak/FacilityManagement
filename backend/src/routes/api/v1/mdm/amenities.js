const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const services = require("../../../../controllers/"+api_version+"/mdm/services.controllers");
let authenticateToken = require('../../../../middlewares/authToken.middlewares');

router.post("/viewAmenitiesList", authenticateToken, services.viewAmenitiesList);
router.post("/createAmenity", authenticateToken, services.createAmenity);
router.get("/viewAmenityById/:amenityId", authenticateToken, services.viewAmenityById);
router.put("/updateAmenity", authenticateToken, services.updateAmenity);

module.exports = router;