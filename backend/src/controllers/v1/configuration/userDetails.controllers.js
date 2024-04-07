const { sequelize,Sequelize } = require('../../../models')
const statusCode = require('../../../utils/statusCode')
const db = require('../../../models')
const decrypt  = require('../../../middlewares/decryption.middlewares')
const encrypt = require('../../../middlewares/encryption.middlewares')
const user =db.privateuser


let autoSuggestionForUserSearch = async(req,res)=> {
    try{
        const givenReq = req.query.givenReq ? req.body.givenReq: null;
        const decryptGivenReq = await decrypt(givenReq).toLowerCase();

    let allUsersDataQuery = `SELECT COUNT(*) OVER() AS totalCount,
    pu.privateUserId, pu.title, pu.fullName, pu.emailId, pu.userName, pu.contactNo, 
    rm.roleName, sm.status
    FROM amabhoomi.rolemaster rm
    LEFT JOIN amabhoomi.privateuser pu ON pu.roleid = rm.id
    INNER JOIN statusmaster sm ON sm.statusId = rm.status`;

  let allUsersData = await sequelize.query(allUsersDataQuery, {
    type: Sequelize.QueryTypes.SELECT
  });
      // Decrypt all encrypted fields
      let decryptedUsers = allUsersData.map(async(userData) => ({
        ...userData,
        title: await decrypt(userData.title),
        fullName: await decrypt(userData.fullName),
        emailId: await decrypt(userData.emailId),
        userName:await decrypt(userData.userName),
        contactNo: await decrypt(userData.contactNo)
      }));

    const matchedSuggestions = decryptedUsers.filter(userData =>
            userData.privateUserId.includes(decryptGivenReq) ||
            userData.title.toLowerCase().includes(decryptGivenReq) ||
            userData.fullName.toLowerCase().includes(decryptGivenReq) ||
            userData.emailId.toLowerCase().includes(decryptGivenReq) ||
            userData.userName.toLowerCase().includes(decryptGivenReq) ||
            userData.contactNo.toLowerCase().includes(decryptGivenReq) ||
            userData.roleName.toLowerCase().includes(decryptGivenReq) ||
            userData.status.toLowerCase().includes(decryptGivenReq)
    );

    const encryptedData = matchedSuggestions.map(async (userData) => ({
        ...userData,
        title: await encrypt(userData.title),
        fullName: await encrypt(userData.fullName),
        emailId: await encrypt(userData.emailId),
        userName: await encrypt(userData.userName),
        contactNo: await encrypt(userData.contactNo),
        roleName: await encrypt(userData.roleName),
        status: await encrypt(userData.status)
      }));
    return res.status(statusCode.SUCCESS.code).json({
        message: 'All users data',
        data: encryptedData
      });
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
    }
  };
    
  

