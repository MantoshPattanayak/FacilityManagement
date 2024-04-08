const express = require('express')
const router = express.Router();
const api_version = process.env.API_VERSION;
const userResource = require('../../../../controllers/'+api_version+'/configuration/userResource')

router.get('/dataLoad',userResource.dataload);

router.post('/insertUserResource',userResource.insertUserResource)

router.get('/viewUserResource',userResource.viewUserResource)

router.get('/autoSuggestionUserResource/:givenReq',userResource.autoSuggestionUserResource)



module.exports = router