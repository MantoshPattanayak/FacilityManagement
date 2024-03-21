const {Sequelize,DataTypes} = require('sequelize')
const sequelize = new Sequelize('sqlite::memory')

const PaymentMethod = sequelize.define('paymentmethod',{
    methodId : {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    methodName:{
        type:DataTypes.STRING(50)
    },
    description:{
        type:DataTypes.STRING(255)
    },
    isEnabled:{
        type:DataTypes.BOOLEAN(80)
    }


})