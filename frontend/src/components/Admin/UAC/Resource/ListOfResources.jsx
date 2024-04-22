import React from 'react'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListOfResources.css';


// here import axios for fetch the data from api
import axiosHttpClient from '../../../../utils/axios';

export default function ListOfResources() {
const [ListOfResources, setListofResources] =useState([])


  // here call api ( Get the data from api) -----------------------------------
      async function GetListOfResources(){
        try{
          let res= await axiosHttpClient('Viw_Recourece_AP', 'POST')
          console.log("here Response get data ", res);
        }
        catch(err){
          console.log("here Error get data ", err)
        }
      }

// use useEffect for Update data ----------------------------------------------

     useEffect(()=>{
      GetListOfResources()
     }, [])













    return (
        <div className='container'>

            {/* HEADER CREATION FOR RESOURCE LIST */}
            <div className="header-role">
                <div className="rectangle"></div>
                <div className="roles">
                    <h1><b> Resource List</b></h1>
                </div>
            </div>
            {/* SEARCH CONTAINER AND Create new Resource BUTTON */}
            <div className="container-size">
            <div className="search_text_conatiner">
                <button className='create-role-btn'>Create new Resource</button>
                <input
                    type="text"
                    className="search_input_field"
                    placeholder="Search..."
                    id="myInput"
                    // value={searchTerm}
                    // onChange={handleSearchChange}
                />
            </div>


        {/* TABLE CREATION */}
        <div className="table_Container">
        <table >
          <thead>
            <tr>
              <th scope="col">Serial No</th>
              <th scope="col">Resource Name</th>
              <th scope="col">Parent Resource Name</th>
              <th scope="col">Path</th>
              <th scope="col">order</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody >
           <tr>
            <td></td>
           </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => handlePageChange('start')}>Start</button>
        <button onClick={() => handlePageChange('previous')}>Previous</button>
        <button onClick={() => handlePageChange('next')}>Next</button>
        <button onClick={() => handlePageChange('last')}>Last</button>
      </div>

      </div>
            </div>
        
    )
}
