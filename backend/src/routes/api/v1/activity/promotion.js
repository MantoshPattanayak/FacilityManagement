const express = require("express");
const router = express.Router();
const api_version = process.env.API_VERSION;
const { promotionUpload } = require("../../../../middlewares/multer.middleware");
const promotionController = require("../../../../controllers/" + api_version + "/activity/promotion.controller");

router.post("/createPromotion",promotionUpload.fields([
    { name: 'imageUrl', maxCount: 1 }]),promotionController.createPromotion); 
router.post("/updatePromotion",promotionUpload.fields([
    { name: 'imageUrl', maxCount: 1 }]),promotionController.updatePromotion)
router.get('/fetchdata', promotionController. fetchData); 
module.exports = router;