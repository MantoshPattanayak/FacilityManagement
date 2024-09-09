const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
let eventCategoriesMaster = db.eventCategoryMaster;
const { Op, where } = require('sequelize');
const logger = require('../../../logger/index.logger')

let viewEventCategoriesList = async (req, res) => {
    try {
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null;
        console.log("givenReq", givenReq);

        let fetchEventCategoriesQuery = `
            SELECT e.eventCategoryId, e.eventCategoryName, e.description, s2.statusId, s2.statusCode as status, e.createdDt as createdOn 
            from amabhoomi.eventcategorymasters e
            INNER JOIN amabhoomi.statusmasters s2 on e.statusId = s2.statusId and s2.parentStatusCode = 'RECORD_STATUS'
        `;
        let fetchEventCategoriesList = await sequelize.query(fetchEventCategoriesQuery);
        let matchedData = fetchEventCategoriesList[0];
        console.log("data fetched", matchedData);
        if(givenReq) {
            console.log(2)
            matchedData = matchedData.filter((data) => {
                if(data.eventCategoryName?.toLowerCase()?.includes(givenReq) ||
                data.description?.toLowerCase()?.includes(givenReq) ||
                data.status?.toLowerCase()?.includes(givenReq))
                    return data;
            })
        }
        console.log('matchedData', matchedData);

        matchedData.length > 0 ?
            res.status(statusCode.SUCCESS.code).json({
                message: "Event Categories list",
                data: matchedData.sort((a, b) => { return new Date(b.createdOn) - new Date(a.createdOn) })
            })
        :
            res.status(statusCode.NOTFOUND.code).json({
                message: "no event categories found",
                data: []
            })
    }
    catch(error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

let createEventCategory = async (req, res) => {
    try {
        let { eventCategoryName, description } = req.body;
        let userId = req.user.userId;

        let checkExistingData = await eventCategoriesMaster.findAll({
            where: {
                eventCategoryName: eventCategoryName
            }
        });

        if(checkExistingData.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: "Same event category details data already exist! Kindly try again."
            });
        }

        // create new service details with active status
        let createEventCategory = await eventCategoriesMaster.create({
            eventCategoryName: eventCategoryName,
            description: description,
            statusId: 1,
            createdBy: userId
        });

        console.log('new event category', createEventCategory);
        res.status(statusCode.SUCCESS.code).json({
            message: "New event category details added!",
            data: createEventCategory
        });
    }
    catch(error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        });
    }
}

let viewEventCategoryById = async (req, res) => {
    try {
        let eventCategoryId = req.params.eventCategoryId;
        console.log('eventCategoryId', eventCategoryId);

        let fetchEventCategoryDetailsById = await eventCategoriesMaster.findOne({
            where: {
                eventCategoryId: eventCategoryId
            }
        });

        console.log('fetchEventCategoryDetailsById', fetchEventCategoryDetailsById.dataValues);

        if(fetchEventCategoryDetailsById.dataValues) {
            res.status(statusCode.SUCCESS.code).json({
                message: "Event category details",
                data: fetchEventCategoryDetailsById
            })
        }
        else{
            res.status(statusCode.NOTFOUND.code).json({
                message: "Event category details not found!",
                data: []
            })
        }
    }
    catch(error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

let updateEventCategory = async (req, res) => {
    try {
        let { eventCategoryName, description, eventCategoryId, statusId } = req.body;
        let paramsForUpdate = new Array();
        let userId = req.user.userId;
        console.log({ eventCategoryName, description, eventCategoryId, statusId });

        //fetch previously saved details
        let fetchEventCategoryDetailsById = await eventCategoriesMaster.findOne({
            where: {
                eventCategoryId: eventCategoryId
            }
        });

        console.log("fetchEventCategoryDetailsById", fetchEventCategoryDetailsById);

        // check if entered data already exists
        let fetchExistingData = await eventCategoriesMaster.findAll({
            where: {
                [Op.or]: [{ eventCategoryName: eventCategoryName }, { description: description }]
            }
        })

        if(fetchExistingData.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: 'Entered data already exists. Check again!'
            })
        }

        // compare each param and push to update params array
        if(eventCategoryName && fetchEventCategoryDetailsById.eventCategoryName != eventCategoryName) {
            paramsForUpdate.eventCategoryName = eventCategoryName;
        }
        if(description && fetchEventCategoryDetailsById.description != description) {
            paramsForUpdate.description = description;
        }
        if(statusId && fetchEventCategoryDetailsById.statusId != statusId) {
            paramsForUpdate.statusId = statusId;
        }
        console.log('params', paramsForUpdate);
        if(Object.keys(paramsForUpdate).length == 0){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "No changes made!"
            })
        }
        paramsForUpdate.updatedBy = userId;
        paramsForUpdate.updatedOn = new Date();
        console.log('params', paramsForUpdate);

        let [updateEventCategory] = await eventCategoriesMaster.update(
            paramsForUpdate,
            {
                where: {
                    eventCategoryId: eventCategoryId
                }
            }
        );
        console.log("updateEventCategory", updateEventCategory);
        if(updateEventCategory > 0) {
            res.status(statusCode.SUCCESS.code).json({
                message: 'Event category details updated successfully!'
            });
        }
        else{
            res.status(statusCode.BAD_REQUEST.code).json({
                message: 'Failed to update Event category details!'
            });
        }
    }
    catch(error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

module.exports = {
    viewEventCategoriesList,
    createEventCategory,
    viewEventCategoryById,
    updateEventCategory
}