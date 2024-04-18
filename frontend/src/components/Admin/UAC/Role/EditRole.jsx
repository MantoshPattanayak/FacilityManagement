import React from 'react'
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';


const EditRole = () => {
  return (
    <div>
      <AdminHeader/>
  
    <div className='container-1'>

    <div className="header-role">
      <div className="rectangle"></div>
      <div className="roles">
        <h1><b>Jaydev vatika, Bhubaneswar</b></h1>
      </div>
    </div>

    {/* input fields */}
    <div className="input-fields">
      <div className="input-field">
        <label htmlFor="roleName">Role Name:</label>
        <input type="text" id="roleName" className='search_input_field-2' placeholder='' />
      </div>
      <div className="input-field">
        <label htmlFor="roleCode">Role Code:</label>
        <input type="text" id="roleCode" className='search_input_field-2' placeholder='' />
      </div>
    </div>

    <div className="buttons">
      {/* cancel button */}
      <div className="cancel-btn">
        <button>Cancel</button>
      </div>

      {/* create button */}
      <div className="create-btn">
        <button>Update</button>
      </div>
    </div>

  </div>
<Footer/>
  </div>
  )
}

export default EditRole
