module.exports = (sequelize,DataTypes)=>{

    let rateLimiter = sequelize.define('ratelimiter',{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        key:{
            type:DataTypes.STRING,
            allowNull:false
        },
        points: {
            type: DataTypes.INTEGER,

        },

        expiry:{
            type:DataTypes.DATE,
            allowNull:false,
        },
    },{
        timestamps:false,
    }

    )

    return rateLimiter

}