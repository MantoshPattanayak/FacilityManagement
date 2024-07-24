module.exports = (sequelize, DataTypes) => {

  const usermaster = sequelize.define('usermaster', {
    // Model attributes are defined here
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255)
    },
    fullName: {
      type: DataTypes.STRING(255),
    },
    firstName: {
      type: DataTypes.STRING(255),
    },
    middleName: {
      type: DataTypes.STRING(255)
      // allowNull defaults to true
    },
    lastName: {
      type: DataTypes.STRING(255)
      // allowNull defaults to true
    },
    userName: {
      type: DataTypes.STRING(255)
    },
    password: {
      type: DataTypes.STRING(255)
    },
    phoneNo: {
      type: DataTypes.STRING(255)
    },
    emailId: {
      type: DataTypes.STRING(255)
    },
    profilePicture: {
      type: DataTypes.STRING(255)
    },
    language: {
      type: DataTypes.STRING(255)
    },
    lastLogin: {
      type: DataTypes.DATE // Define the column as DATE type
    },
    statusId: {
      type: DataTypes.INTEGER // Define the column as DATE type
    },
    verifyEmail: {
      type: DataTypes.INTEGER
    },
    location: {
      type: DataTypes.STRING(255)
    },
    remarks: {
      type: DataTypes.STRING(255)
    },
    googleId: {
      type: DataTypes.STRING
    },
    facebookId: {
      type: DataTypes.STRING
    },
    changePwdFlag: {
      type: DataTypes.BOOLEAN
    },
    roleId: {
      type: DataTypes.INTEGER
    },
    genderId: {
      type: DataTypes.INTEGER
    },
    isEntity: {
      type: DataTypes.INTEGER
    },
    userRegistrationNumber: {
      type: DataTypes.STRING(255)
    },
    createdBy: {
      type: DataTypes.INTEGER
    },
    createdDt: {
      type: DataTypes.DATE, // Define the column as DATE type
    },
    updatedBy: {
      type: DataTypes.INTEGER
    },
    updatedDt: {
      type: DataTypes.DATE // Define the column as DATE type
    }

  }
    ,
    {
      timestamps: false
    }
  );

  return usermaster
}