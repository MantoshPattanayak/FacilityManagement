import React, { useEffect, useState } from "react";
import AppLogo from "../assets/ama-bhoomi_logo.png";
import "../components/Public/Landing";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axiosHttpClient from "../utils/axios";
// here Import Redux Part ---------------------------------
import { useDispatch, useSelector } from "react-redux";  // selector use for Read the data -----------------
import { setLanguage, setLanguageContent } from "../utils/languageSlice";


export default function PublicHeader() {
  // here Get the data of TotalCount of Cart ---------------
  const [GetCardCount, setGetCardCount] = useState([])
  const [isUserLoggedIn, setIsUserLoggedIn] = useState();
  // Redux (Redux-Toolkit) -------------------------------------
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language); // Updated variable name
  const languageContent = useSelector((state) => state.language.languageContent);
  const isLanguageContentFetched = useSelector((state) => state.language.isLanguageContentFetched);

  useEffect(() => {
    setIsUserLoggedIn(sessionStorage?.getItem("isUserLoggedIn") || 0)

    if (!isLanguageContentFetched) {
      getWebContent();
    }
  }, [isLanguageContentFetched, language]); // Updated dependency

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
  

  
  useEffect(() => {
    getWebContent();
  }, [language]);

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
              <a href="/">{(languageContent.find(data => data.languageResourceKey === 'publicHeaderHome')?.languageResourceValue)?.toUpperCase()}</a>
            </li>
            {/* Render 'About' link */}
            <li>
              <a href="/">{(languageContent.find(data => data.languageResourceKey === 'publicHeaderAbout')?.languageResourceValue)?.toUpperCase()}</a>
            </li>

            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="/facilities">FACILITIES</a>
            </li>
            <li>
              <a href="/events">EVENTS</a>
            </li>
            <li>
              <a href="/Event_hostPage">HOST EVENT</a>
            </li>
            {isUserLoggedIn == 1 ? (
              <li>
                <a className="" href="/profile/booking-details">
                  <FontAwesomeIcon icon={faUser} /> &nbsp; PROFILE
                </a>
              </li>
            ) : (
              <li>
                <a className="login-button" href="/login-signup">
                  LOGIN
                </a>
              </li>
            )}
            <li>
              {isUserLoggedIn == 1 ? (
                <li>
                  <a className="relative flex items-center" href="/BookParks/Add_Card">
                    {GetCardCount.count > 0 && (
                      <span className="cart-count absolute  left-1 transform -translate-x-1/2 -top-5 bg-red-500 text-white text-xs font-semibold py-0.5 px-1  rounded-full">{GetCardCount.count}</span>
                    )}
                    <span>  <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" size="lg" /> Cart</span>
                  </a>
                </li>
              ) : (
                <li>

                </li>
              )}
            </li>





          </ul>
        </nav>
      </header>
    </header>
  );
}
