import React from "react";
import AdminHeader from "../../../../common/AdminHeader";
import Footer from "../../../../common/Footer";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faClock } from "@fortawesome/free-solid-svg-icons";
import "./ReviewEventDetailsList.css";
import eventPhoto from "../../../../assets/ama_bhoomi_bg.jpg";
import axiosHttpClient from "../../../../utils/axios";
// Import  Crypto js for entry and decrpty the data -----------------------------------
// import { decryptData, encryptData } from "../../../utils/encryptData";
import { decryptData, encryptData } from "../../../../utils/encryptData";
export default function ReviewEventDetailsList() {
  const tabList = [
    {
      tabName: "Hosting Requests",
      active: true,
    },
    {
      tabName: "Approved",
      active: false,
    },
    {
      tabName: "Rejected",
      active: false,
    },
  ];
  const [tab, setTab] = useState(tabList);

  const [eventDetails, setEventDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
  //here Location / crypto and navigate the page---------------
  const location = useLocation();
  const viewId = decryptData(
    new URLSearchParams(location.search).get("viewId")
  );
  const action = new URLSearchParams(location.search).get("action");
  const navigate = useNavigate();
  // here Get the data --------------------------------
  async function GetDisplayReviewEvents() {
    try {
      let res = await axiosHttpClient(
        "REVIEW_EVENTS_VIEWLIST_API",
        "post", {
          statusInput: 10
        }
      );
      console.log("Get data of ResourceEvent", res);
    } catch (err) {
      console.log("here Error", err);
    }
  }

  useEffect(() => {
    GetDisplayReviewEvents();
  }, []);

  //fetch data of event details
  const fetchInitialData = async () => {
    console.log("fetchInitialData called");
    try {
      let res = await axiosHttpClient("REVIEW_EVENTS_VIEWLIST_API", "post");
      console.log("Review event initial data fetch response", res);
      //    setEventDetails(res.data);
    } catch (error) {
      console.log("error in fetching data", error);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    fetchInitialData();
  }, []);
  //   useEffect(() => {
  //     console.log("useEffect triggered");
  //     fetchInitialData();
  //   }, [tab]);
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
    // e.preventDefault();
    let tabListCopy = JSON.parse(JSON.stringify(tab));
    tabListCopy.forEach((tab) => {
      if (tab.tabName == name) tab.active = true;
      else tab.active = false;
    });
    // console.log('tabListCopy', tabListCopy);
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
      const filteredEvents = eventDetailsData.filter((event) => {
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
    }
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); // Update selected date on change
  };

  return (
    <>
      <AdminHeader />
      <div className="specialevent-form-container">
        {/* <div className="specialevent-form-heading">
          <h2>Manage event details</h2>
        </div> */}
        <div className="heading">
          <h2>Manage event details</h2>
        </div>
        <div className="specialevent-search_text_conatiner">
          <input
            type="text"
            className="specialevent-search_input_field"
            placeholder="Search..."
          />
          <input
            type="date"
            className="specialevent-search_input_calender"
            onChange={handleDateChange}
          />
        </div>
        <div className="specialevent-eventdetails-tab">
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
        <div className="specialevent-eventdetails-cardsection">
          {eventDetails?.length > 0 &&
            eventDetails.map((event) => {
              return (
                <div className="specialevent-eventdetails-carddetails">
                  <div className="specialevent-eventdetails-photo">
                    <img src={eventPhoto} />
                  </div>
                  <div className="specialevent-eventdetails-details">
                    <div className="specialevent-eventdetails-details-eventname">
                      {event.eventName}
                    </div>
                    <div className="specialevent-eventdetails-details-eventAddress">
                      {event.eventAddress}
                    </div>
                    <div className="flex justify-between specialevent-eventdetails-details-eventTime">
                      <div>Booked at {event.bookedTiming}</div>
                      <div>
                        <FontAwesomeIcon icon={faClock} />{" "}
                        {event.createdDate.substring(0, 10)}{" "}
                      </div>
                    </div>
                    {/* <div><button className='eventdetails-eventbutton' onClick={navigateToDetailsPage(event.eventName)}>Event details</button></div> */}
                    <button className="Event-Details-btn"
                      onClick={() => navigate("/Activity/EventDetailsPage")}
                    >
                      Event Details
                    </button>
                    <div>
                    <Link
                          key={table_index}
                          to={{
                            pathname: "/Activity/EventDetailsPage",
                            search: `?viewId=${encryptDataId(viewId)}`,
                          }}
                        >
                          Details
                        </Link>
                      </div>

                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
