const db = require("../../../models/index");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const facilitytype = db.facilitytype;
const facilities = db.facilities;
const role = db.rolemaster;
const facilitybookings = db.facilitybookings;
const userbookingactivities = db.userbookingactivities;
const statusmasters = db.statusmaster;
const useractivitymasters = db.useractivitymasters;
const cart = db.cart
const cartItem = db.cartItem
const useractivitypreferences = db.userActivityPreference
const { Op } = require('sequelize');
var QRCode = require('qrcode')

// events booking table
const eventBooking = db.eventBookings;
const moment = require('moment');
let parkBookingTestForPark = async (req, res) => {
    try {
        /**
         * @facilitytype park
         */
        let userId = req.user?.userId || 1;
        let {
            facilityId,
            totalMembers,
            amount,
            activityPreference,
            otherActivities,
            bookingDate,
            startTime,
            durationInHours
        } = req.body;

        console.log({
            facilityId,
            totalMembers,
            amount,
            activityPreference,
            otherActivities,
            bookingDate,
            startTime,
            durationInHours
        }, 'before change');
   

        // Function to add hours to a time string
        // function addHoursToTime(timeString, hoursToAdd) {
        //     // Parse the time string into hours and minutes
        //     const [hours, minutes] = timeString.split(':').map(Number);
        //     console.log({hours, minutes, hoursToAdd});

        //     // Add the hours
        //     let newHours = (hours + hoursToAdd) % 24;

        //     // Ensure newHours is in the range [0, 23]
        //     newHours = newHours < 0 ? newHours + 24 : newHours;

        //     // Format the result back into a time string
        //     const newTimeString = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        //     console.log(newTimeString);

        //     return newTimeString;
        // }

        const endTime = addHoursToTime(startTime, Number(durationInHours) );

        console.log({
            facilityId,
            totalMembers,
            amount,
            activityPreference,
            otherActivities,
            bookingDate,
            startTime,
            endTime,
            durationInHours
        }, 'after change');

        let statusList = await statusmasters.findAll({ where: { parentStatusCode: 'PAYMENT_STATUS' } });

        // console.log(statusList[0].dataValues);

        let paidStatusCode = statusList.filter((status) => { return status.dataValues.statusCode == 'COMPLETED' })[0].dataValues.statusId;

        // console.log('paid', paidStatusCode);

        bookingTransaction();
        // res.status(200).json({message: 'Booking details submitted!'})
        
        async function bookingTransaction() {
            let transaction;
            try {
                transaction = await sequelize.transaction();

                const newParkBooking = await facilitybookings.create({
                    facilityId: facilityId,
                    totalMembers: totalMembers,
                    otherActivities: otherActivities,
                    bookingDate: bookingDate,
                    startDate: `${startTime}`,
                    endDate: `${endTime}`,
                    amount: amount,
                    statusId: 1,
                    paymentstatus: '',
                    createdBy: userId
                }, { transaction });

                console.log('newParkBooking', newParkBooking);

                for (let i = 0; i < activityPreference.length; i++) {
                    const newParkBookingActivityPreference = await userbookingactivities.create({
                        facilityBookingId: newParkBooking.dataValues.facilityBookingId,
                        userActivityId: activityPreference[i],
                        statusId: 1,
                        createdBy: userId
                    }, { transaction });
                }

                await transaction.commit();

                res.status(statusCode.SUCCESS.code).json({
                    message: 'Park booking done successfully',
                    data: newParkBooking
                })
            }
            catch (error) {
                if (transaction) await transaction.rollback();

                console.error('Error creating user park booking:', error);
                res.status(statusCode.BAD_REQUEST.code).json({
                    message: 'Park booking failed!',
                    data: []
                })
            }
        }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let parkBookingFormInitialData = async (req, res) => {
    try {
        let userActivityMaster = await useractivitymasters.findAll();

        // let activity = ['Walking', 'Yoga', 'Open Gym', 'Jogging', 'Children Park'];

        // for(let i = 0; i < activity.length; i++){
        //     let user = await useractivitymasters.create({
        //         userActivityName: activity[i],
        //         statusId: 1,
        //         createdBy: 1
        //     })
        // }

        res.status(statusCode.SUCCESS.code).json({
            message: 'Park booking form initial data',
            data: userActivityMaster
        })
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

// Function to add hours to a time string
function addHoursToTime(timeString, hoursToAdd) {
    // Parse the time string into hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);
    console.log({hours, minutes, hoursToAdd});

    // Add the hours
    let newHours = (hours + hoursToAdd) % 24;

    // Ensure newHours is in the range [0, 23]
    newHours = newHours < 0 ? newHours + 24 : newHours;

    // Format the result back into a time string
    const newTimeString = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    console.log(newTimeString);

    return newTimeString;
}

/**
 * book park, playgrounds, multipurpose grounds, events API
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
let parkBooking = async (req, res) => {
    try {
        let {
            entityId,
            entityTypeId,
            facilityPreference
        } = req.body;
        console.log({
            entityId,
            entityTypeId,
            facilityPreference
        });
        let userId = req.user?.userId || 1;
        /**
         * 1	PARKS 
         * 2	PLAYGROUNDS
         * 3	MULTIPURPOSE_GROUND
         * 6	EVENTS
         */
        if(entityTypeId == 1){
            bookingTransactionForPark(entityId, facilityPreference);
        }
        else if(entityTypeId == 2){
            bookingTransactionForPlaygrounds(entityId, facilityPreference);
        }
        else if(entityTypeId == 3){
            bookingTransactionForMPgrounds(entityId, facilityPreference);
        }
        else if(entityTypeId == 6) {
            bookingTransactionForEvents(entityId, facilityPreference);
        }
        else{
            res.status(statusCode.BAD_REQUEST.code).json({
                message: 'Booking failed.'
            })
        }

        async function bookingTransactionForPark(facilityId, bookingData) {
            let transaction;
            try {
                transaction = await sequelize.transaction();

                const newParkBooking = await facilitybookings.create({
                    facilityId: facilityId,
                    facilityTypeId: entityTypeId,
                    totalMembers: bookingData.totalMembers,
                    otherActivities: bookingData.otherActivities,
                    bookingDate: bookingData.bookingDate,
                    startDate: bookingData.startTime,
                    endDate: `${addHoursToTime(bookingData.startTime, Number(bookingData.durationInHours))}`,
                    amount: bookingData.amount,
                    statusId: 1,
                    paymentstatus: '',
                    createdBy: userId
                }, { transaction });

                console.log('newParkBooking', newParkBooking);

                for (let i = 0; i < bookingData.activityPreference.length; i++) {
                    const newParkBookingActivityPreference = await userbookingactivities.create({
                        facilityBookingId: newParkBooking.dataValues.facilityBookingId,
                        userActivityId: bookingData.activityPreference[i],
                        statusId: 1,
                        createdBy: userId
                    }, { transaction });
                }

                await transaction.commit();

                res.status(statusCode.SUCCESS.code).json({
                    message: 'Park booking done successfully',
                    data: newParkBooking
                })
            }
            catch (error) {
                if (transaction) await transaction.rollback();

                console.error('Error creating user park booking:', error);
                res.status(statusCode.BAD_REQUEST.code).json({
                    message: 'Park booking failed!',
                    data: []
                })
            }
        }

        async function bookingTransactionForPlaygrounds(facilityId, bookingData) {
            /** body params
             * playerLimit: '',
             * sports: '',
             * bookingDate: '',
             * startTime: '',
             * endTime: '',
             * amount: '',
             */
            let transaction;
            try {
                transaction = await sequelize.transaction();

                const newPlaygroundBooking = await facilitybookings.create({
                    facilityId: facilityId,
                    facilityTypeId: entityTypeId,
                    totalMembers: bookingData.playerLimit,
                    sportsName: bookingData.sports,
                    bookingDate: bookingData.bookingDate,
                    startDate: bookingData.startTime,
                    endDate: bookingData.endTime,
                    amount: bookingData.amount,
                    statusId: 1,
                    paymentstatus: '',
                    createdBy: userId
                }, { transaction });

                console.log('newPlaygroundBooking', newPlaygroundBooking);

                await transaction.commit();

                res.status(statusCode.SUCCESS.code).json({
                    message: 'Playground booking done successfully',
                    data: newPlaygroundBooking
                })
            }
            catch (error) {
                if (transaction) await transaction.rollback();

                console.error('Error creating user park booking:', error);
                res.status(statusCode.BAD_REQUEST.code).json({
                    message: 'Park booking failed!',
                    data: []
                })
            }
        }

        async function bookingTransactionForMPgrounds(bookingData) {

        }

        async function bookingTransactionForEvents(eventId, bookingData) {
            /**
             * totalMembers: '',
             * bookingDate: '',
             * startTime: '',
             * duration: '',
             * amount: '',
             * eventId: 1
             */
            let transaction;
            try {
                transaction = await sequelize.transaction();

                const eventBookingData = await eventBooking.create({
                    eventId: eventId,
                    totalMembers: bookingData.totalMembers,
                    bookingDate: bookingData.bookingDate,
                    startDate: bookingData.startTime,
                    endDate: `${addHoursToTime(bookingData.startTime, Number(bookingData.durationInHours))}`,
                    amount: bookingData.amount,
                    statusId: 1,
                    paymentstatus: '',
                    createdBy: userId
                }, { transaction });

                console.log('eventBooking', eventBookingData);

                await transaction.commit();

                res.status(statusCode.SUCCESS.code).json({
                    message: 'Event booking done successfully',
                    data: eventBooking
                })
            }
            catch (error) {
                if (transaction) await transaction.rollback();

                console.error('Error creating user park booking:', error);
                res.status(statusCode.BAD_REQUEST.code).json({
                    message: 'Park booking failed!',
                    data: []
                })
            }
        }
    }
    catch(error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        });
    }
}
//  add to cart and cart items table
// create cart
// view cart by user id 
// update cart by user id means  remove the cart items 


