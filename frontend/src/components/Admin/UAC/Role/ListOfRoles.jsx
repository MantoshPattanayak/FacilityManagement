import React, { useEffect, useState, useCallback } from 'react';
import AdminHeader from '../../../../common/AdminHeader';
import "../../../../common/CommonTable.css"
import "./ListOfRoles.css"
import axiosHttpClient from '../../../../utils/axios';
// icon using fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { encryptData } from '../../../../utils/encryptData';
const ListOfRoles = () => {
  let navigate = useNavigate();
  const [roleListData, setRoleListData] = useState([]);
  const [givenReq, setGivenReq] = useState('');

  //function to execute fetch search query result
  function debounce(fn, delay){
    let timeoutId;
    return function(...args){
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    }
  }

  //debounced function to execute API calls after a delay
  const debouncedFetchRoleList = useCallback(debounce(getRoleListData, 1000), []);

  // Function to fetch role list data
  async function getRoleListData(givenReq = null) {
    try {
      let res = await axiosHttpClient('ROLE_VIEW_API', 'post', {
        // page: currentPage, // Send current page number
        givenReq: givenReq // Send search term if needed
      });
      console.log("here Response", res.data.Role);
      setRoleListData(res.data.Role); // Update role list data
    } catch (error) {
      console.log(error);
    }
  }

  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  function handleSearchQuery(e){
    e.preventDefault();
    let value = e.target.value;
    console.log(value);
    setGivenReq(value);
    return;
  }

  //on page load fetch roles data
  useEffect(() => {
    getRoleListData()
  }, []);

  //page regresh on search query input
  useEffect(() => {
    if(givenReq != null){
      debouncedFetchRoleList(givenReq);
    }
  }, [givenReq])


  return (
    <div className="ListOfRoles">
      <AdminHeader />
      <div className='Main_Conatiner_table'>
        <div className='table-heading'>
          <h2 className="table-heading">View Roles</h2>
        </div>
        <div className="search_text_conatiner">
          <button className='create-role-btn' onClick={() => navigate('/UAC/Role/CreateRole')}>Create new Role</button>
          <input
            type="text"
            className="search_input_field"
            placeholder="Search..."
            id="myInput"
            value={givenReq}
            onChange={handleSearchQuery}
          />
        </div>
        <div className="table_Container">
          <table>
            <thead>
              <tr>
                <th scope="col">Role Name</th>
                <th scope="col">Role Code</th>
                <th scope="col">View</th>
                <th scope="col">Edit </th>
              </tr>
            </thead>
            <tbody>
              {
                roleListData?.length > 0 && roleListData?.map((item, index) => {
                  return (<tr key={index}>
                    <td>{item.roleName}</td>
                    <td>{item.roleCode}</td>
                    <td>
                      <Link
                        to={{
                          pathname: '/UAC/Role/EditRole',
                          search: `?roleId=${encryptDataId(item.roleId)}&action=view`
                        }}
                        title='View'
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={{
                          pathname: '/UAC/Role/EditRole',
                          search: `?roleId=${encryptDataId(item.roleId)}&action=edit`
                        }}
                        title='Edit'
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Link>
                    </td>
                  </tr>)
                })
              }
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {/* <div className="pagination">
          <button onClick={() => handlePageChange('start')}>Start</button>
          <button onClick={() => handlePageChange('previous')}>Previous</button>
          <button onClick={() => handlePageChange('next')}>Next</button>
          <button onClick={() => handlePageChange('last')}>Last</button>
        </div> */}
      </div>
    </div>
  );
};

export default ListOfRoles;
