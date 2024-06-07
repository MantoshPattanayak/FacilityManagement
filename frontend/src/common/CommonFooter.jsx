import React from 'react'
import './CommonFooter.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import playstoreIMG from '../assets/google-play-badge.svg'
import appstoreIMG from '../assets/app-store-badge.svg'

const CommonFooter = () => {
  return (
    <div>
      <footer className="footer-container">
        <div className="left-section">
          <div className="ama-bhoomi-info">
            <h1>AMA BHOOMI</h1>
            <p>Assuring mass access through Bhubaneswar open spaces and <br /> ownership management initiative.</p>
          </div>
          <div className="app-download">
            <p><a href="">Download the App</a> </p><br /><br />
            <div className="phone-input">

              <div className="input-with-icon">
                <input
                  type="text"
                  className="input-field-link"
                  placeholder="Enter phone number to receive the link"
                />
                <FontAwesomeIcon icon={faArrowRight} className="input-icon" />
              </div>
            </div>

            <div className="app-store-icons">
              <img src={playstoreIMG} alt="App Store" />
              <img src={appstoreIMG} alt="Google Play Store" />
            </div>
          </div>
        </div>

        <div className="right-section-footer">
          <div class="middle-section">
            <ul>
              <li><a href="#"> Resources</a></li>
              <li><a href="#">Contact</a></li>
              <li> <a href="#">Partner with us</a> </li>
              <li> <a href="#"> Grievance</a></li>
              <li> <a href="#">Feedback</a> </li>
              <li> <a href="#">twitter</a> </li>
              <li> <a href="#">facebook</a> </li>
            </ul>
          </div>
          <div class="middle-right-section">
            <ul>
              <li> <a href="#">Resources</a> </li>
              <li> <a href="#">Contact</a> </li>
              <li> <a href="#">Partner with us</a> </li>
              <li> <a href="#">Grievance</a> </li>
              <li> <a href="#">Feedback</a> </li>
            </ul>
          </div>
          <div class="last-right-section">
            <ul>
              <li> <a href="#">Help and support</a> </li>
              <li> <a href="#"> social</a></li>
              <li> <a href="#">twitter</a> </li>
              <li> <a href="#">facebook</a> </li>
              <li> <a href="#">Feedback</a> </li>

            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CommonFooter