// create cart
function calculateEndTime(startTime,duration){

    let momentStartTime = moment.duration(startTime);
    let momentDuration = moment.duration(duration);
    // adding the duration
    let momentEndTime = momentStartTime.add(momentDuration)
    // Format the total momentEndTime back into HH:mm:ss format

    momentEndTime = moment.utc(momentEndTime.asMilliseconds()).format('HH:mm:ss')
    console.log('moment end time', momentEndTime)
    return momentEndTime;
}




let insertAndUpdateTheCartItems = async(checkIsItemAlreadyExist,entityId,entityTypeId,facilityPreference,createdDt,updatedDt,statusId,userId,isUserExist)=>{
    try {
        console.log(checkIsItemAlreadyExist,entityId,entityTypeId,facilityPreference,'here is the data')
          // if exist then update
          if(checkIsItemAlreadyExist){
            console.log('if exist')
            let updateTheCart = await cartItem.update({
               facilityPreference:facilityPreference,
                updatedDt:updatedDt,
                updatedBy:userId
            },
            {
                where:
                {
                    cartItemId:checkIsItemAlreadyExist.cartItemId
                }
            }
        )
        console.log('2',updateTheCart)
        if(updateTheCart>0){

               return  null;
          
         
        }
        else{
                return {
                    error:"Item is not added to the cart"
                }
        
        }
            
        }
        // else add the item
        else{
            console.log('add to cart')
            let createAddToCart = await cartItem.create({
                cartId:isUserExist.cartId,
                entityId:entityId,
                entityTypeId:entityTypeId,
                facilityPreference:facilityPreference,
                statusId:statusId,
                createdDt:createdDt,
                updatedDt:updatedDt,
                createdBy:userId,
                updatedBy:userId
            })


            if(createAddToCart){
                return null
                  
               
            }
            else{
              
                return {error: "Item is not added to the cart"}
                
            }
        }
    } catch (err) {
        return {
            error:err.message
        }
    }
}


