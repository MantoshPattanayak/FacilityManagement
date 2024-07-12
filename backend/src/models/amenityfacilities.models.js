module.exports = (sequelize,DataTypes)=>{


const FacilityAmenity = sequelize.define('facilityamenities',{
    amenityFacilityId:{
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
    statusId:{
        type:DataTypes.INTEGER
    },
    remarks:{
        type:DataTypes.STRING(255)
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
    deletedBy:{
        type:DataTypes.INTEGER
    },
    deletedOn: {
        type: DataTypes.DATE // Define the column as DATE type
    }

}
,
{
    timestamps:false
}
)
return FacilityAmenity
}