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

            let resourceData = await sequelize.query(`select rm.resourceId as parentID, rm."name" as parent, rm.orderIn as parentOrder , rm2.resourceId as childID, rm2."name" as child, rm2.orderIn as childOrder from amabhoomi.resourcemasters rm left join amabhoomi.resourcemasters rm2 on rm2.parentResourceId = rm.resourceId where rm.parentResourceId is null and rm.status = 1 order by parentOrder, childOrder`,
            {type: Sequelize.QueryTypes.SELECT}
            );
            
            if (resourceData.length > 0) {
                // let encryptRoleData = roleData.map(async(role)=>({
                //     ...role,
                //     roleId: await encrypt(role.roleId),
                //     roleName:await encrypt(role.roleName),
                //     roleCode: await encrypt(role.roleCode),

                // }))

                // let encryptResourceData = resourceData.map(async(resource)=>({
                //     ...resource,
                //     parentId: await encrypt(resource.parentId),
                //     parent:await encrypt(resource.parent),
                //     child: await encrypt(resource.child)
                // }))
                res.status(statusCode.SUCCESS.code).json({
                    message1: 'role data',
                    roleData: roleData,
                    message2: 'resource data',
                    resourceData: resourceData
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
        let { role: roleId, statusId, resourceList } = req.body;
        // resourceList = await decrypt(resourceList)
        // status = await decrypt(status)
        let user = req.user.id||1; // Assuming user Id is stored in req.user.id
        let date = new Date();
        // Check for duplicates in all resources using raw query with join
        const duplicateCheckQuery = `
        SELECT rr.roleId, rr.resourceId
        FROM roleresource rr
        INNER JOIN resourcemasters rm ON rr.resourceId = rm.resourceId
        WHERE rr.roleId = :roleId AND rr.resourceId IN (:resourceList)
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
                    statusId: statusId,
                    createdBy: user,
                    createdDt: date,
                    updatedBy: user,
                    updatedDt: date
                });

                // Check if parent resource needs to be inserted
                if(insertedRoleResource){

                const verifyRoleResource1 = await roleresource.findOne({
                    where: {
                        roleId: roleId,
                        resourceId: parentResourceId
                    }
                });
                if (!verifyRoleResource1) {
                  let insertParentResourceId=  await roleresource.create({
                        roleId: roleId,
                        resourceId: resource.parentResourceId,
                        statusId: statusId,
                        createdBy: user,
                        createdDt: date,
                        updatedBy: user,
                        updatedDt: date
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
                    statusId: statusId,
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
   
        let { id, statusId } = req.body;
        let user = req.user.id;
        let date = 'NOW()';

        let  [updateTheStatusOfRoleCount,updateTheStatusOfRole] = await roleresource.update({statusId:statusId},{
            where:{
                roleResourceId:id
            }
        }
    )

        if (updateTheStatusOfRoleCount >= 1) {
            if(statusId = 0){
                res.status(statusCode.SUCCESS.code).json({ message: 'Role data mapped with resource is deactivated successfully!!!' })
            }
            else if(statusId = 1){
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
        let encryptViewRoleResourcData;
        let query =
        `select 
        role_resource1.roleResourceId, 
        role1.roleName as role, 
        rm.name as resourceName, 
        rm2.name as parentResourceName, 
        sm.id as status
        from amabhoomi.rolemasters role1
        inner join amabhoomi.roleresources role_resource1 on role1.roleId = role_resource1.roleId
        inner join amabhoomi.resourcemasters rm on role_resource1.resourceId = rm.resourceId
        left join amabhoomi.resourcemasters rm2 on role_resource1.parentResourceId = rm2.resourceId
        inner join amabhoomi.statusmasters sm on role_resource1.statusId = sm.statusId
        where role_resource1.roleResourceId = :roleResourceId
        `;
        

        let viewRoleResourceData = await sequelize.query(query,{
            replacements: { roleResourceId },
            type: QueryTypes.SELECT
        });
        
        if(viewRoleResourceData.length>0){
        //     encryptViewRoleResourcData = viewRoleResourceData.map(async(roleData)=>({
        //         ...roleData,
        //         roleResourceId:await encrypt(roleData.roleResourceId),
        //         role: await encrypt(roleData.roleName),
        //         resourceName: await encrypt(roleData.resourceName),
        //         parentResourceName: await encrypt(roleData.parentResourceName)
        //     }))

            return res.status(statusCode.SUCCESS.code).send({message: 'Role Resource Data', data: viewRoleResourceData});

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
        sm.statusId as status
        from amabhoomi.rolemaster role1
        inner join amabhoomi.roleresources role_resource1 on role1.roleId = role_resource1.roleId
        inner join amabhoomi.resourcemasters rm on role_resource1.resourceId = rm.resourceId
        left join amabhoomi.resourcemasters rm2 on role_resource1.parentResourceId = rm2.resourceId
        inner join amabhoomi.statusmasters sm on role_resource1.statusId = sm.statusId
             `;

        let roleResourceData = await sequelize.query(query,{
            type:sequelize.QueryTypes.SELECT
        })

    //    let decryptGivenReq= await decrypt(givenReq).toLowerCase();
        
       let findMatchRes = roleResourceData
       if(givenReq){
        findMatchRes = roleResourceData.filter((allData)=>
            allData.roleResourceId.includes(givenReq)||
            allData.role.includes(givenReq)||
            allData.resourceName.includes(givenReq)||
            allData.status.includes(givenReq)
        )
       }
       let paginatedRoleResources = findMatchRes.slice(offset,limit+offset)
       
    //    let encryptRoleResources = paginatedRoleResources.map(async(allData)=>({
    //     ...allData,
    //     role: await encrypt(allData.role),
    //     resourceName: await encrypt(allData.resourceName),
    //     parentResourceName: await encrypt(allData.parentResourceName),
    //     status:await encrypt(allData.status)

    //    }))
 

        res.status(statusCode.SUCCESS.code).json({ mesaage: 'role resource mapping list data', data: paginatedRoleResources });
   
    }
    catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
    }
}

