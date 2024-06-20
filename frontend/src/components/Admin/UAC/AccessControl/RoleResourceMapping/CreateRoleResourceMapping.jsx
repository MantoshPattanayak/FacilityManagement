import React, { useState, useEffect } from "react";
import "./CreateRoleResourceMapping.css";
import axiosHttpClient from "../../../../../utils/axios";
import CommonFooter1 from "../../../../../common/Common_footer1";
import PublicHeader from "../../../../../common/AdminHeader";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateRoleResourceMapping = () => {
  const [createRoleResource, setCreateRoleResource] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

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

    if (selectedResources.length === 0) {
      toast.error("Please select at least one resource.");
      console.log("Please select at least one resource.");
      return;
    }

    const formData = {
      role: selectedRole,
      statusId: 1,
      resourceList: selectedResources.map((resource) => {
        return resource.split("-")[1];
      }),
    };

    console.log("Form Data:", formData);

    // try {
    //   let res = await axiosHttpClient(
    //     "ROLE_RESOURCE_CREATE_API",
    //     "post",
    //     formData
    //   );
    //   console.log("here is the Response 1919", res);
    //   toast.success("Form submitted successfully!");
    // } catch (error) {
    //   console.error("Error Response 9900:", error.response);
    //   toast.error("Form submission failed. Kindly try again!");
    // }
    try {
      let res = await axiosHttpClient(
        "ROLE_RESOURCE_CREATE_API",
        "post",
        formData
      );
      console.log("here is the Response 1919", res);
      // toast.success("Form submitted successfully!");
      if (res.status === 200) {
        // Ensure success status code is checked
        toast.success("Form submitted successfully!", {
          onClose: () => {
            setFormSubmitted(true); // Update the form submission status
          },
          autoClose: 3000, // Adjust the autoClose duration if needed
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("Conflict Error Response:", error.response.data);
        toast.error(
          `Some resources are already mapped with the role, i.e., ${error.response.data.data.toString()}. Please check and try again.`
        );
      } else {
        console.error("Error Response :", error.response || error);
        toast.error("Form submission failed. Kindly try again!");
      }
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      navigate("/UAC/RoleResource/View");
    }
  }, [formSubmitted, navigate]);

  return (
    <div className="parentCreateRoleResMap">
      <PublicHeader />
      <ToastContainer />
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
    </div>
  );
};

export default CreateRoleResourceMapping;