let addToCart = async (req,res)=>{
    try {
        console.log('here reponse of sports',req.body)
        let userId = req.user?.userId || 1;
        let createdDt = new Date();
        let updatedDt = new Date();
        let statusId = 1
        let {entityId, entityTypeId, facilityPreference} = req.body
        console.log(typeof(entityId),'req.body',entityTypeId==2)
        // totalMembers, activityPreference,otherActivities,bookingDate,startTime,endTime,duration,playersLimit,sports,price    
        
        // first checks in the carts table consist of the user id 
        let isUserExist = await  cart.findOne({
            where:{
                [Op.and]:[{userId:userId},{statusId:statusId}]
            }
        })
        // if not exist add to cart table
        if(!isUserExist){
            isUserExist = await cart.create({
                userId:userId,
                createdDt:createdDt,
                updatedDt:updatedDt
            })
        }
        // then check entity wise where the user wants to add the data
        if(entityTypeId == 1){
            console.log('parks')
            // if parks
            let momentEndTime = calculateEndTime(facilityPreference.startTime,facilityPreference.duration)

            console.log('values', facilityPreference.bookingDate,facilityPreference.startTime,momentEndTime )
            // first check the item already exist or not
      
            const checkIsItemAlreadyExist = await cartItem.findOne({
                where: {
                    [Op.and]: [
                        { entityId: entityId },
                        { entityTypeId: entityTypeId },
                        { cartId: isUserExist.cartId },
                        sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.bookingDate') = :bookingDate`),
                        {
                            [Op.or]: [
                                sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') >= :startTime`),
                                sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') <= :endTime`)
                            ]
                        }
                    ]
                },
                replacements: {
                    bookingDate: facilityPreference.bookingDate,
                    startTime: facilityPreference.startTime,
                    endTime: momentEndTime
                }
            });
           
                // facilityPreference = {
                //     totalMembers:facilityPreference.totalMembers,
                //     otherActivities:facilityPreference.otherActivities,
                //     startTime:facilityPreference.startTime,
                //     duration:facilityPreference.duration,
                //     activityPreference:facilityPreference.activityPreference,
                //     price:facilityPreference.price
                // }

            
                let findTheResult = await insertAndUpdateTheCartItems(checkIsItemAlreadyExist,entityId,entityTypeId,facilityPreference,createdDt,updatedDt,statusId,userId,isUserExist)
                console.log('findthe resultttttt',findTheResult)
                if(findTheResult?.error){
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message:findTheResult.error
                    })
                    
                }
                else{
                    return res.status(statusCode.SUCCESS.code).json({message:"Item is successfully added to cart"})
                }
        }
        else if(entityTypeId == 2){
            // if playgrounds
            console.log('playgrounds')

         
              // first check the item already exist or not
      
              const checkIsItemAlreadyExist = await cartItem.findOne({
                where: {
                    [Op.and]: [
                        { entityId: entityId },
                        { entityTypeId: entityTypeId },
                        { cartId: isUserExist.cartId },
                        sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.bookingDate') = :bookingDate`),
                        {
                            [Op.or]: [
                                sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') >= :startTime`),
                                sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') <= :endTime`)
                            ]
                        }
                    ]
                },
                replacements: {
                    bookingDate: facilityPreference.bookingDate,
                    startTime: facilityPreference.startTime,
                    endTime: facilityPreference.endTime,
                }
            });
              // if exist then update
                //   facilityPreference = {
                //     playersLimit:playersLimit,
                //     sports:sports,
                //     startTime:startTime,
                //     endTime:endTime,
                //     price:price,
                //   }
               
                let findTheResult = await insertAndUpdateTheCartItems(checkIsItemAlreadyExist,entityId,entityTypeId,facilityPreference,createdDt,updatedDt,statusId,userId,isUserExist)
                if(findTheResult?.error){
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message:findTheResult.error
                    })
                    
                }
                else{
                    return res.status(statusCode.SUCCESS.code).json({message:"Item is successfully added to cart"})
                }


        }
        else if(entityTypeId == 3){
            // if Multipurpose ground
           
        }
        else if(entityTypeId == 4){
            // if blueway location
        }
        else if(entityTypeId == 5){
            //  if greenways
        }
        else if(entityTypeId ==  6){
            console.log('1')

            // if events
                // facilityPreference = { 
            //     totalMembers:totalMembers,
            //     startTime:startTime,
            //     duration:duration,
            //     price:price
            // }
            let momentEndTime = calculateEndTime(facilityPreference.startTime,facilityPreference.duration)

            // let checkIsItemAlreadyExist = await cartItem.findOne({
            //     where:{
            //       [Op.and] :[{entityId:entityId},{entityTypeId:entityTypeId},{cartId:isUserExist.cartId}, 
            //         sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.bookingDate') = :bookingDate`), // Check bookingDate in facilityPreference
            //         sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') >= :startTime`), // Check startTime in facilityPreference
            //         {
            //         [Op.or] : // Check startTime in facilityPreference
            //         [sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') <= :endTime`) // Check endTime in facilityPreference
            //        ]
            //     }
            //       ]}
            //     , 
            //     replacements: {
            //         bookingDate: facilityPreference.bookingDate,
            //         startTime: facilityPreference.startTime,
            //         endTime: momentEndTime
            //       }
            // })

            const checkIsItemAlreadyExist = await cartItem.findOne({
                where: {
                    [Op.and]: [
                        { entityId: entityId },
                        { entityTypeId: entityTypeId },
                        { cartId: isUserExist.cartId },
                        sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.bookingDate') = :bookingDate`),
                        {
                            [Op.or]: [
                                sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') >= :startTime`),
                                sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') <= :endTime`)
                            ]
                        }
                    ]
                },
                replacements: {
                    bookingDate: facilityPreference.bookingDate,
                    startTime: facilityPreference.startTime,
                    endTime: momentEndTime
                }
            });

                console.log(checkIsItemAlreadyExist,'check is item  already exist')

            
            let findTheResult = await insertAndUpdateTheCartItems(checkIsItemAlreadyExist,entityId,entityTypeId,facilityPreference,createdDt,updatedDt,statusId,userId,isUserExist)
            if(findTheResult?.error){
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:findTheResult.error
                })
                
            }
            else{
                return res.status(statusCode.SUCCESS.code).json({message:"Item is successfully added to cart"})
            }
            
        }
        
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}
// cart created

