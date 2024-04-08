const db = require("../../../models/index");
const statusCode = require("../../../utils/statusCode");

const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const role = db.rolemaster
//get
const roleId = async (req, res) => {
  try {
    const [rolemasters, metadata] = await sequelize.query(
      "select * from amabhoomi.rolemasters "
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
      console.log('ja',createRole)
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
  const role = {
    roleId: req.body.roleId,
    roleCode: req.body.roleCode,
    roleName: req.body.roleName,
    status: req.body.status,
    remark: req.body.remark,
  };
  if (!role.roleId || !role.roleCode || !role.roleName) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  try {
    User.update(role, {
      where: { id: req.params.id },
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

module.exports = {
  roleId,
  createRole,
  updateRole,
};
