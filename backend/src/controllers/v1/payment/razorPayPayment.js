const { sequelize, Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const { encrypt } = require('../../../middlewares/encryption.middlewares')
const QueryTypes = db.QueryTypes
const Payment = db.payment
let refundTable = db.refund
let cartItemTable = db.cartItem
let eventBookingTable = db.eventBookings;
let facilityBookingTable = db.facilitybookings
let facilities = db.facilities
let {Op} = require('sequelize')
let instance = require('../../../config/razorpay.config.js');
let crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
let {parkBooking,uploadTicket} = require('../booking/bookings.controllers.js')


let paymentItems = db.paymentItems
const getRazorpayApiKeys = async (req, res) => {
  try {
    console.log("getRazorpaykeys api called");
    let apiKey = process.env.RAZORPAY_API_KEY;
    let apiSecret = process.env.RAZORPAY_APT_SECRET;
    // console.log("apiKey before encrypt", apiKey, apiSecret);
    apiKey = encrypt(apiKey);
    apiSecret = encrypt(apiSecret);
    // console.log("apiKey after encrypt", apiKey);
    res.status(statusCode.SUCCESS.code).json({
      key: apiKey,
      // secret: apiSecret
    })
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error
    })
  }
}



const paymentVerification = async (req, res) => {
  try {
    let { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
      let pendingOrderItemStatus = 26;
       razorpay_order_id = await decrypt(razorpay_order_id);
       razorpay_payment_id = await decrypt(razorpay_payment_id);
       razorpay_signature = await decrypt(razorpay_signature)

      let updatedDt = new Date();
      let statusId = 27;
      let activeStatus = 1;
      let bookingStatus = 3;
      let updateTheEventBooking;
      let updateTheFaciliyBooking;
      let ticketUploadAndGeneratePdf;
      let ticketUploadArray=[];
    console.log(req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      let paymentDetails = await instance.payments.fetch(razorpay_payment_id);
     
      console.log('payment details',paymentDetails)
      if(paymentDetails){
        let amountPaid = paymentDetails.amount/100; // converting from paise to rupees
        console.log(paymentDetails.order_id, amountPaid, paymentDetails.notes.customer_id, paymentDetails.notes.internal_order_id,
          'payment data'
        )
        let checkIfThePaymentAmountIsSameAsOrderAmount = await sequelize.query(`select * from amabhoomi.paymentmethods where
          razorpay_order_id = ? and amount =? and createdBy = ? and orderId = ?`,{
            type:QueryTypes.SELECT,
            replacements:[paymentDetails.order_id, amountPaid, paymentDetails.notes.customer_id, paymentDetails.notes.internal_order_id ]
          })
          // console.log('after checkIfThePaymentAmount',checkIfThePaymentAmountIsSameAsOrderAmount)

          if(checkIfThePaymentAmountIsSameAsOrderAmount.length==0){
            return res.status(statusCode.BAD_REQUEST.code).json({
              message: 'Invalid payment request',
              success: false
            })
          }
          // console.log(checkIfThePaymentAmountIsSameAsOrderAmount,'payment details')
          
        if(paymentDetails.captured){
          statusId = 25
          bookingStatus = 4
        }
        else{
          statusId = 27
          bookingStatus = 5;
        }
        // console.log('nearer to update payment', paymentDetails.order_id)
        let [updatePayment] = await Payment.update({
          razorpay_payment_id:paymentDetails.id,
          razorpay_signature: razorpay_signature,
          updatedDt:updatedDt,
          updatedBy:paymentDetails.notes.customer_id,
          statusId:statusId
        },
      {
        where:{
          razorpay_order_id: paymentDetails.order_id
        }
      });
      // console.log('update payment table', paymentDetails.order_id, 'data', checkIfThePaymentAmountIsSameAsOrderAmount[0].orderId)
       // update the payment items table and booking table
       let checkTheOrderItemsTable = await paymentItems.findAll({
        where:{
          [Op.and]:[{statusId:pendingOrderItemStatus},{orderId:checkIfThePaymentAmountIsSameAsOrderAmount[0].orderId}]
        }
       })
       console.log('after the order items table')
       if(checkTheOrderItemsTable.length ==0){
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:`Something went wrong`})
       }
       let [updateThePaymentItemsTable] = await paymentItems.update({
        statusId:statusId,
        updatedDt:updatedDt
      },{
        where:{
          orderId:checkIfThePaymentAmountIsSameAsOrderAmount[0].orderId
        }
      })
      console.log('afterupdateThePaymentItemsTables ')

      if(updateThePaymentItemsTable == 0){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:`Something went wrong`
        })
      }
    
    for(let eachOrderItem of checkTheOrderItemsTable){
      console.log(eachOrderItem,'eachOrderItem')
      if(eachOrderItem.entityTypeId == 6){
        // update the event booking
        [updateTheEventBooking] = await eventBookingTable.update({statusId:bookingStatus,
          paymentstatus:statusId
        },{
          where:{orderId:checkIfThePaymentAmountIsSameAsOrderAmount[0].orderId}
        })
        if(updateTheEventBooking==0){
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:`Something went wrong`})
        }

        let findTheBookingDetails = await sequelize.query(`select * from amabhoomi.eventbookings where eventBookingId =? and orderId=? and statusId = ?`,
          {
            replacements:[eachOrderItem.bookingId,checkIfThePaymentAmountIsSameAsOrderAmount[0].orderId, bookingStatus],
            type:QueryTypes.SELECT
          }
        )
      if(findTheBookingDetails.length == 0){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:`Something went wrong `
        })
      }
      
        let findEventInformation = await eventactivites.findOne({
          where: {
              [Op.and]: [{ statusId: activeStatus }, { eventId: findTheBookingDetails[0].eventId }]
          }
      })
        let title = findEventInformation.eventName;
                let bookingRef = findTheBookingDetails[0].bookingReference;
                let location = findEventInformation.locationName;
                let date = findTheBookingDetails[0].bookingDate;
                let time = findTheBookingDetails[0].startDate;
                let cost = findTheBookingDetails[0].amount;
                let totalMembers = findTheBookingDetails[0].totalMembers;
                let combinedData = `${findTheBookingDetails[0].eventBookingId},${findEventInformation.eventCategoryId},${findTheBookingDetails[0].eventId}`
                let eventBookingId = findTheBookingDetails[0].eventBookingId;

                let entityType = 'eventBooking'

                 ticketUploadAndGeneratePdf = await uploadTicket(title, bookingRef, location, date, time, cost, totalMembers, combinedData, eventBookingId, paymentDetails.notes.customer_id, entityType)

                if (ticketUploadAndGeneratePdf?.error) {
                    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                        message: ticketUploadAndGeneratePdf.error
                    })
                }
                ticketUploadArray.push({
                  shareableLink:ticketUploadAndGeneratePdf.shareableLink,
                  entityId:findTheBookingDetails[0].eventId,
                  entityTypeId:findEventInformation[0].eventCategoryId,
                  bookingId:findTheBookingDetails[0].eventBookingId,
                  bookingRef:findTheBookingDetails[0].bookingReference
  
                })
      

      }
      else {
        // update the facility booking
        [updateTheFaciliyBooking] = await facilityBookingTable.update({statusId:bookingStatus,paymentstatus:statusId},{
          where:{orderId:checkIfThePaymentAmountIsSameAsOrderAmount[0].orderId}
        })

        if(updateTheFaciliyBooking==0){
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:`Something went wrong`})
        }
        console.log('facility boking paramerters',checkIfThePaymentAmountIsSameAsOrderAmount[0].orderId , bookingStatus )
        let findTheBookingDetails = await sequelize.query(`select * from amabhoomi.facilitybookings where facilityBookingId = ? and orderId=? and statusId = ?`,
          {
            replacements:[eachOrderItem.bookingId,checkIfThePaymentAmountIsSameAsOrderAmount[0].orderId, bookingStatus],
            type:QueryTypes.SELECT
          }
        )
      if(findTheBookingDetails.length == 0){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:`Something went wrong `
        })
      }
     
     
        let findFacilityInformation = await facilities.findOne({
          where: {
              [Op.and]: [{ statusId: activeStatus }, { facilityId:findTheBookingDetails[0].facilityId }, {facilityTypeId:findTheBookingDetails[0].facilityTypeId}]
          }
        })

        // console.log(findFacilityInformation,'findFacilityInformation')
        if(!findFacilityInformation){
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:`Something went wrong `
          })
        }
            let title = findFacilityInformation.facilityname;
                let bookingRef = findTheBookingDetails[0].bookingReference;
                let location = findFacilityInformation.address;
                let date = findTheBookingDetails[0].bookingDate;
                let time = findTheBookingDetails[0].startDate;
                let cost = findTheBookingDetails[0].amount;
                let totalMembers = findTheBookingDetails[0].totalMembers;
                let combinedData = `${findTheBookingDetails[0].facilityBookingId},${findTheBookingDetails[0].facilityTypeId},${findTheBookingDetails[0].facilityId}`
                let facilityBookingId = findTheBookingDetails[0].facilityBookingId

                let entityType = 'facilityBooking'
                 ticketUploadAndGeneratePdf = await uploadTicket(title, bookingRef, location, date, time, cost, totalMembers, combinedData, facilityBookingId, paymentDetails.notes.customer_id, entityType)

                if (ticketUploadAndGeneratePdf?.error) {
                    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                        message: ticketUploadAndGeneratePdf.error
                    })
                }
              ticketUploadArray.push({
                shareableLink:ticketUploadAndGeneratePdf.shareableLink,
                entityId:findTheBookingDetails[0].facilityId,
                entityTypeId:findTheBookingDetails[0].facilityTypeId,
                bookingId:findTheBookingDetails[0].facilityBookingId,
                bookingRef:findTheBookingDetails[0].bookingReference

              })

      }
    }
        console.log(ticketUploadAndGeneratePdf.shareableLink,'payment ticketUploadAndGeneratePdf')
        if (updatePayment>=1) {
          console.log('near to return success statement', ticketUploadArray)
          return res.status(statusCode.SUCCESS.code).json({
            message: 'Payment done successfully',
            success: true,
            shareableLink: ticketUploadArray
          });
        } else {
          return res.status(statusCode.BAD_REQUEST.code).json({
            message: 'Payment Failed',
            success: false,
            shareableLink: ticketUploadArray
          });
        }
      } else {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: 'Something went wrong',
          success: false
        });
      }
      }
      else{
        return res.status(statusCode.BAD_REQUEST.code).json({
          message: 'Invalid payment request',
          success: false
        });
      }
      
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
  }
};

