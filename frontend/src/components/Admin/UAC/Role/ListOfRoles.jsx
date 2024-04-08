
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../../../common/AdminHeader';
import "../../../../common/CommonTable.css"
import "./ListOfRoles.css"
import { IoIosSearch } from "react-icons/io";


const ListOfRoles = () => {
  const [roleListData, setRoleListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Change as needed for items per page
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getRoleListData();
  }, []);

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
    <div className="Main_Conatiner_table">

      <div className="header-role">
        <div className="rectangle"></div>
        <div className="roles">
          <h1><b> Role List</b></h1>
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
        <table >
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Number</th>
              <th scope="col">Amount</th>
              <th scope="col">Due</th>
            </tr>
          </thead>
          <tbody >
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">sgssh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">ramtosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">menttosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">pentosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">chentosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">peltosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">debtosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">loktosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">rajtosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">manatosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">vaginatosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">penustosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">deeptosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>

            {/* fro dynamic data */}
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
  );
};

export default ListOfRoles;




