const express = require("express");
const { rolemaster } = require("../../../../models");
const router = express.Router();
let api_version = process.env.API_VERSION;

let role = require("../../../../controllers/" +
  api_version +
  "/configuration/role.controller");

router.get("/roleId", role.roleId);
router.put("/update-profile/:id", role.updateRole);
router.post("/createRole", role.createRole);
router.post("/viewRole", role.viewRole);

module.exports = router;
