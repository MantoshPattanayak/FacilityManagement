const { sequelize,Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const decrypt  = require('../../../middlewares/decryption.middlewares')
const encrypt = require('../../../middlewares/encryption.middlewares')
const role =db.rolemaster
const resource = db.resourcemaster
const roleresource = db.roleresource
const resourcemaster = db.resourcemaster

let dataload = async (req, res) => {
    try {
        let roleData = await role.findAll({
            attributes: ['roleId', 'roleName', 'roleCode']
          });
        if (roleData.length > 0) {

            let resourceData = await sequelize.query(`select rm.resourceId as parentID, rm."name" as parent, rm.orderIn as parentOrder , rm2.resourceId as childID, rm2."name" as child, rm2.orderIn as childOrder from amabhoomi.resourcemaster rm left join amabhoomi.resourcemaster rm2 on rm2.parentResourceId = rm.resourceId where rm.parentResourceId is null and rm.status = 1 order by parentOrder, childOrder`,
            {type: Sequelize.QueryTypes.SELECT}
            );
            
            if (resourceData.length > 0) {
                let encryptRoleData = roleData.map(async(role)=>({
                    ...role,
                    roleId: role.roleId,
                    roleName:await encrypt(role.roleName),
                    roleCode: await encrypt(role.roleCode),

                }))

                let encryptResourceData = resourceData.map(async(resource)=>({
                    ...resource,
                    parentId: resource.parentId,
                    parent:await encrypt(resource.parent),
                    child: await encrypt(resource.child)
                }))
                res.status(statusCode.SUCCESS.code).json({
                    message1: 'role data',
                    roleData: encryptRoleData,
                    message2: 'resource data',
                    resourceData: encryptResourceData
                });
            } else {
                res.status(statusCode.NOTFOUND.code).json({ message2: 'resource data not found' });
            }
        } else {
            res.status(statusCode.NOTFOUND.code).json({ message2: 'role data not found' });
        }
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
    }
}



const insertRoleResource = async (req, res) => {
    try {
        let { role: roleId, status, resourceList } = req.body;
        resourceList = await decrypt(resourceList)
        status = await decrypt(status)
        let user = req.user.id; // Assuming user Id is stored in req.user.id
        let date = new Date();
        // Check for duplicates in all resources using raw query with join
        const duplicateCheckQuery = `
        SELECT rr.role_id, rr.resource_id
        FROM role_resource rr
        INNER JOIN resource_master rm ON rr.resource_id = rm.id
        WHERE rr.role_id = :roleId AND rr.resource_id IN (:resourceList)
        `;

        const duplicateCheckResult = await sequelize.query(duplicateCheckQuery, {
        replacements: { roleId, resourceList },
        type: QueryTypes.SELECT
        });

        // Check for any duplicates
        if (duplicateCheckResult.length > 0) {
        const duplicateResources = duplicateCheckResult.map(row => row.name);
        return res.status(statusCode.CONFLICT.code).json({ message: 'Some resources are already mapped with the role', data: duplicateResources });
        }
        // Flag to track success
        let successFlag = true;

        for (let i = 0; i < resourceList.length; i++) {
            const resource = await resource.findOne({ where: { id: resourceList[i] } });

            if(resource.parentResourceId != null){
                   // Insert into role_resource table
                let insertedRoleResource = await roleresource.create({
                    roleId: roleId,
                    resourceId: resourceList[i],
                    parentResourceId:resource.parentResourceId,
                    statusId: status,
                    createdBy: user,
                    createdDt: date,
                    updatedBy: user,
                    updatedDt: date
                });

                // Check if parent resource needs to be inserted
                if(insertedRoleResource){

                const verifyRoleResource1 = await roleresource.findOne({
                    where: {
                        role_id: roleId,
                        resource_id: parentResourceId
                    }
                });
                if (!verifyRoleResource1) {
                  let insertParentResourceId=  await roleresource.create({
                        role_id: roleId,
                        resource_id: resource.parentResourceId,
                        status_id: status,
                        created_by: user,
                        created_dt: date,
                        updated_by: user,
                        updated_dt: date
                    });

                    if (!insertParentResourceId) {
                        successFlag = false;
                        break;
                    }
                }

            }

            else{
                successFlag = false;
                break;
            }
        }
        else{

                  // Insert into role_resource table
                  let insertedRoleResource = await roleresource.create({
                    roleId: roleId,
                    resourceId: resourceList[i],
                    parentResourceId:resource.parentResourceId,
                    statusId: status,
                    createdBy: user,
                    createdDt: date,
                    updatedBy: user,
                    updatedDt: date
                });

                 // Check if the insertion was successful

                if (!insertedRoleResource) {
                    successFlag = false;
                    break;
                }

        }
            
    }
        // Respond based on the success flag
        if (successFlag) {
            return res.status(statusCode.SUCCESS.code).json({ message: 'Role data mapped with resource inserted successfully' });
        } else {
            return res.status(statusCode.NOTFOUND.code).json({ message: 'Some resources were not inserted due to conflicts or errors' });
        }
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).send({ message: err.message });
    }

}



