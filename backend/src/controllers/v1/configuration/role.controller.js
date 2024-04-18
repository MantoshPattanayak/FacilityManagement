const db = require("../../../models/index");
const statusCode = require("../../../utils/statusCode");

const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const role = db.rolemaster
//get
const roleId = async (req, res) => {
  try {
    const [rolemasters, metadata] = await sequelize.query(
      "select * from amabhoomi.rolemasters"
    );

    return res.status(statusCode.SUCCESS.code).json({
      message: `All roles`,
      data: rolemasters,
    });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};

//Insert
const createRole =async (req, res) => {
  // store the request body in a user object
  // Save User in the database
  try {
    console.log('hfkd')
    let createRole;
    const {roleCode,roleName}= req.body  

  console.log("create Role",  roleName, roleCode)

  // check if the request body is empty
  if (roleCode && roleName) {
    console.log('jfd', roleCode, roleName)

     createRole = await role.create({
      roleCode:roleCode,
      roleName:roleName
    })
    if(createRole){
      console.log('ja')

      return res.status(statusCode.SUCCESS.code).json({
        message:"Role created successfully"
      })
    }
    return res.status(statusCode.BAD_REQUEST.code).json({
      message:"Role is not created"
    })
  }
  else{
    return res.status(statusCode.BAD_REQUEST.code).json({
      message:"please provide all required details"
    })
  }
 
 
 
  } 
  catch (error) {
  return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
    message: error.message
  })
   
  }
};

//Update
const updateRole = (req, res) => {

  try {
    const  {
      roleId,
      roleCode,
      roleName,
      status,
      remark
    } = req.body;
    if (!roleId && !roleCode && !roleName) {
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "Content can not be empty!",
      });
      
    }

    const [roleDataCount,RoleDataDetails]=role.update({
      roleCode:roleCode,
      roleName:roleName
    }, {
      where: { roleId: roleId },
    })
     if(roleDataCount.length>=1){
      return res.status(statusCode.SUCCESS.code).json({
        message: "Data updated successfully",
      });
     }
     else{
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "Data is not updated successfully",
      })
     }
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message,
    })
  }
};

// view 
const viewRole = async (req,res)=>{
  try{
    let limit = (req.body.page_size) ? req.body.page_size : 50;
    let page = (req.body.page_number) ? req.body.page_number : 1;
    let offset = (page - 1) * limit;
    let showAllRoles = await role.findAll({})

    let givenReq = (req.body.givenReq) ? req.body.givenReq :null;
    if(givenReq){
      showAllRoles = showAllRoles.filter(roleData => (
        roleData.roleId.includes(givenReq)||
        roleData.roleCode.includes(givenReq)||
        roleData.roleName.includes(givenReq)
      ))

    }
    let paginatedShowAllRoles = showAllRoles.slice(offset,limit+offset) 
        return res.status(statusCode.SUCCESS.code).json({
      message: "Show All roles", Role: paginatedShowAllRoles
    })
  }
  catch(err){
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
  }
}




module.exports = {
  roleId,
  createRole,
  updateRole,
  viewRole
};
