module.exports = (sequelize,DataTypes)=>{
    let ownershipDetails = sequelize.define('ownershipdetails',{
        ownershipDetailId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        firstName:{
            type:DataTypes.STRING
        },
        lastName:{
            type:DataTypes.STRING
        },
        phoneNo:{
            type:DataTypes.INTEGER
        },
        emailId:{
            type:DataTypes.STRING
        },
        ownerPanCardNumber:{
            type: DataTypes.STRING(30),
            collate: 'utf8mb4_0900_ai_ci'
        },
        ownerAddress:{
            type:DataTypes.STRING
        },
        statusId:{
            type:DataTypes.INTEGER
        },
        isFacilityByBda:{
            type:DataTypes.INTEGER
        },
        remarks:{
            type:DataTypes.STRING
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
        updatedDt:{
            type:DataTypes.DATE
        }
    },
    
{
    timestamps:false
}

)
return ownershipDetails
}