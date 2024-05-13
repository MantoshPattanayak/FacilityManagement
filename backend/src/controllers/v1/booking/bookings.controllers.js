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
 
const moment = require('moment')
let parkBooking = async (req, res) => {
    try {
        /**
         * @facilitytype park
         */
        let userId = req.user?.id || 1;
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



//  add to cart and cart items table
// create cart
// view cart by user id 
// update cart by user id means  remove the cart items 


// create cart

let addToCart = async (req,res)=>{
    try {
        console.log('1')
        let userId = req.user?.id || 1;
        let createdDt = new Date();
        let updatedDt = new Date();
        let statusId =1
        let {entityId, entityTypeId, facilityPreference} = req.body

        console.log(req.body,'req.body')
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
                updatedDt:updatedDt,
                statusId:1
            })
        }
        // then check entity wise where the user wants to add the data
        if(entityTypeId = 1){
            // if parks
            let momentStartTime = moment.duration(facilityPreference.startTime);
            let momentDuration = moment.duration(facilityPreference.duration);
            // adding the duration
            let momentEndTime = momentStartTime.add(momentDuration)
            // Format the total momentEndTime back into HH:mm:ss format
            momentEndTime = moment.utc(momentEndTime.asMilliseconds()).format('HH:mm:ss')

            console.log('values', facilityPreference.bookingDate,facilityPreference.startTime,momentEndTime )
            // first check the item already exist or not
            let checkIsItemAlreadyExist = await cartItem.findOne({
                where:{
                  [Op.and] :[{entityId:entityId},{entityTypeId:entityTypeId},{cartId:isUserExist.cartId}, 
                    sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.bookingDate') = :bookingDate`), // Check bookingDate in facilityPreference
                    sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') >= :startTime`), // Check startTime in facilityPreference
                    sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.startTime') <= :endTime`) // Check endTime in facilityPreference
                  ]
                }
                , 
                replacements: {
                    bookingDate: facilityPreference.bookingDate,
                    startTime: facilityPreference.startTime,
                    endTime: momentEndTime
                  }
            }) 
            console.log(facilityPreference.startTime,'startTime',checkIsItemAlreadyExist)
            // if exist then update
            if(checkIsItemAlreadyExist){
                // facilityPreference = {
                //     totalMembers:facilityPreference.totalMembers,
                //     otherActivities:facilityPreference.otherActivities,
                //     startTime:facilityPreference.startTime,
                //     duration:facilityPreference.duration,
                //     activityPreference:facilityPreference.activityPreference,
                //     price:facilityPreference.price
                // }
                // put booking date if the data is not present

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
            if(updateTheCart.length>0){
                return res.status(statusCode.SUCCESS.code).json({
                    message: "Item successfully added to cart"
                })
            }
            else{
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:"Item is not added to the cart"
                })
            }
                
            }
            // else add the item
            else{
        
                let createAddToCart = await cartItem.create({
                    cartId:isUserExist.cartId,
                    entityId:entityId,
                    entityTypeId:entityTypeId,
                    facilityPreference:facilityPreference,
                    statusId:1,
                    createdDt:createdDt,
                    updatedDt:updatedDt,
                    createdBy:userId,
                    updatedBy:userId
                })


                if(createAddToCart){
                    return res.status(statusCode.SUCCESS.code).json({
                        message: "Item successfully added to cart"
                    })
                }
                else{
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message:"Item is not added to the cart"
                    })
                }
            }

        }
        else if(entityTypeId = 2){
            // if playgrounds
         
              // first check the item already exist or not
              let checkIsItemAlreadyExist = await cartItem.findOne({
                  where:{
                    [Op.and] :[{entityId:entityId},{cartId:isUserExist.cartId},{entityTypeId:entityTypeId},{bookingDate:facilityPreference.bookingDate},{startTime:{
                      [Op.gte]:[facilityPreference.startTime]
                    }},{startTime:{
                      [Op.lte]:[facilityPreference.endTime]
                    }}]
                  }
              }) 
              // if exist then update
              if(checkIsItemAlreadyExist){
                //   facilityPreference = {
                //     playersLimit:playersLimit,
                //     sports:sports,
                //     startTime:startTime,
                //     endTime:endTime,
                //     price:price,
                //   }
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
              if(updateTheCart.length>0){
                  return res.status(statusCode.SUCCESS.code).json({
                      message: "Item successfully added to cart"
                  })
              }
              else{
                  return res.status(statusCode.BAD_REQUEST.code).json({
                      message:"Item is not added to the cart"
                  })
              }
                  
              }
              // else add the item
              else{
               
                  let createAddToCart = await cartItem.create({
                      cartId:isUserExist.cartId,
                      entityId:entityId,
                      entityTypeId:entityTypeId,
                      facilityPreference:facilityPreference,
                      statusId:1,
                      createdDt:createdDt,
                      updatedDt:updatedDt,
                      createdBy:userId,
                      updatedBy:userId
                  })
  
  
                  if(createAddToCart){
                      return res.status(statusCode.SUCCESS.code).json({
                          message: "Item successfully added to cart"
                      })
                  }
                  else{
                      return res.status(statusCode.BAD_REQUEST.code).json({
                          message:"Item is not added to the cart"
                      })
                  }
              }
  

        }
        else if(entityTypeId = 3){
            // if Multipurpose ground
           
        }
        else if(entityTypeId = 4){
            // if blueway location
        }
        else if(entityTypeId = 5){
            //  if greenways
        }
        else if(entityTypeId= 6){
            // if events
            let momentStartTime = moment.duration(facilityPreference.startTime);
            let momentDuration = moment.duration(facilityPreference.duration);
            // adding the duration
            let momentEndTime = momentStartTime.add(momentDuration)
            // Format the total momentEndTime back into HH:mm:ss format
            momentEndTime = moment.utc(momentEndTime.asMilliseconds()).format('HH:mm:ss')
            // first check the item already exist or not
            let checkIsItemAlreadyExist = await cartItem.findOne({
                where:{
                  [Op.and] :[{entityId:entityId},{cartId:isUserExist.cartId},{entityTypeId:entityTypeId},{bookingDate:facilityPreference.bookingDate},{startTime:{
                    [Op.gte]:[facilityPreference.startTime]
                  }},{startTime:{
                    [Op.lte]:[momentEndTime]
                  }}]
                }
            }) 
            // if exist then update
            if(checkIsItemAlreadyExist){
                // facilityPreference = { 
                //     totalMembers:totalMembers,
                //     startTime:startTime,
                //     duration:duration,
                //     price:price
                // }
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
            if(updateTheCart.length>0){
                return res.status(statusCode.SUCCESS.code).json({
                    message: "Item successfully added to cart"
                })
            }
            else{
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message:"Item is not added to the cart"
                })
            }
                
            }
            // else add the item
            else{
           
                let createAddToCart = await cartItem.create({
                    cartId:isUserExist.cartId,
                    entityId:entityId,
                    entityTypeId:entityTypeId,
                    facilityPreference:facilityPreference,
                    statusId:1,
                    createdDt:createdDt,
                    updatedDt:updatedDt,
                    createdBy:userId,
                    updatedBy:userId
                })


                if(createAddToCart){
                    return res.status(statusCode.SUCCESS.code).json({
                        message: "Item successfully added to cart"
                    })
                }
                else{
                    return res.status(statusCode.BAD_REQUEST.code).json({
                        message:"Item is not added to the cart"
                    })
                }
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
        console.log('12')
        const userId = req.user?.id || 1
        let findCartIdByUserId = await cart.findOne({
            where:{
            [Op.and]:[{userId: userId},{statusId:1}]
            }
        })

        // console.log(findCartIdByUserId,'findCartByUserId')
        if(findCartIdByUserId){
            console.log(findCartIdByUserId.cartId,'cartId')
            let findCartItemsWRTCartId = await sequelize.query(`select c.cartItemId, c.cartId, c.entityId, c.entityTypeId, c.facilityPreference, ft.code as facilityTypeName, f.facilityName from 
            amabhoomi.cartitems c inner join amabhoomi.facilitytypes ft on ft.facilityTypeId = c.entityTypeId  inner join amabhoomi.facilities f on f.facilityId = c.entityId `)
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

// view Cart with respect to cart item id



// remove the cart items

let updateCart = async(req,res)=>{
    try {
    
        let userId = req.user?.id
        let {cartItemId}= req.params.cartItemId
        let statusId = 0

        let findTheCartIdFromUserId = await cart.findOne({
            where:{
                userId:userId
            }
        })
      
            let removeTheCartItems = await cartItem.update(
                {statusId:statusId},
                {where:{
                    [Op.and]:[{cartItemId:cartItemId,cartId:findTheCartIdFromUserId.cartId}]
                }
            })

            if(removeTheCartItems.length>0){
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

module.exports = {
    parkBooking,
    parkBookingFormInitialData,
    addToCart,
    viewCartByUserId,
    updateCart
}