module.exports = (sequelize, DataTypes) => {

    const facilitytariff = sequelize.define('facilitytariffmaster', {
        // Model attributes are defined here
        tariffMasterId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        facilityId: {
            type: DataTypes.INTEGER,

        },
        operatingHoursFrom: {
            type: DataTypes.TIME,
     
        },
        operatingHoursTo: {
            type: DataTypes.TIME,

        },
        sun: {
            type: DataTypes.INTEGER,
  
        },
        mon: {
            type: DataTypes.INTEGER,
      
        },
        tue: {
            type: DataTypes.INTEGER,
  
        },
        wed: {
            type: DataTypes.INTEGER,
    
        },
        thu: {
            type: DataTypes.INTEGER,
     
        },
        fri:{
            type: DataTypes.INTEGER,

        },
        sat:{
            type: DataTypes.INTEGER,
        },
        statusId: {
            type: DataTypes.INTEGER,
        },
        amount: {
            type: DataTypes.DOUBLE,
            defaultValue: null
        },
        remarks: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        validityFrom:{
            type:DataTypes.DATE
        },
        validityTo:{
            type:DataTypes.DATE
        },
        createdBy: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        createdDt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        updatedDt: {
            type: DataTypes.DATE,
            defaultValue: null
        }
    
    }
    ,
    {
        timestamps:false
    }


);
    return facilitytariff
}