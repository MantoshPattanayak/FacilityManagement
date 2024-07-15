const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const hosteventdetails = db.hosteventdetails;
const Sequelize = db.Sequelize;
const bankDetails = db.bankdetails;
const hostbooking = db.hostbookings
const eventactivites = db.eventActivities
let usermasters = db.usermaster
const file = db.file;
const fileAttachment = db.fileattachment;
const sendEmail = require('../../../utils/generateEmail')
const mailToken= require('../../../middlewares/mailToken.middlewares');
let imageUpload = require('../../../utils/imageUpload')
const {Op} = require('sequelize')
let user = db.usermaster
let {encrypt} = require('../.../../../../middlewares/encryption.middlewares')
const createHosteventdetails = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let userId = req.user?.userId || 1;
    let createdDt = new Date();
    let updatedDt = new Date();
    let statusId = 1;


    findTheRoleFromTheUserId = await user.findOne({
      where:{
        [Op.and]:[{userId:userId},{statusId:statusId}]
      },
      transaction
    })

    let createHosteventdetails;
    let createBankDetails;
    let createEventActivities;
    let createHostBooking;
    let createFileData;
    let createFileAttachmentData;
    let entityType = 'events'
    let isEntity  = 1 ; // if the user comes first time then put this isEntity value or else put zero
    const {
      organisationPanCardNumber,
      organisationName,
      organisationAddress,
      firstName,
      lastName,
      emailId,
      phoneNo,
      accountType,
      beneficiaryName,
      bankName,
      bankIFSC,
      accountNumber,
      eventCategoryId,
      eventTitle,
      facilityId,
      locationName,
      eventDate,
      eventStartDate,
      eventEndDate,
      descriptionOfEvent,
      isTicketSalesEnabled,
      ticketPrice,
      uploadEventImage,
      additionalFiles,
    } = req.body;
