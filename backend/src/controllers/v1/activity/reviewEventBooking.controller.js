const { sequelize, Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const bcrypt = require('bcrypt')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const { encrypt } = require('../../../middlewares/encryption.middlewares')
const eventMasters = db.eventActivities;
const sendEmail = require('../../../utils/generateEmail');
const mailToken = require('../../../middlewares/mailToken.middlewares');
const hosteventdetails = db.hosteventdetails;
const hostBookings = db.hosteventbookings;

let viewList = async (req, res) => {
    try {
        console.log('entry viewList');
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null; // Convert givenReq to lowercase
        let limit = req.body.page_size ? req.body.page_size : 500;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let statusInput = req.body.statusCode ? req.body.statusCode : null;

        console.log("statusInput", statusInput);

        let fetchEventListQuery = `
        select e.eventId, e.eventName, f.facilityId, f.facilityname, f.address, f2.code as facilityType, 
        e.createdDt as requestDate, s.statusCode as requestStatus, f3.url as eventMainImage
        from  amabhoomi.eventactivities e
        left join amabhoomi.hosteventdetails h on e.eventId = h.eventId
        inner join amabhoomi.facilities f on f.facilityId = e.facilityId
        inner join amabhoomi.facilitytypes f2 on f2.facilitytypeId = f.facilityId
        left join amabhoomi.statusmasters s on s.statusId = e.statusId and s.parentStatusCode = 'HOSTING_STATUS'
        left join amabhoomi.fileattachments fa on fa.entityId = e.eventId and fa.entityType = 'events' and fa.filePurpose = 'Event Image'
        left join amabhoomi.files f3 on f3.fileId = fa.fileId
        where s.statusCode = :statusInput
        or s.statusCode IS NULL`;

        let viewEventListData = await sequelize.query(fetchEventListQuery, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { statusInput }
        })

        console.log("viewEventListData", viewEventListData);

        let matchedData = viewEventListData;

        if (givenReq) {
            matchedData = viewEventListData.filter((allData) =>
                allData.eventName?.toLowerCase().includes(givenReq) ||
                allData.facilityname?.toLowerCase().includes(givenReq) ||
                allData.address?.toLowerCase().includes(givenReq) ||
                allData.facilityType?.toLowerCase().includes(givenReq) ||
                allData.requestStatus?.toLowerCase().includes(givenReq)
            )
        }

        let paginatedUserResources = matchedData.slice(offset, limit + offset);

        console.log('paginatedUserResources', paginatedUserResources);

        if (paginatedUserResources.length > 0) {
            return res.status(statusCode.SUCCESS.code).send({ message: 'Events list Data', data: paginatedUserResources });
        }
        else
            return res.status(statusCode.NOTFOUND.code).send({ message: 'Event Detail Data not found' });
    }
    catch (error) {
        res.status(statusCode.BAD_REQUEST.code).send({ message: error.message });
    }
}

