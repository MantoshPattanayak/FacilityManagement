import React, { useEffect, useState } from 'react'
// here Header and footer import ---------------------------------
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
// import axios for call Api ------------------------------
import axiosHttpClient from '../../../../utils/axios';
// Import Navigate and Crypto -----------------------------------
import { decryptData } from '../../../../utils/encryptData';
import { useLocation, useNavigate } from 'react-router-dom';
// Import toast ---------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { dataLength } from '../../../../utils/regexExpAndDataLength';
const EditRole = () => {

  // here post and get the data----------------------
  const [roleData, setRoleData] = useState({ roleName: '', roleCode: '', roleCodeStatus: '' });
  // here set error (show ) using useState--------------------
  const [Showerror, setShowerror] = useState([])
  const [IsSubmit, setIsSubmit] = useState(false)


  //here Location / crypto and navigate the page---------------
  const location = useLocation();
  const roleId = decryptData(new URLSearchParams(location.search).get('roleId'));
  const action = new URLSearchParams(location.search).get('action');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // 1st get the data-------------------
  async function getData() {
    try {
      let res = await axiosHttpClient('ROLE_VIEW_BY_ID_API', 'get', {}, roleId);
      console.log("here Update data get", res);
      setRoleData(res.data.data);
    }
    catch (err) {
      console.log("here Error", err);
    }
  }
  //  here Post (Update data) -------------------------
  function handleChange(e) {
    e.preventDefault();
    let { name, value } = e.target;
    setRoleData({ ...roleData, [name]: value });
    console.log('roleData', roleData);
    return;
  }

  //here api post (edit Role) -----------------------------------
  async function handleSumbit(e) {
    e.preventDefault();
    const errors = validate(roleData);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        let res = await axiosHttpClient('ROLE_UPDATE_API', 'put', roleData);
        console.log(res);
        toast.success('User details updated successfully.');
      } catch (err) {
        console.error(err);
        toast.error('User details updation failed. Please try again.');
      }
    } else {
      // Here iterate through all input fields errors and display them
      Object.values(errors).forEach(error => {
        toast.error(error);
      });
    }
  }


  // Validation of Edit(Post Data)----------------------
  const validate = (value) => {
    const errors = {};
    const Role_Name_regex = /^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/;

    const Role_Code_regex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;

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

  // here Update the data in Useeffect --------------------------------
  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <AdminHeader />
      <div className='role-container-1'>
        <div className='table-heading'>
          {
            action == 'view' && <h2 className="table-heading">View Role</h2>
          }
          {
            action == 'edit' && <h2 className="table-heading">Edit Role</h2>
          }
        </div>

        <div className="flex justify-end w-full">
          <button className="btn" onClick={() => navigate('/UAC/Role/ListOfRoles')}>Back</button>
        </div>
        {/* Input fields */}
        <div>
          <div className="flex gap-4">
            <div className="form-group">
              <label htmlFor="input2">Role name<span className='text-red-500'>*</span></label>
              <input type="text" name='roleName' value={roleData.roleName} placeholder="Enter role name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? 1 : 0} />
              {errors.roleName && <p className='error-message'>{errors.roleName}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="input3">Role code<span className='text-red-500'>*</span></label>
              <input type="text" name='roleCode' value={roleData.roleCode} placeholder="Enter role code" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? 1 : 0} />
              {errors.roleCode && <p className='error-message'>{errors.roleCode}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="input3">Role Status<span className='text-red-500'>*</span></label>
              <input type="text" name='roleCodeStatus' value={roleData.roleCode} placeholder="Enter role code" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? 1 : 0} />
              {errors.roleCode && <p className='error-message'>{errors.roleCode}</p>}
            </div>
          </div>
          {
            action == 'edit' && (
              <div className="buttons-container">
                <button type='button' className="approve-button" onClick={handleSumbit}>Update</button>
                {/* <button type='button' className="cancel-button" onClick={(e) => setRoleData({ roleName: "", roleCode: "" })}>Cancel</button> */}
              </div>
            )
          }
        </div>
        <ToastContainer />
      </div>
    </div>
  )
}

export default EditRole
