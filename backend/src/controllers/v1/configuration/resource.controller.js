const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const resource = db.resourcemaster;
const Sequelize = db.Sequelize

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
      parentResourceId,
      remarks,
    } = req.body;
    // check if the request body is empty
    // if (
    //   name &&
    //   description &&
    //   hasSubMenu &&
    //   icon &&
    //   iconId &&
    //   iconType &&
    //   orderIn &&
    //   path &&
    //   status &&
    //   remarks
    // ) {
      createResource = await resource.create({
        name: name,
        description: description,
        hasSubMenu: hasSubMenu,
        icon: icon,
        iconId: iconId,
        iconType: iconType,
        orderIn: orderIn,
        path: path,
        statusId: status,
        remarks: remarks,
        parentResourceId:parentResourceId
      });
      if (createResource) {
        return res.status(statusCode.SUCCESS.code).json({
          message: "Resource created successfully",
        });
      }
      return res.status(statusCode.BAD_REQUEST.code).json({
        message: "Resource is not created",
      });
    // } else {
    //   return res.status(statusCode.BAD_REQUEST.code).json({
    //     message: "please provide all required details",
    //   });
    // }
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message,
    });
  }
};
const updateResource = async (req, res) => {
  try {
    console.log('21')
    const {
      resourceId,
      name,
      description,
      hasSubMenu,
      orderIn,
      path,
      statusId,
      parentResourceId,
      isParent
    } = req.body;

    let params={}
    
    let findResourcWithTheGivenId = await resource.findOne({
      where:{
        resourceId:resourceId
      }
    })
    
    if(findResourcWithTheGivenId.name!=name){
      console.log('1')
      params.name=name
    }
    else if(findResourcWithTheGivenId.description!=description){
      params.description=description
    }
    else if(findResourcWithTheGivenId.parentResourceId!=parentResourceId && isParent){
      params.parentResourceId = parentResourceId
    }
    else if(findResourcWithTheGivenId.hasSubMenu!=hasSubMenu){
      params.hasSubMenu = hasSubMenu

    }
    else if(findResourcWithTheGivenId.path!=path){
      params.path = path
    }
    else if(findResourcWithTheGivenId.orderIn!=orderIn){
      params.orderIn = orderIn
    }
    else if(findResourcWithTheGivenId.statusId != statusId){
      params.statusId = statusId
    }

// console.log('resource',findResourcWithTheGivenId)

    let [updateResourceCount,updateResourceData] =  await resource
    .update(
      params,
      {
        where: { resourceId: resourceId }
      }
    )

    if(updateResourceCount>=0){
      return res.status(statusCode.SUCCESS.code).json({
        message:"Data is updated successfully"
      })
    }
    else{
      return res.status(statusCode.BAD_REQUEST.code).json({
        message:"Data is not updated "
      })
    }

    
    console.log(updateResourceData,'fsdfsd',updateResourceCount)

     
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
    console.log('1')
    let [showAllResources] = await sequelize.query(`    
    SELECT 
    rm.resourceId, 
    rm.name, 
    rm.description, 
    rm.hasSubMenu, 
    rm.parentResourceId, 
    rm1.name as parentResourceName, 
    rm.orderIn as 'order',  
    rm.path, 
    sm.statusCode as status
FROM 
    amabhoomi.resourcemasters rm  
LEFT JOIN 
    amabhoomi.resourcemasters rm1 ON rm.parentResourceId = rm1.resourceId  
INNER JOIN 
    amabhoomi.statusmasters sm ON sm.statusId = rm.statusId 
ORDER BY 
    rm.resourceId DESC

    `);

  console.log(showAllResources,'all resources')
    let givenReq = req.body.givenReq ? req.body.givenReq : null;
    if (givenReq) {
      showAllResources = showAllResources.filter(
        (resourceData) =>
          resourceData.resourceId.includes(givenReq) ||
          resourceData.name.toLowerCase().includes(givenReq)
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


let dataLoadResource = async (req, res) => {
  let client;
  try {
      try {
          const query1 = await resource.findAll({
            attributes: [
              [Sequelize.fn('DISTINCT', Sequelize.col('parentResourceId')), 'parentResourceId']
              // Replace 'columnName' with the actual column name you want to find distinct values for
            ]
          });
          const query2 = await resource.findAll({
            attributes: [
              [Sequelize.fn('DISTINCT', Sequelize.col('hasSubMenu')), 'hasSubMenu']
              // Replace 'columnName' with the actual column name you want to find distinct values for
            ]
          });
          const query3 = await resource.findAll({
            attributes: [
              [Sequelize.fn('DISTINCT', Sequelize.col('icon')), 'icon']
              // Replace 'columnName' with the actual column name you want to find distinct values for
            ]
          });
          const query4 = await resource.findAll({
            attributes: [
              [Sequelize.fn('DISTINCT', Sequelize.col('statusId')), 'statusId']
              // Replace 'columnName' with the actual column name you want to find distinct values for
            ]
          });


          res.status(statusCode.SUCCESS.code).json({ parentResourceId: query1, hasSubMenu: query2, icon: query3, status: query4 });

      } catch (err) {
          res.status(statusCode.UNAUTHORIZED.code).json({ message: err.message });
      }
  } catch (e) {
      res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: e.message });
  }
  finally {
      // Always release the connection, whether there was an error or not
      if (client) {
          client.release();
      }
  }
}


let isParent = async (req, res) => {
  let client;
  try {
    
      const query1 = await resource.findAll({
        where: {
          parentResourceId: null
        },
        order: [
          ['orderIn', 'ASC']
        ]
      });    

  if (query1.length> 0) {
          res.status(statusCode.SUCCESS.code).json({ message: 'parent data', data: query1 });
      }
  } catch (err) {
      res.status(statusCode.UNAUTHORIZED.code).json({ message: err.message });
  }
  finally {
      // Always release the connection, whether there was an error or not
      if (client) {
          client.release();
      }
  }
}

module.exports = {
  resourceId,
  createResource,
  updateResource,
  viewResources,
  dataLoadResource,
  isParent
};
