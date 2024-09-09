const { sequelize, Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const bcrypt = require('bcrypt')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const { encrypt } = require('../../../middlewares/encryption.middlewares')
const publicNotifications = db.publicnotifications;
const imageUpload = require('../../../utils/imageUpload');
const logger = require('../../../logger/index.logger')

let addNewNotification = async (req, res) => {
    try {
        let { notificationTitle, notificationContent, validFromDate, validToDate, fileAttachment } = req.body;
        let userId = req.user?.userId || 1;
        console.log(1)
        if (notificationTitle == '' || notificationContent == '' || validFromDate == '' || validToDate == '' || notificationTitle == null || notificationContent == null || validFromDate == null || validToDate == null) {
            console.log(2)
            res.status(statusCode.BAD_REQUEST.code).json({
                message: 'Please enter all required fields.'
            })
        }
        console.log(3);
        async function addNewNotificationDetails() {
            let transaction;
            try {
                console.log(4)
                transaction = await sequelize.transaction();

                let addNotification = await publicNotifications.create({
                    publicNotificationsTitle: notificationTitle,
                    publicNotificationsContent: notificationContent,
                    validFromDate: validFromDate,
                    validToDate: validToDate,
                    createdBy: userId,
                    createdOn: new Date()
                }, { transaction });

                console.log("addNotification", addNotification);

                if (fileAttachment.data) {
                    console.log(5)
                    let entityType = "publicNotification";
                    let subDir = "publicNotification";
                    let filePurpose = "publicNotification";
                    let insertionData = {
                        id: addNotification.publicNotificationsId,
                        name: fileAttachment.name.split('.')[0] + '_publicNotification'
                    }
                    let errors = [];
                    console.log({ entityType, subDir, filePurpose, insertionData, userId });
                    const fileUpload = await imageUpload(fileAttachment.data, entityType, subDir, filePurpose, insertionData, userId, errors, transaction);
                    console.log(6)
                    if (errors.length > 0) {
                        console.log(7)
                        // if(errors.some(error => error.includes("something went wrong"))){
                        //     res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message:errors });
                        // }
                        console.log(8)
                        res.status(statusCode.BAD_REQUEST.code).json({ message: errors });
                    }
                    else {
                        transaction.commit();
                        console.log(9)
                        return;
                    }
                }
            }
            catch (error) {
                if (transaction) await transaction.rollback();
                console.log(10)
                console.error('Error creating new notifications:', error);
                res.status(statusCode.BAD_REQUEST.code).json({
                    message: 'New notification details addition failed!',
                    data: []
                })
            }
        }
        addNewNotificationDetails();
        console.log(11);
        res.status(statusCode.SUCCESS.code).json({
            message: 'New public notification added successfully!',
        })
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

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

        if (currentDate) {
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

        if (givenReq) {
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
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let viewNotificationById = async (req, res) => {
    try {
        let notificationId = req.params.notificationId;

        let notificationDetails = await publicNotifications.findOne({
            where: {
                publicNotificationsId: notificationId
            }
        });

        let fileAttachmentQuery = `
            SELECT fa.attachmentId, fa.filePurpose, fa.createdDt, f.fileId, f.fileName, f.fileType, f.url from publicnotifications p
            INNER JOIN fileattachments fa on p.publicNotificationsId = fa.entityId and fa.entityType = 'publicNotification'
            INNER JOIN files f on f.fileId = fa.fileId and f.statusId = 1
            WHERE p.publicNotificationsId = :publicNotificationsId
        `;

        let fileAttachmentDetails = await sequelize.query(fileAttachmentQuery, {
            replacements: {
                publicNotificationsId: notificationId
            }
        })

        if (notificationDetails) {
            res.status(statusCode.SUCCESS.code).json({
                message: 'Notification details',
                notificationDetails: notificationDetails,
                fileAttachmentDetails: fileAttachmentDetails[0][0]
            });
        }
        else {
            res.status(statusCode.NOTFOUND.code).json({
                message: 'Notification details not found',
                notificationDetails
            });
        }
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let editNotification = async (req, res) => {
    try {
        let { notificationTitle, notificationContent, validFromDate, validToDate, publicNotificationsId, fileAttachment } = req.body;
        let userId = req.user?.userId || 1;

        console.log({ notificationTitle, notificationContent, validFromDate, validToDate, publicNotificationsId });

        let notificationDetails = await publicNotifications.findOne({
            where: {
                publicNotificationsId: publicNotificationsId
            }
        });
        console.log('found notification', notificationDetails);

        let params = {};

        // check which paramaters value is modified, and accordingly update that column data for the record
        if ((!notificationTitle == '' || !notificationTitle == null) && notificationDetails.publicNotificationsTitle !== notificationTitle) {
            params.publicNotificationsTitle = notificationTitle;
        }
        if ((!notificationContent == '' || !notificationContent == null) && notificationDetails.publicNotificationsContent !== notificationContent) {
            params.publicNotificationsContent = notificationContent;
        }
        if ((!validFromDate == '' || !validFromDate == null) && new Date(notificationDetails.validFromDate).getTime() !== new Date(validFromDate).getTime()) {
            params.validFromDate = validFromDate;
        }
        if ((!validToDate == '' || !validToDate == null) && new Date(notificationDetails.validToDate).getTime() !== new Date(validToDate).getTime()) {
            params.validToDate = validToDate;
        }

        console.log('params', params);

        if (Object.keys(params).length == 0) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: 'No changes detected.'
            })
        }

        params.updatedBy = userId;
        params.updatedOn = new Date();


        async function updateNotificationDetails() {
            let transaction;
            try {
                transaction = await sequelize.transaction();
                let [numberOfUpdatedRows] = await publicNotifications.update(params, {
                    where: {
                        publicNotificationsId: publicNotificationsId
                    }
                }, { transaction });

                if (fileAttachment.data) {
                    console.log(5)
                    let entityType = "publicNotification";
                    let subDir = "publicNotification";
                    let filePurpose = "publicNotification";
                    let insertionData = {
                        id: publicNotificationsId,
                        name: fileAttachment.name.split('.')[0] + '_publicNotification'
                    }
                    let errors = [];
                    console.log({ entityType, subDir, filePurpose, insertionData, userId });
                    const fileUpload = await imageUpload(fileAttachment.data, entityType, subDir, filePurpose, insertionData, userId, errors, transaction);
                    console.log(6)
                    if (errors.length > 0) {
                        console.log(7)
                        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: errors });
                    }
                    else {
                        transaction.commit();
                        console.log(8)
                        return;
                    }
                }
            }
            catch (error) {

            }
        }
        updateNotificationDetails();
        res.status(statusCode.SUCCESS.code).json({
            message: "Notification details updated successfully!"
        })
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

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