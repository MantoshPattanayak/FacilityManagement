import React, { useEffect, useState } from "react";
import "../../Public/BookParks/Book_Now.css";
import AdminHeader from "../../../common/AdminHeader";
import CommonFooter from "../../../common/CommonFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faXmark,
  faCreditCard,
  faPlus,
  faMinus,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../../../utils/axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { decryptData, encryptData } from "../../../utils/encryptData";
import { ToastContainer, toast } from "react-toastify";
import PublicHeader from "../../../common/PublicHeader";
import RazorpayButton from "../../../common/RazorpayButton";

const Book_Now = () => {
  const [selectedGames, setSelectedGames] = useState([]);
  const [FacilitiesData, setFacilitiesData] = useState([]);
  const [activityPreferenceData, setActivityPreferenceData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [amount1, setAmount1] = useState([0]);

  const location = useLocation();
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
    durationInHours: 1,
    facilityId: "",
    entityId: "",
    entityTypeId: "",
    facilityPreference: "",
    priceBook: 0,
  });

  let facilityId = decryptData(new URLSearchParams(location.search).get("facilityId"));
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getSub_park_details(facilityId);
    getParkBookingInitialData();
  }, []);

  useEffect(() => {
    console.log("selectedGames", selectedGames);
    if(selectedGames.length > 0) {
      setFormData(prevState => ({
        ...prevState,
        ['activityPreference']: selectedGames
      }));
    }
    console.log("formData", formData);
  }, [refresh, selectedGames]);

  async function getSub_park_details(facilityId) {
    try {
      let res = await axiosHttpClient("View_By_ParkId", "get", "", facilityId);
      console.log("view park details", res.data.facilitiesData[0]);
      setFacilitiesData(res.data.facilitiesData[0]);
      setFormData((prevData) => ({
        ...prevData,
        entityTypeId: res.data.facilitiesData[0].facilityTypeId,
        facilityId,
        entityId: facilityId,
      }));
    } catch (err) {
      console.error("Error fetching park data", err);
    }
  }

  async function getParkBookingInitialData() {
    try {
      let res = await axiosHttpClient("PARK_BOOK_PAGE_INITIALDATA_API", "get");
      setActivityPreferenceData(res.data.data);
    } catch (err) {
      console.error("Error fetching initial data", err);
    }
  }

  const handleGameClick = (game) => {
    setSelectedGames((prevGames) =>
      prevGames.includes(game)
        ? prevGames.filter((item) => item !== game)
        : [...prevGames, game]
    );
    // setFormData((prevState) => ({
    //   ...prevState,
    //   ["activityPreference"]: prevState.activityPreference.includes(game) ? prevState.activityPreference.filter((item) => item !== game) : [...prevState.activityPreference, game]
    // }))
    setIsDisabled(validateForm(formData));
    setRefresh(prevState => !prevState);
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

    setAmount1(formData.amount);
    // setIsDisabled(updatedFormData.totalMembers > 40);
    setIsDisabled(validateForm(updatedFormData));
    setFormData(updatedFormData);
    setRefresh(prevState => !prevState);
  };

  const handleDecrease = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: Math.max(0, prevData[field] - 1),
    }));
    setIsDisabled(validateForm(formData));
    setRefresh(prevState => !prevState);
  };

  const handleIncrease = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field] + 1,
    }));
    setIsDisabled(validateForm(formData));
    setRefresh(prevState => !prevState);
  };

  const handleAddtoCart = async () => {
    let modifiedFormData = {
      ...formData,
      activityPreference: selectedGames,
    };

    if (validateForm(modifiedFormData)) {
      try {
        const facilityPreference = {
          totalMembers: modifiedFormData.totalMembers,
          activityPreference: modifiedFormData.activityPreference,
          otherActivities: modifiedFormData.otherActivities,
          bookingDate: modifiedFormData.bookingDate,
          startTime: modifiedFormData.startTime,
          duration: modifiedFormData.durationInHours,
          price: amount1 * modifiedFormData.adults,
        };

        const requestBody = {
          entityId: modifiedFormData.entityId,
          entityTypeId: modifiedFormData.entityTypeId,
          facilityPreference,
        };

        let res = await axiosHttpClient("Add_to_Cart", "post", requestBody);
        toast.success("Added to cart successfully.", {
          autoClose: 3000,
          onClose: () => {
            setTimeout(() => {
              navigate("/BookParks/Add_Card");
            }, 1000);
          },
        });
      } catch (error) {
        console.error("Error adding to cart", error);
        toast.error("Add to Cart failed. Try again.");
      }
    } else {
      toast.error("Please fill the required data.");
    }
  };

  const handleSubmitAndProceed = async () => {
    let modifiedFormData = {
      ...formData,
      ["totalMembers"]: formData.children + formData.seniorCitizen + formData.adults,
      activityPreference: selectedGames,
    };
    console.log("modifiedFormData", modifiedFormData);

    if (validateForm(modifiedFormData) && modifiedFormData.totalMembers <= 40) {
      try {
        const facilityPreference = {
          totalMembers: modifiedFormData.totalMembers,
          amount: amount1 * modifiedFormData.adults,
          activityPreference: modifiedFormData.activityPreference,
          otherActivities: modifiedFormData.otherActivities,
          bookingDate: modifiedFormData.bookingDate,
          startTime: modifiedFormData.startTime,
          durationInHours: modifiedFormData.durationInHours,
        };

        let res = await axiosHttpClient("PARK_BOOK_PAGE_SUBMIT_API", "post", {
          entityId: modifiedFormData.entityId,
          entityTypeId: modifiedFormData.entityTypeId,
          facilityPreference,
        });

        toast.success("Park has been booked successfully.", {
          autoClose: 3000,
          onClose: () => {
            setTimeout(() => {
              navigate("/profile/booking-details");
            }, 1000);
          },
        });
      } catch (error) {
        console.error("Error booking park", error);
        toast.error("Booking details submission failed.");
      }
    } else {
      toast.error("Please fill the required data.");
    }

  };

  const handlePaymentSuccess = (response) => {
    console.log("Book park payment success", response);
    handleSubmitAndProceed();
  }

  const handlePaymentFailure = (response) => {
    console.log("Book park payment failure", response);
  }

  const validateForm = (formData) => {
    let errors = {};
    console.log("formData", formData.activityPreference, selectedGames);
    if (formData.totalMembers > 0 && formData.totalMembers <= 40 ) errors.totalMembers = "Please provide number of members between 0 and 40";
    if (!formData.bookingDate) errors.date = "Please provide date.";
    if (!formData.startTime) errors.startTime = "Please provide Start time.";
    if (!formData.durationInHours) errors.durationInHours = "Please provide duration.";
    if(formData.activityPreference.length < 1 || selectedGames.length < 1) errors.activityPreference = "Please select an activity.";
    console.log(errors);
    return Object.keys(errors).length === 0 ? false : true;
  };

  return (
    <div className="Book_Now_Min_conatiner">
      <PublicHeader />
      <div className="booknow-container">
        <div className="park-container">
          <div className="heading_BookNow">
            <h1> <b>{FacilitiesData?.facilityName || "Park Name"}</b></h1>
          </div>

          <div className="form_BookNow">
            <div className="member-details">
              <label htmlFor="children">Children (0-12):</label>
              <div className="duration-container">
                <button
                  className="duration-button"
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
                  className="custom-input"
                  min="0"
                />
                <button
                  className="duration-button"
                  onClick={() => handleIncrease("children")}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  
                </button>
              </div>

              <label htmlFor="seniorCitizen">Senior Citizen (60+):</label>
              <div className="duration-container">
                <button
                  className="duration-button"
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
                  className="custom-input"
                  min="0"
                />
                <button
                  className="duration-button"
                  onClick={() => handleIncrease("seniorCitizen")}
                >
                  <FontAwesomeIcon className="plus" icon={faPlus} />
                </button>
              </div>

              <label htmlFor="adults">Adults (13-59):</label>
              <div className="duration-container">
                <button
                  className="duration-button"
                  onClick={() => handleDecrease("adults")}
                  disabled={formData.adults <= 0}
                >
                  <FontAwesomeIcon className="minus" icon={faMinus} />
                </button>
                <input
                  type="text"
                  id="adults"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChangeInput}
                  className="custom-input"
                  min="0"
                />
                <button
                  className="duration-button"
                  onClick={() => handleIncrease("adults")}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>

            <div className="activity-preference">
              <span>Activity Preference</span>
              <div className="games">
                {activityPreferenceData?.length > 0 &&
                  activityPreferenceData.map((activity) => (
                    <button
                      className={`game-btn ${selectedGames.includes(activity.userActivityId)
                          ? "selected"
                          : ""
                        }`}
                      onClick={() => handleGameClick(activity.userActivityId)}
                    >
                      {activity.userActivityName}
                    </button>
                  ))}
              </div>
            </div>
            <div className="other-activities">
              <label htmlFor="activities">Other Activities(if any)</label>
              <input
                type="text"
                name="otherActivities"
                value={formData.otherActivities}
                id="otherActivities"
                className="input-field-otheractivities"
                onChange={handleChangeInput}
              />
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
            </div>

            <div className="priceBook">
              <label htmlFor=""> Amount (in rupees) :</label>
              <span className="price-display">
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                <b>{amount1 * parseInt(formData.adults)}</b>
                <b>/-</b>
              </span>
            </div>

            <div className="buttons-container">
              <button
                className="add-to-cart-button"
                onClick={handleAddtoCart}
                disabled={isDisabled}
              >
                <FontAwesomeIcon icon={faCartShopping} /> Add to Cart
              </button>
              <RazorpayButton
                amount={amount1 * parseInt(formData.adults)}
                currency={"INR"}
                description={"Book now"}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
                isDisabled={isDisabled}
              />
              {/* <button
                className="submit-and-proceed-button"
                onClick={handleSubmitAndProceed}
                disabled={isDisabled}
              >
                <FontAwesomeIcon icon={faCreditCard} /> Submit & Proceed
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Book_Now;
