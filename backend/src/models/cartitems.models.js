
module.exports = (sequelize,DataTypes)=>{

     const cartItem = sequelize.define('cartitem',{
        cartItemId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        cartId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        entityId:{
            type:DataTypes.INTEGER
        },
        entityTypeId:{
            type:DataTypes.INTEGER
        },
        facilityPreference:{
            type:DataTypes.JSON
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
    
    
    },
    {
        timestamps:false
    })

    return cartItem
    }


