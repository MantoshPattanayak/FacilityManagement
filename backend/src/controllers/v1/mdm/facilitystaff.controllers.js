const db = require('../../../models/index');
const { excelSerialToTime } = require('../../../utils/commonFunction');
const statusCode = require('../../../utils/statusCode');
const  QueryTypes= db.QueryTypes
const sequelize = db.sequelize
let facilitiesTable = db.facilities;
let facilityStaffAllocation = db.facilityStaffAllocation;
let facilityStaffAttendance = db.facilityStaffAttendance;
let usermaster = db.usermaster;
let rolemaster = db.rolemaster;
let xlsx = require('xlsx');

let intialData = async (req, res) => {
    try {
        let fetchFacilityData = await facilitiesTable.findAll({
            attributes: ["facilityId", "facilityname"],
        });
        console.log("fetchFacilityData", fetchFacilityData);

        let fetchStaffRole = await rolemaster.findAll({
            where: {
                roleCode: "PARK_STAFF"
            }
        });
        console.log("fetchStaffRole", fetchStaffRole[0].roleCode);

        let fetchStaffData = await usermaster.findAll({
            attributes: ["userId", "fullName"],
            where: {
                roleId: fetchStaffRole[0].roleId
            }
        });
        console.log("fetchStaffData", fetchStaffData);

        res.status(statusCode.SUCCESS.code).json({
            message: "initial data fetch",
            fetchFacilityData,
            fetchStaffRole,
            fetchStaffData
        });
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        });
    }
}

let createFacilityStaffAllocation = async (req, res) => {
    try {
        let { facilityId, userId, allocationStartDate, allocationEndDate } = req.body;
        let user = req.user.userId;

        if(!facilityId || !userId) {
            res.status(statusCode.BAD_REQUEST.code).json({
                message: "Please enter all details."
            });
        }
        
        let insertFacilityStaffAllocationData = await facilityStaffAllocation.create({
            userId: userId,
            facilityId: facilityId,
            allocationStartDate: allocationStartDate || null,
            allocationEndDate: allocationEndDate || null,
            createdBy: user
        });

        res.status(statusCode.CREATED.code).json({
            message: "Staff allocation data saved successfully!"            
        })
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let updateFacilityStaffAllocation = async (req, res) => {
    try {
        let { facilityStaffAllocationId, facilityId, userId, allocationStartDate, allocationEndDate } = req.body;
        let user = req.user.userId;
        let transaction = await sequelize.transaction();

        let fetchFacilityStaffAllocationData = await facilityStaffAllocation.findOne({
            where: {
                facilityStaffAllocationId: facilityStaffAllocationId
            }
        });
        let paramsForUpdate;
        if(facilityId && facilityId != fetchFacilityStaffAllocationData.facilityId) {
            paramsForUpdate.facilityId = facilityId;
        }
        if(userId && userId != fetchFacilityStaffAllocationData.userId) {
            paramsForUpdate.userId = userId;
        }
        paramsForUpdate.updatedBy = user;
        paramsForUpdate.updatedOn = new Date();

        let [updateCount] = await facilityStaffAllocation.update(paramsForUpdate, {
            where: {
                facilityStaffAllocationId: facilityStaffAllocationId
            }
        }, { transaction });

        if(updateCount > 0) {
            transaction.commit();
            res.status(statusCode.SUCCESS.code).json({
                message: "Staff allocation data updated successfully!"
            });
        }
        else {
            transaction.rollback();
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: "Updation failed! Please try again."
            });
        }
    }
    catch(error) {
        transaction.rollback();
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let uploadStaffAttendance = async (req, res) => {
    try {
        let {dataUrl} = req.body;
        let userId = req.user.userId;
        const matches = dataUrl.match(/^data:.+\/(.+);base64,(.*)$/);
        if (matches.length !== 3) {
            throw new Error('Invalid base64 format');
        }
        // Decode base64 to binary buffer
        const buffer = Buffer.from(matches[2], 'base64');
        let workbook = xlsx.read(buffer, { type: 'buffer' });
        let sheetName = workbook.SheetNames[0];
        let sheet = workbook.Sheets[sheetName];
        let data = xlsx.utils.sheet_to_json(sheet);
        console.log("data", data);

        // Convert time fields
        data.forEach(row => {
            for (const key in row) {
                if (typeof row[key] === 'number' && row[key] < 1 && (key == 'Check In' || key == 'Check Out')) { // Time values are typically less than 1
                    row[key] = excelSerialToTime(row[key]);
                }
            }
        });

        let transaction = await sequelize.transaction();
        data.forEach(async (row) => {
            //fetch userId
            let fetchUserData = await usermaster.findOne({
                where: {
                    userRegistrationNumber: row["EmpId"]
                }
            }, { transaction });
            // fetch facilityId
            let fetchFacilityData = await facilitiesTable.findOne({
                where: {
                    facilityRegistrationNumber: row["FacilityCode"]
                }
            }, { transaction });
            //check if attendance date is correct
            const attendanceDateBoolean = moment(row["Attendance Date"], "M/D/YYYY", true);
            if(!attendanceDateBoolean){
                transaction.rollback();
                return res.status("")
            }
            // insert attendance details
            let insertStaffAttendance = await facilityStaffAttendance.create({
                userId: fetchUserData.userId,
                facilityId: fetchFacilityData.facilityId,
                attendanceDate: row["Attendance Date"],
                checkInTime: row["Check In"],
                checkOutTime: row["Check Out"],
                createdBy: userId,
            }, { transaction });
        });
        transaction.commit();
        res.status(statusCode.SUCCESS.code).json({
            message: "Excel data",
            data
        });
    }
    catch (error) {

    }
}

module.exports = {
    intialData
    ,createFacilityStaffAllocation
    ,updateFacilityStaffAllocation
    ,uploadStaffAttendance
}