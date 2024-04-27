module.exports = (sequelize,DataTypes)=>{

    const File = sequelize.define('file',{
        fileId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        fileName:{
            type:DataTypes.STRING(80),

        },
        fileType:{
            type:DataTypes.STRING(80),

        },
        url:{
            type:DataTypes.STRING(80)
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
            defaultValue:sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedBy:{
            type:DataTypes.INTEGER
        },
        updatedDt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:sequelize.literal('CURRENT_TIMESTAMP')
        }
    })
    return File
}