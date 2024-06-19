import React, { useState, useEffect } from "react";
import "./CreateRoleResourceMapping.css";
import axiosHttpClient from "../../../../../utils/axios";
import CommonFooter1 from "../../../../../common/Common_footer1";
import PublicHeader from "../../../../../common/AdminHeader";
import { toast } from "react-toastify"; // Assuming toast is being used for notifications

const CreateRoleResourceMapping = () => {
  const [createRoleResource, setCreateRoleResource] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      let res = await axiosHttpClient("ROLE_RESOURCE_DATALOAD_API", "get");
      console.log("createRoleResource initial data fetch response", res.data);
      setCreateRoleResource(res.data);
    } catch (error) {
      console.error("error in fetching data", error);
    }
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems({
      ...checkedItems,
      [name]: checked,
    });
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmitForm = async () => {
    const selectedResources = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );
    const user = {
      roleId: selectedRole,
      resources: selectedResources,
    };

    try {
      let res = await axiosHttpClient("ROLE_RESOURCE_CREATE_API", "post", user);
      console.log("here Grievance Response", res);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Form submission failed. Kindly try again!");
    }
  };

  return (
    <div className="parentCreateRoleResMap">
      <PublicHeader />
      <div className="container-parent">
        <div className="headingHeader">
          <div className="heading">
            <div className="greenBar"></div>
            <h1 className="heading-title">Create Role Resource Mapping</h1>
          </div>
        </div>

        <div className="create-role-resource-mapping-container">
          <div className="left-container">
            {createRoleResource.resourceData?.map((parent, index) => (
              <div key={index}>
                <div className="CheckBoxCRRM">
                  <input
                    disabled
                    type="checkbox"
                    className="checkbox"
                    name={`parent-${parent.id}`}
                    checked={checkedItems[`parent-${parent.id}`] || false}
                    onChange={handleChange}
                  />
                  <label htmlFor={`parent-${parent.id}`}>{parent.name}</label>
                </div>

                {parent.children?.map((child) => (
                  <div className="ChildCheckBox" key={child.id}>
                    <div className="CheckBoxCRRM">
                      <input
                        type="checkbox"
                        className="checkbox"
                        name={`child-${child.id}`}
                        checked={checkedItems[`child-${child.id}`] || false}
                        onChange={handleChange}
                      />
                      <label htmlFor={`child-${child.id}`}>{child.name}</label>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="right-container">
            <div className="row">
              <div className="form-group">
                <label htmlFor="grievanceCategory">Select Role *</label>
                <select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  required
                >
                  <option value="" disabled>
                    Select Role Category
                  </option>
                  {createRoleResource.roleData?.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="submit-container">
          <button onClick={handleSubmitForm} className="submit-button">
            Submit
          </button>
        </div>
      </div>
      <CommonFooter1 />
    </div>
  );
};

export default CreateRoleResourceMapping;