const fetchOrder = async (req, res) => {

  try {
    console.log('orderID')
    const { orderId } = req.params;
    console.log('orderId',orderId)
    const order = await instance.orders.fetch(orderId);

    console.log(orderId,'why this api')
    res.status(statusCode.SUCCESS.code).json({
      message: "Order details",
      order
    })
  }
  catch(error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message
    })
  }
}

const fetchPayment = async (req, res) => {
 
  try {
    const { paymentId } = req.params;
    console.log('paymentId',paymentId)
    let razorpay_payment_id = paymentId
    const payment = await instance.payments.fetch(razorpay_payment_id);
    res.status(statusCode.SUCCESS.code).json({
      message: "Payment details",
      payment
    })
  }
  catch(error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message
    })
  }
}




const checkout =  async (req, res) => {
  let transaction
  try {

    transaction = await sequelize.transaction();
    let createdDt = new Date();
    let updatedDt = new Date();
    let totalAmount;
    let pendingStatus = 26; //payement pending 
    let inCartStatus = 21;
    let customerId = req.user.userId
    let orderEncrypt;
    
    let {entityId,entityTypeId,facilityPreference,userCartId } = req.body.data;
    console.log(req.body, 'req.body')

    let insertToPaymentFirst;
    let insertToBookingTable;
    let insertToPaymentItemsTable;
  
    if(entityId && entityTypeId && Object.keys(facilityPreference).length > 0){
      entityTypeId = await decrypt(entityTypeId);
      entityId = await decrypt(entityId);
     
      for(let key in facilityPreference){
        console.log(' facilityPreference[key]', facilityPreference[key])
        
        facilityPreference[key] = decrypt(facilityPreference[key]);
        if(key ==='activityPreference' && facilityPreference[key]!=null){
          facilityPreference[key] = facilityPreference[key].split(',')
        }

      }
      totalAmount = facilityPreference.amount;
      console.log('facility prefernce1',facilityPreference)


      insertToPaymentFirst = await Payment.create({
     // Payment id will be updated on webhook
        statusId: pendingStatus,
        amount:facilityPreference.amount,
        orderDate: createdDt,
        createdDt:createdDt,
        updatedDt:updatedDt,
        createdBy:customerId,
        updatedBy:customerId
           
      },{
        transaction
      });

      if(!insertToPaymentFirst){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:`Something went wrong`
        })
      }
      console.log('after payment first creation')
      // insert to the booking table  with the order id 
      insertToBookingTable = await parkBooking(entityId,entityTypeId,facilityPreference,insertToPaymentFirst.orderId,customerId,transaction)
      if(insertToBookingTable?.error){
        await transaction.rollback();
        if(insertToBookingTable?.error.includes('Something went wrong')){
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code.code).json({
            message:error.message
          })
        }
        else{
          return res.status(statusCode.BAD_REQUEST.code).json({
            message:error.message
          })
        }
        
      }

      console.log('after booking creation', insertToBookingTable)

      // insert to order items table
       insertToPaymentItemsTable = await paymentItems.create({
        orderId:insertToPaymentFirst.orderId,
        bookingId:insertToBookingTable.bookingId,
        entityId:entityId,
        entityTypeId:entityTypeId,
        amount:facilityPreference.amount,
        statusId:pendingStatus,
        createdBy:customerId,
        updatedBy:customerId,
        updatedDt:updatedDt,
        createdDt:createdDt,

      },
    {transaction})

    if(!insertToPaymentItemsTable){
      await transaction.rollback();
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message:`Something went wrong`
      })
    }
      console.log('inside the payment table without cart')
    
    }
    
    else if(userCartId){
  
      userCartId = await decrypt(userCartId);
      let findTheCartDetails = await cartItemTable.findAll({
        where:{
          [Op.and]:[{statusId:inCartStatus},{cartId:userCartId}]
        },
        transaction
      })

      if(findTheCartDetails.length==0){
        await transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message:`something went wrong`
        })
      }
      for (let i of findTheCartDetails){
        totalAmount += i.amount;
      }
      insertToPaymentFirst = await Payment.create({
        // Payment id will be updated on webhook
           statusId: pendingStatus,
           amount:facilityPreference.amount,
           orderDate: createdDt,
           createdDt:createdDt,
           updatedDt:updatedDt,
           createdBy:customerId,
           updatedBy:customerId
              
         },{
           transaction
         });
   
         if(!insertToPaymentFirst){
           await transaction.rollback();
           return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
             message:`Something went wrong`
           })
         }

      for(let eachCart of findTheCartDetails){
        
           // insert to the booking table  with the order id 
           insertToBookingTable = await parkBooking(eachCart.entityId,eachCart.entityTypeId,eachCart.facilityPreference,userCartId,insertToPaymentFirst.orderId,transaction)
           if(insertToBookingTable?.error){
             await transaction.rollback();
             if(insertToBookingTable?.error.includes('Something went wrong')){
               return res.status(statusCode.INTERNAL_SERVER_ERROR.code.code).json({
                 message:error.message
               })
             }
             else{
               return res.status(statusCode.BAD_REQUEST.code).json({
                 message:error.message
               })
             }
             
           }
     
           // insert to order items table
            insertToPaymentItemsTable = await paymentItems.create({
             orderId:insertToPaymentFirst.orderId,
             bookingId:insertToBookingTable.bookingId,
             entityId:entityId,
             entityTypeId:entityTypeId,
             amount:facilityPreference.amount,
             statusId:pendingStatus,
             createdBy:customerId,
             updatedBy:customerId,
             updatedDt:updatedDt,
             createdDt:createdDt,
     
           },
         {transaction})
     
         if(!insertToPaymentItemsTable){
           await transaction.rollback();
           return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
             message:`Something went wrong`
           })
         }

