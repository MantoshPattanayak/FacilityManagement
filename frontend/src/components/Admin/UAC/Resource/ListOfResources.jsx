import React, { useCallback, useEffect, useState } from "react";
import axiosHttpClient from "../../../../utils/axios";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../../../../utils/utilityFunctions";
import AdminHeader from "../../../../common/AdminHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./ListOfResources.css";
import { encryptData } from "../../../../utils/encryptData";

export default function ViewNotifications() {
  let navigate = useNavigate();
  const [ListOfResources, setListofResources] = useState([]);
  const [givenReq, setGivenReq] = useState('');
  // here call api ( Get the data from api) -----------------------------------
  async function GetListOfResources(givenReq = null) {
    try {
      let res = await axiosHttpClient("RESOURCE_VIEWLIST_API", "post", {givenReq});
      console.log("here Response get data ", res);
      setListofResources(res.data.Resource);
    } catch (err) {
      console.log("here Error get data ", err);
    }
  }

  // function to encrypt data
  function encryptDataId(data) {
    return encryptData(data);
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
  const debouncedFetchResourcesList = useCallback(debounce(GetListOfResources, 1000), []);

  useEffect(() => {
    document.title = 'ADMIN | AMA BHOOMI';
    GetListOfResources();
  }, []);

  useEffect(() => {
    if (givenReq != null)
      debouncedFetchResourcesList(givenReq);
  }, [givenReq, debouncedFetchResourcesList]);

  return (
    <div>
      <AdminHeader />
      <div className="ListOfResources">
        <div className="table-heading">
          <h2 className="">View Resources</h2>
        </div>

        <div className="search_text_conatiner">
          <button
            className="search_field_button"
            onClick={() => navigate("/UAC/Resources/CreateResource")}
          >
            <FontAwesomeIcon icon={faPlus} /> Create new Resource
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
              {ListOfResources?.length > 0 &&
                ListOfResources?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td data-label='Resource Name'>{item.name}</td>
                      <td data-label="Parent Resource Name">{item.parentResourceName || "NA"}</td>
                      <td data-label="Path">{item.path || 'NA'}</td>
                      <td data-label="Order">{item.order}</td>
                      <td
                        data-label="Status"                        
                      >
                        <p className={`text-left ${item.status === "ACTIVE"
                            ? "text-green-500"
                            : "text-red-500"
                          }`}>{item.status}</p>
                      </td>
                      <td data-label="View">
                        <Link
                          to={{
                            pathname: "/UAC/Resources/EditDisplayResource",
                            search: `?resourceId=${encryptDataId(
                              item.resourceId
                            )}&action=view`,
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td>
                      <td data-label="Edit">
                        <Link
                          to={{
                            pathname: "/UAC/Resources/EditDisplayResource",
                            search: `?resourceId=${encryptDataId(
                              item.resourceId
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
