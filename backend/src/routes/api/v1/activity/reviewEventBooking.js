const express = require('express');
const passport = require('passport');
const router = express.Router();

const api_version = process.env.API_VERSION
const eventsController = require('../../../../controllers/'+api_version+'/activity/reviewEventBooking.controller');


router.post('/viewList', eventsController.viewList);

router.get('/viewId/:eventId', eventsController.viewId);

router.put('/performAction/:eventId', eventsController.performAction);

module.exports = router;