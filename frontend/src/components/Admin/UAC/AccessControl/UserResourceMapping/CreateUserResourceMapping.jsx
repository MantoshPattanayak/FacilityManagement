import React, { useEffect, useRef, useState } from "react";
import "../RoleResourceMapping/CreateRoleResourceMapping.css";
import SearchDropdown from "../RoleResourceMapping/SearchDropdown";
import axiosHttpClient from "../../../../../utils/axios";

const CreateUserResourceMapping = () => {
  // const[Postdata, setPostdata]=({

  // })

  // async function CreateUserRole(){
  //   try{
  //     let res=await axiosHttpClient('here Api ', 'post', {

  //     })
  //     console.log("here Api Response ", res)
  //   }
  //   catch(err){
  //     console.log("here Api error ", err)
  //   }
  // }

  // // UseEffect of Update the data means call the api 
  // useEffect(()=>{
  //   CreateUserRole()
  // }, [])






  return (
    <div className="container-parent">
      <div className="headingHeader">
        <div className="heading">
          <h1 className="heading-title">Create Role Resource Mapping</h1>
        </div>
      </div>

      <div className="create-role-resource-mapping-container">
        <div className="left-container">
          {/* Sample content */}
          <input type="checkbox" className="checkbox" />
          <label htmlFor="checkbox1">Checkbox 1</label>
          <br />
          <input type="checkbox" className="checkbox" />
          <label htmlFor="checkbox2">Checkbox 2</label>
          <br />
          <div className="ChildCheckBox">
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            <input type="checkbox" className="checkbox" />
            <label htmlFor="checkbox3">Checkbox 3</label>
            <br />
            {/* Add more checkboxes and text as needed */}
          </div>
        </div>
        <div className="right-container">
           <select>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            <option> 1</option>
            
           </select>
        </div>
      </div>
    </div>
  );
};

export default CreateUserResourceMapping;
