import "../../../../../common/CommonTable.css";
import AdminHeader from "../../../../../common/AdminHeader";
import Footer from "../../../../../common/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosHttpClient from "../../../../../utils/axios";

const RoleResourceMappingList = () => {
  const [tableData, setTableData] = useState([]);
  const [givenReq, setGivenReq] = useState();
  const navigate = useNavigate();

  async function fetchRoleResourceMappingListData() {
    try {
      let res = await axiosHttpClient("ROLE_RESOURCE_VIEW_API", "get");

      console.log("response", res.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchRoleResourceMappingListData();
  }, []);

  return (
    <>
      <AdminHeader />
      <div className="Main_Conatiner_table">
        <div className="editRoleResMapHead">
          <div className="editRoleResMapHeadIn">
            <div className="greenBar"></div>
            <h2>Role Resource Mapping List</h2>
          </div>
        </div>

        <div className="search_text_conatiner">
          <button
            className="search_field_button"
            onClick={() => navigate("/UAC/RoleResource/Create")}
          >
            Create new role-resource mapping
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
                tableData?.map((data) => {
                  return (
                    <tr key={data.id}>
                      <td data-label="Name">{data.userName}</td>
                      <td data-label="Number">{data.resourceName}</td>
                      <td data-label="Email">{data.parentResourceName}</td>
                      <td data-label="Status">{data.status}</td>
                      <td data-label="View">
                        <Link
                          to={{
                            pathname: "/UAC/RoleResource/Edit",
                            search: `?roleResourceId=${encryptDataId(
                              data.id
                            )}&action=view`,
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td>
                      <td data-label="Edit">
                        <Link
                          to={{
                            pathname: "/UAC/RoleResource/Edit",
                            search: `?roleResourceId=${encryptDataId(
                              data.id
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
      <Footer />
    </>
  );
};
export default RoleResourceMappingList;
