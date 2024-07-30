const { sequelize, Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const { encrypt } = require('../../../middlewares/encryption.middlewares')
const QueryTypes = db.QueryTypes
const Payment = db.payment
let refundTable = db.refund
let {Op} = require('sequelize')
let instance = require('../../../config/razorpay.config.js');
let crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

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
      secret: apiSecret
    })
  }
  catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error
    })
  }
}

// const checkout = async (req, res) => {
//   try {
//     const options = {
//       amount: Number(req.body.amount * 100),
//       currency: "INR",
//       payment_capture: '1', // Automatically capture the payment
//     };
//     const order = await instance.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
      let updatedDt = new Date();
      let statusId = 27
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
        if(paymentDetails.captured){
          statusId = 25
        }
        else{
          statusId = 27
        }
        let [updatePayment] = await Payment.update({
          razorpay_payment_id:paymentDetails.id,
          razorpay_signature: razorpay_signature,
          updatedDt:updatedDt,
          updatedBy:paymentDetails.notes.customer_id,
          statusId:statusId
        },
      {
        where:{
          razorpay_order_id: razorpay_order_id
        }
      });
        if (updatePayment>=1) {
          return res.status(statusCode.SUCCESS.code).json({
            message: 'Payment done successfully',
            success: true
          });
        } else {
          return res.status(statusCode.BAD_REQUEST.code).json({
            message: 'Payment Failed',
            success: false
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
    res.status(500).json({ message: err.message });
  }
};

const fetchOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await instance.orders.fetch(orderId);
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
  const { paymentId } = req.params;
  try {
    const payment = await instance.payments.fetch(paymentId);
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

// const webhook = async (req, res) => {
//   const webhookSecret = 'YOUR_WEBHOOK_SECRET'; // Your webhook secret

//   const crypto = require('crypto');
//   const hmac = crypto.createHmac('sha256', webhookSecret);
//   hmac.update(JSON.stringify(req.body));
//   const digest = hmac.digest('hex');

//   if (digest !== req.headers['x-razorpay-signature']) {
//     return res.status(400).send('Webhook Error: Invalid signature');
//   }

//   // Webhook event payload
//   const { event, payload } = req.body;

//   try {
//     // Handle specific webhook events
//     switch (event) {
//       case 'payment.captured':
//         // Payment successfully captured
//         console.log('Payment Captured:', payload);
//         // Implement your logic here (e.g., update database, send email)
//         break;
//       case 'payment.failed':
//         // Payment failed
//         console.log('Payment Failed:', payload);
//         // Implement your logic here (e.g., notify user, handle retries)
//         break;
//       case 'refund.processed':
//         // Refund processed
//         console.log('Refund Processed:', payload);
//         // Implement your logic here (e.g., update transaction status)
//         break;
//       // Handle other events as needed
//       default:
//         console.log(`Unhandled event: ${event}`);
//     }

//     res.status(200).json({ received: true });
//   } catch (error) {
//     console.error('Webhook Error:', error.message);
//     res.status(500).json({ error: 'Webhook Error' });
//   }
// }


const checkout =  async (req, res) => {
  let transaction
  try {

    transaction = await sequelize.transaction();
    let createdDt = new Date();
    let updatedDt = new Date();
    
    let pendingStatus = 26;
    let customerId = req.user.userId
    
    const { amount } = req.body;
 

    // Create new order with idempotency key
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${customerId}`,
      payment_capture: 1,
      notes:{
        customer_id:customerId
      }
    };

    const order = await instance.orders.create(options);

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
    
    let insertToPayment = await Payment.create({
      razorpay_order_id: order.id,
   // Payment id will be updated on webhook
      statusId: pendingStatus,
      amount:amount,
      expiresAt: expiresAt,
      orderDate: createdDt,
      createdDt:createdDt,
      updatedDt:updatedDt,
      createdBy:order.notes.customer_id,
      updatedBy:order.notes.customer_id
         
    });

    if(!insertToPayment){
      await transaction.rollback();
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
        message:`Something went wrong`
      })
    }
  
    console.log('Transaction initiated and saved:', insertToPayment);

    await transaction.commit();
    return res.status(statusCode.SUCCESS.code).json({
      message:`Order is created`,
      order:order,
      success:true
    })
  } catch (error) {
    if(transaction) await transaction.rollback();
    console.error('Error creating order with Razorpay:', error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
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
    const event = req.body.event;
    const payload = req.body.payload;
    console.log(req.body,'eventdetail')
    console.log(req.body.payload.payment.entity.card, 'carddetails')
    console.log(req.body,'inside eventdetail payload')

    switch (event) {
      
      case 'payment.captured':
        // Payment successfully captured
        let capturedPaymentId = payload.payment.entity.id;
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

module.exports = { refundData };


module.exports = { refundData };












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

