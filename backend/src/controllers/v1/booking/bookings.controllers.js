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
let {encrypt} = require('../../../middlewares/encryption.middlewares')
let {decrypt} = require('../../../middlewares/decryption.middlewares')
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
const path = require('path');
const checkForCancellation = require("../../../utils/bookingCancellation");
let eventactivites = db.eventActivities
let file = db.file;
let fileAttachment = db.fileattachment
let hostBooking = db.hosteventbookings
// let parkBookingTestForPark = async (req, res) => {
//     try {
//         /**
//          * @facilitytype park
//          */
//         let userId = req.user?.userId || 1;
//         let {
//             facilityId,
//             totalMembers,
//             amount,
//             activityPreference,
//             otherActivities,
//             bookingDate,
//             startTime,
//             durationInHours
//         } = req.body;

//         console.log({
//             facilityId,
//             totalMembers,
//             amount,
//             activityPreference,
//             otherActivities,
//             bookingDate,
//             startTime,
//             durationInHours
//         }, 'before change');


//         // Function to add hours to a time string
//         // function addHoursToTime(timeString, hoursToAdd) {
//         //     // Parse the time string into hours and minutes
//         //     const [hours, minutes] = timeString.split(':').map(Number);
//         //     console.log({hours, minutes, hoursToAdd});

//         //     // Add the hours
//         //     let newHours = (hours + hoursToAdd) % 24;

//         //     // Ensure newHours is in the range [0, 23]
//         //     newHours = newHours < 0 ? newHours + 24 : newHours;

//         //     // Format the result back into a time string
//         //     const newTimeString = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
//         //     console.log(newTimeString);

//         //     return newTimeString;
//         // }

//         const endTime = addHoursToTime(startTime, Number(durationInHours));

//         console.log({
//             facilityId,
//             totalMembers,
//             amount,
//             activityPreference,
//             otherActivities,
//             bookingDate,
//             startTime,
//             endTime,
//             durationInHours
//         }, 'after change');

//         let statusList = await statusmasters.findAll({ where: { parentStatusCode: 'PAYMENT_STATUS' } });

//         // console.log(statusList[0].dataValues);

//         let paidStatusCode = statusList.filter((status) => { return status.dataValues.statusCode == 'COMPLETED' })[0].dataValues.statusId;

//         // console.log('paid', paidStatusCode);

//         bookingTransaction();
//         // res.status(200).json({message: 'Booking details submitted!'})

//         async function bookingTransaction() {
//             let transaction;
//             try {
//                 transaction = await sequelize.transaction();

//                 const newParkBooking = await facilitybookings.create({
//                     facilityId: facilityId,
//                     totalMembers: totalMembers,
//                     otherActivities: otherActivities,
//                     bookingDate: bookingDate,
//                     startDate: `${startTime}`,
//                     endDate: `${endTime}`,
//                     amount: amount,
//                     statusId: 1,
//                     paymentstatus: '',
//                     createdBy: userId
//                 }, { transaction });

//                 console.log('newParkBooking', newParkBooking);

//                 for (let i = 0; i < activityPreference.length; i++) {
//                     const newParkBookingActivityPreference = await userbookingactivities.create({
//                         facilityBookingId: newParkBooking.dataValues.facilityBookingId,
//                         userActivityId: activityPreference[i],
//                         statusId: 1,
//                         createdBy: userId
//                     }, { transaction });
//                 }

//                 await transaction.commit();

//                 res.status(statusCode.SUCCESS.code).json({
//                     message: 'Park booking done successfully',
//                     data: newParkBooking
//                 })
//             }
//             catch (error) {
//                 if (transaction) await transaction.rollback();

