const express = require('express');
const router = express.Router();
let api_version = process.env.API_VERSION;

let booking = require('../../../../controllers/'+api_version+'/booking/bookings.controllers')

router.post('/park',booking.parkBooking);

router.get('/park-book-initialdata', booking.parkBookingFormInitialData);

router.post('/addToCart',booking.addToCart)

module.exports = router