const express = require('express');
const passport = require('passport');
const router = express.Router();

const api_version = process.env.API_VERSION
const reportsController = require('../../../../controllers/'+api_version+'/reports/reports.controller');

router.get('/bookingDataPerPark', reportsController.bookingDataPerPark);

module.exports = router;