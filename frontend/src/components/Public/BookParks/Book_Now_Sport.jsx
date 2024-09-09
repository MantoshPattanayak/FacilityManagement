import React from "react";
import { useState, useEffect } from "react";
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
// here import Icon ------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import {
  faShoppingCart,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate, Link } from "react-router-dom";
import { decryptData, encryptData } from "../../../utils/encryptData";
// Toast ------------------------------------------
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
// Import Css file here ---------------------------------
import "./Book_Now_Sport.css";
// fecth /post data -----------------------------------------------------
import axiosHttpClient from "../../../utils/axios";
import RazorpayButton from "../../../common/RazorpayButton";
import DosDont from "../FooterPages/DosDont";

const Book_Now_Sport = () => {
  // UseSate for post data -------------------------------------
  const [formData, setFormData] = useState({
    entityId: "",
    entityTypeId: "",
    facilityPreference: {
      playersLimit: 1,
      sports: "",
      startTime: new Date().toTimeString().split(" ")[0],
      endTime: new Date().toTimeString().split(" ")[0],
      bookingDate: new Date().toISOString().split("T")[0],
    },
  });
  const [FacilitiesData, setFacilitiesData] = useState("");
  const [sportsList, setSportsList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const amount = 10;
  const [isDisabled, setIsDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [showSchedule, setShowschedule] = useState(false);

  //Time schedule of sports
  const sportsSchedule = [
    { occupancy: "Low occupancy", startTime: "06:00 AM", endTime: "07:00 AM" },
    { occupancy: "High occupancy", startTime: "07:00 AM", endTime: "08:00 AM" },
    { occupancy: "Occupied", startTime: "08:00 AM", endTime: "09:00 AM" },
    { occupancy: "Low occupancy", startTime: "09:00 AM", endTime: "10:00 AM" },
    { occupancy: "High occupancy", startTime: "10:00 AM", endTime: "11:00 AM" },
    { occupancy: "Occupied", startTime: "11:00 AM", endTime: "12:00 PM" },
    { occupancy: "Low occupancy", startTime: "12:00 PM", endTime: "01:00 PM" },
    { occupancy: "High occupancy", startTime: "01:00 PM", endTime: "02:00 PM" },
    { occupancy: "Occupied", startTime: "02:00 PM", endTime: "03:00 PM" },
    { occupancy: "Low occupancy", startTime: "03:00 AM", endTime: "04:00 PM" },
    { occupancy: "High occupancy", startTime: "04:00 PM", endTime: "05:00 PM" },
    { occupancy: "Occupied", startTime: "05:00 PM", endTime: "06:00 PM" },
    { occupancy: "High occupancy", startTime: "06:00 PM", endTime: "07:00 PM" },
    { occupancy: "Occupied", startTime: "07:00 PM", endTime: "08:00 PM" },
  ];

  // Here Increment ------------------------------------------------
  const handleDecrement = () => {
    if (formData.facilityPreference.playersLimit > 1) {
      setFormData((prevState) => ({
        ...prevState,
        facilityPreference: {
          ...prevState.facilityPreference,
          playersLimit: prevState.facilityPreference.playersLimit - 1,
        },
      }));
    }
  };

  // Decrement ------------------------------------------------
  const handleIncrement = () => {
    if (formData.facilityPreference.playersLimit < 25) {
      setFormData((prevState) => ({
        ...prevState,
        facilityPreference: {
          ...prevState.facilityPreference,
          playersLimit: prevState.facilityPreference.playersLimit + 1,
        },
      }));
    }
  };

  // Handle OnChange value ------------------------------------------
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      facilityPreference: {
        ...prevState.facilityPreference,
        [name]: value,
      },
    }));
    console.log("formData", formData);

    // Set showSchedule to true when bookingDate changes
    if (name === "bookingDate" && value) {
      setShowschedule(true);
    }
  };

  const closePopup = () => {
    setShowschedule(false);
  };

  const setTimes = (startTime, endTime) => {
    // Convert times from "03:00 PM" to "15:00"
    const formattedStartTime = convertTo24HourFormat(startTime);
    const formattedEndTime = convertTo24HourFormat(endTime);

    setFormData((prevState) => ({
      ...prevState,
      facilityPreference: {
        ...prevState.facilityPreference,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      },
    }));

    setShowschedule(false); // Close popup after selecting times
  };

  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(" "); // Split the time and AM/PM
    let [hours, minutes] = timePart.split(":"); // Split hours and minutes

    if (hours === "12") {
      hours = "00"; // Adjust for 12 AM case
    }

    if (modifier === "PM") {
      hours = String(parseInt(hours, 10) + 12); // Convert to 24-hour format for PM times
    }

    return `${hours.padStart(2, "0")}:${minutes}`; // Return the time in "HH:MM" format
  };

  // here Post the data -------------------------------
  async function HandleAddtoCart() {
    try {
      // Prepare request body
      let modifiedFormData = {
        ...formData,
      };
      /**
             * playersLimit: 1,
                sports: "",
                startTime: "",
                endTime: "",
                bookingDate: "",
             */
      console.log("formData handleSubmitAndProceed", modifiedFormData);
      const validationError = validation(modifiedFormData);
      let facilityPreference = {
        totalMembers: encryptData(
          modifiedFormData.facilityPreference.playersLimit
        ),
        amount: encryptData(
          parseFloat(amount * modifiedFormData.facilityPreference.playersLimit)
            ? amount * modifiedFormData.facilityPreference.playersLimit
            : "0"
        ),
        bookingDate: encryptData(
          modifiedFormData.facilityPreference.bookingDate
        ),
        startTime: encryptData(modifiedFormData.facilityPreference.startTime),
        endTime: encryptData(modifiedFormData.facilityPreference.endTime),
        sports: encryptData(modifiedFormData.facilityPreference.sports),
      };
      console.log("facilityPreference", facilityPreference);
      if (Object.keys(validationError).length <= 0) {
        let res = await axiosHttpClient("Add_to_Cart", "post", {
          entityId: modifiedFormData.entityId,
          entityTypeId: modifiedFormData.entityTypeId,
          facilityPreference,
        });
        toast.success("Added to cart successfully.", {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/cart-details");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      } else {
        toast.error("Please fill the required data.");
      }
    } catch (err) {
      console.error("here Error of Sport Booking", err);
      toast.error("Add to Cart failed.Try agin");
    }
  }

  async function handleSubmitAndProceed() {
    let modifiedFormData = {
      ...formData,
    };
    console.log("formData handleSubmitAndProceed", modifiedFormData);
    const validationError = validation(modifiedFormData);
    let facilityPreference = {
      totalMembers: encryptData(
        modifiedFormData.facilityPreference.playersLimit
      ),
      amount: encryptData(
        parseFloat(amount * modifiedFormData.facilityPreference.playersLimit)
          ? amount * modifiedFormData.facilityPreference.playersLimit
          : "0"
      ),
      bookingDate: encryptData(modifiedFormData.facilityPreference.bookingDate),
      startTime: encryptData(modifiedFormData.facilityPreference.startTime),
      endTime: encryptData(modifiedFormData.facilityPreference.endTime),
      sports: encryptData(modifiedFormData.facilityPreference.sports),
    };
    console.log("facilityPreference", facilityPreference);
    if (Object.keys(validationError).length == 0) {
      try {
        let res = await axiosHttpClient("PARK_BOOK_PAGE_SUBMIT_API", "post", {
          entityId: modifiedFormData.entityId,
          entityTypeId: modifiedFormData.entityTypeId,
          facilityPreference,
        });
        console.log("submit and response", res);
        let bookingId = res.data.data.facilityBookingId;
        let entityTypeId = modifiedFormData.entityTypeId;

        toast.success("Playfield has been booked successfully.", {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate(
                `/profile/booking-details/ticket?bookingId=${encryptData(
                  bookingId
                )}&typeId=${encryptData(entityTypeId)}`
              );
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
  // Here Get the data ofsport details------------------------------------------
  async function getSub_Sport_details(facilityId) {
    console.log("get park details", facilityId);
    try {
      let res = await axiosHttpClient("View_By_ParkId", "get", {}, facilityId);

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
  //  here Get types of Sport ----------------------
  async function GetSportType() {
    try {
      let res = await axiosHttpClient("PARK_BOOK_PAGE_INITIALDATA_API", "get");
      console.log("here Response of Get sport type in dropdown", res.data.data);
      setSportsList(
        res.data.data.filter((sports) => {
          return sports.facilityTypeId == 2;
        })
      );
    } catch (err) {
      console.error("here Error of get sport types in dropdown");
    }
  }
  // function to handle payment success
  const handlePaymentSuccess = ({ response, res }) => {
    // console.log("Book park payment success", response);
    let bookingId = res.data.shareableLink[0].bookingId;
    let entityTypeId = res.data.shareableLink[0].entityTypeId;

    toast.success("Event has been booked successfully.", {
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

  //function handle payment failure and notify user
  const handlePaymentFailure = (response) => {
    console.log("Book park payment failure", response);
    toast.dismiss();
    toast.error(response.description);
  };

  // useEffect for Update the data (Call Api) ------------------------
  useEffect(() => {
    let facilityId = decryptData(
      new URLSearchParams(location.search).get("facilityId")
    );
    console.log("facilityId", facilityId);
    GetSportType();
    getSub_Sport_details(facilityId);
  }, []);

  // here Validation fun--------------------------------------------
  const validation = (value) => {
    const err = {};

    if (!value.facilityPreference.sports) {
      err.sports = "Please Select Sport Name";
    }
    if (!value.facilityPreference.bookingDate) {
      err.bookingDate = "Please Select Booking Date";
    }
    if (!value.facilityPreference.startTime) {
      err.startTime = "Please Select Start Time";
    }
    if (!value.facilityPreference.endTime) {
      err.endTime = "Please Select End Time";
    }
    if (
      !value.facilityPreference.playersLimit &&
      value.facilityPreference.playersLimit > 40
    ) {
      err.playersLimit = "Please enter players Limit upto 40.";
    }
    console.log("error", err);
    setErrors(err);
    return err;
  };
  // on formData change, refresh screen
  useEffect(() => {
    console.log("formData", formData);
    let err = validation(formData);
    if (Object.keys(err).length > 0) setIsDisabled(true);
    else setIsDisabled(false);
  }, [formData]);

  useEffect(() => {
    console.log("isDisabled in useEffect", isDisabled);
  }, [isDisabled]);

  //  Return (jsx) -------------------------------------------------------------
  return (
    <div className="Book_sport_Main_conatiner">
      <ToastContainer />
      <PublicHeader />
      <DosDont />
      <div className="Book_sport_Child_conatiner">
        <div className="Add_sport_form">
          <div className="sport_name_Book">
            <h1 className="Faclity_Name">
              {" "}
              {FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityName}
            </h1>
            <span>
              <p className="Faclity_adress">
                {" "}
                {FacilitiesData?.length > 0 && FacilitiesData[0]?.address}
              </p>
            </span>
          </div>
          <div class="bookingFormWrapper">
            <form class="bookingForm">
              <div class="formGroup">
                <span class="fieldName">
                  Sport<span className="required-asterisk">*</span>:
                </span>
                <select
                  class="formSelect"
                  name="sports"
                  value={formData.facilityPreference.sports}
                  onChange={handleChangeInput}
                >
                  <option value="">Select</option>
                  {sportsList?.length > 0 &&
                    sportsList.map((sports) => {
                      return (
                        <option value={sports.userActivityId}>
                          {sports.userActivityName}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div class="formGroup">
                <span class="fieldName">
                  Date<span className="required-asterisk">*</span>:
                </span>
                <input
                  type="date"
                  class="formInput"
                  name="bookingDate"
                  value={formData.facilityPreference.bookingDate}
                  onChange={handleChangeInput}
                />
              </div>
              {showSchedule && (
                <All_Sports_Schedule
                  closePopup={closePopup}
                  schedule={sportsSchedule}
                  setTimes={setTimes}
                />
              )}
              <div class="formGroup">
                <span class="fieldName">
                  Start Time<span className="required-asterisk">*</span>:
                </span>
                <input
                  type="time"
                  class="formInput"
                  name="startTime"
                  value={formData.facilityPreference.startTime}
                  onChange={handleChangeInput}
                />
              </div>
              <div class="formGroup">
                <span class="fieldName">
                  End Time<span className="required-asterisk">*</span>:
                </span>
                <input
                  type="time"
                  class="formInput"
                  name="endTime"
                  //   value={formData.facilityPreference.endTime}
                  value={(
                    formData.facilityPreference.endTime
                  )}
                  onChange={handleChangeInput}
                />
              </div>
              <div class="formGroup">
                <span class="fieldName">
                  No of Player<span className="required-asterisk">*</span>
                </span>
                <div className="increament_decrement_conatiner">
                  <button
                    type="button"
                    className="decrement-button"
                    onClick={handleDecrement}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <input
                    type="text"
                    className="formInput_Add_member1"
                    value={formData.facilityPreference.playersLimit}
                    name="playersLimit"
                    onChange={handleChangeInput}
                  />
                  <button
                    type="button"
                    className="increment-button"
                    onClick={handleIncrement}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              <div class="formGroup">
                <span class="fieldName">Amount</span>
                <FontAwesomeIcon icon={faIndianRupeeSign} />
                <h1 className="price_Sport">
                  &nbsp; {amount * formData.facilityPreference.playersLimit}/-
                </h1>
              </div>
            </form>
          </div>
          <div className="Button_Conatiner_Sport">
            <button
              type="submit"
              class="add-to-cart-button"
              onClick={HandleAddtoCart}
              disabled={isDisabled}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="Icon" />
              Add to Cart
            </button>

            {isDisabled ? (
              <button className="add-to-cart-button" disabled={isDisabled}>
                <FontAwesomeIcon icon={faCreditCard} /> Pay Now{" "}
                <FontAwesomeIcon icon={faIndianRupeeSign} />{" "}
                {parseFloat(
                  amount * formData.facilityPreference.playersLimit
                ).toFixed(2)}
              </button>
            ) : (
              <RazorpayButton
                amount={
                  parseFloat(amount * formData.facilityPreference.playersLimit)
                    ? amount * formData.facilityPreference.playersLimit
                    : "0"
                }
                currency={"INR"}
                description={"Book now"}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
                disabled={isDisabled}
                data={{
                  entityId: encryptData(formData.entityId),
                  entityTypeId: encryptData(formData.entityTypeId),
                  facilityPreference: {
                    totalMembers: encryptData(
                      formData.facilityPreference.playersLimit
                    ),
                    amount: encryptData(
                      parseFloat(
                        amount * formData.facilityPreference.playersLimit
                      )
                        ? amount * formData.facilityPreference.playersLimit
                        : "0"
                    ),
                    bookingDate: encryptData(
                      formData.facilityPreference.bookingDate
                    ),
                    startTime: encryptData(
                      formData.facilityPreference.startTime
                    ),
                    endTime: encryptData(formData.facilityPreference.endTime),
                    sports: encryptData(formData.facilityPreference.sports),
                  },
                  userCartId: null,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const All_Sports_Schedule = ({ closePopup, schedule, setTimes }) => {
  const [selectedSection, setSelectedSection] = useState("morning");

  // Filter schedule based on selected section
  const filteredSchedule = schedule.filter((item) => {
    const startTime = parseTime(item.startTime);

    if (selectedSection === "morning") {
      return (
        startTime >= parseTime("06:00 AM") && startTime <= parseTime("11:00 AM")
      );
    }
    if (selectedSection === "afternoon") {
      return (
        startTime >= parseTime("12:00 PM") && startTime <= parseTime("03:00 PM")
      );
    }
    if (selectedSection === "evening") {
      return (
        startTime >= parseTime("04:00 PM") && startTime <= parseTime("08:00 PM")
      );
    }
    return false;
  });

  // Parse time strings into comparable values
  function parseTime(time) {
    const [hour, minute, period] = time.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
    let hours = parseInt(hour, 10);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    return hours * 60 + parseInt(minute, 10); // Return total minutes for comparison
  }

  const getOccupancyClass = (occupancy) => {
    switch (occupancy) {
      case "Occupied":
        return "occupied";
      case "High occupancy":
        return "high-occupancy";
      case "Low occupancy":
        return "low-occupancy";
      default:
        return "";
    }
  };

  const handleSelect = (startTime, endTime) => {
    setTimes(startTime, endTime); // Pass selected times to parent
    closePopup(); // Close the popup after selection
  };

  return (
    <div className="All_Sports_Schedule fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="popup-overlay">
        <div className="popup-content">
          <div className="popup-header">
            <h5>Choose a slot</h5>
            <button onClick={closePopup}>Close</button>
          </div>
          <div className="popup-body">
            <div className="section-buttons">
              <button
                type="button"
                className={selectedSection === "morning" ? "selected" : ""}
                onClick={() => setSelectedSection("morning")}
              >
                Morning
              </button>
              <button
                type="button"
                className={selectedSection === "afternoon" ? "selected" : ""}
                onClick={() => setSelectedSection("afternoon")}
              >
                Afternoon
              </button>
              <button
                type="button"
                className={selectedSection === "evening" ? "selected" : ""}
                onClick={() => setSelectedSection("evening")}
              >
                Evening
              </button>
            </div>

            <div className="schedule-list">
              {filteredSchedule.map((item, index) => (
                <div
                  className="item_schedule_box"
                  key={index}
                  onClick={() => handleSelect(item.startTime, item.endTime)}
                >
                  <div
                    className={`item_occupancy ${getOccupancyClass(
                      item.occupancy
                    )}`}
                  >
                    {item.occupancy}
                  </div>
                  <div className="scheduleTime">
                    {item.startTime} - {item.endTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book_Now_Sport;
