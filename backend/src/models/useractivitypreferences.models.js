const { INTEGER } = require("sequelize")

module.exports = (sequelize,DataTypes)=>{

    let userActivityPreferences = sequelize.define('useractivitypreference',{
        userActivityId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        publicUserId:{
            type:DataTypes.INTEGER
        },
        userActivityId:{
            type:DataTypes.INTEGER
        },
        statusId:{
            type:DataTypes.INTEGER
        },
        createdBy:{
            type:DataTypes.INTEGER
        },
        createdDt:{
            type:DataTypes.DATE
        },
        updatedBy:{
            type:DataTypes.INTEGER
        },
        updatedDt:{
            type:DataTypes.DATE
        }
    })
    return userActivityPreferences
}