console.log("here Reponse of Host event", req.body)
    let checkIfEntityExist = await usermasters.findOne({
      where:{
       [Op.and]: [{userId:userId},{statusId:statusId},{isEntity:isEntity}]
      }
    })
    if(!checkIfEntityExist){
      let [updateIsEntityInUserMaster] = await usermasters.update({isEntity:isEntity},
      {  
        where:{
          [Op.and]: [{userId:userId},{statusId:statusId}]     
            },
            transaction
          }
      )
      createBankDetails = await bankDetails.create({
        beneficiaryName:beneficiaryName,
        accountNumber:await encrypt(accountNumber),
        accountType:accountType,
        bankName:bankName,
        bankIfscCode:bankIFSC,
        createdBy:userId,
        updatedBy:userId,
        updatedDt:updatedDt,
        createdDt:createdDt
      },
    transaction)
    }
    else if(checkIfEntityExist){
      let findTheBankDetails = await bankDetails.findOne({
        where:{
          [Op.and]:[{createdBy:userId},{statusId:statusId}]
        },
        transaction
      })
      if(findTheBankDetails){
        let bankDetailsObject={};
        if(findTheBankDetails.beneficiaryName!=beneficiaryName){
          bankDetailsObject.beneficiaryName = beneficiaryName
        }
        if(findTheBankDetails.accountNumber!=encrypt(accountNumber)){
          bankDetailsObject.accountNumber = accountNumber
        }
        if(findTheBankDetails.accountType!=accountType){
          bankDetailsObject.accountType = accountType
        }
        if(findTheBankDetails.bankName!=bankName){
          bankDetailsObject.bankName = bankName
        }
        if(findTheBankDetails.bankIfscCode!=bankIFSC){
          bankDetailsObject.bankIfscCode = bankIFSC
        }
        let updateTheBankDetails  = await bankDetails.update(bankDetailsObject,{
          where:{
            [Op.and]:[{statusId:statusId},{createdBy:createdBy}]
          },
          transaction
        })


      }
      else{
        createBankDetails = await bankDetails.create({
        beneficiaryName:beneficiaryName,
        accountNumber:await encrypt(accountNumber),
        accountType:accountType,
        bankName:bankName,
        bankIfscCode:bankIFSC,
        createdBy:userId,
        updatedBy:userId,
        updatedDt:updatedDt,
        createdDt:createdDt
      },
    transaction)
      }

    }
    
  
    
    // Here we will get the event Id by inserting to the event activities table
    createEventActivities = await eventactivites.create({
      facilityId:facilityId,
      eventName:eventTitle,
      eventCategoryId:eventCategoryId,
      locationName:locationName,
      eventDate:eventDate,
      eventStartTime:(eventStartDate.slice(11,-1)),
      eventEndTime:(eventEndDate.slice(11,-1)),
      descriptionOfEvent:descriptionOfEvent,
      ticketSalesEnabled:isTicketSalesEnabled,
      ticketPrice:ticketPrice,
      createdDt:createdDt,
      updatedDt:updatedDt,
      createdBy:userId,
      updatedBy:userId
    },
  transaction)
    if(createEventActivities){
      // then insert to host event tables
        createHosteventdetails = await hosteventdetails.create({
          eventId: createEventActivities.eventId,
          firstName: firstName,
          lastName: lastName,
          organisationPanCardNumber: organisationPanCardNumber,
          emailId: emailId,
          phoneNo: phoneNo,
          userId: userId,
          organisationName: organisationName,
          category: eventCategoryId,
          organisationAddress: organisationAddress,
          eventDate: eventDate,
          eventStartTime: eventStartDate,
          eventEndDate: eventEndDate,
          Description: descriptionOfEvent,
          statusId: statusId,
          createdBy:userId,
          updatedBy:userId,
          createdDt:createdDt,
          updatedDt:updatedDt
        },transaction);
        
    // Image upload work
    let entityType = 'events'
    let serverError = 'something went wrong'
    let insertionData = {
     id:createEventActivities.eventId,
     name:createEventActivities.eventName
    }
    if (uploadEventImage) {
        let errors = [];
        let subDir = "eventDir"
        let filePurpose = "Event Image"
        console.log('326 line event image')
        let uploadSingleEventImage = await imageUpload(uploadEventImage,entityType,subDir,filePurpose,insertionData,userId,errors)
        console.log( uploadSingleEventImage,'328 line event image')
        if(errors.length>0){
          if(errors.some(error => error.includes("something went wrong"))){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
          }
          return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
        }
    }
      if(additionalFiles.length > 0){
        const errors = [];
        let subDir = "eventDir"
        let filePurpose = "Event additional file"
        for (let i = 0; i < additionalFiles.length; i++) {
          const additionalFile = additionalFiles[i];
          let uploadAdditionFile = await imageUpload(additionalFile,entityType,subDir,filePurpose,insertionData,userId,errors)
        }
        if(errors.length>0){
          if(errors.some(error => error.includes("something went wrong"))){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
          }
          return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
        }

      }

    

    //first insert to transaction 
    // second insert to the host booking 
    // Then verify the email of user

    // let insertToTransactions

    // let insertToHostBooking = await hostbooking.create({
    //   hostId: createHosteventdetails.hostId,
    //   transactionId:
    // })

    // for email verification
    // let firstField = emailId;
    // let secondField = phoneNo
    // let Token = await mailToken({firstField,secondField})
    // let verifyUrl = process.env.VERIFY_URL+`?token=${Token}`
    // const message = `Your event has been created.<br><br>
    // This is your emailId <b>${emailId}</b><br>
    // Please use the below link to verify the email address</br></br><a href=${verifyUrl}>
    // <button style=" background-color: #4CAF50; border: none;
    //  color: white;
    //  padding: 15px 32px;
    //  text-align: center;
    //  text-decoration: none;
    //  display: inline-block;
    //  font-size: 16px;">Update Password</button> </a>
    //  </br></br>
    //  This link is valid for 10 mins only  `;
    //   try {
    //       await sendEmail({
    //         email:`${emailId}`,
    //         subject:"please verify the email for your amabhoomi event registration",
    //         html:`<p>${message}</p>`
    //       }
    //       )
    //   } catch (err) {
    //       return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:err.message})
    //   }

    console.log(createHosteventdetails);
    if (createHosteventdetails) {
      return res.status(statusCode.SUCCESS.code).json({
        message: "Host Event created successfully",
      });
    }
    return res.status(statusCode.BAD_REQUEST.code).json({
      message: "Host Event is not created",
    });

    }
    else
    {
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message:"Something went wrong"
      })
    }

  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message,
    });
  }
};
const bankService = async (req, res) => {
  try {
    let bankService = await sequelize.query(`
    SELECT
    id,
    bankName
    FROM 
    amabhoomi.bankservices
    `);

    let findEventCategory =
    await sequelize.query(`select eventCategoryId,eventCategoryName from
  amabhoomi.eventcategorymasters`);

    return res
      .status(statusCode.SUCCESS.code)
      .json({ message: "These are the dropdown data", bankServiceData: bankService[0], eventCategoryData:findEventCategory[0] });
  } catch (err) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

const eventDropdownData = async (req, res) => {
  try {
    let findEventCategory =
      await sequelize.query(`select eventCategoryId,eventName, eventType from
    amabhoomi.eventcategorymasters`);

    return res
      .status(statusCode.SUCCESS.code)
      .json({ message: "Event Category data", data: findEventCategory[0] });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

let findEventHostDetailsData = async (req,res)=>{
  try {
    let userId = req.user?.userId || 1;
    let statusId = 1;
    let checkIfEntityExist = await usermasters.findOne({
      where:{
       [Op.and]: [{userId:userId},{statusId:statusId},{isEntity:isEntity}]
      }
    })
    if(!checkIfEntityExist){
      return res.status(statusCode.SUCCESS.code).json({
        message:`it is not an entity`
      })
    }
    let findOutBankDetails = await bankDetails.findOne({
      where:{
       [Op.and]:[{createdBy:userId},{statusId:statusId}]
      }
    })
    let findOutOrganisationAndContactPersonDetails = await hosteventdetails.findOne(
      {
        where:{
          [Op.and]:[{createdBy:userId},{statusId:statusId}]
        }
      }
    ) 
    return res.status(statusCode.SUCCESS.code).json({
      message:`These are the data that will be exhibited in the event hosting form`,
      bankDetails:findOutBankDetails,
      hosteventdetails:findOutOrganisationAndContactPersonDetails
    })

  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}
module.exports = {
  createHosteventdetails,
  bankService,
  eventDropdownData,
  findEventHostDetailsData
};
