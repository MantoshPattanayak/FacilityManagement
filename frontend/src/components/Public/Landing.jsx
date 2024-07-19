import "./Landing.css";
import gif from "../../assets/newImg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faLocationDot,
  faSearch,
  faPlay,
  faPause,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import axiosHttpClient from "../../utils/axios";
import park_logo from "../../assets/park-logo.png";
import playground_logo from "../../assets/playground-logo.png";
import mp_ground_logo from "../../assets/multipurpose-ground-logo.png";
import adImg from "../../assets/Park_near_Utkal.png";
import galleryImg1 from "../../assets/Gallery_Anant Vihar Park,Phase-3,DDC Park_Pokhariput.jpg";
import galleryImg2 from "../../assets/Gallery_BDA Children's Park.jpg";
import galleryImg3 from "../../assets/Gallery_Disabled Friendly Park_Saheed Nagar.jpg";
import galleryImg4 from "../../assets/Gallery_Kelucharan_Park-5.jpg";
import galleryImg5 from "../../assets/Gallery_Madhusudan_Park.jpg";
import galleryImg6 from "../../assets/Gallery_Mukharjee_Park.jpg";
import galleryImg7 from "../../assets/Gallery_Prachi Park_Damana.jpg";
import galleryImg8 from "../../assets/Gallery_Sundarpada_BDA Colony Park.jpg";
import Landing_Img_1 from "../../assets/ama_bhoomi_bgi.jpg";
import ad1 from "../../assets/ad1.png";
import ad2 from "../../assets/ad2.png";
import ad3 from "../../assets/ad3.png";
import googlePlayStore from "../../assets/google-play.svg";
import appleStore from "../../assets/apple.svg";
// import ama_bhoomi_bgi from "../../assets/ama_bhoomi_bgi.jpg";
import ama_bhoomi_bgi from "../../assets/ama_bhoomi_bgi.jpg";
import badminton from "../../assets/badminton_ENA.png";
import badmintonBg from "../../assets/Explore_New_Activity_background.png";
import cricket_bg from "../../assets/cricket_bg_ENA.jpg";
import cricket_1 from "../../assets/cricket_ENA.jpg";
import football_bg from "../../assets/football_bg_ENA.jpg";
import football_1 from "../../assets/football_ENA.jpg";
import yoga_bg from "../../assets/Yoga_bg_ENA.jpg";
import yoga_1 from "../../assets/Yoga__ENA.jpg";
// import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import anan_image from "../../assets/Anan_vihar.jpg";
// Import Image for Current event--------------------
import No_Current_Event_img from "../../assets/No_Current_Event_Data.png";
import No_data_nearBy from "../../assets/Near_Data_No_Found.png"
// here import Park Image

import PublicHeader from "../../common/PublicHeader.jsx";

// Location icon and image all types of image---------------------------------------------

import Yoga_img from "../../assets/Yoga_img.png";
import greenway from "../../assets/Greenway.png";
import Blueway from "../../assets/blueways.png";

// import blueWays_logo from "../../assets/ama_bhoomi_blueways_logo.jpeg";
// import greenWays_logo from "../../assets/ama_bhoomi_greenways.jpeg";
// import here encpty js ----------------------------------
// Import here to encrptData ------------------------------------------
import { Link, useNavigate } from "react-router-dom";
// import { encryptData } from "../../../utils/encryptData"
import { encryptData } from "../../utils/encryptData";
import {
  formatDate,
  formatDateYYYYMMDD,
  formatTime,
} from "../../utils/utilityFunctions.js";
// import for slider

import TourGuide from "../../common/TourGuide.jsx";
import { useDispatch, useSelector } from "react-redux";
import { manageTourGuide } from "../../utils/authSlice.jsx";
import instance from "../../../env.js";
// import "./YourStyles.css";

const backGround_images = [Landing_Img_1, galleryImg1, galleryImg3];

