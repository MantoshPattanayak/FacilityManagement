const express = require("express");
const router = express.Router();
let api_version = process.env.API_VERSION;
const tariffData = require("../../../../controllers/"+api_version+"/mdm/tariff.controllers.js");

let authenticateToken = require('../../../../middlewares/authToken.middlewares')
router.post("/createTariff",authenticateToken, tariffData.createTariff);

router.post("/getTariffById", authenticateToken,tariffData.getTariffById);

router.put("/updateTariff", authenticateToken,tariffData.updateTariff);

router.post("/viewTariff", authenticateToken,tariffData.viewTariff);

router.post("/initialDataForTariffSelectionWRTCategory", authenticateToken,tariffData.initialDataForTariffSelectionWRTCategory);

router.post("/inActiveEachTariffData", authenticateToken,tariffData.inActiveEachTariffData);

module.exports = router;
