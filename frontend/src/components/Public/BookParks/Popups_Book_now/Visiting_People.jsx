import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./Visiting_People.css";
import { decryptData } from "../../../../utils/encryptData";
import Activity_Preference_popup from "./Activity_Preference_popup";
import { encryptData } from "../../../../utils/encryptData";
import { Link, useNavigate} from "react-router-dom";

const Visiting_People = ({ closePopup, facilityId, facilityName, operatingHoursFrom, operatingHoursTo }) => {
  const navigate = useNavigate();
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
    operatingHoursFrom:operatingHoursFrom,
    operatingHoursTo:operatingHoursTo,
    facilityId: decryptData(
      new URLSearchParams(location.search).get("facilityId")
    ),
    entityId: "",
    entityTypeId: "",
    facilityPreference: "",
    priceBook: 0,
  });

  console.log("facility id is here", formData.facilityId);

  const [showPeople, setShowPeople] = useState(false);
  const [close, setClose] = useState(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    let intValue = parseInt(value);
    const updatedFormData = {
      ...formData,
      [name]: isNaN(value) ? value : intValue,
    };

    if (["children", "seniorCitizen", "adults"].includes(name)) {
      updatedFormData.totalMembers =
        (name === "children" ? intValue : formData.children) +
        (name === "seniorCitizen" ? intValue : formData.seniorCitizen) +
        (name === "adults" ? intValue : formData.adults);
    }

    if (updatedFormData.totalMembers > 40) {
      // Display error message using toast or any other method
      updatedFormData.totalMembers = 40;
    }

    setFormData(updatedFormData);
  };

  const handleIncrease = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: prevData[type] + 1,
      totalMembers: prevData.totalMembers + 1,
    }));
  };

  const handleDecrease = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: Math.max(prevData[type] - 1, 0),
      totalMembers: Math.max(prevData.totalMembers - 1, 0),
    }));
  };

  const handleNext = () => {
    // Example of encrypting facilityId before passing it to another component
    formData.facilityId = encryptData(formData.facilityId);
    // Do something with encryptedFacilityId, such as passing it to another component
    setShowPeople(true);
  };

  const handleClose = () => {
    navigate(`/Sub_Park_Details?facilityId=${encodeURIComponent(encryptData(facilityId))}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <button className="icon-close" onClick={(e) => closePopup(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="popup-body">
          <h2 className="popup-title">{facilityName}</h2>
          <div className="member-details">
            <div className="member-row">
              <label htmlFor="children">Children(0-12)</label>
              <div className="increament_decrement_conatiner">
                <button
                type="button"
                 className="decrement-button"
                  onClick={() => handleDecrease("children")}
                  disabled={formData.children <= 0}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  type="text"
                  id="children"
                  name="children"
                  value={formData.children}
                  onChange={handleChangeInput}
                  className="formInput_Add_member"
                  min="0"
                />
                <button
                  className="increment-button"
                  onClick={() => handleIncrease("children")}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            <div className="member-row">
              <label htmlFor="adults">Adults(13-59)</label>
              <div className="increament_decrement_conatiner">
                <button
                className="decrement-button"
                  onClick={() => handleDecrease("adults")}
                  disabled={formData.adults <= 0}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  type="text"
                  id="adults"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChangeInput}
                  className="formInput_Add_member"
                  min="0"
                />
                <button
                type="button"
                   className="increment-button"
                  onClick={() => handleIncrease("adults")}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
            <div className="member-row">
              <label htmlFor="seniorCitizen">Senior Citizen(60+)</label>
              <div className="increament_decrement_conatiner">
                <button
                type="button"
                  className="decrement-button"
                  onClick={() => handleDecrease("seniorCitizen")}
                  disabled={formData.seniorCitizen <= 0}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  type="text"
                  id="seniorCitizen"
                  name="seniorCitizen"
                  value={formData.seniorCitizen}
                  onChange={handleChangeInput}
                  className="formInput_Add_member"
                  min="0"
                />
                <button
                  className="increment-button"
                  onClick={() => handleIncrease("seniorCitizen")}
                >
                    <    FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
  
            
          </div>
  
          <div className="popup-footer">
            <button className="cancel-button01" onClick={(e) => closePopup(false)}>
              Cancel
            </button>
            <button className="next-button" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
      {showPeople && <Activity_Preference_popup closePopup={closePopup} formData={formData} />}
    </div>
  </div>
  
  );
};

export default Visiting_People;
