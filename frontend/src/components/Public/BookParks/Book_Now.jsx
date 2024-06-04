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
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
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

  const [formData, setFormData] = useState({
    totalMembers: 0,
    children: 0,
    seniorCitizen: 0,
    others: 0,
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

  const encryptedFacilityId = encryptData(facilityId);

  // Here Get the data of Sub_park_details------------------------------------------
  async function getSub_park_details(facilityId) {
    console.log("facilityId", facilityId);

    try {
      let res = await axiosHttpClient(
        "View_By_ParkId",
        "get",
        null,
        facilityId
      );

      console.log("response of facility fetch api", res);
      setFacilitiesData(res.data.facilitiesData);
      setFormData({
        ...formData,
        ["entityTypeId"]: res.data.facilitiesData[0].facilityTypeId,
        ["facilityId"]: facilityId,
        ["entityId"]: facilityId,
      });
    } catch (err) {
      console.log("here Error", err);
    }
  }

  // API call to fetch dropdown data and selection data
  async function getParkBookingInitialData() {
    try {
      let res = await axiosHttpClient("PARK_BOOK_PAGE_INITIALDATA_API", "get");

      console.log("getParkBookingInitialData", res);
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
    setFormData({ ...formData, [name]: value });
    if (name === "durationInHours" && value >= 0) {
      setFormData({ ...formData, durationInHours: Number(value) });
    }

    const totalMembers =
      (name === "children" ? intValue : parseInt(formData.children)) +
      (name === "seniorCitizen" ? intValue : parseInt(formData.seniorCitizen)) +
      (name === "others" ? intValue : parseInt(formData.others));

    console.log("here formData", formData);
  };
  const temp =
    parseInt(formData.children) +
    parseInt(formData.seniorCitizen) +
    parseInt(formData.others);
  const totalMembers = temp <= 40 ? temp : 40;
  // const totalMembers =
  //   parseInt(formData.children) +
  //   parseInt(formData.seniorCitizen) +
  //   parseInt(formData.others);

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
          price: modifiedFormData.price,
        };

        // Prepare request body
        const requestBody = {
          entityId: modifiedFormData.entityId,
          entityTypeId: modifiedFormData.entityTypeId,
          facilityPreference,
        };
        let res = await axiosHttpClient("Add_to_Cart", "post", requestBody);
        console.log("submit and response", res);
        toast.success("Add to Cart has been done  successfully.", {
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
      amount: modifiedFormData.amount,
      activityPreference: modifiedFormData.activityPreference,
      otherActivities: modifiedFormData.otherActivities,
      bookingDate: modifiedFormData.bookingDate,
      startTime: modifiedFormData.startTime,
      durationInHours: modifiedFormData.durationInHours,
    };
    if (Object.keys(validationError).length == 0) {
      try {
        let res = await axiosHttpClient("PARK_BOOK_PAGE_SUBMIT_API", "post", {
          entityId: modifiedFormData.entityId,
          entityTypeId: modifiedFormData.entityTypeId,
          facilityPreference,
        });
        console.log("submit and response", res);
        toast.success("Booking details submitted successfully.", {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      } catch (error) {
        console.log(error);
        toast.error("Booking details submission failed.");
      }
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
      <PublicHeader/>
      <div className="booknow-container">
        <div className="park-container">
          <div className="heading">
            <h1>
              {FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityName}
            </h1>
            <Link to="/Sub_Park_Details?facilityId">
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
                value={totalMembers}
                id=""
                className="member-input"
                onChange={handleChangeInput}
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
              <p>Others</p>
              <input
                type="number"
                name="others"
                value={formData.others}
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
                      className={`game-btn ${
                        selectedGames.includes(activity.userActivityId)
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
              id=""
              className="input-field-otheractivities"
              onChange={handleChangeInput}
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
            <label htmlFor=""> Duration (in hours) :</label>
            <div className="bookDuration">
              <FontAwesomeIcon onClick={handleDecrease} icon={faMinus} />
              <input
                type="number"
                name="durationInHours"
                value={formData.durationInHours}
                id="duration"
                className="input-field-date-duration"
                onChange={handleChangeInput}
                min="0"
              />
              <FontAwesomeIcon onClick={handleIncrease} icon={faPlus} />
            </div>
          </div>
          {/* <div className="priceBook">
            <label htmlFor=""> Price (in rupees) :</label>
            <input
              type="number"
              name="price"
              value={parseInt(formatDate.amount) * parseInt(formData.others)}
              id=""
              className="input-field-price"
              onChange={handleChangeInput}
              min="0"
            />
          </div> */}
          <div className="priceBook">
            <label htmlFor=""> Price (in rupees) :</label>
            <span className="price-display">
              <FontAwesomeIcon icon={faIndianRupeeSign} />
              <b>{parseInt(formData.amount) * parseInt(formData.others)}</b>
              <b>/-</b>
            </span>
          </div>
          {/* Add to cart button */}
          <div className="Add_to_card_main_conatiner">
            <div className="button_Book_Now">
              {/* <a href=''> */}
              <button class="AddToCartButton" onClick={handleAddtoCart}>
                <FontAwesomeIcon icon={faShoppingCart} className="Icon" />
                Add to Cart
              </button>
              {/* </a>  */}

              <button
                className="addtocart-btn"
                onClick={handleSubmitAndProceed}
              >
                <FontAwesomeIcon icon={faCreditCard} className="Icon" />
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
       <CommonFooter/>
    </div>
  );
};

export default Book_Now;
