const statusCode = require("../../../utils/statusCode");
const db = require("../../../models");
let sequelize = db.sequelize;
let Sequelize = db.Sequelize
const QueryTypes = db.QueryTypes;
const grievanceMasters = db.grievancemasters;
const statusMasters = db.statusmaster;
let contactUs = db.contactrequests
const feedbacks = db.feedback
const grievanceCategories = db.grievancecategories;
const path = require('path');
const fs = require('fs');
const imageUpload = require('../../../utils/imageUpload');
let { generateOtp,veriftyOtp } = require("../../../utils/generateandVerifyOtp");
let { Op } =require('sequelize')
let partnerUs = db.partnerwithus
let advertisementTariff = db.advertisementTariff
let advertisementdetail = db.advertisementDetails
let advertisementMasters = db.advertisementMasters
const logger = require('../../../logger/index.logger')

// insert grievance - start
const addGrievance = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let userId = req.user?.userId || null;
        let createGrievance;
        const {
            fullname,
            emailId,
            phoneNo,
            subject,
            details,
            statusId,
            filepath,
            isWhatsappNumber,
            assetId,
            assetTypeId
        } = req.body;
      
        createGrievance = await grievanceMasters.create({
            fullname: fullname,
            emailId: emailId,
            phoneNo: phoneNo,
            subject: subject,
            details: details,
            statusId: statusId,
            isWhatsappNumber: isWhatsappNumber,
            createdOn: new Date(),
            createdBy: userId,
            assetId: assetId,
            assetTypeId: assetTypeId
        },{
            transaction
        }
    );
        if (filepath && createGrievance) {
            let errors = [];
            let entityType = 'grievances'
            let subDir = "grievanceDir"
            let filePurpose = "grievanceImage"
            let insertionData = {
                id:createGrievance.grievanceMasterId,
                name:createGrievance.subject
               }
            let uploadGrievanceFile = await imageUpload(filepath,entityType,subDir,filePurpose,insertionData,userId,errors, 1, transaction)
            if(errors.length>0){
                await transaction.rollback();
                if(errors.some(error => error.includes("something went wrong"))){
                  return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
                }
                return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
              }
            // let filepathPath = null
            // let filepathPath2 = null
            // const uploadDir = process.env.UPLOAD_DIR
            // const base64filepath = filepath ? filepath.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
            // const mimeMatch = filepath.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)
            // const mime = mimeMatch ? mimeMatch[1] : null;

            // if ([
            //     "image/jpeg",
            //     "image/png",
            //     "application/pdf",
            //     "application/msword",
            //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            // ].includes(mime)) {
            //     const filepathBuffer = filepath ? Buffer.from(base64filepath, "base64") : null;
            //     if (filepathBuffer) {
            //         const eventDir = path.join(uploadDir, "filepath")

            //         if (!fs.existsSync(eventDir)) {
            //             fs.mkdirSync(eventDir, { recursive: true })
            //         }
            //         const fileExtension = mime ? mime.split("/")[1] : "txt";
            //         filepathPath = `${uploadDir}/eventDir/grievance.${createGrievance.grievanceMasterId}.${fileExtension}`
            //         fs.writeFileSync(filepathPath, uploadEventBuffer)
            //         filepathPath2 = `/eventDir/grievance.${createGrievance.grievanceMasterId}.${fileExtension}`
            //         let fileName = `grievance.${createGrievance.grievanceMasterId}.${fileExtension}`
            //         let fileType = mime ? mime.split("/")[0] : 'unknown'
            //         let createFile = await file.create({
            //             fileName: fileName,
            //             fileType: fileType,
            //             url: filepathPath2,
            //             statusId: 1,
            //             createdDt: now(),
            //             updatedDt: now()
            //         })

            //         if (!createFile) {
            //             return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message })
            //         }
            //         let createFileAttachment = await fileAttachment.create({
            //             entityId: createGrievance.grievanceMasterId,
            //             entityType: entityType,
            //             fileId: createFile.fileId,
            //             statusId: 1,
            //             filePurpose: "Image"
            //         })
            //     }
            // }
            // else {
            //     return res.status(statusCode.BAD_REQUEST.code).json({ message: "Invalid File type for the image" })
            // }
        }
        if (createGrievance) {
            await transaction.commit();
            return res.status(statusCode.SUCCESS.code).json({
                message: "Grievance is received successfully!",
            });
        }
        await transaction.rollback();

        return res.status(statusCode.BAD_REQUEST.code).json({
            message: "Grievance is not submitted",
        });
    } catch (error) {
        if(transaction) await transaction.rollback();
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
        let userId = req.user?.userId ? req.user?.userId : null;
        console.log(1)
        const {
            name,
            mobile,
            email,
            subject,
            feedback,
            isWhatsappNumber,
            assetId,
            assetTypeId
        } = req.body;
        console.log({
            name,
            mobile,
            email,
            subject,
            feedback,
            isWhatsappNumber,
            assetId,
            assetTypeId
        })
        createFeedback = await feedbacks.create({
            name: name,
            mobile: mobile,
            email: email,
            subject: subject,
            feedback: feedback,
            isWhatsappNumber: isWhatsappNumber,
            createdOn: new Date(),
            createdBy: userId,
            assetId: assetId,
            assetTypeId: assetTypeId
        });
        if (createFeedback) {
            return res.status(statusCode.SUCCESS.code).json({
                message: "Feedback is received successfully.",
            });
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message: "Feedback is not submitted.",
        });

    } catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
        logger.error(`An error occurred: ${err.message}`); // Log the error

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
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}
// view feedback details by id - end


