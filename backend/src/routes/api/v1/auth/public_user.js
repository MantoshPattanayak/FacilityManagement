const express = require("express");
const router = express.Router();
const api_version = process.env.API_VERSION;
const public_user = require("../../../../controllers/" +
  api_version +
  "/auth/public_user.controller");
router.put("/updatepublic_user", public_user.updatepublic_user);
//router.post("/viewpublic_user", public_user.viewpublic_user); //findAll
router.post("/viewpublicUser", public_user.viewpublicUser); //findOne
router.get("/homePage", public_user.homePage);

module.exports = router;