let viewId = async (req, res) => {
    try {
        let eventId = req.params.eventId;

        let fetchEventListQuery = `
        select e.eventId, e.eventName as eventTitle, ecm.eventCategoryName, e.facilityId, f.facilityname, f.facilityTypeId, f2.code as facilityType,
        e.locationName, e.eventStartTime, e.eventEndTime, e.ticketSalesEnabled, e.numberOfTickets, e.ticketPrice, 
        e.descriptionOfEvent, e.eventImagePath, e.additionalFilePath, e.additionalDetails, f3.url as eventMainImage,
        h.organisationName,h.organisationAddress, h.pancardNumber, h.firstName, h.lastName, h.phoneNo, h.emailId
        from amabhoomi.eventactivities e
        inner join amabhoomi.hosteventdetails h on e.eventId = h.eventId
        inner join amabhoomi.facilities f on f.facilityId = e.facilityId 
        inner join amabhoomi.statusmasters s on s.statusId = e.statusId
        inner join amabhoomi.eventcategorymasters ecm on ecm.eventCategoryId = e.eventCategoryId
        inner join amabhoomi.facilitytypes f2 on f2.facilitytypeId = f.facilityTypeId
        inner join amabhoomi.fileattachments fa on fa.entityId = e.eventId and fa.entityType = 'events' and fa.filePurpose = 'Event Image'
        inner join amabhoomi.files f3 on f3.fileId = fa.fileId
        where e.eventId = :eventId`;

        let fetchEventAdditionalImages = `
        select group_concat(f2.url separator ',') as file from
        amabhoomi.fileattachments f
        inner join amabhoomi.files f2 on f.fileId = f2.fileId and f.entityType = 'events' and f.filePurpose = 'Event additional file'
        where f.entityId = :eventId
        `;

        let viewEventData = await sequelize.query(fetchEventListQuery, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { eventId }
        });

        let viewEventAdditionalImages = await sequelize.query(fetchEventAdditionalImages, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { eventId }
        });

        if (viewEventData.length > 0) {
            return res.status(statusCode.SUCCESS.code).send({
                message: 'Event Detail Data',
                viewEventData, viewEventAdditionalImages
            });
        }
        else
            return res.status(statusCode.NOTFOUND.code).send({ message: 'Event Detail Data not found' });
    }
    catch (error) {
        res.status(statusCode.BAD_REQUEST.code).send({ message: error.message });
    }
}

let performAction = async (req, res) => {
    try {
        let eventId = req.params.eventId;
        let userId = req.user.userId;
        let { action, subject, messageBody } = req.body;    //APPROVE   REJECT     MODIFY

        console.log({ action, subject, messageBody });

        let fetchStatusMasterListQuery = `
        select statusId, statusCode, description, parentStatusCode 
        from amabhoomi.statusmasters s
        where parentStatusCode = 'HOSTING_STATUS'`;

        let statusMasterData = await sequelize.query(fetchStatusMasterListQuery, {
            type: Sequelize.QueryTypes.SELECT
        });

        console.log('statusMasterData', statusMasterData);

        // set statusId according to action input
        let statusId = (action == "REJECT") ? statusMasterData.filter((status) => { return status.statusCode == 'REJECTED' })[0].statusId
            : (action == "APPROVE") ? statusMasterData.filter((status) => { return status.statusCode == 'APPROVED' })[0].statusId
                : (action == "MODIFY") ? statusMasterData.filter((status) => { return status.statusCode == 'APPROVED' })[0].statusId 
                    : NULL;
        console.log('statusId', statusId);

        if (!statusId) {
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: 'status properly not set!!'
            })
        }

        //fetch host details by eventId
        let fetchHostId = await hosteventdetails.findOne({
            where: {
                eventId: eventId
            }
        });
        console.log("fetchHostId");

        // call function based on action input
        actionForEventHostRequest(fetchHostId.dataValues.hostId, statusId)

        // function to approve event host request
        async function actionForEventHostRequest(hostId, statusId) {
            console.log("actionForEventHostRequest", {hostId, statusId})
            try {
                let transaction = await sequelize.transaction();
                let [updateCount] = await hostBookings.update({ statusId: statusId, updatedDt: new Date(), updatedBy: userId }, {
                    where: {
                        hostId: hostId
                    }
                }, { transaction, returning: true });

                // await sendEmail({
                //     email: `${fetchHostId.dataValues.emailId}`,
                //     subject: `${subject}`,
                //     html: `<p>${message}</p>`
                // }); //if successfully updated, send mail to the user
                console.log("send mail to user error: ");
                await transaction.commit();
                res.status(statusCode.SUCCESS.code).json({
                    message: (action == "APPROVE") ? "Event host request is approved!"
                        : (action == "REJECT") ? "Event host request is rejected!"
                            : (action == "MODIFY") ? "Event host request is approved with modification!"
                                : ""
                });
            }
            catch (error) {
                if (transaction) await transaction.rollback();
                console.error('error at actionForEventHostRequest function:', error);
                res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                    message: 'Event Host Request perform action failed!',
                });
            }
        }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).send({ message: error.message });
    }
}

let modifyAction = async (req, res) => {
    try {

    }
    catch (error) {

    }
}

module.exports = {
    viewList,
    viewId,
    performAction,
    modifyAction
}