// advertisement api
// create advertisement tariff 

let advertisementTariffInsert = async (req,res)=>{
    try {
        let {advertisementTypeId, durationOption, amount, minDuration, maxDuration} = req.body
        let statusId =1; 
        let userId = req.user.userId
        let createdDt = new Date();
        let updatedDt = new Date();
        
        let checkIfThisAdvertisementTariffExist = await advertisementTariff.findOne({
            where:{
                [Op.and]:[{statusId:statusId},{durationOption:durationOption},{amount:amount},{advertisementTypeId:advertisementTypeId},{minduration:{[Op.lte]:[minDuration]}},{maxDuration:{[Op.gte]:[minDuration]}}]
            }
        })

        if(checkIfThisAdvertisementTariffExist){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:`This tariff is already exist. Please deactivate the existing tariff to set a new one`
            })
        }
        let createTariffData={
            statusId:statusId,
            advertisementTypeId:advertisementTypeId,
            durationOption:durationOption,
            amount:amount,
            minDuration:minDuration,
            maxDuration:maxDuration,
            updatedDt:updatedDt,
            createdDt:createdDt,
            updatedBy:userId,
            createdBy:userId
        }

        let createTariff = await advertisementTariff.create(createTariffData)
        if(!createTariff){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:`Something went wrong`
            })
        }
        return res.status(statusCode.SUCCESS.code).json({message:`Created successfully`})
    } catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

let advertisementMasterInsert = async (req,res)=>{
    try {
        console.log('12')
        let {advertisementType, description,durationOption} = req.body
        let statusId =1; 
        let userId = req.user.userId
        console.log('userid',userId)
        durationOption=durationOption.join(',')
        let createdDt = new Date();
        let updatedDt = new Date();
        
        let checkIfThisAdvertisementExist = await advertisementMasters.findOne({
            where:{
                [Op.and]:[{statusId:statusId},{[Op.and]:[sequelize.where(sequelize.fn('LOWER',sequelize.col('advertisementType')),advertisementType.toLowerCase())]}]
            }
        })

        if(checkIfThisAdvertisementExist){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:`This advertisement type is  already exist.`
            })
        }
        let createData={
            statusId:statusId,
            advertisementType:advertisementType,
            description:description,
            updatedDt:updatedDt,
            createdDt:createdDt,
            updatedBy:userId,
            createdBy:userId,
            durationOption:durationOption
        }

        let createAdvertisement = await advertisementMasters.create(createData)
        if(!createAdvertisement){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:`Something went wrong`
            })
        }
        return res.status(statusCode.SUCCESS.code).json({message:`Created successfully`})
    } catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

