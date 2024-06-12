const express = require('express');
const router = express.Router();
let api_version = process.env.API_VERSION;

let userDetails = require('../../../../controllers/'+api_version+'/configuration/userDetails.controllers')

let authenticateToken = require('../../../../middlewares/authToken.middlewares')
router.post('/createUser',authenticateToken, userDetails.createUser)

router.get('/getUserById/:id',authenticateToken,userDetails.getUserById)

router.post('/viewList',authenticateToken,userDetails.viewList)

router.get('/fetchInitialData',authenticateToken,userDetails.fetchInitialData)

router.put('/updateUserData',authenticateToken,userDetails.updateUserData)

router.get('/autoSuggestionForUserSearch/:givenReq',authenticateToken,userDetails.autoSuggestionForUserSearch)

router.post('/profile/viewBookings',authenticateToken, userDetails.viewBookings);

router.get('/profile/initalFilterDataForBooking',authenticateToken, userDetails.initalFilterDataForBooking);

router.post('/bookmarkingAddAction',authenticateToken, userDetails.bookmarkingAddAction);

router.post('/bookmarkingRemoveAction', authenticateToken,userDetails.bookmarkingRemoveAction);

router.post('/viewBookmarks',authenticateToken, userDetails.viewBookmarksListForUser);

module.exports = router