//                 console.error('Error creating user park booking:', error);
//                 res.status(statusCode.BAD_REQUEST.code).json({
//                     message: 'Park booking failed!',
//                     data: []
//                 })
//             }
//         }
//     }
//     catch (error) {
//         res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
//             message: error.message
//         })
//     }
// }

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
    console.log({ hours, minutes, hoursToAdd });

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
let uploadTicket = async (title, bookingRef, location, date, time, cost, totalMembers, combinedData, facilityBookingId, userId, entityType) => {
    try {
        let qrData = await QRCode.toDataURL(combinedData)

        let createdDt = new Date();
        let updatedDt = new Date();
        console.log(title, bookingRef, location, date, time, cost, totalMembers, combinedData, 'all data')
        const pdfBytes = await generatePDF({ title, bookingRef, location, date, time, cost, totalMembers, qrData });
        console.log(pdfBytes, 'pdf bytes')
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
        let filePurpose = 'ticketBooking'
        // add this to file and file attachment
        // insert to file table and file attachment table
        let url = `/ticketUploads/${fileName}`
        let createFile = await file.create({
            fileName: fileName,
            fileType: fileType,
            url: url,
            statusId: 1,
            createdDt: createdDt,
            updatedDt: updatedDt,
            createdBy: userId,
            updatedBy: userId
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
            return { shareableLink: shareableLink };
        }

    } catch (err) {
        return {
            error: "Something went wrong"
        }
    }
}
// ticket upload code end
let parkBooking = async (entityId,entityTypeId,facilityPreference,orderId,userId,transaction) => {
    try {
    
        // console.log({
        //     entityId,
        //     entityTypeId,
        //     facilityPreference
        // });
        console.log('122',orderId)
        let statusId = 1;
        let bookingStatus = 3;  //Pending 
        let cartStatus = 21; // In cart
        let paymentStatus = 26;  // pending payment status 
        let result;
        console.log('entityId inside booking',entityId)
        /**
         * 1	PARKS 
         * 2	PLAYGROUNDS
         * 3	MULTIPURPOSE_GROUND
         * 6	EVENTS
         */

        // if no userCartId, then decrypt else decrypt in a function
        //decrypt each values of facility preference object

        if (entityTypeId == 1) {
            console.log('inside park data')
           result =  await bookingTransactionForPark(entityId, facilityPreference,transaction,entityTypeId,bookingStatus,statusId,paymentStatus,orderId,userId);
        console.log(result, 'result for park')
        
        }
        else if (entityTypeId == 2) {
            
            result = await bookingTransactionForPlaygrounds(entityId, facilityPreference,transaction,entityTypeId,bookingStatus,statusId,paymentStatus,orderId,userId);
        
        }
        else if (entityTypeId == 3) {
            result = await bookingTransactionForMPgrounds(entityId, facilityPreference,transaction,entityTypeId,bookingStatus,statusId,paymentStatus,orderId,userId);
        }
        else if (entityTypeId == 6) {
            result =  await bookingTransactionForEvents(entityId, facilityPreference,transaction,entityTypeId,bookingStatus,statusId,paymentStatus,orderId,userId);
        }
        else {
            return {
                error:`Booking failed`
            }
        }
        
      
        return result;
    
    }
    catch (error) {
    return {
        error:`Something went wrong`
    }
    }
    }

        async function bookingTransactionForPark(facilityId, bookingData,transaction,entityTypeId,bookingStatus,statusId,paymentStatus,orderId,userId) {
            try {
                console.log('new park booking 232',facilityId, bookingData,entityTypeId,bookingStatus,statusId,paymentStatus,orderId,'userId',userId)
                let newParkBooking = await facilitybookings.create({
                    facilityId: facilityId,
                    facilityTypeId: entityTypeId,
                    orderId:orderId,
                    totalMembers: bookingData.totalMembers,
                    otherActivities: bookingData.otherActivities,
                    bookingDate: bookingData.bookingDate,
                    startDate: bookingData.startTime,
                    endDate: `${addHoursToTime(bookingData.startTime, Number(bookingData.durationInHours))}`,
                    amount: bookingData.amount,
                    statusId: bookingStatus,
                    paymentstatus: paymentStatus,
                    createdBy: userId
                }, { transaction, returning: true });

                console.log(newParkBooking.facilityBookingId, 'newParkBooking data created');
                if (!newParkBooking){
                    await transaction.rollback();
                    return {
                        error:`Something went wrong`
                    }
                }
                let findTheBookingDetails = await facilitybookings.findOne({
                    where: {
                        [Op.and]: [{ facilityBookingId: newParkBooking.facilityBookingId }, { statusId: bookingStatus }]
                    },
                    transaction
                })

                console.log('facilityBookingBookingReference find ', findTheBookingDetails)
                for (let i = 0; i < bookingData.activityPreference.length; i++) {
                    const newParkBookingActivityPreference = await userbookingactivities.create({
                        facilityBookingId: newParkBooking.dataValues.facilityBookingId,
                        userActivityId: bookingData.activityPreference[i],
                        statusId: statusId,
                        createdBy: userId
                    }, { transaction });
                }

                let findFacilityInformation = await facilities.findOne({
                    where: {
                        [Op.and]: [{ statusId: statusId }, { facilityId: facilityId }]
                    },
                    transaction
                })


                // let title = findFacilityInformation.facilityname;
                // let bookingRef = findTheBookingDetails.dataValues.bookingReference;
                // let location = findFacilityInformation.address;
                // let date = bookingData.bookingDate;
                // let time = newParkBooking.dataValues.startDate;
                // let cost = newParkBooking.dataValues.amount;
                // let totalMembers = newParkBooking.dataValues.totalMembers;
                // let combinedData = `${newParkBooking.dataValues.facilityBookingId},${entityTypeId},${entityId}`
                // let facilityBookingId = newParkBooking.dataValues.facilityBookingId

                // let entityType = 'facilityBooking'
                // let ticketUploadAndGeneratePdf = await uploadTicket(title, bookingRef, location, date, time, cost, totalMembers, combinedData, facilityBookingId, userId, entityType)

                // if (ticketUploadAndGeneratePdf?.error) {
                //     return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                //         message: ticketUploadAndGeneratePdf.error
                //     })
                // }


                // await transaction.commit();

                // res.status(statusCode.SUCCESS.code).json({
                //     message: 'Park booking done successfully',
                //     data: newParkBooking, entityId, entityTypeId,
                //     shareableLink: ticketUploadAndGeneratePdf.shareableLink
                // })
                console.log('park booking inserted successfully')
                return {
                    bookingId:newParkBooking.dataValues.facilityBookingId
                };
            }
            catch (error) {
                if (transaction) await transaction.rollback();

                return {
                    error:`Park booking failed!`
                }
                // console.error('Error creating user park booking:', error);
                // res.status(statusCode.BAD_REQUEST.code).json({
                //     message: 'Park booking failed!',
                //     data: []
                // })
            }
        }

        async function bookingTransactionForPlaygrounds(facilityId, bookingData,transaction,entityTypeId,bookingStatus,statusId,paymentStatus,orderId,userId) {
            /** body params
             * playerLimit: '',
             * sports: '',
             * bookingDate: '',
             * startTime: '',
             * endTime: '',
             * amount: '',
             */
         
            try {

                let newPlaygroundBooking = await facilitybookings.create({
                    facilityId: facilityId,
                    orderId:orderId,
                    facilityTypeId: entityTypeId,
                    totalMembers: bookingData.totalMembers,
                    sportsName: bookingData.sports,
                    bookingDate: bookingData.bookingDate,
                    startDate: bookingData.startTime,
                    endDate: bookingData.endTime,
                    amount: bookingData.amount,
                    statusId: bookingStatus,
                    paymentstatus: paymentStatus,
                    createdBy: userId
                }, { transaction });

                console.log('newPlaygroundBooking', newPlaygroundBooking);
               if (!newPlaygroundBooking){
                    await transaction.rollback();
                    return {
                        error:`Something went wrong`
                    }
                }

                let findFacilityInformation = await facilities.findOne({
                    where: {
                        [Op.and]: [{ statusId: statusId }, { facilityId: facilityId }]
                    },
                    transaction
                })
                let findTheBookingDetails = await facilitybookings.findOne({
                    where: {
                        [Op.and]: [{ facilityBookingId: newPlaygroundBooking.facilityBookingId }, { statusId: bookingStatus }]
                    },
                    transaction
                })
                let title = findFacilityInformation.facilityname;
                let bookingRef = findTheBookingDetails.bookingReference;
                let location = findFacilityInformation.address;
                let date = bookingData.bookingDate;
                let time = newPlaygroundBooking.startDate;
                let cost = newPlaygroundBooking.amount;
                let totalMembers = newPlaygroundBooking.totalMembers;
                let combinedData = `${newPlaygroundBooking.facilityBookingId},${entityTypeId},${entityId}`
                let facilityBookingId = newPlaygroundBooking.dataValues.facilityBookingId

                let entityType = 'facilityBooking'

                // let ticketUploadAndGeneratePdf = await uploadTicket(title, bookingRef, location, date, time, cost, totalMembers, combinedData, facilityBookingId, userId, entityType)

                // if (ticketUploadAndGeneratePdf?.error) {
                //     return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                //         message: ticketUploadAndGeneratePdf.error
                //     })
                // }


                // await transaction.commit();

                // res.status(statusCode.SUCCESS.code).json({
                //     message: 'Playground booking done successfully',
                //     data: newPlaygroundBooking, entityId, entityTypeId,
                //     shareableLink: ticketUploadAndGeneratePdf.shareableLink
                // })

                return {
                    bookingId:newPlaygroundBooking.facilityBookingId
                };
            }
            catch (error) {
                if (transaction) await transaction.rollback();

                return {
                    error:`Playground booking failed!`
                }
                // console.error('Error creating user park booking:', error);
                // res.status(statusCode.BAD_REQUEST.code).json({
                //     message: 'Playground booking failed!',
                //     data: []
                // })
            }
        }

        async function bookingTransactionForMPgrounds(facilityId, bookingData,transaction,entityTypeId,bookingStatus,statusId,paymentStatus,orderId,userId) {
            try {
          

                const newParkBooking = await facilitybookings.create({
                    facilityId: facilityId,
                    orderId:orderId,
                    facilityTypeId: entityTypeId,
                    totalMembers: bookingData.totalMembers,
                    otherActivities: bookingData.otherActivities,
                    bookingDate: bookingData.bookingDate,
                    startDate: bookingData.startTime,
                    endDate: `${addHoursToTime(bookingData.startTime, Number(bookingData.durationInHours))}`,
                    amount: bookingData.amount,
                    statusId: bookingStatus,
                    paymentstatus: paymentStatus,
                    createdBy: userId
                }, { transaction, returning: true });
                
                if(!newParkBooking){
                    await transaction.rollback();
                    return {
                        error:`Something went wrong`
                    }
                }

                console.log(newParkBooking.facilityBookingId, 'new MP grounds booking data created');
                let findTheBookingDetails = await facilitybookings.findOne({
                    where: {
                        [Op.and]: [{ facilityBookingId: newParkBooking.facilityBookingId }, { statusId: bookingStatus }]
                    },
                    transaction
                })

                console.log('facilityBookingBookingReference find ', findTheBookingDetails)
                for (let i = 0; i < bookingData.activityPreference.length; i++) {
                    const newParkBookingActivityPreference = await userbookingactivities.create({
                        facilityBookingId: newParkBooking.dataValues.facilityBookingId,
                        userActivityId: bookingData.activityPreference[i],
                        statusId: statusId,
                        createdBy: userId
                    }, { transaction });
                }

                let findFacilityInformation = await facilities.findOne({
                    where: {
                        [Op.and]: [{ statusId: statusId }, { facilityId: facilityId }]
                    },
                    transaction
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

                let entityType = 'facilityBooking'
                // let ticketUploadAndGeneratePdf = await uploadTicket(title, bookingRef, location, date, time, cost, totalMembers, combinedData, facilityBookingId, userId, entityType)

                // if (ticketUploadAndGeneratePdf?.error) {
                //     return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                //         message: ticketUploadAndGeneratePdf.error
                //     })
                // }


                // await transaction.commit();

                // res.status(statusCode.SUCCESS.code).json({
                //     message: 'Park booking done successfully',
                //     data: newParkBooking, entityId, entityTypeId,
                //     shareableLink: ticketUploadAndGeneratePdf.shareableLink
                // })
                  return {
                    bookingId:newParkBooking.facilityBookingId
                };
            }
            catch (error) {
                if (transaction) await transaction.rollback();

                return {
                    error:`Multiplepurpose ground booking failed!`
                }
                // console.error('Error creating user park booking:', error);
                // res.status(statusCode.BAD_REQUEST.code).json({
                //     message: 'Park booking failed!',
                //     data: []
                // })
            }
        }

        async function bookingTransactionForEvents(eventId, bookingData,transaction,entityTypeId,bookingStatus,statusId,paymentStatus,orderId,userId) {
            /**
             * totalMembers: '',
             * bookingDate: '',
             * startTime: '',
             * duration: '',
             * amount: '',
             * eventId: 1
             */
            try {
                const eventBookingData = await eventBooking.create({
                    eventId: eventId,
                    orderId:orderId,
                    totalMembers: bookingData.totalMembers,
                    bookingDate: bookingData.bookingDate,
                    startDate: bookingData.startTime,
                    endDate: `${addHoursToTime(bookingData.startTime, Number(bookingData.durationInHours))}`,
                    amount: bookingData.amount,
                    statusId: bookingStatus,
                    paymentstatus: paymentStatus,
                    createdBy: userId,
                    createdOn: new Date()
                }, { transaction });

                if(!eventBookingData){
                    await transaction.rollback();
                    return {
                        error:`Something went wrong`
                    }
                }

                console.log('eventBooking', eventBookingData);
                let findEventInformation = await eventactivites.findOne({
                    where: {
                        [Op.and]: [{ statusId: statusId }, { eventId: eventId }]
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
                let date = bookingData.bookingDate;
                let time = eventBookingData.startDate;
                let cost = eventBookingData.amount;
                let totalMembers = eventBookingData.totalMembers;
                let combinedData = `${eventBookingData.eventBookingId},${entityTypeId},${entityId}`
                let eventBookingId = eventBookingData.eventBookingId;

                let entityType = 'eventBooking'

                // let ticketUploadAndGeneratePdf = await uploadTicket(title, bookingRef, location, date, time, cost, totalMembers, combinedData, eventBookingId, userId, entityType)

                // if (ticketUploadAndGeneratePdf?.error) {
                //     return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                //         message: ticketUploadAndGeneratePdf.error
                //     })
                // }


                // await transaction.commit();

                // res.status(statusCode.SUCCESS.code).json({
                //     message: 'Event booking done successfully',
                //     data: eventBooking, entityId, entityTypeId,
                //     shareableLink: ticketUploadAndGeneratePdf.shareableLink
                // })
                 return {
                    bookingId:eventBookingData.facilityBookingId
                };
            }
            catch (error) {
                if (transaction) await transaction.rollback();

                // console.error('Error creating user park booking:', error);
                // res.status(statusCode.BAD_REQUEST.code).json({
                //     message: 'Events booking failed!',
                //     data: []
                // })
                return {
                    error:`Events booking failed`
                }
            }
        }
   
//  add to cart and cart items table
// create cart
// view cart by user id 
// update cart by user id means  remove the cart items 


// create cart
function calculateEndTime(startTime, duration) {

    let momentStartTime = moment.duration(startTime);
    let momentDuration = moment.duration(duration);
    // adding the duration
    let momentEndTime = momentStartTime.add(momentDuration)
    // Format the total momentEndTime back into HH:mm:ss format

    momentEndTime = moment.utc(momentEndTime.asMilliseconds()).format('HH:mm:ss')
    console.log('moment end time', momentEndTime)
    return momentEndTime;
}




let insertAndUpdateTheCartItems = async (checkIsItemAlreadyExist, entityId, entityTypeId, facilityPreference, createdDt, updatedDt, statusId, userId, isUserExist) => {
    try {
        console.log(checkIsItemAlreadyExist, entityId, entityTypeId, facilityPreference, 'here is the data')
        // if exist then update
        if (checkIsItemAlreadyExist) {
            console.log('if exist')
            let updateTheCart = await cartItem.update({
                facilityPreference: facilityPreference,
                updatedDt: updatedDt,
                updatedBy: userId,
                statusId: statusId
            },
                {
                    where:
                    {
                        cartItemId: checkIsItemAlreadyExist.cartItemId
                    }
                }
            )
            console.log('2', updateTheCart)
            if (updateTheCart > 0) {

                return null;


            }
            else {
                return {
                    error: "Item is not added to the cart"
                }

            }

        }
        // else add the item
        else {
            console.log('add to cart')
            let createAddToCart = await cartItem.create({
                cartId: isUserExist.cartId,
                entityId: entityId,
                entityTypeId: entityTypeId,
                facilityPreference: facilityPreference,
                statusId: statusId,
                createdDt: createdDt,
                updatedDt: updatedDt,
                createdBy: userId,
                updatedBy: userId
            })


            if (createAddToCart) {
                return null


            }
            else {

                return { error: "Item is not added to the cart" }

            }
        }
    } catch (err) {
        return {
            error: err.message
        }
    }
}


let addToCart = async (req, res) => {
    try {
        console.log('here reponse of sports', req.body)
        let userId = req.user?.userId || 1;
        let createdDt = new Date();
        let updatedDt = new Date();
        let statusId = 1;
        // let facilityPreferenceData={};
        let { entityId, entityTypeId, facilityPreference } = req.body
        console.log('23')
        for(let key in facilityPreference){
            console.log(' facilityPreference[key]', facilityPreference[key])
            facilityPreference[key] = decrypt(facilityPreference[key])            
        }

        console.log('24')

        console.log('facility preference',facilityPreference)
        console.log(typeof (entityId), 'req.body', entityTypeId == 2)
        // totalMembers, activityPreference,otherActivities,bookingDate,startTime,endTime,duration,playersLimit,sports,price    

        let statusIdForCartItem = await statusmasters.findAll({
            where: {
                parentStatusCode: "CART_ITEM_STATUS"
            }
        });
        console.log("statusId list", statusId);
        statusIdForCartItem = statusIdForCartItem.filter((status) => {
            return status.dataValues.statusCode == 'IN_CART';
        })[0].dataValues.statusId;

        // first checks in the carts table consist of the user id 
        let isUserExist = await cart.findOne({
            where: {
                [Op.and]: [{ userId: userId }, { statusId: statusId }]
            }
        })
        // if not exist add to cart table
        if (!isUserExist) {
            isUserExist = await cart.create({
                userId: userId,
                createdDt: createdDt,
                updatedDt: updatedDt,
                statusId: statusId
            })
        }
        // then check entity wise where the user wants to add the data
        if (entityTypeId == 1) {
            console.log('parks')
            // if parks
            let momentEndTime = calculateEndTime(facilityPreference.startTime, facilityPreference.duration)

            console.log('values', facilityPreference.bookingDate, facilityPreference.startTime, momentEndTime)
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


            let findTheResult = await insertAndUpdateTheCartItems(checkIsItemAlreadyExist, entityId, entityTypeId, facilityPreference, createdDt, updatedDt, statusIdForCartItem, userId, isUserExist)
            console.log('findthe resultttttt', findTheResult)
            if (findTheResult?.error) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: findTheResult.error
                })

            }
            else {
                return res.status(statusCode.SUCCESS.code).json({ message: "Item is successfully added to cart" })
            }
        }
        else if (entityTypeId == 2) {
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

            let findTheResult = await insertAndUpdateTheCartItems(checkIsItemAlreadyExist, entityId, entityTypeId, facilityPreference, createdDt, updatedDt, statusIdForCartItem, userId, isUserExist)
            if (findTheResult?.error) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: findTheResult.error
                })

            }
            else {
                return res.status(statusCode.SUCCESS.code).json({ message: "Item is successfully added to cart" })
            }


        }
        else if (entityTypeId == 3) {
            // if Multipurpose ground

        }
        else if (entityTypeId == 4) {
            // if blueway location
        }
        else if (entityTypeId == 5) {
            //  if greenways
        }
        else if (entityTypeId == 6) {
            console.log('1')

            // if events
            // facilityPreference = { 
            //     totalMembers:totalMembers,
            //     startTime:startTime,
            //     duration:duration,
            //     price:price
            // }
            // totalMembers: formData.facilityPreference.playersLimit,
            //         bookingDate: formData.facilityPreference.bookingDate,
            //         startTime: formData.facilityPreference.startTime,
            //         durationInHours: formData.facilityPreference.durationInHours,
            //         amount: formData.facilityPreference.playersLimit * formData.facilityPreference.playersLimit,
            let momentEndTime = calculateEndTime(facilityPreference.startTime, facilityPreference.durationInHours)

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
                                sequelize.literal(`JSON_EXTRACT(facilityPreference, '$.endTime') <= :endTime`)
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

            console.log(checkIsItemAlreadyExist, 'check is item  already exist')

            let findTheResult = await insertAndUpdateTheCartItems(checkIsItemAlreadyExist, entityId, entityTypeId, facilityPreference, createdDt, updatedDt, statusIdForCartItem, userId, isUserExist)
            if (findTheResult?.error) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: findTheResult.error
                })

            }
            else {
                return res.status(statusCode.SUCCESS.code).json({ message: "Item is successfully added to cart" })
            }

        }

    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        })
    }
}
// cart created

