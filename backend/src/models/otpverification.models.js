const { transaction } = require(".")

module.exports = (sequelize,DataTypes)=>{
    let otpverifcation = sequelize.define('otpverification',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        code:{
            type:DataTypes.STRING
        },
        expiryTime:{
            type:DataTypes.DATE
        },
        verified:{
            type:DataTypes.INTEGER
        },
        mobileNo:{
            type:DataTypes.INTEGER
        },
        createdDt:{
            type:DataTypes.DATE,
        }
      
    
    })
    return otpverifcation
}


