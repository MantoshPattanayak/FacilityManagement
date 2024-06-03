module.exports = (sequelize,DataTypes)=>{

const InventoryFacilities = sequelize.define('inventoryfacilities',{
    equipmentfacilityId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    facilityId:{
        type:DataTypes.INTEGER

    },
    equipmentId:{
        type:DataTypes.INTEGER
    },
    count:{
        type:DataTypes.INTEGER
    },
    status:{
        type:DataTypes.INTEGER
    },
    remarks:{
        type:DataTypes.STRING
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


}
,
{
    timestamps:false
}

)
return InventoryFacilities
}