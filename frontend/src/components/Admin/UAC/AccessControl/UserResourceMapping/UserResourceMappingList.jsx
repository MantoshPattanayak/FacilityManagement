import "./UserResourceMappingList.css";
import Footer from "../../../../../common/Footer";
import { useEffect, useState } from "react";
import axiosHttpClient from "../../../../../utils/axios";
import { decryptData, encryptData } from "../../../../../utils/encryptData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import AdminHeader from "../../../../../common/AdminHeader";

// import "./UserResourceMappingList.css";
const UserResourceMappingList = () => {
  const [tableData, setTableData] = useState([]);

  async function fetchUserRoleResourceMappingListData() {
    try {
      let res = await axiosHttpClient("USER_RESOURCE_VIEW_API", "post");
      console.log("UserRoleResourceMappingListData is here: ", res.data.data);

      //Decrypting userName
      const decryptedData = res.data.data.map((item) => ({
        ...item,
        userName: decryptData(item.userName),
      }));

      console.log(decryptedData);

      setTableData(decryptedData);
    } catch (error) {
      console.error("error UserRoleResMapList: ", error);
    }
  }

  useEffect(() => {
    fetchUserRoleResourceMappingListData();
  }, []);

  return (
    <div>
      <div className="">
        <AdminHeader/>
     
        <div className="ListOfResources">
        <div className="table-heading">
          <h2 className="">User resource mapping list</h2>
        </div>
        
        <div className="search_text_conatiner">
          <input
            type="text"
            className="search_input_field"
            placeholder="Search..."
            id="myInput"
          />
        </div>

        <div className="table_Container">
          <table>
            <thead>
              <tr>
                <th scope="col">Serial No</th>
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
                    <tr key={data.userResourceId}>
                      <td data-label="Serial No">{data.userResourceId}</td>
                      <td data-label="Role Name">{data.userName}</td>
                      <td data-label="Resource Name">{data.description}</td>
                      <td data-label="Parent Resource Name">
                        {data.parentResourceName}
                      </td>
                      {/* <td data-label="Status">{data.statusCode}</td> */}
                      <td
                        className={`${
                          data.statusCode === "ACTIVE"
                            ? "active-status-rrml"
                            : "Inactive-status-rrml"
                        }`}
                        data-label="Status"
                      >
                        {data.statusCode}
                      </td>
                      <td data-label="View">
                        <FontAwesomeIcon icon={faEye} />
                      </td>
                      <td data-label="Edit">
                        <Link
                          to={{
                            pathname: "/UAC/UserResource/Edit",
                            search: `?userResourceId=${encryptData(
                              data.userResourceId
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
   
    </div>
  );
};
export default UserResourceMappingList;
