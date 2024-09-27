import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosHttpClient from "../../../../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import AdminHeader from "../../../../common/AdminHeader";
import "./UpdateAdvertisement.css";

function UpdateAdvertisement() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { advertisement } = state;

  const [formData, setFormData] = useState({
    advertisementTypeId: advertisement.advertisementTypeId, 
    advertisementType: advertisement.advertisementType || "",
    description: advertisement.description || "",
    durationOption: Array.isArray(advertisement.durationOption) ? advertisement.durationOption : [],
    statusId: advertisement.statusId || 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
  };

  const handleSubmit = async () => {
    try {
      let res = await axiosHttpClient("UPDATE_ADVARTISEMENT_API", "put", formData);
      console.log('form submit response', res.data);
      toast.success("Advertisement updated successfully!", {
        autoClose: 3000,
        onClose: () => {
          setTimeout(() => navigate("/MDM/ViewAdvertisements"), 1000);
        },
      });
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      toast.error("Failed to update advertisement.");
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="form-container">
        <h2>Update Advertisement</h2>

        <div className="form-group">
          <label>Advertisement Type</label>
          <input
            type="text"
            name="advertisementType"
            value={formData.advertisementType}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Duration Option</label>
          <div>
            <label>
              <input
                type="checkbox"
                value="day"
                onChange={handleChange}
                checked={formData.durationOption.includes("day")}
              />
              Day
            </label>
            <label>
              <input
                type="checkbox"
                value="month"
                onChange={handleChange}
                checked={formData.durationOption.includes("month")}
              />
              Month
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="statusId"
            value={formData.statusId}
            onChange={handleChange}
          >
            <option value={1}>ACTIVE</option>
            <option value={0}>INACTIVE</option>
          </select>
        </div>

        <div className="form-group">
          <button className="submit-button" onClick={handleSubmit}>
            Update Advertisement
          </button>
          <button className="cancel-button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default UpdateAdvertisement;
