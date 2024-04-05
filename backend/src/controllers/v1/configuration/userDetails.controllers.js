const { sequelize,Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const decrypt  = require('../../../middlewares/decryption.middlewares')
const encrypt = require('../../../middlewares/encryption.middlewares')
const user =db.privateuser

let viewList = async (req,res)=>{
    try{
        let getAllUsers = await sequelize.query(`select count(*) over() as totalCount,
         pu.privateUserId,pu.title,pu.fullName,pu.emailId,pu.userName,pu.contactNo, rm.roleName,sm.status
         from amabhoomi.rolemaster rm left join amabhoomi.privateuser pu on pu.roleid = rm.id
         inner join with statusmaster sm on sm.statusId = rm.status`,{ type: Sequelize.QueryTypes.SELECT})

         let findAllUsers = getAllUsers.map((userData)=>({
            privateUserId:userData.privateUserId,
            title:encrypt(userData.title),
            fullName:encrypt(userData.fullName),
            emailId:encrypt(userData.emailId),
            userName:encrypt(userData.userName),
            contactNo:encrypt(userData.contactNo),
            roleName:userData.roleName,
            status:userData.status
         }))
         
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
        
            const pwdFlag = false;
        
            const { title, fullName, userName, password, mobileNumber, emailId, role, status, gender } = req.body;

            const decryptTitle = decrypt(title);
            const decryptfullName = decrypt(fullName);
            const decryptUserName= decrypt(userName);
            const decryptPassword = decrypt(password);
            const decryptMobileNumber = decrypt(mobileNumber);
            const decryptemailId = decrypt(emailId);
       

            const salt = 5;
            const createdBy = req.user.id||1;
            const updatedBy = req.user.id||1;
            console.log('1')
            const existingUserMobile = await UserMaster.findOne({ where: { contactNo: mobileNumber } });
            const existingUserEmail = await UserMaster.findOne({ where: { emailId: emailId } });
            const existingUserName = await UserMaster.findOne({ where: { userName: userName } });
        
            if (existingUserMobile) {
                return res.status(statusCode.CONFLICT.code).json({ message: "User already exist same contact_no" })
            } else if (existingUserEmail) {
                return res.status(statusCode.CONFLICT.code).json({ message: "User already exist same email_id" })
            } else if (existingUserName) {
                return res.status(statusCode.CONFLICT.code).json({ message: "User already exist same user_name" })
            } else {
              const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds for hashing
        
              const newUser = await UserMaster.create({
                title:title, fullName: fullName, contactNo: mobileNumber, emailId: emailId,
                userName: userName, password: hashedPassword, changePwdFlag: pwdFlag,
                roleId: role, statusId: status, genderId: gender,
                createdDt: new Date(), createdBy: createdBy, updatedDt: new Date(), updatedBy: updatedBy
              });
        
        
              
                  return res.status(statusCode.SUCCESS.code).json({ message: "User created successfully " });
                }
             } catch (err) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message:err.message})

             }

}
  

let updateUserData = async (req,res)=>{
    try{
        const { title, fullName, userName, mobileNumber, emailId, role, status, gender } = req.body;
        const decryptTitle = decrypt(title);
        const decryptFullName = decrypt(fullName)
        const decryptUserName = decrypt(userName)
        const decryptMobileNumber = decrypt(mobileNumber)
        const decryptEmailId = decrypt(emailId);

        let updatedValueObject ={};

        const getUser = await user.findOne({
            where:{
                userName:userName
            }
        })

        if(getUser){
            if(decrypt(getUser.fullName)!=decryptFullName){
                updatedValueObject.fullName = fullName
            }
            if(decrypt(getUser.userName)!=decryptUserName){
                updatedValueObject.userName = userName
            }
            if(decrypt(getUser.contactNo)!=decryptMobileNumber){
                let checkIsMobileAlreadyPresent = await user.findOne({
                    where:{
                        contactNo:mobileNumber
                    }
                  })
                  if(checkIsMobileAlreadyPresent){
                    return res.status(statusCode.CONFLICT.code).json({
                        message:"This mobile no is already assigned to a existing user"
                    })
                  }
                updatedValueObject.mobileNo=mobileNumber
            }
            if(decrypt(getUser.title)!=decryptTitle){
                updatedValueObject.title = title
            }
             if(decrypt(getUser.emailId)!=decryptEmailId){

              let checkIsEmailAlreadyPresent = await user.findOne({
                where:{
                    emailId:emailId
                }
              })
              if(checkIsEmailAlreadyPresent){
                return res.status(statusCode.CONFLICT.code).json({
                    message:"This email id is already assigned to a existing user"
                })
              }
                updatedValueObject.emailId = emailId
            }
            if(getUser.roleId!=role){
                updatedValueObject.roleId = role
            }
            if(getUser.statusId != status){
                updatedValueObject.statusId = status
            }
            if(getUser.gender!=gender){
                updatedValueObject.gender = gender
            }

            let [updatedValueCounts,updatedMetaData ] = await user.update(updatedValueObject,{
                where:{
                    privateUserId:getUser.privateUserId
                }
            })
            if(updatedValueCounts>0){
                return res.status(statusCode.SUCCESS.code).json({ message:"User record is updated successfully"})

            }
            return res.status(statusCode.FORBIDDEN.code).json({ message:"User record is updated successfully"})


        }
        else{
            return res.status(statusCode.BAD_REQUEST.code).json({ message:"This user doesn't  exist in our record"})

        }
        

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
        
       let userEncryptedData = specificUser.map((user)=>({
            title: encrypt(user.title),
            fullName:encrypt(user.fullName),
            emailId:encrypt(user.emailId),
            userName:encrypt(user.userName),
            contactNo:encrypt(user.contactNo),
            roleId:roleId,
            statusId:statusId,
            genderId:genderId

        }))
        return res.status(statusCode.SUCCESS.code).json({ message: "Required User", data: userEncryptedData }); 
    }
    catch(err){
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message:err.message})

    }
}

let fetchInitialData = async (req,res)=>{
    try{
        let roleData = await sequelize.query(`select  roleId, roleCode, roleName from amabhoomi.rolemaster `,{type: Sequelize.QueryTypes.SELECT})

        let statusData = await sequelize.query(`select status,statusCode, description from amabhoomi.statusmaster`,{type: Sequelize.QueryTypes.SELECT})

        let genderData = await sequelize.query(`select gender, code, description from amabhoomi.gendermaster`,{type: Sequelize.QueryTypes.SELECT})

        roleData = roleData.map(role=>({
            roleId:role.roleId,
            roleName:encrypt(role.roleName),
            roleCode:encrypt(role.roleCode)
        }))

        genderData = genderData.map(genderValue=>({
            gender:genderValue.gender,
            code:encrypt(genderValue.code),
            description:encrypt(genderValue.description)


        }))

        statusData = statusData.map(statusData=>({
            status:statusData.status,
            statusCode:encrypt(statusData.statusCode),
            description:encrypt(statusData.description)
        }))

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


module.exports = {
    viewList,
    createUser,
    updateUserData,
    getUserById,
    fetchInitialData

}