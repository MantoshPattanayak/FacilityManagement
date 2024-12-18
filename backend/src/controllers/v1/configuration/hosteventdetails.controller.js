const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const hosteventdetails = db.hosteventdetails;
const Sequelize = db.Sequelize;
const bankDetails = db.bankdetails;
const hostbooking = db.hosteventbookings
const eventactivites = db.eventActivities
let usermasters = db.usermaster
const file = db.file;
const fileAttachment = db.fileattachment;
const sendEmail = require('../../../utils/generateEmail')
const mailToken= require('../../../middlewares/mailToken.middlewares');
let imageUpload = require('../../../utils/imageUpload')
const {Op} = require('sequelize')
let user = db.usermaster
const logger = require('../../../logger/index.logger')

let {encrypt} = require('../.../../../../middlewares/encryption.middlewares')

const createHosteventdetails = async (entityTypeId,facilityPreference,orderId,userId,transaction) => {
  try {
    console.log('inside create host event details')
    let createdDt = new Date();
    let updatedDt = new Date();
    let statusId = 1;
    let hostStatus = 10;
    let paymentStatus = 26;
    let checkStatusIfExist = [10,11]
    findTheRoleFromTheUserId = await user.findOne({
      where:{
        [Op.and]:[{userId:userId},{statusId:statusId}]
      },
      transaction
    })

    let createHosteventdetails;
    let createBankDetails;
    let createEventActivities;
    let entityType = 'events'
    let isEntity  = 1 ; // if the user comes first time then put this isEntity value or else put zero

    console.log('232323232')
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
      eventCategory,
      eventTitle,
      facilityId,
      locationofEvent,
      eventDate,
      startEventDate,
      endEventDate,
      descriptionofEvent,
      ticketsold,
      price,
      amount,
      uploadEventImage,
      additionalFiles,
      numberofTicket
    } = facilityPreference;

    console.log( "here reqbody of Host event",organisationPanCardNumber,
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
      eventCategory,
      eventTitle,
      facilityId,
      locationofEvent,
      eventDate,
      startEventDate,
      endEventDate,
      descriptionofEvent,
      ticketsold,
      price,
      amount,
      numberofTicket )

    let checkIfEntityExist = await usermasters.findOne({
      where:{
       [Op.and]: [{userId:userId},{statusId:statusId},{isEntity:isEntity}]
      },
     transaction
    })
    console.log('before check booking checkIfEntityExist',checkStatusIfExist, facilityId, eventDate, startEventDate);
    // check if any event is gonna happen in same  date or not
    // let checkHostBooking = await hostbooking.findOne({
    //   where:{[Op.and]:[{statusId:{[Op.or]:[hostStatus,confirmedStatus]}},{facilityId:facilityId}]},
    //   transaction
    // })
    let checkHostBooking = await sequelize.query(`select * from amabhoomi.hostbookings where statusId in (:checkStatusIfExist) and facilityId=:facilityId and bookingDate = :eventDate and startDate <= :startEventDate and endDate>= :startEventDate`,{
      replacements:{
        checkStatusIfExist,
        facilityId:facilityId,
        eventDate:eventDate,
        startEventDate:startEventDate,
        endEventDate:startEventDate
      },
      type:QueryTypes.SELECT})

    console.log('check host booking length')
    if(checkHostBooking.length > 0){
      console.log(2343,'inside host booking check if the event is already there for same day')
      await transaction.rollback();
      return {
        error:`This date is already booked for other events`
      }
      
    }
    if(!checkIfEntityExist){
      let [updateIsEntityInUserMaster] = await usermasters.update({isEntity:isEntity},
      {  
        where:{
          [Op.and]: [{userId:userId},{statusId:statusId}]     
            },
            transaction
          }
      )
      if(updateIsEntityInUserMaster==0){
        await transaction.rollback();
        return {
          error:`Something went wrong`
        }
      }
      createBankDetails = await bankDetails.create({
        beneficiaryName:encrypt(beneficiaryName),
        accountNumber:await encrypt(accountNumber),
        accountType:await encrypt(accountType),
        bankName:encrypt(bankName),
        bankIfscCode:encrypt(bankIFSC),
        createdBy:userId,
        updatedBy:userId,
        updatedDt:updatedDt,
        createdDt:createdDt
      },
   { transaction})

    if(!createBankDetails){

      await transaction.rollback();
        return {
          error:`Something went wrong`
        }
    }
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
        if(Object.keys(bankDetailsObject).length>0){
          bankDetailsObject.updatedBy = userId
          bankDetailsObject.updatedDt = updatedDt
          let [updateTheBankDetails]  = await bankDetails.update(bankDetailsObject,{
            where:{
              [Op.and]:[{statusId:statusId},{createdBy:createdBy}]
            },
            transaction
          })
          if(updateTheBankDetails==0){
            await transaction.rollback();
            return {
            error:`Something went wrong`
            }
          
        }
        }
       
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
    {transaction})
    if(!createBankDetails){

      await transaction.rollback();
      return {
        error:`Something went wrong`
        }

    }
      }

    }
    
  
    
    // Here we will get the event Id by inserting to the event activities table
    createEventActivities = await eventactivites.create({
      facilityId:facilityId,
      eventName:eventTitle,
      eventCategoryId:eventCategory,
      locationName:locationofEvent,
      eventDate:eventDate,
      eventStartTime:startEventDate,
      eventEndTime:endEventDate,
      descriptionOfEvent:descriptionofEvent,
      ticketSalesEnabled:ticketsold,
      ticketPrice:price,
      numberOfTickets:numberofTicket,
      createdDt:createdDt,
      updatedDt:updatedDt,
      createdBy:userId,
      updatedBy:userId,
      statusId: 1
    },
  {transaction})
    if(createEventActivities){
      // then insert to host event tables
        createHosteventdetails = await hosteventdetails.create({
          eventId: createEventActivities.eventId,
          firstName: firstName,
          lastName: lastName,
          pancardNumber: organisationPanCardNumber,
          emailId: emailId,
          phoneNo: phoneNo,
          userId: userId,
          organisationName: organisationName,
          category: eventCategory,
          organisationAddress: organisationAddress,
          eventDate: eventDate,
          eventStartTime: startEventDate,
          eventEndDate: endEventDate,
          Description: descriptionofEvent,
          statusId: statusId,
          createdBy:userId,
          updatedBy:userId,
          createdDt:createdDt,
          updatedDt:updatedDt
        },{transaction,returning:true});
        
        if(!createHosteventdetails){
          await transaction.rollback();
          return {
            error:` Something went wrong `
          }
        }
    // Image upload work
    let serverError = 'Something went wrong'
    let insertionData = {
     id:createEventActivities.eventId,
     name:createEventActivities.eventName
    }
    if (uploadEventImage) {
        let errors = [];
        let subDir = "eventDir"
        let filePurpose = "Event Image"
        console.log('326 line event image')
        let uploadSingleEventImage = await imageUpload(uploadEventImage,entityType,subDir,filePurpose,insertionData,userId,errors,1,transaction)
        console.log( uploadSingleEventImage,'328 line event image')
        if(errors.length>0){
          await transaction.rollback();
          if(errors.some(error => error.includes("Something went wrong"))){
            return {
              error:errors[0]
              }
          
          }
          return {
            error:errors[0]
            }
        }
    }
      if(additionalFiles.length > 0){
        const errors = [];
        let subDir = "eventSubDir"
        let filePurpose = "Event additional file"
        for (let i = 0; i < additionalFiles.length; i++) {
          const additionalFile = additionalFiles[i];
          let uploadAdditionFile = await imageUpload(additionalFile,entityType,subDir,filePurpose,insertionData,userId,errors,i+1,transaction)
        }
        if(errors.length>0){
          await transaction.rollback();
          if(errors.some(error => error.includes("something went wrong"))){
            return {
              error:errors[0]
              }
          }
          return {
            error:errors[0]
            }
        }

      }

    console.log(createHosteventdetails);
    if (createHosteventdetails) {
      
      // insert to host booking 
      // insert one transaction id after the payment getting successfull
      let hostBookingData = await hostbooking.create({
        hostId:createHosteventdetails.hostId,
        orderId:orderId,
        amount:amount,
        paymentstatus:paymentStatus,
        bookingDate:eventDate,
        startDate:startEventDate,
        endDate:endEventDate,
        statusId:hostStatus,
        createdBy:userId,
        updatedBy: userId,
        createdDt:createdDt,
        updatedDt:updatedDt,
        facilityId:facilityId
        
      },{transaction})
      console.log(hostBookingData, 'host booking data ')
      if(hostBookingData){
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
    //       await transaction.rollback();
    //       return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:err.message})
    //   }
        console.log('inside host event details end part')
        return {
          bookingId: hostBookingData.hostBookingId,
          entityId:createEventActivities.eventId
          }
      }
    
      await transaction.rollback();
      return {
        error:"Host Event is not created "
        }
      
    }
    
    await transaction.rollback();
    return {
      error:"Host Event is not created "
      }
  

    }
    else
    {
      await transaction.rollback();
      return {
        error:"Something went wrong"
        }
    }

  } catch (error) {
    
    if(transaction) await transaction.rollback();
    return {
      error:"Something went wrong"
      }
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
    logger.error(`An error occurred: ${err.message}`); // Log the error
    res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

const eventDropdownData = async (req, res) => {
  try {
    let { facilityId }=req.body;
    let findEventCategoryQuery = `select e.facilityId,em.eventCategoryId,em.eventCategoryName,em.eventCategoryId  from amabhoomi.facilityevents   e inner join eventcategorymasters em on e.eventCategoryId = em.eventCategoryId 
        `
        let findFacilityDetails = `select facilityname,facilityId,facilityTypeId,address from amabhoomi.facilities`
        if(facilityId){
            findEventCategoryQuery +=` where e.facilityId = ?`
            let findEventCategory =
            await sequelize.query(findEventCategoryQuery,{
            replacements:[facilityId],
            type:QueryTypes.SELECT
          });

        findFacilityDetails += ` where facilityId = ?`
        let facilityDetails = await sequelize.query(findFacilityDetails,{
          replacements:[facilityId],
          type:QueryTypes.SELECT
          });
    return res
      .status(statusCode.SUCCESS.code)
      .json({ message: "Event Category data", data: findEventCategory, facilityData:facilityDetails });
        }

         let findEventCategory = await sequelize.query(findEventCategoryQuery,{type:QueryTypes.SELECT});

        let facilityDetails = await sequelize.query(findFacilityDetails,{type:QueryTypes.SELECT}); 

    return res
      .status(statusCode.SUCCESS.code)
      .json({ message: "Event Category data", data: findEventCategory, faciltyData:facilityDetails });
    
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`); // Log the error
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
    logger.error(`An error occurred: ${err.message}`); // Log the error
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
