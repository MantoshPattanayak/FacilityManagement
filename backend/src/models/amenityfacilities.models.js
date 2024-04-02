module.exports = (sequelize,DataTypes)=>{


const FacilityAmenity = sequelize.define('facilityamenities',{
    amenityfacilityId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    facilityId:{
        type:DataTypes.INTEGER
    },
    amenityId:{
        type:DataTypes.INTEGER
    },
    status:{
        type:DataTypes.INTEGER
    },
    remarks:{
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
return FacilityAmenity
}