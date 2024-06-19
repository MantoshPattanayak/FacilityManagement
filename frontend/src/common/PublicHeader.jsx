import React, { useEffect, useState } from "react";
import AppLogo from "../assets/ama-bhoomi_logo.png";
import "../components/Public/Landing";
import '../common/PublicHeader.css';
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faUser, faBars, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../utils/axios";
// Import Redux Part ---------------------------------
import { useDispatch, useSelector } from "react-redux";  // selector use for Read the data -----------------
import { setLanguage, setLanguageContent } from "../utils/languageSlice";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "../utils/authSlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export default function PublicHeader() {
  const [showMediaIcon, setShowMediaIcon] = useState(false);
  const [GetCardCount, setGetCardCount] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState();
  const [refreshOnLogOut, setRefreshOnLogOut] = useState(Date.now());

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector((state) => state.language.language);
  const languageContent = useSelector((state) => state.language.languageContent);
  const isLanguageContentFetched = useSelector((state) => state.language.isLanguageContentFetched);

  useEffect(() => {
    setIsUserLoggedIn(sessionStorage?.getItem("isUserLoggedIn") || 0);
    if (!isLanguageContentFetched) {
      getWebContent();
    }
  }, [isLanguageContentFetched, language]);

  async function getWebContent() {
    try {
      const res = await axiosHttpClient('LANGUAGE_RESOURCE_API', 'post', { language });
      if (Array.isArray(res.data.languageContentResultData)) {
        dispatch(setLanguageContent(res.data.languageContentResultData));
      } else {
        console.log('valid language content data:', res.data.languageContentResultData);
      }
    } catch (error) {
      console.error('Error fetching language content:', error);
    }
  }

  function setLanguageCode(languageCode) {
    dispatch(setLanguage(languageCode));
  }

  async function GetTotalNumberofCart() {
    try {
      let res = await axiosHttpClient('View_Card_UserId', 'get');
      setGetCardCount(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    GetTotalNumberofCart();
  }, []);


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

  function handleMenuToggle() {
    setShowMediaIcon(prevState => !prevState);
  }

  return (
    <header className="header" id="header-public">
      {/* <ToastContainer /> */}
      <div className="header-content">
        <div className="logo-ama-boomi">
          <img src={AppLogo} alt="App Logo" className="h-[100%] top-0 absolute" />
        </div>
        <div className="navbar">
          <ul className={showMediaIcon ? "hidden menu_links mobile_menu_links show" : "hidden menu_links mobile_menu_links"}>
            <li>
              {(language === 'EN') && <><button value={'OD'} onClick={() => setLanguageCode('OD')}>ଓଡ଼ିଆ</button> &nbsp; | </>}
              {(language === 'OD') && <><button value={'EN'} onClick={() => setLanguageCode('EN')}>English</button> &nbsp; | </>}
            </li>
            <li>
              <Link to={'/'}>{(languageContent.find(data => data.languageResourceKey === 'publicHeaderHome')?.languageResourceValue)?.toUpperCase()}</Link>
            </li>
            <li>
              <Link to={'/About'}>{(languageContent.find(data => data.languageResourceKey === 'publicHeaderAbout')?.languageResourceValue)?.toUpperCase()}</Link>
            </li>
            <li>
              <Link to={'/faqs'}>FAQ</Link>
            </li>
            <li>
              <Link to={'/facilities'}>FACILITIES</Link>
            </li>
            <li>
              <Link to={'/events'}>EVENTS</Link>
            </li>
            {isUserLoggedIn == 1 && (
              <li>
                <Link to={'/Event_hostPage'}>HOST EVENT</Link>
              </li>
            )}
            {isUserLoggedIn == 1 ? (
              <li>
                <Link to={'/Profile'}>
                  <FontAwesomeIcon icon={faUser} /> &nbsp; PROFILE
                </Link>
              </li>
            ) : (
              <li>
                <Link className="login-button" to="/login-signup">
                  LOGIN
                </Link>
              </li>
            )}
            {isUserLoggedIn == 1 && (
              <li>
                <Link className="relative flex items-center" to="/BookParks/Add_Card">
                  {GetCardCount.count > 0 && (
                    <span className="cart-count absolute left-1 transform -translate-x-1/2 -top-5 bg-red-500 text-white text-xs font-semibold py-0.5 px-1 rounded-full">{GetCardCount.count}</span>
                  )}
                  <span><FontAwesomeIcon icon={faShoppingCart} className="cart-icon" size="lg" /> Cart</span>
                </Link>
              </li>
            )}
            {isUserLoggedIn == 1 && (
              <li>
                <Link onClick={handleLogout} to={'/'}><FontAwesomeIcon icon={faPowerOff}></FontAwesomeIcon> &nbsp;</Link>
              </li>
            )}
          </ul>
          <div className="hamburger-menu" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </div>
    </header>
  );
}
