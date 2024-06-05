

const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const facilities = db.facilities;
const facilityType = db.facilitytype
const Sequelize = db.Sequelize;
let serviceFacility = db.servicefacilities
let serviceMaster = db.services
let amenityFacility = db.amenityfacilities
let amenityMaster = db.amenitiesmaster
const file = db.file;
let amenities = db.amenitiesmaster
const fileAttachment = db.fileattachment;
const sendEmail = require('../../../utils/generateEmail')
const mailToken= require('../../../middlewares/mailToken.middlewares');
let inventoryMaster = db.inventorymaster
let inventoryFacilities = db.inventoryfacilities

let user = db.usermaster

// Admin facility registration

const registerFacility = async (req, res) => {
  try {

    let userId = req.user?.id || 1;

    findTheRoleFromTheUserId = await user.findOne({
      where:{
        [Op.and]:[{userId:userId},{statusId:statusId}]
      }
    })
    let statusId = 1;

    let ownership = "BDA"
    let {
      
      facilityType,
      facilityName,
      longitude,
      latitude,
      address,
      pin,
      area,
      operatingHoursFrom,
      operatingHoursTo,
      operatingDays,  //here operating days will come in the form of array of data i.e. array of  days
      service,  //here services will be given in the form of object 
      otherServices, //here others will be given in the form of string 
      amenity, // here amenities will be given in the form of form of object 
      otherAmenities, // here other amenities will be given in the form of string
      additionalDetails,
      amenitiesImage,
      servicesImage,
      facilityImage,
      parkInventory
    } = req.body;

    let createFacilities = await facilities.create({
      facilityName:facilityName,
      ownership:ownership,
      facilityType:facilityType,
      longitude:longitude,
      latitude:latitude,
      address:address,
      pin:pin,
      operatingHoursFrom:operatingHoursFrom,
      operatingHoursTo:operatingHoursTo,
      areaAcres:area,
      sun:operatingDays.sun,
      mon:operatingDays.mon,
      tue:operatingDays.tue,
      wed:operatingDays.wed,
      thu:operatingDays.thu,
      fri:operatingDays.fri,
      sat:operatingDays.sat,
      additionalDetails:additionalDetails
    })

    if(createFacilities) {

      
      if (facilityImage) {
          let entityType = 'facilities'

          const errors = [];
          let facilityImages = Object.values(facilityImage) 

          for (let i = 0; i < facilityImages.length; i++) {
            let facilityFile = facilityImages[i];
            let uploadfacilityFilePath = null;
            let uploadfacilityFilePath2 = null;
            const uploadDir = process.env.UPLOAD_DIR;
            const base64UploadFacilityFile = facilityFile ? facilityFile.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
            const mimeMatch = facilityFile.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
            const mime = mimeMatch ? mimeMatch[1] : null;

            if ([
              "image/jpeg",
              "image/png",
              "application/pdf",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(mime)) {
              // convert base 64 to buffer for image or document or set to null if not present
              const uploadFacilityFileBuffer = facilityFile ? Buffer.from(base64UploadFacilityFile, "base64") : null;
              if (uploadFacilityFileBuffer) {
                const facilityFileDir = path.join(uploadDir, "facilityImages");

                // ensure the event image directory exists
                if (!fs.existsSync(facilityFileDir)) {
                  fs.mkdirSync(facilityFileDir, { recursive: true });
                }
                const fileExtension = mime ? mime.split("/")[1] : "txt";
                uploadfacilityFilePath = `${uploadDir}/facilityFileDir/${createFacilities.facilityId}${createFacilities.facilityName}.${fileExtension}`;
                fs.writeFileSync(uploadfacilityFilePath, uploadFacilityFileBuffer);
                uploadfacilityFilePath2 = `/facilityFileDir/${createFacilities.facilityId}${createFacilities.facilityName}.${fileExtension}`;

                let fileName = `${createFacilities.facilityId}${createFacilities.facilityName}.${fileExtension}`;
                let fileType = mime ? mime.split("/")[0] : 'unknown';

                // insert to file table and file attachment table
                let createFile = await file.create({
                  fileName: fileName,
                  fileType: fileType,
                  url: uploadfacilityFilePath2,
                  statusId: 1,
                  createdDt: now(),
                  updatedDt: now()
                });

                if (!createFile) {
                  errors.push(`Failed to create file  for facility file at index ${i}`);
                } else {
                  // Insert into file attachment table
                  let createFileAttachment = await fileAttachment.create({
                    entityId: createFacilities.facilityId,
                    entityType: entityType,
                    fileId: createFile.fileId,
                    statusId: 1,
                    filePurpose: "facilityImage"
                  });

                  if (!createFileAttachment) {
                    errors.push(`Failed to create file attachment for facility file at index ${i}`);
                  }
                }
              }
            } else {
              errors.push(`Invalid File type for facility file at index ${i}`);
            }
          }

          if (errors.length > 0) {
            // Handle errors here, you can log them or do any other necessary action.
            console.error("Errors occurred while processing additional files:", errors);
            return res.status(statusCode.BAD_REQUEST.code).json({ errors: errors });
          }
        }


      if(amenity) {
         
        let amenities = Object.keys(amenity)
          amenities.forEach(async(amenity)=>{
            let createAmenities = await amenityFacility.create( { 
              facilityId:createFacilities.facilityId,
              amenityId:amenity,
              statusId:statusId,
              createdBy:userId,
              createdDt:new Date(),
              updatedBy:userId,
              updatedDt:new Date()

            }
            )

            let findTheAmenityName = await amenityMaster.findOne({
              where:{
                amenityId:amenity
              }
            })

            // upload amenities Images 
            if (amenitiesImage) {
              let entityType = 'amenities'
              const errors = [];
              let amenityImages = Object.values(amenitiesImage) 
          
              for (let i = 0; i < amenityImages.length; i++) {
                let amenityFile = amenityImages[i];
                let uploadamenityFilePath = null;
                let uploadamenityFilePath2 = null;
                const uploadDir = process.env.UPLOAD_DIR;
                const base64UploadamenityFile = amenityFile ? amenityFile.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
                const mimeMatch = amenityFile.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
                const mime = mimeMatch ? mimeMatch[1] : null;
          
                if ([
                  "image/jpeg",
                  "image/png",
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ].includes(mime)) {
                  // convert base 64 to buffer for image or document or set to null if not present
                  const uploadAmenityFileBuffer = amenityFile ? Buffer.from(base64UploadamenityFile, "base64") : null;
                  if (uploadAmenityFileBuffer) {
                    const amenityFileDir = path.join(uploadDir, "amenityImages");
          
                    // ensure the event image directory exists
                    if (!fs.existsSync(amenityFileDir)) {
                      fs.mkdirSync(amenityFileDir, { recursive: true });
                    }
                    const fileExtension = mime ? mime.split("/")[1] : "txt";
                    uploadamenityFilePath = `${uploadDir}/amenityFileDir/${createAmenities.amenityFacilityId}${findTheAmenityName.amenityName}.${fileExtension}`;

                    fs.writeFileSync(uploadamenityFilePath, uploadAmenityFileBuffer);

                    uploadamenityFilePath2 = `/amenityFileDir/${createAmenities.facilityId}${findTheAmenityName.amenityName}.${fileExtension}`;
          
                    let fileName = `${createAmenities.amenityFacilityId}${findTheAmenityName.facilityName}.${fileExtension}`;
                    let fileType = mime ? mime.split("/")[0] : 'unknown';
          
                    // insert to file table and file attachment table
                    let createFile = await file.create({
                      fileName: fileName,
                      fileType: fileType,
                      url: uploadamenityFilePath2,
                      statusId: 1,
                      createdDt: now(),
                      updatedDt: now()
                    });
          
                    if (!createFile) {
                      errors.push(`Failed to create file  for facility file at index ${i}`);
                    } else {
                      // Insert into file attachment table
                      let createFileAttachment = await fileAttachment.create({
                        entityId: createAmenities.amenityFacilityId,
                        entityType: entityType,
                        fileId: createFile.fileId,
                        statusId: 1,
                        filePurpose: "amenityImage"
                      });
          
                      if (!createFileAttachment) {
                        errors.push(`Failed to create file attachment for facility file at index ${i}`);
                      }
                    }
                  }
                } else {
                  errors.push(`Invalid File type for facility file at index ${i}`);
                }
              }
          
              if (errors.length > 0) {
                // Handle errors here, you can log them or do any other necessary action.
                console.error("Errors occurred while processing additional files:", errors);
                return res.status(statusCode.BAD_REQUEST.code).json({ errors: errors });
              }
            }
          })
          
      
      }
  
  if(service) { 
    let services = Object.keys(service)
    services.forEach(async(service)=>{
      let createServices = await serviceFacility.create( { 
        facilityId:createFacilities.facilityId,
        serviceId:service,
        statusId:statusId,
        createdBy:userId,
        createdDt:new Date(),
        updatedBy:userId,
        updatedDt:new Date()

        
      }

      )
      let findTheServiceName = await serviceMaster.findOne({
        where:{
          serviceId:service
        }
      })

      if (servicesImage) {
        let entityType = 'services'
        const errors = [];
        let serviceImages = Object.values(servicesImage) 
    
        for (let i = 0; i < serviceImages.length; i++) {
          let serviceFile = serviceImages[i];
          let uploadserviceFilePath = null;
          let uploadserviceFilePath2 = null;
          const uploadDir = process.env.UPLOAD_DIR;
          const base64UploadServiceFile = serviceFile ? serviceFile.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
          const mimeMatch = serviceFile.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
          const mime = mimeMatch ? mimeMatch[1] : null;
    
          if ([
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(mime)) {
            // convert base 64 to buffer for image or document or set to null if not present
            const uploadServiceFileBuffer = serviceFile ? Buffer.from(base64UploadServiceFile, "base64") : null;
            if (uploadServiceFileBuffer) {
              const serviceFileDir = path.join(uploadDir, "serviceImages");
    
              // ensure the event image directory exists
              if (!fs.existsSync(serviceFileDir)) {
                fs.mkdirSync(serviceFileDir, { recursive: true });
              }
              const fileExtension = mime ? mime.split("/")[1] : "txt";
              uploadserviceFilePath = `${uploadDir}/serviceFileDir/${createServices.serviceFacilityId}${findTheServiceName.code}.${fileExtension}`;

              fs.writeFileSync(uploadserviceFilePath, uploadServiceFileBuffer);

              uploadserviceFilePath2 = `/amenityFileDir/${createServices.serviceFacilityId}${findTheServiceName.code}.${fileExtension}`;
    
              let fileName = `${createAmenities.amenityFacilityId}${findTheAmenityName.facilityName}.${fileExtension}`;
              let fileType = mime ? mime.split("/")[0] : 'unknown';
    
              // insert to file table and file attachment table
              let createFile = await file.create({
                fileName: fileName,
                fileType: fileType,
                url: uploadserviceFilePath2,
                statusId: 1,
                createdDt: now(),
                updatedDt: now()
              });
    
              if (!createFile) {
                errors.push(`Failed to create file  for facility file at index ${i}`);
              } else {
                // Insert into file attachment table
                let createFileAttachment = await fileAttachment.create({
                  entityId: createServices.serviceFacilityId,
                  entityType: entityType,
                  fileId: createFile.fileId,
                  statusId: 1,
                  filePurpose: "serviceImage"
                });
    
                if (!createFileAttachment) {
                  errors.push(`Failed to create file attachment for facility file at index ${i}`);
                }
              }
            }
          } else {
            errors.push(`Invalid File type for facility file at index ${i}`);
          }
        }
    
        if (errors.length > 0) {
          // Handle errors here, you can log them or do any other necessary action.
          console.error("Errors occurred while processing additional files:", errors);
          return res.status(statusCode.BAD_REQUEST.code).json({ errors: errors });
        }
      }
    })
    
  }
    // after all of these let add the park inventory details
    // here the park inventory data should look like this : {inventory:{}, inventory:{}}
    if(parkInventory){
      let parkInventories = Object.keys(parkInventory)
      parkInventories.forEach(async(inventory)=>{
        let createInventory = await inventoryFacilities.create({
          facilityId:createFacilities.facilityId,
          equipmentId:inventory.equipmentId,
          count:inventory.count,
          statusId:statusId,
          createdBy:userId,
          createdDt:new Date(),
          updatedBy:userId,
          updatedDt:new Date()
        })
      })
    }
 
    return res.status(statusCode.SUCCESS.code).json({
      message:"Facility successfully registered"
    })
  
  }

  else{
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


// initial Data fetch 

const initialDataFetch = async (req,res)=>{
    try {
      let statusId = 1
        let fetchFacilityTypes = await facilityType.findAll({
          where: {
            statusId:statusId
          }
        })
        let fetchServices = await serviceMaster.findAll(
          {
            where: {
              statusId:statusId
            }
          }
        )
        let fetchAmenities = await amenities.findAll(
          {
            where: {
              statusId:statusId
            }
          }
        )
        let fetchInventory = await inventoryMaster.findAll(
          {
            where:{
              statusId:statusId
            }
          }
        )
      
        return res.status(statusCode.SUCCESS.code).json(
        {  message:`These are all initial dropdown data for facility Types, services, amenities`,
        facilityType:fetchFacilityTypes,
        fetchServices:fetchServices,
        fetchAmenities:fetchAmenities,
        fetchInventory:fetchInventory

        }
        )
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}




module.exports= {
    registerFacility,
    initialDataFetch
}