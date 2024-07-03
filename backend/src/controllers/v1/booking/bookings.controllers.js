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
let port = process.env.PORT
const { Op } = require('sequelize');
var QRCode = require('qrcode')
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { v4: uuidv4 } = require('uuid');
let uploadDir = process.env.UPLOAD_DIR
// events booking table
const eventBooking = db.eventBookings;
const moment = require('moment');
const fs = require('fs')
const path = require('path')
let eventactivites = db.eventActivities
let file = db.file;
let fileAttachment = db.fileattachment
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

// ticket upload code start
let uploadTicket = async(title, bookingRef, location, date, time, cost, totalMembers,combinedData, facilityBookingId,userId)=>{
    try {
        let qrData = await QRCode.toDataURL(combinedData)

        let createdDt = new Date();
        let updatedDt = new Date();
        console.log(title, bookingRef, location, date, time, cost, totalMembers,combinedData,'all data')
        const pdfBytes = await generatePDF({title,bookingRef, location, date, time, cost, totalMembers, qrData });
        console.log(pdfBytes,'pdf bytes')
            // generate pdf and share the link
            // Generate a unique filename
            const uniqueId = uuidv4();
            
            const fileName = `${uniqueId}.pdf`;
            let fileType = "pdf"
            console.log('fileName')
            const filePath = path.join(uploadDir, 'ticketUploads', fileName);
            console.log('filePath')
            // Ensure the uploads directory exists
            if (!fs.existsSync(path.join(uploadDir, 'ticketUploads'))) {
                fs.mkdirSync(path.join(uploadDir, 'ticketUploads'));
            }

            // Write the PDF bytes to a file
            fs.writeFileSync(filePath, pdfBytes);

        const shareableLink = `http://localhost:${port}/static/ticketUploads/${fileName}`;
        console.log('jlfjlsdjfljd')
        let entityType = 'facilityBooking'
        let filePurpose = 'ticketBooking'
        // add this to file and file attachment
        // insert to file table and file attachment table
         let url = `/ticketUploads/${fileName}`
        let createFile = await file.create({
            fileName: fileName,
            fileType:fileType ,
            url: url,
            statusId: 1,
            createdDt: createdDt,
            updatedDt: updatedDt,
            createdBy:userId,
            updatedBy:userId
          });
          console.log('createFile', createFile)
          if (!createFile) {
            return errors.push(`Failed to create  ticket file`);
          } else {
            // Insert into file attachment table
            let createFileAttachment = await fileAttachment.create({
              entityId: facilityBookingId,
              entityType: entityType,
              fileId: createFile.fileId,
              statusId: 1,
              filePurpose: filePurpose
            });

            console.log('fjljdflds')
            if (!createFileAttachment) {
              return errors.push(`Failed to create file attachment for facility file at index ${i}`);
            }
            return  {shareableLink:shareableLink};
          }
       
    } catch (err) {
        return {
            error:"Something went wrong"
        }
    }
}
// ticket upload code end
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
        let statusId = 1;
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
                }, { transaction, returning: true  });

                console.log(newParkBooking.facilityBookingId, 'newParkBooking data created' );
                let findTheBookingDetails = await facilitybookings.findOne({
                    where:{
                       [Op.and]: [{facilityBookingId:newParkBooking.facilityBookingId},{statusId:statusId}]
                    },
                     transaction 
                })

                console.log('facilityBookingBookingReference find ', findTheBookingDetails)
                for (let i = 0; i < bookingData.activityPreference.length; i++) {
                    const newParkBookingActivityPreference = await userbookingactivities.create({
                        facilityBookingId: newParkBooking.dataValues.facilityBookingId,
                        userActivityId: bookingData.activityPreference[i],
                        statusId: 1,
                        createdBy: userId
                    }, { transaction });
                }

                let findFacilityInformation = await facilities.findOne({
                    where:{
                        [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
                    }
                })
               
              
                let title = findFacilityInformation.facilityname;
                let bookingRef = findTheBookingDetails.dataValues.bookingReference;
                let location = findFacilityInformation.address;
                let date = bookingData.bookingDate;
                let time = newParkBooking.dataValues.startDate;
                let cost = newParkBooking.dataValues.amount;
                let totalMembers = newParkBooking.dataValues.totalMembers;
                let combinedData = `${newParkBooking.dataValues.facilityBookingId},${entityTypeId},${entityId}`
                let facilityBookingId = newParkBooking.dataValues.facilityBookingId
                let ticketUploadAndGeneratePdf = await uploadTicket(title,bookingRef, location, date, time, cost, totalMembers, combinedData,facilityBookingId,userId)

                if(ticketUploadAndGeneratePdf?.error){
                    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                        message:ticketUploadAndGeneratePdf.error
                    })
                }
               

                await transaction.commit();

                res.status(statusCode.SUCCESS.code).json({
                    message: 'Park booking done successfully',
                    data: newParkBooking,
                    shareableLink:ticketUploadAndGeneratePdf.shareableLink
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

                let findFacilityInformation = await facilities.findOne({
                    where:{
                        [Op.and]:[{statusId:statusId},{facilityId:facilityId}]
                    }
                })
                let findTheBookingDetails = await facilitybookings.findOne({
                    where:{
                       [Op.and]: [{facilityBookingId:newPlaygroundBooking.facilityBookingId},{statusId:statusId}]
                    },
                     transaction 
                })
                let title = findFacilityInformation.facilityname;
                let bookingRef = findTheBookingDetails.bookingReference;
                let location = findFacilityInformation.address;
                let date =  bookingData.bookingDate;
                let time = newPlaygroundBooking.startDate;
                let cost = newPlaygroundBooking.amount;
                let totalMembers = newPlaygroundBooking.totalMembers;
                let combinedData = `${newPlaygroundBooking.facilityBookingId},${entityTypeId},${entityId}`
                let facilityBookingId = newPlaygroundBooking.dataValues.facilityBookingId

                let ticketUploadAndGeneratePdf = await uploadTicket(title,bookingRef, location, date, time, cost, totalMembers, combinedData,facilityBookingId,userId)

                if(ticketUploadAndGeneratePdf?.error){
                    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                        message:ticketUploadAndGeneratePdf.error
                    })
                }
               

                await transaction.commit();

                res.status(statusCode.SUCCESS.code).json({
                    message: 'Playground booking done successfully',
                    data: newPlaygroundBooking,
                    shareableLink:ticketUploadAndGeneratePdf.shareableLink
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
                let findEventInformation = await eventactivites.findOne({
                    where:{
                        [Op.and]:[{statusId:statusId},{eventId:eventId}]
                    }
                })
                // let findTheBookingDetails = await facilitybookings.findOne({
                //     where:{
                //        [Op.and]: [{facilityBookingId:eventBookingData.facilityBookingId},{statusId:statusId}]
                //     },
                //      transaction 
                // })
                let title = findEventInformation.eventName;
                let bookingRef = eventBookingData.bookingReference;
                let location = findEventInformation.locationName;
                let date =  bookingData.bookingDate;
                let time = eventBookingData.startDate;
                let cost = eventBookingData.amount;
                let totalMembers = eventBookingData.totalMembers;
                let combinedData = `${eventBookingData.eventBookingId},${entityTypeId},${entityId}`
                let eventBookingId = eventBookingData.eventBookingId;

                let ticketUploadAndGeneratePdf = await uploadTicket(title, bookingRef, location, date, time, cost, totalMembers, combinedData, eventBookingId, userId)

                if(ticketUploadAndGeneratePdf?.error){
                    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                        message:ticketUploadAndGeneratePdf.error
                    })
                }
               

                await transaction.commit();

                res.status(statusCode.SUCCESS.code).json({
                    message: 'Event booking done successfully',
                    data: eventBooking,
                    shareableLink:ticketUploadAndGeneratePdf.shareableLink
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
                updatedDt:updatedDt,
                statusId:statusId
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
        console.log('findCartIdByUserId', findCartIdByUserId);
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

let generatePDF = async({ title, bookingRef, location, date, time, cost, totalMembers, qrData }) =>{
    console.log('fhjsfjskljfklsjflksjlkfjsljfslkjfklkahjgsfs')
    console.log(title, bookingRef, location, date, time, cost, totalMembers,'all parameters data')
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([400, 400]);
    const { width, height } = page.getSize();
    const fontSize = 12;
  
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    console.log("881")
    // Add event title
    page.drawRectangle({
        x: 10,
        y: 10,
        width: width - 20,
        height: height - 20,
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 1,
        borderStyle: 'dotted',
    });
        // Center the title
        const titleFontSize = 15;
        const titleWidth = boldFont.widthOfTextAtSize(title, titleFontSize);
        const titleX = (width - titleWidth) / 2;
    
    page.drawText(title, {
        x: titleX,
        y: height - 50,
        size: titleFontSize,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
    });
    console.log('890')
    // Add booking reference
    page.drawText(`Booking Ref# ${bookingRef}`, {
        x: 50,
        y: height - 80,
        size: 15,
        font: boldFont,
        color: rgb(0.25, 0.28, 0.3),
    });
    console.log('899')
 
    page.drawLine({
        start: { x: 40, y: height - 95 },
        end: { x: width - 40, y: height - 95 },
        thickness: 1,
        color: rgb(0.36, 0.4, 0.45),
    });
    

    // Add location
    page.drawText('Location:', {
        x: 50,
        y: height - 120,
        size: 15,
        font: boldFont,
        color: rgb(0.26, 0.29, 0.31),
    });
    page.drawText(location, {
        x: 50,
        y: height - 140,
        size: 12,
        font: boldFont,
        color: rgb(0.11, 0.11, 0.11),
    });


    // Add date and time
    page.drawText(`Date`, {
        x: 50,
        y: height - 180,
        size: 15,
        font: boldFont,
        color: rgb(0.32, 0.34, 0.35),
    });
    console.log('920')

    page.drawText(`${date}`, {
        x: 50,
        y: height - 200,
        size: 15,
        font: boldFont,
        color: rgb(0.11, 0.11, 0.11),
    });
    console.log('929')
    page.drawText(`Time`, {
        x: width - 150,
        y: height - 180,
        size: 15,
        font: boldFont,
        color: rgb(0.31, 0.33, 0.34),
    });
    console.log('937')

    page.drawText(`${time}`, {
        x: width - 150,
        y: height - 200,
        size: 15,
        font: boldFont,
        color: rgb(0.11, 0.11, 0.11),
    });
    console.log('946')

    // Add cost and total members
    page.drawText(`Cost`, {
        x: 50,
        y: height - 240,
        size: 15,
        font: boldFont,
        color: rgb(0.32, 0.34, 0.35),
    });
    console.log('956')

    page.drawText(`Rs ${cost} /-`, {
        x: 50,
        y: height - 260,
        size: 15,
        font: boldFont,
        color: rgb(0.11, 0.11, 0.11),
    });
    console.log('965')

    page.drawText(`Total Member(s)`, {
        x: width - 150,
        y: height - 240,
        size: 15,
        font: boldFont,
        color: rgb(0.31, 0.33, 0.34),
    });
    console.log('974')

    page.drawText(totalMembers.toString(), {
        x: width - 120,
        y: height - 260,
        size: 15,
        font: boldFont,
        color: rgb(0.11, 0.11, 0.11),
    });
    console.log("983")

    // Generate QR code
    const qrCodeImage = qrData;
    const qrCodeImageBytes = Buffer.from(qrCodeImage.split(',')[1], 'base64');
    const qrCodeImageEmbed = await pdfDoc.embedPng(qrCodeImageBytes);
    const qrCodeDims = qrCodeImageEmbed.scale(0.6);
    console.log('990',qrCodeDims)
    // Add QR code
    page.drawImage(qrCodeImageEmbed, {
        x: 50,
        y: height - 340,
        width: qrCodeDims.width,
        height: qrCodeDims.height,
    });
  
    // Serialize the PDF document to bytes (Uint8Array)
    console.log('pdf doc',pdfDoc)
    return await pdfDoc.save();
  }

let generateQRCode = async(req,res)=>{
    try {
        let {bookingId} = req.body
        let statusId = 1;
        let entityType = 'facilityBooking'
        let filePurpose = 'ticketBooking'
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
        console.log('fetch facility', fetchFacilityId)
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
        let fetchPdfImage = await sequelize.query(`select url, entityType from amabhoomi.files f inner join amabhoomi.fileattachments fa on f.fileId = fa.fileId where fa.entityId = ? and fa.filePurpose = ? and fa.entityType=? and f.statusId = ?`,{replacements:[bookingId,filePurpose,entityType,statusId],type:QueryTypes.SELECT})
        fetchBookingDetails.dataValues.QRCodeUrl = QRCodeUrl
        fetchBookingDetails.dataValues.url = fetchPdfImage[0].url
        console.log('fetchPdfImage', fetchPdfImage)
        
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