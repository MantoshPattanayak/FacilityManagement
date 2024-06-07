const { sequelize, Sequelize } = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const db = require("../../../models");
const grievanceMasters = db.grievancemasters;
const statusMasters = db.statusmaster;
const feedbacks = db.feedback
const grievanceCategories = db.grievancecategories;

// insert grievance - start
const addGrievance = async (req, res) => {
    try {
        let createGrievance;
        const {
            fullname,
            emailId,
            phoneNo,
            subject,
            details,
            statusId,
            filepath,
            isWhatsappNumber
        } = req.body;
        createGrievance = await grievanceMasters.create({
            fullname: fullname,
            emailId: emailId,
            phoneNo: phoneNo,
            subject: subject,
            details: details,
            statusId: statusId,
            isWhatsappNumber: isWhatsappNumber
        });
        if (filepath) {
            let filepathPath = null
            let filepathPath2 = null
            const uploadDir = process.env.UPLOAD_DIR
            const base64filepath = filepath ? filepath.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
            const mimeMatch = filepath.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)
            const mime = mimeMatch ? mimeMatch[1] : null;

            if ([
                "image/jpeg",
                "image/png",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(mime)) {
                const filepathBuffer = filepath ? Buffer.from(base64filepath, "base64") : null;
                if (filepathBuffer) {
                    const eventDir = path.join(uploadDir, "filepath")

                    if (!fs.existsSync(eventDir)) {
                        fs.mkdirSync(eventDir, { recursive: true })
                    }
                    const fileExtension = mime ? mime.split("/")[1] : "txt";
                    filepathPath = `${uploadDir}/eventDir/grievance.${createGrievance.grievanceMasterId}.${fileExtension}`
                    fs.writeFileSync(filepathPath, uploadEventBuffer)
                    filepathPath2 = `/eventDir/grievance.${createGrievance.grievanceMasterId}.${fileExtension}`
                    let fileName = `grievance.${createGrievance.grievanceMasterId}.${fileExtension}`
                    let fileType = mime ? mime.split("/")[0] : 'unknown'
                    let createFile = await file.create({
                        fileName: fileName,
                        fileType: fileType,
                        url: filepathPath2,
                        statusId: 1,
                        createdDt: now(),
                        updatedDt: now()
                    })

                    if (!createFile) {
                        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message })
                    }
                    let createFileAttachment = await fileAttachment.create({
                        entityId: createGrievance.grievanceMasterId,
                        entityType: entityType,
                        fileId: createFile.fileId,
                        statusId: 1,
                        filePurpose: "Image"
                    })
                }
            }
            else {
                return res.status(statusCode.BAD_REQUEST.code).json({ message: "Invalid File type for the image" })
            }
        }
        if (createGrievance) {
            return res.status(statusCode.SUCCESS.code).json({
                message: "Grievance created successfully",
            });
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message: "Grivance is not created",
        });
    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message,
        });
    }
};
//insert grievance - end

