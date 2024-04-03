
import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../../common/AdminHeader';
import "../../../../common/CommonTable.css"
import Footer from "../../../../common/Footer";

import "./ListOfRoles.css"



 const ListOfRoles=()=>{
  const[GetRoleListData, setRoleListData]=useState()
  

  async function getRoleListData(){
    try{
      let res=await axiosHttpClient('here api', 'post', {
        // post the page number 
      });
      console.log("here Response", res)
      // setRoleListData(res.data)
    }
    catch (error) {
      console.log(error);
    
  }
  }


  // useEffect for Update the data
  useEffect(()=>{
    getRoleListData
  }, [])

  return(
    
    <div className="Main_Conatiner_table">
      {/* here Header */}
      <AdminHeader/>
     
    <div className="search_text_conatiner">
        <h1 className="text_Name_Table"> Role List</h1>
        <input type="text" className="search_input_field" placeholder="Search..." id="myInput"/>
    </div>
    
        <div className="table_Container">
            <table >
                        <thead>
                            <tr>
                            <th scope="col">Serial No</th>
                            <th scope="col">Role Code</th>
                            <th scope="col">Role Description </th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          
                            </tr>
                        </thead>
                        <tbody> 
                          <tr>
                            <td>1</td>
                          </tr>
                    
                          
                        </tbody>
            </table>
        </div>
        {/* here Footer */}
        <Footer/>

</div>
  )
 }
 export default ListOfRoles;