// view cart by useID

let viewCartByUserId = async(req,res)=>{
    try {
        const userId = req.user?.userId || 1
    
        let findCartIdByUserId = await cart.findOne({
            where:{
            [Op.and]:[{userId: userId},{statusId:1}]
            }
        })
        if(findCartIdByUserId){
            console.log(findCartIdByUserId.cartId,'cartId')
            let findCartItemsWRTCartId = await sequelize.query(`select c.cartItemId, c.cartId, c.entityId, c.entityTypeId, c.facilityPreference, ft.code as facilityTypeName, f.facilityName from 
            amabhoomi.cartitems c left join amabhoomi.facilitytypes ft on ft.facilityTypeId = c.entityTypeId  inner join amabhoomi.facilities f on f.facilityId = c.entityId where c.statusId = 1 and c.cartId = ?`,
            { type: sequelize.QueryTypes.SELECT ,
            replacements:[findCartIdByUserId.cartId]})
        //     let findCartItemsWRTCartId = await cartItem.findAll({
        //     attributes:["cartItemId","cartId","entityId","entityTypeId","facilityPreference"],
        //     where:{
                
        //         [Op.and]: [{cartId:findCartIdByUserId.cartId},{statusId:1}]
                
             
        //     },
        //     include: [
        //         {
        //           model: facilitytype,
        //           attributes: ["code"],
        //           on: {
        //             '$cartItem.entityTypeId$': sequelize.col('facilitytype.facilityTypeId')
        //           },
        //           required: true // true
        //         },
        //         {
        //           model: facilities,
        //           attributes: ["facilityName"],
        //           on:{
        //             '$cartItem.entityId$':sequelize.col('facilities.facilityId')
        //           },
        //           required: true //true
        //         }
        //       ],
         
        // })

        console.log(findCartItemsWRTCartId,'findCartIdByUserId')
        if(findCartIdByUserId.length<=0){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:  "Not a single item is associated with the cart"
              })
        }
        return res.status(statusCode.SUCCESS.code).json({
            message:"These are the cart items",data:findCartItemsWRTCartId, count:findCartItemsWRTCartId.length
        })

        }
        else{
            return res.status(statusCode.BAD_REQUEST.code).json({
              message:  "Not a single item is associated with the cart"
            })
        }


        

    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
        
    }
}


