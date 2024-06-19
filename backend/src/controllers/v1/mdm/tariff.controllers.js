

const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const facilities = db.facilities;
const facilityType = db.facilitytype
const facilityTariff = db.facilitytariff
const Sequelize = db.Sequelize;
let {Op} = require('sequelize')

// create tariff api
let createTariff = async (req,res)=>{
    try {
        console.log('req body',req.body)
        let userId = req.user.userId
        let statusId = 1;
        let {facilityId, operatingHoursFrom, operatingHoursTo, dayWeek, amount, validityFrom, validityTo }= req.body
        if(!facilityId && !operatingHoursFrom && !operatingHoursTo && !dayWeek && !amount && !validityFrom && !validityTo){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:"Please provide all required fields"
            })
        }

        let tariffCreationData = {
            facilityId:facilityId,
            operatingHoursFrom:operatingHoursFrom,
            operatingHoursTo:operatingHoursTo,
            sun:dayWeek.sun,
            mon:dayWeek.mon,
            tue:dayWeek.tue,
            wed:dayWeek.wed,
            thu:dayWeek.thu,
            fri:dayWeek.fri,
            sat:dayWeek.sat,
            amount:amount,
            validityFrom:validityFrom,
            validityTo:validityTo,
            createdBy:userId,
            createdDt:new Date(),
            updatedBy:userId,
            updatedDt:new Date(),
            statusId:statusId
        }
        let findIfTheFacilityId = await facilityTariff.findOne({
            where: {
                [Op.and]: [
                    {
                        validityFrom: {
                            [Op.lte]: validityFrom
                        }
                    },
                    {
                        validityTo: {
                            [Op.gte]: validityFrom
                        }
                    },
                    {
                        statusId: statusId
                    },
                    {
                        facilityId: facilityId
                    },
                    {
                        operatingHoursFrom: {
                            [Op.lte]: operatingHoursFrom
                        }
                    },
                    {
                        operatingHoursTo: {
                            [Op.gte]: operatingHoursFrom
                        }
                    }
                ]
            }
        });
        console.log(findIfTheFacilityId,'findif the facilityId')

        if(findIfTheFacilityId){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:"This data is already present"
            })
        }
    
        let createTariffData = await facilityTariff.create(tariffCreationData)

        if(createTariffData){
            return res.status(statusCode.SUCCESS.code).json({
                message:"This data is successfully inserted"
            })
        }
        else{
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json('Something went wrong')
        }
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
           message: err.message
        })
    }
}

let getTariffById = async (req,res)=>{
    try {
        console.log('1',req.params)
        let statusId = 1;
        let tariffId = req.params.tariffId
        console.log(tariffId,'tariffId')
        let findTariffById = await facilityTariff.findOne({
            where:{
                [Op.and]:[{tariffMasterId:tariffId},{statusId:statusId}]
            },
            include:[{
                model:facilities
            }]
        })
        if(findTariffById){
            return res.status(statusCode.SUCCESS.code).json({
                message:"Here is the tariff Data",
                tariffData:findTariffById
            })
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message:"Invalid Request"
        })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
    })
}
}


