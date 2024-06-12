import "./Common_footer1.css";
import Logo from "../assets/ama-bhoomi_logo.png";
import Download_App from "../assets/Download_App.png";
import Download_OS_App from "../assets/Download_OS_App.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faInstagram,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
const CommonFooter1 = () => {
  return (
    <div>
      <footer className="common-footer">
        {/* <div className='header_footer'>
                    <img className='Ama_Logo' src={Logo}></img>
                    <h1 className='Ama_name'> AMA BHOOMI</h1>
                </div> */}

        <div className="footer-content">
          <div className="footer-column1">
            <h1 className="Amam_text">AMA BHOOMI bitch</h1>
            <p className="p_text_ama">
              Assuring Mass Access through BHubaneswar <br></br> Open spaces and
              Ownership Management Initiative.
            </p>
            <div className="Downlad_Appp">
              <h1 className="donwload_name"> Download App</h1>
              <div className="input-container">
                <input
                  type="text"
                  className="Input_text_send_mail"
                  placeholder="Enter your email"
                />
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="paper-plane-icon"
                />
              </div>
              <div className="App_download">
                <img className="download_image" src={Download_App}></img>
                <img className="download_image" src={Download_OS_App}></img>
              </div>
            </div>
          </div>
          <div className="footer-column2">
            <ul className="Ul_contact_partner">
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Partner with us</a>
              </li>
              <li>
                <Link to="/grievance-feedback-form">Grievance</Link>
              </li>
              <li>
              <Link to="/grievance-feedback-form">Feedback</Link>
              </li>
            </ul>
            <div className="term_condtion_conatiner">
              <p>Disclaimer</p>
              <p>Privacy Policy</p>
              <p>Terms & Condtitions</p>
            </div>

            <div className="Socail_media">
              <h1 className="socail_media_text">Social Media</h1>
              <div className="social-icons">
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="social-icon whatsapp-icon"
                />
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="social-icon instagram-icon"
                />
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="social-icon facebook-icon"
                />
                <FontAwesomeIcon
                  icon={faTwitter}
                  className="social-icon twitter-icon"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2024 AMA BHOOMI, Bhubaneswar, Odisha. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
export default CommonFooter1;
