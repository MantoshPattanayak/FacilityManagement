const { sequelize, Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const { encrypt } = require('../../../middlewares/encryption.middlewares')
const QueryTypes = db.QueryTypes
const Payment = db.payment
let instance = require('../../../config/razorpay.config.js');
let crypto = require('crypto');

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

const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
      payment_capture: '1', // Automatically capture the payment
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    console.log(req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const insertPayment = await Payment.create({
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature
      });
      if (insertPayment) {
        return res.status(200).json({
          message: 'Payment done successfully',
          success: true
        });
      } else {
        return res.status(400).json({
          message: 'Payment Failed',
          success: false
        });
      }
    } else {
      return res.status(400).json({
        message: 'Inavlaid payment request',
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

const webhook = async (req, res) => {
  const webhookSecret = 'YOUR_WEBHOOK_SECRET'; // Your webhook secret

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(JSON.stringify(req.body));
  const digest = hmac.digest('hex');

  if (digest !== req.headers['x-razorpay-signature']) {
    return res.status(400).send('Webhook Error: Invalid signature');
  }

  // Webhook event payload
  const { event, payload } = req.body;

  try {
    // Handle specific webhook events
    switch (event) {
      case 'payment.captured':
        // Payment successfully captured
        console.log('Payment Captured:', payload);
        // Implement your logic here (e.g., update database, send email)
        break;
      case 'payment.failed':
        // Payment failed
        console.log('Payment Failed:', payload);
        // Implement your logic here (e.g., notify user, handle retries)
        break;
      case 'refund.processed':
        // Refund processed
        console.log('Refund Processed:', payload);
        // Implement your logic here (e.g., update transaction status)
        break;
      // Handle other events as needed
      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(500).json({ error: 'Webhook Error' });
  }
}


module.exports = {
  getRazorpayApiKeys,
  checkout,
  paymentVerification,
  fetchOrder,
  fetchPayment,
  webhook
}

