const express = require('express');
const passport = require('passport');
const router = express.Router();
const api_version = process.env.API_VERSION;

const publicNotificationsController = require('../../../../controllers/'+api_version+'/activity/publicnotifications.controller');

router.post('/add', publicNotificationsController.addNewNotification);
router.post('/viewList', publicNotificationsController.viewNotifications);

module.exports = router;