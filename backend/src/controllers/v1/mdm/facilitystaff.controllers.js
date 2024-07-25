const moment = require('moment');
const db = require('../../../models/index');
const { excelSerialToTime, validateTimeFormat, validateAndConvertDate } = require('../../../utils/commonFunction');
const statusCode = require('../../../utils/statusCode');
const QueryTypes = db.QueryTypes
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
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        });
    }
}

let createFacilityStaffAllocation = async (req, res) => {
    try {
        let { facilityId, userId, allocationStartDate, allocationEndDate } = req.body;
        let user = req.user.userId;

        if (!facilityId || !userId) {
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
    catch (error) {
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
        if (facilityId && facilityId != fetchFacilityStaffAllocationData.facilityId) {
            paramsForUpdate.facilityId = facilityId;
        }
        if (userId && userId != fetchFacilityStaffAllocationData.userId) {
            paramsForUpdate.userId = userId;
        }
        paramsForUpdate.updatedBy = user;
        paramsForUpdate.updatedOn = new Date();

        let [updateCount] = await facilityStaffAllocation.update(paramsForUpdate, {
            where: {
                facilityStaffAllocationId: facilityStaffAllocationId
            }
        }, { transaction });

        if (updateCount > 0) {
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
    catch (error) {
        transaction.rollback();
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let uploadStaffAttendance = async (req, res) => {
    try {
        let { dataUrl } = req.body;
        let userId = req.user?.userId || null;
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
        console.log("data 1", data);

        let wrongDataRowNumber = new Array();   // array to contain row number and message for invalid data

        // check if all columns are present
        data.forEach((row, index) => {
            ['Sl No.', 'EmpId', 'FacilityCode', 'Attendance Date', 'Check In', 'Check Out'].forEach((column) => {
                if (Object.keys(row).includes(column)) {
                    // continue
                }
                else {
                    wrongDataRowNumber.push({   // if incorrect time format, then push to wrong message json
                        row: index + 1,
                        message: `Data not provided for ${column} column.`
                    });
                }
            });
        });

        // loop through each row and check if data entered is valid or not
        data.forEach((row, index) => {
            for (const key in row) {
                // check data for Check In & Check Out column
                if (typeof row[key] === 'number' && row[key] < 1 && key == 'Check In') { // Time values are typically less than 1
                    let timeCheck = validateTimeFormat(excelSerialToTime(row[key]));   // validate time format
                    if (timeCheck)  // if correct format, then change time value from flaot to time format HH:mm
                        row[key] = excelSerialToTime(row[key]);
                    else {
                        wrongDataRowNumber.push({   // if incorrect time format, then push to wrong message json
                            row: index + 1,
                            message: "Invalid time format for Check In column"
                        });
                    }
                }
                if (typeof row[key] === 'number' && row[key] < 1 && key == 'Check Out') { // Time values are typically less than 1
                    let timeCheck = validateTimeFormat(excelSerialToTime(row[key]));   // validate time format
                    if (timeCheck)  // if correct format, then change time value from flaot to time format HH:mm
                        row[key] = excelSerialToTime(row[key]);
                    else {
                        wrongDataRowNumber.push({   // if incorrect time format, then push to wrong message json
                            row: index + 1,
                            message: "Invalid time format for Check Out column"
                        });
                    }
                }
                // check data for Attendance Date column
                if (key == 'Attendance Date') {
                    const attendanceDate = validateAndConvertDate(row["Attendance Date"]);   // validate and convert date input
                    if (!attendanceDate.isValid) {   // if unable to convert then push to wrong message json
                        wrongDataRowNumber.push({
                            row: index + 1,
                            message: "Invalid date format for Attendance Date column"
                        });
                    }
                    else {
                        row[key] = attendanceDate.data;
                    }
                }
            }
        });

        let validateData = await checkData(data);
        async function checkData(data) {    //function to check data
            try {
                let index = 0;
                for (const row of data) {
                    index += 1;
                    for (const key in row) {
                        // check data for Employee Id column
                        if (key == "EmpId") {
                            if (row[key]) {  // check if data entered
                                let fetchUserData = await usermaster.findOne({
                                    attributes: ["userId"],
                                    where: {
                                        userRegistrationNumber: row["EmpId"]
                                    }
                                });
                                // console.log("fetchUserData", fetchUserData);
                                if (fetchUserData != null) {
                                    row["EmpId"] = fetchUserData.dataValues?.userId || fetchUserData.userId;
                                }
                                else {
                                    wrongDataRowNumber.push({
                                        row: index,
                                        message: `Employee details doesn't exist for the Employee Id :- ${row["EmpId"]}`
                                    });
                                }
                            }
                            else {
                                wrongDataRowNumber.push({
                                    row: index,
                                    message: `Employee Id not provided`
                                });
                            }
                        }
                        // check data for Facility Code column
                        if (key == "FacilityCode") {
                            console.log(key);
                            if (row[key]) {
                                console.log(row[key]);
                                let fetchFacilityData = await facilitiesTable.findOne({
                                    attributes: ["facilityId"],
                                    where: {
                                        facilityRegistrationNumber: row["FacilityCode"]
                                    }
                                });
                                console.log("fetchFacilityData", fetchFacilityData);
                                if (fetchFacilityData != null) {
                                    row["FacilityCode"] = fetchFacilityData.dataValues?.facilityId || fetchFacilityData.facilityId;
                                }
                                else {
                                    console.log('wrong data')
                                    wrongDataRowNumber.push({
                                        row: index,
                                        message: `Facility details doesn't exist for the Facility Code :- ${row["FacilityCode"]}`
                                    });
                                }
                            }
                            else {
                                console.log("no data")
                                wrongDataRowNumber.push({
                                    row: index,
                                    message: `Facility code not provided`
                                });
                            }
                        }
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        if (wrongDataRowNumber.length > 0) {    // notify user if entered invalid data and terminate request
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Invalid data provided.",
                data: wrongDataRowNumber
            })
        }
        else {
            let transaction = await sequelize.transaction();    // start a transaction
            try {
                // loop through each row to check and insert data record
                data.forEach(async(row) => {
                    // insert attendance details
                    let insertStaffAttendance = await facilityStaffAttendance.create({
                        userId: row["EmpId"],
                        facilityId: row["FacilityCode"],
                        attendanceDate: row["Attendance Date"],
                        checkInTime: row["Check In"],
                        checkOutTime: row["Check Out"],
                        createdBy: userId || null,
                        statusId: 1
                    });
                });
                transaction.commit();
                return res.status(statusCode.SUCCESS.code).json({
                    message: "Excel data",
                    data
                });
            }
            catch (error) {
                transaction.rollback();
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                    message: error.message
                });
            }

        }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    intialData
    , createFacilityStaffAllocation
    , updateFacilityStaffAllocation
    , uploadStaffAttendance
}