let updateAdvertisementInsert = async (req,res)=>{
    try {
        console.log('12')

        let {advertisementType, description,durationOption,advertisementTypeId,statusId} = req.body
        let userId = req.user.userId
        console.log('userid',userId)

        let updatedDt = new Date();
        let findAdvertisementTypeId = await advertisementMasters.findOne({
            where:{
                advertisementTypeId:advertisementTypeId
            }
        })
        if(!findAdvertisementTypeId){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:`Something went wrong`
            })
        }
        let updateAdvertisementMasterData = {}
        if(findAdvertisementTypeId.advertisementType!=advertisementType){
            let checkIfThisAdvertisementExist = await advertisementMasters.findOne({
                where:{
                    [Op.and]:[{statusId:statusId},{[Op.and]:[sequelize.where(sequelize.fn('LOWER',sequelize.col('advertisementType')),advertisementType.toLowerCase())]}]
                }
            })
    
            if(checkIfThisAdvertisementExist){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:`This advertisement type is  already exist.`
                })
            }

            updateAdvertisementMasterData.advertisementType = advertisementType
        }
        if(findAdvertisementTypeId.description!=description){
            updateAdvertisementMasterData.description = description

        }
        if(findAdvertisementTypeId.durationOption != durationOption){
            durationOption=durationOption.join(',')
            updateAdvertisementMasterData.durationOption = durationOption
        }
        if(findAdvertisementTypeId.statusId != statusId){
            updateAdvertisementMasterData.statusId = statusId
        }
       
      

       
        if(Object.keys(updateAdvertisementMasterData).length>0){
            updateAdvertisementMasterData.updatedBy = userId;
            updateAdvertisementMasterData.updatedDt = updatedDt;
            console.log(updateAdvertisementMasterData,'data variable of advertisement')
            let [updateAdvertisement] = await advertisementMasters.update(updateAdvertisementMasterData,{
                where:{
                    advertisementTypeId:advertisementTypeId
                }
            })
            if(updateAdvertisement>0){
                return res.status(statusCode.SUCCESS.code).json({
                    message:`Data updated successfully `
                })
            }
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:`Something went wrong`
            })
          
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message:`Data is not updated`
        })
    } catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

let viewAdvertisementMaster = async (req,res)=>{
    try {
        console.log('all data')
        let givenReq = req.body.givenReq ? req.body.givenReq : null; // Convert givenReq to lowercase
        let limit = req.body.page_size ? req.body.page_size : 500;
  
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let filteredData
        let statusId =1
        let viewAdvertisementMaster = await advertisementMasters.findAll({
            where:{
               statusId:statusId
            }
        })

        if(givenReq){ 
            givenReq = givenReq.toLowerCase(); 
            filteredData = viewAdvertisementMaster.filter((eachData)=>
                eachData.advertisementType.toLowerCase().includes(givenReq)
            )
        }
        else{
            filteredData = viewAdvertisementMaster
        }
        let paginatedData = filteredData.slice(offset, offset + limit);

        return res.status(statusCode.SUCCESS.code).json({
            message:`Advertisement master data`,
            data:paginatedData
        })
        }
       
     catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

let viewAdvertisementTariffData = async (req,res)=>{
    try {
        console.log('all data')
        let givenReq = req.body.givenReq ? req.body.givenReq : null; // Convert givenReq to lowercase
        let limit = req.body.page_size ? req.body.page_size : 500;
  
        let page = req.body.page_number ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let filteredData
        let statusId =1
        let viewAdvertisementMaster = await sequelize.query(
            `SELECT am.advertisementTypeId, am.advertisementType, am.description, 
                    atm.durationOption, atm.minDuration, atm.maxDuration, atm.advertisementTariffId,
                    atm.amount,(select statusCode from amabhoomi.statusmasters where statusId = atm.statusId) as statusCode,
                    atm.statusId, atm.createdBy, atm.createdDt, atm.updatedBy, atm.updatedDt 
             FROM amabhoomi.advertisementtypemasters am
             INNER JOIN advertisementtariffmasters atm ON atm.advertisementTypeId = am.advertisementTypeId
             where atm.statusId = ? and am.statusId = ?`,{
                type:QueryTypes.SELECT,
                replacements:[statusId, statusId]
             }
           
        );
        
        if(givenReq){ 
            givenReq = givenReq.toLowerCase(); 
            filteredData = viewAdvertisementMaster.filter((eachData)=>
                eachData.advertisementType.toLowerCase().includes(givenReq)
            )
        }
        else{
            filteredData = viewAdvertisementMaster
        }
        let paginatedData = filteredData.slice(offset, offset + limit);

        return res.status(statusCode.SUCCESS.code).json({
            message:`Advertisement tariff data`,
            data:paginatedData
        })
        }
       
     catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

let updateAdvertisementTariffData = async (req,res)=>{

    try {
        let {advertisementTariffId,advertisementTypeId, durationOption, amount, minDuration, maxDuration,statusId}=req.body

       console.log('req body', req.body)
        let userId = req.user.userId
        let updateAdvertisementDataVariable={};
        let updatedDt = new Date();
        let findTheAdvertisementTariffData = await advertisementTariff.findOne({
            where:{
                advertisementTariffId:advertisementTariffId
            }
        })
        if(!findTheAdvertisementTariffData){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:'Something went wrong'
            })
        }
        if(advertisementTypeId && findTheAdvertisementTariffData.advertisementTypeId != advertisementTypeId){
            let checkIfThisAdvertisementTariffExist = await advertisementTariff.findOne({
                where:{
                    [Op.and]:[{statusId:statusId},{durationOption:durationOption},{amount:amount},{advertisementTypeId:advertisementTypeId},{minduration:{[Op.lte]:[minDuration]}},{maxDuration:{[Op.gte]:[minDuration]}}]
                }
            })
            if(checkIfThisAdvertisementTariffExist){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:`This tariff is already exist. Please deactivate the existing tariff to set a new one`
                })
            }
            updateAdvertisementDataVariable.advertisementTypeId = advertisementTypeId
        }
        if(durationOption && findTheAdvertisementTariffData.durationOption != durationOption){

            let checkIfThisAdvertisementTariffExist = await advertisementTariff.findOne({
                where:{
                    [Op.and]:[{statusId:statusId},{durationOption:durationOption},{amount:amount},{advertisementTypeId:advertisementTypeId},{minduration:{[Op.lte]:[minDuration]}},{maxDuration:{[Op.gte]:[minDuration]}}]
                }
            })
            if(checkIfThisAdvertisementTariffExist){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:`This tariff is already exist. Please deactivate the existing tariff to set a new one`
                })
            }
            updateAdvertisementDataVariable.durationOption = durationOption
            console.log('duration option ',updateAdvertisementDataVariable.durationOption )

        }
        if(minDuration && findTheAdvertisementTariffData.minDuration != minDuration){
            console.log('minduration inside')
            let checkIfThisAdvertisementTariffExist = await advertisementTariff.findOne({
                where:{
                    [Op.and]:[{statusId:statusId},{durationOption:durationOption},{amount:amount},{advertisementTypeId:advertisementTypeId},{minduration:{[Op.lte]:[minDuration]}},{maxDuration:{[Op.gte]:[minDuration]}}]
                }
            })
            if(checkIfThisAdvertisementTariffExist){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:`This tariff is already exist. Please deactivate the existing tariff to set a new one`
                })
            }
            updateAdvertisementDataVariable.minDuration = minDuration

        }
        if(maxDuration && findTheAdvertisementTariffData.maxDuration != maxDuration ){
            updateAdvertisementDataVariable.maxDuration = maxDuration

        }

        if(statusId && findTheAdvertisementTariffData.statusId != statusId ){
            updateAdvertisementDataVariable.statusId = statusId

        }
     

        if(Object.keys(updateAdvertisementDataVariable).length>0){
            updateAdvertisementDataVariable.updatedBy = userId;
            updateAdvertisementDataVariable.updatedDt = updatedDt
            console.log('update tariff data variable', updateAdvertisementDataVariable)
            let [updateTariff] = await advertisementTariff.update(updateAdvertisementDataVariable,{
                where:{
                    advertisementTariffId:advertisementTariffId
                }
            })
            if(updateTariff>0){
                return res.status(statusCode.SUCCESS.code).json({message:`Data  updated successfully`})
            }
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:`Something went wrong`
            })
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message:`Data not updated`
        })
      
       
    } catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}


