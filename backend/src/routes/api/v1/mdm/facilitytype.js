const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const facilityTypes = require("../../../../controllers/"+api_version+"/mdm/facilitytypes.controllers");
let authenticateToken = require('../../../../middlewares/authToken.middlewares');

router.post("/viewFacilityTypeList", authenticateToken, facilityTypes.viewFacilityTypeList);
router.post("/createFacilityType", authenticateToken, facilityTypes.createFacilityType);
router.get("/viewFacilityTypeById/:equipmentId", authenticateToken, facilityTypes.viewFacilityTypeById);
router.put("/updateFacilityType", authenticateToken, facilityTypes.updateFacilityType);

module.exports = router;
