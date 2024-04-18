import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
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


  // Function to fetch role list data
      async function getRoleListData() {
        try {
          let res = await axiosHttpClient('ROLE_VIEW_API','post', {
            // page: currentPage, // Send current page number
            // search: searchTerm // Send search term if needed
          });
          console.log("here Response", res);
          setRoleListData(res.data.Role); // Update role list data
        } catch (error) {
          console.log(error);
        }
      }

      useEffect(() => {
        getRoleListData()
      }, []);

      function encryptDataId(id) {
        let res = encryptData(id);
        return res;
    }


  return (
    <div className="ListOfRoles">
      <AdminHeader/>
      <div className='Main_Conatiner_table'>
        <div className="header-role">
          <div className="rectangle"></div>
          <div className="roles">
            <h1><b>Role List</b></h1>
          </div>
        </div>
        <div className="search_text_conatiner">
          <button className='create-role-btn'>Create new Role</button>
          <input
            type="text"
            className="search_input_field"
            placeholder="Search..."
            id="myInput"
            // value={searchTerm}
            // onChange={handleSearchChange}
          />
        </div>
        <div className="table_Container">
          <table>
            <thead>
              <tr>
               
                <th scope="col">Role Name</th>
                <th scope="col">Role Code</th>
                <th scope="col">Update</th>
              </tr>
            </thead>
            <tbody>
                  {
                    roleListData?.length > 0 && roleListData?.map((item, index) =>{
                      return (<tr key={index}>
                        <td>{item.roleName}</td>
                        <td>{item.roleCode}</td>
                        <td>
                        <Link
                                         to={{ 
                                        pathname: '/UAC/Role/EditRole',
                                        search: `?userId=${encryptDataId(item.roleId)}&action=view`
                                      }}
                                     >
                                    <FontAwesomeIcon icon={faEye} />
                                 </Link>
                        </td>
                      </tr>)

                    })
                  }
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
      <Footer/>
    </div>
  );
};

export default ListOfRoles;