// remove the cart items

let updateCart = async(req,res)=>{
    try {
    
        let userId = req.user?.userId||1
        let cartItemId = req.params.cartItemId
        let statusId = 2

        let findTheCartIdFromUserId = await cart.findOne({
            where:{
                userId:userId
            }
        })
        console.log(findTheCartIdFromUserId,'fjd',cartItemId,'fd',findTheCartIdFromUserId.cartId)
      
            let removeTheCartItems = await cartItem.update(
                {statusId:statusId},
                {
                    where:{
                    [Op.and]:[{cartItemId:cartItemId,cartId:findTheCartIdFromUserId.cartId}]
                }
            })
            console.log(removeTheCartItems,'cart items')

            if(removeTheCartItems>0){
                return res.status(statusCode.SUCCESS.code).json({
                    message:"Successfully removed the items"
                })
            }

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
        })
      
    } catch (err) {
       return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:err.message}) 
    }
}

// view cart w.r.t to cart Item id
let viewCartItemsWRTCartItemId = async(req,res)=>{
    try {
        let cartItemId = req.params.cartItemId;

        let viewTheCartItemData = await sequelize.query(`select c.cartItemId, c.cartId, c.entityId, c.entityTypeId, c.facilityPreference, ft.code as facilityTypeName, f.facilityName from 
        amabhoomi.cartitems c inner join amabhoomi.facilitytypes ft on ft.facilityTypeId = c.entityTypeId  inner join amabhoomi.facilities f on f.facilityId = c.entityId where c.cartItemId = ? `,
        {
            replacements: [cartItemId],
            type: sequelize.QueryTypes.SELECT
        })
        
        return res.status(statusCode.SUCCESS.code).json({
            message:
                "Here are the cart items data"
            ,
            data:viewTheCartItemData
        })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}


let generateQRCode = async(req,res)=>{
    try {
        let {bookingId} = req.body
        let statusId = 1;
        if(!bookingId){
            return res.status(statusCode.BAD_REQUEST.code).json({
                message:"Please provide required details"
            })
        }
        let fetchFacilityId =  await facilitybookings.findOne({
            where:{
                facilityBookingId:bookingId
            }
        })
        let combinedData = `${bookingId},${fetchFacilityId.facilityTypeId},${fetchFacilityId.facilityId}`

        let QRCodeUrl = await QRCode.toDataURL(combinedData)

        let fetchBookingDetails = await facilitybookings.findOne({
            
            where:{
               [Op.and]:[{ facilityBookingId:bookingId},{statusId:statusId}]
            },
            include:[
                {
                    model:facilities
                }
            ]
        })
        fetchBookingDetails.dataValues.QRCodeUrl = QRCodeUrl
        console.log('QRCODE', fetchBookingDetails)

        return res.status(statusCode.SUCCESS.code).json({
            message:"Here is the QR code",
            bookingDetails:fetchBookingDetails
            
        })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}


let verifyTheQRCode = async(req,res)=>{
    try {
        let {QrCodeData}= req.body

        
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:err.message
        })
    }
}
module.exports = {
    parkBooking,
    parkBookingFormInitialData,
    addToCart,
    viewCartByUserId,
    updateCart,
    viewCartItemsWRTCartItemId,
    generateQRCode,
    verifyTheQRCode
}