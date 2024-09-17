const moment = require('moment');
const db = require('../../../models/index');
const { excelSerialToTime, validateTimeFormat, validateAndConvertDate, formatDateYYYYMMDD } = require('../../../utils/commonFunction');
const statusCode = require('../../../utils/statusCode');
const QueryTypes = db.QueryTypes
const sequelize = db.sequelize
let facilitiesTable = db.facilities;
let facilityStaffAllocation = db.facilityStaffAllocation;
let facilityStaffAttendance = db.facilityStaffAttendance;
let usermaster = db.usermaster;
let rolemaster = db.rolemaster;
let xlsx = require('xlsx');
const { calculateDistance } = require('../../../utils/commonFunction');

const { decrypt } = require('../../../middlewares/decryption.middlewares');
const logger = require('../../../logger/index.logger');
const { Op, where } = require('sequelize');

let formatDate = (currentDate) => {
    // Extract year, month, and day
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

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
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
            createdBy: user,
            statusId: 1
        });

        res.status(statusCode.CREATED.code).json({
            message: "Staff allocation data saved successfully!"
        })
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let updateFacilityStaffAllocation = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let { facilityStaffAllocationId, facilityId, userId, allocationStartDate, allocationEndDate } = req.body;
        let user = req.user.userId;
        console.log(1)
        let fetchFacilityStaffAllocationData = await facilityStaffAllocation.findOne({
            where: {
                facilityStaffAllocationId: facilityStaffAllocationId
            }
        });
        console.log(2)
        let paramsForUpdate = new Object();
        if (facilityId && facilityId != fetchFacilityStaffAllocationData.facilityId) {
            paramsForUpdate.facilityId = facilityId;
        }
        if (userId && userId != fetchFacilityStaffAllocationData.userId) {
            paramsForUpdate.userId = userId;
        }
        if (allocationStartDate && allocationStartDate != fetchFacilityStaffAllocationData.allocationStartDate) {
            paramsForUpdate.allocationStartDate = allocationStartDate;
        }
        if (allocationEndDate && allocationEndDate != fetchFacilityStaffAllocationData.allocationEndDate) {
            paramsForUpdate.allocationEndDate = allocationEndDate;
        }

        if (Object.keys(paramsForUpdate).length == 0) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "No changes made"
            })
        }
        console.log(4);
        paramsForUpdate.updatedBy = user;
        paramsForUpdate.updatedOn = new Date();

        let [updateCount] = await facilityStaffAllocation.update(paramsForUpdate, {
            where: {
                facilityStaffAllocationId: facilityStaffAllocationId
            }
        }, { transaction });
        console.log(5);
        if (updateCount > 0) {
            console.log(6);
            transaction.commit();
            res.status(statusCode.SUCCESS.code).json({
                message: "Staff allocation data updated successfully!"
            });
        }
        else {
            console.log(7);
            transaction.rollback();
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: "Updation failed! Please try again."
            });
        }
    }
    catch (error) {
        transaction.rollback();
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let viewStaffAllocation = async (req, res) => {
    try {
        let limit = req.body.page_size ? req.body.page_size : 50;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null;
        let staffAllocationId = req.params.id ? req.params.id : null;

        let fetchStaffAllocationQuery = `
            select 
                facilityStaffAllocationId, u.fullName, f.facilityname, fsa.allocationStartDate, fsa.allocationEndDate, fsa.createdOn, fsa.statusId, s.statusCode
            from facilitystaffallocations fsa
            inner join usermasters u on fsa.userId = u.userId
            inner join facilities f on f.facilityId = fsa.facilityId
            inner join statusmasters s on s.statusId = fsa.statusId and s.parentStatusCode = 'RECORD_STATUS'
        `;

        let fetchStaffAllocationData = await sequelize.query(fetchStaffAllocationQuery);
        let matchedData = fetchStaffAllocationData[0];

        if (givenReq) {
            matchedData = matchedData.filter((data) => {
                return data.fullName.toLowerCase().includes(givenReq) ||
                    data.facilityname.toLowerCase().includes(givenReq) ||
                    data.allocationStartDate.includes(givenReq) ||
                    data.allocationEndDate.includes(givenReq)
            });
        }

        let paginatedMatchedData = matchedData.slice(
            offset,
            limit + offset
        );

        if (paginatedMatchedData.length > 0) {
            res.status(statusCode.SUCCESS.code).json({
                message: "Facility staff allocation",
                paginatedMatchedData
            });
        }
        else {
            res.status(statusCode.NOTFOUND.code).json({
                message: "Facility staff allocation not found",
                data: []
            })
        }
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let viewStaffAllocationById = async (req, res) => {
    try {
        let limit = req.body.page_size ? req.body.page_size : 50;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase() : null;
        let staffAllocationId = req.params.id ? req.params.id : null;

        let fetchStaffAllocationQuery = `
            select 
                fsa.facilityStaffAllocationId, u.userId, u.fullName, f.facilityname, f.facilityId, fsa.allocationStartDate, fsa.allocationEndDate, fsa.createdOn, fsa.statusId, s.statusCode
            from facilitystaffallocations fsa
            inner join usermasters u on fsa.userId = u.userId
            inner join facilities f on f.facilityId = fsa.facilityId
            inner join statusmasters s on s.statusId = fsa.statusId and s.parentStatusCode = 'RECORD_STATUS'
            where fsa.facilityStaffAllocationId = ?
        `;
        let fetchStaffAllocationData = await sequelize.query(fetchStaffAllocationQuery, {
            replacements: [staffAllocationId]
        });

        let matchedData = fetchStaffAllocationData[0];

        if (givenReq) {
            matchedData = matchedData.filter((data) => {
                return data.fullName.toLowerCase().includes(givenReq) ||
                    data.facilityname.toLowerCase().includes(givenReq) ||
                    data.allocationStartDate.includes(givenReq) ||
                    data.allocationEndDate.includes(givenReq)
            });
        }

        let paginatedMatchedData = matchedData.slice(
            offset,
            limit + offset
        );

        if (paginatedMatchedData.length > 0) {
            res.status(statusCode.SUCCESS.code).json({
                message: "Facility staff allocation",
                paginatedMatchedData
            });
        }
        else {
            res.status(statusCode.NOTFOUND.code).json({
                message: "Facility staff allocation not found",
                data: []
            })
        }
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
                data.forEach(async (row) => {
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
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let viewStaffAttendanceData = async (req, res) => {
    try {
        let givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase().trim() : null;
        let limit = req.body.page_size ? req.body.page_size : 50;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let facilityStaffAttendanceId = req.body.facilityStaffAttendanceId ? req.body.facilityStaffAttendanceId : null;

        let fetchStaffAttendanceDataQuery = `
            select f.facilityStaffAttendanceId, f.facilityId, f2.facilityname as facilityName, 
            f3.description as facilityType, u.userId, u.userRegistrationNumber, 
            u.firstName, u.lastName, f.attendanceDate, f.checkInTime, f.checkOutTime, f.createdOn
            from facilitystaffattendances f
            inner join usermasters u on f.userId = u.userId
            inner join facilities f2 on f2.facilityId = f.facilityId
            inner join facilitytypes f3 on f2.facilityTypeId = f3.facilitytypeId
            where f.statusId = 1
            order by f.createdOn desc
        `;

        let staffAttendanceData = await sequelize.query(fetchStaffAttendanceDataQuery, {
            type: QueryTypes.SELECT
        });
        console.log("staff attendance data", staffAttendanceData);
        let matchedData = staffAttendanceData.map((data) => {
            data.firstName = decrypt(data.firstName);
            data.lastName = decrypt(data.lastName);
            return data;
        });

        if (givenReq) { // if user provided querty string
            matchedData = matchedData.filter((data) => {
                return data.facilityName?.toLowerCase().includes(givenReq) ||
                    data.facilityType?.toLowerCase().includes(givenReq) ||
                    data.firstName?.toLowerCase().includes(givenReq) ||
                    data.lastName?.toLowerCase().includes(givenReq) ||
                    data.attendanceDate?.toString().includes(givenReq) ||
                    data.checkInTime?.toString().includes(givenReq) ||
                    data.checkOutTime?.toString().includes(givenReq)
            })
        }

        if (facilityStaffAttendanceId) {    // to view each record by ID
            matchedData = matchedData.filter((data) => {
                return data.facilityStaffAttendanceId == facilityStaffAttendanceId
            });
        }

        matchedData = matchedData.slice(offset, offset + limit);

        res.status(statusCode.SUCCESS.code).json({
            message: "Staff attendance data",
            data: matchedData
        });
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let checkinAttendance = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let userId = req.user?.userId || 10;
        let { userLatitude, userLongitude } = req.body;
        console.log({ userLatitude, userLongitude, userId });
        let distanceRange = 0.2;    // permissible radius from facility within that staff to register check-in
        let currentDate = new Date();

        if (!userLatitude && !userLongitude) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "User location not provided."
            });
        }

        // fetch facility allocated to staff
        let fetchFacilityStaffAllocationData = await facilityStaffAllocation.findAll({
            where: {
                userId: userId,
                statusId: 1
            },
            type: QueryTypes.SELECT
        });

        console.log("fetchFacilityStaffAllocationData ", fetchFacilityStaffAllocationData);

        if (fetchFacilityStaffAllocationData.length > 1) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Multiple facilities allocated for duty! Kindly contact administrator."
            });
        }

        if(fetchFacilityStaffAllocationData.length == 0) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "No facility allocated. Kindly contact administrator.",
            });
        }

        fetchFacilityStaffAllocationData = fetchFacilityStaffAllocationData[0].dataValues;

        console.log("fetchFacilityStaffAllocationData ", fetchFacilityStaffAllocationData);

        let fetchFacilityDetails = await db.facilities.findOne({
            where: {
                facilityId: fetchFacilityStaffAllocationData.facilityId
            }
        });

        // distance calculation between facility coordinates and staff coordinates while registering check-in
        let staffDistance = calculateDistance(userLatitude, userLongitude, fetchFacilityDetails.latitude, fetchFacilityDetails.longitude);

        if (staffDistance > distanceRange) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Check-in time not registered as staff is not near the facility.",
                staffDistance,
                attendanceDate: formatDate(currentDate),
                checkInTime: currentDate.toLocaleTimeString('en-GB', { hour12: false }),
                fetchFacilityDetails
            });
        }

        let checkForcheckIn = await facilityStaffAttendance.findOne({
            where: {
                userId: userId,
                attendanceDate: formatDate(currentDate),
                checkInTime: {
                    [Op.ne]: null
                }
            }
        })

        console.log("checkForcheckIn", checkForcheckIn);

        if (checkForcheckIn) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Check-in time already registered for today!",
                checkForcheckIn
            })
        }

        // insert check-in time for attendance
        let insertCheckinAttendance = await facilityStaffAttendance.create({
            userId: userId,
            facilityId: fetchFacilityStaffAllocationData.facilityId,
            attendanceDate: formatDate(currentDate),
            checkInTime: currentDate.toLocaleTimeString('en-GB', { hour12: false }),
            checkOutTime: null,
            createdBy: userId,
            statusId: 1
        })

        if (insertCheckinAttendance) {
            transaction.commit();
            return res.status(statusCode.SUCCESS.code).json({
                message: "Check-in time registered successfully!",
                checkInData: insertCheckinAttendance
            });
        }
        else {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: "Something went wrong."
            })
        }
    }
    catch (error) {
        if (transaction) transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let checkoutAttendance = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let userId = req.user?.userId || 10;
        let currentDate = new Date();

        // fetch facility allocated to staff
        let fetchFacilityStaffAllocationData = await facilityStaffAllocation.findAll({
            where: {
                userId: userId,
                statusId: 1
            },
            type: QueryTypes.SELECT
        });

        console.log("fetchFacilityStaffAllocationData ", fetchFacilityStaffAllocationData);

        if (fetchFacilityStaffAllocationData.length > 1) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Multiple facilities allocated for duty! Kindly contact administrator."
            });
        }

        if(fetchFacilityStaffAllocationData.length == 0) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "No facility allocated. Kindly contact administrator.",
            });
        }

        fetchFacilityStaffAllocationData = fetchFacilityStaffAllocationData[0].dataValues;

        console.log("fetchFacilityStaffAllocationData ", fetchFacilityStaffAllocationData);

        let checkForcheckOut = await facilityStaffAttendance.findOne({
            where: {
                userId: userId,
                attendanceDate: formatDate(currentDate),
                checkOutTime: {
                    [Op.ne]: null
                }
            }
        })

        if(checkForcheckOut) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Check-out time already registered for today!"
            })
        }

        let [updateAttendanceCount] = await facilityStaffAttendance.update({
            checkOutTime: currentDate.toLocaleTimeString('en-GB', { hour12: false }),
            updatedBy: userId,
            updatedOn: currentDate,
        }, {
            where: {
                userId: userId,
                facilityId: fetchFacilityStaffAllocationData.facilityId,
            }
        }, { transaction });

        if(updateAttendanceCount) {
            transaction.commit();
            return res.status(statusCode.SUCCESS.code).json({
                message: "Check-out time registered successfully!"
            })
        }
    }
    catch (error) {
        if (transaction) transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    intialData
    , createFacilityStaffAllocation
    , updateFacilityStaffAllocation
    , uploadStaffAttendance
    , viewStaffAllocation
    , viewStaffAllocationById
    , viewStaffAttendanceData
    , checkinAttendance
    , checkoutAttendance
}