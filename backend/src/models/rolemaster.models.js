module.exports = (sequelize, DataTypes) => {
  const RoleMaster = sequelize.define("rolemaster", {
    // Model attributes are defined here
    roleId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleCode: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    roleName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    statusId: {
      type: DataTypes.INTEGER, // Define the column as DATE type
    },
    remarks: {
      type: DataTypes.STRING(255),
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
    createdOn: {
      type: DataTypes.DATE, // Define the column as DATE type
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"), // Set default value to current timestamp
    },
    updatedBy: {
      type: DataTypes.INTEGER,
    },
    updatedOn: {
      type: DataTypes.DATE, // Define the column as DATE type
    },
    deletedBy: {
      type: DataTypes.INTEGER,
    },
    deletedOn: {
      type: DataTypes.DATE, // Define the column as DATE type
    },
  }
  ,
  {
      timestamps:false
  }
);

  return RoleMaster;
};
