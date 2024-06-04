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
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { decryptData } from "../../../utils/encryptData";
// import format
import Bokking_Bill from "../Booking_Bill/Booking_Bill";
// redux --------------------------------------------------------------------------
import { useDispatch } from 'react-redux';
import { Logout } from "../../../utils/authSlice";
const BookingDetails = () => {
  const dispatch = useDispatch(); // Initialize dispatch
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


  //get the api here

  const [userName, setUserName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  const publicUserId = decryptData(
    new URLSearchParams(location.search).get("publicUserId")
  );

  async function fetchProfileDetails() {
    try {
      let res = await axiosHttpClient('PROFILE_DATA_VIEW_API', 'post');
      console.log('response of fetch profile api', res.data.public_user);

      setUserName(decryptData(res.data.public_user.userName));
      setEmailId(decryptData(res.data.public_user.emailId));
      setPhoneNo(decryptData(res.data.public_user.phoneNo));
    }
    catch (error) {
      console.error("Error in fetching data:", error);
    }
  }

  useEffect(() => {
    fetchProfileDetails();
  }, []);
  //handle for Logout ------------------------------------
  const handleLogout = () => {
    dispatch(Logout());
    navigate('/')
  }
  // here Function to encryptDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleDetailsClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  return (
    <div>
      <PublicHeader />
      {/* <div className="booking-dtails-container"> */}
      <div className="booking-dtails-container">
        <aside className="profile-leftside--Body">
          <div className="profile-view--Body">
            <div className="profile-about">
              <p>{userName}</p>
              <p>{emailId}</p>
              <p>{phoneNo}</p>
            </div>
          </div>
          <div>
            <ul className="profile-button--Section">
              <li>
                <Link to="/Profile" className="">
                  Edit User Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/BookingDetails"
                  className="profile-button"
                  style={{ color: 'white', backgroundColor: 'green' }}
                >
                  Booking Details
                </Link>
              </li>
              <li>
                <Link to="/UserProfile/Favorites">
                  Favorites
                </Link>
              </li>
            </ul>
            {/* Logout Button */}
            <button className="button-67 " onClick={handleLogout}>
              <h1>Logout</h1>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>

          </div>
        </aside>
        <div className="right-container-favorite">
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
                          <div className="booking-date">Booking Date {formatDate(event.bookingDate)}</div>
                          {/* <div>
                              <FontAwesomeIcon icon={faClock} />{" "}
                              {calculateTime(event.createdDate)} ago
                            </div> */}
                        </div>


                        <Link

               
                          to={{
                            pathname: "/BookParks/Bokking_Bill",
                            search: `?bookingId=${encryptDataId(event.bookingId)}`,
                          }}
                          className="eventdetails-eventbutton"

                        >
                          Details
                        </Link>

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

    // </div>
    // </div>
  );
};
export default BookingDetails;