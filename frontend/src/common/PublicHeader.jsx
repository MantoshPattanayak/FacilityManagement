import React, { useEffect, useState } from "react";
import AppLogo from "../assets/ama-bhoomi_logo.png";
import "../components/Public/Landing";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../utils/axios";

export default function PublicHeader() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState();
  const [language, setLanguage] = useState('');
  const [webContent, setWebContent] = useState([]);

  // function to set language and change web content as per language
  function setLanguageCode(e) {
    e?.preventDefault();
    if (language == 'EN'){
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
      let res = await axiosHttpClient('LANGUAGE_RESOURCE_API', 'post', {language});
      console.log('response of web content as per language', res.data.languageContentResultData);
      setWebContent(res.data.languageContentResultData);
    }
    catch(error) {
      console.error(error);
    }
  }

  // on page load, set language preference
  useEffect(() => {
    setIsUserLoggedIn(sessionStorage?.getItem("isUserLoggedIn") || 0);
    if(sessionStorage?.getItem('language') == null || sessionStorage?.getItem('language') == ''){
      sessionStorage?.setItem('language', 'EN');
      setLanguage('EN');
    }
    else{
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
            <img src={AppLogo} alt="" className="h-[80%] absolute" />
          </div>

          <ul>
            <li>
              { (language == 'EN') && <><button value={'ଓଡ଼ିଆ'} onClick={setLanguageCode}>ଓଡ଼ିଆ</button> &nbsp; | </>}
              { (language == 'OD') && <><button value={'English'} onClick={setLanguageCode}>English</button> &nbsp; | </>}
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
              <a href="#">HOST EVENT</a>
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
          </ul>
        </nav>
      </header>
    </header>
  );
}
