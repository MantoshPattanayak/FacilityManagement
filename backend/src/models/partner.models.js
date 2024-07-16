module.exports = (sequelize,DataTypes)=>{
    let partnerus = sequelize.define('partneru',{
       partnerId:{
           type:DataTypes.INTEGER,
           primaryKey:true,
           autoIncrement:true
       },
       fullName:{
           type:DataTypes.STRING
       },
       emailId:{
           type:DataTypes.STRING
       },
       mobileNo:{
           type:DataTypes.BIGINT
       },
       message:{
           type:DataTypes.TEXT
       },
       statusId:{
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
   })
    return partnerus
   }