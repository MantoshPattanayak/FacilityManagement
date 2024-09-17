const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const facilityStaff = require("../../../../controllers/"+api_version+"/mdm/facilitystaff.controllers");
let authenticateToken = require('../../../../middlewares/authToken.middlewares');

router.get("/initialData", authenticateToken, facilityStaff.intialData);
router.post("/createFacilityStaffAllocation", authenticateToken, facilityStaff.createFacilityStaffAllocation);
router.post("/updateFacilityStaffAllocation", authenticateToken, facilityStaff.updateFacilityStaffAllocation);
router.post("/uploadStaffAttendance", authenticateToken, facilityStaff.uploadStaffAttendance);
router.post("/viewStaffAllocation", authenticateToken, facilityStaff.viewStaffAllocation);
router.post("/viewStaffAllocationById/:id", authenticateToken, facilityStaff.viewStaffAllocationById);
router.post("/viewStaffAttendanceData", authenticateToken, facilityStaff.viewStaffAttendanceData);
router.post("/checkinAttendance", authenticateToken, facilityStaff.checkinAttendance);
router.post("/checkoutAttendance", authenticateToken, facilityStaff.checkoutAttendance);
module.exports = router;