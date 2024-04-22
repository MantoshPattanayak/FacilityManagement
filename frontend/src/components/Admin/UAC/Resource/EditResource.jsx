import React, { useEffect } from 'react'
import axiosHttpClient from '../../../../utils/axios'
const CreateResource = () => {
  







  // here Get the data

    async function DisplayData(){
      try{
        let res= await axiosHttpClient('here api', 'get')
        console.log("here get the Response of Display the data", res)
      }
      catch(err){
        console.log("here is error", err)
      }
    }

  // useEffect for Update the daata (Means call the api)
      useEffect(()=>{
        DisplayData()
      }, [])
  return (
    <div className='container-1'>
      {/* HEADER CREATION FOR RESOURCE LIST */}
      <div className="header-role">
        <div className="rectangle"></div>
        <div className="roles">
          <h1><b>Update Resource</b></h1>
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
          <input type="text" name="name" placeholder='Update Name' id="" className="input-fields" />
        </div>

        <div className="fields">
          <div className="title"><h3>Resource Description</h3></div>
          <input type="text" name="name" placeholder=' Update Resource Description' id="" className="input-fields"/>
        </div>

        <div className="fields">
          <div className="checkbox">
          <span>Is Parent-Resource</span> <input type="checkbox" name="Is parent-resource" id=""  />  
          </div>
        </div> 

        <div className="fields">
          <div className="title"><h3>Parent Resource Name</h3></div>
          <select name="cars" id="cars" className="input-fields">
            <option value="Dashboard">Dashboard</option>
            <option value="mainforce">mainforce</option>
            <option value="mercedes">mercedes</option>
            <option value="durex">durex</option>
          </select>
        </div>

        <div className="fields">
          <div className="title"><h3>Path</h3></div>
          <input type="text" name="name" placeholder='Enter Path Ex- (/path12)' id="" className="input-fields" />
        </div>

        <div className="fields">
          <div className="title"><h3>Show in Order</h3></div>
          <input type="number" name="number" id="" defaultValue={0} className="input-fields"/>
        </div>
      </div>

      <div className="buttons">
        <div className="submit-btn">
          Submit
        </div>
      </div>
      </form>

    </div>
  )
}

export default CreateResource