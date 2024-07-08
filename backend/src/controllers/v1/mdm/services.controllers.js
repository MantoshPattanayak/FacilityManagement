const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
let serviceMaster = db.services;
let statusmaster = db.statusmaster;
const { Op, where } = require('sequelize');

let viewServicesList = async (req, res) => {
    try {
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null;
        console.log("givenReq", givenReq);

        let fetchServicesQuery = `
            SELECT s.serviceId, s.code, s.description, s.statusId, s2.description as status, s.createdOn from amabhoomi.services s
            INNER JOIN amabhoomi.statusmasters s2 on s.statusId = s2.statusId and s2.parentStatusCode = 'RECORD_STATUS'
        `;
        let fetchServicesList = await sequelize.query(fetchServicesQuery);
        let matchedData = fetchServicesList[0];
        // console.log(fetchServicesList[0]);

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
                message: "services list",
                data: matchedData.sort((a, b) => { return new Date(b.createdOn) - new Date(a.createdOn) })
            })
        :
            res.status(statusCode.NOTFOUND.code).json({
                message: "no services found",
                data: []
            })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

let createService = async (req, res) => {
    try {
        let { code, description } = req.body;
        let userId = req.user.userId;

        let checkExistingData = await serviceMaster.findAll({
            where: {
                [Op.or]: [
                    { code: code }, { description: description }
                ]
            }
        });

        if(checkExistingData.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: "Same service details data already exist! Kindly try again."
            })
        }

        // create new service details with active status
        let createNewService = await serviceMaster.create({
            code: code,
            description: description,
            statusId: 1,
            createrBy: userId
        });

        

        console.log('new service', createNewService);
        res.status(statusCode.SUCCESS.code).json({
            message: "New service details added!",
            data: createNewService
        });
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

let viewServiceById = async (req, res) => {
    try {
        let serviceId = req.params.serviceId;
        console.log('serviceId', serviceId);

        let fetchServiceDetailsById = await serviceMaster.findOne({
            where: {
                serviceId: serviceId
            }
        });

        // let statusMaster = await statusmaster.findAll({
        //     where: {
        //         parentStatusCode: 'RECORD_STATUS'
        //     }
        // });

        console.log('fetchServiceDetailsById', fetchServiceDetailsById.dataValues);

        if(fetchServiceDetailsById.dataValues) {
            res.status(statusCode.SUCCESS.code).json({
                message: "Service details",
                data: fetchServiceDetailsById
            })
        }
        else{
            res.status(statusCode.NOTFOUND.code).json({
                message: "Service details not found!",
                data: []
            })
        }
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

let updateService = async (req, res) => {
    try {
        let { code, description, serviceId, statusId } = req.body;
        let paramsForUpdate = new Array();
        let userId = req.user.userId;

        //fetch previously saved details
        let fetchServiceDetailsById = await serviceMaster.findOne({
            where: {
                serviceId: serviceId
            }
        });

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
        paramsForUpdate.updatedBy = userId;
        paramsForUpdate.updatedOn = new Date();
        console.log('params', paramsForUpdate);

        let [updateServiceCount] = await serviceMaster.update(
            paramsForUpdate,
            {
                where: {
                    serviceId: serviceId
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
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

module.exports = {
    viewServicesList,
    createService,
    viewServiceById,
    updateService
}