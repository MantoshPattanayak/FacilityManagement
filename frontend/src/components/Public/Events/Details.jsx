import React from "react";
import "../Events/Details.css";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

// Here Import Admin Header AND fOOTER ------------------------------------
import CommonFooter from "../../../common/CommonFooter";
import AdminHeader from "../../../common/AdminHeader";

// Location icon and image all types of image---------------------------------------------
import Location_icon from "../../../assets/Location_goggle_icon-removebg-preview.png";
import Park_img from "../../../assets/event_details.webp";
import Yoga_img from "../../../assets/Yoga_img.png";
import Google_map from "../../../assets/Google_map.jpg";
import correct_icon from "../../../assets/Correct_icon.png";
import Phone_icon from "../../../assets/Phone_icon.png";
// Import Aixos method---------------------------------------------
import axiosHttpClient from "../../../utils/axios";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData } from "../../../utils/encryptData";
// Import here to encrptData ------------------------------------------

import { Link } from "react-router-dom";
import { encryptData } from "../../../utils/encryptData";
// Google MAP --------------------------------
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import PublicHeader from "../../../common/PublicHeader";
// import images here
import amabhoomi from "../../../assets/Anand_park.jpg";
import instance from "../../../../env";
import "../Search_Card/Sub_Park_Details.css";