let autoSuggestionForRoleResourceSearch = async(req,res)=> {
    try{
        const givenReq = req.query.givenReq ? req.query.givenReq: null;
        // const decryptGivenReq = await decrypt(givenReq).toLowerCase();

    let roleResourceDataQuery = `select count(*) over() as totalCount,
    role_resource1.roleResourceId, 
    role1.roleName as role, 
    rm.name as resourceName, 
    rm2.name as parentResourceName, 
    sm.statusId as status
    from amabhoomi.rolemasters role1
    inner join amabhoomi.roleresources role_resource1 on role1.roleId = role_resource1.roleId
    inner join amabhoomi.resourcemasters rm on role_resource1.resourceId = rm.resourceId
    left join amabhoomi.resourcemasters rm2 on role_resource1.parentResourceId = rm2.resourceId
    inner join amabhoomi.statusmasters sm on role_resource1.statusId = sm.statusId`;

  let roleResourceData = await sequelize.query(roleResourceDataQuery, {
    type: Sequelize.QueryTypes.SELECT
  });

        
  let findMatchRes = roleResourceData
  if(givenReq){
   findMatchRes = roleResourceData.filter((allData)=>
       allData.roleResourceId.includes(givenReq)||
       allData.role.includes(givenReq)||
       allData.resourceName.includes(givenReq)||
       allData.status.includes(givenReq)
   )
  }
  
//   let encryptRoleResources = findMatchRes.map(async(allData)=>({
//    ...allData,
//    role: await encrypt(allData.role),
//    resourceName: await encrypt(allData.resourceName),
//    parentResourceName: await encrypt(allData.parentResourceName),
//    status:await encrypt(allData.status)

//   }))


   return res.status(statusCode.SUCCESS.code).json({ mesaage: 'role resource mapping list data', data: findMatchRes });
 
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