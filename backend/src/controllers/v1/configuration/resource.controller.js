const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");

const QueryTypes = db.QueryTypes;
const sequelize = db.sequelize;
const resource = db.resourcemaster;

let getResourceById = async (req, res) => {
  try {
    const resourceId = req.params.id;

    let specificResource = sequelize.query(
      `select name,description,hasSubMenu,icon,iconId,iconType,orderIn,Path,status,remark from amabhoomi.resourcemaster where privateuserid= ?`,
      {
        replacements: [resourceId], // Pass the parameter value as an array
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return res
      .status(statusCode.SUCCESS.code)
      .json({ message: "Required Resource", data: specificResource });
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR.code)
      .json({ message: err.message });
  }
};
module.exports = {
  getResourceById,
};
