import React from "react";
import { faEye, faPenToSquare, faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from "../../../common/AdminHeader";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { encryptData } from "../../../utils/encryptData";
import axiosHttpClient from "../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {formatDate,formatTime} from "../../../utils/utilityFunctions"
import "./Emp_List_Report.css"

const Emp_List_Report=()=>{

  let navigate = useNavigate();
  let limit = 10;
  let page = 1;

  const [tableData, setTableData] = useState([]);
  const [givenReq, setGivenReq] = useState('');

  // API call to fetch list of saved amenities
  async function fetchAmenitiesList(givenReq = null) {
    try {
      let res = await axiosHttpClient('VIEW_STAFF_ATTENDANCE_LIST_API', 'post', { givenReq });
      setTableData(res.data.data);
      console.log(res.data.data);
    }
    catch (error) {
      console.error(error);
      setTableData([]);
    }
  }
  
  // function to manage API calls while user search input entry
  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args)
      }, delay);
    }
  }

  //Debounced fetchFacilityList function while searching
  const debouncedFetchUserList = useCallback(debounce(fetchAmenitiesList, 1000), []);

  useEffect(() => {
    document.title = 'ADMIN | AMA BHOOMI';
    fetchAmenitiesList();
  }, []);

  useEffect(() => {
    if (givenReq != null)
      debouncedFetchUserList(givenReq);
  }, [givenReq, debouncedFetchUserList]);


  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }
    return(
        <div>
           <AdminHeader />
      <div className='ViewAmenitiesList'>
        <div className="Main_Conatiner_table">
          <div className='table-heading'>
            <h2 className="">Staff Attendance Report </h2>
          </div>

          <div className="search_text_conatiner">
            {/* <button className='search_field_button' onClick={() => navigate('/Emp_Attendance')}><FontAwesomeIcon icon={faPlus} /> Upload Attendance Sheet</button> */}
            <input type="text" className="search_input_field" value={givenReq} placeholder="Search..." onChange={(e) => setGivenReq(e.target.value)} />
            <span>
            <button className='search_field_button mr-10'>Download Csv</button>
            <button className='search_field_button ml-4'>Download pdf</button>
            </span>
            
           
          </div>

          <div className="table_Container">
            <table >
              <thead>
                <tr>
                <th scope="col">Facility  Name</th>
                <th scope="col">Facility Type</th>
                <th scope="col">First Name </th>
                <th scope="col">Last Name </th>
                <th scope="col">attendance Date</th>
                <th scope="col">checkIn Time</th>
                <th scope="col">checkOut Time</th>
                <th scope="col">View</th>
               
                </tr>
              </thead>
              <tbody >
                {
                  tableData?.length > 0 && tableData?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Amenity Name">{data.facilityName}</td>
                        <td data-label="facilityType" >{data.facilityType}</td>
                        <td  data-label="firstName" >{data.firstName}</td>
                        <td  data-label="lastName" >{data.lastName}</td>
                        <td data-label="attendanceDate">{formatDate(data.attendanceDate)}</td>
                        <td>{formatTime(data.checkInTime)}</td>
                        <td>{formatTime(data.checkOutTime)}</td>
                        <td data-label="View">
                          <Link
                            to={{
                              pathname: '/mdm/edit-amenities',
                              search: `?a=${encodeURIComponent(encryptDataId(data.facilityStaffAttendanceId))}&action=view`}}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                        </td>
                      
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </div>
    )
}
export default Emp_List_Report;