// view cart by useID

let viewCartByUserId = async (req, res) => {
    try {
        const userId = req.user?.userId || 1
        console.log(userId,'userId')

        let findCartIdByUserId = await cart.findOne({
            where: {
                [Op.and]: [{ userId: userId }, { statusId: 1 }]
            }
        });
        console.log('findCartIdByUserId', findCartIdByUserId);
        if (findCartIdByUserId) {
            console.log(findCartIdByUserId.cartId, 'cartId')
            
            // cart details for facilities booking only
            let findCartItemsWRTCartId = await sequelize.query(`select c.cartItemId, c.cartId, c.entityId, c.entityTypeId, c.facilityPreference, ft.code as facilityTypeName, f.facilityName, f3.url as imageUrl
                from amabhoomi.cartitems c 
                left join amabhoomi.facilitytypes ft on ft.facilityTypeId = c.entityTypeId  
                inner join amabhoomi.facilities f on f.facilityId = c.entityId
                inner join amabhoomi.fileattachments f2 on f2.entityId = f.facilityId and f2.entityType = 'facilities' and f2.filePurpose = 'singleFacilityImage'
                inner join amabhoomi.files f3 on f3.fileId = f2.fileId
                where c.statusId = 21 and c.cartId = ? and c.entityTypeId !=6
                UNION
                select c.cartItemId, c.cartId, c.entityId, c.entityTypeId, c.facilityPreference, em.eventCategoryName as facilityTypeName, e.eventName as facilityName, f3.url as imageUrl
                from amabhoomi.cartitems c 
                inner join amabhoomi.eventactivities e on e.eventId = c.entityId 
                inner join amabhoomi.eventcategorymasters em on em.eventCategoryId = e.eventCategoryId 
                inner join amabhoomi.fileattachments f2 on f2.entityId = e.eventId and f2.entityType = 'events' and f2.filePurpose = 'Event Image'
                inner join amabhoomi.files f3 on f3.fileId = f2.fileId
                where c.statusId = 21 and c.cartId = ? and c.entityTypeId = 6
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: [findCartIdByUserId.cartId, findCartIdByUserId.cartId]
            });
            // save for later
            let findCartItemsWRTCartIdSaveForLater = await sequelize.query(`select c.cartItemId, c.cartId, c.entityId, c.entityTypeId, c.facilityPreference, ft.code as facilityTypeName, f.facilityName, f3.url as imageUrl
                from amabhoomi.cartitems c 
                left join amabhoomi.facilitytypes ft on ft.facilityTypeId = c.entityTypeId  
                inner join amabhoomi.facilities f on f.facilityId = c.entityId
                inner join amabhoomi.fileattachments f2 on f2.entityId = f.facilityId and f2.entityType = 'facilities' and f2.filePurpose = 'singleFacilityImage'
                inner join amabhoomi.files f3 on f3.fileId = f2.fileId
                where c.statusId = 22 and c.cartId = ?
                UNION
                 select c.cartItemId, c.cartId, c.entityId, c.entityTypeId, c.facilityPreference, em.eventCategoryName as facilityTypeName, e.eventName as facilityName, f3.url as imageUrl
                from amabhoomi.cartitems c 
                inner join amabhoomi.eventactivities e on e.eventId = c.entityId 
                inner join amabhoomi.eventcategorymasters em on em.eventCategoryId = e.eventCategoryId 
                inner join amabhoomi.fileattachments f2 on f2.entityId = e.eventId and f2.entityType = 'events' and f2.filePurpose = 'Event Image'
                inner join amabhoomi.files f3 on f3.fileId = f2.fileId
                where c.statusId = 22 and c.cartId = ? and c.entityTypeId = 6`,
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: [findCartIdByUserId.cartId,findCartIdByUserId.cartId]
            });
            // 

            // cart details for event booking only

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
            if(findCartItemsWRTCartId.length>0){
                findCartItemsWRTCartId = findCartItemsWRTCartId.map((cartItem) => {
                    for(let key in cartItem.facilityPreference){
                        cartItem.facilityPreference[key] = encrypt(cartItem.facilityPreference[key] )
                    } 
                    cartItem.imageUrl = encodeURI(cartItem.imageUrl);
                    return cartItem;
                })
            }
          if(findCartItemsWRTCartIdSaveForLater.length>0){
            findCartItemsWRTCartIdSaveForLater = findCartItemsWRTCartIdSaveForLater.map((cartItem) => {
                for(let key in cartItem.facilityPreference){
                    cartItem.facilityPreference[key] = encrypt(cartItem.facilityPreference[key] )
                } 
                cartItem.imageUrl = encodeURI(cartItem.imageUrl);
                return cartItem;
            })
          }
            
            console.log(findCartItemsWRTCartId, 'findCartIdByUserId')
            if (findCartIdByUserId.length <= 0 && findCartItemsWRTCartIdSaveForLater<=0) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Not a single item is associated with the cart"
                })
            }
            return res.status(statusCode.SUCCESS.code).json({
                message: "These are the cart items", data: findCartItemsWRTCartId, count: findCartItemsWRTCartId.length,
                saveForLater: findCartItemsWRTCartIdSaveForLater, saveForLaterCount: findCartItemsWRTCartIdSaveForLater.length
            })

        }
        else {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: "Not a single item is associated with the cart"
            })
        }




    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        })

    }
}


// update the cart items
let updateCart = async (req, res) => {
    try {
        console.log('req.body', req.body)
        let userId = req.user?.userId || 1
        let cartItemId = req.body.cartItemId
        let statusId;
        let action = req.body.action || 'IN_CART'; // IN_CART, SAVED_FOR_LATER, REMOVED

        //fetch cart status list
        let cartStatusList = await statusmasters.findAll({
            where: {
                [Op.and]: [{ statusCode: action }, { parentStatusCode: "CART_ITEM_STATUS" }]
            }
        });

        statusId = cartStatusList[0].dataValues.statusId;   // set statusId according to input action

        let findTheCartIdFromUserId = await cart.findOne({  // find cart details
            where: {
                userId: userId
            }
        })
        console.log(findTheCartIdFromUserId, 'fjd', cartItemId, 'fd', findTheCartIdFromUserId.cartId)

        let [updateCartItems] = await cartItem.update(  // update cart item status according to input action
            { statusId: statusId }, {
                where: {
                    [Op.and]: [{ cartItemId: cartItemId, cartId: findTheCartIdFromUserId.cartId }]
                }
        });

        console.log(updateCartItems, 'cart items')

        if (updateCartItems > 0) {
            return res.status(statusCode.SUCCESS.code).json({
                message: action == 'IN_CART' ? "Successfully added the item to cart" : action == 'SAVED_FOR_LATER' ? "Cart item moved to saved for later" : "Successfully removed the cart item"
            })
        }

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: "Something went wrong"
        })

    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message })
    }
}

// view cart w.r.t to cart Item id
let viewCartItemsWRTCartItemId = async (req, res) => {
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
            data: viewTheCartItemData
        })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        })
    }
}

let generatePDF = async ({ title, bookingRef, location, date, time, cost, totalMembers, qrData }) => {
    console.log('fhjsfjskljfklsjflksjlkfjsljfslkjfklkahjgsfs')
    console.log(title, bookingRef, location, date, time, cost, totalMembers, 'all parameters data')
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
    console.log('990', qrCodeDims)
    // Add QR code
    page.drawImage(qrCodeImageEmbed, {
        x: 50,
        y: height - 340,
        width: qrCodeDims.width,
        height: qrCodeDims.height,
    });

    // Serialize the PDF document to bytes (Uint8Array)
    console.log('pdf doc', pdfDoc)
    return await pdfDoc.save();
}

let generateQRCode = async (req, res) => {
    try {
        let {bookingId,entityTypeId} = req.body
        console.log({bookingId,entityTypeId});
        let filePurpose = 'ticketBooking'
        let fetchBookingDetails;
        let bookingStatusId = 4;
        let hostStatusId = 11;
        let fileStatusId = 1;
        let entityType;
        if (entityTypeId == 1 || entityTypeId == 2 || entityTypeId == 3) {
            entityType = "facilityBooking"
        }
        else if (entityTypeId == 4) {
            entityType = "bluewayBooking"
        }
        else if (entityTypeId == 5) {
            entityType = "greenwayBooking"
        }
        else if (entityTypeId == 6) {
            entityType = "eventBooking"
        }
        else if (entityTypeId == 7) {
            entityType = "eventHostBooking"
        }
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
        console.log(1)
        let QRCodeUrl = await QRCode.toDataURL(combinedData)
        console.log(2)
        // for parks, playgrounds, multipurpose grounds, blueways, greenways
        if(entityTypeId==1 || entityTypeId ==2 || entityTypeId==3 || entityTypeId ==4 || entityTypeId == 5){
            fetchBookingDetails = await facilitybookings.findOne({
            
                where:{
                   [Op.and]:[{ facilityBookingId:bookingId},{statusId:bookingStatusId}]
                },
                include:[
                    {
                        model:facilities
                    }
                ]
            })
        }
        // for event live bookings
        else if(entityTypeId ==6){
            fetchBookingDetails = await sequelize.query(`select f.*,e2.* from amabhoomi.facilities f inner join eventactivities e on e.facilityId = f.facilityId inner join eventbookings e2 on e2.eventId =e.eventId 
            where e2.eventBookingId= ? and e2.statusId = ? `,
        {
            type:QueryTypes.SELECT,
            replacements:[bookingId, bookingStatusId]
        })

        }
        // for event host request
        else if(entityTypeId ==7){
            fetchBookingDetails = await sequelize.query(`select f.*, h2.* from amabhoomi.facilities f inner join eventactivities e on e.facilityId = f.facilityId inner join hosteventdetails h on h.eventId = e.eventId 
             inner join hostbookings h2 on h2.hostId = h.hostId where h2.hostBookingId= ? and h2.statusId = ? `,
            {
                type:QueryTypes.SELECT,
                replacements:[bookingId, hostStatusId]
            })

        }
        console.log(3, {bookingId,filePurpose,entityType,fileStatusId});
        console.log("fetchBookingDetails", fetchBookingDetails);
        let fetchPdfImage = await sequelize.query(`
            select url, entityType from amabhoomi.files f 
            inner join amabhoomi.fileattachments fa on f.fileId = fa.fileId 
            where fa.entityId = ? and fa.filePurpose = ? and fa.entityType=? and f.statusId = ?`
            , { replacements: [bookingId, filePurpose, entityType, fileStatusId], type: QueryTypes.SELECT })
        console.log(4)
        fetchBookingDetails.dataValues.QRCodeUrl = QRCodeUrl
        console.log(5)
        console.log("fetchPdfImage", fetchPdfImage);
        fetchBookingDetails.dataValues.url = fetchPdfImage[0].url
        console.log(6)
        console.log('fetchPdfImage', fetchPdfImage)

        return res.status(statusCode.SUCCESS.code).json({
            message: "Here is the QR code",
            bookingDetails: fetchBookingDetails

        })
    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        })
    }
}


let verifyTheQRCode = async (req, res) => {
    try {
        let { QrCodeData } = req.body


    } catch (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: err.message
        })
    }
}

let cancelBooking = async (req, res) => {
    try {
        let { bookingId, entityId, entityTypeId } = req.body;
        let currentDate = new Date();

        // compare entityTypeId and execute cancelBooking function
        if (entityTypeId == 1 || entityTypeId == 2 || entityTypeId == 3) {  // if entityType is Park, Playground or MP grounds
            cancelFacilityBooking();
        }
        else if (entityTypeId == 6) {    // if entityType is Event
            cancelEventBooking();
        }
        else if (entityTypeId == 7) {    // if entityType is Event Host
            cancelEventHostBooking();
        }

        async function cancelFacilityBooking() {
            let transaction = await sequelize.transaction();
            try {
                // fetch booking details
                let fetchFacilityBookingDetails = await facilitybookings.findOne({
                    where: {
                        facilityBookingId: bookingId
                    },
                }, { transaction });

                let { bool, amount } = checkForCancellation(currentDate, fetchFacilityBookingDetails.bookingDate);
                if (bool) {  // if cancellation allowed, proceed with refund process with some refund amount
                    let [updateBookingDetailsCount] = await facilitybookings.update({

                    }, {
                        where: {
                            facilityBookingId: bookingId
                        }
                    }, { transaction, returning: true });
                }
                else {
                    return res.status(statusCode.SUCCESS.code).json({
                        message: "Your ticket has been cancelled as per your request. According to the cancellation policy, no refund amount shall be disbursed."
                    })
                }
            }
            catch (error) {
                res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                    message: error.message
                })
            }
        }
        async function cancelEventBooking() { }
        async function cancelEventHostBooking() { }
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
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
    verifyTheQRCode,
    cancelBooking,
    uploadTicket
    
}