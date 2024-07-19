import React, { useEffect, useState } from "react";
import "./EditRoleResourceMapping.css";
import PublicHeader from "../../../../../common/AdminHeader";
import CommonFooter1 from "../../../../../common/Common_footer1";
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData } from "../../../../../utils/encryptData";
import axiosHttpClient from "../../../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { dataLength } from "../../../../../utils/regexExpAndDataLength";
import { toast } from "react-toastify";

const EditRoleResourceMapping = () => {
  const location = useLocation();
  const roleResourceId = decryptData(
    new URLSearchParams(location.search).get("roleResourceId")
  );

  const action = new URLSearchParams(location.search).get("action");
  const navigate = useNavigate();
  console.log("id....", roleResourceId);

  //Data to show initially in form.....................
  let initialFormData = {
    role: "",
    resourceName: "",
    parentResourceName: "",
    status: "",
  };
  let modifiedFormData = {
    // role: "",
    // resourceName: "",
    // parentResourceName: "",
    // statusId: "",
    // id: "",
  };
  let statusId= "";
  let id= "";
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  //Data fetched here to be shown inside the form
  async function fetchDetails() {
    try {
      let res = await axiosHttpClient(
        "ROLE_RESOURCE_VIEW_BY_ID_API",
        "get",
        null,
        roleResourceId
      );
      console.log("ROLE_RESOURCE_VIEW_BY_ID_API...", res.data.data);

      let role = res.data.data[0].role;
      let resourceName = res.data.data[0].resourceName;
      let parentResourceName = res.data.data[0].parentResourceName;
      let status = res.data.data[0].status;
      console.log(role, resourceName, parentResourceName, status);

      setFormData({
        role: role || "",
        resourceName: resourceName || "",
        parentResourceName: parentResourceName || "",
        status: status || "",
      });
    } catch (error) {
      console.log("error of view of id role", error);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  //handleChange.........................................................
  function handleChange(e) {
    e.preventDefault();
    setErrors({});
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("changed formData", formData.status);
    return;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // setErrors({});
    id = roleResourceId
    statusId = formData.status
    try {
      let response = await axiosHttpClient(
        "ROLE_RESOURCE_UPDATE_API",
        "put",
        {
          // role: formData.role,
          // resourceName: formData.resourceName,
          // parentResourceName: formData.parentResourceName,
          id,
          statusId,
          
        },
        null
      );

      console.log(response.data);
      toast.success("User details updated sucessfully.", {
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error);
      toast.error("Please try again");
    }
  }

  return (
    <div className="CreateNewResourceContainer">
      <div className="form-heading">
        <h2>Edit Role Resource Mapping</h2>
        <div className="flex flex-col-reverse items-end w-[100%]">
          <button className="back-button" onClick={(e) => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeftLong} /> Back
          </button>
        </div>
        <div className="grid grid-rows-4 grid-cols-2 gap-y-2 w-[100%]">
          <div className="form-group col-span-1">
            <label htmlFor="input2">
              Role Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              placeholder="Role name"
              autoComplete="off"
              maxLength={dataLength.STRING_VARCHAR_SHORT}
              disabled
            />
            {/* {errors.name && <p className='error-message'>{errors.name}</p>} */}
          </div>
          <div className="form-group col-span-1">
            <label htmlFor="input2">
              Resource Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="resourceName"
              value={formData.resourceName}
              placeholder="Resource name"
              autoComplete="off"
              maxLength={dataLength.STRING_VARCHAR_SHORT}
              disabled
            />
            {/* {errors.description && <p className='error-message'>{errors.description}</p>} */}
          </div>
          <div className="form-group col-span-1">
            <label htmlFor="input2">
              parentResourceName<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="parentResourceName"
              value={formData.parentResourceName}
              placeholder="ParentResource Name"
              autoComplete="off"
              maxLength={dataLength.STRING_VARCHAR_SHORT}
              disabled
            />
            {/* {errors.description && <p className='error-message'>{errors.description}</p>} */}
          </div>

          <div className="form-group col-span-1">
            <label htmlFor="input2">
              Status<span className="text-red-500">*</span>
            </label>
            <select
              type="text"
              name="status"
              value={formData.status}
              autoComplete="off"
              maxLength={dataLength.STRING_VARCHAR_SHORT}
              onChange={handleChange}
              disabled={action == "view" ? true : false}
            >
              {/* <option value="">Select</option> */}
              <option value="1">ACTIVE</option>
              <option value="2">INACTIVE</option>
            </select>
            {/* {errors.parent && <p className='error-message'>{errors.parent}</p>} */}
          </div>
        </div>
        <div className="buttons-container">
          <button
            className="approve-button"
            onClick={handleSubmit}
            disabled={action == "view" ? true : false}
          >
            Submit
          </button>
          {/* <button className="cancel-button">Cancel</button> */}
        </div>
      </div>
    </div>
  );
};

export default EditRoleResourceMapping;
