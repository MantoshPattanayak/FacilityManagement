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
import { GoogleMap, Marker, InfoWindowF, Circle } from "@react-google-maps/api";
import axiosHttpClient from "../../utils/axios";
import park_logo from "../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_PARKS.svg";
import playground_logo from "../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_PLAYFIELDS.svg";
import mp_ground_logo from "../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_MPGROUNDS.svg";
import greenway from "../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_GREENWAYS.svg";
import Blueway from "../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_BLUEWAYS.svg";
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
import cricket_bg from "../../assets/mid-section-of-wicketkeeper.png";
import cricket_1 from "../../assets/circket222111.png";
import walking_img from "../../assets/jogging.png";
import football_bg from "../../assets/FootballBackground.jpg";
import football_1 from "../../assets/FootballFront.jpg";
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
import No_data_nearBy from "../../assets/Near_Data_No_Found.png";
// here import Park Image
import PublicHeader from "../../common/PublicHeader.jsx";
// Location icon and image all types of image---------------------------------------------
import Yoga_img from "../../assets/Yoga_img.png";
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
import { toast, ToastContainer } from "react-toastify";
import lading_page_image1 from "../../assets/landing.jpg";
import lading_page_image2 from "../../assets/landing2.jpg";
import laidng5 from "../../assets/landing4.jpg";
import lading4 from "../../assets/landing5.jpg";
import lading6 from "../../assets/landing3.jpg";
import walking_front_image from "../../assets/WalkingFront.jpg";
import walking_back_image from "../../assets/WalkingBackground.jpg";
import bas_backend from "../../assets/Basket_bg.jpg";
import bas_front_page from "../../assets/BasketFront.jpg";
import football_bas_backend from "../../assets/FootballBackground.jpg";
import football_bas_front_page from "../../assets/FootballFront.jpg";
import Open_gym_front from "../../assets/GymFront.jpg";
import bg_gym from "../../assets/GymBackground.jpg";
// import "./YourStyles.css";
// here set the image of lading page
const backGround_images = [
  lading_page_image1,
  lading_page_image2,
  lading4,
  laidng5,
  lading6,
];

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
  // const apiKey = "AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao";
  const defaultCenter = { lat: 20.2961, lng: 85.8245 };
  const [userLocation, setUserLocation] = useState(
    defaultCenter || JSON.parse(sessionStorage.getItem("location"))
  );
  const [nearbyParks, setNearbyParks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  let navigate = useNavigate();
  //set auto-suggest facilties
  const [inputFacility, setInputFacility] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [currentIndexBg, setCurrentIndexBg] = useState(0);
  // here Gallery Image -------------------------------
  const [GalleryImage, setGalleryImage] = useState([]);
  // show live location ----

  // set loader-------------------------------------------
  const [loading, setLoading] = useState(false); // Add loading state
  // --------------Explore new Activities-------------------------------------------------------------
  // State to keep track of the selected activity
  const [selectedActivity, setSelectedActivity] = useState(0);
  let dispatch = useDispatch();
  const marqueeRef = useRef(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  // for nearby facilities section
  const [radiusForSearch, setRadiusForSearch] = useState([1, 2, 4]);
  const [distanceRange, setDistanceRange] = useState(radiusForSearch[0]);
  const [activeButton, setActiveButton] = useState(radiusForSearch[0]);
  // for google maps
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const language = useSelector(
    (state) =>
      state.language.language || localStorage.getItem("language") || "EN"
  );

  const handleTogglePlayPause = () => {
    if (isMarqueePaused) {
      marqueeRef.current.start();
    } else {
      marqueeRef.current.stop();
    }
    setIsMarqueePaused(!isMarqueePaused);
  };

  const [exploreNewActivities, setExploreNewActivities] = useState([]);
  const [currentImage, setCurrentImage] = useState(); //background Image of explore new activity
  const [currentInnerImage, setCurrentInnerImage] = useState(); // Top inner image

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
  async function fetchAutoSuggestData(inputValue) {
    try {
      let response = await axiosHttpClient("AUTO_SUGGEST_OVERALL_API", "post", {
        givenReq: inputValue,
      });

      console.log("auto suggest facility data", response.data);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error(error);
    }
  }

  // function to manage API calls while user search input entry
  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  const debouncedFetchFunction = useCallback(
    debounce(fetchAutoSuggestData, 1000),
    []
  );

  // call auto suggest API after a delay to prevent quick API call on input entry
  useEffect(() => {
    if (inputFacility != "" || inputFacility != null)
      debouncedFetchFunction(inputFacility);
  }, [inputFacility, debouncedFetchFunction]);

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
      console.log("here Notification ", resLanding.data.notificationsList);
      setGalleryImage(resLanding.data.galleryData);
      let modifiedData = handleExploreActivitiesData(
        resLanding.data.exploreActivities
      );
      setExploreNewActivities(
        modifiedData.sort((a, b) =>
          a.game.toLowerCase().localeCompare(b.game.toLowerCase())
        )
      );
      modifiedData = modifiedData.sort((a, b) =>
        a.game.toLowerCase().localeCompare(b.game.toLowerCase())
      );
      handleGameClick(0, modifiedData[0].game);
      setSelectedActivity(0);
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

  // function to fetch user current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation(defaultCenter); // Fallback to default center
          setLoading(false);
        }
      );
    } else {
      setUserLocation(defaultCenter);
      console.error("Geolocation is not supported by this browser");
      setLoading(false);
    }
  }, []);

  const setUserGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User position:", position);
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
        }
      );
    } else {
      setUserLocation(defaultCenter);
      console.error("Geolocation is not supported by this browser");
      // toast.error("Location permission not granted.");
    }
  };

  // here Get Near By data --------------------
  async function getNearbyFacilities() {
    setLoading(true); // Start loading
    let bodyParams = {
      givenReq: givenReq,
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
      setmapdata(
        res.data.data.sort((a, b) => {
          return a.distance - b.distance;
        })
      );
    } catch (error) {
      console.error(error);
      // toast.error("Location permission not granted.");
    } finally {
      setLoading(false); // Stop loading
    }
  }
  /// remove (Clean map load)
  // useEffect(() => {
  //   // Cleanup Google Maps script on unmount or when component reloads
  //   return () => {
  //     if (window.google && window.google.maps) {
  //       const script = document.querySelector(`script[src*="maps.googleapis.com"]`);
  //       if (script) {
  //         script.parentNode.removeChild(script);
  //       }
  //       window.google.maps = null;
  //     }
  //   };
  // }, []);
  // const handleMapLoad = () => {
  //   // The map is fully loaded, now we can fetch nearby facilities
  //   getNearbyFacilities();
  // };

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

  // useEffect Update NearBy data ------------------------------------
  useEffect(() => {
    console.log("userLocation, distanceRange, facilityTypeId", {
      userLocation,
      distanceRange,
      facilityTypeId,
    });
    if (userLocation && distanceRange && facilityTypeId) {
      getNearbyFacilities();
    }
  }, [userLocation, distanceRange, facilityTypeId]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 575);

  // useEffect(() => {
  //   const mediaQuery = window.matchMedia("(max-width: 575px)");

  //   const handleMediaQueryChange = (e) => {
  //     setIsMobile(e.matches);
  //   };

  //   mediaQuery.addListener(handleMediaQueryChange);

  //   return () => {
  //     mediaQuery.removeListener(handleMediaQueryChange);
  //   };
  // }, []);

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
    const locationDetails = mapdata.find(
      (location) => location.facilityId === facilityId
    );
    setSelectedLocationDetails(locationDetails);
    setSelectedParkId(facilityId);
  };
  // Mark Live location Name ---

  const [selectedButton, setSelectedButton] = useState(1);
  // Function to handle setting facility type ID and updating search input value ---------------------------
  const handleParkLogoClick = (typeid) => {
    setSelectedButton(typeid);
    setFacilityTypeId(typeid); // Set facility ex typeid-1,typeid-2,typeid-3
    console.log("here type id", typeid);
    // getNearbyFacilities();
  };
  // here Handle for encrpt the data------------------------------------------
  // here Funcation to encrotDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }
  // here Update the data-----------------------------------------------
  useEffect(() => {}, [givenReq, facilityTypeId, showTour, language]);

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
    if (activity === "Jogging/Walking") {
      setCurrentInnerImage(walking_front_image);
      setCurrentImage(walking_back_image);
    } else if (activity === "Jogging") {
      setCurrentInnerImage(walking_front_image);
      setCurrentImage(walking_back_image);
    } else if (activity === "Football") {
      setCurrentInnerImage(football_bas_front_page);
      setCurrentImage(football_bas_backend);
    } else if (activity === "Open Gym") {
      setCurrentInnerImage(Open_gym_front);
      setCurrentImage(bg_gym);
    } else if (activity === "Gym") {
      setCurrentInnerImage(Open_gym_front);
      setCurrentImage(bg_gym);
    } else if (activity === "Gym") {
      setCurrentInnerImage(Open_gym_front);
      setCurrentImage(bg_gym);
    } else if (activity === "Basketball") {
      setCurrentImage(bas_backend);
      setCurrentInnerImage(bas_front_page);
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
  //------- Advatisemant -----------
  // const ad = [ad1, ad1, ad2, ad3, ad1, ad1, ad2, ad3, ad1, ad1, ad2, ad3, ad1, ad1, ad2, ad3,
  //   ad1, ad1, ad2, ad3, ad1, ad1, ad2, ad3, ad1, ad1, ad2, ad3, ad1, ad1, ad2, ad3
  // ];
  const ad = [];
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

  //function to seek confirmation
  function handleExternalLinkOpen(e, url) {
    e.preventDefault();
    toast.dismiss();
    console.log("handle external link");
    // Disable interactions with the background
    // document.querySelectorAll('body')[0].style.pointerEvents = 'none';
    // document.querySelectorAll('body')[0].style.opacity = 0.4;

    toast.warn(
      <div>
        <p>
          <b>
            You will be redirected to an external link. Are you sure to proceed
            ?
          </b>
          <br />
          These links are being provided as a convenience and for informational
          purposes only.
        </p>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Re-enable interactions with the background
              document.querySelectorAll("body")[0].style.pointerEvents = "auto";
              document.querySelectorAll("body")[0].style.opacity = 1;
              toast.dismiss();
            }}
            className="bg-red-400 text-white p-2 border rounded-md"
          >
            No
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(url, "_blank"); // Open the link in a new tab
              // Re-enable interactions with the background
              document.querySelectorAll("body")[0].style.pointerEvents = "auto";
              document.querySelectorAll("body")[0].style.opacity = 1;
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
          document.body.style.pointerEvents = "auto";
        },
      }
    );
    return;
  }

  // dropdown

  const [selectedButton21, setSelectedButton21] = useState(null);

  const handleSelectChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedButton21(selectedValue);
    handleParkLogoClick21(selectedValue);
  };

  const handleParkLogoClick21 = (id) => {
    setSelectedButton21(id);
    // Add any additional logic you need when an option is selected
  };

  return (
    <div className="landingcontainer">
      <section className="bg-img" style={styles}>
        <PublicHeader />
        {/* <ToastContainer /> */}
        <div className="iconPlayApple">
          <a
            onClick={(e) =>
              handleExternalLinkOpen(e, instance().GOOGLE_APP_LINK)
            }
            rel="noopener noreferrer"
          >
            <img
              className="iconPlayAppleItem"
              src={googlePlayStore}
              alt="Google Play Store"
            />
          </a>
          <a
            onClick={(e) =>
              handleExternalLinkOpen(e, instance().APP_STORE_LINK)
            }
            rel="noopener noreferrer"
          >
            <img
              className="iconPlayAppleItem"
              src={appleStore}
              alt="Apple Store"
            />
          </a>
        </div>
        {/*----------------- Landing Page contant -----------------------------------------------------------------------*/}
        <div className="landing-page_contant">
          <span className="Search-Conatiner">
            <div className="Search-conatiner-name">
            <h1>
              {language == "EN" && "AMA BHOOMI!"}
              {language == "OD" && "ଆମ ଭୂମି କୁ ସ୍ଵାଗତ!"}
            </h1>
            <span className="about">
              <p className="about_text">
                {language == "EN" && (
                  <>
                    Assuring Mass Access through Bhubaneswar Open <br></br>
                    Spaces & Ownership Management Initiative.<br></br>
                    {/* Bhubaneswar’s path-breaking initiative to empower residents <br></br> 
                    to take ownership, shape, & manage open spaces in the city… <br></br>
                    where every corner will be a thriving hub of activity, connection, and nature. */}
                  </>
                )}
                {language == "OD" && (
                  <>
                    ଭୁବନେଶ୍ୱର ଖୋଲା ସ୍ଥାନରେ ମାଲିକାନା ଏବଂ ପରିଚାଳନା ପଦକ୍ଷେପ
                    ମାଧ୍ୟମରେ ଜନ ପ୍ରବେଶକୁ ନିଶ୍ଚିତ କରିବା। <br></br>
                    {/* ଭୁବନେଶ୍ୱରର ଏକ ଉଲ୍ଲେଖନୀୟ ପଦକ୍ଷେପ ଯାହାକି ସହରରେ ଥିବା ଖୋଲା ସ୍ଥାନଗୁଡିକର ମାଲିକାନା ନେବା,<br></br> 
                    ଏହାକୁ ନୂତନ ଆକାର ଦେବା, ତଥା ଏହାର ପରିଚାଳନା ପାଇଁ ସ୍ଥାନୀୟ ବାସିନ୍ଦାଙ୍କୁ ସଶକ୍ତ କରିବ...<br></br> 
                    ଯେଉଁଠି ପ୍ରତ୍ୟେକ କୋଣ ଅନୁକୋଣ କାର୍ଯ୍ୟକଳାପ, ସଂଯୋଗ ତଥା ପ୍ରକୃତିର ଏକ ସମୃଦ୍ଧ ସଙ୍ଗମ ହେବ। */}
                  </>
                )}
              </p>
            </span>
            </div>
            <span className="enjoy_text">
              <p className="about_text">
                {language == "EN" &&
                  "Your one stop destination for Bhubaneswar’s Open Spaces!"}
                {language == "OD" &&
                  "ଭୁବନେଶ୍ୱରର ଖୋଲା ସ୍ଥାନ ଗୁଡ଼ିକ ପାଇଁ ଆପଣଙ୍କର ଏକମାତ୍ର ଗନ୍ତବ୍ୟସ୍ଥଳ!"}
              </p>
              <h4>
                {language == "EN" && "JOIN THE MOVEMENT"}
                {language == "OD" &&
                  "ଆନ୍ଦୋଳନରେ ଯୋଗ ଦିଅନ୍ତୁ, ନିଜର ସହରକୁ ପୁନରୁଦ୍ଧାର କରନ୍ତୁ!"}
              </h4>
            </span>

            <a href="/ama-bhoomi/login-signup" className="Reg_text">
              <h1>
                {language == "EN" && "REGISTER TO AVAIL THE BENEFITS"}
                {language == "OD" &&
                  "ସମସ୍ତ ସୁବିଧା ଗୁଡ଼ିକ ପାଇବା ପାଇଁ ନିଜକୁ ପଞ୍ଜିକରଣ କରନ୍ତୁ।"}
              </h1>
            </a>

            <h2 className="typing-animation">
              {language == "EN" && "Explore, Book and Enjoy Open Spaces"}
              {language == "OD" &&
                "ଖୋଲା ସ୍ଥାନଗୁଡିକ ଏକ୍ସପ୍ଲୋର୍ କରନ୍ତୁ, ବୁକ୍ କରନ୍ତୁ ଏବଂ ଉପଭୋଗ କରନ୍ତୁ!"}
            </h2>
            <div className="wrapper-search-suggestion">
              <div className="input-wrapper">
                <div className="search-bar-wrapper">
                  <input
                    ref={searchInputRef}
                    className="search-bar"
                    type="text"
                    name="search"
                    placeholder={
                      language == "EN"
                        ? "Search by Name and Location"
                        : language == "OD"
                        ? "ନାମ ଏବଂ ଅବସ୍ଥାନ ଅନୁଯାୟୀ ସନ୍ଧାନ କରନ୍ତୁ"
                        : ""
                    }
                    value={inputFacility}
                    autoComplete="off"
                    onChange={handleInputFacility}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="search-icon">
                    <FontAwesomeIcon icon={faSearch} className="os-icon" />
                  </div>
                </div>
              </div>

              {suggestions?.length > 0 && inputFacility && (
                <ul className="suggestions1">
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={(e) =>
                          navigate(
                            `/Search_card?query=${encodeURIComponent(
                              suggestion
                            )}`
                          )
                        }
                      >
                        {suggestion}
                      </li>
                    ))
                  ) : (
                    <li>No suggestions available</li>
                  )}
                </ul>
              )}
            </div>
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
              <h2>Playfields</h2>
            </div>
          </Link>
          <Link
            to={{
              pathname: "/facilities",
              search: `?facilityTypeId=${encryptDataId(3)}`,
            }}
          >
            <div className="iconLogo1">
              {/* mp_ground_logo */}
              <img src={mp_ground_logo} alt="" />
              <h2>Multipurpose Grounds</h2>
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
      {/* ------------GOOGLE MAP Container----------------------------------------------------------------------------*/}
      <div className="map-parentContainer">
        {/* --------//google map ------------------------------------------------------------------------------- */}
        <section className="map-container2">
          <div className="map-bar">
            <div className="map-icons">
              <select
                className="facilitySelecterHome"
                name="facility"
                onChange={(e) => {
                  handleParkLogoClick(parseInt(e.target.value));
                }}
              >
                <option value={1}>Parks</option>
                <option value={2}>Playfields</option>
                <option value={3}>Multipurpose grounds</option>
                <option value={4}>Blueways</option>
                <option value={5}>Greenways</option>
              </select>

              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(1)}
                >
                  <img src={park_logo} alt="" />
                </button>
                {selectedButton === 1 ? (
                  <h2 className="text1selected">Parks</h2>
                ) : (
                  <h2 className="text1">Parks</h2>
                )}
              </div>
              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(2)}
                >
                  <img src={playground_logo} alt="" />
                </button>
                {selectedButton === 2 ? (
                  <h2 className="text1selected">Playfields</h2>
                ) : (
                  <h2 className="text1">Playfields</h2>
                )}
              </div>
              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(3)}
                >
                  <img src={mp_ground_logo} alt="" />
                </button>
                {selectedButton === 3 ? (
                  <h2 className="text2selected">Multipurpose Grounds</h2>
                ) : (
                  <h2 className="text2">Multipurpose Grounds</h2>
                )}
              </div>
              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(5)}
                >
                  <img src={greenway} alt="" />
                </button>
                {selectedButton === 5 ? (
                  <h2 className="text1selected">Greenways</h2>
                ) : (
                  <h2 className="text1">Greenways</h2>
                )}
              </div>
              <div className="icon1">
                <button
                  className="icon1_button"
                  onClick={() => handleParkLogoClick(4)}
                >
                  <div>
                    <img src={Blueway} alt="" />
                  </div>
                </button>
                {selectedButton === 4 ? (
                  <div>
                    <h2 className="text1selected">Blueways</h2>
                  </div>
                ) : (
                  <div>
                    <h2 className="text1">Blueways</h2>
                  </div>
                )}
              </div>
            </div>

            <div className="mapSearchContainer">
              <div className="mapSearchButton">
                <input
                  type="text"
                  placeholder="Please Enter the Location or Facility"
                  name="givenReq"
                  id="givenReq"
                  value={givenReq}
                  onChange={handleChange}
                  className="mapSearchInput"
                />
                <button
                  type="button"
                  className="mapSearchSubmit"
                  onClick={getNearbyFacilities}
                >
                  <FontAwesomeIcon icon={faSearch} className="os-icon" />
                </button>
              </div>
            </div>
          </div>
          {loadError ? (
            <div>Error loading maps</div>
          ) : !isLoaded ? (
            <div>Loading Maps...</div>
          ) : (
            <GoogleMap
              mapContainerStyle={{
                height: "450px",
                width: "100%",
              }}
              center={{
                lat: userLocation.latitude || userLocation.lat,
                lng: userLocation.longitude || userLocation.lng,
              }}
              zoom={12}
              // onLoad={handleMapLoad} // Call handleMapLoad when the map is loaded
            >
              {loading ? (
                <div>Loading...</div>
              ) : (
                userLocation && (
                  <Circle
                    center={{
                      lat: userLocation.latitude || userLocation.lat,
                      lng: userLocation.longitude || userLocation.lng,
                    }}
                    radius={250} // Radius in meters
                    options={{
                      fillColor: "red",
                      fillOpacity: 0.2,
                      strokeColor: "blue",
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                    }}
                  />
                )
              )}
              {/* Render markers */}
              {mapdata.map((location, index) => (
                <Marker
                  key={index}
                  position={{ lat: location.latitude, lng: location.longitude }}
                  onClick={() => handleMarkerClick(location.facilityId)} // Call handleMarkerClick function with facilityId when marker is clicked
                />
              ))}
              {/* Show InfoWindow for selected location */}
              {selectedLocationDetails && (
                <InfoWindowF
                  // key={selectedLocationDetails.facilityId}
                  position={{
                    lat: selectedLocationDetails.latitude,
                    lng: selectedLocationDetails.longitude,
                  }}
                  onCloseClick={() => {
                    setSelectedLocationDetails(null);
                  }}
                >
                  <div key={selectedLocationDetails.facilityId}>
                    <h3>
                      Facility Name: {selectedLocationDetails.facilityname}
                    </h3>
                    <p>Address: {selectedLocationDetails.address}</p>
                    <p>
                      Distance:{" "}
                      {parseFloat(selectedLocationDetails.distance).toFixed(2)}{" "}
                      km(s) (approx.)
                    </p>
                    <p>
                      Status:{" "}
                      <span
                        className={`${
                          selectedLocationDetails.status == "open"
                            ? "text-green-500 font-semibold"
                            : "text-red-500 font-semibold"
                        }`}
                      >
                        {selectedLocationDetails.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          )}
        </section>

        {/* --------Facilities Near me----------------------------------------------------- */}
        <div className="nearByFacilities">
          <div className="nearByFacilities-heading">
            {selectedButton === 1 && <h1>&nbsp; Parks Near Me</h1>}
            {selectedButton === 2 && <h1>&nbsp; Playfields Near Me</h1>}
            {selectedButton === 3 && (
              <h1>&nbsp; Multipurpose Grounds Near Me</h1>
            )}
            {selectedButton === 5 && <h1>&nbsp; Greenways Near Me</h1>}
            {selectedButton === 4 && <h1>&nbsp; Blueways Near Me</h1>}
            <div className="nearByFacilities-buttons">
              {radiusForSearch.map((radius) => {
                return (
                  <button
                    type="button"
                    className={activeButton === radius ? "active" : ""}
                    onClick={() => {
                      setDistanceRange(radius);
                      setActiveButton(radius);
                    }}
                  >
                    {radius}km
                  </button>
                );
              })}
              {/* <button
                type="button"
                className={activeButton === 10 ? "active" : ""}
                onClick={() => {
                  setDistanceRange(10);
                  setActiveButton(10);
                }}
              >
                10km
              </button>
              <button
                type="button"
                className={activeButton === 20 ? "active" : ""}
                onClick={() => {
                  setDistanceRange(20);
                  setActiveButton(20);
                }}
              >
                20km
              </button>
              <button
                type="button"
                className={activeButton === 40 ? "active" : ""}
                onClick={() => {
                  setDistanceRange(40);
                  setActiveButton(40);
                }}
              >
                40km
              </button> */}
            </div>
          </div>
          <div className="facility-list-map overflow-y-scroll">
            {loading ? (
              <div className="custom-loader"></div>
            ) : nearbyParks?.length > 0 ? (
              nearbyParks?.map((park, index) => (
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
              ))
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
          <button className="what_new">
            {language == "EN" && "What's New"}
            {language == "OD" && "ନୂଆ ସମ୍ବାଦ"}
          </button>
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
                    {diffInDays <= 100 && <span className="New_text">New</span>}
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

          <div className="button-container22">
            {isMarqueePaused ? (
              <button
                className="Play_pause_icon"
                onClick={handleTogglePlayPause}
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
            ) : (
              <button
                className="Play_pause_icon"
                onClick={handleTogglePlayPause}
              >
                <FontAwesomeIcon icon={faPause} />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* ------Event details card-------------------------------------------------------------------- */}
      <div className="EventContainerlanding">
        <div className="galleryTitle">
          <div className="galleryTitleLeft">
            <div className="greenHeader"></div>
            <h1 className="">
              {language == "EN" && "Current Events"}
              {language == "OD" && "ବର୍ତ୍ତମାନ କାର୍ଯ୍ୟକ୍ରମ"}
            </h1>
          </div>
          {eventNameLanding.length > 0 ? (
            <button className="viewMoreGallery">
              <Link to="/events">View All</Link>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          ) : (
            <></>
          )}
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
                        src={
                          event.eventMainImage
                            ? instance().baseURL +
                              "/static" +
                              event.eventMainImage
                            : Yoga_img
                        }
                        onError={(e) => {
                          e.target.onerror = null; // Prevents looping
                          e.target.src = Yoga_img;
                        }}
                        alt="Yoga Event"
                      ></img>
                      <div className="carousel-slide-text">
                        <h1 className="Name_yoga2">{event.eventName}</h1>
                        <div className="carousel-slide-location">
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            style={{ color: "#cc7a68" }}
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
      {exploreNewActivities?.length > 0 && (
        <div
          className="exploreNewAct-Parent-Container"
          style={{
            backgroundImage: `   linear-gradient(10deg, rgba(0, 0, 0, 1.6), rgba(0, 0, 0, 0.5)), url(${currentImage})`,
          }}
        >
          <div className="exploreNewAct-Header">
            <div className="whiteHeader"></div>
            <h1>
              {language == "EN" && "Explore And Book"}
              {language == "OD" && "ଏକ୍ସପ୍ଲୋର୍ ଏବଂ ବୁକ୍ କରନ୍ତୁ"}
            </h1>
          </div>
          {exploreNewActivities.length > 0 ? (
            <div className="exploreNewAct-outer">
              {/* Mapping through the exploreNewActivities data */}
              <div className="exploreNewAct-firstDiv">
                {exploreNewActivities.map((activity, index) => (
                  <button
                    key={index}
                    className={`activity  ${
                      selectedActivity === index ? "selected" : ""
                    }`}
                    onClick={() => handleGameClick(index, activity.game)} // Set selected activity on click
                  >
                    {activity.game}
                  </button>
                ))}
              </div>
              <div className="image-secondDiv">
                <img
                  className="Current_explore_event_image"
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
          ) : (
            <div className="no-data-message_Current_event1">
              {/* <img
              className="Current_Event_image"
              src={No_Current_Event_img}
              alt="No events"
            ></img> */}
            </div>
          )}
        </div>
      )}
      {/* -------------Gallery section----------------------------------------------------------------------------------------------- */}
      <div className="galleryOuter">
        <div className="galleryTitle">
          <div className="galleryTitleLeft">
            <div className="greenHeader"></div>
            <h1>
              {language == "EN" && "Gallery"}
              {language == "OD" && "ଗ୍ୟାଲେରୀ"}
            </h1>
          </div>
          {GalleryImage.length > 0 ? (
            <div className="viewMoreGallery">
              <Link to={"/View_Gallery/Image_Gallery"}>View All</Link>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          ) : (
            <></>
          )}
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
                // console.log("Image URL:", imageUrl); // Log the image URL to the console
                return (
                  <div className="carousel-main_container">
                    <div key={index} className="carousel-image-container">
                      <img
                        src={imageUrl}
                        alt={`carousel-img${index}`}
                        className="carousel-image_gallery"
                        // Hide broken images
                      />
                      <div className="description">{item.description}</div>
                    </div>
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

      {ad.length > 0 && (
        <div className="avatisement-Border2">
          <div className="galleryTitleLeft">
            <div className="greenHeader"></div>
            <h1 className="text-3xl">Advertisement</h1>
          </div>
          <div className="avatisement-Content2">
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
      )}

      {/* <div className="footer"></div> */}
      {showTour == "true" && (
        <TourGuide run={runTour} callback={handleJoyrideCallback} />
      )}
      <ToastContainer />
    </div>
  );
};

export default Landing;
