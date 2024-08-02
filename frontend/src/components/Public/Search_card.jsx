import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Search_card.css";
import PublicHeader from "../../common/PublicHeader.jsx";
import image from "../../assets/Anan_vihar.jpg";
import axiosHttpClient from "../../utils/axios.js";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import No_Data_icon from "../../assets/No_Data.png";
import { Link } from "react-router-dom";
import { encryptData } from "../../utils/encryptData.js";
import ShimmerUI from "./Search_Card/ShimmerUI.jsx";
import instance from "../../../env.js";
import dummyimage from "../../assets/dummyBlankImage.png"


function Search_Card() {
  const location = useLocation();
  const [givenReq, setGivenReq] = useState("");
  const [parkData, setParkData] = useState([]);
  const [playGroundData, setPlayGroundData] = useState([]);
  const [multipurposeData, setMultipurposeData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [greenWaysData, setGreenWaysData] = useState([]);
  const [blueWaysData, setBlueWaysData] = useState([]);
  const navigate = useNavigate();
  const defaultCenter = { latitude: 20.2961, longitude: 85.8245 };
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [range, setRange] = useState(30); // by default range is set to 30km radius to search data'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state

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

  // function to search all facilities and events according to search query
  async function searchFacilityData(givenReq) {
    try {
      let res = await axiosHttpClient("OVERALL_SEARCH_DATA_API", "post", {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        range,
        givenReq: givenReq,
      });
      console.log("response of filter api", res.data);
      setParkData(res.data.parkData || []);
      setPlayGroundData(res.data.playgroundData || []);
      setMultipurposeData(res.data.multipurposeData || []);
      setEventsData(res.data.eventData || []);
      setGreenWaysData(res.data.greenwayData || []);
      setBlueWaysData(res.data.bluewayData || []);

      console.log("total parks are  :", parkData.length);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    let queryParams = new URLSearchParams(location.search).get("query");
    console.log("queryParams", queryParams);
    setGivenReq(queryParams);
    setUserGeoLocation();
    searchFacilityData(queryParams);
  }, []);

  //For Park
  const [currentIndex1, setCurrentIndex1] = useState(0);
  const nextImage1 = () => {
    if (currentIndex1 < parkData.length - 3) {
      setCurrentIndex1(currentIndex1 + 1);
    }
  };
  const prevImage1 = () => {
    if (currentIndex1 > 0) {
      setCurrentIndex1(currentIndex1 - 1);
    }
  };

  //For Play ground
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const nextImage2 = () => {
    if (currentIndex2 < playGroundData.length - 3) {
      setCurrentIndex2(currentIndex2 + 1);
    }
  };
  const prevImage2 = () => {
    if (currentIndex2 > 0) {
      setCurrentIndex2(currentIndex2 - 1);
    }
  };

  //For Multipurpose ground
  const [currentIndex3, setCurrentIndex3] = useState(0);
  const nextImage3 = () => {
    if (currentIndex3 < playGroundData.length - 3) {
      setCurrentIndex3(currentIndex3 + 1);
    }
  };
  const prevImage3 = () => {
    if (currentIndex3 > 0) {
      setCurrentIndex3(currentIndex3 - 1);
    }
  };

  //For events
  const [currentIndex4, setCurrentIndex4] = useState(0);
  const nextImage4 = () => {
    if (currentIndex4 < playGroundData.length - 3) {
      setCurrentIndex4(currentIndex4 + 1);
    }
  };
  const prevImage4 = () => {
    if (currentIndex4 > 0) {
      setCurrentIndex4(currentIndex4 - 1);
    }
  };
  //For greenWays
  const [currentIndex5, setCurrentIndex5] = useState(0);
  const nextImage5 = () => {
    if (currentIndex5 < playGroundData.length - 3) {
      setCurrentIndex5(currentIndex5 + 1);
    }
  };
  const prevImage5 = () => {
    if (currentIndex5 > 0) {
      setCurrentIndex5(currentIndex5 - 1);
    }
  };
  //For events
  const [currentIndex6, setCurrentIndex6] = useState(0);
  const nextImage6 = () => {
    if (currentIndex6 < playGroundData.length - 3) {
      setCurrentIndex6(currentIndex6 + 1);
    }
  };
  const prevImage6 = () => {
    if (currentIndex6 > 0) {
      setCurrentIndex2(currentIndex6 - 1);
    }
  };

  const sections = [
    {
      title: "Parks",
      data: parkData,
      currentIndex: currentIndex1,
      prevImage: prevImage1,
      nextImage: nextImage1,
    },
    {
      title: "Play Ground",
      data: playGroundData,
      currentIndex: currentIndex2,
      prevImage: prevImage2,
      nextImage: nextImage2,
    },
    {
      title: "Multipurpose Ground",
      data: multipurposeData,
      currentIndex: currentIndex3,
      prevImage: prevImage3,
      nextImage: nextImage3,
    },
    {
      title: "Events",
      data: eventsData,
      currentIndex: currentIndex4,
      prevImage: prevImage4,
      nextImage: nextImage4,
    },
    {
      title: "Greenways",
      data: greenWaysData,
      currentIndex: currentIndex5,
      prevImage: prevImage5,
      nextImage: nextImage5,
    },
    {
      title: "Blueways",
      data: blueWaysData,
      currentIndex: currentIndex6,
      prevImage: prevImage6,
      nextImage: nextImage6,
    },
  ];
  
  // sections.sort((a, b) => (b.data.length > 0 ? 1 : 0) - (a.data.length > 0 ? 1 : 0));
  const filteredSections = sections.filter(section => section.data.length > 0);

  return (
    <div>
      <PublicHeader />
      {/* Parks................................................. */}
      {filteredSections.map((section, index) => (
      <div className="w" key={index}>
        <div className="galleryTitleLeft2">
          <div className="greenHeader2"></div>
          <h1>{section.title}</h1>
        </div>
        {loading ? (
          <ShimmerUI />
        ) : section.data.length > 0 ? (
          <div className="carousel">
            <button className="carousel-button2 left" onClick={section.prevImage}>
              &lt;
            </button>
            <div className="carousel-container">
              <div
                className="carousel-images"
                style={{ width: 'auto', transform: `translateX(-${section.currentIndex * 420}px)` }} // Adjust transform value
              >
                {section.data.map((d, i) => (
                  
                  <div
                    className="park-card"
                    key={i}
                    onClick={() => {
                      navigate(
                        `/Sub_Park_Details?facilityId=${encryptData(d.facilityId)}&action=view`
                      );
                    }}
                  >
                    <img className="Card_img"
                
                    src={`${instance().baseURL}/static${d.url}`} alt={"image"} /> {/* Updated to use imageURL from data */}
                    <div className="card_text">
                      <span className="Name_location">
                        <h2 className="park_name">{d.facilityname}</h2>
                        <h3 className="park_location">{d.address}</h3>

                      </span>
                      <span className="Avil_Dis">
                        <button className="Available">Available</button>
                        <h3 className="distance">
                          {parseFloat(d.distance).toFixed(2)} km(s)
                        </h3>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="carousel-button2 right" onClick={section.nextImage}>
              &gt;
            </button>
          </div>
        ) : (
          <div>No data</div>
        )}
      </div>
    ))}
    </div>
  );
}



export default Search_Card;
