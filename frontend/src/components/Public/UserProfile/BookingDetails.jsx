import React from "react";
import "../UserProfile/BookingDetails.css";
import "../UserProfile/Profile.css";
import { useState, useEffect, useRef } from "react";
import eventPhoto from "../../../assets/ama_bhoomi_bg.jpg";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faTrashCan,
  faEllipsisVertical,
  faClock,
  faUser,
  faRightFromBracket,
  faEnvelope,
  faMobileScreenButton,
} from "@fortawesome/free-solid-svg-icons";
import CommonFooter from "../../../common/CommonFooter";
import axiosHttpClient from "../../../utils/axios";
import PublicHeader from "../../../common/PublicHeader";
import { formatDate, logOutUser } from "../../../utils/utilityFunctions";
import { encryptData } from "../../../utils/encryptData";
import No_Data_icon from "../../../assets/No_Data_icon.png";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { decryptData } from "../../../utils/encryptData";
// redux --------------------------------------------------------------------------
import { useDispatch } from "react-redux";
import { Logout } from "../../../utils/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShimmerUIFlex from "../../../common/ShimmerUIFlex";

const BookingDetails = () => {
  const dispatch = useDispatch(); // Initialize dispatch
  let navigate = useNavigate();
  const tabList = [
    {
      tabName: "All Bookings",
      tabCode: "ALL_BOOKINGS",
      active: true,
    },
    {
      tabName: "Upcoming",
      tabCode: "UPCOMING",
      active: false,
    },
    {
      tabName: "History",
      tabCode: "HISTORY",
      active: false,
    },
  ];

  //for filter Options
  const [IsLoding, setIsLoding] = useState(false);
  const [filters, setFilters] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState({
    facilityType: new Array(),
    BookingStatus: new Array(),
  });

  const [sortOrder, setSortOrder] = useState("desc"); // Default sort order: descending
  const [tab, setTab] = useState(tabList);
  const [eventDetailsData, setEventDetailsData] = useState([]);
  const [Loading, setLoading] = useState(false)

  // here UseEffect of Update the data--------------------
  useEffect(() => {
    getBookingsDetails();
  }, []);

  // Update useEffect to watch for selectedFilter changes
  useEffect(() => {
    getBookingsDetails();
  }, [tab, selectedFilter, sortOrder]);

  // API to get the booking details
  async function getBookingsDetails() {
    let tabCode = tab.find((data) => data.active === true).tabCode;

    // Prepare the filter data
    let filterData = {
      tabName: tabCode,
      facilityType: selectedFilter.facilityType,
      bookingStatus: selectedFilter.BookingStatus,
      sortingOrder: sortOrder,
    };

    try {
      setIsLoding(true);
      let res = await axiosHttpClient("VIEW_BOOKINGS_API", "post", filterData);
      let sortedData = res.data.data.sort((a, b) => {
        if (sortOrder === "asc") {
          return new Date(a.bookingDate) - new Date(b.bookingDate);
        } else {
          return new Date(b.bookingDate) - new Date(a.bookingDate);
        }
      });
      setEventDetailsData(res.data.data);
      console.log("here response of all bookings details", res.data.data);
      setIsLoding(false);
    } catch (err) {
      setEventDetailsData([]);
      console.log(err);
      setIsLoding(false);
    }
  }

  // API to get the filter details
  async function getFiltersDetails() {
    try {
      let res = await axiosHttpClient(
        "FETCH_BOOKINGS_INITIAL_FILTERDATA_API",
        "get"
      );
      console.log("response of filter api", res.data.data);
      let filterOptions = {
        facilityType: res.data.data.facilityTypeQueryResult,
        BookingStatus: res.data.data.statusCodeMasterQueryResult,
      };
      setFilters(filterOptions);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getBookingsDetails(), getFiltersDetails();
  }, [tab]);

  //  function to set filter selection
  function handleFilterSelection(e, id, filterType) {
    e.preventDefault();
    let filterSelected = JSON.parse(JSON.stringify(selectedFilter));
    if (filterSelected[filterType].includes(id)) {
      filterSelected[filterType] = filterSelected[filterType].filter(
        (data) => data != id
      );
    } else {
      filterSelected[filterType].push(id);
    }
    setSelectedFilter(filterSelected);

    // Fetch the filtered data
    // getBookingsDetails();
  }

  //function to clear all filter selection
  function clearFilterSelection(e) {
    setSelectedFilter({
      facilityType: [],
      BookingStatus: [],
    });
    setIsFilterOpen(false);

    // Fetch the filtered data
    getBookingsDetails();
  }

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
    console.log("tabListCopy", tabListCopy);
    setTab(tabListCopy);
    return;
  }

  //get the api here

  const [userName, setUserName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const publicUserId = decryptData(
    new URLSearchParams(location.search).get("publicUserId")
  );

  async function fetchProfileDetails() {
    try {
      let res = await axiosHttpClient("PROFILE_DATA_VIEW_API", "post");
      console.log("response of fetch profile api", res.data.public_user);

      setUserName(
        decryptData(res.data.public_user[0].firstName) +
        " " +
        decryptData(res.data.public_user[0].lastName)
      );
      setEmailId(decryptData(res.data.public_user[0].emailId));
      setPhoneNo(decryptData(res.data.public_user[0].phoneNo));
    } catch (error) {
      console.error("Error in fetching data:", error);
      if (error.respone.status == 401) {
        toast.error("You are logged out. Kindly login first.", {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      }
    }
  }

  useEffect(() => {
    fetchProfileDetails();
  }, []);
  //handle for Logout ------------------------------------
  const handleLogout = (e) => {
    // logOutUser(e);
    dispatch(Logout());
    async function logOutAPI() {
      try {
        let res = await axiosHttpClient("LOGOUT_API", "post");
        console.log(res.data);
        toast.success("Logged out successfully!!", {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
    logOutAPI();
  };
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

  // filter logic
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  //When Click on outside filter it will close............................................

  const filterRef = useRef(null); // Ref for the filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <main>
      <div>
        <PublicHeader />
        <ToastContainer />
        {/* <div className="booking-dtails-container"> */}
        <div className="booking-dtails-container">
          <aside className="profile-leftside--Body">
            <div className="profile-view--Body">
              <div className="profile-about">
                <div className="profile-about-icon">
                  <FontAwesomeIcon icon={faUser} />
                  <p>{userName}</p>
                </div>

                <div className="profile-about-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <p>{emailId}</p>
                </div>

                <div className="profile-about-icon">
                  <FontAwesomeIcon icon={faMobileScreenButton} />
                  <p>{phoneNo}</p>
                </div>
              </div>
            </div>
            <div>
              <ul className="profile-button--Section">
                <li className="profile_edit_booking_details">
                  <Link to="/Profile" className="">
                    Edit User Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/BookingDetails"
                    className="profile-button"
                    style={{ color: "white", backgroundColor: "green" }}
                  >
                    Booking Details
                  </Link>
                </li>
                <li>
                  <Link to="/UserProfile/Favorites">Favorites</Link>
                </li>
              </ul>
              {/* Logout Button */}
              {/* <button
              className="button-67 "
              onClick={(e) => {
                handleLogout(e);
                navigate("/");
              }}
            >
              <h1>Logout</h1>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button> */}
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

            {/* add filter option.............. */}
            <div className="filterSctions">
              <div className="grid grid-cols-3 gap-x-2 items-center">
                <div className="filter-container col-span-1">
                  <div className="filter_option" onClick={toggleFilter}>
                    <div className="filter-icon">
                      <FontAwesomeIcon icon={faFilter} />
                    </div>
                    <div className="text-filter">Filters</div>
                  </div>
                  {isFilterOpen && (
                    <div
                      className="filter-dropdown grid grid-cols-3 gap-x-3 max-w-max	text-xs w-content"
                      ref={filterRef}
                      style={{ width: "max-content" }}
                    >
                      <div className="col-span-1 max-w-max mx-auto">
                        <b>Facility Type</b>
                        {filters?.facilityType?.length > 0 &&
                          filters.facilityType.map((facility, index) => {
                            if (
                              selectedFilter.facilityType.includes(
                                facility.facilitytypeId
                              )
                            ) {
                              return (
                                <label>
                                  <input
                                    type="checkbox"
                                    name="boating"
                                    onChange={(e) =>
                                      handleFilterSelection(
                                        e,
                                        facility.facilitytypeId,
                                        "facilityType"
                                      )
                                    }
                                    checked={true}
                                  />
                                  {facility.description}
                                </label>
                              );
                            } else {
                              return (
                                <label>
                                  <input
                                    type="checkbox"
                                    name="boating"
                                    onChange={(e) =>
                                      handleFilterSelection(
                                        e,
                                        facility.facilitytypeId,
                                        "facilityType"
                                      )
                                    }
                                    checked={false}
                                  />
                                  {facility.description}
                                </label>
                              );
                            }
                          })}
                      </div>
                      <div className="col-span-1 max-w-max">
                        <b>Booking Status</b>
                        {filters?.BookingStatus?.length > 0 &&
                          filters.BookingStatus.map((status, index) => {
                            if (
                              selectedFilter.BookingStatus.includes(
                                status.statusId
                              )
                            ) {
                              return (
                                <label>
                                  <input
                                    type="checkbox"
                                    name="boating"
                                    onChange={(e) =>
                                      handleFilterSelection(
                                        e,
                                        status.statusId,
                                        "BookingStatus"
                                      )
                                    }
                                    checked
                                  />
                                  {status.statusCode}
                                </label>
                              );
                            } else {
                              return (
                                <label>
                                  <input
                                    type="checkbox"
                                    name="boating"
                                    onChange={(e) =>
                                      handleFilterSelection(
                                        e,
                                        status.statusId,
                                        "BookingStatus"
                                      )
                                    }
                                  />
                                  {status.statusCode}
                                </label>
                              );
                            }
                          })}
                      </div>

                      <div className="filter-group flex justify-start flex-col items-baseline h-max-content">
                        <b>Sort by Booking Date</b>
                        <div className="bookingDetailsSorting">
                          <input
                            type="radio"
                            value="asc"
                            checked={sortOrder === "asc"}
                            onChange={() => setSortOrder("asc")}
                          />
                          <label>Ascending</label>
                        </div>
                        <div className="bookingDetailsSorting">
                          <input
                            type="radio"
                            value="desc"
                            checked={sortOrder === "desc"}
                            onChange={() => setSortOrder("desc")}
                          />
                          <label>Descending</label>
                        </div>
                      </div>

                      <div
                        className="cursor-pointer"
                        onClick={clearFilterSelection}
                      >
                        <FontAwesomeIcon icon={faTrashCan} /> Clear
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="eventdetails-cardsection_Bd">
              {IsLoding ? (
                // Display shimmer effect while loading
                <ShimmerUIFlex />
              ) : (
                eventDetailsData.length > 0 &&
                eventDetailsData.map((event) => (
                  <div key={event.bookingId} className="eventdetails-carddetails">
                    <div className="eventdetails-photo">
                      <img src={eventPhoto} alt="Event" />
                    </div>
                    <div className="eventdetails-details">
                      <div className="eventdetails-details-eventname">
                        {event.name}
                      </div>
                      <div className="eventdetails-details-eventAddress">
                        {event.location}
                      </div>
                      <div className="flex justify-between eventdetails-details-eventTime">
                        <div className="booking-date">
                          Booking Date {formatDate(event.bookingDate)}
                        </div>
                        {/* Uncomment this if you want to show the createdDate */}
                        {/* <div>
                  <FontAwesomeIcon icon={faClock} /> {calculateTime(event.createdDate)} ago
                </div> */}
                      </div>
                      <Link
                        to={{
                          pathname: "/profile/booking-details/ticket",
                          search: `?bookingId=${encryptDataId(event.bookingId)}&typeId=${encryptDataId(event.typeId)}`,
                        }}
                        className="eventdetails-eventbutton"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {eventDetailsData?.length == 0 && (
              <div className="flex justify-center w-full">
                <img src={No_Data_icon} alt="No Data Found" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
    // </div>
    // </div>
  );
};
export default BookingDetails;
