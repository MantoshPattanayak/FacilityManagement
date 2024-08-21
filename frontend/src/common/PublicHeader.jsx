import React, { useEffect, useState } from "react";
import AppLogo from "../assets/AMA Bhoomi Logo_ Eng.svg";

import AppLogo_en from "../assets/AMA Bhoomi Logo_ Odia.svg";

// import "../components/Public/Landing";
import "../common/PublicHeader.css";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPowerOff,
  faUser,
  faBars,
  faShoppingCart,
  faTabletScreenButton,
} from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../utils/axios";
// Import Redux Part ---------------------------------
import { useDispatch, useSelector } from "react-redux"; // selector use for Read the data -----------------
import { setLanguage, setLanguageContent } from "../utils/languageSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logout } from "../utils/authSlice";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";


export default function PublicHeader() {
  const [showMediaIcon, setShowMediaIcon] = useState(false);
  const [GetCardCount, setGetCardCount] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    useSelector((state) => state.auth.isUserLoggedIn)
  );
  const [refreshOnLogOut, setRefreshOnLogOut] = useState(false);
  // show the Popup (sub_manu) Click on Profile ---------------------
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const language = useSelector(
    (state) => state.language.language || localStorage.getItem("language")
  );
  const languageContent =
    useSelector((state) => state.language.languageContent) ||
    JSON.parse(localStorage.getItem("languageContent"));
  const isLanguageContentFetched = useSelector(
    (state) => state.language.isLanguageContentFetched
  );
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setIsUserLoggedIn(sessionStorage?.getItem("isUserLoggedIn") || 0);
    // if (!isLanguageContentFetched) {
    getWebContent();
    // }
  }, [refresh]);

  // get content means odia and eng ----------------------
  async function getWebContent() {
    try {
      const res = await axiosHttpClient("LANGUAGE_RESOURCE_API", "post", {
        language,
      });
      // if (Array.isArray(res.data.languageContentResultData)) {
      dispatch(setLanguageContent(res.data.languageContentResultData));
      // } else {
      console.log(
        "valid language content data:",
        language,
        res.data.languageContentResultData
      );
      // }
    } catch (error) {
      console.error("Error fetching language content:", error);
    }
  }

  function setLanguageCode(languageCode) {
    dispatch(setLanguage(languageCode));
  }
  /// get total count --------------------
  async function GetTotalNumberofCart() {
    try {
      let res = await axiosHttpClient("View_Card_UserId", "get");
      setGetCardCount(res.data);
      console.log("total number of cart", res);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getWebContent();
    if (isUserLoggedIn) GetTotalNumberofCart();
  }, []);

  useEffect(() => {
    if (refreshOnLogOut) setIsUserLoggedIn(0);
  }, [refreshOnLogOut]);

  // here Api of Logout -------------------------
  function handleLogout(e) {
    // logOutUser(e);
    async function logOutAPI() {
      try {
        let res = await axiosHttpClient("LOGOUT_API", "post");
        console.log(res.data);
        dispatch(Logout());
        setRefreshOnLogOut(!refreshOnLogOut);
        toast.success("Logged out successfully!!", {
          autoClose: 2000, // Toast timer duration in milliseconds
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
  }

  function handleMenuToggle() {
    setShowMediaIcon((prevState) => !prevState);
  }
  // here Toggle when Click on profile icon ----------------------------
  const handleMouseEnter = () => {
    setShowProfileMenu(true);
  };

  const handleMouseLeave = () => {
    setShowProfileMenu(false);
  };

  // Secondary header................................................
  const [isSecondaryHeaderVisible, setIsSecondaryHeaderVisible] =
    useState(true);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSecondaryHeaderVisible(window.scrollY < 80);
      setIsHeaderFixed(scrollY >= 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Adjust text size 

  function adjustFontSize(change) {
    const root = document.documentElement;
    let currentSize = parseFloat(getComputedStyle(root).fontSize);

    if (change === 0) {
      root.style.fontSize = "16px"; // Default font size
    } else if (change) { // && root.style.fontSize < "20px" && root.style.fontSize > "14px"
      if(change > 0 && root.style.fontSize < "18px")
        root.style.fontSize = `${currentSize + change}px`;
      else if(change < 0 && root.style.fontSize > "14px")
        root.style.fontSize = `${currentSize + change}px`;
    }
  }

  return (
    <div>
      {/* Secondary Header */}
      {isSecondaryHeaderVisible && (
        <div className="secondary-header">
          <div className="secHeaderItem">
            <ul className="secondary-header-items">
              <li>
                {language === "EN" && (
                  <>
                    <button
                      value={"OD"}
                      onClick={() => {
                        setLanguageCode("OD");
                        setRefresh((prevState) => !prevState);
                      }}
                    >
                      ଓଡ଼ିଆ
                    </button>{" "}
                    &nbsp; |{" "}
                  </>
                )}
                {language === "OD" && (
                  <>
                    <button
                      value={"EN"}
                      onClick={() => {
                        setLanguageCode("EN");
                        setRefresh((prevState) => !prevState);
                      }}
                    >
                      English
                    </button>{" "}
                    &nbsp; |{" "}
                  </>
                )}
              </li>
              <li>
                <Link to={"/screen-reader-access"}>
                  <FontAwesomeIcon icon={faTabletScreenButton} />&nbsp; Screen Reader |
                </Link>
              </li>
            </ul>
            <div className="font-size-adjust">
              <a
                title="Decrease Font Size"
                aria-label="Decrease Font Size Button"
                id="btn-decrease"
                onClick={() => adjustFontSize(-1)}
              >
                A-
              </a>
              <a
                title="Normalize Font Size"
                aria-label="Normalize Font Size Button"
                id="btn-orig"
                onClick={() => adjustFontSize(0)}
              >
                A
              </a>
              <a
                title="Increase Font Size"
                aria-label="Increase Font Size Button"
                id="btn-increase"
                onClick={() => adjustFontSize(1)}
              >
                A+
              </a>
            </div>
          </div>
        </div>
      )}
      <header
        className={`header ${isHeaderFixed ? "fixed" : "absolute"}`}
        id="header-public"
        style={{
          top: isSecondaryHeaderVisible ? "" : "0px",
          // transition: "top 0.3s",
        }}
      >
        {/* <ToastContainer /> */}
        <div className="header-content">
          <div className="logo-ama-boomi">
            <Link to={"/"}>
            {!language || language == "EN" &&  <img
                src={AppLogo_en}
                alt="App Logo"
                className= "ama_bhoomi_logo   h-[100%] "
              />}
                {language == "OD" && <img
                src={AppLogo}
                alt="App Logo"
                className="ama_bhoomi_logo   h-[100%] "
              />}
              
              
            </Link>
          </div>
          <div className="navbar">
            <ul
              className={
                showMediaIcon
                  ? "hidden menu_links mobile_menu_links show"
                  : "hidden menu_links mobile_menu_links"
              }
            >
              {/* <li>
                {language === "EN" && (
                  <>
                    <button
                      value={"OD"}
                      onClick={() => {
                        setLanguageCode("OD");
                        setRefresh((prevState) => !prevState);
                      }}
                    >
                      ଓଡ଼ିଆ
                    </button>{" "}
                    &nbsp; |{" "}
                  </>
                )}
                {language === "OD" && (
                  <>
                    <button
                      value={"EN"}
                      onClick={() => {
                        setLanguageCode("EN");
                        setRefresh((prevState) => !prevState);
                      }}
                    >
                      English
                    </button>{" "}
                    &nbsp; |{" "}
                  </>
                )}
              </li> */}
              {/* <li>
                <Link to={'/'}>{(languageContent.find(data => data.languageResourceKey == 'publicHeaderHome')?.languageResourceValue)?.toUpperCase()}</Link>
              </li> */}
              <li>
                <Link to={"/About"}>
                {!language || language == "EN" && "ABOUT"}
                {language == "OD" && "ବିଷୟରେ"}
                  {/* {languageContent
                    .find(
                      (data) => data.languageResourceKey == "publicHeaderAbout"
                    )
                    ?.languageResourceValue?.toUpperCase()} */}
                </Link>
              </li>
              <li>
                <Link to={"/faqs"}>FAQ</Link>
              </li>
              <li>
                <Link to={"/facilities"}>FACILITIES</Link>
              </li>
              <li>
                <Link to={"/events"}>EVENTS</Link>
              </li>
              <li>
                <Link to={"/ContactUs"}>CONTACT US</Link>
              </li>

              {isUserLoggedIn == 1 ? (
                <li
                  className="menu-item"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faUser} /> &nbsp; PROFILE
                  </div>
                  {showProfileMenu && (
                    <ul className="submenu">
                      <li>
                        <Link to="/profile">My Profile</Link>
                      </li>
                      {isUserLoggedIn == 1 && (
                        <li>
                          <Link to={"/Event_hostPage"}> Host Event</Link>
                        </li>
                      )}
                      <li>
                        <Link to="/profile/booking-details">
                          Booking Details
                        </Link>
                      </li>
                      <li>
                        <Link to="/UserProfile/Favorites">Favorites</Link>
                      </li>
                      <li>
                        <Link to={"/grievance-feedback-form"}>
                          Submit Grievance
                        </Link>
                      </li>
                      {isUserLoggedIn == 1 && (
                        <li>
                          <Link onClick={handleLogout}>Logout</Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              ) : (
                <li>
                  <Link className="login-button" to="/login-signup">
                    LOGIN | REGISTER
                  </Link>
                </li>
              )}
              {isUserLoggedIn == 1 && (
                <li>
                  <Link
                    className="relative flex items-center"
                    to="/cart-details"
                  >
                    {GetCardCount.count > 0 && (
                      <span className="cart-count absolute left-1 transform -translate-x-1/2 -top-5 bg-red-500 text-white text-xs font-semibold py-0.5 px-1 rounded-full">
                        {GetCardCount.count}
                      </span>
                    )}
                    <span>
                      <FontAwesomeIcon
                        icon={faShoppingCart}
                        className="cart-icon"
                        size="lg"
                      />{" "}
                      CART
                    </span>
                  </Link>
                </li>
              )}
            </ul>
            <div className="hamburger-menu" onClick={handleMenuToggle}>
              <FontAwesomeIcon icon={faBars} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
