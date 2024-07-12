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
        select e.eventId, e.eventName, f.facilityId, f.facilityname, f.address, f2.code as facilityType, e.createdDt as requestDate, s.statusCode as requestStatus from 
        amabhoomi.eventactivities e
        left join amabhoomi.hosteventdetails h on e.eventId = h.eventId
        inner join amabhoomi.facilities f on f.facilityId = e.facilityId
        inner join amabhoomi.facilitytypes f2 on f2.facilitytypeId = f.facilityId
        left join amabhoomi.statusmasters s on s.statusId = e.statusId and s.parentStatusCode = 'HOSTING_STATUS'
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

        let fetchEventListQuery = `select e.eventId, e.eventName as eventTitle, e.locationName, e.eventStartTime, e.eventEndTime,
        e.ticketSalesEnabled, e.ticketPrice, e.descriptionOfEvent, e.eventImagePath, e.additionalFilePath, e.additionalDetails,
        h.organisationName,h.organisationAddress, h.pancardNumber, h.firstName, h.lastName, h.phoneNo, h.emailId
        from amabhoomi.eventactivities e
        inner join amabhoomi.hosteventdetails h on e.eventId = h.eventId
        inner join amabhoomi.facilities f on f.facilityId = e.facilityId 
        inner join amabhoomi.statusmasters s on s.statusId = e.statusId 
        where e.eventId = :eventId`;

        let viewEventData = await sequelize.query(fetchEventListQuery, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { eventId }
        });

        if (viewEventData.length > 0) {
            return res.status(statusCode.SUCCESS.code).send({ message: 'Event Detail Data', data: viewEventData });
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
        let action = req.body.action;
        let reasonForRejection = req.body.reasonForRejection;

        console.log({ eventId, action });

        let fetchStatusMasterListQuery = `select statusId, statusCode, description, parentStatusCode from amabhoomi.statusmasters s
        where parentStatusCode = 'HOSTING_STATUS'`;

        let statusMasterData = await sequelize.query(fetchStatusMasterListQuery, {
            type: Sequelize.QueryTypes.SELECT
        });

        console.log('statusMasterData', statusMasterData);

        let statusId = (action == 0) ? statusMasterData.filter(
            (status) => { return status.statusCode == 'REJECTED' }) : 
            fetchStatusMasterListQuery.filter(
                (status) => { return status.statusCode == 'APPROVED' }
        );

        console.log('statusId', statusId);

        let [updateCount] = await eventMasters.update({ statusId: parseInt(statusId) }, {
            where: {
                eventId: eventId
            }
        });

        // Perform update operation within a transaction
        // let updateAction = await sequelize.transaction(async (transaction) => {
        //     try {
        //         // Update operation
        //         let [updateCount, updateTheStatusOfEvent] = await eventMasters.update({ status: statusId }, {
        //             where: {
        //                 eventId: eventId
        //             }
        //         });

        //         console.log('Number of rows updated:', updateCount);

        //         // Explicitly throw an error to simulate a failure condition
        //         // Uncomment this line to simulate an error
        //         // throw new Error('Simulated error');

        //         // If no error occurred, commit the transaction
        //         await transaction.commit();

        //         console.log('Transaction committed successfully');
        //     } catch (error) {
        //         console.error('Error occurred:', error);

        //         // If an error occurred, rollback the transaction
        //         await transaction.rollback();

        //         console.log('Transaction rolled back!!');
        //     }
        // });

        console.log('updateAction', updateCount);

        // fetch event host details
        let fetchHostDetails = await hosteventdetails.findOne({
            where: {
                eventId: eventId
            }
        });

        console.log('host event details', fetchHostDetails);

        // send mail notification to the user for host event request
        let firstField = fetchHostDetails?.emailId;
        let secondField = fetchHostDetails?.phoneNo || '';
        let token = await mailToken({firstField, secondField});
        let messageBody = null;

        if(action == 0){    // if host event request is rejected
            messageBody = `
                Hello Sir/Madam,
                Your request for hosting an event is rejected due to the following mentioned reasons:<br/>
                ${reasonForRejection}<br/>

                Thank you for using AMA BHOOMI.
            `;
        }
        else if(action == 1){   //if host event request is approved
            messageBody = `Hello Sir/Madam,
            Your request for hosting an event is approved. Please do the required payment<br/>
            Thank you for using AMA BHOOMI.`
        }

        try {
            await sendEmail({
                emailId: `${fetchHostDetails?.emailId}`,
                subject: "Event host request rejected",
                html: `<p>${messageBody}</p>`
            })
        }
        catch(error){
            console.error('Not able to send the email currently!', error);
        }

        if(updateCount > 0) {
            res.status(statusCode.SUCCESS.code).send({
                message: (action == 0) ? 'Event host request is rejected.' : 'Event host request is approved.'
            });
        }
        else {
            res.status(statusCode.BAD_REQUEST.code).send({
                message: 'No action taken.'
            });
        }
    }
    catch (error) {
        res.status(statusCode.BAD_REQUEST.code).send({ message: error.message });
    }
}

let modifyAction = async (req, res) => {
    try {

    }
    catch(error){

    }
}

module.exports = {
    viewList,
    viewId,
    performAction,
    modifyAction
}