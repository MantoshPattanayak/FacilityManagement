const express = require('express')
const router = express.Router();
const api_version = process.env.API_VERSION;
const roleResource = require('../../../../controllers/'+api_version+'/configuration/roleResource')
let authenticateToken = require('../.../../../../../middlewares/authToken.middlewares')

router.get('/dataLoad',authenticateToken,roleResource.dataload);

router.post('/insertRoleResource',authenticateToken,roleResource.insertRoleResource)

router.post('/viewRoleResource',authenticateToken,roleResource.viewRoleResource)

router.get('/autoSuggestionRoleResource/:givenReq',authenticateToken,roleResource.autoSuggestionForRoleResourceSearch)

router.put('/updateRoleResource',authenticateToken,roleResource.updateRoleResource)

router.get('/viewId/:id',authenticateToken,roleResource.viewId)



module.exports = router