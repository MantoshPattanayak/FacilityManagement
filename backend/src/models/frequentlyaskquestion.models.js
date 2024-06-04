module.exports = (sequelize, DataTypes) => {
  const FAQ = sequelize.define("faq", {
    // Model attributes are defined here
    faqId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    facilityTypeId: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    questionInEnglish: {
      type: DataTypes.STRING(255),
    },
    answerInEnglish: {
      type: DataTypes.STRING(255),
    },
    questionInOdia: {
      type: DataTypes.STRING(255),
    },
    answerInOdia: {
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
  return FAQ;
};
