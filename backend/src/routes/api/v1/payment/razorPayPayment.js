
const express = require('express')
const router = express.Router();
const api_version = process.env.API_VERSION;
const razorPayPayment = require('../../../../controllers/'+api_version+'/payment/razorPayPayment')
let authenticateToken = require('../../../../middlewares/authToken.middlewares');

router.get('/getRazorpayApiKeys', authenticateToken, razorPayPayment.getRazorpayApiKeys)

router.post('/checkout', authenticateToken, razorPayPayment.checkout)

router.post('/paymentVerification',authenticateToken, razorPayPayment.paymentVerification)

router.get('/order/:orderId', authenticateToken, razorPayPayment.fetchOrder)

router.get('/payment/:paymentId', authenticateToken, razorPayPayment.fetchPayment)

router.post('/webHook', razorPayPayment.verifyWebhook, razorPayPayment.webhook)

router.get('/getDetailsWrtRazorpayOrderId', razorPayPayment.getDetailsWrtRazorpayOrderId)

router.post("/refundPayment", authenticateToken, razorPayPayment.refundData);

router.post("/checkAvailabilityOfSpace",authenticateToken, razorPayPayment.checkAvailabilityOfSpace);

module.exports = router