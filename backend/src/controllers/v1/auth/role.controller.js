const db = require("../../../models/index");
const statusCode = require("../../../utils/statusCode");

const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;

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
const createRole = (req, res) => {
  // store the request body in a user object
  const role = {
    roleId: req.body.roleId,
    roleCode: req.body.roleCode,
    roleName: req.body.roleName,
    status: req.body.status,
    remark: req.body.remark,
  };

  // check if the request body is empty
  if (
    !createRole.roleId ||
    !createRole.roleCode ||
    !createRole.roleName ||
    !createRole.status ||
    !createRole.remark
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Save User in the database
  try {
    User.create(role)
      .then((role) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        res.status(500).json({
          message:
            err.message || "Some error occurred while creating the Role.",
        });
      });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Some internal error occurred while creating the Role.",
    });
    throw new Error(error);
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
