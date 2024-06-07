import { useState, useEffect } from "react";
import "./Sub_Park_Details.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";

import CommonFooter from "../../../common/CommonFooter";
import AdminHeader from "../../../common/AdminHeader";

import Location_icon from "../../../assets/Location_goggle_icon-removebg-preview.png";
import { MdHomeRepairService } from 'react-icons/md';
import Park_img from "../../../assets/Park_details.jpg";
import amabhoomi from '../../../assets/ama_bhoomi_bgi.jpg';
import sport_image from "../../../assets/sport_details_image.jpg";

import Yoga_img from "../../../assets/Yoga_img.png";
import Google_map from "../../../assets/Google_map.jpg";
import correct_icon from "../../../assets/Correct_icon.png";
import Phone_icon from "../../../assets/Phone_icon.png";

import axiosHttpClient from "../../../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData } from "../../../utils/encryptData";

import { Link } from "react-router-dom";
import { encryptData } from "../../../utils/encryptData";

import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import PublicHeader from "../../../common/PublicHeader";
import Book_Now from "../BookParks/Book_Now";

const Sub_Park_Details = () => {
  const [ServiceData, setServiceData] = useState([]);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [EventAvailable, setEventAvailable] = useState([]);
  const [FacilitiesData, setFacilitiesData] = useState([]);
  const [LoginStatus, setLoginStatus] = useState([0]);
  const location = useLocation();
  const facilityId = decryptData(
    new URLSearchParams(location.search).get("facilityId")
  );
  const navigate = useNavigate();
  const isUserLoggedIn = sessionStorage.getItem("isUserLoggedIn") || 0;
  const [toRoute, setToRoute] = useState();
  const [operatingDays, setOperatingDays] = useState('');

  //Here is the popup state

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const savedBookmarkStatus = localStorage.getItem(`bookmark_${facilityId}`);
    if (savedBookmarkStatus !== null) {
      setIsBookmarked(JSON.parse(savedBookmarkStatus));
    }
  }, [facilityId]);

  const handleBookmarkClick = () => {
    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);
    localStorage.setItem(`bookmark_${facilityId}`, JSON.stringify(newBookmarkStatus));
  };

  const apiKey = "AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao";
  const defaultCenter = { lat: 20.2961, lng: 85.8245 };

  async function getSub_park_details() {
    try {
      let res = await axiosHttpClient(
        "View_By_ParkId",
        "get",
        null,
        facilityId
      );

      setServiceData(res.data.serviceData);
      setAmenitiesData(res.data.amenitiesData);
      setEventAvailable(res.data.eventDetails);
      setFacilitiesData(res.data.facilitiesData);
      setOperatingDaysFromRes(res);

      function setOperatingDaysFromRes(res) {
        let operatingDaysFromRes = [];
        if (res.data.facilitiesData[0].sun == 1) {
          operatingDaysFromRes.push('Sun');
        }
        if (res.data.facilitiesData[0].mon == 1) {
          operatingDaysFromRes.push('Mon');
        }
        if (res.data.facilitiesData[0].tue == 1) {
          operatingDaysFromRes.push('Tue');
        }
        if (res.data.facilitiesData[0].wed == 1) {
          operatingDaysFromRes.push('Wed');
        }
        if (res.data.facilitiesData[0].thu == 1) {
          operatingDaysFromRes.push('Thu');
        }
        if (res.data.facilitiesData[0].fri == 1) {
          operatingDaysFromRes.push('Fri');
        }
        if (res.data.facilitiesData[0].sat == 1) {
          operatingDaysFromRes.push('Sat');
        }
        setOperatingDays(operatingDaysFromRes);
      }
    } catch (err) {
      console.log("Error fetching park details", err);
    }
  }

  useEffect(() => {
    getSub_park_details();
  }, []);

  function encryptDataId(id) {
    return encryptData(id);
  }

  function formatTime(time24) {
    if (!time24) return;
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
  }

  function formatDate(date) {
    if (!date) return;
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  }

  const images = [Park_img, amabhoomi, Park_img, amabhoomi, Park_img];
  const [currentIndex1, setCurrentIndex1] = useState(0);

  const handlePrev = () => {
    setCurrentIndex1(currentIndex1 === 0 ? images.length - 1 : currentIndex1 - 1);
  };

  const handleNext = () => {
    setCurrentIndex1(currentIndex1 === images.length - 1 ? 0 : currentIndex1 + 1);
  };

  return (
    <div className="Sub_Manu_Conatiner">
      <PublicHeader />

      <div className={FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityTypeId === 1 ? "Header_Img" : FacilitiesData[0]?.facilityTypeId === 2 ? "playground_header_image" : FacilitiesData[0]?.facilityTypeId === 3 ? "MulitGroud" : ""}>
        <h1 className="text-park">
          {FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityName}
        </h1>
        <span className="Location_text_sub_manu">
          <img className="location_icon" src={Location_icon}></img>
          <h1 className="text_location">
            {FacilitiesData?.length > 0 && FacilitiesData[0]?.address}
          </h1>
        </span>
      </div>

      <div className="map_img_main_conatiner">
        <div className="carousel-container1">
          <div className="carousel1">
            <img src={images[currentIndex1]} alt={`Slide ${currentIndex1 + 1}`} />
          </div>
          <button className="carousel1-button1 left1" onClick={handlePrev}>
            &lt;
          </button>
          <button className="carousel1-button1 right1" onClick={handleNext}>
            &gt;
          </button>
        </div>

        <div className="Map_container">
          <span className="time_status flex flex-col">
            <div className="flex">
              <h1 className="time_text">
               <p className="timing-day">Timing :</p>
               <span className="timing-day-text">
                  {formatTime(
                  FacilitiesData[0]?.operatingHoursFrom
                )} - {formatTime(FacilitiesData[0]?.operatingHoursTo)}
                </span>
              </h1>
              {/* <div className="open-close-btn">
              <button
                className={`Open_Button ${FacilitiesData.length > 0 && FacilitiesData[0].status === "open"
                  ? "open"
                  : "closed"
                  }`}
              >
                {FacilitiesData?.length > 0 &&
                  FacilitiesData[0]?.status.toUpperCase()}
              </button>
              </div> */}

              <div className={`bookmark ${isBookmarked ? 'bookmarked' : ''}`} onClick={handleBookmarkClick}>
                <FontAwesomeIcon icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular} />
              </div>
            </div>

            <div className="day-open-close-status">
              <h1 className="date_text text-[12px]">
              <p className="timing-day">Day :</p> 
               <span className="timing-day-text">{operatingDays.toString()}</span>
              </h1>

              <div className="open-close-btn">
                <button
                  className={`Open_Button ${FacilitiesData.length > 0 && FacilitiesData[0].status === "open"
                    ? "open"
                    : "closed"
                    }`}
                >
                  {FacilitiesData?.length > 0 &&
                    FacilitiesData[0]?.status.toUpperCase()}
                </button>
              </div>
            </div>


          </span>

          <span className="Button_ticket_container">

            {
              FacilitiesData[0]?.facilityTypeId == 1 ? (
                <Link
                  to={{
                    pathname: `${isUserLoggedIn == 1 ? "/BookParks/Book_Now" : "/login-signup"
                      }`,
                    search: `${isUserLoggedIn == 1
                      ? `?facilityId=${encryptDataId(
                        FacilitiesData[0]?.facilityId
                      )}`
                      : `?facilityId=${encryptDataId(
                        FacilitiesData[0]?.facilityId
                      )}` + `&redirect=${encryptDataId("/BookParks/Book_Now")}`
                      }`,
                  }}
                  className="button-9"
                >
                  <button role="button_by" onClick={togglePopup}>Buy Ticket</button>
                </Link>
              )
                : FacilitiesData[0]?.facilityTypeId == 2 ? (
                  <Link
                    to={{
                      pathname: `${isUserLoggedIn == 1 ? "/BookParks/Book_Now_Sport" : "/login-signup"
                        }`,
                      search: `${isUserLoggedIn == 1
                        ? `?facilityId=${encryptDataId(
                          FacilitiesData[0]?.facilityId
                        )}`
                        : `?facilityId=${encryptDataId(
                          FacilitiesData[0]?.facilityId
                        )}` + `&redirect=${encryptDataId("/BookParks/Book_Now_Sport")}`
                        }`,
                    }}
                    className="button-9"
                  >
                    <button role="button_by">Buy Ticket</button>
                  </Link>
                )
                  : (
                    <Link
                      to={{
                        pathname: `${isUserLoggedIn == 1 ? "/BookParks/Book_Now_Sport" : "/login-signup"
                          }`,
                        search: `${isUserLoggedIn == 1
                          ? `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}`
                          : `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}` + `&redirect=${encryptDataId("/BookParks/Book_Now_Sport")}`
                          }`,
                      }}
                      className="button-9"
                    >
                      <button role="button_by">Buy Ticket</button>
                    </Link>
                  )
            }

            < Link
              to={{
                pathname: `${isUserLoggedIn == 1 ? "/Event_hostPage" : "/login-signup"
                  }`,
                search: `${isUserLoggedIn == 1
                  ? `?facilityId=${encryptDataId(
                    FacilitiesData[0]?.facilityId
                  )}`
                  : `?facilityId=${encryptDataId(
                    FacilitiesData[0]?.facilityId
                  )}` + `&redirect=${encryptDataId("/Event_hostPage")}`
                  }`,
              }}
              className="button-10"
            >
              <button role="button_by" className="name_button">Host Event</button>
            </Link>

          </span>

          <div className="Map_image">
            <LoadScript googleMapsApiKey={apiKey}>
              <GoogleMap
                ClassName="Map_image_Goole"
                mapContainerStyle={{ height: "300px", width: "100%" }}
                center={defaultCenter}
                zoom={8}
              >
                {/* Render markers */}
                {FacilitiesData?.map((location, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>
      <div className="other-contents">
        {/* -----------------------------services------------------------------------------ */}
        <div className="Service_Now_conatiner">
          <h1 className="Service_text">Services</h1>
          {ServiceData?.length > 0 &&
            ServiceData?.map((item, index) => (
              <div className="Service_Avilable" key={index}>
                <div className="service_item">
                  {/* <img
                    className="service_Avil_img"
                    src={Park_img}
                    alt="Parking"
                  /> */}
                  <div className="service-icon">
                  <MdHomeRepairService size={80} color="green" />
                  </div>
                  <p className="service_name">{item.code}</p>
                </div>
              </div>
            ))}
        </div>

        {/* --------------------------- Amenities ------------------------------------------*/}
        <div className="Amenities_Main_conatiner">
          <h1 className="Service_text">Amenities</h1>
          <div className="Amenities-Data">
            {amenitiesData
              .flatMap((group) => group) // Flatten the array of arrays
              .filter(
                (item, index, self) =>
                  self.findIndex((t) => t.amenityName === item.amenityName) ===
                  index
              ) // Filter unique items
              .map((item, index) => (
                <span className="flex gap-2" key={index}>
                  <img
                    className="Correct_icon"
                    src={correct_icon}
                    alt={`Amenity icon ${index}`}
                  />
                  <h1 className="Amenities_name">{item.amenityName}</h1>
                </span>
              ))}
          </div>
        </div>

        {/* -------------------------- Here About -------------------------------------------- */}
        <div className="About_Conatiner">
          <h1 className="Service_text">About</h1>
          <h1 className="About_text">
            {FacilitiesData?.length > 0 && FacilitiesData[0]?.about}
          </h1>
        </div>
        {/* -------------------------Helpline Number ------------------------------------------ */}
        <div className="Helpline_number_conatine">
          <h1 className="Service_text">Helpline Number</h1>
          <div className="Contact_number">
            <img className="Phone_icon" src={Phone_icon}></img>
            <h1 className="Number">
              {FacilitiesData?.length > 0 && FacilitiesData[0]?.helpNumber}
            </h1>
          </div>
        </div>
        {/* -------------------------Event Available ----------------------------------------------------------- */}
        <div className="Event_Available_main_conatiner">
          <h1 className="Service_text">Event Available</h1>
          <div className="Sub_Park_Details">
            {EventAvailable?.length > 0 &&
              EventAvailable?.map((item, index) => {
                return (
                  <div
                    className="carousel-container"
                    // ref={containerRef}
                    key={index}
                  >
                    <div className="carousel-slide">
                      <img
                        className="Yoga_image"
                        src={Yoga_img}
                        alt="Event"
                      ></img>
                      <h1 className="Name_yoga"> {item.eventName}</h1>
                      <span className="Yoga_date_time">
                        <h1 className="Yoga_date">
                          Date:-{formatDate(item.eventDate)}
                        </h1>
                        <h1 className="Yoga_time">
                          Time:-{formatTime(item.eventStartTime)} -{" "}
                          {formatTime(item.eventEndTime)}
                        </h1>
                      </span>
                    </div>
                  </div>
                );
              })}
            {EventAvailable?.length == 0 && <p>No events.</p>}
          </div>
        </div>
        {/* <Book_Now/> */}
      </div>

      {/*-------------------------------------------- Here Footer---------------------------------------------- */}
    </div >
  );
};

// Export Sub_Park_details ------------------------
export default Sub_Park_Details;
