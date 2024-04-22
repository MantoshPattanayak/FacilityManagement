import React, { useEffect, useState } from 'react';
import '../Resource/CreateResource.css';
import axiosHttpClient from '../../../../utils/axios';

const CreateResource = () => {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [resourecName, setResourceName] = useState("");
  const [resourceDescription, setResourceDescription] = useState("");
  const [parentResource, setParentResource] = useState("");
  const [level, setLevel] = useState(0);
  const [subMenu, setSubMenu] = useState("");
  const [path, setPath] = useState("");
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [parentResourceList, setParentResourceList] = useState([]);




  // here Post the data of CreateResource-----------------------------------
 async function postCreateResource(){
  try{
    let res= await axiosHttpClient('here Api for Post the data', 'post', data, null)

    console.log("here Post the data",res)
  }
  catch(err){
    console.log("here Error", err)  }
 }


  // here Get the data for Drop Down-----------------------------------

  async function GetResouceDataDropdoewn(){
      try{
        let res= await axiosHttpClient("here api", 'get')
      console.log("here Response of get data in Drop Down",res)
      }
      catch(err){
        console.log("here is error of get data in Drop Down",err)
      }
  }

  // UseEffect for Update the data--------------------------------
    useEffect(()=>{
      GetResouceDataDropdoewn()
        postCreateResource()
    }, [])

  return (
    <div className='container-1'>
      {/* HEADER CREATION FOR RESOURCE LIST */}
      <div className="header-role">
        <div className="rectangle"></div>
        <div className="roles">
          <h1><b>Create Resource</b></h1>
        </div>
      </div>
      {/* Back button  */}
      <div className="back-btn">
        <button className="btn">Back</button>
      </div>
      {/* Form having inputs field */}
      <form >
        <div className="form">
          <div className="fields">
            <div className="title"><h3>Resource Name</h3></div>
            <input type="text" name="name" placeholder='Resource Name' id="" className="createresource-input-fields" />
          </div>

          <div className="fields">
            <div className="title"><h3>Resource Description</h3></div>
            <input type="text" name="name" placeholder='Resource Description' id="" className="createresource-input-fields"/>
          </div>

          <div className="fields">
            <div className='checkbox'>
              <input type="checkbox" id="coding" name="interest" value="coding" className='checkbox-input' />
              <label for="coding" className='checkbox-label'>Is Parent-Resource</label>
            </div>
          </div>

          <div className="fields">
            <div className="title"><h3>Parent Resource Name</h3></div>
            <select name="cars" id="cars" className="createresource-input-fields">
              <option value="Dashboard">Dashboard</option>
              <option value="mainforce">mainforce</option>
              <option value="mercedes">mercedes</option>
              <option value="durex">durex</option>  
            </select>
          </div>

          <div className="fields">
            <div className="title"><h3>Path</h3></div>
            <input type="text" name="name" placeholder='Enter Path Ex- (/path12)' id="" className="createresource-input-fields" />
          </div>

          <div className="fields">
            <div className="title"><h3>Show in Order</h3></div>
            <input type="number" name="number" id="" defaultValue={0} className="createresource-input-fields"/>
          </div>
        </div>

        <div className="buttons">
          <button className="reset-btn">
             Reset
          </button>
          <button className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResource;
