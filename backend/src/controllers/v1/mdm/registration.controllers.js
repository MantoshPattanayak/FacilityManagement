

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
let activityMaster = db.useractivitymasters
let amenities = db.amenitiesmaster
// let eventCategory = db.eventCategory
const fileAttachment = db.fileattachment;
const sendEmail = require('../../../utils/generateEmail')
const mailToken= require('../../../middlewares/mailToken.middlewares');
let inventoryMaster = db.inventorymaster
let inventoryFacilities = db.inventoryfacilities
let eventCategoryMaster = db.eventCategoryMaster
let facilityAcitivities = db.facilityactivities
let ownershipDetails = db.ownershipDetails
const { Op } = require('sequelize');
let user = db.usermaster
let imageUpload = require('../../../utils/imageUpload')
let facilityEvent = db.facilityEvents
// Admin facility registration

const registerFacility = async (req, res) => {
  try {
     console.log("check Api", "1")
    let userId = req.user?.userId || 1;
    let statusId = 1;
    let createdDt = new Date();
    let updatedDt = new Date();
    findTheRoleFromTheUserId = await user.findOne({
      where:{
        [Op.and]:[{userId:userId},{statusId:statusId}]
      }
    })

    let {
      
      facilityType,
      facilityName,
      longitude,
      latitude,
      address,
      pin,
      ownership,
      area,
      operatingHoursFrom,
      operatingHoursTo,
      operatingDays,  //here operating days will come in the form of array of data i.e. array of  days
      service,  //here services will be given in the form of object 
      otherServices, //here others will be given in the form of string 
      amenity, // here amenities will be given in the form of form of object 
      otherAmenities, // here other amenities will be given in the form of string
      additionalDetails,
      facilityImage,
      eventCategory,
      othereventCategory,
      game,
      othergame,
      parkInventory,
      // owner details 
      firstName,
      lastName,
   facilityisownedbBDA,
      phoneNumber,
      emailAdress,
      ownerPanCard,
      ownersAddress,
    } = req.body;

    let createFacilities;
    let findOwnerId;
     console.log("here Req", 
      facilityType,
      facilityName,
      longitude,
      latitude,
      address,
      pin,
      ownership,
      area,  //allow area value to be in decimal
      operatingHoursFrom,
      operatingHoursTo,
      operatingDays,  //here operating days will come in the form of array of data i.e. array of  days
      service,  //here services will be given in the form of object 
      otherServices, //here others will be given in the form of string 
      amenity, // here amenities will be given in the form of form of object 
      otherAmenities, // here other amenities will be given in the form of string
      additionalDetails,
      eventCategory,
      othereventCategory,
      game,
      othergame,
      parkInventory,
      // owner details 
      firstName,
      lastName,
      ownerPanCard,
      ownersAddress,
      lastName,
      facilityisownedbBDA)

     let findIfTheOwnershipDetailsExist = await ownershipDetails.findOne({
      where:{
        [Op.and]:[{[Op.or]:[{phoneNo:phoneNumber},{emailId:emailAdress}]},{statusId:statusId}]}
     })
     if(findIfTheOwnershipDetailsExist){
      console.log('if owners detail exist', 89)
      findOwnerId = findIfTheOwnershipDetailsExist.ownershipDetailId
     }
     if(!findIfTheOwnershipDetailsExist){
      console.log('if owners detail doesnot exist', 93)
      let createOwnershipDetails = await ownershipDetails.create({
        firstName:firstName,
        lastName:lastName,
        phoneNo:phoneNumber,
        emailId:emailAdress,
        statusId:statusId,
        ownerPanCardNumber:ownerPanCard,
        ownerAddress:ownersAddress,
        isFacilityByBda:facilityisownedbBDA, 
        createdDt:createdDt,
        updatedDt:updatedDt,
        createdBy:userId,
        updatedBy:userId
      })

      if(createOwnershipDetails){
        findOwnerId = createOwnershipDetails.ownershipDetailId
      }
     }
     console.log('hello create facility 104')
     createFacilities = await facilities.create({
      facilityname:facilityName,
      ownership:ownership,
      facilityTypeId:facilityType,
      longitude:longitude,
      latitude:latitude,
      address:address,
      pin:pin,
      statusId:statusId,
      operatingHoursFrom:operatingHoursFrom,
      operatingHoursTo:operatingHoursTo,
      areaAcres:area,
      sun:operatingDays?.sun || 0,
      mon:operatingDays?.mon || 0,
      tue:operatingDays?.tue || 0,
      wed:operatingDays?.wed || 0,
      thu:operatingDays?.thu || 0,
      fri:operatingDays?.fri || 0,
      sat:operatingDays?.sat || 0,
      additionalDetails:additionalDetails,
      otherAmenities:otherAmenities,
      otherEventCategory:othereventCategory,
      otherGames:othergame,
      otherServices:otherServices,
      ownershipDetailId:findOwnerId,
      createdDt:createdDt,
      updatedDt:updatedDt,
      createdBy:userId,
      updatedBy:userId
    })

    if(createFacilities) {

      
      if (facilityImage) {
        // facility image format should be facilityImage ={facilityImageOne:"hkjhfkdfk", facilityArrayOfImages:[fjdjfljlkfdj,jldjlkfjdlj]}
          let entityType = 'facilities'
          let serverError = 'something went wrong'
          let cardFacilityImage = facilityImage.facilityImageOne
          let arrayFacilityImage = facilityImage.facilityArrayOfImages
          let insertionData = {
           id:createFacilities.facilityId,
           name:createFacilities.facilityname
          }

        if(cardFacilityImage){
          let errors = [];
          let subDir = "facilityImages"
          let filePurpose = "singleFacilityImage"
          console.log('163 line facility image')
          let uploadSingleFacilityImage = await imageUpload(cardFacilityImage,entityType,subDir,filePurpose,insertionData,userId,errors)
          console.log( uploadSingleFacilityImage,'165 line facility image')
          if(errors.length>0){
            if(errors.some(error => error.includes("something went wrong"))){
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
            }
            return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
          }
        }
        if(arrayFacilityImage.length>0){
          const errors = [];
          let subDir = "facilityImageList"
          let filePurpose = "multipleFacilityImage"
          for (let i = 0; i < arrayFacilityImage.length; i++) {
            let eachFacilityImage = arrayFacilityImage[i]
            let uploadSingleFacilityImage = await imageUpload(eachFacilityImage,entityType,subDir,filePurpose,insertionData,userId,errors)
          }
          if(errors.length>0){
            if(errors.some(error => error.includes("something went wrong"))){
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
            }
            return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
          }

        }
      }
          

      if(amenity) {
         
        amenity.forEach(async(amenity)=>{
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
            // let findTheAmenityName = await amenityMaster.findOne({
            //   where:{
            //     amenityId:amenity
            //   }
            // })

          })
          
      
      }
  
  if(service) { 
    service.forEach(async(service)=>{
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
     

  
    })
    
  }
    // // Here add event categories
    if(eventCategory){
      console.log(eventCategory, 'eventData')
      eventCategory.forEach(async(eventData)=>{
        let createEventCategoryDetails = await facilityEvent.create({
          eventCategoryId:eventData,
          createdBy:userId,
          updatedBy:userId,
          createdDt:createdDt,
          updatedDt:updatedDt,
          facilityId:createFacilities.facilityId,
          statusId:statusId
        })
      })
    }
    // add games 
    if(game){
      game.forEach(async(eachGame)=>{
        let createGameDetails = await facilityAcitivities.create({
          facilityId:createFacilities.facilityId,
          activityId:eachGame,
          facilityTypeId:createFacilities.facilityTypeId,
          statusId:statusId,
          createdBy:userId,
          updatedBy:userId,
          createdDt:createdDt,
          updatedDt:updatedDt
        })
      })
    }

    // after all of these let add the park inventory details
    // here the park inventory data should look like this : {inventory:{}, inventory:{}}
    if(parkInventory){
      parkInventory.forEach(async(inventory)=>{
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
        let fetchActivityMaster = await activityMaster.findAll({
          where:{
            statusId:statusId
          }
        })
        let fetchEventCategories = await sequelize.query(`select * from amabhoomi.eventcategorymasters`,{
          where:{
            statusId:statusId
          },
          type:Sequelize.QueryTypes.SELECT,
          
        })
      
        return res.status(statusCode.SUCCESS.code).json(
        {  message:`These are all initial dropdown data for facility Types, services, amenities`,
        facilityType:fetchFacilityTypes,
        fetchServices:fetchServices,
        fetchAmenities:fetchAmenities,
        fetchInventory:fetchInventory,
        fetchActivity:fetchActivityMaster,
        fetchEventCategory:fetchEventCategories
        }
        )
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}


const getFacilityWrtId = async(req,res)=>{
  try {
    let{facilityId,facilityTypeId} = req.body
    let statusId = 1
    let findTheFacilityDetils = await facilities.findOne({
      where:{[Op.and]:[{statusId:statusId},{facilityId:facilityId}]},
      attributes:[['facilityname','facilityName'],
      'ownership',['facilityTypeId','facilityType'],'scheme',['areaAcres','area'],
      'operatingHoursFrom','operatingHoursTo','sun','mon','tue',
      'wed','thu',
      'fri','sat',['otherGames','othergame'],'otherServices','otherAmenities',['otherEventCategories','othereventCategory'],'additionalDetails','pin','helpNumber' ]
    })
    let findAmenityDetails = await sequelize.query(`select am.amenityName,fa.amenityFacilityId as amenityId from amabhoomi.amenitymasters am inner join facilityamenities fa on fa.amenityId = am.amenityId where fa.facilityId = ? and fa.statusId=?`,
      
     { replacements:[facilityId,statusId],
      type:QueryTypes.SELECT}
    )

    let findServiceDetails = await sequelize.query(` select s.code, sf.serviceId from services s  inner join amabhoomi.servicefacilities sf on sf.serviceId = s.serviceId where sf.facilityId = ? and sf.statusId=?`,
      
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )
   
     let findActivityDetails = await sequelize.query(`select fa.id as userActivityId , um.userActivityName as userActivityName  from amabhoomi.facilityactivities fa inner join useractivitymasters um on fa.activityId = um.userActivityId where fa.facilityId = ? and fa.statusId= ? and fa.facilityTypeId = ?`,
      
      { replacements:[facilityId,statusId,facilityTypeId],
       type:QueryTypes.SELECT}
     )

     let findEventDetails = await sequelize.query(`select em.eventCategoryName, fe.facilityEventId as eventCategoryId  from amabhoomi.facilityevents fe inner join eventcategorymasters em on em.eventCategoryId = fe.eventCategoryId where  fe.facilityId = ? and fe.statusId = ? `,
      
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )
     
     let findMultipleImages = await sequelize.query(`select f.fileId, f.fileName as code, f.fileType, f.url, fa.attachmentId from amabhoomi.files f  inner join fileattachments fa on f.fileId = fa.fileId where fa.entityId = ? and fa.filePurpose = 'multipleFacilityImage' and fa.entityType = 'facilities'  and fa.statusId= ?`,
      
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )

     let findSingleImage = await sequelize.query(`select f.fileId, f.fileName as code, f.fileType, f.url, fa.attachmentId from amabhoomi.files f  inner join fileattachments fa on f.fileId = fa.fileId where fa.entityId = ? and fa.filePurpose = 'singleFacilityImage'and fa.entityType = 'facilities'  and fa.statusId= ?`,
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )

     let findOwnerDetails = await sequelize.query(`select o.ownershipDetailId,o.firstName,o.lastName,o.phoneNo as phoneNumber,o.emailId as emailAddress, o.ownerPanCardNumber as ownerPanCard,o.ownerAddress as ownersAddress,o.isFacilityByBda as facilityisownedbBDA from amabhoomi.ownershipdetails o inner join facilities f on f.ownershipDetailId = o.ownershipDetailId where f.facilityId= ? and o.statusId = ?
`,
      { replacements:[facilityId,statusId],
       type:QueryTypes.SELECT}
     )
     let findInventoryDetails = await sequelize.query(`select i.equipmentfacilityId as equipmentId , i2.code  from amabhoomi.inventoryfacilities i inner join inventorymasters i2 on i.equipmentId = i2.equipmentId where i.facilityId = ? and i.statusId = ?

      `,
            { replacements:[facilityId,statusId],
             type:QueryTypes.SELECT}
           )
    return res.status(statusCode.SUCCESS.code).json({message:"These are all get facility with respect to Id",
      facilityData:findTheFacilityDetils,
      amenity:findAmenityDetails,
      service:findServiceDetails,
      eventCategory:findEventDetails,
      facilityImageOne:findSingleImage,
      facilityArrayOfImages:findMultipleImages,
      parkInventory:findInventoryDetails,
      game:findActivityDetails,
      ownersAddress:findOwnerDetails
    })
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}
const updateFacility = async(req,res)=>{
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let { 
      facilityId,
      facilityType,
      facilityName,
      longitude,
      latitude,
      address,
      pin,
      ownership,
      area,
      operatingHoursFrom,
      operatingHoursTo,
      operatingDays,  //here operating days will come in the form of array of data i.e. array of  days
      service,  //here services will be given in the form of object 
      otherServices, //here others will be given in the form of string 
      amenity, // here amenities will be given in the form of form of object 
      otherAmenities, // here other amenities will be given in the form of string
      additionalDetails,
      facilityImage,
      eventCategory,
      othereventCategory,
      game,
      othergame,
      parkInventory,
      // owner details
      ownershipDetailId, 
      firstName,
      lastName,
  facilityisownedbBDA,
      phoneNumber,
      emailAdress,
      ownerPanCard,
      ownersAddress} = req.body

      let updateFacilityDataVariable = {}
      let updateAmenityDataVariable = {}
      let updateActivityDataVariable = {}
      let updateServiceDataVariable = {}
      let updateOwnershipDataVariable = {}
      let updateInventoryDataVariable = {}
      let updateSingleImageDataVariable = {}
      let updateMultipleImageDataVariable = {}
      if(facilityType){
        updateFacilityDataVariable.facilityTypeId = facilityType
        updateActivityDataVariable.facilityTypeId = facilityType
      }
      if(facilityName){
        updateFacilityDataVariable.facilityname = facilityName
      }
      if(longitude){
        updateFacilityDataVariable.longitude = longitude
      }
      if(latitude){
        updateFacilityDataVariable.latitude = latitude
      }
      if(address){
        updateFacilityDataVariable.address = address
      }
      if(pin){
        updateFacilityDataVariable.pin = pin
      }
      if(ownership){
        updateFacilityDataVariable.ownership = ownership
      }
      if(area){
        updateFacilityDataVariable.area = area
      }
      if(operatingHoursFrom){
        updateFacilityDataVariable.operatingHoursFrom = operatingHoursFrom
      }
      if(operatingHoursTo){
        updateFacilityDataVariable.operatingHoursTo = operatingHoursTo
      }
      if(operatingDays){
        if(operatingDays?.sun){
          updateFacilityDataVariable.sun = sun 
        }
        if(operatingDays?.mon){
          updateFacilityDataVariable.mon = mon 
        }
        if(operatingDays?.tue){
          updateFacilityDataVariable.tue = tue 
        }
        if(operatingDays?.wed){
          updateFacilityDataVariable.wed = wed 
        }
        if(operatingDays?.thu){
          updateFacilityDataVariable.thu = thu 
        }
        if(operatingDays?.fri){
          updateFacilityDataVariable.fri = fri 
        }
        if(operatingDays?.sat){
          updateFacilityDataVariable.fri = sat 
        }
      }
    if(othergame){
      updateFacilityDataVariable.otherGames = othergame 
    }
    if(additionalDetails){
      updateFacilityDataVariable.additionalDetails = additionalDetails 
    }
    if(otherServices){
      updateFacilityDataVariable.otherServices = otherServices 
    }
    if(otherAmenities){
      updateFacilityDataVariable.otherAmenities = otherAmenities 
    }
    if(isFacilityByBda){
      updateOwnershipDataVariable.isFacilityByBda = facilityisownedbBDA 
    }
    if(othereventCategory){
      updateOwnershipDataVariable.otherEventCategories = othereventCategory 
    }
    if(facilityImage){
      if(facilityImage?.facilityImageOne){
        if(facilityImage.facilityImageOne?.fileId!=0){
          //update the data
          
        }
        else{
          // create the data
        }
      }


    }
    
      
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}



module.exports= {
    registerFacility,
    initialDataFetch,
    getFacilityWrtId
}