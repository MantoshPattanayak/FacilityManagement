import './Landing.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axiosHttpClient from '../../utils/axios';
import park_logo from "../../assets/park-logo.png";
import playground_logo from "../../assets/playground-logo.png";
import mp_ground_logo from "../../assets/multipurpose-ground-logo.png";
import adImg from "../../assets/Park_near_Utkal.png"
import galleryImg1 from "../../assets/Gallery_Anant Vihar Park,Phase-3,DDC Park_Pokhariput.jpg";
import galleryImg2 from "../../assets/Gallery_BDA Children's Park.jpg";
import galleryImg3 from "../../assets/Gallery_Disabled Friendly Park_Saheed Nagar.jpg";
import galleryImg4 from "../../assets/Gallery_Kelucharan_Park-5.jpg";
import galleryImg5 from "../../assets/Gallery_Madhusudan_Park.jpg";
import galleryImg6 from "../../assets/Gallery_Mukharjee_Park.jpg";
import galleryImg7 from "../../assets/Gallery_Prachi Park_Damana.jpg";
import galleryImg8 from "../../assets/Gallery_Sundarpada_BDA Colony Park.jpg";
import badminton from "../../assets/explore new activity badminton.png";
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import anan_image from "../../assets/Anan_vihar.jpg"
// here import Park Image



import PublicHeader from '../../common/PublicHeader.jsx';

// Location icon and image all types of image---------------------------------------------
// import Location_icon from "../../../assets/Location_goggle_icon-removebg-preview.png"
// import Park_img from "../../../assets/park_img1.jpg"
import Yoga_img from "../../assets/Yoga_img.png";
import greenway from "../../assets/Greenway.png"
import Blueway from "../../assets/blueways.png"

// import blueWays_logo from "../../assets/ama_bhoomi_blueways_logo.jpeg";
// import greenWays_logo from "../../assets/ama_bhoomi_greenways.jpeg";
// import here encpty js ----------------------------------
// Import here to encrptData ------------------------------------------
import { Link, useNavigate } from 'react-router-dom';
// import { encryptData } from "../../../utils/encryptData"
import { encryptData } from '../../utils/encryptData';
import { formatDate, formatDateYYYYMMDD, formatTime } from '../../utils/utilityFunctions.js';
// import for slider


const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};



