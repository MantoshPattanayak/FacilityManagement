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
import instance from "../../../../../env";
export default function ReviewEventDetailsList() {
  const tabList = [
    {
      tabName: "Hosting Requests",
      active: true,
      statusInput: 10
    },
    {
      tabName: "Approved",
      active: false,
      statusInput: 11
    },
    {
      tabName: "Rejected",
      active: false,
      statusInput: 13
    }
  ];
  const [tab, setTab] = useState(tabList);

  const [eventDetails, setEventDetails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // State to store selected date
  const [givenReq, setGivenReq] = useState("");
  //here Location crypto and navigate the page ---------------
  const location = useLocation();

  // here Get the data -----------------------------------
  async function GetDisplayReviewEvents() {
    try {
      let res = await axiosHttpClient(
        "REVIEW_EVENTS_VIEWLIST_API",
        "post", { statusCode: tabList.filter((data) => { return data.active == true })[0].statusInput, givenReq }
      );
      console.log("Get data of ResourceEvent", res);
      setEventDetails(res.data.data);
    } catch (err) {
      console.log("here Error", err);
    }
  }

  useEffect(() => {
    GetDisplayReviewEvents();
  }, []);


  useEffect(() => {
    console.log("useEffect triggered");
    GetDisplayReviewEvents();
  }, [tab, givenReq]);

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
    setSelectedDate(event.target.value); // Update selected date on change
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
                    <img src={event.eventMainImage ? instance().baseURL + '/static/' + event.eventMainImage : eventPhoto} className='border rounded-md' alt='photo' />
                  </div>
                  <div className="eventdetails-details">
                    <div className="eventdetails-details-eventname">
                      {event.eventName}
                    </div>
                    <div className="eventdetails-details-eventAddress">
                      {event.address || 'NA'}
                    </div>
                    <div className="flex eventdetails-details-eventTime">

                      <div> Booked  at :   {formatTime(event.eventEndTime || 'NA')}</div>
                      <div>
                        <FontAwesomeIcon icon={faClock} />{" "}
                        {event.requestDate?.substring(0, 10) || 'NA'}
                      </div>
                    </div>


                    <div>
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
                    </div>

                  </div>
                </div>
              );
            })}
          {
            eventDetails?.length == 0 && (
              <div className="no-data-message-details">

              </div>
            )
          }
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
