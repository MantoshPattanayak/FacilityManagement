const express = require('express');
const passport = require('passport');
const router = express.Router();

const api_version = process.env.API_VERSION
const eventsController = require('../../../../controllers/'+api_version+'/activity/reviewEventBooking.controller');

let authenticateToken = require('../../../../middlewares/authToken.middlewares')
router.post('/viewList',authenticateToken, eventsController.viewList);

router.get('/viewId/:eventId', authenticateToken,eventsController.viewId);

router.put('/performAction/:eventId',authenticateToken, eventsController.performAction);

module.exports = router;