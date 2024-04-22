const express = require('express')
const router = express.Router();
const api_version = process.env.API_VERSION;
const roleResource = require('../../../../controllers/'+api_version+'/configuration/roleResource')


router.get('/dataLoad',roleResource.dataload);

router.post('/insertRoleResource',roleResource.insertRoleResource)

router.get('/viewRoleResource',roleResource.viewRoleResource)

router.get('/autoSuggestionRoleResource/:givenReq',roleResource.autoSuggestionForRoleResourceSearch)

router.put('/updateRoleResource',roleResource.updateRoleResource)

router.get('/viewId/:id',roleResource.viewId)



module.exports = router