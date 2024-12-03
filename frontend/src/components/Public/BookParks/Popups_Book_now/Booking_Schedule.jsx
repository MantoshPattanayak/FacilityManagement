import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faXmark,
  faMinus,
  faPlus,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { decryptData, encryptData } from "../../../../utils/encryptData";
import "./Booking_Schedule.css";

const Booking_Schedule = ({
  closePopup,
  formData,
  totalMembers,
  children,
  seniorCitizen,
  adults,
}) => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    bookingDate: formData.bookingDate,
    // startTime: formData.operatingHoursFrom.slice(0, 5),
    startTime: moment().format("HH:mm"),
    endTime: formData.operatingHoursTo.slice(0, 5),
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

  console.log("all data  :" , formData)

  const [bookingDate, setBookingDate] = useState(formData.bookingDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(moment().hour());
  const [selectedMinute, setSelectedMinute] = useState(moment().minute());
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));
  const [hourChanged, setHourChanged] = useState(false);
  const [minuteChanged, setMinuteChanged] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format("HH:mm"));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update bookingData when bookingDate changes
  useEffect(() => {
    setBookingData((prevData) => ({
      ...prevData,
      bookingDate: bookingDate,
    }));
  }, [bookingDate]);

  const handleDateClick = (date) => {
    setBookingDate(date);
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

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

  const handleClockIconClick = () => {
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    setHourChanged(true);
    if (minuteChanged) {
      setBookingData((prevData) => ({
        ...prevData,
        startTime: moment().hour(hour).minute(selectedMinute).format("HH:mm"),
      }));
      setShowTimePicker(false);
    }
  };

  const handleMinuteSelect = (minute) => {
    setSelectedMinute(minute);
    setMinuteChanged(true);
    if (hourChanged) {
      setBookingData((prevData) => ({
        ...prevData,
        startTime: moment().hour(selectedHour).minute(minute).format("HH:mm"),
      }));
      setShowTimePicker(false);
    }
  };

  const handleBookingData = (e) => {
    const bookingDataWithActivity = {
      ...bookingData,
      activityPreferenceData: formData.activityPreference || [], // Add activityPreferenceData here
    };
  
    // Encrypt the data
    const encryptedData = encryptData(JSON.stringify(bookingDataWithActivity));
    const encryptedFacilityId = encryptData(bookingData.facilityId);
    navigate(
      `/BookParks/Book_Now?d=${encodeURIComponent(
        encryptedData
      )}&facilityId=${encodeURIComponent(encryptedFacilityId)}`
    );
  };

  const formatTime = (time) => {
    return moment(time, "HH:mm").format("HH:mm");
  };

  const renderHours = () => {
    const hours = [];
    const isToday = moment(bookingDate).isSame(moment(), "day");
    const currentHour = moment().hour() + 1;
    const closingTime = moment(formData.operatingHoursTo, "HH:mm:ss")
      .subtract(30, "minutes")
      .hour();

    const startHour = isToday
      ? currentHour
      : moment(formData.operatingHoursFrom, "HH:mm:ss").hour();
    const endHour = isToday
      ? closingTime
      : moment(formData.operatingHoursTo, "HH:mm:ss").hour();

    for (let hour = startHour; hour <= endHour; hour++) {
      hours.push(
        <li key={hour} onClick={() => handleHourSelect(hour)}>
          {hour < 10 ? `0${hour}` : hour}
        </li>
      );
    }
    return hours;
  };

  const renderMinutes = () => {
    const minutes = [];
    for (let minute = 0; minute < 60; minute += 10) {
      minutes.push(
        <li key={minute} onClick={() => handleMinuteSelect(minute)}>
          {minute < 10 ? `0${minute}` : minute}
        </li>
      );
    }
    return minutes;
  };

  const toggleDatePicker = () => {
    setShowTimePicker(false);
    // setShowDatePicker(!showDatePicker);
  };

  const toggleTimePicker = () => {
    setShowDatePicker(false);
    setShowTimePicker(!showTimePicker);
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };

  const renderNext10Days = () => {
    const dates = [];
    for (let i = 0; i < 10; i++) {
      dates.push(moment().add(i, "days").format("YYYY-MM-DD"));
    }
    return dates.map((date) => (
      <div
        className="DateItem"
        key={date}
        onClick={() => handleDateClick(date)}
      >
        {date}
      </div>
    ));
  };

  return (
    <div className="main_conatiner_booking_schedule  fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="booking-schedule-popup">
        <div className="popup-header">
          <button className="icon-close" onClick={() => closePopup(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="booking-details">
          <div className="wrapper">
            <label htmlFor="bookingDate">Booking Date:</label>
            <input
              type="text"
              id="bookingDate"
              name="bookingDate"
              value={bookingDate}
              onFocus={() => setShowDatePicker(true)}
              onChange={handleChangeInput}
              className="input-field"
              onClick={toggleDatePicker}
            />
            {showDatePicker && (
              <div className="DatePickerContainer">{renderNext10Days()}</div>
            )}
          </div>

          <label htmlFor="startTime">Start Time:</label>
          <div className="time-input-container">
            <input
              type="text"
              id="startTime"
              name="startTime"
              value={formatTime(bookingData.startTime)}
              onChange={handleChangeInput}
              className="custom-input"
              onClick={toggleTimePicker}
            />
            <button
              className="clock-icon"
              onClick={handleClockIconClick}
              title="Set current or opening time"
            >
              <FontAwesomeIcon icon={faClock} />
            </button>
            {showTimePicker && (
              <div className="time-picker-dropdown">
                <div className="column">
                  <h3>Hours</h3>
                  <ul>{renderHours()}</ul>
                </div>
                <div className="column">
                  <h3>Minutes</h3>
                  <ul>{renderMinutes()}</ul>
                </div>
              </div>
            )}
          </div>

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
              onChange={handleDurationChange}
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
            <button className="cancel-button01" onClick={() => closePopup(false)}>
              Cancel
            </button>
            <button className="next-button" onClick={handleBookingData}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking_Schedule;
