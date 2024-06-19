import React, { useState } from 'react';
import '../Role/CreateRole.css';
import Footer from '../../../../common/Footer';
import axiosHttpClient from '../../../../utils/axios';
import AdminHeader from '../../../../common/AdminHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { dataLength } from '../../../../utils/regexExpAndDataLength';
import { useNavigate } from 'react-router-dom';

const CreateRole = () => {
  const [postRoleData, setPostRoleData] = useState({
    roleName: "",
    roleCode: ""
  });
  const [errors, setErrors] = useState({});
  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors({});
    setPostRoleData({ ...postRoleData, [name]: value });
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const errors = validate(postRoleData);
      setErrors(errors);
      if (Object.keys(errors).length === 0) {
        const res = await axiosHttpClient('ROLE_CREATE_API', 'post', {
          roleName: postRoleData.roleName || null,
          roleCode: postRoleData.roleCode || null
        });
        console.log("Response: " + res);
        toast.success("Role created successfully");
        setPostRoleData({ roleName: "", roleCode: "" });
        navigate
      } else {
        // Iterate over all input field errors
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
    const Role_Code_regex = /^[A-Z_]+$/;
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
      <div className='role-container-1'>
        <div className='table-heading'>
          <h2 className="table-heading">Create new Role</h2>
        </div>

        <div className="flex justify-end w-full">
          <button className="btn" onClick={() => navigate('/UAC/Role/ListOfRoles')}>Back</button>
        </div>
        {/* Input fields */}
        <div>
          <div className="flex justify-between gap-4">
            <div className="form-group">
              <label htmlFor="input2">Role name<span className='text-red-500'>*</span></label>
              <input type="text" name='roleName' value={postRoleData.roleName} placeholder="Enter role name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} />
              {errors.roleName && <p className='error-message'>{errors.roleName}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="input3">Role code<span className='text-red-500'>*</span></label>
              <input type="text" name='roleCode' value={postRoleData.roleCode} placeholder="Enter role code" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} />
              {errors.roleCode && <p className='error-message'>{errors.roleCode}</p>}
            </div>
          </div>
          <div className="buttons-container">
            <button type='button' className="approve-button" onClick={handleCreate}>Submit</button>
            <button type='button' className="cancel-button" onClick={(e) => setPostRoleData({ roleName: "", roleCode: "" })}>Cancel</button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateRole;
