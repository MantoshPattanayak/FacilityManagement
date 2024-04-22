const { sequelize, Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const bcrypt = require('bcrypt')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const { encrypt } = require('../../../middlewares/encryption.middlewares')
const eventMasters = db.eventmasters;

let viewList = async (req, res) => {
    try {
        let givenReq = req.body.givenReq ? req.body.givenReq : null; // Convert givenReq to lowercase
        let limit = req.body.page_size ? req.body.page_size : 500;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let statusInput = req.body.statusCode ? req.body.statusCode : null;

        let fetchEventListQuery = `select e.activityId as eventId, e.activityName, f.address, e.createdOn, s.statusCode from 
            amabhoomi.eventmasters e
            inner join amabhoomi.hostevents h on e.activityId = h.activityId
            inner join amabhoomi.facilities f on f.facilityId = e.facilityMasterId
            inner join amabhoomi.statusmasters s on s.statusId = e.status
            where s.statusCode = :statusInput`;

        let viewEventListData = await sequelize.query(fetchEventListQuery, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { statusInput }
        })

        let matchedData = viewEventListData;

        if (givenReq) {
            matchedData = viewEventListData.filter((allData) =>
                allData.activityName.includes(givenReq) ||
                allData.address.includes(givenReq) ||
                allData.statusCode.includes(givenReq)
            )
        }

        let paginatedUserResources = matchedData.slice(offset, limit + offset);

        if (viewEventListData.length > 0) {
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

        let fetchEventListQuery = `select e.activityId as eventId, e.activityName, f.address, e.createdOn, s.statusCode from 
            amabhoomi.eventmasters e
            inner join amabhoomi.hostevents h on e.activityId = h.activityId
            inner join amabhoomi.facilities f on f.facilityId = e.facilityMasterId
            inner join amabhoomi.statusmasters s on s.statusId = e.status
            where e.activityId = :eventId`;

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

        let fetchStatusMasterListQuery = `select statusId, statusCode, description, parentStatusCode from amabhoomi.statusmasters s
        where parentStatusCode = 'HOSTING_STATUS'`;

        let statusMasterData = await sequelize.query(fetchStatusMasterListQuery, {
            type: Sequelize.QueryTypes.SELECT
        });

        console.log('statusMasterData', statusMasterData);

        let statusId = (action == 0) ? fetchStatusMasterListQuery.filter(
            (status) => { return status.statusCode == 'REJECTED' }) : fetchStatusMasterListQuery.filter((status) => { return status.statusCode == 'APPROVED' });

        // let updateEventDetailsRequestQuery = `update amabhoomi.eventmasters
        // set status = :statusId, updatedOn = current_timestamp() 
        // where activityId = :eventId`;

        // let updateAction = await sequelize.query(updateEventDetailsRequestQuery, {
        //     type: Sequelize.QueryTypes.SELECT,
        //     replacements: { statusId, eventId }
        // });

        let [updateCount, updateTheStatusOfEvent] = await eventMasters.update({ status: statusId }, {
            where: {
                activityId: eventId
            }
        });

        // Perform update operation within a transaction
        let updateAction = await sequelize.transaction(async (transaction) => {
            try {
                // Update operation
                let [updateCount, updateTheStatusOfEvent] = await eventMasters.update({ status: statusId }, {
                    where: {
                        activityId: eventId
                    }
                });

                console.log('Number of rows updated:', updateCount);

                // Explicitly throw an error to simulate a failure condition
                // Uncomment this line to simulate an error
                // throw new Error('Simulated error');

                // If no error occurred, commit the transaction
                await transaction.commit();

                console.log('Transaction committed successfully');
            } catch (error) {
                console.error('Error occurred:', error);

                // If an error occurred, rollback the transaction
                await transaction.rollback();

                console.log('Transaction rolled back');
            }
        });

        res.status(statusCode.SUCCESS.code).send({
            message: (action == 0) ? 'Event host request is rejected.' : 'Event host request is approved.'
        });
    }
    catch (error) {
        res.status(statusCode.BAD_REQUEST.code).send({ message: error.message });
    }
}

module.exports = {
    viewList,
    viewId,
    performAction
}