//fetch grievance initial data - start
const fetchInitialData = async (req, res) => {
    try {
        let fetchGrievanceCategories = await grievanceCategories.findAll({
            where: {
                statusId: 1
            }
        }) || [];

        console.log('grievance categories', fetchGrievanceCategories);
        res.status(statusCode.SUCCESS.code).json({
            message: 'List of grievance categories',
            data: fetchGrievanceCategories
        })
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}
//fetch grievance initial data - end

// view grievance list - start
let viewGrievanceList = async (req, res) => {
    try {
        let limit = req.body.page_size ? req.body.page_size : 100;
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let givenReq = req.body.givenReq ? req.body.givenReq?.toLowerCase() : null;

        let fetchGrievanceQuery = await grievanceMasters.findAll({});
        let statusMasterData = await statusMasters.findAll({});

        console.log('givenReq', givenReq);

        fetchGrievanceQuery = fetchGrievanceQuery.map((grievance) => {
            const matchingStatus = statusMasterData.find(status =>
                status.dataValues.statusId == grievance.dataValues.statusId &&
                status.dataValues.parentStatusCode == 'GRIEVANCE_USER_STATUS'
            );

            if (matchingStatus) {
                grievance.dataValues.status = matchingStatus.dataValues.description;
            }
            return grievance;
        });

        let matchedData = fetchGrievanceQuery;

        if (givenReq) {
            matchedData = matchedData.filter((grievanceData) => {
                // console.log('grievance data', grievanceData.details.toLowerCase().includes(givenReq));
                if (grievanceData.fullname?.toLowerCase().includes(givenReq) ||
                    grievanceData.emailId?.toLowerCase().includes(givenReq) ||
                    grievanceData.subject?.toLowerCase().includes(givenReq) ||
                    grievanceData.details?.toLowerCase().includes(givenReq) ||
                    grievanceData.status?.toLowerCase().includes(givenReq) ||
                    (!isNaN(Number(givenReq)) && grievanceData.phoneNo?.includes(givenReq)))
                    return grievanceData
            })
        }

        let grievanceListData = matchedData.slice(offset, limit + offset);

        if (grievanceListData.length > 0) {
            res.status(statusCode.SUCCESS.code).json({
                message: 'Grievance list',
                grievanceListData
            })
        }
        else {
            res.status(statusCode.NOTFOUND.code).json({
                message: 'No data found'
            })
        }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}
// view grievance list - end

// view grievance details by id - start
let viewGrievanceById = async (req, res) => {
    try {
        let grievanceId = req.params.grievanceId;
        console.log('grievance id', grievanceId);

        let fetchGrievanceDetails = await grievanceMasters.findOne({
            where: {
                grievanceMasterId: grievanceId
            }
        })
        console.log(fetchGrievanceDetails);

        if (fetchGrievanceDetails) {
            res.status(statusCode.SUCCESS.code).json({
                message: "Grievance details",
                grievanceDetails: fetchGrievanceDetails
            })
        }
        else {
            res.status(statusCode.NOTFOUND.code).json({
                message: 'No data found.'
            })
        }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}
// view grievance details by id - end

//action taken against grievance - start
let actionTaken = async (req, res) => {
    try {
        let userId = req.user?.userId;
        let {
            grievanceMasterId,
            response,
            filepath
        } = req.body;

        let fetchGrievanceStatus = await statusMasters.findOne({
            where: {
                parentStatusCode: 'GRIEVANCE_USER_STATUS',
                statusCode: 'CLOSED'
            }
        });

        // console.log('fetch grievance status', fetchGrievanceStatus.dataValues.statusId);

        if (response) {
            updateGrievanceResponse();

            async function updateGrievanceResponse() {
                let transaction;
                try {
                    transaction = await sequelize.transaction();
                    
                    let [updateGrievanceCount] = await grievanceMasters.update({
                        response: response,
                        actionTakenBy: userId,
                        updatedOn: new Date(),
                        updatedBy: userId,
                        actionTakenDate: new Date(),
                        statusId: fetchGrievanceStatus.dataValues.statusId
                    }, {
                        where: {
                            grievanceMasterId: grievanceMasterId
                        }
                    });

                    if(filepath) {
                        let filepathPath = null
                        let filepathPath2 = null
                        const uploadDir = process.env.UPLOAD_DIR
                        const base64filepath = filepath ? filepath.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
                        const mimeMatch = filepath.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)
                        const mime = mimeMatch ? mimeMatch[1] : null;
            
                        if ([
                            "image/jpeg",
                            "image/png",
                            "application/pdf",
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        ].includes(mime)) {
                            const filepathBuffer = filepath ? Buffer.from(base64filepath, "base64") : null;
                            if (filepathBuffer) {
                                const eventDir = path.join(uploadDir, "filepath")
            
                                if (!fs.existsSync(eventDir)) {
                                    fs.mkdirSync(eventDir, { recursive: true })
                                }
                                const fileExtension = mime ? mime.split("/")[1] : "txt";
                                filepathPath = `${uploadDir}/eventDir/grievanceResponse.${grievanceMasterId}.${fileExtension}`
                                fs.writeFileSync(filepathPath, uploadEventBuffer)
                                filepathPath2 = `/eventDir/grievanceResponse.${grievanceMasterId}.${fileExtension}`
                                let fileName = `grievanceResponse.${grievanceMasterId}.${fileExtension}`
                                let fileType = mime ? mime.split("/")[0] : 'unknown'
                                let createFile = await file.create({
                                    fileName: fileName,
                                    fileType: fileType,
                                    url: filepathPath2,
                                    statusId: 1,
                                    createdDt: now(),
                                    updatedDt: now()
                                })
            
                                if (!createFile) {
                                    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message })
                                }
                                let createFileAttachment = await fileAttachment.create({
                                    entityId: grievanceMasterId,
                                    entityType: entityType,
                                    fileId: createFile.fileId,
                                    statusId: 1,
                                    filePurpose: "Image"
                                })
                            }
                        }
                        else {
                            return res.status(statusCode.BAD_REQUEST.code).json({ message: "Invalid File type for the image" })
                        }
                    }
                }
                catch (error) {
                    if (transaction) await transaction.rollback();

                    console.error('Error creating user park booking:', error);
                    res.status(statusCode.BAD_REQUEST.code).json({
                        message: 'Park booking failed!',
                        data: []
                    })
                }
            }
        }
        else {
            res.status(statusCode.BAD_REQUEST.code).json({
                message: 'Please enter action taken.'
            })
        }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}
//action taken against grievance - end

//create feedback -start
const createFeedback = async (req, res) => {
    try {
        let createFeedback;
        const {
            name,
            mobile,
            email,
            subject,
            feedback,
            isWhatsappNumber
        } = req.body;
        createFeedback = await feedbacks.create({
            name: name,
            mobile: mobile,
            email: email,
            subject: subject,
            feedback: feedback,
            isWhatsappNumber: isWhatsappNumber
        });
        if (createFeedback) {
            return res.status(statusCode.SUCCESS.code).json({
                message: "Feedback created successfully",
            });
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message: "Feedback is not created",
        });

    } catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message,
        });
    }
};
//create feedback -end 

module.exports = {
    addGrievance,
    viewGrievanceList,
    viewGrievanceById,
    createFeedback,
    fetchInitialData,
    actionTaken
}