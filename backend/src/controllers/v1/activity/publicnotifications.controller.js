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

        console.log(addNotification);
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
        let currentDate = new Date(req.body.currentDate);

        let viewNotificationsListQueryData;

        if(currentDate){
            viewNotificationsListQueryData = await sequelize.query(`
            select * from amabhoomi.publicnotifications p`, {
                type: Sequelize.QueryTypes.SELECT,
            });
        }
        else {
            viewNotificationsListQueryData = await sequelize.query(`
            select * from amabhoomi.publicnotifications p `, {
                type: Sequelize.QueryTypes.SELECT,
            });
        }
        
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

let viewNotificationById = async (req, res) => {
    try{
        let notificationId = req.params.notificationId;

        let notificationDetails = await publicNotifications.findOne({
            where: {
                publicNotificationsId: notificationId
            }
        });

        if(notificationDetails){
            res.status(statusCode.SUCCESS.code).json({
                message: 'Notification details',
                notificationDetails
            });
        }
        else{
            res.status(statusCode.NOTFOUND.code).json({
                message: 'Notification details not found',
                notificationDetails
            });
        }
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let editNotification = async (req, res) => {
    try{
        let { notificationTitle, notificationContent, validFromDate, validToDate, publicNotificationsId } = req.body;
        let userId = req.user?.id || 1;

        console.log({ notificationTitle, notificationContent, validFromDate, validToDate, publicNotificationsId });

        let notificationDetails = await publicNotifications.findOne({
            where: {
                publicNotificationsId: publicNotificationsId
            }
        });
        console.log('found notification', notificationDetails);

        let params = {};

        // check which paramaters value is modified, and accordingly update that column data for the record
        if((!notificationTitle == '' || !notificationTitle == null) && notificationDetails.publicNotificationsTitle !== notificationTitle){
            params.publicNotificationsTitle = notificationTitle;
        }
        if((!notificationContent == '' || !notificationContent == null) && notificationDetails.publicNotificationsContent !== notificationContent){
            params.publicNotificationsContent = notificationContent;
        }
        if((!validFromDate == '' || !validFromDate == null) && new Date(notificationDetails.validFromDate).getTime() !== new Date(validFromDate).getTime()){
            params.validFromDate = validFromDate;
        }
        if((!validToDate == '' || !validToDate == null) && new Date(notificationDetails.validToDate).getTime() !== new Date(validToDate).getTime()){
            params.validToDate = validToDate;
        }

        console.log('params', params);

        if(Object.keys(params).length == 0){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: 'No changes detected.'
            })
        }

        params.updatedBy = userId;
        params.updatedOn = new Date();

        

        let [numberOfUpdatedRows] = await publicNotifications.update(params, {
                where: {
                    publicNotificationsId: publicNotificationsId
                }
            }
        );

        if(numberOfUpdatedRows == 1) {
            res.status(statusCode.SUCCESS.code).json({
                message: 'Notification details updated successfully!'
            })
        }
        else{
            res.status(statusCode.BAD_REQUEST.code).json({
                message: 'Notification details updation failed!'
            })
        }
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    addNewNotification,
    viewNotifications,
    editNotification,
    viewNotificationById
}