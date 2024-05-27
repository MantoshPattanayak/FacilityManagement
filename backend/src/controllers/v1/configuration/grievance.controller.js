const db = require("../../../models")
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const grievance = db.grievancemasters
const sequelize = db.sequelize;
const Sequelize = db.Sequelize
const sendEmail = require('../../../utils/generateEmail')
const mailToken = require('../../../middlewares/mailToken.middlewares')

const createGrievance = async (req, res) => {
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
    createGrievance = await grievance.create({
      fullname : fullname,
      emailId : emailId,
      phoneNo : phoneNo,
      subject : subject,
      details : details,
      statusId : statusId,
      isWhatsappNumber : isWhatsappNumber
  });
  if(filepath)
    {
    let filepathPath=null
    let filepathPath2= null
    const uploadDir = process.env.UPLOAD_DIR
    const base64filepath = filepath ? filepath.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, ""):null;
    const mimeMatch = filepath.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)
    const mime = mimeMatch ? mimeMatch[1] : null;

    if([
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(mime)){
      const filepathBuffer = filepath ? Buffer.from(base64filepath,"base64"):null;
      if(filepathBuffer){
        const eventDir = path.join(uploadDir,"filepath")

        if(!fs.existsSync(eventDir)){
          fs.mkdirSync(eventDir,{recursive:true})
        }
        const fileExtension = mime ? mime.split("/")[1]:"txt";
        filepathPath = `${uploadDir}/eventDir/grievance.${createGrievance.grievanceMasterId}.${fileExtension}`
        fs.writeFileSync(filepathPath,uploadEventBuffer)
        filepathPath2 = `/eventDir/grievance.${createGrievance.grievanceMasterId}.${fileExtension}`
        let fileName = `grievance.${createGrievance.grievanceMasterId}.${fileExtension}`
        let fileType = mime ? mime.split("/")[0]:'unknown'
        let createFile = await file.create({
          fileName:fileName,
          fileType:fileType,
          url:filepathPath2,
          statusId:1,
          createdDt:now(),
          updatedDt:now()
        })

        if(!createFile){
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:err.message})
        }
        let createFileAttachment = await fileAttachment.create({
          entityId: createGrievance.grievanceMasterId,
          entityType:entityType,
          fileId:createFile.fileId,
          statusId:1,
          filePurpose:"Image"
        })
      }
    }
    else{
      return res.status(statusCode.BAD_REQUEST.code).json({message:"Invalid File type for the image"})
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


module.exports = {
    createGrievance   
}