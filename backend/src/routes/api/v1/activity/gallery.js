const express = require("express");
const router = express.Router();
const api_version = process.env.API_VERSION;
const galleryController = require("../../../../controllers/" + api_version + "/activity/gallery.controller");
const authenticationToken = require('../../../../middlewares/authToken.middlewares');

router.post("/insertNewGalleryRecord", authenticationToken, galleryController.insertNewGalleryRecord);
router.post("/fetchGalleryList", galleryController.fetchGalleryList);
router.put("/updateGalleryRecord", authenticationToken, galleryController.updateGalleryRecord);
router.get("/fetchGalleryList/:galleryId", authenticationToken, galleryController.fetchGalleryById);

module.exports = router;