export default function Details() {
  // UseSate for get data -------------------------------------
  const [eventDetailsData, setEventDetailsData] = useState({});
  // here Check Login Status------------------------------------
  const [LoginStatus, setLoginStatus] = useState([0]);

  //here Location / crypto and navigate the page---------------
  const location = useLocation();
  const eventId = decryptData(
    new URLSearchParams(location.search).get("eventId")
  );
  const action = new URLSearchParams(location.search).get("action");
  const navigate = useNavigate();
  const isUserLoggedIn = sessionStorage.getItem("isUserLoggedIn") || 0;
  // Here Map Api keys -------------------------------------------------
  const apiKey = "AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao";
  const defaultCenter = { lat: 20.2961, lng: 85.8245 };
  let randomKey = Math.random();
  // For image Carousel............
  const [images, setImages] = useState([
    Park_img,
    amabhoomi,
    Park_img,
    amabhoomi,
    Park_img,
  ]);
  const [currentIndex1, setCurrentIndex1] = useState(0);
  // for google maps
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Here Get the data of Sub_park_details------------------------------------------
  async function getEventDetailData() {
    // console.log('eventId', eventId);
    try {
      let res = await axiosHttpClient(
        "VIEW_EVENT_BY_ID_API",
        "get",
        {},
        eventId
      );

      console.log("Response of event details", res.data.eventActivityDetails);
      setEventDetailsData(res.data.eventActivityDetails);
      console.log(
        "event additional images",
        res.data.eventActivityDetails.eventAdditionalImages.split(";")
      );
      setImages(res.data.eventActivityDetails.eventAdditionalImages.split(";"));
    } catch (err) {
      console.log("here Error", err);
    }
  }
  // For Find Out the Status of Login Page -----------------------------------
  // For Find Out the Status of Login Page -------------------------------

  useEffect(() => {}, [isUserLoggedIn]);

  // UseEffect for Update the data---------------------------------------------
  useEffect(() => {
    getEventDetailData();
  }, []);
  // here Funcation to encrotDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  //Image swap  conatiner ------------------------------------------------
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // useEffect(() => {
  //   const container = containerRef.current;
  //   const interval = setInterval(() => {
  //     const newIndex = (currentIndex + 1) % 10;
  //     setCurrentIndex(newIndex);
  //     container.scrollLeft = newIndex * container.offsetWidth;
  //   }, 4000); // Change box set every 3 seconds

  //   return () => clearInterval(interval);
  // }, [currentIndex]);

  function formatTime(time24) {
    //format 24 hour time as 12 hour time
    if (!time24) return;
    // Parse the input time string
    const [hours, minutes] = time24.split(":").map(Number);

    // Determine AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12; // 0 should be 12 in 12-hour format

    // Format the time string
    const time12 = `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;

    return time12;
  }

  function formatDate(date) {
    //format input date as DD-MM-YYYY
    if (!date) return;

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  }

  const handlePrev = () => {
    setCurrentIndex1(
      currentIndex1 === 0 ? images.length - 1 : currentIndex1 - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex1(
      currentIndex1 === images.length - 1 ? 0 : currentIndex1 + 1
    );
  };

  // handeling back button
  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1); // Go back to the previous page
    }
  };

  // clean loading of google maps
  useEffect(() => {
    const loadGoogleMaps = async (apiKey, callbackName) => {
      try {
        let mapResponse = await axiosHttpClient("GOOGLE_MAPS_API", "post", {
          apiKey: encryptData(apiKey),
          callbackName: encryptData(callbackName)
        });

        if (window.google && window.google.maps) {
          console.log("window.google.maps")
          // resolve();
          return;
        }

        // Create and append script element
        const script = document.createElement('script');
        script.text = mapResponse.data;
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        /*
        return new Promise((resolve, reject) => {
          // Check if Google Maps is already loaded
          if (window.google && window.google.maps) {
            console.log("window.google.maps")
            resolve();
            return;
          }

          // Define callback function
          window[callbackName] = () => {
            resolve();
          };

          // Create and append script element
          const script = document.createElement('script');
          script.text = mapResponse.data;
          script.type = 'text/javascript';
          // script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`;
          script.async = true;
          script.defer = true;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        */
      }
      catch (error) {
        console.error('Error loading Google Maps:', error);
        setLoadError(true);
      }
    };

    // Load Google Maps
    loadGoogleMaps(instance().REACT_APP_GOOGLE_MAPS_API_KEY, 'initMap')
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
        setLoadError(true);
      });

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const script = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (script) {
        script.remove();
      }
      delete window.initMap;
    };
  }, []);
  // useEffect(() => {
  //   const loadGoogleMaps = (apiKey, callbackName) => {
  //     return new Promise((resolve, reject) => {
  //       // Check if Google Maps is already loaded
  //       if (window.google && window.google.maps) {
  //         resolve();
  //         return;
  //       }

  //       // Define callback function
  //       window[callbackName] = () => {
  //         resolve();
  //       };

  //       // Create and append script element
  //       const script = document.createElement('script');
  //       script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`;
  //       script.async = true;
  //       script.defer = true;
  //       script.onerror = reject;
  //       document.head.appendChild(script);
  //     });
  //   };

  //   // Load Google Maps
  //   loadGoogleMaps(instance().REACT_APP_GOOGLE_MAPS_API_KEY, 'initMap')
  //     .then(() => {
  //       setIsLoaded(true);
  //     })
  //     .catch((error) => {
  //       console.error('Error loading Google Maps:', error);
  //       setLoadError(true);
  //     });

  //   // Cleanup function to remove the script when the component unmounts
  //   return () => {
  //     const script = document.querySelector(`script[src*="maps.googleapis.com"]`);
  //     if (script) {
  //       script.remove();
  //     }
  //     delete window.initMap;
  //   };
  // }, []);

  return (
    <div className="event-Sub_Manu_Conatiner">
      {/* here Header -----------------------------------------------------*/}
      <PublicHeader />
      {/* Here Heading Image (Below of header) */}
      <div className="event-Header_Img">
        <div className="park_Name1">
          <div className="park_Name2">
            <h1 className="text-park">{eventDetailsData?.eventName}</h1>
            <span className="Location_text_sub_manu">
              <img className="location_icon" src={Location_icon}></img>
              <h1 className="text_location">
                {eventDetailsData?.locationName}
              </h1>
            </span>
          </div>
          <div className="back_button">
            <button
              className="back_btn bg-[rgba(0,0,0,0.8)]"
              onClick={handleBackClick}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} />
              Back
            </button>
          </div>
        </div>

        {/* <h1 className="event-text-park">{eventDetailsData?.eventName}</h1>
        <span className="event-Location_text_sub_manu">
          <img className="event-location_icon" src={Location_icon}></img>
          <h1 className="event-text_location">
            {eventDetailsData?.locationName}
          </h1>
        </span> */}
      </div>
      {/*---------------- Jsx for Map and Image ------------------- */}
      <div className="event-map_img_main_conatiner">
        <div className="carousel-container1">
          <div className="carousel1">
            {/* <img className="event-Park_image" src={Park_img}></img> */}
            <img
              src={instance().baseURL + "/static" + images[currentIndex1]}
              alt={`Slide ${currentIndex1 + 1}`}
            />
          </div>
          <button className="carousel1-button1 left1" onClick={handlePrev}>
            &lt;
          </button>
          <button className="carousel1-button1 right1" onClick={handleNext}>
            &gt;
          </button>
        </div>

        <div className="event-Map_container">
          <span className="event-time_status grid grid-rows-2 grid-cols-3">
            <h1 className="event-time_text col-span-3">
              Event start date:{" "}
              {formatDate(eventDetailsData?.eventStartTime?.split("T")[0])}{" "}
              {formatTime(eventDetailsData?.eventStartTime)}
            </h1>
            <h1 className="event-time_text col-span-3">
              Event end date:{" "}
              {formatDate(eventDetailsData?.eventEndTime?.split("T")[0])}{" "}
              {formatTime(eventDetailsData?.eventEndTime)}
            </h1>
            <span className="event-time_text col-start-1 col-span-3 items-start">
              {/* <h1 className="event-time_text col-span-3">
                {" "}
                Timing : {formatDate(eventDetailsData?.eventStartTime?.split("T")[0])} {formatTime(eventDetailsData?.eventStartTime)}&nbsp; 
                - {formatDate(eventDetailsData?.eventEndTime?.split("T")[0])} {formatTime(eventDetailsData?.eventEndTime)}
              </h1> */}
              <button
                className={`event-Open_Button col-span-1 ${
                  eventDetailsData?.status == "ACTIVE"
                    ? "event-open"
                    : "event-closed"
                }`}
              >
                {eventDetailsData?.status == "ACTIVE" ? "Available" : "Closed"}
              </button>
            </span>
          </span>

          <span className={`event-Button_ticket_container`}>
            {eventDetailsData.status == "ACTIVE" ? (
              <>
                <Link
                  to={{
                    pathname: `${
                      isUserLoggedIn == 1 ? "/event-book" : "/login-signup"
                    }`,
                    search: `${
                      isUserLoggedIn == 1
                        ? `?eventId=${encryptDataId(eventDetailsData?.eventId)}`
                        : `?eventId=${encryptDataId(
                            eventDetailsData?.eventId
                          )}` + `&redirect=${encryptDataId("/event-book")}`
                    }`,
                  }}
                  className={`event-button-9`}
                >
                  Book Ticket
                </Link>
              </>
            ) : (
              <>
                <button
                  disabled
                  className={`event-button-9 disabled:bg-slate-500`}
                >
                  Book Ticket
                </button>
              </>
            )}
          </span>

          <div className="event-Map_image">
            {
              loadError ? (
                <div>Error loading maps</div>
              ) : !isLoaded ? (
                <div>Loading Maps...</div>
              ) : (
                <GoogleMap
                mapContainerStyle={{ height: "300px", width: "100%" }}
                center={{
                  lat: eventDetailsData?.latitude,
                  lng: eventDetailsData?.longitude,
                }}
                zoom={12}
              >
                {/* Render markers */}
                <Marker
                  key={eventDetailsData.eventId}
                  position={{
                    lat: eventDetailsData?.latitude,
                    lng: eventDetailsData?.longitude,
                  }}
                />
              </GoogleMap>
              )
            }
          </div>
        </div>
      </div>

      {/* -----------------------------services------------------------------------------ */}
      {/* <div className="event-Service_Now_conatiner">
      <h1 className="event-Service_text">Services</h1>
      {eventDetailsData.services?.map((item, index) => (
          <div className="event-Service_Avilable" key={index}>
            <div className="event-service_item">
              <img
                className="event-service_Avil_img"
                src={Park_img}
                alt="Parking"
              />
              <p className="event-service_name">{item.code}</p>
            </div>
          </div>
        ))}
    </div> */}

    <div className="other-contents">

      {/* --------------------------- Amenities ------------------------------------------*/}
      <div className="event-Amenities_Main_conatiner">
        <h1 className="event-Service_text">Amenities</h1>
        <div className="event-Amenities-Data">
          {eventDetailsData.amentities?.map((item, index) => (
            <span className="flex gap-2" key={index}>
              <img
                className="event-Correct_icon"
                src={correct_icon}
                alt={`Amenity icon ${index}`}
              />
              <h1 className="event-Amenities_name">{item}</h1>
            </span>
          ))}
        </div>
      </div>

      {/* -------------------------- Here About -------------------------------------------- */}
      <div className="event-About_Conatiner">
        <h1 className="event-Service_text">About</h1>
        <h1 className="event-About_text">
          {eventDetailsData?.descriptionOfEvent}
        </h1>
      </div>
      {/* -------------------------Helpline Number ------------------------------------------ */}
      <div className="event-Helpline_number_conatine">
        <h1 className="event-Service_text">Helpline Number</h1>
        <div className="event-Contact_number">
          <img className="event-Phone_icon" src={Phone_icon}></img>
          <h1 className="event-Number">
            {eventDetailsData?.length > 0 && eventDetailsData?.helpNumber}
          </h1>
          <h1 className="event-Number">9192847567</h1>
        </div>
      </div>
      </div>
      {/*-------------------------------------------- Here Footer---------------------------------------------- */}
    </div>
  );
}
