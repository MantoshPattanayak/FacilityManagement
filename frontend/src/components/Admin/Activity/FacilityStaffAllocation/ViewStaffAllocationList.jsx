import React, { useEffect, useState, useCallback } from "react";
import axiosHttpClient from "../../../../utils/axios";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../../../../utils/utilityFunctions";
import AdminHeader from "../../../../common/AdminHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./ViewStaffAllocation.css";
import { decryptData, encryptData } from "../../../../utils/encryptData";

export default function ViewStaffAllocation() {
  const navigate = useNavigate();
  const [givenReq, setGivenReq] = useState("");
  const [tableData, setTableData] = useState([]);

  // function to fetch notifications list data
  let fetchStaffAllocationData = async (givenReq) => {
    try {
      let res = await axiosHttpClient("VIEW_STAFF_ALLOCATION_LIST_API", "post", {
        givenReq: givenReq,
      });

      console.log(
        "fetch staff allocation list data",
        res
      );
      setTableData(res.data.paginatedMatchedData);
    } catch (error) {
      console.error(error);
    }
  };

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
  const debouncedFetchNotificationsList = useCallback(debounce(fetchStaffAllocationData, 1000), []);

  useEffect(() => {
    document.title = 'ADMIN | AMA BHOOMI';
    // fetchStaffAllocationData();
  }, []);

  useEffect(() => {
    console.log(givenReq != null);
    if (givenReq != "" || givenReq != null)
        debouncedFetchNotificationsList(givenReq);
  }, [givenReq, debouncedFetchNotificationsList]);

  return (
    <div>
      <AdminHeader />
      <div className="ViewStaffAllocation">
        <div className="table-heading">
          <h2 className="">View Facility Staff Allocation</h2>
        </div>

        <div className="search_text_conatiner">
          <button
            className="search_field_button"
            onClick={() => navigate("/activity/create-staff-allocation")}
          >
            <FontAwesomeIcon icon={faPlus} /> Add new staff allocation
          </button>
          <input
            type="text"
            className="search_input_field"
            value={givenReq}
            placeholder="Search..."
            onChange={(e) => setGivenReq(e.target.value)}
          />
          {/* <SearchDropdown /> */}
        </div>

        <div className="table_Container">
          <table>
            <thead>
              <tr>
                <th scope="col">Staff Name</th>
                <th scope="col">Facility Name</th>
                <th scope="col">Allocation Start Date</th>
                <th scope="col">Allocation End Date</th>
                <th scope="col">Created On</th>
                <th scope="col">Status</th>
                <th scope="col">View</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.length > 0 &&
                tableData?.map((data) => {
                  return (
                    <tr key={data.facilityStaffAllocationId}>
                      <td data-label="Staff Name">
                        {decryptData(data.fullName)}
                      </td>
                      <td data-label="Facility Name">
                        {data.facilityname}
                      </td>
                      <td data-label="Allocation Start Date">
                        {formatDate(data.allocationStartDate)}
                      </td>
                      <td data-label="Allocation End Date">
                        {formatDate(data.allocationEndDate)}
                      </td>
                      <td data-label="Created On">
                        {formatDate(data.createdOn)}
                      </td>
                      <td data-label="Status">
                        <p className={`${data.statusCode == "ACTIVE" ? 'text-green-500' : 'text-red-500'}`}>{data.statusCode}</p>
                      </td>
                      <td data-label="View">
                        <Link
                          to={{
                            pathname: "/activity/edit-staff-allocation",
                            search: `?s=${encodeURIComponent(
                              encryptData(data.facilityStaffAllocationId)
                            )}&action=view`,
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td>
                      <td data-label="Edit">
                        <Link
                          to={{
                            pathname: "/activity/edit-staff-allocation",
                            search: `?s=${encodeURIComponent(
                              encryptData(data.facilityStaffAllocationId)
                            )}&action=edit`,
                          }}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