let insertToAdvertisementDetails = async (req,res)=>{
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let {advertisementTypeId, advertisementName, message, startDate, endDate, amount,advertisementImage} = req.body
        console.log(req.body,'req.body')
        
        let statusId = 10; 
        let userId = req.user.userId
        let createdDt = new Date();
        let updatedDt = new Date();
        

      
        let createTariffData={
            statusId:statusId,
            advertisementTypeId:advertisementTypeId,
            advertisementName:advertisementName,
            amount:amount,
            message:message,
            startDate:startDate,
            endDate:endDate,
            updatedDt:updatedDt,
            createdDt:createdDt,
            updatedBy:userId,
            createdBy:userId
        }

        let createTariff = await advertisementdetail.create(createTariffData,{transaction})
        console.log('create tariff', createTariff)
        if(!createTariff){
            await transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:`Something went wrong`
            })
        }
        if(advertisementImage){
            let insertionData = {
                id:createTariff.advertisementDetailId,
                name:createTariff.advertisementName,
               }
              // create the data
              let entityType = 'advertisement'
              let errors = [];
              let subDir = "advertisementDir"
              let filePurpose = "advertisementImages"
              let uploadSingleAdvertisementImage = await imageUpload(advertisementImage,entityType,subDir,filePurpose,insertionData,userId,errors, 1, transaction)
              console.log( uploadSingleAdvertisementImage,'165 line facility image')
              if(errors.length>0){
                await transaction.rollback();
                if(errors.some(error => error.includes("something went wrong"))){
                  return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
                }
                return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
              }
        }
        
        return res.status(statusCode.SUCCESS.code).json({message:`Created successfully`})
    } catch (err) {
        if(transaction) await transaction.rollback()
            logger.error(`An error occurred: ${err.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}




let actionForAdvertisement = async (req,res)=>{
    try {
        let {advertisementDetailId,statusId}=req.body
        let [performTheAction] = await advertisementdetail.update({statusId:statusId},
            {where:{
                advertisementDetailId:advertisementDetailId
            }}
        )
        if(performTheAction==0){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:err.message
            })
        }

        return res.status(statusCode.SUCCESS.code).json({
            message:`Data successfully updated`
        })
    } catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error

            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message:err.message
            })
    }
}

let initialTariffDropdownData = async(req,res)=>{
    try {
        let {advertisementTypeId,startDate,endDate}= req.body
        let statusId = 1;

        let findAllDropDownData = ["day","month","week","campaign","issue","post"]
        let fetchAllAdvertisementData = await advertisementMasters.findAll({
            where:{
                statusId:statusId
            }
        })
           if(startDate && endDate && advertisementTypeId ){
            let amount = 0;
            // calculate the amount
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            let difference = endDate.getTime() - startDate.getTime();
            let days = Math.round(difference/(1000*60*60*24));
            console.log('days',days)
            let findTheTariffType = await sequelize.query(`select * from amabhoomi.advertisementtariffmasters where advertisementTypeId = ? and statusId =?`,{
                type:QueryTypes.SELECT,
                replacements:[advertisementTypeId, statusId]
            })
           let amountCheck =  findTheTariffType.filter((eachData)=>{
                if(eachData.durationOption==='day'){
                    let predefinedDays =  eachData.maxDuration - eachData.minDuration
                    if(predefinedDays == days){
                        return eachData.amount = eachData.amount
                    }
                    else{
                        
                            let findEachDayAmount =  Math.ceil((eachData.amount/predefinedDays))
                            return eachData.amount = Math.ceil(days * findEachDayAmount)
                        
                      
                    }
                 
                }
                else if(eachData.durationOption ==='week'){
                   return eachData.amount = Math.ceil((days/7)*eachData.amount)
                }
                else if(eachData.durationOption ==='month'){
                   return eachData.amount = Math.ceil((days/30)*eachData.amount)
                }
                else if(eachData.durationOption ==='campaign'){
                    return eachData.amount = eachData.amount
                }
                else if(eachData.durationOption ==='issue'){
                  return  eachData.amount = eachData.amount
                }
                else if(eachData.durationOption ==='post'){
                return eachData.amount = eachData.amount
                }
            })

            if(amountCheck.length>1){
                // console.log('amountcheck1',amountCheck.amount)
                let amounts = amountCheck.map(item => item.amount);
                console.log('amountchecks',amounts)
                amount = Math.min(...amounts)
                console.log('amount',amount)
                return res.status(statusCode.SUCCESS.code).json({
                    message:`Here is the amount`,
                    data:amount
                })
            }
            console.log('amountcheck value',amount,amountCheck,typeof(amountCheck))
            amount = amountCheck[0].amount
            return res.status(statusCode.SUCCESS.code).json({
                message:`Here is the amount`,
                data:amount
            })
           }
        
        if(advertisementTypeId){
            let findTheDropdown = await advertisementMasters.findOne({
                where:{
                    [Op.and]:[{statusId:statusId},{advertisementTypeId:advertisementTypeId}]
                }
            })
            if(!findTheDropdown){
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                    message:'Something went wrong'
                })
            }
            findAllDropDownData = findTheDropdown.durationOption.split(',')
        }
        return res.status(statusCode.SUCCESS.code).json({
            message:"These are all dropdown data",
            data : findAllDropDownData,
            advertisementData : fetchAllAdvertisementData
        })
    } catch (err) {
        logger.error(`An error occurred: ${err.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

//  advertisement api end
module.exports = {
    addGrievance,
    viewGrievanceList,
    viewGrievanceById,
    createFeedback,
    fetchInitialData,
    actionTaken,
    contactRequest,
    viewFeedbackList,
    viewFeedbackById,
    advertisementTariffInsert,
    advertisementMasterInsert,
    viewAdvertisementMaster,
    viewAdvertisementTariffData,
    updateAdvertisementTariffData,
    updateAdvertisementInsert,
    initialTariffDropdownData,
    insertToAdvertisementDetails,
    actionForAdvertisement
    
}
