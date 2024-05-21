
module.exports = (sequelize,DataTypes)=>{
    const Fileattachment = sequelize.define('fileattachment',{ 
        attachmentId:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        entityId:{
            type:DataTypes.INTEGER
        },
        entityType:{
            type:DataTypes.STRING(180)
        },
        fileId:{
            type:DataTypes.INTEGER
        },
        filePurpose:{
            type:DataTypes.STRING
        },
        statusId:{
            type:DataTypes.INTEGER
        },
        createdBy:{
            type:DataTypes.INTEGER
        },
        createdDt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:sequelize.literal("CURRENT_TIMESTAMP")
        },
        updatedBy:{
            type:DataTypes.INTEGER

        },
        updatedDt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:sequelize.literal("CURRENT_TIMESTAMP")
        }

            
    }
    ,
    {
        timestamps:false
    }  
    )
    return Fileattachment
}