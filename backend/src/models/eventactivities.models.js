module.exports = (sequelize,DataTypes)=>{

const EventMasters = sequelize.define('eventactivities',{
    eventId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    facilityMasterId:{
        type:DataTypes.INTEGER
    },
    eventName:{
        type:DataTypes.STRING(50)
    },
    eventCategory:{
        type:DataTypes.STRING(255)
    },
    locationName:{
        type:DataTypes.STRING
    },
    eventDate:{
        type:DataTypes.DATE
    },
    eventStartTime:{
        type:DataTypes.DATE
    },
    eventEndTime:{
        type:DataTypes.DATE
    },
    descriptionOfEvent:{
        type:DataTypes.STRING(255)
    },
    ticketSalesEnabled:{
        type:DataTypes.BOOLEAN
    },
    ticketPrice:{
        type:DataTypes.DECIMAL
    },
    eventImagePath:{
        type:DataTypes.STRING(255)
    },
    additionalFilesPath:{
        type:DataTypes.STRING(255)
    },
    status:{
        type:DataTypes.INTEGER
    },
    remarks:{
        type:DataTypes.STRING(255)
    },
    additionalDetails:{
        type:DataTypes.STRING(255)
    },
    createdBy:{
        type:DataTypes.INTEGER
    },
    createdOn: {
        type: DataTypes.DATE, // Define the column as DATE type
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
    },
    updatedBy:{
        type:DataTypes.INTEGER
    },
    updatedOn: {
        type: DataTypes.DATE // Define the column as DATE type
    },
    deletedBy:{
        type:DataTypes.INTEGER
    },
    deletedOn: {
        type: DataTypes.DATE // Define the column as DATE type
    }

})
return EventMasters
}