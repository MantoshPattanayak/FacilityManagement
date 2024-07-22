import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../../../../utils/axios";
import { toast } from "react-toastify";
import { dataLength } from "../../../../utils/regexExpAndDataLength";

export default function CreateNewGallery() {
  const initialData = {
    facilityName: "",
    description: "",
    status: "",
    path: "",
    file: null,
  };
  const [formData, setFormData] = useState(initialData);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    console.log("changed data is here   :   ", formData);
  };

  const clearForm = () => {
    setFormData(initialData);
  };

  const handleSubmitForm = async () => {
    console.log("Form Data:", formData);

    const data = new FormData();
    data.append("facilityName", formData.facilityName);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("path", formData.path);
    data.append("fileAttachment", formData.file);

    try {
      let res = await axiosHttpClient("ADD_NEW_GALLERY_DATA_API", "post", {});
      console.log("here is the Response of posted data", res);
      if (res.status === 200) {
        // Ensure success status code is checked
        toast.success("Form submitted successfully!", {
          onClose: () => {
            setFormSubmitted(true); // Update the form submission status
          },
          autoClose: 3000,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.error("Conflict Error Response:", error.response.data);
        toast.error(
          ` ${error.response.data.data.toString()}. Please check and try again.`
        );
      } else {
        console.error("Error Response :", error.response || error);
        toast.error("Form submission failed. Kindly try again!");
      }
    }
  };

  return (
    <div className="CreateNewResourceContainer">
      <div className="form-heading">
        <h2>Create new Gallery</h2>
        <div className="flex flex-col-reverse items-end w-[100%]">
          <button className="back-button" onClick={(e) => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeftLong} /> Back
          </button>
        </div>
        <div className="grid grid-rows-4 grid-cols-2 gap-y-2 w-[100%]">
          <div className="form-group col-span-1">
            <label htmlFor="facilityName">
              Facility Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="facilityName"
              value={formData.facilityName}
              placeholder="Enter facility name"
              autoComplete="off"
              maxLength={dataLength.STRING_VARCHAR_SHORT}
              onChange={handleChange}
            />
            {/* {errors.name && <p className='error-message'>{errors.name}</p>} */}
          </div>
          <div className="form-group col-span-1">
            <label htmlFor="description">
              Description<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              placeholder="Enter description"
              autoComplete="off"
              maxLength={dataLength.STRING_VARCHAR_SHORT}
              onChange={handleChange}
            />
            {/* {errors.description && <p className='error-message'>{errors.description}</p>} */}
          </div>
          <div className="form-group col-span-1">
            <label htmlFor="status">
              Status<span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              autoComplete="off"
              onChange={handleChange}
            >
              <option value="1">ACTIVE</option>
              <option value="2">INACTIVE</option>
            </select>
            {/* {errors.parent && <p className='error-message'>{errors.parent}</p>} */}
          </div>
          <div className="form-group col-start-1 col-span-1">
            <label htmlFor="path">
              Route Path<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="path"
              value={formData.path}
              placeholder="Enter route path"
              autoComplete="off"
              maxLength={dataLength.STRING_VARCHAR_SHORT}
              onChange={handleChange}
            />
            {/* {errors.path && <p className='error-message'>{errors.path}</p>} */}
          </div>
          <div className="form-group col-span-2">
            <label htmlFor="file">
              Upload File<span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
            />
            {/* {errors.file && <p className='error-message'>{errors.file}</p>} */}
          </div>
        </div>
        <div className="buttons-container">
          <button className="approve-button" onClick={handleSubmitForm}>
            Submit
          </button>
          <button className="cancel-button" onClick={clearForm}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
