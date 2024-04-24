
const express = require('express');
const passport = require('passport');
const router = express.Router();

const api_version = process.env.API_VERSION
const authController = require('../../../../controllers/'+api_version+'/auth/user.controllers');

// Route for initiating Google OAuth authentication
// router.get('/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// Route for handling Google OAuth callback
// router.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   authController.googleAuthenticationCallback
// );


// // routes to handle the facebook
// router.get('/facebook',
//   passport.authenticate('facebook', { scope: ['email'] })
// );


// router.get('/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),authController.facebookAuthenticationCallback
// );


router.post('/requestOtp',authController.requestOTP);
router.post('/verifyOtp',authController.verifyOTP)


module.exports = router