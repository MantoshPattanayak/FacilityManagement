const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
let statusmaster = db.statusmaster;
let activitymaster = db.useractivitymasters;
let facilityTypeMaster = db.facilitytype;
const { Op, where } = require("sequelize");

let viewUserActivitiesList = async (req, res) => {
  try {
    let givenReq = req.body.givenReq ? req.body.givenReq.toString().toLowerCase() : null;
    let limit = req.body.page_size ? req.body.page_size : 500;
    let page = req.body.page_number ? req.body.page_number : 1;
    let offset = (page - 1) * limit;

    let fetchUserActivities = await sequelize.query(
      `
        select u.userActivityId, u.userActivityName, u.facilityTypeId, f.description as facilityType, s.statusCode, u.createdOn 
        from useractivitymasters u
        inner join statusmasters s on u.statusId = s.statusId
        left join facilitytypes f on f.facilitytypeId = u.facilityTypeId`,
      {
        type: QueryTypes.SELECT,
      }
    );
    // console.log("fetchUserActivities", fetchUserActivities);
    let matchedData = fetchUserActivities;
    if (givenReq) {
      matchedData = matchedData.filter((data) => {
        if (
          data.userActivityName.toLowerCase().includes(givenReq) ||
          data.statusCode.toLowerCase().includes(givenReq)
        )
          return data;
      });
    }
    matchedData = matchedData.slice(offset, offset + limit);
    res.status(statusCode.SUCCESS.code).json({
      message: "List of user activities",
      data: matchedData,
    });
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: error.message });
  }
};

let createUserActivity = async (req, res) => {
    try {
        let { userActivityName, facilityTypeId } = req.body;
        let userId = req.user?.userId;
        // check if data entered or not
        if (!userActivityName || !facilityTypeId) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Please provide all required data."
            });
        }
        // check if entered data already present
        let checkIfDataExists = await activitymaster.findOne({
            where: {
                userActivityName: userActivityName,
            }
        });

        console.log("checkIfDataExists", Object.keys(checkIfDataExists.dataValues).length);

        if(Object.keys(checkIfDataExists.dataValues).length > 0) {
            res.status(statusCode.CONFLICT.code).json({
                message: "Data entered already exists!"
            });
        }
        else {  // insert new data
            let createNewUserActivity = await activitymaster.create({
                userActivityName: userActivityName,
                facilityTypeId: facilityTypeId,
                statusId: 1,
                createdBy: userId,
                createdOn: new Date(),
            });
            if (Object.keys(createNewUserActivity).length > 0) {
                return res.status(statusCode.SUCCESS.code).json({
                    message: "User activity created successfully!!"
                });
            }
            else {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "User activity creation failed!!"
                });
            }
        }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
};

let viewUserActivityById = async (req, res) => {
    try {
        let userActivityId = req.params.userActivityId;
        let fetchUserActivityDetails = await activitymaster.findOne({
            where : {
                userActivityId: userActivityId
            }
        });
        if(Object.keys(fetchUserActivityDetails.dataValues).length) {
            res.status(statusCode.SUCCESS.code).json({
                message: "user activity details",
                data: fetchUserActivityDetails
            });
        }
        else {
            res.status(statusCode.NOTFOUND.code).json({
                message: "user activity details not found",
                data: []
            });
        }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        });
    }
};

let updateUserActivity = async (req, res) => {
    try {
        let { userActivityName, facilityTypeId, userActivityId, statusId } = req.body;
        let userId = req.user?.userId;
        let paramsForUpdate = new Object();

        // check if entered data already present
        let checkIfDataExists = await activitymaster.findAll({
            where: {
                [Op.and]: [{userActivityName: userActivityName},{facilityTypeId: facilityTypeId}]
            }
        });
        console.log("checkIfDataExists", checkIfDataExists);

        if(checkIfDataExists.length > 0) {
            return res.status(statusCode.CONFLICT.code).json({
                message: 'Entered data already exists.'
            });
        }

        // fetch saved data for userActivityId
        let fetchExistingData = await activitymaster.findOne({
            where: {
                userActivityId: userActivityId
            }
        });

        // check for any changes compared to saved data
        if(userActivityName && fetchExistingData.userActivityName != userActivityName) {
            paramsForUpdate.userActivityName = userActivityName;
        }
        if(facilityTypeId && fetchExistingData.facilityTypeId != facilityTypeId) {
            paramsForUpdate.facilityTypeId = facilityTypeId;
        }
        if(statusId && fetchExistingData.statusId != statusId) {
            paramsForUpdate.statusId = statusId;
        }
        paramsForUpdate.updatedBy = userId;
        paramsForUpdate.updatedOn = new Date();
        console.log('params', paramsForUpdate);
        
        if(Object.keys(paramsForUpdate).length > 2) {
            let [updateCount] = await activitymaster.update(paramsForUpdate, {
                where: {
                    userActivityId: userActivityId
                }
            });
            if(updateCount > 0) {
                return res.status(statusCode.SUCCESS.code).json({
                    message: "User activity details updated successfully!"
                });
            }
            else {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: 'Failed to update user activity details!'
                });
            }
        }
        else {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "No changes made"
            });
        }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
};

let initialData = async (req, res) => {
    try {
        let fetchStatusMaster = await statusmaster.findAll({
            where: {
                parentStatusCode: "RECORD_STATUS"
            }
        });
        let fetchFacilityTypeMaster = await facilityTypeMaster.findAll({});

        return res.status(statusCode.SUCCESS.code).json({
            message: 'Initial data for user activity master',
            fetchStatusMaster,
            fetchFacilityTypeMaster
        });
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
  viewUserActivitiesList,
  createUserActivity,
  viewUserActivityById,
  updateUserActivity,
  initialData
};
