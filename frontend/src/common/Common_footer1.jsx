import "./Common_footer1.css";
import Logo from "../assets/ama-bhoomi_logo.png";
import Download_OS_App from "../assets/app-store-apple-logo.svg";
import Download_App from "../assets/google-play-badge-logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faInstagram,
  faFacebook,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import instance from "../../env";
import { toast, ToastContainer } from "react-toastify";
const CommonFooter1 = () => {

  //function to seek confirmation
  function handleExternalLinkOpen(e, url) {
    e.preventDefault();
    toast.dismiss();
    // Disable interactions with the background
    // document.querySelectorAll('body')[0].style.pointerEvents = 'none';
    // document.querySelectorAll('body')[0].style.opacity = 0.4;

    toast.warn(
      <div>
        <p>
          <b>You will be redirected to an external link. Are you sure to proceed ?</b><br />
          These links are being provided as a convenience and for informational purposes only.
        </p>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Re-enable interactions with the background
              document.querySelectorAll('body')[0].style.pointerEvents = 'auto';
              document.querySelectorAll('body')[0].style.opacity = 1;
              toast.dismiss();
            }}
            className="bg-red-400 text-white p-2 border rounded-md"
          >
            No
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, '_blank'); // Open the link in a new tab
              // Re-enable interactions with the background
              document.querySelectorAll('body')[0].style.pointerEvents = 'auto';
              document.querySelectorAll('body')[0].style.opacity = 1;
              toast.dismiss();
            }}
            className="bg-green-400 text-white p-2 border rounded-md"
          >
            Yes
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false, // Disable auto close
        closeOnClick: false, // Disable close on click
        onClose: () => {
          // Re-enable interactions with the background if the toast is closed
          document.body.style.pointerEvents = 'auto';
        }
      }
    );
    return;
  }
  return (
    <div>
      <footer className="common-footer">
        <div className="footer-content">
          <div className="footer-column1">
            <h1 className="Amam_text">AMA BHOOMI</h1>
            <p className="p_text_ama">
              Assuring Mass Access through Bhubaneswar <br></br> Open spaces and
              Ownership Management Initiative.
            </p>
            <div className="Downlad_Appp">
              <h1 className="donwload_name"> Download App</h1>
              <div className="App_download">
                <a onClick={(e) => handleExternalLinkOpen(e, instance().GOOGLE_APP_LINK)} rel="noopener noreferrer">
                  <img className="download_image" src={Download_App} alt="Download Google App" />
                </a>
                <a onClick={(e) => handleExternalLinkOpen(e, instance().APP_STORE_LINK)} rel="noopener noreferrer">
                  <img className="download_image" src={Download_OS_App} alt="Download OS App" />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-column2">
            <ul className="Ul_contact_partner">
              {/* <li>
                <Link to="/Advertising_with_us">Advertising with us</Link>
              </li> */}
              <li>
                <Link to="/ContactUs">Contact Us</Link>
              </li>
              {/* <li>
                <Link to='/Partnerwithus'>Partner with us</Link>
              </li> */}
              <li>
                <Link to="/grievance-feedback-form">Grievance</Link>
              </li>
              <li>
                <Link to="/grievance-feedback-form">Feedback</Link>
              </li>
            </ul>
            <div className="term_condtion_conatiner">
              <Link to='/DosDont'><p>Do's and Don'ts</p></Link>
              <Link to='/Disclaimer'><p>Disclaimer</p></Link>
              <Link to='/Privacy_Policy'> <p>Privacy Policy</p></Link>
              <Link to='/Terms_ConditionPage'><p> Terms & Condtitions</p></Link>
            </div>
            {/* <div className="Socail_media hidden">
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
                  icon={faXTwitter}
                  className="social-icon twitter-icon"
                />
              </div>
            </div> */}
          </div>
        </div>
        <div className="footer-bottom font-bold text-white">
          <p>
            &copy; 2024 AMA BHOOMI, Bhubaneswar, Odisha. All Rights Reserved.
          </p>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};
export default CommonFooter1;
