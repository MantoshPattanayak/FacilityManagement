module.exports = (sequelize, DataTypes) => {

    const HostEventDetails = sequelize.define('hosteventdetails', {
        // Model attributes are defined here
        hostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        eventId: {
            type: DataTypes.INTEGER,
        },
        firstName: {
            type: DataTypes.STRING(20),
        },
        lastName: {
            type: DataTypes.STRING(20),
        },
        pancardNumber: {
            type: DataTypes.STRING(30),
            collate: 'utf8mb4_0900_ai_ci'
        },
        emailId: {
            type: DataTypes.STRING(100),
        },
        phoneNo: {
            type: DataTypes.STRING(25),
        },
        userId: {
            type: DataTypes.INTEGER,
        },
       
        organisationName: {
            type: DataTypes.STRING(25),
        },
        category: {
            type: DataTypes.INTEGER,
        },
        organisationAddress: {
            type: DataTypes.STRING(50),
        },
        eventDate: {
            type: DataTypes.DATE,
        },
        eventStartDate: {
            type: DataTypes.DATE,
        },
        eventEndDate: {
            type: DataTypes.DATE,
        },
        Description: {
            type: DataTypes.TEXT,
        },
        emailVerified:{
            type:DataTypes.INTEGER
        },
        statusId: {
            type: DataTypes.INTEGER,
        },
        createdBy: {
            type: DataTypes.INTEGER,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
        },
        createdDt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
        },
        updatedDt: {
            type: DataTypes.DATE,
        }
    }
    ,
    {
        timestamps:false
    }
);
    return HostEventDetails
}