const { sequelize, Sequelize } = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const db = require("../../../models");
const galleryDetails = db.galleryDetails;
const path = require('path');
const fs = require('fs');
const imageUpload = require('../../../utils/imageUpload');
let { Op } =require('sequelize');
const imageUpdate = require("../../../utils/imageUpdate");

let insertNewGalleryRecord = async (req, res) => {
    try {
        let { description, fileAttachment } = req.body;
        let userId = req.user.userId;
        console.log({ description, fileAttachment });
        // check if data is received or not
        if(!description || !fileAttachment) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Please provide details."
            })
        }

        let transaction = await sequelize.transaction();    // start transaction
        // insert gallery details into table
        let insertNewRecord = await galleryDetails.create({
            description: description,
            createdBy: userId,
            createdDt: new Date(),
            statusId: 1
        }, {transaction});
        // check if image file received
        if (fileAttachment.data) {
            console.log(1);
            let entityType = "galleryImage";    //set file category type
            let subDir = "galleryImage";    // mention sub directory path
            let filePurpose = "galleryImage";   //set file purpose
            let insertionData = {   //data details to be inserted in files, fileattachments
                id: insertNewRecord.galleryId,
                name: fileAttachment.name.split('.')[0] + '_galleryImage' + insertNewRecord.galleryId
            }
            let errors = [];
            console.log({ entityType, subDir, filePurpose, insertionData, userId });
            // upload image file and save filepath in table
            const fileUpload = await imageUpload(fileAttachment.data, entityType, subDir, filePurpose, insertionData, userId, errors, transaction);
            console.log(2);
            if (errors.length > 0) {
                console.log(3);
                transaction.rollback();
                return res.status(statusCode.BAD_REQUEST.code).json({ message: errors });
            }
            else {
                transaction.commit();
                console.log(4);
                return res.status(statusCode.SUCCESS.code).json({ message: "New gallery record saved successfully!" });
            }
        }
        return res.status(statusCode.SUCCESS.code).json({ message: "New gallery record saved successfully!" });
    } 
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let fetchGalleryList = async (req, res) => {
    try {
        let limit = req.body.page_size ? req.body.page_size : 100;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        // fetch gallery details
        let fetchGalleryRecords = await sequelize.query(`
            select g.galleryId, g.description, g.startDate, g.endDate, s.statusCode, f2.fileName, f2.url
            from gallerydetails g
            inner join fileattachments f on g.galleryId = f.entityId and f.entityType = 'galleryImage' and f.filePurpose = 'galleryImage'
            inner join files f2 on f.fileId = f2.fileId
            inner join statusmasters s on s.statusId = g.statusId and s.parentStatusCode = 'RECORD_STATUS'
        `);

        //set data according to limit and offset
        let paginatedFetchGalleryRecords = fetchGalleryRecords.slice(offset, limit + offset);

        res.status(statusCode.SUCCESS.code).json({
            message: "Gallery details",
            data: paginatedFetchGalleryRecords.map((gallery) => {return {...gallery, ['url']: encodeURIComponent(gallery.url)}})
        })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let updateGalleryRecord = async (req, res) => {
    try {
        let galleryId = req.params.galleryId || req.body.galleryId;
        let { description, fileAttachment } = req.body;
        let userId = req.user.userId;

        //fetch the saved data for gallery record
        let fetchExistingData = await galleryDetails.findOne({
            where: {
                galleryId: galleryId
            }
        });

        //fetch file details for gallery record
        let fetchFileDetails = await sequelize.query(`
            select g.galleryId, f.fileId, f2.fileName, f2.url
            from gallerydetails g
            inner join fileattachments f on g.galleryId = f.entityId and f.entityType = 'galleryImage' and f.filePurpose = 'galleryImage'
            inner join files f2 on f.fileId = f2.fileId
            inner join statusmasters s on s.statusId = g.statusId and s.parentStatusCode = 'RECORD_STATUS'
            where g.galleryId = :galleryId 
        `, {
            replacements: {
                galleryId: galleryId
            }
        });

        console.log("fetchFileDetails", fetchFileDetails);

        let paramsForUpdate = {};
        if(description && description != fetchExistingData.description) {
            paramsForUpdate.description = description;
        }
        paramsForUpdate.updatedDt = new Date();
        paramsForUpdate.updatedBy = userId;

        //update gallery details
        let transaction = await sequelize.transaction();
        let [updateCount] = await galleryDetails.update(paramsForUpdate, {
            where: {
                galleryId: galleryId
            }
        }, { transaction });

        if(updateCount == 0) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Gallery details not updated!"
            })
        }

        // check if image file received, then update the file
        if (fileAttachment.data) {
            console.log(1);
            let entityType = "galleryImage";    //set file category type
            let subDir = "galleryImage";    // mention sub directory path
            let filePurpose = "galleryImage";   //set file purpose
            let insertionData = {   //data details to be inserted in files, fileattachments
                id: galleryId,
                fileId: fetchFileDetails[0].fileId,
                name: fileAttachment.name.split('.')[0] + '_galleryImage' + insertNewRecord.galleryId
            }
            let errors = [];
            console.log({ entityType, subDir, filePurpose, insertionData, userId });
            // upload image file and save filepath in table
            const fileUpload = await imageUpdate(fileAttachment.data, subDir, insertionData, userId, errors, transaction);
            console.log(2);
            if (errors.length > 0) {
                console.log(3);
                transaction.rollback();
                return res.status(statusCode.BAD_REQUEST.code).json({ message: errors });
            }
            else {
                transaction.commit();
                console.log(4);
                return res.status(statusCode.SUCCESS.code).json({ message: "Gallery record updated successfully!" });
            }
        }
        return res.status(statusCode.SUCCESS.code).json({ message: "Gallery record updated successfully!" });
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let fetchGalleryById = async (req, res) => {
    try {
        let galleryId = req.params.galleryId;
        console.log("galleryId", galleryId);

        // fetch gallery details by Id
        let fetchGalleryRecords = `
            select g.galleryId, g.description, g.startDate, g.endDate, s.statusCode, f2.fileName, f2.url
            from gallerydetails g
            inner join fileattachments f on g.galleryId = f.entityId and f.entityType = 'galleryImage' and f.filePurpose = 'galleryImage'
            inner join files f2 on f.fileId = f2.fileId
            inner join statusmasters s on s.statusId = g.statusId and s.parentStatusCode = 'RECORD_STATUS'
            where g.galleryId = :galleryId
        `;
        let fetchGalleryRecordData = await sequelize.query(fetchGalleryRecords, {
            replacements: {
                galleryId: galleryId
            }
        });

        res.status(statusCode.SUCCESS.code).json({
            message: "Gallery details",
            data: fetchGalleryRecordData[0]
        })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    insertNewGalleryRecord,
    fetchGalleryList,
    updateGalleryRecord,
    fetchGalleryById
}