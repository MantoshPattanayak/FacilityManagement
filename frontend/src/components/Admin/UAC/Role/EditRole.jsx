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
const EditRole = () => {

  // here post and get the data----------------------
  const [roleData, setRoleData] = useState({ roleName: '', roleCode: '' });
  // here set error (show ) using useState--------------------
  const[Showerror, setShowerror] = useState([])
  const[IsSubmit, setIsSubmit]=useState(false)


  //here Location / crypto and navigate the page---------------
  const location = useLocation();
  const roleId = decryptData(new URLSearchParams(location.search).get('roleId'));
  const action = new URLSearchParams(location.search).get('action');
    const navigate = useNavigate();

  // 1st get the data-------------------
    async function getData(){
      try{
        let res= await axiosHttpClient('ROLE_VIEW_BY_ID_API', 'get', null, roleId)
        console.log("here Update data get", res);
        setRoleData(res.data.data)
       
      }
      catch(err){
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
    async function handleSumbit(e){
      e.preventDefault();
      const errors = validate(roleData);
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
    useEffect(()=>{
      getData()
      handleSumbit()
 
    }, [])

  return (
    <div>
      <AdminHeader/>
  
    <div className='container-1'>
     
    <h2>{action == 'view' ? "View User" : "Edit User"}</h2>
    <div className="header-role">
      <div className="rectangle"></div>
      <div className="roles">
        <h1><b>Update Role</b></h1>
      </div>
    </div>

    {/* input fields */}
    <div className="input-fields">
      <div className="input-field">
        <label htmlFor="roleName">Role Name:</label>
        <input type="text" id="roleName" name='roleName' className='search_input_field-2' placeholder='' value={roleData.roleName} onChange={handleChange} disabled={action == 'view' ? true : false} />
      </div>
      <div className="input-field">
        <label htmlFor="roleCode">Role Code:</label>
        <input type="text" id="roleCode" name='roleCode' className='search_input_field-2' placeholder='' value={roleData.roleCode} onChange={handleChange} disabled={action == 'view' ? true : false}/>
      </div>
    </div>

    <div className="buttons">
      {/* cancel button */}
      <div className="cancel-btn">
        <button>Cancel</button>
      </div>

      {/* create button */}
      <div className="create-btn">
        <button onClick={handleSumbit} disabled={action == 'view' ? true : false}>Update</button>
      </div>
    </div>

  </div>
  <ToastContainer/>
<Footer/>
  </div>
  )
}

export default EditRole
