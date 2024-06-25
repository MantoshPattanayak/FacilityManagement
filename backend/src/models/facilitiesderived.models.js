module.exports = (sequelize,DataTypes)=>{



    const Facility = sequelize.define('facilitiesderived',{
        facilityId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        facilityname:{
            type:DataTypes.STRING(255)
        },
        ownership:{
            type:DataTypes.STRING(50)
        },
        facilityTypeId:{
            type:DataTypes.INTEGER
        },
        scheme:{
            type:DataTypes.STRING(20)
        },
        areaAcres:{
            type:DataTypes.DECIMAL
        },
        latitude:{
            type:DataTypes.DECIMAL
        },
        longitude:{
            type:DataTypes.DECIMAL
        },
        address:{
            type:DataTypes.STRING(255)
        },
        statusId:{
            type:DataTypes.INTEGER
        },
        remarks:{
            type:DataTypes.STRING(255)
        },
        operatingHoursFrom:{
            type:DataTypes.TIME
        },
        operatingHoursTo:{
            type:DataTypes.TIME
        },
        sun:{
            type:DataTypes.INTEGER
        },
        mon:{
            type:DataTypes.INTEGER
        },
        tue:{
            type:DataTypes.INTEGER
        },
        wed:{
            type:DataTypes.INTEGER
        },
        thu:{
            type:DataTypes.INTEGER
        },
        fri:{
            type:DataTypes.INTEGER
        },
        sat:{
            type:DataTypes.INTEGER
        },
        additionalDetails:{
            type:DataTypes.STRING(255)
        },
        otherGames:{
            type:DataTypes.STRING(255)
        },
        otherEventCategories:{
            type:DataTypes.STRING(255)
        },
        otherServices:{
            type:DataTypes.STRING(255)
        },
        otherAmenities:{
            type:DataTypes.STRING(255)
        },
        ownershipDetailId:{
            type:DataTypes.INTEGER
        },
        pin:{
            type:DataTypes.INTEGER
        },
        createdBy:{
            type:DataTypes.INTEGER
        },
        createdDt: {
            type: DataTypes.DATE, // Define the column as DATE type
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Set default value to current timestamp
        },
        updatedBy:{
            type:DataTypes.INTEGER
        },
        updatedDt: {
            type: DataTypes.DATE // Define the column as DATE type
        },
      
    
    }
    ,
    {
        timestamps:false
    }
    
    )
    return Facility;
    }