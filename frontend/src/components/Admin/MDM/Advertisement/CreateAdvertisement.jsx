import React, { useState, useEffect } from "react";
import AdminHeader from "../../../../common/AdminHeader";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosHttpClient from "../../../../utils/axios";
import api from "../../../../utils/api";
import { toast } from "react-toastify";
import "./CreateAdvertisement.css";

function CreateAdvertisement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    advertisementType: "",
    description: "",
    durationOption: [],
  });
  const [errors, setErrors] = useState({
    advertisementType: "",
    description: "",
    durationOption: "",
  });

  // validation function to validate form data
  let validation = (formData) => {
    let error = {};

    if (!formData.advertisementType) {
      error.advertisementType = "Please enter advertisement type.";
    }
    if (!formData.description) {
      error.description = "Please enter description.";
    }
    if (formData.durationOption.length === 0) {
      error.durationOption = "Please select at least one duration option.";
    }

    return error;
  };

  // handle change for form inputs
  let handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        durationOption: checked
          ? [...prevState.durationOption, value]
          : prevState.durationOption.filter((option) => option !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
    console.log("formData", formData);
  };

  // createbapi

  // submit form data
  let handleSubmit = async () => {
    // let errors = validation(formData);
    // setErrors(errors);
    // if (Object.keys(errors).length > 0) {
    //   toast.error("Please enter proper values.");
    //   return;
    // }

    try {
      let res = await axiosHttpClient(
        "CREATE_ADVARTISEMENT_API",
        "post",
        formData
      );

      toast.success(res.data.message, {
        autoClose: 3000,
        onClose: () => {
          setTimeout(() => {
            navigate("/MDM/ViewAdvertisements");
          }, 1000);
        },
      });
      console.log(res);
    } catch (error) {
      console.error("API error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      toast.error(
        error.response?.data?.message || "Error creating advertisement."
      );
    }
  };

  // clear form
  let clearForm = () => {
    setFormData({
      advertisementType: "",
      description: "",
      durationOption: [],
    });
    setErrors({
      advertisementType: "",
      description: "",
      durationOption: "",
    });
  };

  useEffect(() => {}, [formData, errors]);

  return (
    <div>
      <AdminHeader />
      <div className="form-container">
        <div className="form-heading">
          <h2>Create Advertisement</h2>
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="advertisementType">
            Advertisement Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="advertisementType"
            value={formData.advertisementType}
            onChange={handleChange}
          />
          {errors.advertisementType && (
            <p className="error-message">{errors.advertisementType}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          ></textarea>
          {errors.description && (
            <p className="error-message">{errors.description}</p>
          )}
        </div>

        <div className="form-group">
          <label>
            Duration Option <span className="text-red-500">*</span>
          </label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="durationOption"
                value="day"
                onChange={handleChange}
                checked={formData.durationOption.includes("day")}
              />
              Day
            </label>
            <label>
              <input
                type="checkbox"
                name="durationOption"
                value="week"
                onChange={handleChange}
                checked={formData.durationOption.includes("week")}
              />
              Week
            </label>
          </div>
          {errors.durationOption && (
            <p className="error-message">{errors.durationOption}</p>
          )}
        </div>

        <div className="buttons-container">
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
          <button className="cancel-button" onClick={clearForm}>
            Cancel
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateAdvertisement;
