import React from "react";
import "../UserProfile/BookingDetails.css";
import { useState, useEffect } from "react";
import eventPhoto from "../../../assets/ama_bhoomi_bg.jpg";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faClock,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import CommonFooter from "../../../common/CommonFooter";
import axiosHttpClient from "../../../utils/axios";
import PublicHeader from "../../../common/PublicHeader";
import { formatDate, logOutUser } from "../../../utils/utilityFunctions";
import { encryptData } from "../../../utils/encryptData";
import No_Data_icon from "../../../assets/No_Data_icon.png";
// import format
const BookingDetails = () => {
  let navigate = useNavigate();
  const tabList = [
    {
      tabName: "All Bookings",
      tabCode: "ALL_BOOKINGS",
      active: true,
    },
    // {
    //   tabName: "Cancelled",
    //   tabCode: "CANCELLED",
    //   active: false,
    // },
    {
      tabName: "History",
      tabCode: "HISTORY",
      active: false,
    },
  ];
  const [tab, setTab] = useState(tabList);
  const [eventDetailsData, setEventDetailsData] = useState([]);

  // here UseEffect of Update the data--------------------
  useEffect(() => {
    getBookingsDetails();
  }, []);

  async function getBookingsDetails() {
    let tabCode = tab?.find((data) => {
      return data.active == true;
    }).tabCode;

    try {
      let res = await axiosHttpClient(
        "VIEW_BOOKINGS_API",
        "post",
        {
          tabName: tabCode,
        },
        null
      );
      setEventDetailsData(res.data.data);
      console.log("here response of all bookings details", res.data.data);
    } catch (err) {
      setEventDetailsData([]);
      console.log(err);
    }
  }


  useEffect(() => { getBookingsDetails() }, [tab]);

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
    console.log('tabListCopy', tabListCopy);
    setTab(tabListCopy);
    return;
  }
  return (
    <div>
      <PublicHeader />
      <div className="booking-dtails-container">
        <div className="booking-dtails-container">
          <div className="user-profile-section">
            <div className="user-details">
              <FontAwesomeIcon icon={faUser} className="icon-user" />
              <p>Test User</p>
              <p>7008765443</p>
              <p>testuser@gmail.com</p>
            </div>
            <div className="buttons-profile">
              <button className="edit-profile-btn">Edit User Profile</button>
              <button className="edit-profile-btn">Booking Details</button>
              <button className="edit-profile-btn">Favorites</button>
              <button className="edit-profile-btn">Card Details</button>
            </div>
            <button className="logout-button" onClick={(e) => {logOutUser(); navigate('/')}}>
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </button>
          </div>
          <div className="right-container-booking-details">
            {/* New div with paragraph and blue border */}
            {/* <div className="form-container"> */}
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
            {
              eventDetailsData?.length > 0 &&
              <div className="eventdetails-cardsection">
                {eventDetailsData?.length > 0 &&
                  eventDetailsData?.map((event) => {
                    return (
                      <div className="eventdetails-carddetails">
                        <div className="eventdetails-photo">
                          <img src={eventPhoto} />
                        </div>
                        <div className="eventdetails-details">
                          <div className="eventdetails-details-eventname">
                            {event.name}
                          </div>
                          <div className="eventdetails-details-eventAddress">
                            {event.location}
                          </div>
                          <div className="flex justify-between eventdetails-details-eventTime">
                            <div>Booking Date {formatDate(event.bookingDate)}</div>
                            {/* <div>
                              <FontAwesomeIcon icon={faClock} />{" "}
                              {calculateTime(event.createdDate)} ago
                            </div> */}
                          </div>
                          {
                            event.type == 'Parks' ?
                              <Link
                                className="eventdetails-eventbutton"
                                to={{
                                  pathname: "/Sub_Park_Details",
                                  search: `?facilityId=${encryptData(event.Id)}`,
                                }}
                              >
                                Details
                              </Link>
                              : event.type == 'Playgrounds' ?
                                <Link
                                  className="eventdetails-eventbutton"
                                  to={{
                                    pathname: "/Sub_Park_Details",
                                    search: `?facilityId=${encryptData(event.Id)}`,
                                  }}
                                >
                                  Details
                                </Link> : null
                          }

                        </div>
                      </div>
                    );
                  })}
              </div>
            }

            {
              eventDetailsData?.length == 0 &&
              <div className="flex justify-center w-full">
                <img src={No_Data_icon} alt="No Data Found" />
              </div>
            }
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
    // </div>
  );
};
export default BookingDetails;