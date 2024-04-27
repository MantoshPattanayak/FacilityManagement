const { sequelize,Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const {decrypt}  = require('../../../middlewares/decryption.middlewares')
const {encrypt} = require('../../../middlewares/encryption.middlewares')
const QueryTypes = db.QueryTypes
const Payment =db.payment
let { instance } = require('../../../config/razorpay.config.js');
let crypto = require('crypto');

 
const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

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
 
  } else {
    res.status(400).json({
      success: false,
    });
  }
};


module.exports ={
    checkout,
    paymentVerification
}

