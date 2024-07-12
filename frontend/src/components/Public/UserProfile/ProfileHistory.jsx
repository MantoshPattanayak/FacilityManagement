import React, { useEffect, useState } from "react";
import "./ProfileHistory.css";
import CommonHeader from "../../../common/CommonHeader";
import CommonFooter from "../../../common/CommonFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../../../utils/axios";
import { decryptData } from "../../../utils/encryptData";
import PublicHeader from "../../../common/PublicHeader";
import { logOutUser } from "../../../utils/utilityFunctions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../../../utils/authSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  let navigate = useNavigate();

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
      console.error("Error in fetching data:", error);
      if (error.respone.status == 401) {
        toast.error('You are logged out. Kindly login first.', {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        })
      }
    }
  }

  function handleLogout(e) {
    // logOutUser(e);
    dispatch(Logout());
    async function logOutAPI() {
      try {
        let res = await axiosHttpClient('LOGOUT_API', 'post');
        console.log(res.data);
        toast.success('Logged out successfully!!', {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      }
      catch (error) {
        console.error(error);
      }
    }
    logOutAPI();
  }

  useEffect(() => {
    fetchProfileDetails();
  }, []);



  return (
    <div>
      <PublicHeader />
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
                  href="/ProfileHistory"
                  className="profile-button"
                  style={{ color: 'white', backgroundColor: "green" }}
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
                <a href="/cart-details">Cart Details</a>
              </li>
            </ul>
            {/* Logout Button */}
            <button className="button-67 " onClick={(e) => { handleLogout(e); navigate('/') }}>
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

            <div className="ProfileHistoryDesc">
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
            </div>

            <div className="today">
              <div className="day">
                <p>Today</p>
              </div>
              <div></div>
              <div className="park-name">
                <p>Budha Jayanti Park</p>
                <p>Neeladri vihar , Chandrashekharpur, Bhubaneswar</p>
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
