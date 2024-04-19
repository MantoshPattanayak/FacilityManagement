const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const resource = db.resourcemaster;

const resourceId = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id : null;
    const resourcemasters = await resource.findAll({
      where: {
        resourceId: id,
      },
    });
    return res.status(statusCode.SUCCESS.code).json({
      message: ` resource w.r.t  resourceid`,
      data: resourcemasters,
    });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};
const createResource = async (req, res) => {
  try {
    let createResource;
    const {
      name,
      description,
      hasSubMenu,
      icon,
      iconId,
      iconType,
      orderIn,
      path,
      status,
      remarks,
    } = req.body;
    // check if the request body is empty
    if (
      name &&
      description &&
      hasSubMenu &&
      icon &&
      iconId &&
      iconType &&
      orderIn &&
      path &&
      status &&
      remarks
    ) {
      createResource = await resource.create({
        name: name,
        description: description,
        hasSubMenu: hasSubMenu,
        icon: icon,
        iconId: iconId,
        iconType: iconType,
        orderIn: orderIn,
        path: path,
        status: status,
        remarks: remarks,
      });
      if (createResource) {
        return res.status(statusCode.SUCCESS.code).json({
          message: "Resource created successfully",
        });
      }
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "Resource is not created",
      });
    } else {
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "please provide all required details",
      });
    }
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message,
    });
  }
};
const updateResource = (req, res) => {
  try {
    const {
      resourceId,
      name,
      description,
      hasSubMenu,
      icon,
      iconId,
      iconType,
      orderIn,
      path,
      status,
      remarks,
    } = req.body;

    if (
      !resourceId ||
      (!name &&
        !description &&
        !hasSubMenu &&
        !icon &&
        !iconId &&
        !iconType &&
        !orderIn &&
        !path &&
        !status &&
        !remarks)
    ) {
      return res.status(statusCode.BAD_REQUEST.code).json({
        message:
          "Invalid request. Please provide resourceId and at least one field to update.",
      });
    }

    resource
      .update(
        {
          name: name,
          description: description,
          hasSubMenu: hasSubMenu,
          icon: icon,
          iconId: iconId,
          iconType: iconType,
          orderIn: orderIn,
          path: path,
          status: status,
          remarks: remarks,
        },
        {
          where: { resourceId: resourceId },
        }
      )
      .then((num) => {
        if (num == 1) {
          return res.status(statusCode.SUCCESS.code).json({
            message: "Resource was updated successfully.",
          });
        } else {
          return res.status(statusCode.NOT_FOUND.code).json({
            message: `Cannot update Resource with id=${resourceId}. Maybe Resource was not found or request body is empty.`,
          });
        }
      })
      .catch((err) => {
        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
          message: "Error updating Resource with id=" + resourceId,
          error: err.message,
        });
      });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const viewResources = async (req, res) => {
  try {
    let limit = req.body.page_size ? req.body.page_size : 50;
    let page = req.body.page_number ? req.body.page_number : 1;
    let offset = (page - 1) * limit;
    let showAllResources = await resource.findAll({});
    let givenReq = req.body.givenReq ? req.body.givenReq : null;
    if (givenReq) {
      showAllResources = showAllResources.filter(
        (resourceData) =>
          resourceData.resourceId.includes(givenReq) ||
          resourceData.name.includes(givenReq)
      );
    }
    let paginatedshowAllResources = showAllResources.slice(
      offset,
      limit + offset
    );
    return res.status(statusCode.SUCCESS.code).json({
      message: "Show All resources",
      Resource: paginatedshowAllResources,
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message,
    });
  }
};

module.exports = {
  resourceId,
  createResource,
  updateResource,
  viewResources,
};