let updateRoleResource = async (req, res) => {
    try {
   
        let { id, status } = req.body;
        let user = req.user.id;
        let date = 'NOW()';

        let  [updateTheStatusOfRoleCount,updateTheStatusOfRole] = await roleresource.update({status:status},{
            where:{
                roleResourceId:id
            }
        }
    )

        if (updateTheStatusOfRoleCount >= 1) {
            if(status = 0){
                res.status(statusCode.SUCCESS.code).json({ message: 'Role data mapped with resource is deactivated successfully!!!' })
            }
            else if(status = 1){
                res.status(statusCode.SUCCESS.code).json({ message: 'Role data mapped with resource is actived successfully!!!' })
            }
        }
        else {
            res.status(statusCode.NOTFOUND.code).json({ message: 'role data mapped with resource not updated' })
        }

    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).send({ message: err.message });
    }
   
}

let viewId = async (req, res) => {  
    try {
        let roleResourceId = req.params.id;

        let query =
        `select 
        role_resource1.roleResourceId, 
        role1.roleName as role, 
        rm.name as resourceName, 
        rm2.name as parentResourceName, 
        sm.id as status
        from amabhoomi.rolemaster role1
        inner join amabhoomi.roleresource role_resource1 on role1.roleId = role_resource1.roleId
        inner join amabhoomi.resourcemaster rm on role_resource1.resourceId = rm.resourceId
        left join amabhoomi.resourcemaster rm2 on role_resource1.parentResourceId = rm2.resourceId
        inner join amabhoomi.statusmaster sm on role_resource1.statusId = sm.statusId
        where role_resource1.roleResourceId = :roleResourceId
        `;
        

        let viewRoleResourceData = await sequelize.query(query,{
            replacements: { roleResourceId },
            type: QueryTypes.SELECT
        });
        
        if(viewRoleResourceData.length>0){
            let encryptViewRoleResourcData = viewRoleResourceData.map(async(roleData)=>({
                ...roleData,
                role: await encrypt(roleData.roleName),
                resourceName: await encrypt(roleData.resourceName),
                parentResourceName: await encrypt(roleData.parentResourceName)
            }))

            return res.status(statusCode.SUCCESS.code).send({message: 'Role Resource Data', data: encryptViewRoleResourcData});

        }
        else
            return res.status(statusCode.NOTFOUND.code).send({message: 'Role Resource Data not found'});
    }
    catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).send({ message: err.message });
    }
  
}


