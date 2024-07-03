module.exports =(sequelize,DataTypes)=>{
    let eventactivities = sequelize.define('eventactivities',{
        eventId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        facilityId:{
            type:DataTypes.INTEGER
        },
        eventName:{
            type:DataTypes.STRING(50)
        },
        eventCategoryId:{
            type:DataTypes.INTEGER
        },
        locationName:{
            type:DataTypes.STRING(255)
        },
        eventDate:{
            type:DataTypes.DATEONLY
        },
        eventStartTime:{
            type:DataTypes.TIME
        },
        eventEndTime:{
            type:DataTypes.TIME
        },
        descriptionOfEvent:{
            type:DataTypes.TEXT('medium')
        },
        ticketSalesEnabled:{
            type:DataTypes.INTEGER
        },
        ticketPrice:{
            type:DataTypes.DECIMAL
        },
        eventImagePath:{
            type:DataTypes.STRING(255)
        },
        additionalFilePath:{
            type:DataTypes.STRING(255)
        },
        statusId:{
            type:DataTypes.INTEGER
        },
        additionalDetails:{
            type:DataTypes.STRING(255)
        },   
        createdBy:{
            type:DataTypes.INTEGER
        },
        updatedBy:{
            type:DataTypes.INTEGER

        },
        createdDt:{
            type:DataTypes.DATE
        },
        upadatedDt:{
            type:DataTypes.DATE
        }
    },
{
    timestamps: false,

}

)
return eventactivities
}
