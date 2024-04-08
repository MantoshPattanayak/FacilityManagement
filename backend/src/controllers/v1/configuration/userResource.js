const { sequelize,Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const decrypt  = require('../../../middlewares/decryption.middlewares')
const encrypt = require('../../../middlewares/encryption.middlewares')
const role =db.rolemaster
const resource = db.resourcemaster
const roleresource = db.roleresource
const resourcemaster = db.resourcemaster
const user = db.privateuser
const userresource = db.userresource;


let dataload = async (req, res) => {
    try {
       let userDataLoad = await sequelize.query(` select 
        pu.privateUserId as userId,
        pu.fullName as userName,
        pu.emailId as email,
        pu.contactNo as contact,
        rm.roleCode as Role,
        sm.statusCode  as status, 
        gm.genderCode as gender 
        from amabhoomi.privateuser pu 
        inner join amabhoomi.rolemaster rm on rm.roleId=pu.roleId 
        inner join admin.statusmaster sm on sm.statusId =pu.statusId 
        left join admin.gendermaster gm on gm.genderId=pu.genderId
        order by pu.privateUserId`);

        if (userDataLoad.length > 0) {
            let resourceData = await sequelize.query(`select rm.resourceId as parentID, rm."name" as parent, rm.orderIn as parentOrder , rm2.resourceId as childID, rm2."name" as child, rm2.orderIn as childOrder from amabhoomi.resourcemaster rm left join amabhoomi.resourcemaster rm2 on rm2.parentResourceId = rm.resourceId where rm.parentResourceId is null and rm.status = 1 order by parentOrder, childOrder`,
            {type: Sequelize.QueryTypes.SELECT});

            if (resourceData.length > 0) {

                let encryptUserDataLoad = userDataLoad.map(async(userData)=>({
                    ...userData,
                    roleCode:await encrypt(userData.roleCode),
                    statusCode:await encrypt(userData.statusCode),
                    genderCode:await encrypt(userData.genderCode)

                }))

                let encryptResourceData = resourceData.map(async(resource)=>({
                    ...resource,
                    parentId: resource.parentId,
                    parent:await encrypt(resource.parent),
                    child: await encrypt(resource.child)
                }))
                res.status(statusCode.SUCCESS.code).json({
                    message1: 'user data',
                    userData: encryptUserDataLoad,
                    message2: 'resource data',
                    resourceData: encryptResourceData
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
    let client;
    try {
        client = await db.connect();
        let userid = req.body.user;
        let status = req.body.status;
        let user = req.user.id;
        let date = 'now()';
        let {resourceList} = req.body;


        // Check for duplicates in all resources
        let duplicateCheckQuery = `
            SELECT ur.userid, ur.resourceid, rm.name
            FROM admin.user_resource ur
            INNER JOIN admin.resource_master rm ON ur.resourceid = rm.id
            WHERE ur.userid = :userid AND ur.resourceid IN(:resourceList)
        `;

        let duplicateCheckResult = await sequelize.query(duplicateCheckQuery,  {
            replacements: { userid, resourceList },
            type: QueryTypes.SELECT
            });

        // Check for any duplicates
        if (duplicateCheckResult.length > 0) {
            const duplicateResources = duplicateCheckResult.map(row => row.name);
            return res.status(statusCode.CONFLICT.code).json({ message: 'Some resources are already mapped with the role', data: duplicateResources });
         }
         for (let i = 0; i < resourceArray.length; i++) {
            const query = await userresource.findOne({
              attributes: ['parentResourceId'],
              where: { id: resourceList[i] }
            });

         if (query.parentResourceId !== null) {
            // Child resource handling
            const result = await userresource.create({
              userid,
              resourceid: resourceList[i],
              parentresourceid: query.parentResourceId,
              statusid: status,
              createdby: user,
              createddt: date,
              updatedby: user,
              updateddt: date,
            });
    
            console.log('parent resource id', query.parentResourceId);
    
            const verifyRoleResource1 = await userresource.findOne({
              attributes: ['userid', 'resourceid'],
              where: { userid, resourceid: query.parentResourceId },
              transaction,
            });
    
            console.log(verifyRoleResource1);
    
            if (result) {
              if (!verifyRoleResource1) {
                const result1 = await userresource.create({
                  userid,
                  resourceid: query.parentResourceId,
                  statusid: status,
                  createdby: user,
                  createddt: date,
                  updatedby: user,
                  updateddt: date,
                }, { transaction });
    
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
              userid,
              resourceid: resourceList[i],
              parentresourceid: query.parentResourceId,
              statusid: status,
              createdby: user,
              createddt: date,
              updatedby: user,
              updateddt: date,
            }, { transaction });
    
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
        let limit = (req.body.page_size) ? req.body.page_size : 50;
        let page = (req.body.page_number) ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
      
        const givenReq = req.body.givenReq ? req.body.givenReq: null;
        const decryptGivenReq = await decrypt(givenReq).toLowerCase();
      

        let query =
            `SELECT 
            ur.userResourcId,
            pu.fullName,
            pu.userName,
            rm.name,
            rm.description,
            (
                SELECT rm1.name
                FROM amabhoomi.resourcemaster rm1
                WHERE rm1.resourceId = rm.parentResourceId
            ) AS parentResourceName,
            sm.statusCode
            FROM 
            amabhoomi.userresource ur
            INNER JOIN 
            amabhoomi.privateuser pu ON pu.privateUserId = ur.userId 
            INNER JOIN 
            amabhoomi.resourcemaster rm ON rm.resourceId = ur.resourceId
            LEFT JOIN
            amabhoomi.statusmaster sm ON sm.statusId=ur.statusId
            `;


        let viewUserResourceData = await sequelize.query(query,{
            type:Sequelize.QueryTypes.SELECT
        })

        let decryptViewUserResourceData = viewUserResourceData.map(async(userData)=>({
            ...userData,
           fullName: await decrypt(userData.fullName),
           userName: await decrypt(userData.userName)
        }))

        let matchedData = decryptViewUserResourceData;

        if(decryptGivenReq){
            matchedData = decryptViewUserResourceData.filter((allData)=>
                allData.userResourceId.includes(decryptGivenReq)||
                allData.fullName.includes(decryptGivenReq)||
                allData.userName.includes(decryptGivenReq)||
                allData.name.includes(decryptGivenReq)||
                allData.description.includes(decryptGivenReq)||
                allData.parentResourceName.includes(decryptGivenReq)||
                allData.statusCode.includes(decryptGivenReq)
            )
           }
           let paginatedUserResources = matchedData.slice(offset,limit+offset)
       
           let encryptUserResources = paginatedUserResources.map(async(allData)=>({
            ...allData,
            fullName: await encrypt(allData.fullName),
            userName: await encrypt(allData.userName),
            name:await encrypt(allData.name),
            description: await encrypt(allData.description),
            parentResourceName: await encrypt(allData.parentResourceName),
            statusCode: await encrypt(allData.statusCode)

           }))

        return res.status(statusCode.SUCCESS.code).json({ mesaage: 'user resource mapping list data', data: encryptUserResources });
   
    }
    catch (err) {
        res.status(statusCode.BAD_REQUEST.code).json({ message: err.message });
    }
 
}

let autoSuggestionUserResource = async (req, res) => {

    try {
      
        const givenReq = req.body.givenReq ? req.body.givenReq: null;
        const decryptGivenReq = await decrypt(givenReq).toLowerCase();
      

        let query =
            `SELECT 
            ur.userResourcId,
            pu.fullName,
            pu.userName,
            rm.name,
            rm.description,
            (
                SELECT rm1.name
                FROM amabhoomi.resourcemaster rm1
                WHERE rm1.resourceId = rm.parentResourceId
            ) AS parentResourceName,
            sm.statusCode
            FROM 
            amabhoomi.userresource ur
            INNER JOIN 
            amabhoomi.privateuser pu ON pu.privateUserId = ur.userId 
            INNER JOIN 
            amabhoomi.resourcemaster rm ON rm.resourceId = ur.resourceId
            LEFT JOIN
            amabhoomi.statusmaster sm ON sm.statusId=ur.statusId
            `;


        let viewUserResourceData = await sequelize.query(query,{
            type:Sequelize.QueryTypes.SELECT
        })

        let decryptViewUserResourceData = viewUserResourceData.map(async(userData)=>({
            ...userData,
           fullName: await decrypt(userData.fullName),
           userName: await decrypt(userData.userName)
        }))

        let matchedData = decryptViewUserResourceData;

        if(decryptGivenReq){
            matchedData = decryptViewUserResourceData.filter((allData)=>
                allData.userResourceId.includes(decryptGivenReq)||
                allData.fullName.includes(decryptGivenReq)||
                allData.userName.includes(decryptGivenReq)||
                allData.name.includes(decryptGivenReq)||
                allData.description.includes(decryptGivenReq)||
                allData.parentResourceName.includes(decryptGivenReq)||
                allData.statusCode.includes(decryptGivenReq)
            )
           }
       
           let encryptUserResources = matchedData.map(async(allData)=>({
            ...allData,
            fullName: await encrypt(allData.fullName),
            userName: await encrypt(allData.userName),
            name:await encrypt(allData.name),
            description: await encrypt(allData.description),
            parentResourceName: await encrypt(allData.parentResourceName),
            statusCode: await encrypt(allData.statusCode)

           }))

        return res.status(statusCode.SUCCESS.code).json({ mesaage: 'user resource mapping list data', data: encryptUserResources });
   
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