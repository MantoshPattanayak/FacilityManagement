module.exports = (sequelize,DataTypes)=>{
    let Device = sequelize.define('device',{
        deviceId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            // autoIncrement:true
        },
        sessionId:{
            type:DataTypes.INTEGER

        },
        deviceName:{
            type:DataTypes.STRING
        },
        deviceType:{
            type:DataTypes.STRING
        }
    })
    return Device
}