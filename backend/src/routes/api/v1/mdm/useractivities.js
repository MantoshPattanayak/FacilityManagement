const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const userActivities = require("../../../../controllers/"+api_version+"/mdm/useractivities.controllers");
let authenticateToken = require('../../../../middlewares/authToken.middlewares');

router.post("/viewUserActivitiesList", authenticateToken, userActivities.viewUserActivitiesList);
router.post("/createUserActivity", authenticateToken, userActivities.createUserActivity);
router.get("/viewUserActivityById/:userActivityId", authenticateToken, userActivities.viewUserActivityById);
router.put("/updateUserActivity", authenticateToken, userActivities.updateUserActivity);

module.exports = router;