module.exports = (sequelize,DataTypes)=>{

    const cartItem = sequelize.define('cartItem',{
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
        entityTypedId:{
            type:DataTypes.INTEGER
        },
        facilityPreferences:{
            type:DataTypes.JSON
        },
        totalMembers:{
            type:DataTypes.INTEGER
        },
        activityPreference:{
            type:DataTypes.STRING(255)
        },
        otherActivities:{
            type:DataTypes.STRING(255)
        },
        bookingDate:{
            type:DataTypes.DATE
        },
        startTime:{
            type:DataTypes.TIME
        },
        endTime:{
            type:DataTypes.TIME
        },
        duration:{
            type:DataTypes.TIME
        },
        playersLimit:{
            type:DataTypes.INTEGER
        },
        sports:{
            type:DataTypes.INTEGER
        },
        price:{
            type:DataTypes.DECIMAL

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