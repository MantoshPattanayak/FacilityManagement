const express = require('express');
const router = express.Router();
let api_version = process.env.API_VERSION;

let userDetails = require('../../../../controllers/'+api_version+'/configuration/userDetails.controllers')

let authenticateToken = require('../../../../middlewares/authToken.middlewares')
router.post('/createUser',userDetails.createUser)

router.get('/getUserById/:id',userDetails.getUserById)

router.post('/viewList',userDetails.viewList)

router.get('/fetchInitialData',userDetails.fetchInitialData)

router.put('/updateUserData',userDetails.updateUserData)

router.get('/autoSuggestionForUserSearch/:givenReq',userDetails.autoSuggestionForUserSearch)

router.post('/profile/viewBookings', userDetails.viewBookings);

router.get('/profile/initalFilterDataForBooking', userDetails.initalFilterDataForBooking);

router.post('/bookmarkingAddAction', userDetails.bookmarkingAddAction);

router.post('/bookmarkingRemoveAction', userDetails.bookmarkingRemoveAction);

router.post('/viewBookmarks',authenticateToken, userDetails.viewBookmarksListForUser);

module.exports = router