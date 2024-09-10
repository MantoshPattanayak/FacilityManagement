const express = require('express');
const router = express.Router();
let api_version = process.env.API_VERSION;

let facilities = require('../../../../controllers/'+api_version+'/configuration/facilities.controllers')
let authenticateToken = require('../../../../middlewares/authToken.middlewares')

let rateLimitMiddleware = require('../../../../middlewares/rateLimiter.middlewares')

router.post('/displayMapData',facilities.displayMapData)  

router.get('/searchParkFacilities',facilities.searchParkFacilities)

router.post('/viewParkDetails',rateLimitMiddleware,facilities.viewParkDetails)

router.get('/viewParkById/:facilityId',facilities.viewParkById)


router.post('/nearByDataInMap',facilities.nearByDataInMap)

router.get('/filterList', facilities.facilityFilterOption)

router.post('/findOverallSearch', facilities.findOverallSearch)

router.post('/autoSuggestionForOverallSearch', facilities.autoSuggestionForOverallSearch)
module.exports = router