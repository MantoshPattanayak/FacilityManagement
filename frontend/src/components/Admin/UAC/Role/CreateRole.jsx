
import React, { useState } from 'react';
import '../Role/CreateRole.css';
import Footer from '../../../../common/Footer';
import axiosHttpClient from '../../../../utils/axios';
import AdminHeader from '../../../../common/AdminHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateRole = () => {
  const [postRoleData, setPostRoleData] = useState({
    roleName: "",
    roleCode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostRoleData({ ...postRoleData, [name]: value });
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const errors = validate(postRoleData);
      if (Object.keys(errors).length === 0) {
        const res = await axiosHttpClient('ROLE_CREATE_API', 'post', {
          roleName: postRoleData.roleName || null,
          roleCode: postRoleData.roleCode || null
        });
        console.log("Response: " + res);
        toast.success("Role created successfully");
        setPostRoleData({ roleName: "", roleCode: "" });
      } else {
        Object.values(errors).forEach(error => {
          toast.error(error);
        });
      }
    } catch (err) {
      console.error("Error: " + err);
      toast.error("Failed to create role. Please try again.");
    }
  };

  const validate = (value) => {
    const errors = {};
    const Role_Name_regex = /^[a-zA-Z0-9\s]+$/;
    const Role_Code_regex = /^[a-zA-Z\s]+$/;
    if (!value.roleName) {
      errors.roleName = "Role Name is Required!";
    } else if (!Role_Name_regex.test(value.roleName)) {
      errors.roleName = "Role Name is not valid";
    }
    if (!value.roleCode) {
      errors.roleCode = "Role Code is Required!";
    } else if (!Role_Code_regex.test(value.roleCode)) {
      errors.roleCode = "Role Code is not valid";
    }
    return errors;
  }

  return (
    <div>
      <AdminHeader />
      <div className='container-1'>

        <div className="header-role">
          <div className="rectangle"></div>
          <div className="roles">
            <h1><b>Jaydev vatika, Bhubaneswar</b></h1>
          </div>
        </div>

        {/* Input fields */}
        <form onSubmit={handleCreate}>
          <div className="input-fields">
            <div className="input-field">
              <label htmlFor="roleName">Role Name:</label>
              <input
                type="text"
                id="roleName"
                name='roleName'
                className='search_input_field-2'
                placeholder=''
                onChange={handleChange}
                value={postRoleData.roleName}
              />
            </div>
            <div className="input-field">
              <label htmlFor="roleCode">Role Code:</label>
              <input
                type="text"
                id="roleCode"
                name='roleCode'
                className='search_input_field-2'
                placeholder=''
                onChange={handleChange}
                value={postRoleData.roleCode}
              />
            </div>
          </div>

          <div className="buttons">
            <div className="cancel-btn">
              <button type="button">Cancel</button>
            </div>
            <div className="create-btn">
              <button className='create-btn-click' type="submit">Create</button>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
      <Footer />
    </div>
  );
};

export default CreateRole;
