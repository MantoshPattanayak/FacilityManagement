

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

// Admin facility registration

const registerFacility = async (req, res) => {
  try {
     console.log("check Api", "1")
    let userId = req.user?.userId || 1;
    let statusId = 1;

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
      eventCategory,
      othereventCategory,
      game,
      othergame,
      parkInventory,
      // owner details 
      firstName,
      lastName,
      phoneNo,
      emailId,
      ownerPanCardNumber,
      ownerAddress,
      isFacilityByBda
    } = req.body;

    let createFacilities;
    let findOwnerId;
     console.log("here Req",req.body)
     let findIfTheOwnershipDetailsExist = await ownershipDetails.findOne({
      where:{
        [Op.and]:[{[Op.or]:[{phoneNo:phoneNo},{emailId:emailId}]},{statusId:statusId}]}
     })
     if(findIfTheOwnershipDetailsExist){
      findOwnerId = findIfTheOwnershipDetailsExist
     }
     if(!findIfTheOwnershipDetailsExist){
      let createOwnershipDetails = await ownershipDetails.create({
        firstName:firstName,
        lastName:lastName,
        phoneNo:phoneNo,
        emailId:emailId,
        ownerPanCardNumber:ownerPanCardNumber,
        ownerAddress:ownerAddress,
        isFacilityByBda:isFacilityByBda
      })

      if(createOwnershipDetails){
        findOwnerId = createOwnershipDetails.ownershipDetailId
      }
     }
     createFacilities = await facilities.create({
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
      ownershipDetailId:findOwnerId
    })

    if(createFacilities) {

      
      if (facilityImage) {
        // facility image format should be facilityImage ={facilityImageOne:"hkjhfkdfk", facilityArrayOfImages:[fjdjfljlkfdj,jldjlkfjdlj]}
          let entityType = 'facilities'
          let serverError = 'something went wrong'
          let cardFacilityImage = facilityImage.facilityImageOne
          let arrayFacilityImage = facilityImage.facilityImageList
          let insertionData = {
           "id":createFacilities.facilityId,
           "name":createFacilities.facilityname
          }

        if(cardFacilityImage){
          let errors = [];
          let subDir = "facilityImages"
          let filePurpose = "singleFacilityImage"
          let uploadSingleFacilityImage = await imageUpload(cardFacilityImage,entityType,subDir,filePurpose,insertionData,errors)
          if(errors.length>0){
            if(errors.some(error => error.includes("something went wrong"))){
              return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:errors})
            }
            return res.status(statusCode.BAD_REQUEST.code).json({message:errors})
          }
        }
        if(arrayFacilityImage){
          const errors = [];
          let subDir = "facilityImageList"
          let filePurpose = "multipleFacilityImage"
          for (let i = 0; i < arrayFacilityImage.length; i++) {
            let eachFacilityImage = arrayFacilityImage[i]
            let uploadSingleFacilityImage = await imageUpload(eachFacilityImage,entityType,subDir,filePurpose,insertionData,errors)
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
      let findTheServiceName = await serviceMaster.findOne({
        where:{
          serviceId:service
        }
      })

  
    })
    
  }
    // // Here add event categories
    if(eventCategory){
      eventCategory.forEach(async(eventData)=>{
        let createEventCategoryDetails = await eventCategory.create({
          eventCategoryName:eventData,
          createdBy:userId,
          updatedBy:updatedBy,
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




module.exports= {
    registerFacility,
    initialDataFetch
}