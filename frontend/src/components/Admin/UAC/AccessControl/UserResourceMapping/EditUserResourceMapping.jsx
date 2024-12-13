import React from "react";
import "../RoleResourceMapping/EditRoleResourceMapping.css";
import "./EditUserResourceMapping.css";
import { useLocation } from "react-router-dom";
import { decryptData, encryptData } from "../../../../../utils/encryptData";
import { useEffect, useState } from "react";
import axiosHttpClient from "../../../../../utils/axios";

const EditUserResourceMapping = () => {
  const [tableData, setTableData] = useState([]);
  const [uniqueResourceNames, setUniqueResourceNames] = useState([]);
  const [uniqueParentResourceNames, setUniqueParentResourceNames] = useState(
    []
  );
  const [formData, setFormData] = useState({
    userName: "",
    resourceName: "",
    parentResourceName: "",
    statusCode: "",
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = decryptData(queryParams.get("userResourceId"));
  // const action = queryParams.get("action");
  console.log("here is thesent  id", id);

  async function fetchUserRoleResourceMappingListData() {
    try {
      let res = await axiosHttpClient("USER_RESOURCE_VIEW_API", "post");
      console.log("UserRoleResourceMappingListData is here: ", res);

      //Decrypting userName
      const decryptedData = res.data.data.map((item) => ({
        ...item,
        userName: decryptData(item.userName),
      }));
      console.log(decryptedData);
      setTableData(decryptedData);

      // Get unique resource names
      const uniqueDescriptions = decryptedData.reduce((acc, current) => {
        if (!acc.some((item) => item.description === current.description)) {
          acc.push(current);
        }
        return acc;
      }, []);
      setUniqueResourceNames(uniqueDescriptions);

      // Get unique Parent resource names
      const uniqueParentRes = decryptedData.reduce((acc, current) => {
        if (
          !acc.some(
            (item) => item.parentResourceName === current.parentResourceName
          )
        ) {
          acc.push(current);
        }
        return acc;
      }, []);
      setUniqueParentResourceNames(uniqueParentRes);

      // Find the specific data by id
      const userData = tableData.find((item) => item.userResourceId == id);
      if (userData) {
        setFormData({
          userName: userData.userName,
          resourceName: userData.description,
          parentResourceName: userData.parentResourceName,
          statusCode: userData.statusCode,
        });
      }
    } catch (error) {
      console.error("error UserRoleResMapList: ", error);
    }
  }

  useEffect(() => {
    fetchUserRoleResourceMappingListData();
  }, [id]);

  return (
    <div className="EditUserResource">
      <div className="form-heading11">
        <div className="headingHeader">
          <div className="headingHeader11">
            <div className="heading11">
              <h1 className="heading-title">Role Resource Edit</h1>
            </div>
          </div>
        </div>
        <div className="form-grid1">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="userName">Role Name</label>
              <input
                type="text"
                id="userName"
                placeholder="User Name"
                value={formData.userName}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="input2">Resource Name</label>
              <select
                id="resourceName"
                className="selectInput"
                value={formData.resourceName}
                onChange={(e) =>
                  setFormData({ ...formData, resourceName: e.target.value })
                }
              >
                {uniqueResourceNames.map((item, index) => (
                  <option key={index}>{item.description}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input2">Parent Resource Name</label>
              <select
                id="parentResourceName"
                className="selectInput"
                value={formData.parentResourceName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parentResourceName: e.target.value,
                  })
                }
              >
                <option value={formData.parentResourceName} selected>
                  {formData.parentResourceName}
                </option>
                {uniqueParentResourceNames.map((item, index1) => (
                  <option key={index1}>{item.parentResourceName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="input2">Status</label>
              <select
                id="statusCode"
                className="selectInput"
                value={formData.statusCode}
                onChange={(e) =>
                  setFormData({ ...formData, statusCode: e.target.value })
                }
              >
                <option value="" disabled selected>
                  Select Status
                </option>
                <option value="Role1">Active</option>
                <option value="Role2">Inactive</option>
              </select>
            </div>
          </div>
          {/* End of form-row */}
        </div>
      </div>
    </div>
  );
};

export default EditUserResourceMapping;
