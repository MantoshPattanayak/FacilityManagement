import {
  faEye,
  faPenToSquare,
  faAngleDown,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AdminHeader from "../../../../common/AdminHeader";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { decryptData, encryptData } from "../../../../utils/encryptData";
import axiosHttpClient from "../../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ViewActivityList.css";
import { formatDate } from "../../../../utils/utilityFunctions";

export default function ViewActivityList() {
  let navigate = useNavigate();
  let limit = 10;
  let page = 1;

  const [tableData, setTableData] = useState([]);
  const [givenReq, setGivenReq] = useState("");

  // API call to fetch list of saved amenities
  async function fetchAmenitiesList(givenReq = null) {
    try {
      let res = await axiosHttpClient("VIEW_AMENITIES_LIST_API", "post", {
        givenReq,
      });
      setTableData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
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
        fn(...args);
      }, delay);
    };
  }

  //Debounced fetchFacilityList function while searching
  const debouncedFetchUserList = useCallback(
    debounce(fetchAmenitiesList, 1000),
    []
  );

  useEffect(() => {
    document.title = "ADMIN | AMA BHOOMI";
    fetchAmenitiesList();
  }, []);

  useEffect(() => {
    if (givenReq != null) debouncedFetchUserList(givenReq);
  }, [givenReq, debouncedFetchUserList]);

  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  return (
    <>
      <AdminHeader />
      <div className="ViewAmenitiesList">
        <div className="Main_Conatiner_table">
          <div className="table-heading">
            <h2 className="">List of Activities master</h2>
          </div>

          <div className="search_text_conatiner">
            <button
              className="search_field_button"
              onClick={() => navigate("/CreateNewActivity")}
            >
              <FontAwesomeIcon icon={faPlus} /> Add new activity
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
                  <th scope="col">Activity Name</th>
                  <th scope="col">Created On</th>
                  <th scope="col">Status</th>
                  <th scope="col">View</th>
                  <th scope="col">Edit</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.length > 0 &&
                  tableData?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Amenity Name">{data.amenityName}</td>
                        <td data-label="Created On">
                          {formatDate(data.createdOn)}
                        </td>
                        <td data-label="Status">
                          <p
                            className={
                              data.status == "ACTIVE"
                                ? "text-green-500"
                                : data.status == "INACTIVE"
                                ? "text-red-500"
                                : ""
                            }
                          >
                            {data.status}
                          </p>
                        </td>
                        <td data-label="View">
                          <Link
                            to={{
                              pathname: "/mdm/edit-amenities",
                              search: `?a=${encodeURIComponent(
                                encryptDataId(data.amenityId)
                              )}&action=view`,
                            }}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                        </td>
                        <td data-label="Edit">
                          <Link
                            to={{
                              pathname: "/EditActivities",
                              search: `?a=${encodeURIComponent(
                                encryptDataId(data.amenityId)
                              )}${
                                data.status == "ACTIVE"
                                  ? "&action=edit"
                                  : data.status == "INACTIVE"
                                  ? "&action=view"
                                  : "&action=view"
                              }`,
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
    </>
  );
}
