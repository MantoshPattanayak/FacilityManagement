const { sequelize,Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')

let viewList = async (req,res)=>{
    try{
        let getAllUsers = await sequelize.query(`select count(*) over() as totalCount,
         pu.privateUserId,pu.title,pu.fullName,pu.emailId,pu.userName,pu.contactNo, rm.role,sm.status
         from amabhoomi.rolemaster rm left join amabhoomi.privateuser pu on pu.roleid = rm.id
         inner join with statusmaster sm on sm.statusId = rm.status`,{ type: Sequelize.QueryTypes.SELECT})
        return res.status(statusCode.SUCCESS.code).json({
            message:'All users data',data:getAllUsers
        })
    }
    catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message:err.message})

}
}

let createUser = async (req,res)=>{
    try{
        

    }
    catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message:err.message})

    }
}

let updateUserData = async (req,res)=>{
    try{

    }
    catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message:err.message})

    }
}

let getUserById = async (req,res)=>{
    try{
        const userId = req.params.id;

        let specificUser = sequelize.query(`select title,fullName,emailId,userName,contactNo,roleId,statusId,genderId from amabhoomi.privateuser where privateuserid= ?`,{
        replacements: [userId], // Pass the parameter value as an array
        type: Sequelize.QueryTypes.SELECT
        }
    );
    
        res.status(statusCode.SUCCESS.code).json({ message: "Required User", data: specificUser.rows }); 
    }
    catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message:err.message})

    }
}

let fetchInitialData = async (req,res)=>{
    try{
        let roleData = await sequelize.query(`select  roleId, code,Description from rolemaster  `,{type: Sequelize.QueryTypes.SELECT})

        let statusData = await sequelize.query(`select status,code, description from statusmaster`,{type: Sequelize.QueryTypes.SELECT})

        let genderData = await sequelize.query(`select gender,code, description from gendermaster`,{type: Sequelize.QueryTypes.SELECT})

        return res.status(statusCode.SUCCESS.code).json({
            message:"All initial data to be populated in the dropdown",
            Role: roleData, 
            Status: statusData,
            gender: genderData
        })

    }
    catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message:err.message})

    }
}