let updateTariff = async (req,res)=>{
    try {
        let {tariffId,facilityId, operatingHoursFrom, operatingHoursTo, dayWeek, amount, validityFrom, validityTo,statusId }= req.body

        let findTariffById = await facilityTariff.findOne({
            where:{
                [Op.and]:[{tariffMasterId:tariffId},{statusId:statusId}]
            }
        })
        let updateDataForTariff ={}
        if(facilityId!=findTariffById.facilityId){
            let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                where:{
                    [Op.and]: [
                        {
                            validityFrom: {
                                [Op.lte]: validityFrom
                            }
                        },
                        {
                            validityTo: {
                                [Op.gte]: validityFrom
                            }
                        },
                        {
                            statusId: statusId
                        },
                        {
                            facilityId: facilityId
                        },
                        {
                            operatingHoursFrom: {
                                [Op.lte]: operatingHoursFrom
                            }
                        },
                        {
                            operatingHoursTo: {
                                [Op.gte]: operatingHoursFrom
                            }
                        }
                    ]
                }
            })
            if(findIfDuplicateTariffFacilityExist){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:"This facilityId is already mapped to one tariff. Please deactivate the status for the given facility Id"
                })
            }
            updateDataForTariff.facilityId = facilityId
        }
        if(operatingHoursFrom!=findTariffById.operatingHoursFrom){
            let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                where:{
                    [Op.and]: [
                        {
                            validityFrom: {
                                [Op.lte]: validityFrom
                            }
                        },
                        {
                            validityTo: {
                                [Op.gte]: validityFrom
                            }
                        },
                        {
                            statusId: statusId
                        },
                        {
                            facilityId: facilityId
                        },
                        {
                            operatingHoursFrom: {
                                [Op.lte]: operatingHoursFrom
                            }
                        },
                        {
                            operatingHoursTo: {
                                [Op.gte]: operatingHoursFrom
                            }
                        }
                    ]
                }
            })
            if(findIfDuplicateTariffFacilityExist){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:"This facilityId is already mapped to one tariff. Please deactivate the status for the given facility Id"
                })
            }
            console.log('2')
            updateDataForTariff.operatingHoursFrom = operatingHoursFrom
        }
        if(operatingHoursTo!=findTariffById.operatingHoursTo){
            updateDataForTariff.operatingHoursTo = operatingHoursTo

        }
        if(dayWeek.sun!=findTariffById.sun){
            updateDataForTariff.sun = dayWeek.sun 
        }
        if(dayWeek.mon!=findTariffById.mon){
            updateDataForTariff.mon = dayWeek.mon
        }
        if(dayWeek.tue!=findTariffById.tue){
            updateDataForTariff.tue = dayWeek.tue
        }
        if(dayWeek.wed!=findTariffById.wed){
            updateDataForTariff.wed = dayWeek.wed
        }
        if(dayWeek.thu!=findTariffById.thu){
            updateDataForTariff.thu = dayWeek.thu
        }
        if(dayWeek.fri!=findTariffById.fri){
            updateDataForTariff.fri = dayWeek.fri
        }
        if(dayWeek.sat!=findTariffById.sat){
            updateDataForTariff.sat = dayWeek.sat
        }
        if(amount!=findTariffById.amount){
            updateDataForTariff.amount = amount
        }
        if(statusId!=findTariffById.statusId){
            updateDataForTariff.statusId = statusId
        }
        if(validityFrom!=findTariffById.validityFrom){
            console.log('25345345353')

            let findIfDuplicateTariffFacilityExist = await facilityTariff.findOne({
                where:{
                    [Op.and]: [
                        {
                            validityFrom: {
                                [Op.lte]: validityFrom
                            }
                        },
                        {
                            validityTo: {
                                [Op.gte]: validityFrom
                            }
                        },
                        {
                            statusId: statusId
                        },
                        {
                            facilityId: facilityId
                        },
                        {
                            operatingHoursFrom: {
                                [Op.lte]: operatingHoursFrom
                            }
                        },
                        {
                            operatingHoursTo: {
                                [Op.gte]: operatingHoursFrom
                            }
                        }
                    ]
                }
            })
            if(findIfDuplicateTariffFacilityExist){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:"This facilityId is already mapped to one tariff. Please deactivate the status for the given facility Id"
                })
            }
            updateDataForTariff.validityFrom =validityFrom
        }
        if(validityTo!= findTariffById.validityTo){
            updateDataForTariff.validityTo = validityTo
        }
        let [updateTariffCount, updateTariffData] = await facilityTariff.update(updateDataForTariff,{
            where:{
                tariffMasterId:tariffId
            }
        })
        if(updateTariffCount>0){
            return res.status(statusCode.SUCCESS.code).json({
                message:"Data updated successfully"
            })
        }
        return res.status(statusCode.BAD_REQUEST.code).json({
            message:"Data is not updated"
        })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
    })
}
}

let viewTariff = async (req,res)=>{
    try {
        let findViewTariff = await facilityTariff.findAll({include:[{
            model:facilities
        }]});
        return res.status(statusCode.SUCCESS.code).json({message:"All Tariff Data", tariffData:findViewTariff})
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}

module.exports= {
    createTariff,
    getTariffById,
    updateTariff,
    viewTariff
}