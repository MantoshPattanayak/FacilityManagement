import React, { useState } from "react";
import "./ProfileHistory.css";
import CommonHeader from "../../../common/CommonHeader";
import CommonFooter from "../../../common/CommonFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
// import { faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";/

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

  return (
    <div>
      <CommonHeader />
      <div className="booking-dtails-container">
        <div className="user-profile-section">
          <div className="user-details">
            <p>Test User</p>
            <p>7008765443</p>
            <p>testuser@gmail.com</p>
          </div>
          <div>
            <ul className="profile-button--Section">
              <li>
                <a href="#" className="">
                  Edit User Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                >
                  Booking Details
                </a>
              </li>
              <li>
                <a href="#">
                  Favorites
                </a>
              </li>
              <li>
                <a href="#">Cart Details</a>
              </li>
            </ul>
            {/* Logout Button */}
            <button className="button-67 ">
              <h1>Logout</h1>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>

          </div>
        </div>

        

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
