import './Landing.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axiosHttpClient from '../../utils/axios';
import park_logo from "../../assets/park-logo.png";
import playground_logo from "../../assets/playground-logo.png";
import mp_ground_logo from "../../assets/multipurpose-ground-logo.png";
import galleryImg from "../../assets/gallery1.png"
import adImg from "../../assets/ad.png"
import Footer from "../../common/Footer.jsx"
import badminton from "../../assets/explore new activity badminton.png";
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
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

const Landing = () => {
    const [mapdata, setmapdata] = useState([])
    const [selectedParkId, setSelectedParkId] = useState(null);
    const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
    const [givenReq, setGivenReq] = useState(null);
    const [facilityTypeId, setFacilityTypeId] = useState(1);
    const apiKey = 'AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao';
    const defaultCenter = { lat: 20.2961, lng: 85.8245 };
    let randomKey=Math.random();

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
 const handleMarkerClick = (parkId) => {
    setSelectedParkId(parkId); // Set selected parkId
    const location = mapdata.find(location => location.parkId === parkId);
    setSelectedLocationDetails(location); // Set selected location details

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





















    //for event Cards
    const containerRef = useRef(null);

    // --------------Explore new Activities-------------------------------------------------------------
    // State to keep track of the selected activity
    const [selectedActivity, setSelectedActivity] = useState(null);

    const exploreNewActivies = [
        {
            game: 'Tennis',
            parks: ['Buddha JAyanti Park', 'Buddha JAyanti Park', 'Buddha JAyanti Park', 'Buddha JAyanti Park']
        },
        {
            game: 'Cricket',
            parks: ['Buddha JAyanti Park', 'Buddha JAyanti Park', 'IG Park']
        },
        {
            game: 'Football',
            parks: ['Buddha JAyanti Park', 'Buddha JAyanti Park', 'Gopabandhu Park']
        },
        {
            game: 'Yoga',
            parks: ['Buddha JAyanti Park']
        }
    ];

    const handleGameClick = (index) => {
        setSelectedActivity(index === selectedActivity ? null : index);
    };



    return (
        <div className='landingcontainer'>
            <section className="bg-img">
                <PublicHeader />
             
                {/*----------------- Landing Page contant -----------------------------------------------------------------------*/}

                <div className='landing-page_contant'>
                    <span className='Search-Conatiner'>
                        <h1>AMA BHOOMI</h1>
                        <span className='about'>
                            <p className='about_text'>Ama Bhoomi stands for Assuring mass Access through BHubaneswar Open Spaces <br></br>and Ownership Management Initiative. </p>
                        </span>
                        <h2 className='typing-animation'>Explore, Book and  Enjoy Open Spaces </h2>
                        <input className='search-bar' type='text' name="search" placeholder="Search by Name and Location"></input>
                       
                    </span>

                </div>
            </section>

            {/* ----------Logo sticker------------------------------------------------------------------------ */}

            <div className="logo-section">
                <div className="logos">
                     <Link
                            to={{ 
                               pathname: '/facilities',
                              search: `?facilityTypeId=${encryptDataId(1 )}`
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
                        <h2>Waterways</h2>
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
                                <img  src={park_logo} alt="" />
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
                            mapContainerStyle={{ height: '400px', width: '100%' }}
                            center={defaultCenter}
                            zoom={12}
                        >
                            {/* Render markers */}
                            {mapdata.map((location, index) => (
                                <Marker
                                    key={index}
                                    position={{ lat: location.latitude, lng: location.longitude }}
                                    onClick={() => handleMarkerClick(location.parkId)} // Call handleMarkerClick function with parkId when marker is clicked
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
                                                <h3>Park Name:{selectedLocationDetails.parkName}</h3>
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
                            <button type="button">2km</button>
                            <button type="button">4km</button>
                            <button type="button">6km</button>
                        </div>
                    </div>

                    <div className="facililiy-list-map">
                        <div className="map-facilities">
                            <p>Buddha Jayanti park</p>
                        </div>
                        <div className="map-facilities">
                            <p>IG park</p>
                        </div>
                        <div className="map-facilities">
                            <p>Buddha Jayanti park</p>
                        </div>
                        <div className="map-facilities">
                            <p>Buddha Jayanti park</p>
                        </div>
                        <div className="map-facilities">
                            <p>Buddha Jayanti park</p>
                        </div>
                        <div className="map-facilities">
                            <p>Buddha Jayanti park</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* -----Whats New Section------------------------------------------- */}

            <div className="notice2">
                <div class="notice2-container">
                    <span>Whats New</span>
                    <marquee behavior="" direction="left">Today, the Honorable Chief Minister, Mrs. Naveen Patnaik, will inaugurate a new open park at Old Town,  
                 "Join us for the grand opening of our new park! "  </marquee>
                </div>
            </div>


            {/* ------Event details card-------------------------------------------------------------------- */}

            <div className="Event_Available_main_conatiner">
                <h1 className="Service_text">Event Available</h1>
                <div className="Sub_Park_Details">
                    <div className="carousel-container" ref={containerRef}>
                        <div className="carousel-slide2">
                            <img className="Yoga_image" src={Yoga_img}></img>
                            <div className="carousel-slide-text">
                                <h1 className="Name_yoga">National Yoga Day Celebration</h1>
                                <div className='carousel-slide-location'>
                                    <FontAwesomeIcon icon={faSearch} className="os-icon" />
                                    <h1>Buddha jayanti Park, Lumbini Vihar, Bhubaneswar</h1>
                                </div>
                                <span className="Yoga_date_time">
                                    <h1 className="Yoga_date">22 Mar 2024</h1>
                                    <h1 className="Yoga_time">7:00 AM - 10:00AM</h1>
                                </span>
                            </div>
                        </div>
                        <div className="carousel-slide2">
                            <img className="Yoga_image" src={Yoga_img}></img>
                            <div className="carousel-slide-text">
                                <h1 className="Name_yoga">National Yoga Day Celebration</h1>
                                <div className='carousel-slide-location'>
                                    <FontAwesomeIcon icon={faSearch} className="os-icon" />
                                    <h1>Buddha jayanti Park, Lumbini Vihar, Bhubaneswar</h1>
                                </div>
                                <span className="Yoga_date_time">
                                    <h1 className="Yoga_date">22 Mar 2024</h1>
                                    <h1 className="Yoga_time">7:00 AM - 10:00AM</h1>
                                </span>
                            </div>
                        </div>
                        <div className="carousel-slide2">
                            <img className="Yoga_image" src={Yoga_img}></img>
                            <div className="carousel-slide-text">
                                <h1 className="Name_yoga">National Yoga Day Celebration</h1>
                                <div className='carousel-slide-location'>
                                    <FontAwesomeIcon icon={faSearch} className="os-icon" />
                                    <h1>Buddha jayanti Park, Lumbini Vihar, Bhubaneswar</h1>
                                </div>
                                <span className="Yoga_date_time">
                                    <h1 className="Yoga_date">22 Mar 2024</h1>
                                    <h1 className="Yoga_time">7:00 AM - 10:00AM</h1>
                                </span>
                            </div>
                        </div>
                        <div className="carousel-slide2">
                            <img className="Yoga_image" src={Yoga_img}></img>
                            <div className="carousel-slide-text">
                                <h1 className="Name_yoga">National Yoga Day Celebration</h1>
                                <div className='carousel-slide-location'>
                                    <FontAwesomeIcon icon={faSearch} className="os-icon" />
                                    <h1>Buddha jayanti Park, Lumbini Vihar, Bhubaneswar</h1>
                                </div>
                                <span className="Yoga_date_time">
                                    <h1 className="Yoga_date">22 Mar 2024</h1>
                                    <h1 className="Yoga_time">7:00 AM - 10:00AM</h1>
                                </span>
                            </div>
                        </div>
                        <div className="carousel-slide2">
                            <img className="Yoga_image" src={Yoga_img}></img>
                            <div className="carousel-slide-text">
                                <h1 className="Name_yoga">National Yoga Day Celebration</h1>
                                <div className='carousel-slide-location'>
                                    <FontAwesomeIcon icon={faSearch} className="os-icon" />
                                    <h1>Buddha jayanti Park, Lumbini Vihar, Bhubaneswar</h1>
                                </div>
                                <span className="Yoga_date_time">
                                    <h1 className="Yoga_date">22 Mar 2024</h1>
                                    <h1 className="Yoga_time">7:00 AM - 10:00AM</h1>
                                </span>
                            </div>
                        </div>
                        <div className="carousel-slide2">
                            <img className="Yoga_image" src={Yoga_img}></img>
                            <div className="carousel-slide-text">
                                <h1 className="Name_yoga">National Yoga Day Celebration</h1>
                                <div className='carousel-slide-location'>
                                    <FontAwesomeIcon icon={faSearch} className="os-icon" />
                                    <h1>Buddha jayanti Park, Lumbini Vihar, Bhubaneswar</h1>
                                </div>
                                <span className="Yoga_date_time">
                                    <h1 className="Yoga_date">22 Mar 2024</h1>
                                    <h1 className="Yoga_time">7:00 AM - 10:00AM</h1>
                                </span>
                            </div>
                        </div>
                        <div className="carousel-slide2">
                            <img className="Yoga_image" src={Yoga_img}></img>
                            <div className="carousel-slide-text">
                                <h1 className="Name_yoga">National Yoga Day Celebration</h1>
                                <div className='carousel-slide-location'>
                                    <FontAwesomeIcon icon={faSearch} className="os-icon" />
                                    <h1>Buddha jayanti Park, Lumbini Vihar, Bhubaneswar</h1>
                                </div>
                                <span className="Yoga_date_time">
                                    <h1 className="Yoga_date">22 Mar 2024</h1>
                                    <h1 className="Yoga_time">7:00 AM - 10:00AM</h1>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/*------------ Explore new activities----------- */}

            <div className="exploreNewAct-Parent-Container">
                <div className="exploreNewAct-Header">
                    <div className="whiteHeader"></div>
                    <h1>Explore New Activities</h1>
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
                            <img  className='h-80' src={badminton} alt="" />
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

            <div className="Event_Available_main_conatiner">
                <h1 className="Service_text">Gallery</h1>
                <div className="Sub_Park_Details">
                    <div className="carousel-container">
                        <div className="carousel-slide3"><div className="overlay">
                            <img className="Gallery_image" src={galleryImg} ></img>
                            <div class="overlay-text">Your text description here</div>
                        </div>
                        </div>

                        <div className="carousel-slide3"><div className="overlay">
                            <img className="Gallery_image" src={galleryImg} ></img>
                            <div class="overlay-text">Your text description here</div>
                        </div>
                        </div>

                        <div className="carousel-slide3"><div className="overlay">
                            <img className="Gallery_image" src={galleryImg} ></img>
                            <div class="overlay-text">Your text description here</div>
                        </div>
                        </div>

                        <div className="carousel-slide3"><div className="overlay">
                            <img className="Gallery_image" src={galleryImg} ></img>
                            <div class="overlay-text">Your text description here</div>
                        </div>
                        </div>

                        <div className="carousel-slide3"><div className="overlay">
                            <img className="Gallery_image" src={galleryImg} ></img>
                            <div class="overlay-text">Your text description here</div>
                        </div>
                        </div>

                        <div className="carousel-slide3"><div className="overlay">
                            <img className="Gallery_image" src={galleryImg} ></img>
                            <div class="overlay-text">Your text description here</div>
                        </div>
                        </div>

                        <div className="carousel-slide3"><div className="overlay">
                            <img className="Gallery_image" src={galleryImg} ></img>
                            <div class="overlay-text">Your text description here</div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* ------------Avatisement section -------------------------------------------------------------------------------------*/}

            <div className="avatisement-Border">
                <div className="avatisement-Content">
                    <img src={adImg} alt="" className="avatisement-Image" />
                </div>
            </div>


            <div className="footer">
                <Footer />
            </div>

        </div>
    )
}

export default Landing;