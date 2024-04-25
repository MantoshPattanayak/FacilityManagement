const express = require('express');
const router = express.Router();
let api_version = process.env.API_VERSION;

let facilities = require('../../../../controllers/'+api_version+'/configuration/facilities.controllers')

router.post('/displayMapData',facilities.displayMapData)  

router.get('/searchParkFacilities',facilities.searchParkFacilities)

router.post('/viewParkDetails',facilities.viewParkDetails)

router.get('/viewParkById/:facilityId',facilities.viewParkById)

module.exports = router