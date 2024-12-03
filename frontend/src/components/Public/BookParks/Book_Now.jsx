import React, { useEffect, useState } from "react";
import "../../Public/BookParks/Book_Now.css";
import Visiting_People from "./Popups_Book_now/Visiting_People";
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
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../../../utils/axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { decryptData, encryptData } from "../../../utils/encryptData";
import { ToastContainer, toast } from "react-toastify";
import PublicHeader from "../../../common/PublicHeader";
import RazorpayButton from "../../../common/RazorpayButton";
import { formatDateYYYYMMDD } from "../../../utils/utilityFunctions";

const Book_Now = () => {
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [selectedGames, setSelectedGames] = useState([]);
  const [FacilitiesData, setFacilitiesData] = useState([]);
  const [activityPreferenceData, setActivityPreferenceData] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [formData, setFormData] = useState({});
  const [amount1, setAmount1] = useState([10]);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const encryptedData = queryParams.get("d");
    // console.log("Encrypted Data: ", encryptedData);
    if (encryptedData) {
      try {
        const decryptedData = JSON.parse(decryptData(encryptedData));
        console.log("Decrypted Data: ", decryptedData);
        setFormData(decryptedData);
        setSelectedGames(decryptedData.activityPreference); // Set selectedGames initially
        setActivityPreferenceData(formData.activityPreference.data);
        console.log("the alutimate data :", formData.activityPreference.data);
      } catch (error) {
        // console.error("Error decrypting data", error);
      }
    }
  }, [location.search]);

  let facilityId = decryptData(formData.facilityId);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (facilityId) {
      getSub_park_details(facilityId);
    }
    // getParkBookingInitialData();
  }, [facilityId]);

  useEffect(() => {
    // console.log("Selected Games: ", selectedGames);
    if (selectedGames.length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        ["activityPreference"]: selectedGames,
      }));
    }
    // console.log("Form Data: ", formData);
  }, [refresh, selectedGames]);

  useEffect(() => {
    let isDisabled = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setIsDisabled(isDisabled);
    }
  }, [formData]);

  useEffect(() => {}, [isDisabled]);

  async function getSub_park_details(facilityId) {
    try {
      let res = await axiosHttpClient("View_By_ParkId", "get", "", facilityId);
      // console.log("view park details", res.data.facilitiesData[0]);
      setFacilitiesData(res.data.facilitiesData[0]);
      setFormData((prevData) => ({
        ...prevData,
        entityTypeId: res.data.facilitiesData[0].facilityTypeId,
        facilityId,
        entityId: facilityId,
      }));
    } catch (err) {
      // console.error("Error fetching park data", err);
    }
  }

  // async function getParkBookingInitialData() {
  //   try {
  //     let res = await axiosHttpClient("PARK_BOOK_PAGE_INITIALDATA_API", "get");
  //     setActivityPreferenceData(res.data.data);
  //   } catch (err) {
  //     console.error("Error fetching initial data", err);
  //   }
  // }

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
    setRefresh((prevState) => !prevState);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    let intValue = parseInt(value);
    const updatedFormData = {
      ...formData,
      [name]: !isNaN(value) ? value : formData[name],
    };

    if (["children", "seniorCitizen", "adults"].includes(name)) {
      updatedFormData.totalMembers =
        (name === "children" ? intValue : formData.children) +
        (name === "seniorCitizen" ? intValue : formData.seniorCitizen) +
        (name === "adults" ? intValue : formData.adults);
    }

    if (updatedFormData.totalMembers > 40) {
      toast.error("Total members cannot exceed 40.");
      // updatedFormData.totalMembers = 40;
      // setIsDisabled(validateForm(updatedFormData));
    }

    setAmount1(formData.amount);
    setIsDisabled(validateForm(updatedFormData));
    setFormData(updatedFormData);
    setRefresh((prevState) => !prevState);
  };

  const handleDecrease = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: Math.max(0, prevData[field] - 1),
    }));
    setIsDisabled(validateForm(formData));
    setRefresh((prevState) => !prevState);
  };

  const handleIncrease = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field] + 1,
    }));
    setIsDisabled(validateForm(formData));
    setRefresh((prevState) => !prevState);
  };

  let price = formData.amount * formData.adults;

  const handleAddtoCart = async () => {
    let modifiedFormData = {
      ...formData,
      activityPreference: selectedGames,
    };

    if (!validateForm(modifiedFormData)) {
      try {
        const facilityPreference = {
          totalMembers: encryptData(modifiedFormData.totalMembers),
          amount: encryptData(
            parseFloat(formData.amount * formData.adults)
              ? formData.amount * formData.adults
              : "0"
          ),
          activityPreference: encryptData(modifiedFormData.activityPreference),
          otherActivities: encryptData(modifiedFormData.otherActivities),
          bookingDate: encryptData(modifiedFormData.bookingDate),
          startTime: encryptData(modifiedFormData.startTime),
          durationInHours: encryptData(modifiedFormData.durationInHours),
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
              navigate("/cart-details");
            }, 1000);
          },
        });
      } catch (error) {
        // console.error("Error adding to cart", error);
        toast.error("Add to Cart failed. Try again.");
      }
    } else {
      toast.error("Please fill the required data.");
    }
  };

  const handleSubmitAndProceed = async () => {
    let modifiedFormData = {
      ...formData,
      ["totalMembers"]:
        formData.children + formData.seniorCitizen + formData.adults,
      activityPreference: selectedGames,
    };
    console.log("modifiedFormData", modifiedFormData);

    if (
      !validateForm(modifiedFormData) &&
      modifiedFormData.totalMembers <= 40
    ) {
      try {
        const facilityPreference = {
          totalMembers: encryptData(modifiedFormData.totalMembers),
          amount: encryptData(formData.amount * modifiedFormData.adults),
          activityPreference: encryptData(modifiedFormData.activityPreference),
          otherActivities: encryptData(modifiedFormData.otherActivities),
          bookingDate: encryptData(modifiedFormData.bookingDate),
          startTime: encryptData(modifiedFormData.startTime),
          durationInHours: encryptData(modifiedFormData.durationInHours),
        };

        let res = await axiosHttpClient("PARK_BOOK_PAGE_SUBMIT_API", "post", {
          entityId: modifiedFormData.entityId,
          entityTypeId: modifiedFormData.entityTypeId,
          facilityPreference,
        });

        console.log("booking response", res.data.data);

        let bookingId = res.data.data.facilityBookingId;
        let entityTypeId = modifiedFormData.entityTypeId;

        toast.success("Park has been booked successfully.", {
          autoClose: 2000,
          onClose: () => {
            setTimeout(() => {
              navigate(
                `/profile/booking-details/ticket?bookingId=${encryptData(
                  bookingId
                )}&typeId=${encryptData(entityTypeId)}`
              );
            }, 1000);
          },
        });
        console.log("response bookingData, entityId, entityTypeId");
      } catch (error) {
        console.error("Error booking park", error);
        toast.error("Booking details submission failed.");
      }
    } else {
      toast.error("Please fill the required data.");
    }
  };

  const handlePaymentSuccess = ({ response, res }) => {
    // console.log("Book park payment success", response);
    console.log("booking response", res);
    let bookingId = res.data.shareableLink[0].bookingId;
    let entityTypeId = res.data.shareableLink[0].entityTypeId;

    toast.success("Park has been booked successfully.", {
      autoClose: 2000,
      onClose: () => {
        setTimeout(() => {
          navigate(
            `/profile/booking-details/ticket?bookingId=${encryptData(
              bookingId
            )}&typeId=${encryptData(entityTypeId)}`
          );
        }, 1000);
      },
    });
    // handleSubmitAndProceed();
  };

  const handlePaymentFailure = (response) => {
    // console.log("Book park payment failure", response);
    toast.dismiss();
    toast.error(response.description);
  };

  const validateForm = (formData) => {
    let errors = {};
    // console.log("formData", formData, selectedGames);
    if (!(formData?.totalMembers > 0 && formData.totalMembers <= 40))
      errors.totalMembers = "Please provide number of members between 0 and 40";
    if (!formData?.bookingDate) errors.date = "Please provide date.";
    if (!formData?.startTime) errors.startTime = "Please provide Start time.";
    if (!formData?.durationInHours)
      errors.durationInHours = "Please provide duration.";
    if (formData.activityPreference?.length < 1 || selectedGames.length < 1)
      errors.activityPreference = "Please select an activity.";
    console.log("errors", errors);
    setErrors(errors);
    return Object.keys(errors).length === 0 ? false : true;
  };

  // const formatTime = (time) => {
  //   const [hours, minutes] = time.split(':');
  //   return `${hours}:${minutes}`;
  // }

  return (
    <div className="Book_Now_Min_conatiner">
      <PublicHeader />
      <div className="booknow-container">
        <div className="park-container">
          <div className="heading_BookNow">
            <h1>
              {" "}
              <b>{FacilitiesData?.facilityName || "Park Name"}</b>
            </h1>
            <Link
              to={`/Sub_Park_Details?facilityId=${encodeURIComponent(
                encryptData(formData.facilityId)
              )}`}
            >
              <div className="back_button2">
                <button className="back_btn">
                  <FontAwesomeIcon icon={faArrowLeftLong} />
                  Back
                </button>
              </div>
            </Link>
          </div>

          <div className="form_BookNow">
            <div className="member-details2">
              <div className="member-details-container">
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
              </div>

              <div className="member-details-container">
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
              </div>

              <div className="member-details-container">
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
            </div>

            {/* booking details................................................... */}
            <div className="booking-details">
              <div className="booking-details-inside">
                <label htmlFor="bookingDate">Booking Date:</label>
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  min={formatDateYYYYMMDD(
                    new Date().toISOString().split("T")[0]
                  )}
                  value={formData.bookingDate}
                  onChange={handleChangeInput}
                  className="custom-input"
                />
              </div>
              <div className="booking-details-inside">
                <label htmlFor="startTime">Start Time:</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChangeInput}
                  className="custom-input"
                />
              </div>

              <div className="member-details-container">
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
            </div>

            {/* Activity preference................................................... */}
            <div className="activity-preference">
              <span>Activity Preference</span>
              <div className="games">
                {activityPreferenceData?.length > 0 ? (
                  activityPreferenceData.map((activity) => (
                    <button
                      key={activity.userActivityId}
                      className={`game-btn ${
                        selectedGames.includes(activity.userActivityId)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleGameClick(activity.userActivityId)}
                    >
                      {activity.userActivityName}
                    </button>
                  ))
                ) : (
                  <p>No activity found</p>
                )}
              </div>
            </div>

            <div className="other-activities">
              <label htmlFor="activities">Other Activities(if any)</label>
              <input
                type="text"
                name="otherActivities"
                value={formData.otherActivities}
                id="otherActivities"
                className="input-field-otheractivities2"
                onChange={handleChangeInput}
              />
            </div>

            <div className="priceBook">
              <label htmlFor=""> Amount (in rupees) :</label>
              <span className="price-display">
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                {/* <b>{amount1 *(formData.adults)}</b> */}
                <b>{price}</b>
                <b>/-</b>
              </span>
            </div>

            <div className="buttons-container-bookNow">
              <button
                className="add-to-cart-button"
                onClick={handleAddtoCart}
                disabled={
                  formData.totalMembers > 0 && formData.totalMembers < 40
                    ? false
                    : true
                }
              >
                <FontAwesomeIcon icon={faCartShopping} /> Add to Cart
              </button>
              {isDisabled ? (
                <button className="add-to-cart-button" disabled={isDisabled}>
                  <FontAwesomeIcon icon={faCreditCard} /> Pay Now{" "}
                  <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                  {parseFloat(price).toFixed(2)}
                </button>
              ) : (
                <RazorpayButton
                  amount={parseFloat(price) ? price : "0"}
                  currency={"INR"}
                  description={"Book now"}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                  disabled={
                    formData.totalMembers > 0 && formData.totalMembers < 40
                      ? false
                      : true
                  }
                  data={{
                    entityId: encryptData(formData.entityId),
                    entityTypeId: encryptData(formData.entityTypeId),
                    facilityPreference: {
                      totalMembers: encryptData(formData.totalMembers),
                      amount: encryptData(
                        parseFloat(formData.amount * formData.adults)
                          ? formData.amount * formData.adults
                          : "0"
                      ),
                      activityPreference: encryptData(
                        formData.activityPreference
                      ),
                      otherActivities: encryptData(formData.otherActivities),
                      bookingDate: encryptData(formData.bookingDate),
                      startTime: encryptData(formData.startTime),
                      durationInHours: encryptData(formData.durationInHours),
                    },
                    userCartId: null,
                  }}
                />
              )}
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
      {/* <ToastContainer /> */}
      {/* {showPeople && <Visiting_People />} */}
    </div>
  );
};

export default Book_Now;
