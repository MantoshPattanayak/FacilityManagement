const express = require('express');
const passport = require('passport');
const router = express.Router();
const api_version = process.env.API_VERSION;

const publicNotificationsController = require('../../../../controllers/'+api_version+'/activity/publicnotifications.controller');
let authenticateToken = require('../../../../middlewares/authToken.middlewares')
router.post('/add', authenticateToken, publicNotificationsController.addNewNotification);
router.post('/viewList',authenticateToken, publicNotificationsController.viewNotifications);
router.put('/edit',authenticateToken, publicNotificationsController.editNotification);
router.get('/view/:notificationId', authenticateToken, publicNotificationsController.viewNotificationById);

module.exports = router;