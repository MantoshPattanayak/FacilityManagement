import "./RoleResourceMappingList.css";
import AdminHeader from "../../../../../common/AdminHeader";
import Footer from "../../../../../common/Footer";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosHttpClient from "../../../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { encryptData } from "../../../../../utils/encrypt"; // Assuming you have a utility function to encrypt the ID
import { encryptData } from "../../../../../utils/encryptData";

const RoleResourceMappingList = () => {
  const [tableData, setTableData] = useState([]);
  const [givenReq, setGivenReq] = useState("");
  const navigate = useNavigate();

  async function fetchRoleResourceMappingListData(givenReq) {
    try {
      let res = await axiosHttpClient("ROLE_RESOURCE_VIEW_API", "post", { givenReq });
      setTableData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error(error);
      setTableData([]);
    }
  }

  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    }
  }

  const debouncedFetchRoleResourceMappingListData = useCallback(debounce(fetchRoleResourceMappingListData, 1000), [])

  useEffect(() => {
    debouncedFetchRoleResourceMappingListData(givenReq);
  }, [givenReq, debouncedFetchRoleResourceMappingListData]);

  return (
    <>
      <AdminHeader />
      <div className={`RoleResourceList`}>
        <div className="table-heading">
          <h2 className="">Role Resource mapping list</h2>
        </div>

        <div className="search_text_conatiner">
          <button
            className="search_field_button"
            onClick={() => navigate("/UAC/RoleResource/CreateRoleResourceMapping")}
          >
            <FontAwesomeIcon icon={faPlus} /> Create Role-Resource
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
                <th scope="col">Role Name</th>
                <th scope="col">Resource Name</th>
                <th scope="col">Parent Resource Name</th>
                <th scope="col">Status</th>
                <th scope="col">View</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.length > 0 &&
                tableData.map((data) => {
                  return (
                    <tr key={data.roleResourceId}>
                      <td data-label="Role Name">{data.role}</td>
                      <td data-label="Resource Name">{data.resourceName}</td>
                      <td data-label="Parent Resource Name">
                        {data.parentResourceName
                          ? data.parentResourceName
                          : "NA"}
                      </td>
                      <td
                        className={`${data.status === 1
                          ? "active-status-rrml"
                          : "Inactive-status-rrml"
                          }`}
                        data-label="Status"
                      >
                        {data.status === 1 && "Active"}
                        {data.status === 2 && "Inactive"}
                      </td>
                      <td data-label="View">
                        <Link
                          to={{
                            pathname: "/UAC/RoleResource/EditRoleResourceMapping",
                            search: `?roleResourceId=${encryptData(
                              data.roleResourceId
                            )}&action=view`,
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td>
                      <td data-label="Edit">
                        <Link
                          to={{
                            // pathname: "/UAC/RoleResource/Edit",
                            pathname: "/UAC/RoleResource/EditRoleResourceMapping",
                            search: `?roleResourceId=${encryptData(
                              data.roleResourceId
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
    </>
  );
};

export default RoleResourceMappingList;
