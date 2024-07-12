const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const eventcategories = require("../../../../controllers/"+api_version+"/mdm/eventcategories.controllers");
let authenticateToken = require('../../../../middlewares/authToken.middlewares');

router.post("/viewEventCategoriesList", authenticateToken, eventcategories.viewEventCategoriesList);
router.post("/createEventCategory", authenticateToken, eventcategories.createEventCategory);
router.get("/viewEventCategoryById/:eventCategoryId", authenticateToken, eventcategories.viewEventCategoryById);
router.put("/updateEventCategory", authenticateToken, eventcategories.updateEventCategory);

module.exports = router;