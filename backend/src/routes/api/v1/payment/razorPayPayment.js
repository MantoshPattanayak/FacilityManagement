
const express = require('express')
const router = express.Router();
const api_version = process.env.API_VERSION;
const razorPayPayment = require('../../../../controllers/'+api_version+'/payment/razorPayPayment')



router.post('/checkout',razorPayPayment.checkout)

router.post('/paymentVerification',razorPayPayment.paymentVerification)



module.exports = router