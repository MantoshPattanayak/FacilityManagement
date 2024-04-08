import React from 'react'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './ListOfResources.css';
import SearchIcon from '../../../../assets/search-icon.png'

export default function ListOfResources() {
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
                    value={searchTerm}
                    onChange={handleSearchChange}
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
              <td data-label="Name">Mantosh</td>
              <td data-label="Number"   >78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
              <td data-label="Due">211</td>
              <td data-label="Due">active</td>
              <td data-label="Due">edit</td>
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


            {/* fro dynamic data */}
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.serialNo}</td>
                <td>{item.resourceName}</td>
                <td>{item.parentResourceName}</td>
                <td>{item.path}</td>
                <td>{item.order}</td>
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
            </div>
        
    )
}
