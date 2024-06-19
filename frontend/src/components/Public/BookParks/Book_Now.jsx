import React, { useEffect, useState } from "react";
import "../../Public/BookParks/Book_Now.css";
import AdminHeader from "../../../common/AdminHeader";
import CommonFooter from "../../../common/CommonFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import {
  faC,
  faCartShopping,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"; // Import the icon
import { faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {
  faCreditCard,
  faPlus,
  faMinus,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";

// Import Axios method---------------------------------------------
import axiosHttpClient from "../../../utils/axios";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate, Link } from "react-router-dom";
import { decryptData } from "../../../utils/encryptData";
import { encryptData } from "../../../utils/encryptData";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import PublicHeader from "../../../common/PublicHeader";
import { formatDate } from "../../../utils/utilityFunctions";

const Book_Now = () => {
  const [selectedGames, setSelectedGames] = useState([]);
  // UseState for getting data -------------------------------------
  const [FacilitiesData, setFacilitiesData] = useState([]);
  // Here Location / crypto and navigate the page---------------
  const location = useLocation();
  const action = new URLSearchParams(location.search).get("action");
  const navigate = useNavigate();
  const [activityPreferenceData, setActivityPreferenceData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [amount1, setAmount1] = useState([0]);

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

  let facilityId = decryptData(
    new URLSearchParams(location.search).get("facilityId")
  );

  // Here Get the data of Sub_park_details------------------------------------------
  async function getSub_park_details(facilityId) {
    console.log("facilityId", facilityId);

    try {
      let res = await axiosHttpClient("View_By_ParkId", "get", "", facilityId);

      console.log("response of facility fetch api", res);
      setFacilitiesData(res.data.facilitiesData);
      setFormData({
        ...formData,
        ["entityTypeId"]: res.data.facilitiesData[0].facilityTypeId,
        ["facilityId"]: facilityId,
        ["entityId"]: facilityId,
      });
    } catch (err) {
      console.log("here Error of park data", err);
    }
  }

  // API call to fetch dropdown data and selection data
  async function getParkBookingInitialData() {
    try {
      let res = await axiosHttpClient("PARK_BOOK_PAGE_INITIALDATA_API", "get");

      console.log("getParkBookingInitialData", res);
      console.log("getParkBookingInitialData1232345", res.data.data);
      setActivityPreferenceData(res.data.data);
    } catch (err) {
      console.log("here Error", err);
    }
  }

  // UseEffect for Update/Call API--------------------------------
  useEffect(() => {
    // let facilityId = decryptData(
    //   new URLSearchParams(location.search).get("facilityId")
    // );
    console.log("facilityId", facilityId);
    getSub_park_details(facilityId);
    getParkBookingInitialData();
  }, []);

  useEffect(() => {
    console.log("selectedGames", selectedGames);
    console.log("formData", formData);
  }, [selectedGames, formData]);

  // Function to handle game button click
  const handleGameClick = (game) => {
    // Toggle game selection
    if (selectedGames.includes(game)) {
      setSelectedGames(selectedGames.filter((item) => item !== game));
    } else {
      setSelectedGames([...selectedGames, game]);
    }
    console.log("selectedGames", selectedGames);
  };

  const handleChangeInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    let intValue = parseInt(value);

    const updatedFormData = {
      ...formData,
      [name]: isNaN(value) ? value : intValue,
    };

    // Calculate the total members if any of the member inputs are changed
    if (["children", "seniorCitizen", "adults"].includes(name)) {
      updatedFormData.totalMembers =
        (name === "children" ? intValue : formData.children) +
        (name === "seniorCitizen" ? intValue : formData.seniorCitizen) +
        (name === "adults" ? intValue : formData.adults);
    }

    // Show toast if total members exceed 40
    if (updatedFormData.totalMembers > 40) {
      toast.error("Total members cannot exceed 40.");
      updatedFormData.totalMembers = 40; // Adjust to maximum limit
    }

    // setamount(formData)
    console.log("qwertyuiop", formData.amount);
    setAmount1(formData.amount);

    setIsDisabled(updatedFormData.totalMembers > 40);

    setFormData(updatedFormData);
    console.log("Updated formData", updatedFormData);
  };
  const temp =
    parseInt(formData.children) +
    parseInt(formData.seniorCitizen) +
    parseInt(formData.adults);
  const totalMembers = temp <= 40 ? temp : 40;
  // const totalMembers =
  //   parseInt(formData.children) +
  //   parseInt(formData.seniorCitizen) +
  //   parseInt(formData.adults);

  const handleDecrease = () => {
    setFormData((prevData) => ({
      ...prevData,
      durationInHours: Math.max(0, prevData.durationInHours - 1),
    }));
  };

  const handleIncrease = () => {
    setFormData((prevData) => ({
      ...prevData,
      durationInHours: prevData.durationInHours + 1,
    }));
  };

  async function handleAddtoCart() {
    let modifiedFormData = {
      ...formData,
      ["activityPreference"]: selectedGames,
    };
    console.log("formData handleSubmitAndProceed", modifiedFormData);
    const validationError = validation(modifiedFormData);
    if (Object.keys(validationError).length == 0) {
      try {
        let facilityPreference = {
          totalMembers: modifiedFormData.totalMembers,
          activityPreference: modifiedFormData.activityPreference,
          otherActivities: modifiedFormData.otherActivities,
          bookingDate: modifiedFormData.bookingDate,
          startTime: modifiedFormData.startTime,
          duration: modifiedFormData.durationInHours,
          price: amount1 * modifiedFormData.adults,
        };

        // Prepare request body
        const requestBody = {
          entityId: modifiedFormData.entityId,
          entityTypeId: modifiedFormData.entityTypeId,
          facilityPreference,
        };
        let res = await axiosHttpClient("Add_to_Cart", "post", requestBody);
        console.log("submit and response", res);
        toast.success("Added to cart successfully.", {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/BookParks/Add_Card");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      } catch (error) {
        console.log(error);
        toast.error("Add to Cart  failed. Try again.");
      }
    } else {
      toast.error("Please fill the required data.");
    }
  }

  async function handleSubmitAndProceed() {
    let modifiedFormData = {
      ...formData,
      ["activityPreference"]: selectedGames,
    };
    console.log("formData handleSubmitAndProceed", modifiedFormData);
    const validationError = validation(modifiedFormData);
    let facilityPreference = {
      totalMembers: modifiedFormData.totalMembers,
      amount: amount1 * modifiedFormData.adults,
      activityPreference: modifiedFormData.activityPreference,
      otherActivities: modifiedFormData.otherActivities,
      bookingDate: modifiedFormData.bookingDate,
      startTime: modifiedFormData.startTime,
      durationInHours: modifiedFormData.durationInHours,
    };
    if (Object.keys(validationError).length == 0 && modifiedFormData.totalMembers != 0 && modifiedFormData.totalMembers <= 40) {
      try {
        let res = await axiosHttpClient("PARK_BOOK_PAGE_SUBMIT_API", "post", {
          entityId: modifiedFormData.entityId,
          entityTypeId: modifiedFormData.entityTypeId,
          facilityPreference,
        });
        console.log("submit and response", res);
        toast.success("Park has been booked successfully.", {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/profile/booking-details");
              // navigate("/BookParks/Bokking_Bill?bookingId=${encryptData(bookingId)}");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      } catch (error) {
        console.log(error);
        toast.error("Booking details submission failed.");
      }
    } else if (modifiedFormData.totalMembers > 40) {
      toast.error("Total members can not exceed more than 40");
    } else {
      toast.error("Please fill the required data.");
    }
  }

  const validation = (formData) => {
    let errors = {};
    if (!formData.totalMembers) {
      errors.totalMembers = "Please provide number of members";
    }
    if (!formData.bookingDate) {
      errors.date = "Please provide date.";
    }
    if (!formData.startTime) {
      errors.startTime = "Please provide Start time.";
    }
    if (!formData.durationInHours) {
      errors.durationInHours = "Please provide duration.";
    }
    return errors;
  };

  return (
    <div className="Book_Now_Min_conatiner">

      <PublicHeader />
      <div className="booknow-container">
        <div className="park-container">
          <div className="heading_BookNow">
            <h1>
              {FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityName}
            </h1>
            <Link
              to={`/Sub_Park_Details?facilityId=${encryptData(facilityId)}`}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Link>
          </div>
          <div className="address">
            <p> {FacilitiesData?.length > 0 && FacilitiesData[0]?.address}</p>
          </div>
          <div className="input-fields0">
            <div className="input-fields">
              <p>Total Members</p>
              <input
                type="number"
                name="totalMembers"
                value={formData.totalMembers}
                id=""
                className="member-input"
                onChange={handleChangeInput}
                disabled
              />
            </div>
            <div className="input-fields">
              <p>Children</p>
              <input
                type="number"
                name="children"
                value={formData.children}
                id=""
                className="member-input"
                onChange={handleChangeInput}
                min="0"
              />
            </div>
            <div className="input-fields">
              <p>Senior-citizen</p>
              <input
                type="number"
                name="seniorCitizen"
                value={formData.seniorCitizen}
                id=""
                className="member-input"
                onChange={handleChangeInput}
                min="0"
              />
            </div>
            <div className="input-fields">
              <p>adults</p>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                id=""
                className="member-input"
                onChange={handleChangeInput}
                min="0"
              />
            </div>
          </div>

          <br />
          <div className="activity-preference">
            <span>Activity Preference</span>
            <div className="games">
              {activityPreferenceData?.length > 0 &&
                activityPreferenceData.map((activity) => {
                  return (
                    <button
                      className={`game-btn ${selectedGames.includes(activity.userActivityId)
                          ? "selected"
                          : ""
                        }`}
                      onClick={() => handleGameClick(activity.userActivityId)}
                    >
                      {activity.userActivityName}
                    </button>
                  );
                })}
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
              gh
            />
          </div>
          <br />
          <div className="date">
            <label htmlFor="">Date :</label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              id=""
              className="input-field-date"
              onChange={handleChangeInput}
            />
          </div>
          <br />
          <div className="start-time">
            <label htmlFor=""> Start Time :</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              id=""
              className="input-field-date"
              onChange={handleChangeInput}
            />
          </div>
          <div className="duration">
            <label htmlFor="duration"> Duration (in hours) :</label>
            <div className="bookDuration">
              <div className="input-container">
                <FontAwesomeIcon
                  onClick={handleDecrease}
                  icon={faMinus}
                  className="icon minus"
                />
                <input
                  type="number"
                  name="durationInHours"
                  value={formData.durationInHours}
                  id="duration"
                  className="input-field-date-duration"
                  onChange={handleChangeInput}
                  min="0"
                />
                <FontAwesomeIcon
                  onClick={handleIncrease}
                  icon={faPlus}
                  className="icon plus"
                />
              </div>
            </div>
          </div>
          {/* <div className="priceBook">
            <label htmlFor=""> Price (in rupees) :</label>
            <input
              type="number"
              name="price"
              value={parseInt(formatDate.amount) * parseInt(formData.adults)}
              id=""
              className="input-field-price"
              onChange={handleChangeInput}
              min="0"
            />
          </div> */}
          <div className="priceBook">
            <label htmlFor=""> Amount (in rupees) :</label>
            <span className="price-display">
              <FontAwesomeIcon icon={faIndianRupeeSign} />
              <b>{amount1 * parseInt(formData.adults)}</b>
              <b>/-</b>
            </span>
          </div>
          {/* Add to cart button */}
          <div className="Add_to_card_main_conatiner">
            <div className="button_Book_Now">
              {/* <a href=''> */}
              <button
                className="AddToCartButton"
                onClick={handleAddtoCart}
                disabled={isDisabled}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="Icon" />
                Add to Cart
              </button>
              {/* </a>  */}

              <button
                className="addtocart-btn"
                onClick={handleSubmitAndProceed}
                disabled={isDisabled}
              >
                <FontAwesomeIcon icon={faCreditCard} className="Icon" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <CommonFooter/> */}
      <ToastContainer />
    </div>
  );
};

export default Book_Now;
