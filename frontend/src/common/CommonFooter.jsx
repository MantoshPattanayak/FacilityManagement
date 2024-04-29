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
              <input type="text" className='input-field-link' placeholder="Enter phone number to receive the link" icon={<FontAwesomeIcon icon={faArrowRight} />} />
            </div>
            <div className="app-store-icons">
              <img src={playstoreIMG} alt="App Store" />
              <img src={appstoreIMG} alt="Google Play Store" />
            </div>
          </div>

        </div>
        <div class="middle-section">
          <ul>
            <li>Resources</li>
            <li>Contact</li>
            <li>Partner with us</li>
            <li>Grievance</li>
            <li>Feedback</li>
            <li>twitter</li>
            <li>facebook</li>
          </ul>
        </div>
        <div class="middle-right-section">
          <ul>
            <li>Resources</li>
            <li>Contact</li>
            <li>Partner with us</li>
            <li>Grievance</li>
            <li>Feedback</li>
          </ul>
        </div>
        <div class="right-section">
          <ul>
            <li>Help and support</li>
            <li>social</li>
            <li>twitter</li>
            <li>facebook</li>
            <li>Feedback</li>
            <li>Instagram</li>
            <li>whatsapp</li>
          </ul>
        </div>
      </footer>
    </div>
  )
}

export default CommonFooter
