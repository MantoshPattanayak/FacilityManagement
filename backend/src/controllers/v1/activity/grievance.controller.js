const { sequelize, Sequelize } = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const db = require("../../../models");
const grievanceMasters = db.grievancemasters;
const statusMasters = db.statusmaster;
let contactUs = db.contactrequests
const feedbacks = db.feedback
const grievanceCategories = db.grievancecategories;
const path = require('path');
const fs = require('fs');
const imageUpload = require('../../../utils/imageUpload');
let { generateOtp,veriftyOtp } = require("../../../utils/generateandVerifyOtp");
let {Op} =require('sequelize')
let partnerUs = db.partnerwithus
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
        let userId = req.user.userId;

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

        console.log(req.body);

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
                console.log('updateGrievanceResponse');
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

                    let entityType = "grievance";
                    let subDir = "grievance";
                    let filePurpose = "grievanceActionResponse";
                    let insertionData = {
                        id: grievanceMasterId,
                        name: filepath.name.split('.')[0] + '_grievanceActionResponse'
                    }
                    let errors = [];
                    console.log({
                        entityType, subDir, filePurpose, insertionData, userId,
                    })
                    const grievaneFileUpload = await imageUpload(filepath.data, entityType, subDir, filePurpose, insertionData, userId, errors);

                    if(errors.length > 0){
                        if(errors.some(error => error.includes("something went wrong"))){
                          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors});
                        }
                        return res.status(statusCode.BAD_REQUEST.code).json({message:errors});
                    }
                }
                catch (error) {
                    if (transaction) await transaction.rollback();

                    console.error('Error submitting action response:', error);
                    res.status(statusCode.BAD_REQUEST.code).json({
                        message: 'Action response submission failed',
                        data: []
                    })
                }
            }

            res.status(statusCode.SUCCESS.code).json({
                message: 'Action response against grievance submitted successfully.'
            })
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

let contactRequest = async (req,res)=>{
 
    try {
      let updatedDt = new Date();
      let createdDt = new Date();
      let unauthorizedStatusId = 19;
      let {fullName,mobileNo,emailId,message,patner} = req.body

     if(patner ==0){
        let contactRequestData ={
            fullName:fullName,
            mobileNo:mobileNo,
            emailId:emailId,
            statusId:unauthorizedStatusId,
            message:message,
            updatedDt:updatedDt,
            createdDt:createdDt                       
          };
          let createContactRequest = await contactUs.create(contactRequestData)
          console.log('near 384 line')
          if(!createContactRequest){
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:err.message
            })
          }
          return res.status(statusCode.CREATED.code).json({
            message:"Your request is submitted sucessfully"
           })
   
     }
     if(patner ==1){
        let partnerRequestData ={
            fullName:fullName,
            mobileNo:mobileNo,
            emailId:emailId,
            statusId:unauthorizedStatusId,
            message:message,
            updatedDt:updatedDt,
            createdDt:createdDt                       
          };
          let createPartner = await partnerUs.create(partnerRequestData)
          console.log('near 384 line')
          if(!createPartner){
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:err.message
            })
          }
          return res.status(statusCode.CREATED.code).json({
            message:"Your request is submitted sucessfully"
           })
   
     }
      

      //   insert into contact request table
      
    //    if(createContactRequest){
    //     let sendOtp = await generateOtp(mobileNo);
    //     console.log('send otp',sendOtp)
    //     if(sendOtp?.error){
    //         await transaction.rollback();
    //         if(sendOtp?.error== 'Something went wrong '){
    //             return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
    //                 message:err.message
    //             })
    //         }
    //         return res.status(statusCode.BAD_REQUEST.code).json({
    //             message:err.message
    //         })
           
    //     }
    //     await transaction.commit(); // If everything goes well, will do the commit here
    //     return res.status(statusCode.CREATED.code).json({
    //         message:"Your request is submitted sucessfully. Kindly verify your mobile number"
    //        })
    //    }
    //    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
    //     message:err.message
    //   })
    } catch (err) {
        if(transaction) await transaction.rollback();
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message:err.message
      })
    }
  }

// view feedback list - start
let viewFeedbackList = async (req, res) => {
    try {
        let givenReq = req.body.givenReq ? req.body.toLowerCase() : null;
        let fetchFeedbackList = await feedbacks.findAll();

        let matchedData = fetchFeedbackList;
        if(givenReq) {
            matchedData = matchedData.filter((data) => {
                return data.name.toLowerCase().includes(givenReq) ||
                data.mobile.includes(givenReq) ||
                data.email.toLowerCase().includes(givenReq) ||
                data.subject.toLowerCase().includes(givenReq) ||
                data.feedback.toLowerCase().includes(givenReq)
            });
        }

        if(fetchFeedbackList.length > 0) {
            res.status(statusCode.SUCCESS.code).json({
                message: 'Feedback list',
                data: matchedData
            })
        }
        else {
            res.status(statusCode.NOTFOUND.code).json({

            })
        }
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}
// view feedback list - end

// view feedback details by id - start
let viewFeedbackById = async (req, res) => {
    try {
        let feedbackId = req.params.feedbackId;
        let fetchFeedbackDetailsById = await feedbacks.findOne({
            where: {
                feedbackId: feedbackId
            }
        });

        if(fetchFeedbackDetailsById.length > 0) {
            res.status(statusCode.SUCCESS.code).json({
                message: 'Feedback list',
                data: fetchFeedbackDetailsById
            })
        }
        else {
            res.status(statusCode.NOTFOUND.code).json({
                message: "No data found"
            })
        }
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}
// view feedback details by id - end

module.exports = {
    addGrievance,
    viewGrievanceList,
    viewGrievanceById,
    createFeedback,
    fetchInitialData,
    actionTaken,
    contactRequest,
    viewFeedbackList,
    viewFeedbackById
}
