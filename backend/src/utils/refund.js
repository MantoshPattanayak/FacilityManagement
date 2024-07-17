const Razorpay = require('razorpay');
let initiateRefund = async  (paymentId, amount, notes)=> {
    try {
        const refundOptions = {
            payment_id: paymentId,
            amount: amount * 100, // Amount in smallest currency unit (paise)
            notes: notes
        };
        const response = await razorpay.payments.refund(refundOptions);
        return response;
    } catch (error) {
        console.error('Error initiating refund:', error);
        throw error;
    }
}