// 
      }

    
    }
    else{
      await transaction.rollback();
      return res.status(statusCode.BAD_REQUEST.code).json({
        message:`Invalid Request`
      })
    }
  

    // Create new order with idempotency key
    const options = {
      amount: totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${customerId}`,
      payment_capture: 1,
      notes:{
        customer_id:customerId,
        internal_order_id:insertToPaymentFirst.orderId
      }
    };

    console.log('options')
    const order = await instance.orders.create(options);
    console.log('order',order)
    // Save transaction details 
    const oneHour = 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + oneHour);


        // Check for existing transaction with the same order ID
        const existingTransaction = await Payment.findOne({
          where: { razorpay_order_id: order.id },
          transaction
        });
    
        if (existingTransaction) {
          if (new Date() > existingTransaction.expiresAt) {
            await transaction.rollback();
            return res.status(statusCode.BAD_REQUEST.code).json({ message: 'Transaction has expired. Please create a new order.' });
          }
          // If transaction already exists and is not expired, return the existing order details
          return res.status(200).json({
            message: 'Transaction already processed',
            orderId: existingTransaction.razorpay_order_id,
            status: existingTransaction.statusId
          });
        }
    
  
      console.log('update the order table')
    // update the order/payment table with the razorpay order id ;
    let [updateTheOrderTable] = await Payment.update(
      {razorpay_order_id:order.id,
      orderDate:createdDt,
      expiresAt:expiresAt,
      updatedDt:updatedDt
    },
      {
        where:
        {
          [Op.and]:
          [{orderId:order.notes.internal_order_id},{createdBy:order.notes.customer_id},{statusId:pendingStatus}]
      },
        transaction
      }
    )

      console.log('update the order table outside',updateTheOrderTable)

    if(updateTheOrderTable==0){
      await transaction.rollback();
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message:`Something went wrong`
      })
    }
    
   
    console.log('Transaction initiated and saved:');
    orderEncrypt = {
      amount: encrypt(order.amount),
      amount_due: encrypt(order.amount_due),
      amount_paid: encrypt(order.amount_due),
      attempts: encrypt(order.attempts),
      created_at:encrypt(order.created_at) ,
      currency: encrypt(order.currency),
      entity: encrypt(order.entity),
      id: encrypt(order.id),
      notes: {
          customer_id: encrypt(order.notes.customer_id),
          internal_order_id:encrypt(order.notes.internal_order_id)
      },
      offer_id: encrypt(order.offer_id),
      receipt: encrypt(order.receipt),
      status: encrypt(order.status)
    }
    console.log(orderEncrypt,'orderEncrypt')
    await transaction.commit();
   
    return res.status(statusCode.SUCCESS.code).json({
      message:`Order is created`,
      order:orderEncrypt,
      success:encrypt("true")
    })
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.error('Error creating order with Razorpay:', error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:error.message
    })
  }
}

// Verify the webhook signature
const verifyWebhook = (req, res, next) => {
  console.log('one')
  let razorpaySecret = process.env.RAZORPAY_SECRET_WEBHOOK
  console.log(razorpaySecret, 'razorpay secret')
  const signature = req.headers['x-razorpay-signature'];
  console.log('razorpaysig',razorpaySecret)

  const shasum = crypto.createHmac('sha256', razorpaySecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');
  console.log(digest,'digest','signature',signature)

  if (digest === signature) {
    next();
  } else {
    res.status(statusCode.BAD_REQUEST.code).json({message:'Invalid signature'});
  }
}

let webhook =  async (req, res) => {
  try {
    console.log('2332',req.body.payload)
    let successStatus = 25;
    let pendingStatus = 26;
    let failureStatus = 27
    let refundStatus = 28;
    let updatedDt = new Date();
    let amountPaid;
    let checkIfThePaymentAmountIsSameAsOrderAmount;
    const event = req.body.event;
    const payload = req.body.payload;
    console.log(req.body,'eventdetail')
    console.log(req.body.payload.payment.entity.card, 'carddetails')
    console.log(req.body,'inside eventdetail payload')

    switch (event) {
      
      case 'payment.captured':
        // Payment successfully captured
        let capturedPaymentId = payload.payment.entity.id;
         amountPaid = payload.payment.entity.amount
         checkIfThePaymentAmountIsSameAsOrderAmount = await sequelize.query(`select * from amabhoomi.paymentmethods where
          razorpay_order_id = ? and amount =?`,{
            type:QueryTypes.SELECT,
            replacements:[payload.payment.entity.order_id, amountPaid]
          })

          if(!checkIfThePaymentAmountIsSameAsOrderAmount){
            return res.status(statusCode.BAD_REQUEST.code).json({
              message: 'Invalid payment request',
              success: false
            })
          }
        // Update payment status
        let methodName =  payload.payment.entity.card.type +' ' + payload.payment.entity.card.entity
        let [updatePayment] = await Payment.update({ statusId: successStatus,
          razorpay_payment_id:capturedPaymentId,
          methodName:methodName,
          description:payload.payment.entity.description,
          updatedBy:payload.payment.entity.notes.customer_id,
          updatedDt:updatedDt
         }, 
         { where:
           { razorpay_order_id:payload.payment.entity.order_id  
           }
           }
          );
         if(updatePayment>=1){
          return res.status(statusCode.SUCCESS.code).json({
            message:`Payment done`,
            success: true

          })
        
         }
         else{
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:`Something went wrong`
          })
         }
        
        break;

      case 'payment.failed':
        // Payment failed
        let failedPaymentId = payload.payment.entity.id;
         amountPaid = payload.payment.entity.amount
         checkIfThePaymentAmountIsSameAsOrderAmount = await sequelize.query(`select * from amabhoomi.paymentmethods where
          razorpay_order_id = ? and amount =?`,{
            type:QueryTypes.SELECT,
            replacements:[payload.payment.entity.order_id, amountPaid]
          })

          if(!checkIfThePaymentAmountIsSameAsOrderAmount){
            return res.status(statusCode.BAD_REQUEST.code).json({
              message: 'Invalid payment request',
              success: false
            })
          }
        // Update payment status
        let methodNameFailure =   payload.payment.entity.card.type +' ' + payload.payment.entity.card.entity ;
        let [updatePaymentFailure,updatePaymentFailureData] = await Payment.update({ statusId: failureStatus,
          razorpay_payment_id:failedPaymentId,
          methodName:methodNameFailure,
          description:payload.payment.entity.description,
          updatedBy:payload.payment.entity.notes.customer_id,
          updatedDt:updatedDt

         }, { where: { razorpay_order_id:payload.payment.entity.order_id  } });
         if(updatePaymentFailure>=1){
          console.log(updatePaymentFailure,'update payment failure data',failureStatus)
          return res.status(statusCode.BAD_REQUEST.code).json({
            message:`Payement Failure`
          })
        
         }
         else{
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:`Something went wrong`
          })
         }
        break;

 


      case 'payment.refunded':
        // Payment refunded
        let refundPaymentId = payload.payment.entity.id;
        
        amountPaid = payload.payment.entity.amount
        checkIfThePaymentAmountIsSameAsOrderAmount = await sequelize.query(`select * from amabhoomi.paymentmethods where
         razorpay_order_id = ? and amount =?`,{
           type:QueryTypes.SELECT,
           replacements:[payload.payment.entity.order_id, amountPaid]
         })

         if(!checkIfThePaymentAmountIsSameAsOrderAmount){
           return res.status(statusCode.BAD_REQUEST.code).json({
             message: 'Invalid payment request',
             success: false
           })
         }

        // Update payment status
        let methodNameRefund =   payload.payment.entity.card.type +' ' + payload.payment.entity.card.entity ;
        let [updatePaymentRefund] = await Payment.update({ statusId: refundStatus,
          razorpay_payment_id:refundPaymentId,
          methodName:methodNameRefund,
          description:payload.payment.entity.description,
          updatedBy:payload.payment.entity.notes.customer_id,
          updatedDt:updatedDt

         }, { where: { razorpay_order_id:payload.payment.entity.order_id  } });
         if(updatePaymentFailure>=1){
          return res.status(statusCode.SUCCESS.code).json({
            message:`Refund done sucessfully`
          })
        
         }
         else{
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:`Something went wrong`
          })
         };

      default:
        console.log(`Unhandled event type: ${event}`);
    }

  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({message:`Something went wrong`});
  }


  }

let getDetailsWrtRazorpayOrderId = async (req,res)=>{
  try {
    let fetchOrderDetails = await sequelize.query(
     ` SELECT * 
      FROM amabhoomi.paymentmethods 
      ORDER BY orderId DESC 
      LIMIT 10;
   `,
     {
      type:QueryTypes.SELECT
     }
    )
    if(fetchOrderDetails.length==0){
      return res.status(statusCode.BAD_REQUEST.code).json({
        message:"No data present"
      })
    }
   let newData = fetchOrderDetails.map((eachData)=>{

      // if(eachData.statusId == 25){
      //   eachData.status = "Success"
      // }
      // else if(eachData.statusId == 26){
      //   eachData.status = "Pending"

      // }
      // else if (eachData.statusId == 27){
      //   eachData.status = "Failure"

      // }
      // else if (eachData.statusId == 28){
      //   eachData.status = "Refund"

      // }
      // return eachData

      return {
        ...eachData, // Include all existing properties
        status: eachData.statusId === 25 ? 'Success' :
                eachData.statusId === 26 ? 'Pending' :
                eachData.statusId === 27 ? 'Failure' :
                eachData.statusId === 28 ? 'Refund' :
                'Unknown'  // Default case if none of the statusId matches
      };
    
    })
    console.log('new data', newData)
    return res.status(statusCode.SUCCESS.code).json({
      message:'Order details',
      orderData:newData
    })
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
    
  }
}




// let refundData = async (req,res)=>{
//   try {
//     console.log('refund data')
//     let {paymentId, refundReason, amount}= req.body
//     let userId = req.user.userId;
//     let successStatusId = 25;
//     let refundStatusId = 28;
//     console.log('req body', req.body)
//     let notes = {
//       customer_id: userId,
//       reason:refundReason
//     }
    

//     let refundOptions = {
//       payment_id : paymentId,
//       amount:amount * 100
//     }
//     let findTheOrderDetails = await Payment.findOne({
//       where:{[Op.and]:[{
//         razorpay_payment_id:paymentId},
//         {
//          statusId:successStatusId
//         }
//       ]
//     }
//     })
//     if(!findTheOrderDetails){
//       return res.status(statusCode.BAD_REQUEST.code).json({
//         message:`Refund is not allowed `
//       })
//     }

//     // check in the refund table if the payment Id already exist or not 
//     let findTheRefundDetails = await refundTable.findOne({
//       where:{
//         [Op.and]:
//         [{statusId:refundStatusId},{razorpay_payment_id:paymentId}]
//       }
//     })
//     if(findTheRefundDetails){
//       return res.status(statusCode.BAD_REQUEST.code).json({
//         message:`This is already refunded`
//       })
//     }

//     console.log('before razorpayment response data 1')
//     const razorpayResponse = await instance.payments.refund(refundOptions);
    
//     console.log('after razorpay response')

//     return res.status(statusCode.SUCCESS.code).json({
//       message:`Payment refunded successfully`
//     })

  
//   } catch (err) {
//     return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
//       message:err.message
//     })
//   }
// }

let refundData = async (req, res) => {
  try {
    console.log('Refund request received');

    // Extracting variables from request body
    let { paymentId, refundReason, amount } = req.body;
    let userId = req.user.userId;
    let successStatusId = 25;
    let refundStatusId = 28;

    console.log('Request body:', req.body);

    // Notes to be added to the refund request
    let notes = {
      customer_id: userId,
      reason: refundReason
    };

    // Refund options for Razorpay
    let refundOptions = {
      payment_id: paymentId,
      amount: amount * 100, // Amount in smallest currency unit (e.g., paise)
      notes: notes
    };

    console.log('Refund options:', refundOptions);

    // Finding the order details in the database
    let findTheOrderDetails = await Payment.findOne({
      where: {
        [Op.and]: [
          { razorpay_payment_id: paymentId },
          { statusId: successStatusId }
        ]
      }
    });

    if (!findTheOrderDetails) {
      console.log('Refund not allowed: payment not found or not successful');
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: 'Refund is not allowed'
      });
    }

    // Checking if the payment ID already exists in the refund table
    let findTheRefundDetails = await refundTable.findOne({
      where: {
        [Op.and]: [
          { statusId: refundStatusId },
          { razorpay_payment_id: paymentId }
        ]
      }
    });

    if (findTheRefundDetails) {
      console.log('Refund already processed for payment ID:', paymentId);
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: 'This payment has already been refunded'
      });
    }

    console.log('Processing refund with Razorpay for payment ID:', paymentId);

    // Processing the refund with Razorpay
    try {
      const razorpayResponse = await instance.payments.refund(refundOptions);
      console.log('Razorpay refund response:', razorpayResponse);

      // Assuming you need to insert the refund details into the refund table
      await refundTable.create({
        razorpay_payment_id: paymentId,
        amount: amount,
        reason: refundReason,
        statusId: refundStatusId,
        createdBy: userId,
        createdDt: new Date()
      });

      return res.status(statusCode.SUCCESS.code).json({
        message: 'Payment refunded successfully',
        refundResponse: razorpayResponse
      });
    } catch (razorpayError) {
      console.error('Error processing refund with Razorpay:', razorpayError);
      if (razorpayError.statusCode === 404) {
        console.error('Razorpay Payment ID not found:', paymentId);
      }
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message: 'Error processing refund with Razorpay',
        error: razorpayError
      });
    }

  } catch (err) {
    console.error('Error processing refund:', err);
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message
    });
  }
};















module.exports = {
  getRazorpayApiKeys,
  checkout,
  paymentVerification,
  fetchOrder,
  fetchPayment,
  verifyWebhook,
  webhook,
  getDetailsWrtRazorpayOrderId,
  refundData
}

