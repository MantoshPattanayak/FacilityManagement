import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import {
  faXmark,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import './Booking_Schedule.css';

const Booking_Schedule = ({ closePopup }) => {
  const [formData, setFormData] = useState({
    totalMembers: 0,
    children: 0,
    seniorCitizen: 0,
    adults: 0,
    amount: "10.00",
    activityPreference: [],
    otherActivities: "",
    bookingDate: new Date().toISOString().split("T")[0],
    startTime: new Date().toTimeString().split(" ")[0],
    durationInHours: 0,
    facilityId: "",
    entityId: "",
    entityTypeId: "",
    facilityPreference: "",
    priceBook: 0,
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    let intValue = parseInt(value);
    const updatedFormData = {
      ...formData,
      [name]: isNaN(value) ? value : intValue,
    };

    setFormData(updatedFormData);
  };

  const handleIncrease = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: prevData[type] + 1,
    }));
  };

  const handleDecrease = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: Math.max(prevData[type] - 1, 0),
    }));
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30  flex justify-center items-center'>
      <div className="booking-schedule-popup">
        <div className="popup-header">
          <button className="icon-close" onClick={closePopup}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="booking-details">
          <label htmlFor="bookingDate">Booking Date:</label>
          <input
            type="date"
            id="bookingDate"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChangeInput}
            className="custom-input"
          />

          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChangeInput}
            className="custom-input"
          />

          <label htmlFor="durationInHours">Duration (Hours):</label>
          <div className="duration-container">
            <button
              className="duration-button"
              onClick={() => handleDecrease("durationInHours")}
              disabled={formData.durationInHours <= 0}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <input
              type="number"
              id="durationInHours"
              name="durationInHours"
              value={formData.durationInHours}
              onChange={handleChangeInput}
              className="custom-input"
              min="0"
            />
            <button
              className="duration-button"
              onClick={() => handleIncrease("durationInHours")}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className="popup-footer">
            <button className="cancel-button" onClick={closePopup}>Cancel</button>
            <Link to='/BookParks/Book_Now' >
            <button className="next-button" >Next</button>
            </Link>            
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking_Schedule;