let viewList = async (req, res) => {
    try {
      let givenReqEncrypted = req.body.givenReq ? req.body.givenReq: null; // Convert givenReq to lowercase
      let limit = req.body.page_size ? req.body.page_size : 500;
      let page = req.body.page_number ? req.body.page_number : 1;
      let offset = (page - 1) * limit;
      let params = [];
      let getAllUsersQuery = `SELECT COUNT(*) OVER() AS totalCount,
        pu.privateUserId, pu.title, pu.fullName, pu.emailId, pu.userName, pu.contactNo, 
        rm.roleName, sm.status
        FROM amabhoomi.rolemaster rm
        LEFT JOIN amabhoomi.privateuser pu ON pu.roleid = rm.id
        INNER JOIN statusmaster sm ON sm.statusId = rm.status`;
  
      let getAllUsers = await sequelize.query(getAllUsersQuery, {
        type: Sequelize.QueryTypes.SELECT
      });
      let givenReqDecrypted = await decrypt(givenReqEncrypted).toLowerCase() 
  
      // Decrypt all encrypted fields
      let decryptedUsers = getAllUsers.map(async(userData) => ({
        ...userData,
        title: await decrypt(userData.title),
        fullName: await decrypt(userData.fullName),
        emailId: await decrypt(userData.emailId),
        userName:await decrypt(userData.userName),
        contactNo: await decrypt(userData.contactNo)
      }));
  
      // Filter data based on the encrypted search term
      let filteredUsers = decryptedUsers;

      if (givenReqDecrypted) {
        filteredUsers = decryptedUsers.filter(userData =>
          userData.privateUserId.includes(givenReqDecrypted) ||
          userData.title.toLowerCase().includes(givenReqDecrypted) ||
          userData.fullName.toLowerCase().includes(givenReqDecrypted) ||
          userData.emailId.toLowerCase().includes(givenReqDecrypted) ||
          userData.userName.toLowerCase().includes(givenReqDecrypted) ||
          userData.contactNo.toLowerCase().includes(givenReqDecrypted) ||
          userData.roleName.toLowerCase().includes(givenReqDecrypted) ||
          userData.status.toLowerCase().includes(givenReqDecrypted)
        );
      }
  
      // Paginate the filtered data
      let paginatedUsers = filteredUsers.slice(offset, offset + limit);
        // Encrypt the data before sending it to the client
      const encryptedData = paginatedUsers.map(async (userData) => ({
        ...userData,
        title: await encrypt(userData.title),
        fullName: await encrypt(userData.fullName),
        emailId: await encrypt(userData.emailId),
        userName: await encrypt(userData.userName),
        contactNo: await encrypt(userData.contactNo),
        roleName: await encrypt(userData.roleName),
        status:await encrypt(userData.status)
      }));
  

      return res.status(statusCode.SUCCESS.code).json({
        message: 'All users data',
        data: encryptedData
      });
    } catch (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message });
    }
  };
  

let createUser = async (req,res)=>{
    try{
        
            const pwdFlag = false;
        
            const { title, fullName, userName, password, mobileNumber, emailId, role, status, gender } = req.body;

            const decryptTitle = await decrypt(title);
            const decryptfullName =await  decrypt(fullName);
            const decryptUserName= await decrypt(userName);
            const decryptPassword = await decrypt(password);
            const decryptMobileNumber = await decrypt(mobileNumber);
            const decryptemailId = await decrypt(emailId);
       

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
            if(await decrypt(getUser.fullName)!=decryptFullName){
                updatedValueObject.fullName = fullName
            }
            if(await decrypt(getUser.userName)!=decryptUserName){
                updatedValueObject.userName = userName
            }
            if(await decrypt(getUser.contactNo)!=decryptMobileNumber){
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
            if(await decrypt(getUser.title)!=decryptTitle){
                updatedValueObject.title = title
            }
             if(await decrypt(getUser.emailId)!=decryptEmailId){

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
        
    //    let userEncryptedData = specificUser.map(async(user)=>({
    //         title: await encrypt(user.title),
    //         fullName:await encrypt(user.fullName),
    //         emailId:await encrypt(user.emailId),
    //         userName:await encrypt(user.userName),
    //         contactNo:await encrypt(user.contactNo),
    //         roleId:roleId,
    //         statusId:statusId,
    //         genderId:genderId

        // }))
        return res.status(statusCode.SUCCESS.code).json({ message: "Required User", data: specificUser }); 
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

        roleData = roleData.map(async(role)=>({
            roleId:role.roleId,
            roleName:await encrypt(role.roleName),
            roleCode:await encrypt(role.roleCode)
        }))

        genderData = genderData.map(async(genderValue)=>({
            gender:genderValue.gender,
            code:await encrypt(genderValue.code),
            description:await encrypt(genderValue.description)


        }))

        statusData = statusData.map(async(statusData)=>({
            status:statusData.status,
            statusCode:await encrypt(statusData.statusCode),
            description:await encrypt(statusData.description)
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
    fetchInitialData,
    autoSuggestionForUserSearch

}