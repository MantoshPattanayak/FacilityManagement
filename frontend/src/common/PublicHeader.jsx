import React, { useEffect, useState } from "react";
import AppLogo from "../assets/ama-bhoomi_logo.png";
import "../components/Public/Landing";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axiosHttpClient from "../utils/axios";

export default function PublicHeader() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState();
  const [language, setLanguage] = useState('');
  const [webContent, setWebContent] = useState([]);
  // here Get the data of TotalCount of Cart ---------------
  const [GetCardCount, setGetCardCount] = useState([])

  // function to set language and change web content as per language
  function setLanguageCode(e) {
    e?.preventDefault();
    if (language == 'EN') {
      sessionStorage?.setItem('language', 'OD');
      setLanguage('OD');
    }
    else {
      sessionStorage?.setItem('language', 'EN');
      setLanguage('EN');
    }
  }

  async function getWebContent() {
    try {
      let res = await axiosHttpClient('LANGUAGE_RESOURCE_API', 'post', { language });
      console.log('response of web content as per language', res.data.languageContentResultData);
      setWebContent(res.data.languageContentResultData);
    }
    catch (error) {
      console.error(error);
    }
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

  // on page load, set language preference
  useEffect(() => {
    setIsUserLoggedIn(sessionStorage?.getItem("isUserLoggedIn") || 0);
    if (sessionStorage?.getItem('language') == null || sessionStorage?.getItem('language') == '') {
      sessionStorage?.setItem('language', 'EN');
      setLanguage('EN');
    }
    else {
      setLanguage(sessionStorage?.getItem('language'))
    }

    getWebContent();
  }, []);

  //  on change of language
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
              {(language == 'EN') && <><button value={'ଓଡ଼ିଆ'} onClick={setLanguageCode}>ଓଡ଼ିଆ</button> &nbsp; | </>}
              {(language == 'OD') && <><button value={'English'} onClick={setLanguageCode}>English</button> &nbsp; | </>}
            </li>
            <li>
              <a href="/">{(webContent.filter((data) => { return data.languageResourceKey == 'publicHeaderHome' })[0]?.languageResourceValue)?.toUpperCase()}</a>
            </li>
            <li>
              <a href="/About">{(webContent.filter((data) => { return data.languageResourceKey == 'publicHeaderAbout' })[0]?.languageResourceValue)?.toUpperCase()}</a>
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
