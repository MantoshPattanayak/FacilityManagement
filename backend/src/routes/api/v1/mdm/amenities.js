const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const amenities = require("../../../../controllers/"+api_version+"/mdm/amenities.controllers");
let authenticateToken = require('../../../../middlewares/authToken.middlewares');

router.post("/viewAmenitiesList", authenticateToken, amenities.viewAmenitiesList);
router.post("/createAmenity", authenticateToken, amenities.createAmenity);
router.get("/viewAmenityById/:amenityId", authenticateToken, amenities.viewAmenityById);
router.put("/updateAmenity", authenticateToken, amenities.updateAmenity);

module.exports = router;