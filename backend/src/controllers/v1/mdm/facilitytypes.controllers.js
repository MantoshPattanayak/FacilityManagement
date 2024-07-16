const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
let facilityTypeMaster = db.facilitytype;
let statusmaster = db.statusmaster;
const { Op, where } = require('sequelize');

let viewFacilityTypeList = async (req, res) => {
    try {
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null;
        console.log("givenReq", givenReq);

        let fetchFacilityTypeQuery = `
            SELECT f.facilitytypeId, f.code, f.description, f.statusId, s2.description as status, f.createdOn 
            from amabhoomi.facilitytypes f
            INNER JOIN amabhoomi.statusmasters s2 on f.statusId = s2.statusId and s2.parentStatusCode = 'RECORD_STATUS'
        `;
        let fetchFacilityTypeList = await sequelize.query(fetchFacilityTypeQuery);
        let matchedData = fetchFacilityTypeList[0];
        // console.log(fetchFacilityTypeList[0]);

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
                message: "facility type list list",
                data: matchedData.sort((a, b) => { return new Date(b.createdOn) - new Date(a.createdOn) })
            })
        :
            res.status(statusCode.NOTFOUND.code).json({
                message: "no facility type list found",
                data: []
            })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

let createFacilityType = async (req, res) => {
    try {
        let { code, description } = req.body;
        let userId = req.user.userId;

        let checkExistingData = await facilityTypeMaster.findAll({
            where: {
                [Op.or]: [
                    { code: code }, { description: description }
                ]
            }
        });

        if(checkExistingData.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: "Same FacilityType details data already exist! Kindly try again."
            })
        }

        // create new FacilityType details with active status
        let createNewFacilityType = await facilityTypeMaster.create({
            code: code,
            description: description,
            statusId: 1,
            createdBy: userId
        });

        console.log('new service', createNewFacilityType);
        res.status(statusCode.SUCCESS.code).json({
            message: "New FacilityType details added!",
            data: createNewFacilityType
        });
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

let viewFacilityTypeById = async (req, res) => {
    try {
        let facilityTypeById = req.params.facilityTypeById;
        console.log('facilityTypeById', facilityTypeById);

        let fetchFacilityTypeDetailsById = await facilityTypeMaster.findOne({
            where: {
                facilityTypeById: facilityTypeById
            }
        });

        // let statusMaster = await statusmaster.findAll({
        //     where: {
        //         parentStatusCode: 'RECORD_STATUS'
        //     }
        // });

        console.log('fetchFacilityTypeDetailsById', fetchFacilityTypeDetailsById.dataValues);

        if(fetchFacilityTypeDetailsById.dataValues) {
            res.status(statusCode.SUCCESS.code).json({
                message: "FacilityType details",
                data: fetchFacilityTypeDetailsById
            })
        }
        else{
            res.status(statusCode.NOTFOUND.code).json({
                message: "FacilityType details not found!",
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

let updateFacilityType = async (req, res) => {
    try {
        let { code, description, facilityTypeById, statusId } = req.body;
        let paramsForUpdate = new Array();
        let userId = req.user.userId;

        //fetch previously saved details
        let fetchFacilityTypeDetailsById = await facilityTypeMaster.findOne({
            where: {
                facilityTypeById: facilityTypeById
            }
        });

        // check if entered data already exists
        let fetchExistingData = await facilityTypeMaster.findAll({
            where: {
                [Op.or]: [{ code: code }, { description: description }]
            }
        })

        if(fetchExistingData.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: 'Entered data already exists.'
            })
        }

        console.log("fetchFacilityTypeDetailsById", fetchFacilityTypeDetailsById);

        // compare each param and push to update params array
        if(code && fetchFacilityTypeDetailsById.code != code) {
            paramsForUpdate.code = code;
        }
        if(description && fetchFacilityTypeDetailsById.description != description) {
            paramsForUpdate.description = description;
        }
        if(statusId && fetchFacilityTypeDetailsById.statusId != statusId) {
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

        let [updateFacilityTypeCount] = await facilityTypeMaster.update(
            paramsForUpdate,
            {
                where: {
                    facilityTypeById: facilityTypeById
                }
            }
        );
        console.log("updateFacilityTypeCount", updateFacilityTypeCount);
        if(updateFacilityTypeCount > 0) {
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
    viewFacilityTypeList,
    createFacilityType,
    viewFacilityTypeById,
    updateFacilityType
}