let viewRoleResource = async (req, res) => {
   try {
        let limit = (req.body.page_size) ? req.body.page_size : 50;
        let page = (req.body.page_number) ? req.body.page_number : 1;
        let offset = (page - 1) * limit;
        let { givenReq } = req.body;

        let query =
        `select count(*) over() as totalCount,
        role_resource1.roleResourceId, 
        role1.roleName as role, 
        rm.name as resourceName, 
        rm2.name as parentResourceName, 
        sm.id as status
        from amabhoomi.rolemaster role1
        inner join amabhoomi.roleresource role_resource1 on role1.roleId = role_resource1.roleId
        inner join amabhoomi.resourcemaster rm on role_resource1.resourceId = rm.resourceId
        left join amabhoomi.resourcemaster rm2 on role_resource1.parentResourceId = rm2.resourceId
        inner join amabhoomi.statusmaster sm on role_resource1.statusId = sm.statusId
             `;

        let roleResourceData = await sequelize.query(query,{
            type:sequelize.QueryTypes.SELECT
        })

       let decryptGivenReq= await decrypt(givenReq).toLowerCase();
        
       let findMatchRes = roleResourceData
       if(decryptGivenReq){
        findMatchRes = roleResourceData.filter((allData)=>
            allData.roleResourceId.includes(decryptGivenReq)||
            allData.role.includes(decryptGivenReq)||
            allData.resourceName.includes(decryptGivenReq)||
            allData.status.includes(decryptGivenReq)
        )
       }
       let paginatedRoleResources = findMatchRes.slice(offset,limit+offset)
       
       let encryptRoleResources = paginatedRoleResources.map(async(allData)=>({
        ...allData,
        role: await encrypt(allData.role),
        resourceName: await encrypt(allData.resourceName),
        parentResourceName: await encrypt(allData.parentResourceName),
        status:await encrypt(allData.status)

       }))
 

        res.status(statusCode.SUCCESS.code).json({ mesaage: 'role resource mapping list data', data: encryptRoleResources });
   
    }
    catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
    }
}

let autoSuggestionForRoleResourceSearch = async(req,res)=> {
    try{
        const givenReq = req.query.givenReq ? req.query.givenReq: null;
        const decryptGivenReq = await decrypt(givenReq).toLowerCase();

    let roleResourceDataQuery = `select count(*) over() as totalCount,
    role_resource1.roleResourceId, 
    role1.roleName as role, 
    rm.name as resourceName, 
    rm2.name as parentResourceName, 
    sm.id as status
    from amabhoomi.rolemaster role1
    inner join amabhoomi.roleresource role_resource1 on role1.roleId = role_resource1.roleId
    inner join amabhoomi.resourcemaster rm on role_resource1.resourceId = rm.resourceId
    left join amabhoomi.resourcemaster rm2 on role_resource1.parentResourceId = rm2.resourceId
    inner join amabhoomi.statusmaster sm on role_resource1.statusId = sm.statusId`;

  let roleResourceData = await sequelize.query(roleResourceDataQuery, {
    type: Sequelize.QueryTypes.SELECT
  });

        
  let findMatchRes = roleResourceData
  if(decryptGivenReq){
   findMatchRes = roleResourceData.filter((allData)=>
       allData.roleResourceId.includes(decryptGivenReq)||
       allData.role.includes(decryptGivenReq)||
       allData.resourceName.includes(decryptGivenReq)||
       allData.status.includes(decryptGivenReq)
   )
  }
  
  let encryptRoleResources = findMatchRes.map(async(allData)=>({
   ...allData,
   role: await encrypt(allData.role),
   resourceName: await encrypt(allData.resourceName),
   parentResourceName: await encrypt(allData.parentResourceName),
   status:await encrypt(allData.status)

  }))


   return res.status(statusCode.SUCCESS.code).json({ mesaage: 'role resource mapping list data', data: encryptRoleResources });
 
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
    }
  };

module.exports ={
    dataload,
    insertRoleResource,
    updateRoleResource,
    viewId,
    viewRoleResource,
    autoSuggestionForRoleResourceSearch

}