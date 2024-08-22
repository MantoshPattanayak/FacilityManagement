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
import { useDispatch, useSelector } from "react-redux"; // selector use for Read the data -----------------

const CommonFooter1 = () => {
  const language = useSelector(
    (state) => state.language.language || localStorage.getItem("language")
  );
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
            <h1 className="Amam_text">
              {!language || language == "EN" && "AMA BHOOMI"}
              {language == "OD" && "ଆମ ଭୂମି"}
            </h1>
            <p className="p_text_ama">
              {!language || language == "EN" && (<>Assuring Mass Access through Bhubaneswar <br></br> Open spaces and
                Ownership Management Initiative.</>)}
              {language == "OD" && "ଭୁବନେଶ୍ୱର ଖୋଲା ସ୍ଥାନରେ ମାଲିକାନା ଏବଂ ପରିଚାଳନା ପଦକ୍ଷେପ ମାଧ୍ୟମରେ ଜନ ପ୍ରବେଶକୁ ନିଶ୍ଚିତ କରିବା।"}
            </p>
            <div className="Downlad_Appp">
              <h1 className="donwload_name">
                {!language || language == "EN" && (<>Download App</>)}
                {language == "OD" && "ଆପ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ"}
              </h1>
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
                <Link to="/ContactUs">
                  {!language || language == "EN" && "Contact Us"}
                  {language == "OD" && "ଯୋଗାଯୋଗ"}
                </Link>
              </li>
              {/* <li>
                <Link to='/Partnerwithus'>Partner with us</Link>
              </li> */}
              <li>
                <Link to="/grievance-feedback-form">
                  {!language || language == "EN" && "Grievance"}
                  {language == "OD" && "ଅଭିଯୋଗ ଫର୍ମ କ୍ଷେତ୍ର"}
                </Link>
              </li>
              <li>
                <Link to="/grievance-feedback-form">
                  {!language || language == "EN" && "Feedback"}
                  {language == "OD" && "ମତାମତ ଫର୍ମ କ୍ଷେତ୍ର"}</Link>
              </li>
            </ul>
            <div className="Ul_contact_partner_bottom_line"></div>
            <div className="term_condtion_conatiner">
              {/* <Link to='/DosDont'><p>Do's and Don'ts</p></Link> */}
              <Link to='/Disclaimer'><p>
                {!language || language == "EN" && "Disclaimer"}
                {language == "OD" && "ଅସ୍ଵୀକରଣ"}
              </p></Link>
              <Link to='/Privacy_Policy'><p>
                {!language || language == "EN" && "Privacy Policy"}
                {language == "OD" && "ଗୋପନୀୟତା ନୀତି"}
              </p></Link>
              <Link to='/Terms_ConditionPage'><p>
                {!language || language == "EN" && "Terms & Condtitions"}
                {language == "OD" && "ନିୟମ ଓ ସର୍ତ୍ତାବଳୀ"}
              </p></Link>
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
            {!language || language == "EN" && (<>&copy; 2024 AMA BHOOMI, Bhubaneswar, Odisha. All Rights Reserved.</>)}
            {language == "OD" && (<>&copy; 2024 ଆମ ଭୂମି, ଭୁବନେଶ୍ୱର, ଓଡ଼ିଶା । ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ ।</>)}
          </p>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
};
export default CommonFooter1;
