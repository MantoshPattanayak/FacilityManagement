import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { faXmark, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./Booking_Schedule.css";
import Book_Now from "../Book_Now";
import { encryptData } from "../../../../utils/encryptData";
const Booking_Schedule = ({
  closePopup,
  formData,
  totalMembers,
  children,
  seniorCitizen,
  adults,
}) => {
  console.log("Received data in Booking_Schedule:", {
    formData,
    totalMembers,
    children,
    seniorCitizen,
    adults,
  });
  // const [showPeople, setShowPeople] = useState(false);
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    bookingDate: formData.bookingDate,
    startTime: formData.startTime,
    durationInHours: formData.durationInHours,
    totalMembers: totalMembers,
    children: children,
    seniorCitizen: seniorCitizen,
    adults: adults,
    amount: "10.00",
    activityPreference: formData.activityPreference,
    otherActivities: formData.otherActivities,
    facilityId: formData.facilityId,
    entityId: formData.entityId,
    entityTypeId: formData.entityTypeId,
    facilityPreference: formData.facilityPreference,
    priceBook: formData.priceBook,
  });

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleIncrease = (type) => {
    setBookingData((prevData) => ({
      ...prevData,
      [type]: prevData[type] + 1,
    }));
  };

  const handleDecrease = (type) => {
    setBookingData((prevData) => ({
      ...prevData,
      [type]: Math.max(prevData[type] - 1, 0),
    }));
  };

  function handleBookingData(e) {
    e.preventDefault();
    navigate(
      `/BookParks/Book_Now?d=${encodeURIComponent(
        encryptData(JSON.stringify(bookingData))
      )}&facilityId=${encryptData(facilityId)}`
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
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
            value={bookingData.bookingDate}
            onChange={handleChangeInput}
            className="custom-input"
          />

          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={bookingData.startTime}
            onChange={handleChangeInput}
            className="custom-input"
          />

          <label htmlFor="durationInHours">Duration (Hours):</label>
          <div className="duration-container">
            <button
              className="duration-button"
              onClick={() => handleDecrease("durationInHours")}
              disabled={bookingData.durationInHours <= 0}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <input
              type="number"
              id="durationInHours"
              name="durationInHours"
              value={bookingData.durationInHours}
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
            <button className="cancel-button">Cancel</button>
            <button className="next-button" onClick={handleBookingData}>
              Next
            </button>
          </div>
          {/* {showPeople && (
          <Book_Now
            closePopup={() => setShowPeople(false)}
            bookingData={bookingData}
          />
        )} */}
        </div>
      </div>
    </div>
  );
};

export default Booking_Schedule;
