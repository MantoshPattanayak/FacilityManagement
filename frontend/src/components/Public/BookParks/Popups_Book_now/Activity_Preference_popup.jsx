import React, { useState, useEffect } from 'react';
import './Activity_Preference_popup.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import PublicHeader from "../../../../common/PublicHeader";
import axiosHttpClient from '../../../../utils/axios'; 
import { decryptData } from '../../../../utils/encryptData'; 
import Booking_Schedule from './Booking_Schedule';

const Activity_Preference_popup = () => {
    const [showPeople, setShowPeople] = useState(false);

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
    const [activityPreferenceData, setActivityPreferenceData] = useState([]);
    const [selectedGames, setSelectedGames] = useState([]);

    const location = useLocation();
    let facilityId = decryptData(new URLSearchParams(location.search).get("facilityId"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosHttpClient("PARK_BOOK_PAGE_INITIALDATA_API", "get");
                setActivityPreferenceData(res.data.data);
            } catch (err) {
                console.error("Error fetching initial data", err);
            }
        };

        fetchData();
    }, []);

    const handleGameClick = (game) => {
        setSelectedGames((prevGames) =>
          prevGames.includes(game)
            ? prevGames.filter((item) => item !== game)
            : [...prevGames, game]
        );
      };

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
          toast.error("Total members cannot exceed 40.");
          updatedFormData.totalMembers = 40;
        }
    
        setFormData(updatedFormData);
      };
  
    return (
        
      <div className=' fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
      <div className='activity_preference_popup '>
  
        <div className="activity-preference">
        <button className="icon-close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <span>Activity Preference</span>
          <div className="games">
            {activityPreferenceData?.length > 0 &&
              activityPreferenceData.map(activity => (
                <button
                  key={activity.userActivityId}
                  className={`game-btn ${selectedGames.includes(activity.userActivityId) ? "selected" : ""}`}
                  onClick={() => handleGameClick(activity.userActivityId)}
                >
                  {activity.userActivityName}
                </button>
              ))}
          </div>
        </div>
        <div className="other-activities">
          <label htmlFor="otherActivities">Other Activities (if any)</label>
          <input
            type="text"
            name="otherActivities"
            value={formData.otherActivities}
            id="otherActivities"
            className="input-field-otheractivities"
            onChange={handleChangeInput}
          />
        </div>
        <div className="popup-footer">
            <button className="cancel-button" >Cancel</button>
            <button className="next-button"  onClick={() => setShowPeople(true)} >Next</button>
          </div>
        {/* Add more JSX as needed */}
      </div>
      {showPeople && <Booking_Schedule />}

      </div>
    );
};

export default Activity_Preference_popup;
