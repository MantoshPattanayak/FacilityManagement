import React, { useState, useEffect } from "react";
import "./Sub_Park_Details.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import "../../Public/Search_card.css";
import "..//Landing.css";

import CommonFooter from "../../../common/CommonFooter";
import AdminHeader from "../../../common/AdminHeader";

import Location_icon from "../../../assets/Location_goggle_icon-removebg-preview.png";
import { MdHomeRepairService } from "react-icons/md";
import Park_img from "../../../assets/Park_details.jpg";
import amabhoomi from "../../../assets/bg_park_3.png";
import sport_image from "../../../assets/sport_details_image.jpg";

import Yoga_img from "../../../assets/Yoga_img.png";
import Google_map from "../../../assets/Google_map.jpg";
import correct_icon from "../../../assets/Correct_icon.png";
import green_tick from "../../../assets/green_tick.svg";
import Phone_icon from "../../../assets/Phone_icon.png";

import axiosHttpClient from "../../../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData } from "../../../utils/encryptData";

import { Link } from "react-router-dom";
import { encryptData } from "../../../utils/encryptData";
import { useSelector } from "react-redux";
// import image no data -----------------------------
import No_Event_Data_img from "../../../assets/No_Event_available.png";

import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import PublicHeader from "../../../common/PublicHeader";
import Book_Now from "../BookParks/Book_Now";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Visiting_People from "../BookParks/Popups_Book_now/Visiting_People";
import instance from "../../../../env";
import { Navigate } from "react-router-dom";

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
  const [operatingDays, setOperatingDays] = useState("");
  const [bookmarkId, setBookmarkId] = useState(null);
  //Here is the popup state
  const [showPeople, setShowPeople] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [images, setImagesList] = useState([
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
  const [imagesFetch, setImagesFetch] = useState(false);
  const [activityPreferanceData, setActivityPreferenceData] = useState("");
  useEffect(() => {}, [facilityId]);
  // Book Mark Funcation ----------------------------------------
  async function handleBookmarkStatus(e) {
    e.preventDefault();
    if (!isUserLoggedIn) {
      navigate("/login-signup");
      return;
    }
    const newBookmarkStatus = !isBookmarked;
    console.log("newBookmarkStatus", {
      currdate: new Date(),
      newBookmarkStatus,
      isBookmarked,
    });
    try {
      let res = await axiosHttpClient(
        newBookmarkStatus == false ? "REMOVE_BOOKMARK_API" : "ADD_BOOKMARK_API",
        "post",
        newBookmarkStatus == false ? { bookmarkId } : { facilityId }
      );
      console.log("response", res.data);
      if (newBookmarkStatus == false) {
        toast.warning(res.data.message);
        setIsBookmarked(newBookmarkStatus);
      } else {
        toast.success(res.data.message);
        setIsBookmarked(newBookmarkStatus);
      }
    } catch (error) {
      console.error(error);
      if (error.response.status == 401) {
        toast.error("You are not logged in to bookmark.");
      } else {
        toast.error("Bookmarking failed!");
      }
    }
  }

  // const apiKey = "AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao";
  let defaultCenter = { lat: 20.2961, lng: 85.8245 };

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
      setActivityPreferenceData(res.data.fetchfacilitiesActivities);
      console.log("facility details data fetch", res.data);
      // Set images data
      if (res.data.facilitiesData.length > 0) {
        if (
          res.data.facilitiesData[0].url &&
          res.data.facilitiesData[0].url.split(";").length > 0
        ) {
          let imagesData = res.data.facilitiesData[0].url
            .split(";")
            .filter((url) => url.trim() !== "");
          setImagesList(imagesData);
          setImagesFetch(true);
        } else {
          setImagesFetch(false);
          setImagesList([Park_img, amabhoomi, Park_img, amabhoomi, Park_img]);
        }
      }

      function setOperatingDaysFromRes(res) {
        let operatingDaysFromRes = [];
        if (res.data.facilitiesData[0].sun == 1) {
          operatingDaysFromRes.push("Sun");
        }
        if (res.data.facilitiesData[0].mon == 1) {
          operatingDaysFromRes.push("Mon");
        }
        if (res.data.facilitiesData[0].tue == 1) {
          operatingDaysFromRes.push("Tue");
        }
        if (res.data.facilitiesData[0].wed == 1) {
          operatingDaysFromRes.push("Wed");
        }
        if (res.data.facilitiesData[0].thu == 1) {
          operatingDaysFromRes.push("Thu");
        }
        if (res.data.facilitiesData[0].fri == 1) {
          operatingDaysFromRes.push("Fri");
        }
        if (res.data.facilitiesData[0].sat == 1) {
          operatingDaysFromRes.push("Sat");
        }
        setOperatingDays(operatingDaysFromRes);
      }
    } catch (err) {
      console.log("Error fetching park details", err);
    }
  }

  async function getUserBookmarks() {
    if (isUserLoggedIn) {
      try {
        let res = await axiosHttpClient("VIEW_BOOKMARKS_LIST_API", "post");
        console.log("user bookmarks", { res: res.data.data, facilityId });
        let bookmarkBool = res.data?.data?.some((data) => {
          if (
            ["Parks", "Playfields", "Multi Purpose Ground"].includes(
              data.facilityType
            )
          ) {
            console.log(data);
            setBookmarkId(data.bookmarkId);
            return data.id == facilityId;
          }
        });
        setIsBookmarked(bookmarkBool);
        console.log("is this facility bookmarked", bookmarkBool);
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
    }
  }

  useEffect(() => {}, [isBookmarked]);

  useEffect(() => {
    getSub_park_details();
    getUserBookmarks();
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

  const [currentIndex2, setCurrentIndex2] = useState(0);

  const handleEventPrev = () => {
    setCurrentIndex2(
      currentIndex2 === 0 ? EventAvailable.length - 1 : currentIndex2 - 1
    );
  };

  const handleEventNext = () => {
    setCurrentIndex2(
      currentIndex2 === EventAvailable.length - 1 ? 0 : currentIndex2 + 1
    );
  };

  function closePopup(bool) {
    setShowPeople(bool);
    return;
  }

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
          callbackName: encryptData(callbackName),
        });

        if (window.google && window.google.maps) {
          console.log("window.google.maps");
          // resolve();
          return;
        }

        // Create and append script element
        const script = document.createElement("script");
        script.text = mapResponse.data;
        script.type = "text/javascript";
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
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setLoadError(true);
      }
    };

    // Load Google Maps
    loadGoogleMaps(instance().REACT_APP_GOOGLE_MAPS_API_KEY, "initMap")
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
        setLoadError(true);
      });

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const script = document.querySelector(
        `script[src*="maps.googleapis.com"]`
      );
      if (script) {
        script.remove();
      }
      delete window.initMap;
    };
  }, []);

  // console.log("timming data---",JSON.stringify(FacilitiesData.timing))
  console.log("timming data---", FacilitiesData[0]?.timing);

  const entries = FacilitiesData[0]?.timing
    ? Object.entries(FacilitiesData[0]?.timing)
    : [];

  return (
    <div className="Sub_Manu_Conatiner">
      <PublicHeader />
      <ToastContainer />
      <div
        className={
          FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityTypeId === 1
            ? "Header_Img"
            : FacilitiesData[0]?.facilityTypeId === 2
            ? "playground_header_image"
            : FacilitiesData[0]?.facilityTypeId === 3
            ? "MulitGroud"
            : FacilitiesData[0]?.facilityTypeId === 4
            ? "BlueWays"
            : FacilitiesData[0]?.facilityTypeId === 5
            ? "Greenways"
            : ""
        }
      >
        <div className="park_Name1">
          <div className="park_Name2">
            <h1 className="text-park">
              {FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityName}
            </h1>
            {/* <span className="Location_text_sub_manu">
              <img className="location_icon" src={Location_icon}></img>
              <h1 className="text_location">
                {FacilitiesData?.length > 0 && FacilitiesData[0]?.address}
              </h1>
            </span> */}
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
      </div>

      <div className="map_img_main_conatiner">
        <div className="carousel-container1">
          <div className="carousel1">
            {imagesFetch ? (
              <img
                src={instance().baseURL + "/static" + images[currentIndex1]}
                alt={`Slide ${currentIndex1 + 1}`}
              />
            ) : (
              <img
                src={images[currentIndex1]}
                alt={`Slide ${currentIndex1 + 1}`}
              />
            )}
          </div>
          <button className="carousel1-button1 left1" onClick={handlePrev}>
            &lt;
          </button>
          <button className="carousel1-button1 right1" onClick={handleNext}>
            &gt;
          </button>
        </div>

        <div className="Map_container">
          <div className="timeButton">
            <span className="time_status flex flex-col">
              <div className="flex">
                <h1 className="time_text">
                  <p className="timing-day">Timing :</p>
                  <span className="timing-day-text">
                    {formatTime(FacilitiesData[0]?.operatingHoursFrom)} -{" "}
                    {formatTime(FacilitiesData[0]?.operatingHoursTo)}
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

                <div
                  className={`bookmark ${isBookmarked ? "bookmarked" : ""}`}
                  onClick={handleBookmarkStatus}
                >
                  <FontAwesomeIcon
                    icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular}
                  />
                </div>
              </div>

              <div className="day-open-close-status">
                <h1 className="date_text text-[12px]">
                  <p className="timing-day">Day :</p>
                  <span className="timing-day-text">
                    {operatingDays.toString()}
                  </span>
                </h1>

                <div className="open-close-btn">
                  <button
                    className={`Open_Button ${
                      FacilitiesData.length > 0 &&
                      FacilitiesData[0].status === "open"
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
              {FacilitiesData[0]?.facilityTypeId == 1 ? (
                <button
                  onClick={() => setShowPeople(true)}
                  className="button-9"
                  disabled
                >
                  Book Ticket
                </button>
              ) : FacilitiesData[0]?.facilityTypeId == 2 ? (
                <Link
                  to={{
                    pathname: `${
                      isUserLoggedIn == 1
                        ? "/BookParks/Book_Now_Sport"
                        : "/login-signup"
                    }`,
                    search: `${
                      isUserLoggedIn == 1
                        ? `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}`
                        : `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}` +
                          `&redirect=${encryptDataId(
                            "/BookParks/Book_Now_Sport"
                          )}`
                    }`,
                  }}
                  className="button-9"
                >
                  <button role="button_by" disabled>Book Ticket</button>
                </Link>
              ) : FacilitiesData[0]?.facilityTypeId == 3 ? (
                <Link
                  to={{
                    pathname: `${
                      isUserLoggedIn == 1
                        ? "/Book_Now_Multipurposeground"
                        : "/login-signup"
                    }`,
                    search: `${
                      isUserLoggedIn == 1
                        ? `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}`
                        : `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}` +
                          `&redirect=${encryptDataId(
                            "/Book_Now_Multipurposeground"
                          )}`
                    }`,
                  }}
                  className="button-9"
                >
                  <button role="button_by" disabled>Book Ticket</button>
                </Link>
              ) : FacilitiesData[0]?.facilityTypeId == 4 ? (
                <Link
                  to={{
                    pathname: `${
                      isUserLoggedIn == 1
                        ? "/BluewaysBookPage"
                        : "/login-signup"
                    }`,
                    search: `${
                      isUserLoggedIn == 1
                        ? `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}`
                        : `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}` +
                          `&redirect=${encryptDataId(
                            "/BluewaysBookPage"
                          )}`
                    }`,
                  }}
                  className="button-9"
                >
                  <button role="button_by" disabled>Book Ticket</button>
                </Link>
              ) : FacilitiesData[0]?.facilityTypeId == 5 ? (
                <Link
                  to={{
                    pathname: `${
                      isUserLoggedIn == 1
                        ? "/GreenwaysBookingPage"
                        : "/login-signup"
                    }`,
                    search: `${
                      isUserLoggedIn == 1
                        ? `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}`
                        : `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}` +
                          `&redirect=${encryptDataId(
                            "/GreenwaysBookingPage"
                          )}`
                    }`,
                  }}
                  className="button-9"
                >
                  <button role="button_by" disabled>Book Ticket</button>
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: `${
                      isUserLoggedIn == 1
                        ? "/BookParks/Book_Now_Sport"
                        : "/login-signup"
                    }`,
                    search: `${
                      isUserLoggedIn == 1
                        ? `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}`
                        : `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}` +
                          `&redirect=${encryptDataId(
                            "/BookParks/Book_Now_Sport"
                          )}`
                    }`,
                  }}
                  className="button-9"
                >
                  <button role="button_by" onClick={() => setShowPeople(true)} disabled>
                    Book Ticket
                  </button>
                </Link>
              )}

              <Link
                to={{
                  pathname: `${
                    isUserLoggedIn == 1 ? "/Event_hostPage" : "/login-signup"
                  }`,
                  search: `${
                    isUserLoggedIn == 1
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
                <button role="button_by" className="name_button">
                  Host Event
                </button>
              </Link>
            </span>
          </div>

          <div className="Map_image">
            {loadError ? (
              <div>Error loading maps</div>
            ) : !isLoaded ? (
              <div>Loading Maps...</div>
            ) : (
              <GoogleMap
                ClassName="Map_image_Goole"
                mapContainerStyle={{ height: "200px", width: "100%" }}
                center={{
                  lat: FacilitiesData[0]?.latitude,
                  lng: FacilitiesData[0]?.longitude,
                }}
                zoom={15}
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
            )}
            {/* <LoadScript googleMapsApiKey={apiKey}>
              <GoogleMap
                ClassName="Map_image_Goole"
                mapContainerStyle={{ height: "200px", width: "100%" }}
                center={defaultCenter}
                zoom={8}
              >
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
            </LoadScript> */}
          </div>
        </div>

        {/* Back button............. */}
        {/* <Link to={"/facilities"}>
          <div className="back_button">
            <button className="back_btn" >
              <FontAwesomeIcon icon={faArrowLeftLong} />
              Back
            </button>
          </div>
        </Link> */}
        {/* <div className="back_button">
          <button className="back_btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeftLong} />
            Back
          </button>
        </div> */}
      </div>
      <div className="other-contents">
        {/* {------------timting-------------------------------------------------------} */}
        {entries.length > 0 && (
          <div className="Service_Now_container">
            <h1 className="Service_text">Schedule</h1>
            <div className="Timing-Data">
              <table border="1" style={{ width: "100%", textAlign: "left" }}>
                <thead>
                  <tr>
                    <th>Timing</th>
                    <th>Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(([time, activity], index) => (
                    <tr key={index}>
                      <td>{time}</td>
                      <td>{activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* -----------------------------services------------------------------------------ */}
        <div className="Service_Now_container">
          <h1 className="Service_text">Services</h1>
          <div className="service_container">
            {ServiceData?.length > 0 &&
              ServiceData?.map((item, index) => (
                <div className="Service_Avilable" key={index}>
                  <div className="service_item">
                    <img
                      className="Correct_icon"
                      src={green_tick}
                      alt={`Amenity icon ${index}`}
                    />
                    <p className="service_name">{item.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* --------------------------- Amenities ------------------------------------------*/}
        <div className="Amenities_Main_container">
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
                    src={green_tick}
                    alt={`Amenity icon ${index}`}
                  />
                  <h1 className="Amenities_name">{item.amenityName}</h1>
                </span>
              ))}
          </div>
        </div>

        {/* -------------------------- Here About -------------------------------------------- */}
        <div className="About_Container">
          <h1 className="Service_text">About</h1>
          <h1 className="About_text">
            {FacilitiesData?.length > 0 && FacilitiesData[0]?.about}
          </h1>
        </div>

        {/* -------------------------Event Available ----------------------------------------------------------- */}
        <div className="Event_Available_main_container">
          <h1 className="Service_text">Event Available</h1>
          {EventAvailable?.length > 20 ? (
            <div className="carousel carousal321">
              <button
                className="carousel-button2 left"
                onClick={handleEventPrev}
              >
                &lt;
              </button>
              <div className="carousel-container">
                <div
                  className="carousel-images"
                  style={{
                    width: "auto",
                    transform: `translateX(-${currentIndex2 * 420}px)`,
                  }}
                >
                  {EventAvailable.map((d, i) => (
                    <div
                      className="carousel-slide"
                      key={i}
                      onClick={() => {
                        navigate(
                          `/Sub_Park_Details?facilityId=${encryptData(
                            d.facilityId
                          )}&action=view`
                        );
                      }}
                    >
                      <img
                        className="Card_img"
                        src={`${instance().baseURL}/static${d.url}`}
                        alt={"image"}
                      />
                      <div className="card_text">
                        <span className="Name_location">
                          <h2 className="park_name">{d.eventName}</h2>
                          <span className="Yoga_date_time">
                            <h1>Date: {formatDate(d.eventDate)}</h1>
                            <h1>Time: {formatTime(d.eventStartTime)}</h1>
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="carousel-button2 right"
                onClick={handleEventNext}
              >
                &gt;
              </button>
            </div>
          ) : (
            <p>No events.</p>
          )}
        </div>
        {/* <Book_Now/> */}
      </div>

      {/*-------------------------------------------- Here Footer---------------------------------------------- */}

      {showPeople &&
        (isUserLoggedIn == 1 ? (
          <Visiting_People
            closePopup={closePopup}
            facilityId={encryptDataId(FacilitiesData[0]?.facilityId)}
            facilityName={FacilitiesData[0]?.facilityName}
            operatingHoursFrom={FacilitiesData[0]?.operatingHoursFrom}
            operatingHoursTo={FacilitiesData[0]?.operatingHoursTo}
            activityPreferanceData = {activityPreferanceData}
          />
        ) : (
          // <Link to={{ pathname: `${"/login-signup"}` }}></Link>
          <Navigate to="/login-signup" />
        ))}
    </div>
  );
};

// Export Sub_Park_details ------------------------
export default Sub_Park_Details;