// mediaquary for responsive landing page
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Landing = () => {
  const [runTour, setRunTour] = useState(false);
  const [showTour, setShowTour] = useState(
    localStorage.getItem("tourGuide") || "true"
  );
  const [mapdata, setmapdata] = useState([]);
  const [selectedParkId, setSelectedParkId] = useState(null);
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  const [givenReq, setGivenReq] = useState("");
  const [facilityTypeId, setFacilityTypeId] = useState(1);
  const [eventNameLanding, setEventNameLanding] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const apiKey = "AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao";
  const defaultCenter = { lat: 20.2961, lng: 85.8245 };
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [nearbyParks, setNearbyParks] = useState([]);
  const [distanceRange, setDistanceRange] = useState(2);
  const [currentIndex, setCurrentIndex] = useState(0);
  let randomKey = Math.random();
  let navigate = useNavigate();
  //set auto-suggest facilties
  const [inputFacility, setInputFacility] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  const [currentIndexBg, setCurrentIndexBg] = useState(0);
// here Gallery Image -------------------------------
const[GalleryImage, setGalleryImage]=useState([])

  // --------------Explore new Activities-------------------------------------------------------------
  // State to keep track of the selected activity
  const [selectedActivity, setSelectedActivity] = useState(0);
  let dispatch = useDispatch();

  const marqueeRef = useRef(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  const handleTogglePlayPause = () => {
    if (isMarqueePaused) {
      marqueeRef.current.start();
    } else {
      marqueeRef.current.stop();
    }
    setIsMarqueePaused(!isMarqueePaused);
  };

  const [exploreNewActivities, setExploreNewActivities] = useState([
    {
      game: "Tennis",
      parks: ["Kalinga Stadium", "Saheed Nagar Sports Complex"],
      imgENA: badminton,
      imgENAbg: badmintonBg,
    },
    {
      game: "Cricket",
      parks: ["Ruchika High School, Unit - 6", "Saheed Nagar Sports Complex"],
      imgENA: cricket_1,
      imgENAbg: cricket_bg,
    },
    {
      game: "Football",
      parks: [
        "Kalinga Stadium",
        "Bhubaneswar Footbal Academy",
        "BJB Nagar Field",
      ],
      imgENA: football_1,
      imgENAbg: football_bg,
    },
    {
      game: "Yoga",
      parks: ["Buddha Jayanti Park", "Acharya Vihar Colony Park"],
      imgENA: yoga_1,
      imgENAbg: yoga_bg,
    },
  ]);

  const [currentImage, setCurrentImage] = useState(yoga_bg); //background Image of explore new activity
  const [currentInnerImage, setCurrentInnerImage] = useState(yoga_1); // Top inner image

  const handleNextImage = () => {
    console.log(1);
    setCurrentIndexBg(
      (prevIndex) => (prevIndex + 1) % backGround_images.length
    );
  };
  const handlePrevImage = () => {
    console.log(2);
    setCurrentIndexBg(
      (prevIndex) =>
        (prevIndex - 1 + backGround_images.length) % backGround_images.length
    );
  };
  const selectedImage = backGround_images[currentIndexBg];

  //function to fetch suggestions of facilities on input by user
  async function fetchAutoSuggestData() {
    try {
      let response = await axiosHttpClient("View_Park_Data", "post", {
        givenReq: inputFacility,
        facilityTypeId: null,
      });

      console.log("auto suggest facility data", response.data.data);
      setSuggestions(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  //function to modify and set explore new activities section data
  function handleExploreActivitiesData(exploreData) {
    let modifiedData = [];

    for (let i = 0; i < exploreData.length; i++) {
      let currentData = exploreData[i];

      // Use find to check if the game already exists in modifiedData
      let existingGame = modifiedData.find(
        (data) => data.game === currentData.userActivityName
      );

      if (existingGame) {
        // If the game exists, push the park information to the parks array
        existingGame.parks.push({
          facilityname: currentData.facilityname,
          facilityId: currentData.facilityId,
        });
      } else {
        // If the game does not exist, create a new game entry with park information
        modifiedData.push({
          game: currentData.userActivityName,
          parks: [
            {
              facilityname: currentData.facilityname,
              facilityId: currentData.facilityId,
            },
          ],
        });
      }
    }

    console.log("modified data", modifiedData);
    return modifiedData; // Return the modified data as JSON
  }

  async function fetchLandingPageData() {
    try {
      let resLanding = await axiosHttpClient("LandingApi", "get");
      console.log("Here is the Landing Page API data", resLanding.data);
      setEventNameLanding(resLanding.data.eventDetailsData);
      setNotifications(resLanding.data.notificationsList);
      setGalleryImage(resLanding.data.galleryData)
      let modifiedData = handleExploreActivitiesData(
        resLanding.data.exploreActivities
      );
      setExploreNewActivities(modifiedData);
    } catch (error) {
      console.error("Error fetching the Landing Page API data: ", error);
    }
  }

  useEffect(() => {
    fetchLandingPageData();
    setUserGeoLocation();
    document.title = "AMA BHOOMI";
    setRunTour(true);
    console.log("showTour", showTour);
  }, []);
  // here error ------------

  function handleInputFacility(e, facilityId) {
    e.preventDefault();
    setInputFacility(e.target.value);
    setActiveSuggestionIndex(facilityId);
  }

  // here Fetch the data -----------------------------------------------
  async function fecthMapData() {
    try {
      let res = await axiosHttpClient("View_Park_Data", "post", {
        givenReq: givenReq,
        facilityTypeId: facilityTypeId,
      });

      console.log("here get data", res);
      setmapdata(res.data.data);
    } catch (err) {
      console.log(" here error", err);
    }
  }

  // function to fetch user current location
  function setUserGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          sessionStorage.setItem(
            "location",
            JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation(defaultCenter);
          // sessionStorage.setItem('location', JSON.stringify(location));
          // Handle error, e.g., display a message to the user
        }
      );
    } else {
      setUserLocation(defaultCenter);
      console.error("Geolocation is not supported by this browser");
      toast.error("Location permission not granted.");
    }
    return;
  }

  async function getNearbyFacilities() {
    let bodyParams = {
      facilityTypeId: facilityTypeId,
      latitude: userLocation?.latitude || defaultCenter?.lat,
      longitude: userLocation?.longitude || defaultCenter?.lng,
      range: distanceRange,
    };
    console.log("body params", bodyParams);

    try {
      let res = await axiosHttpClient(
        "VIEW_NEARBY_PARKS_API",
        "post",
        bodyParams
      );
      console.log(
        res.data.message,
        res.data.data.sort((a, b) => {
          return a.distance - b.distance;
        })
      );
      setNearbyParks(
        res.data.data.sort((a, b) => {
          return a.distance - b.distance;
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Location permission not granted.");
    }
  }

  // here nearBy data -----------------------
  // useEffect(() => {
  //   if (userLocation && distanceRange && facilityTypeId) {
  //     getNearbyFacilities();
  //   }

  // }, [userLocation, distanceRange, facilityTypeId]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 575);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 575px)");

    const handleMediaQueryChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  // Handle Chnage ----------------------------------------------------------------
  function handleChange(e) {
    let { name, value } = e.target;
    switch (name) {
      case "givenReq":
        value = e.target.value.replace(/^\s*/, "");
        setGivenReq(value);
    }
  }
  // Function to handle marker click ---------------------------------------------------
  const handleMarkerClick = (facilityId) => {
    setSelectedParkId(facilityId); // Set selected parkId
    const location = mapdata.find(
      (location) => location.facilityId === facilityId
    );
    setSelectedLocationDetails(location); // Set selected location details
    console.log(location);
  };
  const [selectedButton, setSelectedButton] = useState(null);
  // Function to handle setting facility type ID and updating search input value ---------------------------
  const handleParkLogoClick = (typeid) => {
    setSelectedButton(typeid);
    setFacilityTypeId(typeid); // Set facility ex typeid-1,typeid-2,typeid-3
    console.log("here type id", typeid);
    fecthMapData();
  };
  // here Handle for encrpt the data------------------------------------------
  // here Funcation to encrotDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }
  // here Update the data-----------------------------------------------
  useEffect(() => {
    fecthMapData();
  }, [givenReq, facilityTypeId, showTour]);

  // refresh on user input to show suggestions of facilities
  useEffect(() => {
    if (inputFacility) console.log("inputFacility", inputFacility);
  }, [inputFacility]);

  //-------------for event Cards---------------------------------------
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // To handle search input field in landing page..............

  const handleSearch = () => {
    if (inputFacility.trim() !== "") {
      navigate(`/Search_card?query=${encodeURIComponent(inputFacility)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // handleGameClick ------------------------------------------------
  const handleGameClick = (index, activity) => {
    setSelectedActivity(index === selectedActivity ? null : index);

    if (activity === "Football") {
      setCurrentImage(football_bg);
      setCurrentInnerImage(football_1);
    } else if (activity === "Cricket") {
      setCurrentImage(cricket_bg);
      setCurrentInnerImage(cricket_1);
    } else if (activity === "Tennis") {
      setCurrentImage(badmintonBg);
      setCurrentInnerImage(badminton);
    } else {
      setCurrentImage(yoga_bg);
      setCurrentInnerImage(yoga_1);
    }
  };

  //Gallery section


  const nextImage = () => {
    if (currentIndex < images.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const [currentIndex1, setCurrentIndex1] = useState(0);
  const nextImage1 = () => {
    if (currentIndex1 < GalleryImage.length - 3) {
      setCurrentIndex1(currentIndex1 + 1);
    }
  };
  const prevImage1 = () => {
    if (currentIndex1 > 0) {
      setCurrentIndex1(currentIndex1 - 1);
    }
  };

  // const [currentIndex, setCurrentIndex] = useState(0);

  //------- Advatisemant -----------
  const ad = [adImg, ad1, ad2, ad3];
  // Home page image
  const getStyles = () => {
    const width = window.innerWidth;
    const baseStyle = {
      backgroundImage: `linear-gradient(to right, #010101b5 20%, transparent), url(${selectedImage})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      opacity: "100%",
      maxHeight: "100%",
      marginBottom: "1px",
      padding: "100px",
      width: "100vw",
      // width: "auto",
      // height: "100vh",
      height: "100%",
      position: "relative",
      backgroundPosition: "center",
    };

    if (width < 600) {
      return {
        ...baseStyle,
        // height: "72vh",
        height: "100vh",
        width: "auto",
      };
    } else if (width < 1190) {
      return {
        ...baseStyle,
        // height: "36vh",
        // height: "54vh",
        height: "100%",
      };
    } else if (width < 1200) {
      return {
        ...baseStyle,
        // height: "50vh",
        height: "100%",
      };
    } else if (width < 1600) {
      return {
        ...baseStyle,
        // height: "110vh",
        height: "100%",
      };
    } else {
      return baseStyle;
    }
  };
  const styles = getStyles();
  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    if (status === "finished" || action === "skip") {
      // Save the state to local storage to prevent the tour from showing again
      dispatch(manageTourGuide({ tourGuide: false }));
      setRunTour(false);
      setShowTour(false);
    }
  };

  return (
    <div className="landingcontainer">
      <section className="bg-img" style={styles}>
        <PublicHeader />
        <div className="iconPlayApple">
          <img src={googlePlayStore} alt="Google Play Store" />
          <img src={appleStore} alt="Apple Store" />
        </div>
        {/*----------------- Landing Page contant -----------------------------------------------------------------------*/}
        <div className="landing-page_contant">
          <span className="Search-Conatiner">
            <h1>AMA BHOOMI</h1>
            <span className="about">
              <p className="about_text">
                AMA BHOOMI stands for Assuring Mass Access through BHubaneswar
                Open Spaces <br></br>and Ownership Management Initiative.{" "}
              </p>
            </span>
            <h2 className="typing-animation">
              Explore, Book and Enjoy Open Spaces{" "}
            </h2>
            <div className="input-wrapper">
              <div className="search-bar-wrapper">
                <input
                  ref={searchInputRef}
                  className="search-bar"
                  type="text"
                  name="search"
                  placeholder="Search by Name and Location"
                  value={inputFacility}
                  autoComplete="off"
                  onChange={handleInputFacility}
                  onKeyDown={handleKeyDown}
                />
                <div className="search-icon">
                  <FontAwesomeIcon icon={faSearch} className="os-icon" />
                </div>
              </div>
              <div className="search-bar-arrow">
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="input-icon"
                  onClick={handleSearch}
                />
              </div>
            </div>
            {/* {suggestions?.length > 0 && inputFacility && (
              <ul className="suggestions">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className={
                        suggestion.facilityId === activeSuggestionIndex
                          ? "active"
                          : ""
                      }
                      onClick={(e) =>
                        navigate(
                          "/Sub_Park_Details" +
                            `?facilityId=${encryptDataId(
                              suggestion.facilityId
                            )}`
                        )
                      }
                    >
                      {suggestion.facilityname}
                    </li>
                  ))
                ) : (
                  <li>No suggestions available</li>
                )}
              </ul>
            )} */}
          </span>
          <div className="abBgButton">
            <FontAwesomeIcon
              onClick={handlePrevImage}
              icon={faSquareCaretLeft}
            />
            <FontAwesomeIcon
              onClick={handleNextImage}
              icon={faSquareCaretRight}
            />
          </div>
        </div>
      </section>

      {/* ----------Logo sticker------------------------------------------------------------------------ */}

      <div className="logo-section">
        <div className="logos">
          <Link
            to={{
              pathname: "/facilities",
              search: `?facilityTypeId=${encryptDataId(1)}`,
            }}
          >
            <div className="iconLogo">
              <img src={park_logo} alt="" />
              <h2>Parks</h2>
            </div>
          </Link>

          <Link
            to={{
              pathname: "/facilities",
              search: `?facilityTypeId=${encryptDataId(2)}`,
            }}
          >
            <div className="iconLogo">
              <img src={playground_logo} alt="" />
              <h2>Playgrounds</h2>
            </div>
          </Link>
          <Link
            to={{
              pathname: "/facilities",
              search: `?facilityTypeId=${encryptDataId(3)}`,
            }}
          >
            <div className="iconLogo">
              <img src={mp_ground_logo} alt="" />
              <h2>Multipurpose</h2>
              {/* <h2>Grounds</h2> */}
            </div>
          </Link>

          <div className="iconLogo">
            <img src={greenway} alt="" />
            <h2>Greenways</h2>
          </div>
          <div className="iconLogo">
            <img src={Blueway} alt="" />
            <h2>Blueways</h2>
          </div>
        </div>
      </div>

      {/* -------------GOOGLE MAP Container----------------------------------------------------------------------------*/}

      <div className="map-parentContainer">
        {/* --------//google map ------------------------------------------------------------------------------- */}

        <section className="map-container2">
          <div className="map-bar">
            <div className="map-icons">
              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(1)}
                >
                  <img src={park_logo} alt="" />
                  {selectedButton === 1 ? (
                    <h2 className="clicked-text-icon3">Parks</h2>
                  ) : (
                    <h2 className="text1">Parks</h2>
                  )}
                </button>
              </div>
              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(2)}
                >
                  <img src={playground_logo} alt="" />
                  {selectedButton === 2 ? (
                    <h2 className="clicked-text-icon">Playgrounds</h2>
                  ) : (
                    <h2 className="text1">Playgrounds</h2>
                  )}
                </button>
              </div>
              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(3)}
                >
                  <img src={mp_ground_logo} alt="" />
                  {selectedButton === 3 ? (
                    <h2 className="clicked-text-icon">Multipurpose Grounds</h2>
                  ) : (
                    <h2 className="text2">Multipurpose Grounds</h2>
                  )}
                </button>
              </div>
              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(4)}
                >
                  <img src={greenway} alt="" />
                  {selectedButton === 4 ? (
                    <h2 className="clicked-text-icon_blue">Greenways</h2>
                  ) : (
                    <h2 className="text1">Greenways</h2>
                  )}
                </button>
              </div>
              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(5)}
                >
                  <div>
                    <img src={Blueway} alt="" />
                  </div>
                  {selectedButton === 5 ? (
                    <div>
                      <h2 className="clicked-text-icon_blue">Blueways</h2>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text1">Blueways</h2>
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="mapSearchButton">
              <input
                type="text"
                placeholder="Please Enter the Location or Facility"
                name="givenReq"
                id="givenReq"
                value={givenReq}
                onChange={handleChange}
              ></input>
              <button type="button" onClick={fecthMapData}>
                <FontAwesomeIcon icon={faSearch} className="os-icon" />
              </button>
            </div>
          </div>

          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={{
                height: "400px",
                width: "100%",
                ...(isMobile && { height: "280px" }),
              }}
              center={defaultCenter}
              zoom={12}
            >
              {/* Render markers */}
              {mapdata.map((location, index) => (
                <Marker
                  key={index}
                  position={{ lat: location.latitude, lng: location.longitude }}
                  onClick={() => handleMarkerClick(location.facilityId)} // Call handleMarkerClick function with parkId when marker is clicked
                />
              ))}

              {/* Show InfoWindow for selected location */}
              {selectedLocationDetails && (
                <InfoWindow
                  key={randomKey}
                  position={{
                    lat: selectedLocationDetails.latitude,
                    lng: selectedLocationDetails.longitude,
                  }} // Position the InfoWindow at the selected location
                  onCloseClick={() => {
                    setSelectedParkId(null);
                    setSelectedLocationDetails(null);
                  }}
                >
                  {selectedParkId ? (
                    <div>
                      <h3>Park Name:{selectedLocationDetails.facilityname}</h3>
                    </div>
                  ) : (
                    ""
                  )}
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
          
        </section>

        {/* --------Facilities Near me----------------------------------------------------- */}

        <div className="nearByFacilities">
          <div className="nearByFacilities-heading">
            <h1>Facilities Near Me</h1>
            <div className="nearByFacilities-buttons">
              <button
                type="button"
                onClick={(e) => {
                  setDistanceRange(2);
                }}
              >
                2km
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setDistanceRange(4);
                }}
              >
                4km
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setDistanceRange(6);
                }}
              >
                6km
              </button>
            </div>
          </div>

          <div className="facililiy-list-map overflow-y-scroll">
            {nearbyParks?.length > 0 ? (
              nearbyParks?.map((park, index) => {
                return (
                  <Link
                    className="map-facilities hover:cursor-pointer"
                    key={index}
                    to={{
                      pathname: "/Sub_Park_Details",
                      search: `?facilityId=${encryptDataId(park.facilityId)}`,
                    }}
                  >
                    <p>{park.facilityname}</p>
                  </Link>
                );
              })
            ) : facilityTypeId != 1 || facilityTypeId != 2 ? (
              <div className="No_Data_image_conatiner">
                <img className="No_Data_image" src={No_data_nearBy}></img>
              </div>
            ) : (
              <div>No data</div>
            )}
          </div>
        </div>
      </div>

      {/* -----Whats New Section------------------------------------------- */}

      <div className="notice2">
        <div className="notice2-container">
          <button className="what_new">Whats New</button>
          <marquee
            className="marquee"
            behavior="scroll"
            direction="left"
            scrollamount={isMarqueePaused ? "0" : "6"} // Adjust scroll speed here
            ref={marqueeRef}
          >
            <div className="flex marquee-content">
              {notifications.map((notification) => {
                const createdAtDate = new Date(notification.createdAt);
                const currentDate = new Date();
                const diffInDays = Math.round(
                  (currentDate - createdAtDate) / (1000 * 3600 * 24)
                );

                return (
                  <p className="notce2para" key={notification.id}>
                    {diffInDays <= 100 && (
                      <span className="New_text"> New </span>
                    )}
                    {/* Conditionally render gif */}
                    {/* {diffInDays <= 7 && <img src={gif} alt="New notification" />} */}
                    {notification.publicNotificationsContent}&nbsp;
                    {notification.url && (
                      <a
                        href={instance().baseURL + "/static" + notification.url}
                      >
                        <FontAwesomeIcon icon={faFileLines} />
                      </a>
                    )}
                    &nbsp;&nbsp;
                  </p>
                );
              })}
            </div>
          </marquee>
        </div>
        <div className="button-container22">
          {isMarqueePaused ? (
            <button className="Play_pause_icon" onClick={handleTogglePlayPause}>
              <FontAwesomeIcon icon={faPlay} />
            </button>
          ) : (
            <button className="Play_pause_icon" onClick={handleTogglePlayPause}>
              <FontAwesomeIcon icon={faPause} />
            </button>
          )}
        </div>
      </div>

      {/* ------Event details card-------------------------------------------------------------------- */}

      <div className="EventContainerlanding">
        {/* <div className="EventContainerTitle">
          <div className="greenHeader"></div>
          <h1>Current Events</h1>
        </div> */}

        <div className="galleryTitle">
          <div className="galleryTitleLeft">
            <div className="greenHeader"></div>
            <h1>Current Events</h1>
          </div>
          <button className="viewMoreGallery">
            <Link to="/events">View All</Link>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        {/* .........Card section scroll using carousel ..........*/}

        <div className="carousel">
          {eventNameLanding.length > 0 ? (
            <>
              <button className="carousel-button2 left" onClick={prevImage}>
                &lt;
              </button>
              <div className="carousel-container">
                <div
                  className="carousel-images"
                  style={{ transform: `translateX(-${currentIndex * 420}px)` }} // Adjust transform value
                >
                  {eventNameLanding.map((event, index) => (
                    <Link
                      key={index}
                      className="carousel-slide2"
                      to={
                        "/events-details?eventId=" +
                        `${encryptData(event.eventId)}`
                      }
                    >
                      <img
                        className="Yoga_image2"
                        src={Yoga_img}
                        alt="Yoga Event"
                      ></img>
                      <div className="carousel-slide-text">
                        <h1 className="Name_yoga2">{event.eventName}</h1>
                        <div className="carousel-slide-location">
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            style={{ color: "#504f4e" }}
                            className="os-icon"
                          />
                          <h1>{event.locationName}</h1>
                        </div>
                        <span className="Yoga_date_time2">
                          <h1 className="Yoga_date2">
                            {formatDate(event.eventDate)}
                          </h1>
                          <h1 className="Yoga_time2">
                            {formatTime(event.eventStartTime)} -{" "}
                            {formatTime(event.eventEndTime)}
                          </h1>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <button className="carousel-button2 right" onClick={nextImage}>
                &gt;
              </button>
            </>
          ) : (
            <div className="no-data-message_Current_event1">
              <img
                className="Current_Event_image"
                src={No_Current_Event_img}
              ></img>
            </div>
          )}
        </div>
      </div>

      {/*------------ Explore new activities----------- */}

      <div
        className="exploreNewAct-Parent-Container"
        style={{
          backgroundImage: `linear-gradient(10deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)), url(${currentImage})`,
        }}
      >
        <div className="exploreNewAct-Header">
          <div className="whiteHeader"></div>
          <h1>Explore New Activities And Book</h1>
        </div>

        <div className="exploreNewAct-outer">
          {/* Mapping through the exploreNewActivities data */}
          <div className="exploreNewAct-firstDiv">
            {exploreNewActivities.map((activity, index) => (
              <button
                key={index}
                className={`activity ${selectedActivity === index ? "selected" : ""
                  }`}
                onClick={() => handleGameClick(index, activity.game)} // Set selected activity on click
              >
                {activity.game}
              </button>
            ))}
          </div>
          <div className="image-secondDiv">
            <img
              className="h-80"
              src={currentInnerImage}
              alt={exploreNewActivities[selectedActivity]?.game}
            />
            <div className="exploreNewAct-secondDiv">
              {exploreNewActivities?.length > 0 &&
                exploreNewActivities?.map(
                  (activity, index) =>
                    selectedActivity === index && (
                      <div className="parkList" key={index}>
                        {activity.parks.map((park, idx) => (
                          <div className="parkItem" key={idx}>
                            <p>{park.facilityname}</p>
                            <button
                              className="bookButton"
                              onClick={(e) => {
                                navigate(
                                  "/Sub_Park_Details" +
                                  `?facilityId=${encryptDataId(
                                    park.facilityId
                                  )}`
                                );
                              }}
                            >
                              Book
                            </button>
                            <FontAwesomeIcon
                              icon={faBookmark}
                              className="bookmarkIcon"
                            />
                          </div>
                        ))}
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
      </div>

      {/* -------------Gallery section----------------------------------------------------------------------------------------------- */}

      <div className="galleryOuter">
        <div className="galleryTitle">
          <div className="galleryTitleLeft">
            <div className="greenHeader"></div>
            <h1>Gallery</h1>
          </div>
          <div className="viewMoreGallery">
            <Link to={"/View_Gallery/Image_Gallery"}>View All</Link>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>

        <div className="carousel">
          <button className="carousel-button2 left" onClick={prevImage1}>
            &lt;
          </button>
          <div className="carousel-container">
            <div
              className="carousel-images"
              // style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              style={{ transform: `translateX(-${currentIndex1 * 420}px)` }} // Adjust transform value
            >
             {GalleryImage.map((item, index) => {
                        const imageUrl = `${instance().baseURL}/static${item.url}`;
                        console.log('Image URL:', imageUrl); // Log the image URL to the console
                        return (
                            <div key={index} className="carousel-image-container">
                                <img
                                    src={imageUrl}
                                    alt={`carousel-img${index}`}
                                    className="carousel-image"
                                    // Hide broken images
                                />
                                <div className="description">{item.description}</div>
                            </div>
                        );
                    })}
            </div>
          </div>
          <button className="carousel-button2 right" onClick={nextImage1}>
            &gt;
          </button>
        </div>
      </div>

      {/* ------------advertisement section -------------------------------------------------------------------------------------*/}

      <div className="avatisement-Border2">
        <div className="avatisement-Content2">
          {/* <img src={adImg} alt="" className="avatisement-Image" id='advertise-img' /> */}
          <div className="advertisement-Scroll2">
            {ad.map((img, index) => (
              <img
                src={img}
                alt={`ad-${index}`}
                className="advertisement-Image"
                key={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* <div className="footer"></div> */}
      {showTour == "true" && (
        <TourGuide run={runTour} callback={handleJoyrideCallback} />
      )}
    </div>
  );
};

export default Landing;
