const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
let inventoryMaster = db.inventorymaster;
let statusmaster = db.statusmaster;
const { Op, where } = require('sequelize');
const logger = require('../../../logger/index.logger')

let viewInventoryList = async (req, res) => {
    try {
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null;
        console.log("givenReq", givenReq);

        let fetchInventoriesQuery = `
            SELECT i.equipmentId, i.code, i.description, i.statusId, s2.description as status, i.createdOn 
            from amabhoomi.inventorymasters i
            INNER JOIN amabhoomi.statusmasters s2 on i.statusId = s2.statusId and s2.parentStatusCode = 'RECORD_STATUS'
        `;
        let fetchInventoriesList = await sequelize.query(fetchInventoriesQuery);
        let matchedData = fetchInventoriesList[0];
        // console.log(fetchInventoriesList[0]);

        if(givenReq) {
            console.log(2)
            matchedData = matchedData.filter((data) => {
                if(data.code?.toLowerCase()?.includes(givenReq) ||
                data.description?.toLowerCase()?.includes(givenReq) ||
                data.status?.toLowerCase()?.includes(givenReq))
                    return data;
            })
        }
        console.log('matchedData', matchedData);

        matchedData.length > 0 ?
            res.status(statusCode.SUCCESS.code).json({
                message: "Inventories list",
                data: matchedData.sort((a, b) => { return new Date(b.createdOn) - new Date(a.createdOn) })
            })
        :
            res.status(statusCode.NOTFOUND.code).json({
                message: "no Inventories found",
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

let createInventory = async (req, res) => {
    try {
        let { code, description } = req.body;
        let userId = req.user.userId;

        let checkExistingData = await inventoryMaster.findAll({
            where: {
                [Op.or]: [
                    { code: code }, { description: description }
                ]
            }
        });

        if(checkExistingData.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: "Same inventory details data already exist! Kindly try again."
            })
        }

        // create new inventory details with active status
        let createNewInventory = await inventoryMaster.create({
            code: code,
            description: description,
            statusId: 1,
            createdBy: userId
        });

        console.log('new service', createNewInventory);
        res.status(statusCode.SUCCESS.code).json({
            message: "New inventory details added!",
            data: createNewInventory
        });
    }
    catch(error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

let viewInventoryById = async (req, res) => {
    try {
        let equipmentId = req.params.equipmentId;
        console.log('equipmentId', equipmentId);

        let fetchInventoryDetailsById = await inventoryMaster.findOne({
            where: {
                equipmentId: equipmentId
            }
        });

        // let statusMaster = await statusmaster.findAll({
        //     where: {
        //         parentStatusCode: 'RECORD_STATUS'
        //     }
        // });

        console.log('fetchServiceDetailsById', fetchInventoryDetailsById.dataValues);

        if(fetchInventoryDetailsById.dataValues) {
            res.status(statusCode.SUCCESS.code).json({
                message: "Inventory details",
                data: fetchInventoryDetailsById
            })
        }
        else{
            res.status(statusCode.NOTFOUND.code).json({
                message: "Inventory details not found!",
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

let updateInventory = async (req, res) => {
    try {
        let { code, description, equipmentId, statusId } = req.body;
        let paramsForUpdate = new Array();
        let userId = req.user.userId;

        //fetch previously saved details
        let fetchServiceDetailsById = await inventoryMaster.findOne({
            where: {
                equipmentId: equipmentId
            }
        });

        // check if entered data already exists
        let fetchExistingData = await inventoryMaster.findAll({
            where: {
                [Op.or]: [{ code: code }, { description: description }]
            }
        })

        if(fetchExistingData.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: 'Entered data already exists.'
            })
        }

        console.log("fetchServiceDetailsById", fetchServiceDetailsById);

        // compare each param and push to update params array
        if(code && fetchServiceDetailsById.code != code) {
            paramsForUpdate.code = code;
        }
        if(description && fetchServiceDetailsById.description != description) {
            paramsForUpdate.description = description;
        }
        if(statusId && fetchServiceDetailsById.statusId != statusId) {
            paramsForUpdate.statusId = statusId;
        }
        if(Object.keys(paramsForUpdate).length == 0){
            res.status(statusCode.BAD_REQUEST.code).json({
                message: "No changes made!"
            })
        }
        paramsForUpdate.updatedBy = userId;
        paramsForUpdate.updatedOn = new Date();
        console.log('params', paramsForUpdate);

        let [updateServiceCount] = await inventoryMaster.update(
            paramsForUpdate,
            {
                where: {
                    equipmentId: equipmentId
                }
            }
        );
        console.log("updateServiceCount", updateServiceCount);
        if(updateServiceCount > 0) {
            res.status(statusCode.SUCCESS.code).json({
                message: 'Service details updated successfully!'
            });
        }
        else{
            res.status(statusCode.BAD_REQUEST.code).json({
                message: 'Failed to update service details!'
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
    viewInventoryList,
    createInventory,
    viewInventoryById,
    updateInventory
}