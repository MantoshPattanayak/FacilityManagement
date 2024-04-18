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
      res.status(statusCode.BAD_REQUEST.code).json({
        message: "Content can not be empty!",
      });
      return;
    }

    role.update({
      roleCode:roleCode,
      roleName:roleName
    }, {
      where: { roleId: req.body.roleId },
    })
      .then((num) => {
        if (num == 1) {
          res.status(200).json({
            message: "Role was updated successfully.",
          });
        } else {
          res.status(404).json({
            message: `Cannot update Role with id=${req.params.id}. Maybe User was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error updating Role with id=" + req.params.id,
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
    throw new Error(error);
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
