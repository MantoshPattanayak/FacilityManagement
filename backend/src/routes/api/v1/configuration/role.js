const express = require("express");
const { rolemaster } = require("../../../../models");
const router = express.Router();
let api_version = process.env.API_VERSION;
let authenticateToken = require('../../../../middlewares/authToken.middlewares')
let role = require("../../../../controllers/" +
  api_version +
  "/configuration/role.controller");

router.get("/roleId/:roleId",authenticateToken, role.roleId);
router.put("/updateRole",authenticateToken, role.updateRole);
router.post("/createRole", authenticateToken,role.createRole);
router.post("/viewRole", authenticateToken,role.viewRole);

module.exports = router;
