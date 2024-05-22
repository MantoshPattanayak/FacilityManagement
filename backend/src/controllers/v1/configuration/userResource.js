const { sequelize,Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const {decrypt}  = require('../../../middlewares/decryption.middlewares')
const {encrypt} = require('../../../middlewares/encryption.middlewares')
const role =db.rolemaster
const resource = db.resourcemaster
const roleresource = db.roleresource
const resourcemaster = db.resourcemaster
const user = db.privateuser
const userresource = db.userresource;
const QueryTypes = db.QueryTypes


let dataload = async (req, res) => {
    try {
       let userDataLoad = await sequelize.query(`select 
       um.userId,
       um.fullName as fullName,
       um.userName as userName,
       um.emailId as email,
       um.phoneNo as contact,
       rm.roleCode as Role,
       sm.statusCode as status, 
       gm.genderCode as gender 
       from amabhoomi.usermasters um 
       inner join amabhoomi.rolemasters rm on rm.roleId=um.roleId 
       inner join amabhoomi.statusmasters sm on sm.statusId =um.statusId 
       left join amabhoomi.gendermasters gm on gm.genderId=um.genderId
       order by um.userId`);

        if (userDataLoad.length > 0) {
            let resourceData = await sequelize.query(`select rm.resourceId as parentID, rm.name as parent, rm.orderIn as parentOrder , rm2.resourceId as childID, rm2.name as child, rm2.orderIn as childOrder from amabhoomi.resourcemasters rm left join amabhoomi.resourcemasters rm2 on rm2.parentResourceId = rm.resourceId where rm.parentResourceId is null and rm.statusId = 1 order by parentOrder, childOrder`,
            {type: Sequelize.QueryTypes.SELECT});

            if (resourceData.length > 0) {

                // let encryptUserDataLoad = userDataLoad.map(async(userData)=>({
                //     ...userData,
                //     roleCode:await encrypt(userData.roleCode),
                //     statusCode:await encrypt(userData.statusCode),
                //     genderCode:await encrypt(userData.genderCode)

                // }))

                // let encryptResourceData = resourceData.map(async(resource)=>({
                //     ...resource,
                //     parentId: resource.parentId,
                //     parent:await encrypt(resource.parent),
                //     child: await encrypt(resource.child)
                // }))
                res.status(statusCode.SUCCESS.code).json({
                    message1: 'user data',
                    userData: userDataLoad,
                    message2: 'resource data',
                    resourceData: resourceData
                });
            } else {
                res.status(statusCode.NOTFOUND.code).json({ message2: 'resource data not found' });
            }
        } else {
            res.status(statusCode.NOTFOUND.code).json({ message2: 'user data not found' });
        }
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
    }
 
}



let insertUserResource = async (req, res) => {
    try {
        let userId = req.body.userId;
        let status = req.body.status;
        let user = req.user?.id||1;
        let date = new Date();
        let {resourceList} = req.body;


        // Check for duplicates in all resources
        let duplicateCheckQuery = ` 
    SELECT ur.userId, ur.resourceId, rm.name
    FROM amabhoomi.userresources ur
    INNER JOIN amabhoomi.resourcemasters rm ON ur.resourceId = rm.resourceId
    WHERE ur.userId = :userId AND ur.resourceId IN(:resourceList)

        `;

        let duplicateCheckResult = await sequelize.query(duplicateCheckQuery,  {
            replacements: { userId, resourceList },
            type: QueryTypes.SELECT
            });

        // Check for any duplicates
        if (duplicateCheckResult.length > 0) {
            const duplicateResources = duplicateCheckResult.map(row => row.name);
            return res.status(statusCode.CONFLICT.code).json({ message: 'Some resources are already mapped with the user', data: duplicateResources });
         }
               // Flag to track success
               let successFlag = true;
               
         for (let i = 0; i < resourceList.length; i++) {
            const query = await resourcemaster.findOne({
              attributes: ['parentResourceId'],
              where: { resourceId: resourceList[i] }
            });

            console.log('2')
         if (query.parentResourceId !== null) {
            // Child resource handling
            console.log('3')
            const result = await userresource.create({
              userId:userId,
              resourceId: resourceList[i],
              parentresourceId: query.parentResourceId,
              statusId: status,
              createdBy: user,
              createdDt: date,
              updatedBy: user,
              updatedDt: date,
            });
            console.log('4')
            console.log('parent resource id', query.parentResourceId);
    
            const verifyRoleResource1 = await userresource.findOne({
              attributes: ['userId', 'resourceId'],
              where: { userId, resourceid: query.parentResourceId },
       
            });
         

            console.log(verifyRoleResource1);
    
            if (result) {
              if (!verifyRoleResource1) {
                const result1 = await userresource.create({
                  userId:userId,
                  resourceId: query.parentResourceId,
                  statusId: status,
                  createdBy: user,
                  createdDt: date,
                  updatedBy: user,
                  updatedDt: date,
                });
    
                if (!result1) {
                  successFlag = false;
                  break;
                }
              } 
            } else {
              successFlag = false;
              break;
            }
          } else {
            // Handle non-child resource
            const result = await userresource.create({
              userId:userId,
              resourceId: resourceList[i],
              parentResourceId:query.parentResourceId,
              statusId: status,
              createdBy: user,
              createdDt: date,
              updatedBy: user,
              updatedDt: date,
            });
    
            if (!result) {
              successFlag = false;
              break;
            }
    
          }
        }
    
        // Respond based on the success flag
        if (successFlag) {
          return res.status(statusCode.SUCCESS.code).json({ message: 'user data mapped with resource inserted successfully' });
        } else {
          return res.status(statusCode.NOTFOUND.code).json({ message: 'Some resources were not inserted due to conflicts or errors' });
        }
      
    } catch (err) {
      res.status(statusCode.UNAUTHORIZED.code).send({ message: err.message });
    }
}


let viewUserResource = async (req, res) => {

    try {
      console.log('1')
        let limit = (req.body.page_size) ? req.body.page_size : 50;
        let page = (req.body.page_number) ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
      
        const givenReq = req.body.givenReq ? req.body.givenReq.toLowerCase(): null;
      
      

        let query =
            `SELECT 
            ur.userResourceId,
            um.fullName,
            um.userName,
            rm.name,
            rm.description,
            (
                SELECT rm1.name
                FROM amabhoomi.resourcemasters rm1
                WHERE rm1.resourceId = rm.parentResourceId
            ) AS parentResourceName,
            sm.statusCode
            FROM 
            amabhoomi.userresources ur
            INNER JOIN 
            amabhoomi.usermasters um ON um.userId = ur.userId 
            INNER JOIN 
            amabhoomi.resourcemasters rm ON rm.resourceId = ur.resourceId
            LEFT JOIN
            amabhoomi.statusmasters sm ON sm.statusId=ur.statusId
            `;


        let viewUserResourceData = await sequelize.query(query,{
            type:Sequelize.QueryTypes.SELECT
        })
        console.log(viewUserResourceData,'viewUserResourceData')

        // let decryptViewUserResourceData = viewUserResourceData.map(async(userData)=>({
        //     ...userData,
        //    fullName: await decrypt(userData.fullName),
        //    userName: await decrypt(userData.userName)
        // }))

        let matchedData = viewUserResourceData;

        if(givenReq){
            matchedData = viewUserResourceData.filter((allData)=>
                allData.userResourceId.includes(givenReq)||
                allData.fullName.includes(givenReq)||
                allData.userName.includes(givenReq)||
                allData.name.includes(givenReq)||
                allData.description.includes(givenReq)||
                allData.parentResourceName.includes(givenReq)||
                allData.statusCode.includes(givenReq)
            )
           }
           let paginatedUserResources = matchedData.slice(offset,limit+offset)
       
        //    let encryptUserResources = paginatedUserResources.map(async(allData)=>({
        //     ...allData,
        //     fullName: await encrypt(allData.fullName),
        //     userName: await encrypt(allData.userName),
        //     name:await encrypt(allData.name),
        //     description: await encrypt(allData.description),
        //     parentResourceName: await encrypt(allData.parentResourceName),
        //     statusCode: await encrypt(allData.statusCode)

        //    }))

        return res.status(statusCode.SUCCESS.code).json({ mesaage: 'user resource mapping list data', data: paginatedUserResources });
   
    }
    catch (err) {
        res.status(statusCode.BAD_REQUEST.code).json({ message: err.message });
    }
 
}

let autoSuggestionUserResource = async (req, res) => {

    try {
      
        const givenReq = req.params.givenReq ? req.params.givenReq.toLowerCase(): null;
        // const decryptGivenReq = await decrypt(givenReq).toLowerCase();
      

        let query =
            `SELECT 
            ur.userResourceId,
            um.fullName,
            um.userName,
            rm.name,
            rm.description,
            (
                SELECT rm1.name
                FROM amabhoomi.resourcemasters rm1
                WHERE rm1.resourceId = rm.parentResourceId
            ) AS parentResourceName,
            sm.statusCode
            FROM 
            amabhoomi.userresources ur
            INNER JOIN 
            amabhoomi.usermasters um ON um.userId = ur.userId 
            INNER JOIN 
            amabhoomi.resourcemasters rm ON rm.resourceId = ur.resourceId
            LEFT JOIN
            amabhoomi.statusmasters sm ON sm.statusId=ur.statusId
            `;


        let viewUserResourceData = await sequelize.query(query,{
            type:Sequelize.QueryTypes.SELECT
        })

        let decryptViewUserResourceData = await Promise.all(viewUserResourceData.map(async(userData)=>{
          if(!userData||!userData.fullName||!userData.userName){
            return userData
          }
          return {
            ...userData,
            fullName: await decrypt(userData.fullName),
            userName: await decrypt(userData.userName)
          }

        }))
        let matchedData = viewUserResourceData;
        console.log('matched data', decryptViewUserResourceData)

        if(givenReq){
            matchedData = decryptViewUserResourceData.filter((allData)=>
            (allData.userResourceId && (allData.userResourceId.toString() === givenReq))||
            (allData.fullName && allData.fullName.toLowerCase().includes(givenReq.toLowerCase())) ||
            (allData.userName && allData.userName.toLowerCase().includes(givenReq.toLowerCase())) ||
            (allData.name && allData.name.toLowerCase().includes(givenReq.toLowerCase())) ||
            (allData.description && allData.description.toLowerCase().includes(givenReq.toLowerCase())) ||
            (allData.parentResourceName && allData.parentResourceName.toLowerCase().includes(givenReq.toLowerCase())) ||
            (allData.statusCode && allData.statusCode.toLowerCase().includes(givenReq.toLowerCase()))
            )
           }
       
        //    let encryptUserResources = matchedData.map(async(allData)=>({
        //     ...allData,
        //     fullName: await encrypt(allData.fullName),
        //     userName: await encrypt(allData.userName),
        //     name:await encrypt(allData.name),
        //     description: await encrypt(allData.description),
        //     parentResourceName: await encrypt(allData.parentResourceName),
        //     statusCode: await encrypt(allData.statusCode)

        //    }))

        return res.status(statusCode.SUCCESS.code).json({ mesaage: 'user resource mapping list data', data: matchedData });
   
    }
    catch (err) {
        res.status(statusCode.BAD_REQUEST.code).json({ message: err.message });
    }
 
}

module.exports = {
    dataload,
    insertUserResource,
    viewUserResource,
    autoSuggestionUserResource

}