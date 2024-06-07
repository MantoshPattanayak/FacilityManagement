const { sequelize, Sequelize } = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const db = require("../../../models");
const statusMasters = db.statusmaster;
const promotion = db.promotions
const createPromotion = async (req, res) => {
    try {
      let createPromotion;
      const {
        name, 
        email,
        offcialContactNumber,
        officialAddress,
        duration,
        imageUrl,
        statusId,
        paymentDone,
        transactionId
     } = req.body;
      if(createPromotion) {
      createPromotion = await promotion.create({
        name : name, 
        email : email,
        offcialContactNumber : offcialContactNumber,
        officialAddress : officialAddress,
        duration : duration,
        statusId : statusId,
        paymentDone : paymentDone,
        transactionId : transactionId
         
        });
        // if(imageUrl)
        //   {
        //   let uploadEventImagePath=null
        //   let uploadEventImagePath2= null
        //   const uploadDir = process.env.UPLOAD_DIR
        //   const base64UploadEventImage = uploadEventImagePath ? uploadEventImagePath.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, ""):null;
        //   const mimeMatch = uploadEventImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)
        //   const mime = mimeMatch ? mimeMatch[1] : null;
    
        //   if([
        //     "image/jpeg",
        //     "image/png",
        //     "application/pdf",
        //     "application/msword",
        //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        //   ].includes(mime)){
        //     // convert base 64 to buffer for image ir document or set to null if not present
        //     const uploadEventBuffer = uploadEventImage ? Buffer.from(base64UploadEventImage,"base64"):null;
        //     if(uploadEventBuffer){
        //       const eventDir = path.join(uploadDir,"eventImage")
    
        //       // ensure the event image directory exists
        //       if(!fs.existsSync(eventDir)){
        //         fs.mkdirSync(eventDir,{recursive:true})
        //       }
        //       const fileExtension = mime ? mime.split("/")[1]:"txt";
        //       uploadEventImagePath = `${uploadDir}/eventDir/${eventTitle}${createEventActivities.eventId}.${fileExtension}`
        //       fs.writeFileSync(uploadEventImagePath,uploadEventBuffer)
        //       uploadEventImagePath2 = `/eventDir/${eventTitle}${createEventActivities.eventId}.${fileExtension}`
        //       let fileName = `${eventTitle}${createEventActivities.eventId}.${fileExtension}`
        //       let fileType = mime ? mime.split("/")[0]:'unknown'
        //       // insert to file table and file attachment table
        //       let createFile = await file.create({
        //         fileName:fileName,
        //         fileType:fileType,
        //         url:uploadEventImagePath2,
        //         statusId:1,
        //         createdDt:now(),
        //         updatedDt:now()
        //       })
    
        //       if(!createFile){
        //         return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:err.message})
        //       }
        //       let createFileAttachment = await fileAttachment.create({
        //         entityId: createEventActivities.eventId,
        //         entityType:entityType,
        //         fileId:createFile.fileId,
        //         statusId:1,
        //         filePurpose:"Event Image"
        //       })
        //     }
        //   }
        //   else{
        //     return res.status(statusCode.BAD_REQUEST.code).json({message:"Invalid File type for the event image"})
        //   }
        // }
          if (createPromotion) {
            return res.status(statusCode.SUCCESS.code).json({
              message: "Promotion created successfully",
            });
          }
          return res.status(statusCode.BAD_REQUEST.code).json({
            message: "Promotion is not created",
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
  const updatePromotion = async (req, res) => {
    try {

      const {
        name, 
        email,
        offcialContactNumber,
        officialAddress,
        duration,
        imageUrl,
        statusId,
        paymentDone,
        transactionId
      } = req.body;
  
      let params={}
      
      let findPromotionWithTheGivenId = await promotion.findOne({
        where:{
          promotionRequestId:promotionRequestId
        }
      })
      
      if(findPromotionWithTheGivenId.name!=name){
        params.name=name
      }
      else if(findPromotionWithTheGivenId.email!=email){
        params.email=email
      }
      else if(findPromotionWithTheGivenId. offcialContactNumber!= offcialContactNumber){
        params. offcialContactNumber =  offcialContactNumber
      }
      else if(findPromotionWithTheGivenId.officialAddress!=officialAddress){
        params.officialAddress = officialAddress
  
      }
      else if(findPromotionWithTheGivenId.duration!=duration){
        params.duration = duration
      }
      else if(findPromotionWithTheGivenId.statusId != statusId){
        params.statusId = statusId
      }
      else if(findPromotionWithTheGivenId.paymentDone!= paymentDone){
        params. paymentDone =  paymentDone
      }
      else if(findPromotionWithTheGivenId.transactionId!=transactionId){
        params.transactionId =  transactionId
      }
  
      let [updatePromotionCount,updatePromotionData] =  await resource
      .update(
        params,
        {
          where: { resourceId: resourceId }
        }
      )
  
      if(updatePromotionCount>=0){
        return res.status(statusCode.SUCCESS.code).json({
          message:"Data is updated successfully"
        })
      }
      else{
        return res.status(statusCode.BAD_REQUEST.code).json({
          message:"Data is not updated "
        })
      }
  
       
    } catch (error) {
      res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  module.exports = {
    createPromotion,
    updatePromotion
  };
  