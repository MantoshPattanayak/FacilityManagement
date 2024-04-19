const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const resource = require("../../../../controllers/" +
  api_version +
  "/configuration/resource.controller");
router.get("/resourceId", resource.resourceId);
router.post("/createResource", resource.createResource);
router.put("/updateResource/:id", resource.updateResource);
router.post("/viewResources", resource.viewResources);
module.exports = router;