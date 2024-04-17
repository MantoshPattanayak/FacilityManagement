import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import "../../../../common/CommonTable.css"
import "./ListOfRoles.css"
import { IoIosSearch } from "react-icons/io";
const ListOfRoles = () => {
  const [roleListData, setRoleListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Change as needed for items per page
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch role list data
  async function getRoleListData() {
    try {
      let res = await axios.post('here api', {
        page: currentPage, // Send current page number
        search: searchTerm // Send search term if needed
      });
      console.log("here Response", res.data);
      setRoleListData(res.data); // Update role list data
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getRoleListData();
  }, []);

  // Function to handle page change
  const handlePageChange = (type) => {
    switch (type) {
      case 'start':
        setCurrentPage(1);
        break;
      case 'previous':
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
        break;
      case 'next':
        setCurrentPage((prev) => (prev < Math.ceil(roleListData.length / itemsPerPage) ? prev + 1 : prev));
        break;
      case 'last':
        setCurrentPage(Math.ceil(roleListData.length / itemsPerPage));
        break;
      default:
        break;
    }
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Apply pagination logic to slice the data for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = roleListData.slice(indexOfFirstItem, indexOfLastItem);

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
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="table_Container">
          <table>
            <thead>
              <tr>
                <th scope="col">Serial No</th>
                <th scope="col">Role Name</th>
                <th scope="col">Role Code</th>
                <th scope="col">Update</th>
              </tr>
            </thead>
            <tbody>
              {/* For dynamic data */}
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.serialNo}</td>
                  <td>{item.roleCode}</td>
                  <td>{item.roleDescription}</td>
                  <td>{item.status}</td>
                  <td>{item.action}</td>
                </tr>
              ))}
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
