import React, { useState, useEffect } from 'react';
import '../Role/CreateRole.css';
import Footer from '../../../../common/Footer';
import axiosHttpClient from '../../../../utils/axios';
const CreateRole = () => {

  const[ShowError, setShowError]=useState({}); // to show error message or not
  const[IsSubmit, setIsSubmit]=useState(false); // Check Submit or Not 
  // here To add Bus Schedule
    const[PostRoleData, setPostRoleData]=useState({
      roleName:"",
      roleCode:""
    })
      // handler
      const CreateHandler = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setPostRoleData({ ...PostRoleData, [name]: value });
      }
      
   ///here for show the error
      useEffect(() => {
        if (Object.keys(ShowError).length === 0 && IsSubmit) {
          console.log(ShowError);
        }
      }, [ShowError]);

    //handle funcation of OnClick on the submit from
     const HandleCreate = async (e) => {
            e.preventDefault();
            setIsSubmit(true);
            const errors = Validation(PostRoleData);
              setShowError(errors);
              // here Check the length of errors
            if(Object.keys(errors).length==0){
            try {
              let res = await axiosHttpClient('CreateRole', 'post', {
                roleName: PostRoleData.roleName || null,
                roleCode: PostRoleData.roleCode || null
              });
              console.log("here Response: " + res);
              alert("Role created successfully")
              // here Reset from after submit
                setPostRoleData({
                  roleName:"",
                  roleCode:""
                })
            } catch (err) {
              console.log("here error: " + err);
              alert("Role is Not Created", err.message);
                setPostRoleData({
                  roleName:"",
                  roleCode:""
                })
            }
           }
            
          };
  

    // here Validation 
    const Validation =(value)=>{
          const  error={};
          const Role_Name_regex = /^[a-zA-Z0-9\s]+$/;
          const Role_Code_regex = /^[a-zA-Z\s]+$/;
          if(!value.roleName){
            error.roleName="Role Name is Required!"
          } else if(!Role_Name_regex.test(value.roleName)){
            error.Role_Name="Role Name is not a valid "
          }
          if(!value.roleCode){
            error.roleCode="Role Code is Required!"
          } else if(!Role_Code_regex.test(value.roleCode)){
            error.roleCode="Role Code is not a valid "
          }
          return error;
    }
  
        








  return (
    <div className='container-1'>
      
      <div className="header-role">
        <div className="rectangle"></div>
        <div className="roles">
          <h1><b>Jaydev vatika, Bhubaneswar</b></h1>
        </div>
      </div>

      {/* input fields */}
      <form onSubmit={HandleCreate}>
        <div className="input-fields">
          <div className="input-field">
            <label htmlFor="roleName">Role Name:</label>
            <input
              type="text"
              id="roleName"
              name='roleName'
              className='search_input_field-2'
              placeholder=''
              onChange={CreateHandler}
              value={PostRoleData.roleName}
            />
               {ShowError.roleName && <p className="text-red-700">{ShowError.roleName}</p>}
          </div>
          <div className="input-field">
            <label htmlFor="roleCode">Role Code:</label>
            <input type="text" id="roleName" name='roleCode' className='search_input_field-2' placeholder=''
            onChange={CreateHandler}
            value={PostRoleData.roleCode}
            />
            {ShowError.roleCode && <p className="text-red-700">{ShowError.roleCode}</p>}
          </div>
        </div>

  <div className="buttons">
    {/* <!-- Cancel button --> */}
    <div className="cancel-btn">
      <button>Cancel</button>
    </div>

    {/* <!-- Create button --> */}
    <div className="create-btn">
    <button >Create</button>
    </div>
  </div>
</form>
    </div>
 
   
  );
};

export default CreateRole;
