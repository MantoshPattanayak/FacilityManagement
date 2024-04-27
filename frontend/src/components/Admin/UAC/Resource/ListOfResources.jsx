import React from 'react'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import './ListOfResources.css';
import { encryptData } from '../../../../utils/encryptData';

// here import axios for fetch the data from api
import axiosHttpClient from '../../../../utils/axios';

export default function ListOfResources() {

  let navigate = useNavigate();
const [ListOfResources, setListofResources] =useState([])
  // here call api ( Get the data from api) -----------------------------------
      async function GetListOfResources(){
        try{
          let res= await axiosHttpClient('RESOURCE_VIEWLIST_API', 'post')
          console.log("here Response get data ",res);
          setListofResources(res.data.Resource)
        }
        catch(err){
          console.log("here Error get data ", err)
        }
      }

// use useEffect for Update data ----------------------------------------------

     useEffect(()=>{
          GetListOfResources()
     }, [])

  // encryptid--------------------------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }











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
                <button className='create-role-btn' onClick={() => navigate('/UAC/Resources/CreateResource')}>Create new Resource</button>
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
              <th scope="col">Resource Name</th>
              <th scope="col">Parent Resource Name</th>
              <th scope="col">Path</th>
              <th scope="col">order</th>
              <th scope="col">Status</th>
              <th scope="col">View</th>
              <th scope="col">Update</th>
            </tr>
          </thead>
          <tbody>
              {ListOfResources?.length > 0 && ListOfResources.map((item, index) => {
                return (
                  <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.parentResourceName }</td>
                      <td>{item.path }</td>
                      <td>{item.order}</td>
                      <td className={`text-left ${item.status === 'ACTIVE'? 'text-green-500' : 'text-red-500'}`}>{item.status}</td>
                      <td>
                        <Link to={{ 
                           pathname: '/UAC/Resources/EditDisplayResource',
                             search: `?resourceId=${encryptDataId(item.resourceId)}&action=view`
                              }}
                             >
                            <FontAwesomeIcon icon={faEye} />
                            </Link>
                        </td>
                        <td>
                        <Link
                            to={{
                              pathname: '/UAC/Resources/EditDisplayResource',
                             search: `?resourceId=${encryptDataId(item.resourceId)}&action=edit`
                                 }}
                                   >
                                   <FontAwesomeIcon icon={faPenToSquare} />
                                   </Link>
                        </td>
                  </tr>
                )
              })}
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