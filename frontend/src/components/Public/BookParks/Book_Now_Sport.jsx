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
import {
  convertTimeToMinutes,
  defineOccupancyStatus,
  formatDateYYYYMMDD,
} from "../../../utils/utilityFunctions";

const Book_Now_Sport = () => {
  // UseSate for post data -------------------------------------
  const [formData, setFormData] = useState({
    entityId: "",
    entityTypeId: "",
    capacity: "",
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
  const [amount, setAmount] = useState(0.0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [showSchedule, setShowschedule] = useState(false);
  const [isDateChanged, setIsDateChanged] = useState(false);

  //Time schedule of sports
  const [sportsSchedule, setSportsSchedule] = useState([
    {
      occupancy: "Low occupancy",
      operatingHoursFrom: "06:00:00",
      operatingHoursTo: "07:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "High occupancy",
      operatingHoursFrom: "07:00:00",
      operatingHoursTo: "08:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "Occupied",
      operatingHoursFrom: "08:00:00",
      operatingHoursTo: "09:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "Low occupancy",
      operatingHoursFrom: "09:00:00",
      operatingHoursTo: "10:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "High occupancy",
      operatingHoursFrom: "10:00:00",
      operatingHoursTo: "11:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "Occupied",
      operatingHoursFrom: "11:00:00",
      operatingHoursTo: "12:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "Low occupancy",
      operatingHoursFrom: "12:00:00",
      operatingHoursTo: "13:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "High occupancy",
      operatingHoursFrom: "13:00:00",
      operatingHoursTo: "14:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "Occupied",
      operatingHoursFrom: "14:00:00",
      operatingHoursTo: "15:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "Low occupancy",
      operatingHoursFrom: "15:00:00",
      operatingHoursTo: "16:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "High occupancy",
      operatingHoursFrom: "16:00:00",
      operatingHoursTo: "17:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "Occupied",
      operatingHoursFrom: "17:00:00",
      operatingHoursTo: "18:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "High occupancy",
      operatingHoursFrom: "18:00:00",
      operatingHoursTo: "19:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
    {
      occupancy: "Occupied",
      operatingHoursFrom: "19:00:00",
      operatingHoursTo: "20:00:00",
      sun: 0.0,
      mon: 0.0,
      tue: 0.0,
      wed: 0.0,
      thu: 0.0,
      fri: 0.0,
      sat: 0.0,
    },
  ]);

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
    setIsDateChanged(true);

    // Set showSchedule to true when bookingDate changes
    if (name === "bookingDate" && value) {
      //if facilityId, bookingDate and sports data available, then fetch availability data
      if (
        formData.entityId &&
        formData.facilityPreference.bookingDate &&
        formData.facilityPreference.sports
      ) {
        getAvailabilityOfSpace(
          formData.entityId,
          formData.facilityPreference.bookingDate,
          formData.facilityPreference.sports
        );
      }
      setShowschedule(false);
    }
  };

  const handleOpenSchedule = (event) => {
    event.preventDefault();

    const name = event.target.name;

    if (
      name === "timeSlot" &&
      formData.entityId &&
      formData.facilityPreference.bookingDate &&
      formData.facilityPreference.sports
    ) {
      setShowschedule(true);
      getAvailabilityOfSpace(
        formData.entityId,
        formData.facilityPreference.bookingDate,
        formData.facilityPreference.sports
      );
    } else {
      setShowschedule(true);
    }
  };

  const closePopup = () => {
    setShowschedule(false);
  };

  const setTimes = (startTime, endTime, amount) => {
    // Convert times from "03:00 :00" to "15:00"
    const formattedStartTime = convertTo24HourFormat(startTime);
    const formattedEndTime = convertTo24HourFormat(endTime);
    setAmount(amount);
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
    const [timePart, modifier] = time.split(" "); // Split the time and:00/:00
    let [hours, minutes] = timePart.split(":"); // Split hours and minutes

    if (hours === "12") {
      hours = "00"; // Adjust for 12:00 case
    }

    if (modifier === ":00") {
      hours = String(parseInt(hours, 10) + 12); // Convert to 24-hour format for :00 times
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
        ["capacity"]: res.data.facilitiesData[0].capacity || 100,
      });

      setSportsList(
        res.data.fetchfacilitiesActivities.map((sports) => {
          return sports;
        })
      );
    } catch (err) {
      console.log("here Error", err);
    }
  }

  //get booking availability
  async function getAvailabilityOfSpace(
    facilityId,
    bookingDate,
    entityId,
    tariffTypeId = 2
  ) {
    console.log("getAvailabilityOfSpace", {
      facilityId,
      bookingDate,
      entityId,
      tariffTypeId,
    });
    try {
      let res = await axiosHttpClient("FETCH_AVAILABILITY_API", "post", {
        facilityId,
        Date: bookingDate,
        entityId,
        tariffTypeId,
      });
      console.log("getAvailabilityOfSpace", res.data);
      let result;
      if (res.data.tariffDetails.length == 0) {
        res.data.tariffDetails = sportsSchedule;
      }

      // to determine the number of matching bookings
      result = res.data.tariffDetails.map((tariff) => {
        // Convert operating hours to Date objects for comparison
        const operatingFrom = new Date(
          `1970-01-01T${tariff.operatingHoursFrom}`
        );
        const operatingTo = new Date(`1970-01-01T${tariff.operatingHoursTo}`);

        // Filter matching bookings for each tariff detail
        const matchingBookings = res.data.bookingDetails.filter((booking) => {
          // Ensure matching facilityId
          if (tariff.facilityId !== booking.facilityId) return false;

          // Convert booking start and end times to Date objects for comparison
          const startDate = new Date(`1970-01-01T${booking.startDate}`);
          const endDate = new Date(`1970-01-01T${booking.endDate}`);
          // console.log({operatingFrom, operatingTo, startDate, endDate, boolean: startDate >= operatingFrom || endDate <= operatingTo});
          // Check if the booking times are within the operating hours
          return startDate >= operatingFrom && endDate <= operatingTo;
        });

        // Return the tariff detail object with an additional count property
        return {
          ...tariff,
          bookingCount: matchingBookings.length, // Count of matching bookings
        };
      });

      result = result.map((data) => {
        return {
          ...data,
          ["occupancy"]: defineOccupancyStatus(
            data.bookingCount,
            formData.capacity
          ),
        };
      });

      if (result.length > 0) {
        setSportsSchedule(result);
      }

      // console.log("sports schedule", result);
    } catch (error) {
      console.error("error at fetching availability", error);
    }
  }
  //  here Get types of Sport ----------------------
  // async function GetSportType() {
  //   try {
  //     let res = await axiosHttpClient("PARK_BOOK_PAGE_INITIALDATA_API", "get");
  //     console.log("here Response of Get sport type in dropdown", res.data.data);
  //     setSportsList(
  //       res.data.data.filter((sports) => {
  //         return sports.facilityTypeId == 2;
  //       })
  //     );
  //   } catch (err) {
  //     console.error("here Error of get sport types in dropdown");
  //   }
  // }
  // function to handle payment success
  const handlePaymentSuccess = ({ response, res }) => {
    // console.log("Book park payment success", response);
    let bookingId = res.data.shareableLink[0].bookingId;
    let entityTypeId = res.data.shareableLink[0].entityTypeId;

    toast.success("Playfield has been booked successfully.", {
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
    // GetSportType();
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

    //if facilityId, bookingDate and sports data available, then fetch availability data
    if (
      formData.entityId &&
      formData.facilityPreference.bookingDate &&
      formData.facilityPreference.sports
    ) {
      getAvailabilityOfSpace(
        formData.entityId,
        formData.facilityPreference.bookingDate,
        formData.facilityPreference.sports
      );
    }
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
          <div className="bookingFormWrapper">
            <form className="bookingForm">
              <div className="formGroup">
                <span className="fieldName">
                  Sport<span className="required-asterisk">*</span>:
                </span>
                <select
                  className="formSelect"
                  name="sports"
                  value={formData.facilityPreference.sports}
                  onChange={handleChangeInput}
                >
                  <option value="">Select</option>
                  {sportsList?.length > 0 &&
                    sportsList.map((sports, index) => {
                      return (
                        <option
                          key={index}
                          value={sports.activityData.userActivityId}
                        >
                          {sports.activityData.userActivityName}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="formGroup">
                <span className="fieldName">
                  Date<span className="required-asterisk">*</span>:
                </span>
                <input
                  type="date"
                  className="formInput"
                  name="bookingDate"
                  min={formatDateYYYYMMDD(
                    new Date().toISOString().split("T")[0]
                  )}
                  value={formData.facilityPreference.bookingDate}
                  onChange={handleChangeInput}
                />
              </div>
              {showSchedule && (
                <All_Sports_Schedule
                  closePopup={closePopup}
                  schedule={sportsSchedule}
                  bookingDate={formData.facilityPreference.bookingDate}
                  setTimes={setTimes}
                />
              )}

              <button
                name="timeSlot"
                onClick={handleOpenSchedule}
                className="scheduleButton"
                disabled={!isDateChanged}
              >
                Change Schedule
              </button>

              {/* {showSchedule && (
                <All_Sports_Schedule
                  closePopup={closePopup}
                  schedule={sportsSchedule}
                  bookingDate={formData.facilityPreference.bookingDate}
                  setTimes={setTimes}
                />
              )} */}
              <div className="formGroup">
                <span className="fieldName">
                  Start Time<span className="required-asterisk">*</span>:
                </span>
                <input
                  type="time"
                  className="formInput"
                  name="startTime"
                  value={formData.facilityPreference.startTime}
                  onChange={handleChangeInput}
                  disabled
                />
              </div>
              <div className="formGroup">
                <span className="fieldName">
                  End Time<span className="required-asterisk">*</span>:
                </span>
                <input
                  type="time"
                  className="formInput"
                  name="endTime"
                  //   value={formData.facilityPreference.endTime}
                  value={formData.facilityPreference.endTime}
                  onChange={handleChangeInput}
                  disabled
                />
              </div>
              <div className="formGroup">
                <span className="fieldName">
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

              <div className="formGroup">
                <span className="fieldName">Amount</span>
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
              className="add-to-cart-button"
              onClick={HandleAddtoCart}
              disabled={isDisabled}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="Icon" />
              Add to Cart
            </button>

            {isDisabled ? (
              <button className="razorpay-button" disabled={isDisabled}>
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

const All_Sports_Schedule = ({
  closePopup,
  schedule,
  setTimes,
  bookingDate,
}) => {
  const [selectedSection, setSelectedSection] = useState("morning");
  bookingDate = new Date(bookingDate);
  let weekDaysArray = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  let day = weekDaysArray[bookingDate.getDay()];
  console.log("schedule", schedule);
  // Filter schedule based on selected section
  const filteredSchedule = schedule.filter((item) => {
    // console.log(item);
    const startTime = convertTimeToMinutes(item.operatingHoursFrom);
    const endTime = convertTimeToMinutes(item.operatingHoursTo);
    // console.log({ startTime, endTime });
    if (selectedSection === "morning") {
      return (
        startTime >= convertTimeToMinutes("06:00:00") &&
        endTime <= convertTimeToMinutes("11:59:00")
      );
    }
    if (selectedSection === "afternoon") {
      return (
        startTime >= convertTimeToMinutes("12:00:00") &&
        endTime <= convertTimeToMinutes("15:59:00")
      );
    }
    if (selectedSection === "evening") {
      return (
        startTime >= convertTimeToMinutes("16:00:00") &&
        endTime <= convertTimeToMinutes("20:00:00")
      );
    }
    return false;
  });
  console.log("filteredSchedule", filteredSchedule);
  // Parse time strings into comparable values
  // function convertTimeToMinutes(time) {
  //   const [hour, minute, period] = time?.match(/(\d+):(\d+)\s(AM|:00)/).slice(1);
  //   let hours = parseInt(hour, 10);
  //   if (period === ":00" && hours !== 12) {
  //     hours += 12;
  //   } else if (period === "AM" && hours === 12) {
  //     hours = 0;
  //   }
  //   return hours * 60 + parseInt(minute, 10); // Return total minutes for comparison
  // }

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

  const handleSelect = (startTime, endTime, amount) => {
    setTimes(startTime, endTime, amount); // Pass selected times to parent
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
                  onClick={() =>
                    handleSelect(
                      item.operatingHoursFrom,
                      item.operatingHoursTo,
                      item[`${day}`]
                    )
                  }
                >
                  <div
                    className={`item_occupancy ${getOccupancyClass(
                      item.occupancy
                    )}`}
                  >
                    {item.occupancy}
                  </div>
                  <div className="scheduleTime">
                    {item.operatingHoursFrom.slice(0, 5)} -{" "}
                    {item.operatingHoursTo.slice(0, 5)}
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
