const { sequelize, Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const bcrypt = require('bcrypt')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const { encrypt } = require('../../../middlewares/encryption.middlewares')
const publicNotifications = db.publicnotifications;

let addNewNotification = async (req, res) => {
    try{
        let { notificationTitle, notificationContent, validFromDate, validToDate } = req.body;
        let userId = req.user?.id || 1;

        let addNotification = await publicNotifications.create({
            publicNotificationsTitle: notificationTitle,
            publicNotificationsContent: notificationContent,
            validFromDate: validFromDate,
            validToDate: validToDate,
            createdBy: userId,
            createdOn: new Date()
        })

        console.log(addNewNotification);
        res.status(statusCode.SUCCESS.code).json({
            message: 'New public notification added successfully!',
            data: addNotification
        })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let viewNotifications = async (req, res) => {
    try {
        let viewNotificationsListQuery = `
        select
            *
        from amabhoomi.publicnotifications p
        where validFromDate <= ?
        and validToDate >= ?
        `;

        let viewNotificationsListQueryData = await sequelize.query(viewNotificationsListQuery, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [ new Date(), new Date() ]
        })

        console.log("viewNotificationsList", viewNotificationsListQueryData);

        res.status(statusCode.SUCCESS.code).json({
            message: 'List of public notifications',
            viewNotificationsListQueryData
        })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:error.message
        })
    }
}

module.exports = {
    addNewNotification,
    viewNotifications
}