import React, { useCallback } from "react";
import AdminHeader from "../../../../common/AdminHeader";
import Footer from "../../../../common/Footer";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";
import "./ReviewEventDetailsList.css";
import "./EventDetailsPage.css";
import eventPhoto from "../../../../assets/ama_bhoomi_bg.jpg";
import axiosHttpClient from "../../../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
// Import  Crypto js for entry and decrpty the data -----------------------------------
// import { decryptData, encryptData } from "../../../utils/encryptData";
import { decryptData, encryptData } from "../../../../utils/encryptData";
import instance from "../../../../../env";
import { formatDate } from "../../../../utils/utilityFunctions";
export default function ReviewEventDetailsList() {
  const tabList = [
    {
      tabName: "Hosting Requests",
      active: true,
      statusInput: 10,
    },
    {
      tabName: "Approved",
      active: false,
      statusInput: 11,
    },
    {
      tabName: "Rejected",
      active: false,
      statusInput: 13,
    },
  ];
  const [tab, setTab] = useState(tabList);

  const [eventDetails, setEventDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
  const [givenReq, setGivenReq] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [action, setAction] = useState("");
  const [subjectMessage, setsubjectMessage] = useState({
    subject: "",
    messageBody: "",
  });
  const [subjectError, setSubjectError] = useState("");
  const [messageBodyError, setMessageBodyError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);

  //here Location crypto and navigate the page ---------------
  const location = useLocation();
  const navigate = useNavigate();

  // function to debounce fetching eventHostingRequest
  function debounce (fn, delay) {
    let timeoutId;
    return function(...args) {
      setTimeout(() => {
        fn(...args)
      }, delay)
    }
  }

  // here Get the data -----------------------------------
  async function GetDisplayReviewEvents(tab, givenReq = null) {
    try {
      console.log(
        "tab active",
        tab.filter((data) => {
          return data.active == true;
        })[0].statusInput
      );
      let res = await axiosHttpClient("REVIEW_EVENTS_VIEWLIST_API", "post", {
        statusCode: tab.filter((data) => {
          return data.active == true;
        })[0].statusInput,
        givenReq,
      });
      console.log("Get data of GetDisplayReviewEvents", res.data.data);
      if (res.data.data.length > 0) setEventDetails(res.data.data);
      else setEventDetails([]);
    } catch (err) {
      console.log("here Error", err);
      setEventDetails([]);
    }
  }

  let debouncedGetDisplayReviewEvents = useCallback(debounce(GetDisplayReviewEvents, 500), []);

  useEffect(() => {
    debouncedGetDisplayReviewEvents();
  }, []);

  useEffect(() => {
    console.log("useEffect triggered");
    debouncedGetDisplayReviewEvents(tab, givenReq);
  }, [tab, givenReq, debouncedGetDisplayReviewEvents]);

  // Cal the time and data --------------------------------
  function calculateTime(dataTime) {
    let currentDateTime = new Date();
    let inputDateTime = new Date(dataTime);
    let differenceDateTime = Math.floor(
      (currentDateTime - inputDateTime) / (1000 * 60 * 60)
    );
    if (differenceDateTime < 1) {
      differenceDateTime = Math.floor(
        ((currentDateTime - inputDateTime) % (1000 * 60 * 60)) / (1000 * 60)
      );
    }
    // console.log('difference datetime', {currentDateTime, inputDateTime, differenceDateTime});
    let timeParams = differenceDateTime < 1 ? " min" : " hour(s)";
    return differenceDateTime + timeParams;
  }

  function manageCurrentTab(e, name) {
    e.preventDefault();
    console.log("manageCurrentTab", name);
    let tabListCopy = JSON.parse(JSON.stringify(tab));
    tabListCopy.forEach((tab) => {
      if (tab.tabName == name) tab.active = true;
      else tab.active = false;
    });
    console.log("tabListCopy", tabListCopy);
    setTab(tabListCopy);
    return;
  }
  // Encrpt data----------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  useEffect(() => {
    // Filter eventDetails based on selectedDate on change
    if (selectedDate) {
      const filteredEvents = eventDetails.filter((event) => {
        const eventDate = new Date(event.createdDate);
        const selectedDateObj = new Date(selectedDate);
        return (
          eventDate.getFullYear() === selectedDateObj.getFullYear() &&
          eventDate.getMonth() === selectedDateObj.getMonth() &&
          eventDate.getDate() === selectedDateObj.getDate()
        );
      });
      setEventDetails(filteredEvents);
    } else {
      // setEventDetails(); // Reset to all events if no date selected
      debouncedGetDisplayReviewEvents(tab, givenReq)
    }
  }, [selectedDate]);

  function formatTime(time24) {
    if (!time24) return;
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
  }
  const handleDateChange = (event) => {
    console.log(event.target.value)
    setSelectedDate(event.target.value); // Update selected date on change
  };

  /// here in Open Module set the action  and set------
  // const openModal = (actionType) => {
  //   setAction(actionType);
  //   console.log("here action type", actionType);
  //   setModalIsOpen(true);
  // };
  const openModal = (actionType, eventId) => {
    setAction(actionType);
    setSelectedEventId(eventId); // Store the selected event ID
    setModalIsOpen(true);
  };

  // here in Modal set the subject and message body -------
  const closeModal = () => {
    setModalIsOpen(false);
    setsubjectMessage({ subject: "", messageBody: "" });
  };

  // here Approve and Reject Api -----------------------
  // Approve and Reject API
  const Approved_RejectEvent = async (e) => {
    e.preventDefault();
    const errors = validation(subjectMessage);
    if (Object.keys(errors).length > 0) {
      return; // Return early if there are validation errors
    }

    try {
      let res = await axiosHttpClient(
        "REVIEW_EVENTS_PERFORM_APPROVE_REJECT_API",
        "put",
        {
          action: action,
          subject: subjectMessage.subject,
          messageBody: subjectMessage.messageBody,
        },
        selectedEventId
      );
      console.log("Response of Approve Reject API", res);
      if (action === "APPROVE") {
        toast.success("Event Host Request is approved successfully!");
        navigate(0);
      } else if (action === "REJECT") {
        toast.success("Event Host Request is rejected!");
      }
      
      // setTimeout(() => {
      //   window.location.reload(); 
      // }, 2000);
    } catch (err) {
      console.log("Error of Approve and Reject API", err.response || err);
      toast.error("Event action failed. Try again!");
    }
  };

  // here Validation of sub and message during  take action ------------
  const validation = (value) => {
    const errors = {};
    const space_block = /^[^\s][^\n\r]*$/;
    if (!value.subject) {
      errors.subject = "Subject is required";
    } else if (!space_block.test(value.subject)) {
      errors.subject = "Do not use spaces at the beginning";
    }
    if (!value.messageBody) {
      errors.messageBody = "Message is required";
    } else if (!space_block.test(value.messageBody)) {
      errors.messageBody = "Do not use spaces at the beginning";
    }
    setSubjectError(errors.subject || "");
    setMessageBodyError(errors.messageBody || "");

    return errors;
  };

  return (
    <>
      <AdminHeader />
      <div className="ReviewEventRequest">
        <div className="table-heading">
          <h2>Manage event details</h2>
        </div>
        <div className="search_text_conatiner">
          <input
            type="text"
            className="search_input_field"
            placeholder="Search..."
            value={givenReq}
            onChange={(e) => setGivenReq(e.target.value)}
          />
          <input
            type="date"
            className="search_input_calender"
            onChange={handleDateChange}
          />
        </div>
        <div className="eventdetails-tab">
          {tab?.length > 0 &&
            tab.map((tabData) => {
              if (tabData.active) {
                return (
                  <div
                    className="active"
                    onClick={(e) => manageCurrentTab(e, tabData.tabName)}
                  >
                    <button
                      onClick={(e) => manageCurrentTab(e, tabData.tabName)}
                    >
                      {tabData.tabName}
                    </button>
                  </div>
                );
              } else {
                return (
                  <div onClick={(e) => manageCurrentTab(e, tabData.tabName)}>
                    <button
                      onClick={(e) => manageCurrentTab(e, tabData.tabName)}
                    >
                      {tabData.tabName}
                    </button>
                  </div>
                );
              }
            })}
        </div>
        <div className="eventdetails-cardsection">
          {eventDetails?.length > 0 &&
            eventDetails.map((event, index) => {
              return (
                <div className="eventdetails-carddetails">
                  <div className="eventdetails-photo">
                    <img
                      src={
                        event.eventMainImage
                          ? instance().baseURL +
                            "/static/" +
                            event.eventMainImage
                          : eventPhoto
                      }
                      className="border rounded-md"
                      alt="photo"
                    />
                  </div>
                  <div className="eventdetails-details">
                    <div className="eventdetails-details-eventname">
                      {event.eventName}
                    </div>
                    <div className="eventdetails-details-eventAddress">
                      {event.address || "NA"}
                    </div>
                    <div className="flex eventdetails-details-eventTime gap-x-5">
                      <div>
                        {" "}
                        Booked at : <FontAwesomeIcon icon={faCalendar} /> {formatDate(event.requestDate?.substring(0, 10)) || "NA"}
                      </div>
                      <div>
                        <FontAwesomeIcon icon={faClock} />{" "}
                        {formatTime(event.eventEndTime || "NA")}
                      </div>
                    </div>

                    <div className="red_buttonContainer">
                      <Link
                        key={index}
                        to={{
                          pathname: "/Activity/EventDetailsPage",
                          search: `?eventId=${encryptDataId(event.eventId)}`,
                        }}
                        className="Event-Details-btn"
                      >
                        View Details
                      </Link>

                      <div className="buttons-container">
                        <button
                          className="approve-button"
                          onClick={() => openModal("APPROVE", event.eventId)}
                        >
                          Approve
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => openModal("REJECT", event.eventId)}
                        >
                          REJECT
                        </button>
                      </div>
                      {modalIsOpen && (
                        <div className="modal-overlay">
                          <div className="modal">
                            <h2 className="action_approve_reject">
                              {action === "APPROVE"
                                ? "Approve Event"
                                : "Reject Event"}
                            </h2>
                            <form onSubmit={(e) => Approved_RejectEvent(e)}>
                              <div className="form-group">
                                <label>Subject:</label>
                                <input
                                  type="text"
                                  name="subject"
                                  value={subjectMessage.subject}
                                  onChange={(e) =>
                                    setsubjectMessage({
                                      ...subjectMessage,
                                      subject: e.target.value,
                                    })
                                  }
                                />
                                {subjectError && (
                                  <span className="error-message">
                                    {subjectError}
                                  </span>
                                )}
                              </div>
                              <div className="">
                                <label>Message:</label>
                                <textarea
                                  value={subjectMessage.messageBody}
                                  onChange={(e) =>
                                    setsubjectMessage({
                                      ...subjectMessage,
                                      messageBody: e.target.value,
                                    })
                                  }
                                ></textarea>
                                {messageBodyError && (
                                  <span className="error-message">
                                    {messageBodyError}
                                  </span>
                                )}
                              </div>
                              <div className="buttons-container21">
                                <button
                                  className="approve-button"
                                  type="button"
                                  onClick={Approved_RejectEvent}
                                >
                                  Submit
                                </button>
                                <button
                                  type="button"
                                  className="cancel-button"
                                  onClick={closeModal}
                                >
                                  Close
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          {eventDetails?.length == 0 && (
            <div className="no-data-message-details"></div>
          )}
        </div>
        <ToastContainer />
      </div>
      {/* <Footer /> */}
    </>
  );
}
