import React, { useState } from 'react';
import '../Role/CreateRole.css';
import Footer from '../../../../common/Footer';
import axiosHttpClient from '../../../../utils/axios';
const CreateRole = () => {
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
      

    //handle funcation of OnClick on the submit from
    const HandleCreate = async () => {
      try {
        let res = await axiosHttpClient('CreateRole', 'post', {
          roleName: PostRoleData.roleName || null,
          roleCode: PostRoleData.roleCode || null
        });
        console.log("here Response: " + res);
      } catch (err) {
        console.log("here error: " + err);
      }
    };
  


  return (
    <div className='container-1'>
      
      <div className="header-role">
        <div className="rectangle"></div>
        <div className="roles">
          <h1><b>Jaydev vatika, Bhubaneswar</b></h1>
        </div>
      </div>

      {/* input fields */}
      <form>
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

    </div>
    <div className="input-field">
      <label htmlFor="roleCode">Role Code:</label>
      <input type="text" id="roleName" name='roleCode' className='search_input_field-2' placeholder=''
       onChange={CreateHandler}
      value={PostRoleData.roleCode}
       />
    </div>
  </div>

  <div className="buttons">
    {/* <!-- Cancel button --> */}
    <div className="cancel-btn">
      <button>Cancel</button>
    </div>

    {/* <!-- Create button --> */}
    <div className="create-btn">
    <button onClick={HandleCreate}>Create</button>
    </div>
  </div>
</form>

   

    </div>
 
   
  );
};

export default CreateRole;
