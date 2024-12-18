module.exports = (sequelize,DataTypes)=>{
    let facilityEvent = sequelize.define('facilityevents',{
        facilityEventId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        eventCategoryId:{
            type:DataTypes.INTEGER,
    
        },
        facilityId:{
            type:DataTypes.INTEGER
        },
        statusId:{
            type:DataTypes.INTEGER
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
        updatedDt:{
            type:DataTypes.DATE
        }
    },
    {
        timestamps:false
    }
)
    
    return facilityEvent
    
    }
    