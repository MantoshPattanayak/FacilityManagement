module.exports = (sequelize,DataTypes)=>{

const cart = sequelize.define('cart',{
    cartId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
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
})
return cart
}