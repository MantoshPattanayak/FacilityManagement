import React, { useEffect, useState } from "react";
import AppLogo from "../assets/ama-bhoomi_logo.png";
import "../components/Public/Landing";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function PublicHeader() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState();

  useEffect(() => {
    setIsUserLoggedIn(sessionStorage?.getItem("isUserLoggedIn") || 0);
  }, []);

  return (
    <header className="header">
      <header className="header-content">
        <div className="logo"></div>
        <nav>
          <ul>
            <li>
              <a href="/">HOME</a>
            </li>
            <li>
              <a href="/About">ABOUT</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="/facilities">FACILITIES</a>
            </li>
            <li>
              <a href="#">EVENTS</a>
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
