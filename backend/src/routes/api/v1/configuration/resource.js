const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
let authenticateToken = require('../../../../middlewares/authToken.middlewares')
const resource = require("../../../../controllers/" +
  api_version +
  "/configuration/resource.controller");
router.get("/resourceId/:id",authenticateToken, resource.resourceId);
router.post("/createResource", authenticateToken,resource.createResource);
router.put("/updateResource",authenticateToken, resource.updateResource);
router.post("/viewResources", authenticateToken,resource.viewResources);
router.get("/dataLoadResource",authenticateToken, resource.dataLoadResource);
router.get("/isParent",authenticateToken, resource.isParent);

module.exports = router;
