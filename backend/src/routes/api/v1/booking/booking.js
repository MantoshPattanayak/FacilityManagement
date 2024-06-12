const express = require('express');
const router = express.Router();
let api_version = process.env.API_VERSION;
let authenticateToken = require('../../../../middlewares/authToken.middlewares')

let booking = require('../../../../controllers/'+api_version+'/booking/bookings.controllers')

router.post('/park',authenticateToken,booking.parkBooking);

router.get('/park-book-initialdata',authenticateToken, booking.parkBookingFormInitialData);

router.post('/addToCart',authenticateToken,booking.addToCart)

router.get('/viewCartByUserId',authenticateToken,booking.viewCartByUserId)

router.put('/updateCart/:cartItemId',authenticateToken,booking.updateCart)

router.get('/viewCartItemsWRTCartItemId/:cartItemId',authenticateToken,booking.viewCartItemsWRTCartItemId)


router.post('/generateQRCode',authenticateToken,booking.generateQRCode)

module.exports = router