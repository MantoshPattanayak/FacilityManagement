import React, { useEffect, useState } from "react";
import "./ProfileHistory.css";
import CommonHeader from "../../../common/CommonHeader";
import CommonFooter from "../../../common/CommonFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../../../utils/axios";
import { decryptData } from "../../../utils/encryptData";
import { logOutUser } from "../../../utils/utilityFunctions";

const ProfileHistory = () => {
  const tabList = [
    {
      tabName: "All Bookings",
      active: true,
    },
    {
      tabName: "Cancelled",
      active: false,
    },
    {
      tabName: "History",
      active: false,
    },
  ];

  const [tab, setTab] = useState(tabList);
  const [selectedOption, setSelectedOption] = useState("Daily");
  const [userName, setUserName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  function manageCurrentTab(e, name) {
    e.preventDefault();
    const tabListCopy = tabList.map((tabItem) => {
      if (tabItem.tabName === name) {
        return { ...tabItem, active: true };
      } else {
        return { ...tabItem, active: false };
      }
    });
    setTab(tabListCopy);
  }

  //get Api Here

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
      console.error("Error in fetching data:",error);
    }
  }

  useEffect(() => {
    fetchProfileDetails();
  }, []);



  return (
    <div>
      <CommonHeader />
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
                <a href="/Profile" className="">
                  Edit User Profile
                </a>
              </li>
              <li>
                <a
                   href="/BookingDetails"
                   className="profile-button"
                   style={{ color: 'white', backgroundColor:"green" }}
                >
                  Booking Details
                </a>
              </li>
              <li>
                <a href="/UserProfile/Favorites">
                  Favorites
                </a>
              </li>
              <li>
                <a href="/BookParks/Add_Card">Cart Details</a>
              </li>
            </ul>
            {/* Logout Button */}
            <button className="button-67 " onClick={(e)=>{logOutUser(e); navigate('/');}}>
              <h1>Logout</h1>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>

          </div>
        </aside>



        <div className="right-container">
          <div className="eventdetails-tab">
            {tab.map((tabData) => (
              <div
                key={tabData.tabName}
                className={tabData.active ? "active" : ""}
                onClick={(e) => manageCurrentTab(e, tabData.tabName)}
              >
                <button>{tabData.tabName}</button>
              </div>
            ))}
          </div>

          <div className="entry-details">
            <div className="last-entry">
              <p>Last Entry: 22 February 2011, 10.00 AM</p>
            </div>
            <div className="average-time">
              <div className="dropdown">
                <p>Average Time in Park: 1 hour, 20 minutes</p>
                <select
                  className="drop"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
            </div>
            <div className="total-visit">
              <div className="dropdown">
                <p>Total Visits : 5</p>
                <select
                  className="drop"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="Daily">Weekly</option>
                  <option value="Weekly">Daily</option>
                </select>
              </div>
            </div>

            <div className="today">
              <div className="day">
                <p>Today</p>
              </div>
              <div></div>
              <div className="park-name">
                <p>Budha Jayanti Park</p>
                <p>Neeladri vihar , Chandrashekharpur, Bhubaneswar. </p>
                <p>Activity : Running, Walking.</p>
              </div>

              <div className="park-name">
                <p>Budha Jayanti Park</p>
                <p>Neeladri vihar , Chandrashekharpur, Bhubaneswar. </p>
                <p>Activity : Running, Walking.</p>
              </div>
            </div>

            <div className="today">
              <div className="day">
                <p>02/04/2024</p>
              </div>
              <div className="park-name">
                <p>Budha Jayanti Park</p>
                <p>Neeladri vihar , Chandrashekharpur, Bhubaneswar. </p>
                <p>Activity : Running, Walking.</p>
              </div>

              <div className="park-name">
                <p>Gopabandhu Sports Ground</p>
                <p>Neeladri vihar , Chandrashekharpur, Bhubaneswar. </p>
                <p>Activity : Running, Walking.</p>
              </div>
            </div>

            <div className="today">
              <div className="day">
                <p>05/03/2024</p>
              </div>
              <div className="park-name">
                <p>Budha Jayanti Park</p>
                <p>Neeladri vihar , Chandrashekharpur, Bhubaneswar. </p>
                <p>Activity : Running, Walking.</p>
              </div>

              <div className="park-name">
                <p>Gopabandhu Sports Ground</p>
                <p>Neeladri vihar , Chandrashekharpur, Bhubaneswar. </p>
                <p>Activity : Running, Walking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </div>
  );
};

export default ProfileHistory;
