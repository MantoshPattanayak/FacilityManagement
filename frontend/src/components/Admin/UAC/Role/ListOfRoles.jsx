
import React, { useState } from 'react';
import '../Role/ListOfRoles.css';
import { FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BsThreeDotsVertical } from "react-icons/bs";
import CreateRole from './CreateRole'


export default function ListOfRoles() {
  const roles = [
    {
      serialNo: 1, roleCode: 'R001', roleDescription: 'Admin', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 2, roleCode: 'R002', roleDescription: 'User', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 3, roleCode: 'R003', roleDescription: 'Guest', status: 'Inactive', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 4, roleCode: 'R004', roleDescription: 'Manager', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 5, roleCode: 'R005', roleDescription: 'Admin', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 6, roleCode: 'R006', roleDescription: 'User', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 7, roleCode: 'R007', roleDescription: 'Guest', status: 'Inactive', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 8, roleCode: 'R008', roleDescription: 'Manager', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 9, roleCode: 'R009', roleDescription: 'Admin', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 10, roleCode: 'R0010', roleDescription: 'User', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 11, roleCode: 'R0011', roleDescription: 'Guest', status: 'Inactive', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 12, roleCode: 'R0012', roleDescription: 'Manager', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 13, roleCode: 'R001', roleDescription: 'Admin', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 14, roleCode: 'R002', roleDescription: 'User', status: 'Active', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 15, roleCode: 'R003', roleDescription: 'Guest', status: 'Inactive', action: <BsThreeDotsVertical />
    },
    {
      serialNo: 16, roleCode: 'R004', roleDescription: 'Manager', status: 'Active', action: <BsThreeDotsVertical />
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = roles.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(roles.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container-1">
      <div className="header-role">
        <div className="rectangle"></div>
        <div className="roles">
          <h1><b>Role List</b></h1>
        </div>
      </div>

      <div className="container-2">
        {/* Create new role button */}
        <div className="button-newrole">
          <button  className="btn-newrole">Create new role</button>
        </div>

        {/* Search bar */}
        <div className="search-bar">
          <input type="search" className='search_input_field-2'  name="Searchbar" placeholder="Search..." id="" />
          <FaSearch />
        </div>
      </div>

      <div>
        <table className="table">
          <thead className="heading">
            <tr>
              <th>Serial No</th>
              <th>Role Code</th>
              <th>Role Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRoles.map((role, index) => (
              <tr key={index}>
                <td>{role.serialNo}</td>
                <td>{role.roleCode}</td>
                <td>{role.roleDescription}</td>
                <td className="status-column">
                  {role.status === 'Active' ? (
                    <FaCheckCircle className="active-icon" />
                  ) : (
                    <FaTimesCircle className="inactive-icon" />
                  )}
                  {role.status}
                </td>
                <td>{role.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active-page' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
