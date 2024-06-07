const express = require("express");
const router = express.Router();
const api_version = process.env.API_VERSION;
const promotionController = require("../../../../controllers/" + api_version + "/activity/promotion.controller");
router.post("/createPromotion", promotionController.createPromotion); 
module.exports = router;