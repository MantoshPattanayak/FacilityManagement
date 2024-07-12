const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const inventories = require("../../../../controllers/"+api_version+"/mdm/inventories.controllers");
let authenticateToken = require('../../../../middlewares/authToken.middlewares');

router.post("/viewInventoryList", authenticateToken, inventories.viewInventoryList);
router.post("/createInventory", authenticateToken, inventories.createInventory);
router.get("/viewInventoryById/:equipmentId", authenticateToken, inventories.viewInventoryById);
router.put("/updateInventory", authenticateToken, inventories.updateInventory);

module.exports = router;
