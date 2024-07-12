module.exports = (sequelize,DataTypes)=>{


const InventoryMaster = sequelize.define('inventorymaster',{
    equipmentId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    code:{
        type:DataTypes.STRING(50)
    },
    description:{
        type:DataTypes.STRING(255)
    },
    equipmentAvailable:{
        type:DataTypes.INTEGER
    },
    statusId:{
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
return InventoryMaster
}