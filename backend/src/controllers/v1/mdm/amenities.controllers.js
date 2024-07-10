const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
let amenintiesMaster = db.amenitiesmaster;
const { Op, where } = require('sequelize');

let viewAmenitiesList = async (req, res) => {
    try {
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null;
        console.log("givenReq", givenReq);

        let fetchAmenitiesQuery = `
            SELECT a.amenityId, a.amenityName, s2.statusId, s2.statusCode as status, a.createdOn from amabhoomi.amenitymasters a
            INNER JOIN amabhoomi.statusmasters s2 on a.statusId = s2.statusId and s2.parentStatusCode = 'RECORD_STATUS'
        `;
        let fetchAmenitiesList = await sequelize.query(fetchAmenitiesQuery);
        let matchedData = fetchAmenitiesList[0];
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

let createAmenity = async (req, res) => {
    try {
        let { amenityName } = req.body;
        let userId = req.user.userId;

        let checkExistingData = await amenintiesMaster.findAll({
            where: {
                amenityName: amenityName
            }
        });

        if(checkExistingData.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: "Same service details data already exist! Kindly try again."
            })
        }

        // create new service details with active status
        let createAmenityService = await amenintiesMaster.create({
            amenityName: amenityName,
            statusId: 1,
            createdBy: userId
        });

        console.log('new service', createAmenityService);
        res.status(statusCode.SUCCESS.code).json({
            message: "New service details added!",
            data: createAmenityService
        });
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error
        })
    }
}

let viewAmenityById = async (req, res) => {
    try {
        let amenityId = req.params.amenityId;
        console.log('amenityId', amenityId);

        let fetchAmenityDetailsById = await amenintiesMaster.findOne({
            where: {
                amenityId: amenityId
            }
        });

        // let statusMaster = await statusmaster.findAll({
        //     where: {
        //         parentStatusCode: 'RECORD_STATUS'
        //     }
        // });

        console.log('fetchAmenityDetailsById', fetchAmenityDetailsById.dataValues);

        if(fetchAmenityDetailsById.dataValues) {
            res.status(statusCode.SUCCESS.code).json({
                message: "Amenity details",
                data: fetchAmenityDetailsById
            })
        }
        else{
            res.status(statusCode.NOTFOUND.code).json({
                message: "Amenity details not found!",
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

let updateAmenity = async (req, res) => {
    try {
        let { amenityName, amenityId, statusId } = req.body;
        let paramsForUpdate = new Array();
        let userId = req.user.userId;
        console.log({ amenityName, amenityId, statusId });

        //fetch previously saved details
        let fetchAmenitiesDetailsById = await amenintiesMaster.findOne({
            where: {
                amenityId: amenityId
            }
        });

        console.log("fetchAmenitiesDetailsById", fetchAmenitiesDetailsById);

        // check if entered data already exists
        let fetchExistingData = await amenintiesMaster.findAll({
            where: {
                [Op.or]: [{ code: code }, { description: description }]
            }
        })

        if(fetchExistingData.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: 'Entered data already exists.'
            })
        }

        // compare each param and push to update params array
        if(amenityName && fetchAmenitiesDetailsById.amenityName != amenityName) {
            paramsForUpdate.amenityName = amenityName;
        }
        if(statusId && fetchAmenitiesDetailsById.statusId != statusId) {
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

        let [updateAmenitiesCount] = await amenintiesMaster.update(
            paramsForUpdate,
            {
                where: {
                    amenityId: amenityId
                }
            }
        );
        console.log("updateAmenitiesCount", updateAmenitiesCount);
        if(updateAmenitiesCount > 0) {
            res.status(statusCode.SUCCESS.code).json({
                message: 'Amenity details updated successfully!'
            });
        }
        else{
            res.status(statusCode.BAD_REQUEST.code).json({
                message: 'Failed to update amenity details!'
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
    viewAmenitiesList,
    createAmenity,
    viewAmenityById,
    updateAmenity
}