const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const hosteventdetails = db.hosteventdetails;
const Sequelize = db.Sequelize;
const bankDetails = db.bankDetail;
const hostbooking = db.hostbookings
const eventactivites = db.eventactivities
const file = db.file;
const fileAttachment = db.fileattachment;
const sendEmail = require('../../../utils/generateEmail')
const mailToken= require('../../../middlewares/mailToken.middlewares')

let user = db.usermaster
const createHosteventdetails = async (req, res) => {
  try {

    let userId = req.user?.id || 1;

    findTheRoleFromTheUserId = await user.findOne({
      where:{
        [Op.and]:[{userId:userId},{statusId:statusId}]
      }
    })
    let statusId = 1;

    let createHosteventdetails;
    let createBankDetails;
    let createEventActivities;
    let createHostBooking;
    let createFileData;
    let createFileAttachmentData;
    let entityType = 'events'
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
    createBankDetails = await bankDetails.create({
      beneficiaryName:beneficiaryName,
      accountNumber:await encrypt(accountNumber),
      accountType:accountType,
      bankName:bankName,
      bankIfscCode:bankIFSC
    })
    
    // Here we will get the event Id by inserting to the event activities table
    createEventActivities = await eventactivites.create({
      facilityId:facilityId,
      eventName:eventTitle,
      eventCategory:eventCategory,
      locationName:locationName,
      eventDate:eventDate,
      eventStartTime:(eventStartDate.slice(11,-1)),
      eventEndTime:(eventEndDate.slice(11,-1)),
      descriptionOfEvent:descriptionOfEvent,
      ticketSalesEnabled:isTicketSalesEnabled,
      ticketPrice:ticketPrice
    })
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
          category: eventCategory,
          organisationAddress: organisationAddress,
          eventDate: eventDate,
          eventStartTime: eventStartDate,
          eventEndDate: eventEndDate,
          Description: descriptionOfEvent,
          statusId: statusId,
        });
        
    if(uploadEventImage)
      {
      let uploadEventImagePath=null
      let uploadEventImagePath2= null
      const uploadDir = process.env.UPLOAD_DIR
      const base64UploadEventImage = uploadEventImage ? uploadEventImage.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, ""):null;
      const mimeMatch = uploadEventImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)
      const mime = mimeMatch ? mimeMatch[1] : null;

      if([
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(mime)){
        // convert base 64 to buffer for image ir document or set to null if not present
        const uploadEventBuffer = uploadEventImage ? Buffer.from(base64UploadEventImage,"base64"):null;
        if(uploadEventBuffer){
          const eventDir = path.join(uploadDir,"eventImage")

          // ensure the event image directory exists
          if(!fs.existsSync(eventDir)){
            fs.mkdirSync(eventDir,{recursive:true})
          }
          const fileExtension = mime ? mime.split("/")[1]:"txt";
          uploadEventImagePath = `${uploadDir}/eventDir/${eventTitle}${createEventActivities.eventId}.${fileExtension}`
          fs.writeFileSync(uploadEventImagePath,uploadEventBuffer)
          uploadEventImagePath2 = `/eventDir/${eventTitle}${createEventActivities.eventId}.${fileExtension}`
          let fileName = `${eventTitle}${createEventActivities.eventId}.${fileExtension}`
          let fileType = mime ? mime.split("/")[0]:'unknown'
          // insert to file table and file attachment table
          let createFile = await file.create({
            fileName:fileName,
            fileType:fileType,
            url:uploadEventImagePath2,
            statusId:1,
            createdDt:now(),
            updatedDt:now()
          })

          if(!createFile){
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:err.message})
          }
          let createFileAttachment = await fileAttachment.create({
            entityId: createEventActivities.eventId,
            entityType:entityType,
            fileId:createFile.fileId,
            statusId:1,
            filePurpose:"Event Image"
          })
        }
      }
      else{
        return res.status(statusCode.BAD_REQUEST.code).json({message:"Invalid File type for the event image"})
      }
    }
 

    if (additionalFiles && Array.isArray(additionalFiles)) {
      const errors = [];
  
      for (let i = 0; i < additionalFiles.length; i++) {
        const additionalFile = additionalFiles[i];
        let uploadaddtionalFilePath = null;
        let uploadaddtionalFilePath2 = null;
        const uploadDir = process.env.UPLOAD_DIR;
        const base64UploadadditionalFile = additionalFile ? additionalFile.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
        const mimeMatch = additionalFile.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
        const mime = mimeMatch ? mimeMatch[1] : null;
  
        if ([
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(mime)) {
          // convert base 64 to buffer for image or document or set to null if not present
          const uploadaddtionalFileBuffer = additionalFile ? Buffer.from(base64UploadadditionalFile, "base64") : null;
          if (uploadaddtionalFileBuffer) {
            const eventaddtionalFileDir = path.join(uploadDir, "eventAdditionalFile");
  
            // ensure the event image directory exists
            if (!fs.existsSync(eventaddtionalFileDir)) {
              fs.mkdirSync(eventaddtionalFileDir, { recursive: true });
            }
            const fileExtension = mime ? mime.split("/")[1] : "txt";
            uploadaddtionalFilePath = `${uploadDir}/eventaddtionalFileDir/${eventTitle}${createEventActivities.eventId}.${fileExtension}`;
            fs.writeFileSync(uploadaddtionalFilePath, uploadEventBuffer);
            uploadaddtionalFilePath2 = `/eventaddtionalFileDir//${eventTitle}${createEventActivities.eventId}.${fileExtension}`;
            let fileName = `${eventTitle}${createEventActivities.eventId}.${fileExtension}`;
            let fileType = mime ? mime.split("/")[0] : 'unknown';
  
            // insert to file table and file attachment table
            let createFile = await file.create({
              fileName: fileName,
              fileType: fileType,
              url: uploadaddtionalFilePath2,
              statusId: 1,
              createdDt: now(),
              updatedDt: now()
            });
  
            if (!createFile) {
              errors.push(`Failed to create file  for additional file at index ${i}`);
            } else {
              // Insert into file attachment table
              let createFileAttachment = await fileAttachment.create({
                entityId: createEventActivities.eventId,
                entityType: entityType,
                fileId: createFile.fileId,
                statusId: 1,
                filePurpose: "Event additional file"
              });
  
              if (!createFileAttachment) {
                errors.push(`Failed to create file attachment for additional file at index ${i}`);
              }
            }
          }
        } else {
          errors.push(`Invalid File type for additional file at index ${i}`);
        }
      }
  
      if (errors.length > 0) {
        // Handle errors here, you can log them or do any other necessary action.
        console.error("Errors occurred while processing additional files:", errors);
        return res.status(statusCode.BAD_REQUEST.code).json({ errors: errors });
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
        message:err.message
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
    await sequelize.query(`select eventCategoryId,eventName, eventType from
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
module.exports = {
  createHosteventdetails,
  bankService,
  eventDropdownData,
};
