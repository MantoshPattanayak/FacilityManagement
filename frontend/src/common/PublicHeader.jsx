import React, { useEffect, useState } from "react";
import AppLogo from "../assets/ama-bhoomi_logo.png";
import "../components/Public/Landing";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axiosHttpClient from "../utils/axios";
// here Import Redux Part ---------------------------------
import { useDispatch, useSelector } from "react-redux";  // selector use for Read the data -----------------
import { setLanguage, setLanguageContent } from "../utils/languageSlice";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "../utils/authSlice";


export default function PublicHeader() {
  // here Get the data of TotalCount of Cart ---------------
  const [GetCardCount, setGetCardCount] = useState([])
  const [isUserLoggedIn, setIsUserLoggedIn] = useState();
  const [refreshOnLogOut, setRefreshOnLogOut] = useState(Date.now());
  // Redux (Redux-Toolkit) -------------------------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = useSelector((state) => state.language.language); // Updated variable name
  const languageContent = useSelector((state) => state.language.languageContent);
  const isLanguageContentFetched = useSelector((state) => state.language.isLanguageContentFetched);

  useEffect(() => {
    setIsUserLoggedIn(sessionStorage?.getItem("isUserLoggedIn") || 0)
    if (!isLanguageContentFetched) {
      getWebContent();
    }
  }, [isLanguageContentFetched, language]); // Updated dependency
  // here Get the Launage (Odia and eng)-------------------------------------
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
// here Get total count of Cart --------------------------------------------
async function GetTotalNumberofCart() {
  try {
    let res = await axiosHttpClient('View_Card_UserId', 'get')
    setGetCardCount(res.data)
  }
  catch (err) {
    console.log( err)
  }
}
useEffect(() => {
  GetTotalNumberofCart()
  const intervalId = setInterval(GetTotalNumberofCart, 1000); // Poll every 5 seconds
  return () => clearInterval(intervalId);
}, [])

  //function to handle log out of user
  function handleLogOut(e){
    // e.preventDefault();
    dispatch(Logout());
    navigate('/');
    // setRefreshOnLogOut(Date.now());
    window.location.reload();
  }


// useEffect -------------------------------xx---------
  useEffect(() => {
    getWebContent();
  }, [language, refreshOnLogOut]);
// Return --------------------------------------------
  return (
    <header className="header">
      <header className="header-content">

        <nav className="navbar">
          <div className="logo-ama-boomi">
            <img src={AppLogo} alt="" className="h-[100%] top-0 absolute" />
          </div>

          <ul>
            <li>
              {(language === 'EN') && <><button value={'OD'} onClick={() => setLanguageCode('OD')}>ଓଡ଼ିଆ</button> &nbsp; | </>}
              {(language === 'OD') && <><button value={'EN'} onClick={() => setLanguageCode('EN')}>English</button> &nbsp; | </>}
            </li>
            <li>
              <Link to={'/'}>{(languageContent.find(data => data.languageResourceKey === 'publicHeaderHome')?.languageResourceValue)?.toUpperCase()}</Link>
            </li>
            {/* Render 'About' link */}
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
            {
              isUserLoggedIn == 1 ? (
                <li>
                  <Link to={'/Event_hostPage'}>HOST EVENT</Link>
                </li>
              ) : ''
            }
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
            <li>
              {isUserLoggedIn == 1 ? (
                <li>
                  <Link className="relative flex items-center" to="/BookParks/Add_Card">
                    {GetCardCount.count > 0 && (
                      <span className="cart-count absolute  left-1 transform -translate-x-1/2 -top-5 bg-red-500 text-white text-xs font-semibold py-0.5 px-1  rounded-full">{GetCardCount.count}</span>
                    )}
                    <span>  <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" size="lg" /> Cart</span>
                  </Link>
                </li>
              ) : (
                <li>
                </li>
              )}
            </li>
              {
                isUserLoggedIn == 1 ? (
                  <li>
                    <Link onClick={handleLogOut} to={'/'}><FontAwesomeIcon icon={faPowerOff}></FontAwesomeIcon> &nbsp;</Link>
                  </li>
                ) : <></>
              }




          </ul>
        </nav>
      </header>
    </header>
  );
}
