const express = require('express')
const router = express.Router();
const api_version = process.env.API_VERSION;
const userResource = require('../../../../controllers/'+api_version+'/configuration/userResource')
let authenticateToken = require('../../../../middlewares/authToken.middlewares')
router.get('/dataLoad',authenticateToken,userResource.dataload);

router.post('/insertUserResource',authenticateToken,userResource.insertUserResource)

router.post('/viewUserResource',authenticateToken,userResource.viewUserResource)

router.get('/autoSuggestionUserResource/:givenReq',authenticateToken,userResource.autoSuggestionUserResource)



module.exports = router