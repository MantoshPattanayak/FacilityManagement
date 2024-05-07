const { sequelize, DataTypes, transaction } = require(".");


module.exports= (sequelize,DataTypes)=>{
    let bankDetail = sequelize.define('bankdetail',{
        bankDetailId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        beneficiaryName:{
            type:DataTypes.STRING,
        },
        accountType:{
            type:DataTypes.STRING
        },
        bankName:{
            type:DataTypes.STRING
        },
        accountNumber:{
            type:DataTypes.STRING
        },
        bankIfscCode:{
            type:DataTypes.STRING
        },
        phoneNumber:{
            type:DataTypes.STRING
        },
        address:{
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
        upadatedDt:{
            type:DataTypes.DATE
        }
    },
{
})

    return bankDetail
}