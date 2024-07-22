import { React, useEffect, useState } from "react";
import axiosHttpClient from "../../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function ViewGalleryList() {
  const [tableData, setTableData] = useState([]);

  async function fetchGalleryListData() {
    try {
      let res = await axiosHttpClient("FETCH_GALLERY_LIST_DATA_API", "post");
      
    //   const dataArray = Object.values(res.data.data[0]);
      setTableData(res.data.data);
      console.log("table data is :", res.data.data);
    //   console.log("table data description is :", tableData[0].description);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchGalleryListData();
  }, []);

  return (
    <div className="Main_Conatiner_table">
      <div className="headingHeader">
        <div className="heading">
          <div className="greenBar"></div>
          <h1 className="heading-title">Gallery List</h1>
        </div>
      </div>

      <div className="search_text_conatiner2">
        <button
          className="search_field_button"
          // onClick={() => navigate("/UAC/RoleResource/CreateRoleResourceMapping")}
        >
          Add new Files
        </button>
        <input
          type="text"
          className="search_input_field"
          // value={givenReq}
          placeholder="Search..."
          // onChange={(e) => setGivenReq(e.target.value)}
        />
      </div>

      <div className="table_Container">
        <table className="rrmlTh">
          <thead>
            <tr>
              <th scope="col">Sl No.</th>
              <th scope="col">File Name</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col">URL</th>
              <th scope="col">view</th>
              <th scope="col">edit</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.length > 0 &&
              tableData.map((data,index) => {
                return (
                  <tr key={data.galleryId}>
                    <td data-label="Sl No.">{index+1}</td>
                    <td data-label="File Name">{data.fileName}</td>
                    <td data-label="Description">
                      {data.description ? data.description : "NA"}
                    </td>
                    <td
                      className={`${
                        data.statusCode === "ACTIVE"
                          ? "active-status-rrml"
                          : "Inactive-status-rrml"
                      }`}
                      data-label="Status"
                    >
                      {data.statusCode === "ACTIVE" && "Active"}
                      {data.statusCode === "INACTIVE" && "Inactive"}
                    </td>
                    <td data-label="File path">{data.url}</td>
                    <td data-label="View">
                      {/* <Link
                        to={{
                          pathname: "/UAC/RoleResource/EditRoleResourceMapping",
                          search: `?roleResourceId=${encryptData(
                            data.galleryId
                          )}&action=view`,
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Link> */}
                      <FontAwesomeIcon icon={faEye} />
                    </td>
                    <td data-label="Edit">
                      {/* <Link
                        to={{
                          pathname: "/UAC/RoleResource/EditRoleResourceMapping",
                          search: `?roleResourceId=${encryptData(
                            data.galleryId
                          )}&action=edit`,
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Link> */}
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
