const { sequelize, DataTypes, transaction } = require(".");


module.exports= (sequelize,DataTypes)=>{
    let bankDetail = sequelize.define('bankdetail',{
        bankDetailId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        beneficiaryName:{
            type:DataTypes.STRING(30),
        },
        accountType:{
            type:DataTypes.STRING(10)
        },
        bankName:{
            type:DataTypes.STRING(15)
        },
        accountNumber:{
            type:DataTypes.BIGINT
        },
        bankIfscCode:{
            type:DataTypes.STRING(20)
        },
        phoneNumber:{
            type:DataTypes.STRING(20)
        },
        address:{
            type:DataTypes.STRING(50)
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
    timestamps: false,

}
,
{
    timestamps:false
}
)

    return bankDetail
}