const Landing = () => {
  const [mapdata, setmapdata] = useState([])
  const [selectedParkId, setSelectedParkId] = useState(null);
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  const [givenReq, setGivenReq] = useState('');
  const [facilityTypeId, setFacilityTypeId] = useState(1);
  const [eventNameLanding, setEventNameLanding] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const apiKey = 'AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao';
  const defaultCenter = { lat: 20.2961, lng: 85.8245 };
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [nearbyParks, setNearbyParks] = useState([]);
  const [distanceRange, setDistanceRange] = useState(2);
  let randomKey = Math.random();
  let navigate = useNavigate();


  async function fetchLandingPageData() {
    try {
      let resLanding = await axiosHttpClient('LandingApi', 'get');
      console.log('Here is the Landing Page API data', resLanding.data);
      setEventNameLanding(resLanding.data.eventDetailsData);
      setNotifications(resLanding.data.notificationsList);
      console.log(resLanding.data.notificationsList);
      console.log("bla blab bla", resLanding.data.eventDetailsData)
    }
    catch (error) {
      console.error("Error fetching the Landing Page API data: ", error);
    }
  }


  useEffect(() => {
    fetchLandingPageData();
    setUserGeoLocation();
  }, []);

  useEffect(() => {
    getNearbyFacilities();
  }, [userLocation, distanceRange, facilityTypeId])


  // here Fetch the data -----------------------------------------------
  async function fecthMapData() {
    try {
      let res = await axiosHttpClient('View_Park_Data', 'post', {
        givenReq: givenReq,
        facilityTypeId: facilityTypeId
      });

      console.log("here get data", res)
      setmapdata(res.data.data)

    }
    catch (err) {
      console.log(" here error", err)
    }
  }

  // function to fetch user current location
  function setUserGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          sessionStorage.setItem('location', JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation(defaultCenter);
          // sessionStorage.setItem('location', JSON.stringify(location));
          // Handle error, e.g., display a message to the user
        }
      );
    } else {
      setUserLocation(defaultCenter);
      console.error('Geolocation is not supported by this browser');
      toast.error('Location permission not granted.');
    }
    return;
  }

  async function getNearbyFacilities() {
    let bodyParams = {
      facilityTypeId: facilityTypeId,
      latitude: userLocation?.latitude || defaultCenter?.lat,
      longitude: userLocation?.longitude || defaultCenter?.lng,
      range: distanceRange
    };
    console.log('body params', bodyParams);

    try {
      let res = await axiosHttpClient('VIEW_NEARBY_PARKS_API', 'post', bodyParams);
      console.log(res.data.message, res.data.data.sort((a, b) => { return a.distance - b.distance }));
      setNearbyParks(res.data.data.sort((a, b) => { return a.distance - b.distance }));
    }
    catch (error) {
      console.error(error);
      toast.error('Location permission not granted.')
    }
  }


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
    const location = mapdata.find(location => location.facilityId === facilityId);
    setSelectedLocationDetails(location); // Set selected location details
    console.log(location);
  };
  // Function to handle setting facility type ID and updating search input value ---------------------------
  const handleParkLogoClick = (typeid) => {
    setFacilityTypeId(typeid) // Set facility ex typeid-1,typeid-2,typeid-3
    console.log("here type id", typeid)
    fecthMapData()

  };
  // here Handle for encrpt the data------------------------------------------
  // here Funcation to encrotDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  // here Update the data-----------------------------------------------
  useEffect(() => {
    fecthMapData()
  }, [givenReq, facilityTypeId])

  //-------------for event Cards---------------------------------------
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const events = [
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM",
      link: "/Sub_Park_Details"
    },
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM"
    },
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM"
    },
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM"
    },
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM"
    },
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM"
    },
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM"
    },
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM"
    },
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM"
    },
    {
      imgSrc: Yoga_img,
      name: "National Yoga Day Celebration",
      location: "Buddha jayanti Park, Lumbini Vihar, Bhubaneswar",
      date: "22 Mar 2024",
      time: "7:00 AM - 10:00AM"
    },

  ]

  // const handleEventClick = (link, event) => {
  //   event.preventDefault();
  //   window.location.href = link
  // };


  // useEffect(() => {
  //   // animations added to current events section
  //   const container = containerRef.current;
  //   const cards = container.querySelectorAll('.eventCard');

  //   const cardWidth = cards[0].offsetWidth;
  //   const firstCardClone = cards[0].cloneNode(true);
  //   container.appendChild(firstCardClone);

  //   const totalWidth = (cards.length + 1) * cardWidth;
  //   container.style.width = totalWidth + 'px';

  //   function startScrollAnimation() {
  //     container.style.animation = 'scroll 55s linear infinite';
  //   }

  //   container.addEventListener('mouseenter', startScrollAnimation);

  //   container.addEventListener('animationiteration', () => {
  //     container.style.animation = 'none';
  //     setTimeout(startScrollAnimation, 0);
  //   });

  //   // search functionality for user input in the field
  //   const searchInput = searchInputRef.current;
  //   searchInput.addEventListener('keypress', (e) => {
  //     let inputVal;
  //     if(e.key === 'Enter') {
  //       inputVal = searchInput.value;
  //       navigate(`/facilities?givenReq=${inputVal}`);
  //     }
  //   });

  //   return () => {
  //     container.removeEventListener('mouseenter', startScrollAnimation);
  //     container.removeEventListener('animationiteration', () => {
  //       container.style.animation = 'none';
  //       setTimeout(startScrollAnimation, 0);
  //     });
  //   };
  // }, []);

  // --------------Explore new Activities-------------------------------------------------------------
  // State to keep track of the selected activity
  const [selectedActivity, setSelectedActivity] = useState(null);

  const exploreNewActivies = [
    {
      game: 'Tennis',
      parks: ['Kalinga Stadium', 'Saheed Nagar Sports Complex']
    },
    {
      game: 'Cricket',
      parks: ['Ruchika High School, Unit - 6', 'Saheed Nagar Sports Complex']
    },
    {
      game: 'Football',
      parks: ['Kalinga Stadium', 'Bhubaneswar Footbal Academy', 'BJB Nagar Field']
    },
    {
      game: 'Yoga',
      parks: ['Buddha Jayanti Park', 'Acharya Vihar Colony Park']
    }
  ];



  // handleGameClick ------------------------------------------------

  const handleGameClick = (index) => {
    setSelectedActivity(index === selectedActivity ? null : index);
  };

  //Gallery section

  const images = [
    {
      img: galleryImg1,
      desc: `Anant Vihar Park,Phase-3, DDC Park, Pokhariput`
    },
    {
      img: galleryImg2,
      desc: `BDA Children's Park`
    },
    {
      img: galleryImg3,
      desc: `Disabled Friendly Park, Saheed Nagar`
    },
    {
      img: galleryImg4,
      desc: `Kelucharan Park-5`
    },
    {
      img: galleryImg5,
      desc: `Madhusudan Park`
    },
    {
      img: galleryImg6,
      desc: `Mukharjee Park`
    },
    {
      img: galleryImg7,
      desc: `Prachi Park, Damana`
    },
    {
      img: galleryImg8,
      desc: `BDA Colony Park, Sundarpada`
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0);
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


  // const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? galleryData.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === galleryData.length - 1 ? 0 : prevIndex + 1));
  };

  //function to navigate user to facility details page
  function handleNavigateForNearbyPark(e, facilityId) {
    navigate(`/Sub_Park_Details?facilityId=${encryptDataId(facilityId)}`);
  }


  //------- Advatisemant -----------

  const ad = [
    adImg,
    adImg,
    adImg,
    adImg,
    adImg
  ];




  return (
    <div className='landingcontainer'>
      <section className="bg-img">
        <PublicHeader />

        {/*----------------- Landing Page contant -----------------------------------------------------------------------*/}

        <div className='landing-page_contant'>
          <span className='Search-Conatiner'>
            <h1>AMA BHOOMI</h1>
            <span className='about'>
              <p className='about_text'>AMA BHOOMI stands for Assuring Mass Access through BHubaneswar Open Spaces <br></br>and Ownership Management Initiative. </p>
            </span>
            <h2 className='typing-animation'>Explore, Book and  Enjoy Open Spaces </h2>
            <input ref={searchInputRef} className='search-bar' type='text' name="search" placeholder="Search by Name and Location"></input>

          </span>

        </div>
      </section>

      {/* ----------Logo sticker------------------------------------------------------------------------ */}

      <div className="logo-section">
        <div className="logos">
          <Link
            to={{
              pathname: '/facilities',
              search: `?facilityTypeId=${encryptDataId(1)}`
            }}
          >
            <div className="icon">
              <img src={park_logo} alt="" />
              <h2>Parks</h2>
            </div>
          </Link>


          <Link
            to={{
              pathname: '/facilities',
              search: `?facilityTypeId=${encryptDataId(2)}`
            }}
          >
            <div className="icon">
              <img src={playground_logo} alt="" />
              <h2>Playgrounds</h2>
            </div>
          </Link>
          <Link
            to={{
              pathname: '/facilities',
              search: `?facilityTypeId=${encryptDataId(3)}`
            }}
          >
            <div className="icon">
              <img src={mp_ground_logo} alt="" />
              <h2>Multipurpose Grounds</h2>
            </div>
          </Link>

          <div className="icon">
            <img src={greenway} alt="" />
            <h2>Greenways</h2>
          </div>
          <div className="icon">
            <img src={Blueway} alt="" />
            <h2>Blueways</h2>
          </div>
        </div>
      </div>


      {/* -------------GOOGLE MAP Container----------------------------------------------------------------------------*/}

      <div className="map-parentContainer">

        {/* --------//google map ------------------------------------------------------------------------------- */}

        <section className="map-container2">
          <div className='map-bar'>
            <div className="map-icons">
              <div class="icon1">
                <button onClick={() => handleParkLogoClick(1)}>
                  <img src={park_logo} alt="" />
                  <h2 className='text1'>Parks</h2>
                </button>

              </div>
              <div class="icon1">
                <button onClick={() => handleParkLogoClick(2)}>
                  <img src={playground_logo} alt="" />
                  <h2 className='text1'>Playgrounds</h2>
                </button>

              </div>
              <div class="icon1">
                <button onClick={() => handleParkLogoClick(3)}>
                  <img src={mp_ground_logo} alt="" />
                  <h2 className='text1'>Multipurpose Grounds</h2>
                </button>

              </div>
              <div class="icon1">
                <button onClick={() => handleParkLogoClick(4)}>
                  <img src={greenway} alt="" />
                  <h2 className='text1'>Greenways</h2>
                </button>

              </div>
              <div class="icon1">
                <button onClick={() => handleParkLogoClick(5)}>
                  <img src={Blueway} alt="" />
                  <h2 className='text1'>Waterways</h2>
                </button>

              </div>
            </div>


            <div className="mapSearchButton">
              <input type='text' placeholder='Please Enter the Location '
                name="givenReq"
                id="givenReq"
                value={givenReq}
                onChange={handleChange}
              ></input>
              <button type='button' onClick={fecthMapData}>
                <FontAwesomeIcon icon={faSearch} className="os-icon" />
              </button>
            </div>

          </div>

          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={{ height: '400px', width: '100%', ...(isMobile && { height: '280px' }) }}
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
                  position={{ lat: selectedLocationDetails.latitude, lng: selectedLocationDetails.longitude }} // Position the InfoWindow at the selected location
                  onCloseClick={() => { setSelectedParkId(null); setSelectedLocationDetails(null) }}
                >
                  {
                    selectedParkId ?
                      <div>
                        <h3>Park Name:{selectedLocationDetails.facilityname}</h3>
                      </div>
                      : ''
                  }
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
              <button type="button" onClick={(e) => { setDistanceRange(2); }}>2km</button>
              <button type="button" onClick={(e) => { setDistanceRange(4); }}>4km</button>
              <button type="button" onClick={(e) => { setDistanceRange(6); }}>6km</button>
            </div>
          </div>

          <div className="facililiy-list-map overflow-y-scroll">
            {
              nearbyParks?.length > 0 ? nearbyParks?.map((park, index) => {
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
                )
              })
                : (facilityTypeId != 1 || facilityTypeId != 2) ? <div>Coming soon.</div> : <div>No data</div>
            }
            {/* <div className="map-facilities">
              <p>BMC Park</p>
            </div>
            <div className="map-facilities">
              <p>IG park</p>
            </div>
            <div className="map-facilities">
              <p>G.L Colony Park</p>
            </div>
            <div className="map-facilities">
              <p>Kharvela Park</p>
            </div>
            <div className="map-facilities">
              <p>Nicco Park</p>
            </div>
            <div className="map-facilities">
              <p>Badagada Village Park</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* -----Whats New Section------------------------------------------- */}

      <div className="notice2">
        <div class="notice2-container">
          <span>Whats New</span>
          <marquee behavior="" direction="left">
            <div className='flex'>
              {notifications.map((notification) => {
                return <p>{notification.publicNotificationsContent} &nbsp; &nbsp;</p>
              })}
            </div>
            {/* Today, the Honorable Chief Minister, Mrs. Naveen Patnaik, will inaugurate a new open park at Old Town,
            "Join us for the grand opening of our new park! "   */}
          </marquee>
        </div>
      </div>


      {/* ------Event details card-------------------------------------------------------------------- */}

      <div className="EventContainerlanding">
        <div className="EventContainerTitle">
          <div className="greenHeader"></div>
          <h1>Current Events</h1>
        </div>

        {/* .........Card section scroll using carousel ..........*/}

        <div className="carousel">
          <button className="carousel-button left" onClick={prevImage}>&lt;</button>
          <div className="carousel-container">
            <div
              className="carousel-images"
              // style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              style={{ transform: `translateX(-${currentIndex * (420)}px)` }}  // Adjust transform value
            >


              {eventNameLanding.length > 0 && eventNameLanding.map((event, index) => (

                <Link key={index} className="carousel-slide2" to={"/events-details?eventId=" + `${encryptData(event.eventId)}`}>
                  <img className="Yoga_image2" src={Yoga_img} alt="Yoga Event"></img>
                  <div className="carousel-slide-text">
                    <h1 className="Name_yoga2">{event.eventName}</h1>
                    <div className='carousel-slide-location'>
                      {/* <FontAwesomeIcon icon={faSearch} className="os-icon" /> */}
                      <FontAwesomeIcon icon={faLocationDot} style={{ color: "#504f4e", }} className="os-icon" />
                      <h1>{event.locationName}</h1>
                    </div>
                    <span className="Yoga_date_time2">
                      {/* <h1 className={`Yoga_date2 ${event.status == "ACTIVE" ? "text-green-500" : "text-red-500"}`}>{event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}</h1> */}
                      <h1 className="Yoga_date2">{formatDate(event.eventDate)}</h1>
                      <h1 className="Yoga_time2">{formatTime(event.eventStartTime)} - {formatTime(event.eventEndTime)}</h1>
                    </span>
                  </div>
                </Link>


              ))}


              {/* {images.map((image, index) => (
                <img key={index} src={image.img} alt={`carousel-img-${index}`} className="carousel-image" />
              ))} */}
            </div>
          </div>
          <button className="carousel-button right" onClick={nextImage}>&gt;</button>
        </div>

      </div>


      {/*------------ Explore new activities----------- */}

      <div className="exploreNewAct-Parent-Container">
        <div className="exploreNewAct-Header">
          <div className="whiteHeader"></div>
          <h1>Explore New Activities And Book</h1>
        </div>
        <div className='exploreNewAct-outer'>



          {/* Mapping through the exploreNewActivities data */}
          <div className="exploreNewAct-firstDiv">
            {exploreNewActivies.map((activity, index) => (
              <button
                key={index}
                className={`activity ${selectedActivity === index ? 'selected' : ''}`}
                onClick={() => handleGameClick(index)} // Set selected activity on click
              >
                {activity.game}
              </button>
            ))}
          </div>
          <div className="image-secondDiv">
            <img className='h-80' src={badminton} alt="" />
            <div className="exploreNewAct-secondDiv">
              {exploreNewActivies.map((activity, index) => (
                selectedActivity === index && (
                  <div className="parkList" key={index}>
                    {activity.parks.map((park, idx) => (
                      <div className="parkItem" key={idx}>
                        <p>{park}</p>
                        <button className="bookButton">Book</button>
                        <FontAwesomeIcon icon={faBookmark} className="bookmarkIcon" />
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          </div>




        </div>

      </div>

      {/* -------------Gallery section----------------------------------------------------------------------------------------------- */}

      <div className="galleryOuter">
        <div className="galleryTitle">
          <div className="greenHeader"></div>
          <h1>Gallery</h1>
        </div>

        <div className="carousel">
          <button className="carousel-button left" onClick={prevImage}>&lt;</button>
          <div className="carousel-container">
            <div
              className="carousel-images"
              // style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              style={{ transform: `translateX(-${currentIndex * (420)}px)` }}  // Adjust transform value
            >
              {images.map((image, index) => (
                <div key={index} className="carousel-image-container">
                  <img src={image.img} alt={`carousel-img-${index}`} className="carousel-image" />
                  <div className="description">{image.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="carousel-button right" onClick={nextImage}>&gt;</button>
        </div>

      </div>







      {/* ------------advertisement section -------------------------------------------------------------------------------------*/}

      <div className="avatisement-Border2">
        <div className="avatisement-Content2">
          {/* <img src={adImg} alt="" className="avatisement-Image" id='advertise-img' /> */}
          <div className="advertisement-Scroll2">
            {ad.map((img, index) => (
              <img src={img} alt={`ad-${index}`} className="advertisement-Image" key={index} />
            ))}
          </div>
        </div>
      </div>


      <div className="footer">


      </div>

    </div>
  )
}

export default Landing;