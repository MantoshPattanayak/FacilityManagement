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
  const [roleData, setRoleData] = useState({ roleId:'', roleName: '', roleCode: '', roleCodeStatus: '' });
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
      setRoleData({
        roleId: res.data.data.roleId,
        roleName: res.data.data.roleName,
        roleCode: res.data.data.roleCode,
        roleCodeStatus: res.data.data.statusId
      })
    }
    catch (err) {
      console.log("here Error", err);
    }
  }
  //  here Post (Update data) -------------------------
  function handleChange(e) {
    e.preventDefault();
    setErrors({});
    let { name, value } = e.target;
    setRoleData({ ...roleData, [name]: value });
    console.log('roleData', roleData);
    return;
  }

  //function to seek confirmation
  function handleConfirmation(e) {
    e.preventDefault();
    toast.warn(
      <div>
        <p>Are you sure you want to proceed?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => handleSumbit(e)} className='bg-green-400 text-white p-2 border rounded-md'>Yes</button>
          <button onClick={() => {
            toast.dismiss();
            toast.error('Action cancelled!', {
              // position: toast.POSITION.TOP_CENTER,
              // autoClose: 3000,
            });
          }} className='bg-red-400 text-white p-2 border rounded-md'>No</button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false, // Disable auto close
        closeOnClick: false, // Disable close on click
      }
    );
    return;
  }

  //here api post (edit Role) -----------------------------------
  async function handleSumbit(e) {
    e.preventDefault();
    const errors = validate(roleData);
    setErrors(errors);
    toast.dismiss();
    if (Object.keys(errors).length === 0) {
      try {
        let res = await axiosHttpClient('ROLE_UPDATE_API', 'put', roleData);
        console.log(res);
        toast.success('Role updated successfully.', {
          autoClose: 2000,
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate('/UAC/Role/ListOfRoles');
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      } catch (err) {
        console.error(err);
        toast.error('Role updation failed. Please try again.');
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
          <div className="flex flex-col gap-4">
            <div className="form-group">
              <label htmlFor="input2">Role name<span className='text-red-500'>*</span></label>
              <input type="text" name='roleName' value={roleData.roleName} placeholder="Enter role name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? 1 : 0} />
              {errors.roleName && <p className='error-message'>{errors.roleName}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="input3">Role code <i>(In uppercase without space)</i><span className='text-red-500'>*</span></label>
              <input type="text" name='roleCode' value={roleData.roleCode} placeholder="Enter role code" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? 1 : 0} />
              {errors.roleCode && <p className='error-message'>{errors.roleCode}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="input3">Role Status<span className='text-red-500'>*</span></label>
              <select name='roleCodeStatus' value={roleData.roleCodeStatus} onChange={handleChange} disabled={action == 'view' ? 1 : 0}>
                <option value=''>Select</option>
                <option value='1'>Active</option>
                <option value='2'>Inactive</option>
              </select>
              {/* <input type="text" name='roleCodeStatus' value={roleData.roleCode} placeholder="Enter role code" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? 1 : 0} /> */}
              {errors.roleCode && <p className='error-message'>{errors.roleCode}</p>}
            </div>
          </div>
          {
            action == 'edit' && (
              <div className="buttons-container">
                <button type='button' className="approve-button" onClick={handleConfirmation}>Update</button>
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
