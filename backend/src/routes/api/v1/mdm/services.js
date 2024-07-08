const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const services = require("../../../../controllers/"+api_version+"/mdm/services.controllers");
let authenticateToken = require('../../../../middlewares/authToken.middlewares');

router.post("/viewServicesList/", authenticateToken, services.viewServicesList);
router.post("/createService", authenticateToken, services.createService);
router.get("/viewServiceById/:serviceId", authenticateToken, services.viewServiceById);
router.put("/updateService", authenticateToken, services.updateService);

module.exports = router;
