import React, { useState, useEffect } from "react";
import "./CreateRoleResourceMapping.css";
import axiosHttpClient from "../../../../../utils/axios";
import CommonFooter1 from "../../../../../common/Common_footer1";
import AdminHeader from "../../../../../common/AdminHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

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
    <div>
      <AdminHeader />
      <div className="CreateNewResourceContainer">
        <div className="form-heading">
          <h2>Create Role Resource Mapping</h2>
          <div className="flex flex-col-reverse items-end w-[100%]">
            <button
              className='back-button'
              onClick={(e) => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
          </div>
          <div className="grid grid-rows-1 grid-cols-2 gap-y-2 w-[100%] h-fit">
            <div className="form-group col-span-1">
              <label htmlFor="input2">Resource Name<span className='text-red-500'>*</span></label>
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
              {/* {errors.name && <p className='error-message'>{errors.name}</p>} */}
            </div>
            <div className="form-group col-span-1">
              <div className="right-container">
                <label htmlFor="input2">Parent Resource Name<span className='text-red-500'>*</span></label>
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
              {/* {errors.parent && <p className='error-message'>{errors.parent}</p>} */}
            </div>
          </div>
          <div className="buttons-container">
            <button className="approve-button" onClick={handleSubmitForm}>Submit</button>
            {/* <button className="cancel-button" onClick={clearForm}>Cancel</button> */}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateRoleResourceMapping;
