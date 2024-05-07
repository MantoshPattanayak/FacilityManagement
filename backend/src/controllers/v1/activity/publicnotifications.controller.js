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

        if(notificationTitle == '' || notificationContent == '' || validFromDate == '' || validToDate == '' || notificationTitle == null || notificationContent == null || validFromDate == null || validToDate == null){
            res.status(statusCode.BAD_REQUEST.code).json({
                message: 'Please enter all required fields.'
            })
        }

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
        let limit = req.body.page_size ? req.body.page_size : 100;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null;

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
        });

        console.log('viewNotificationsListQueryData', viewNotificationsListQueryData);

        if(givenReq) {
            viewNotificationsListQueryData = viewNotificationsListQueryData.filter(
              (notificationData) =>
                notificationData.publicNotificationsTitle.toLowerCase().includes(givenReq) ||
                notificationData.publicNotificationsContent.toLowerCase().includes(givenReq)
            );
        }

        let paginatedviewNotificationsListQueryData = viewNotificationsListQueryData.slice(
            offset,
            limit + offset
        );

        console.log("viewNotificationsList", paginatedviewNotificationsListQueryData);

        res.status(statusCode.SUCCESS.code).json({
            message: 'List of public notifications',
            paginatedviewNotificationsListQueryData
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