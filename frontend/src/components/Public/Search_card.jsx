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
function Search_Card() {
  const location = useLocation();
  const [givenReq, setGivenReq] = useState("");
  const [parkData, setParkData] = useState([]);
  const [playGroundData, setPlayGroundData] = useState([]);
  const [multipurposeData, setMultipurposeData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const navigate = useNavigate();
  const defaultCenter = { latitude: 20.2961, longitude: 85.8245 };
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [range, setRange] = useState(30); // by default range is set to 30km radius to search data'

  
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: "10%",
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          centerMode: true,
          centerPadding: "15%",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "25%",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "25%",
        },
      },
    ],
  };

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

  return (
    <div>
      <PublicHeader />
      {/* Parks................................................. */}
      <div className="w">
        <div className="heading-text">
          <p>Parks</p>
        </div>
        <div className="mt-20">
          {parkData.length > 0 && (
            <Slider {...settings}>
              {parkData?.map((d, index) => (
                <div
                  className="park-card "
                  key={index + 1}
                  onClick={(e) => {
                    navigate(
                      `/Sub_Park_Details?facilityId=${encryptData(
                        d.facilityId
                      )}&action=view`
                    );
                  }}
                >
                  <img className="Card_img" src={image} alt="Park" />
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
            </Slider>
          )}
          {parkData.length == 0 && (
            <div className="no-data-message flex justify-center w-[100%]">
              {/* Conditionally render based on some condition */}
              <img src={No_Data_icon} alt="No Data Found" />
            </div>
          )}
        </div>
      </div>

      {/* Play grounds.................................................  */}
      <div className="w">
        <div className="heading-text">
          <p>Play grounds</p>
        </div>
        <div className="mt-20">
          {playGroundData.length > 0 && (
            <Slider {...settings}>
              {playGroundData?.map((d, index) => (
                <div
                  className="park-card"
                  key={index + 1}
                  onClick={(e) => {
                    navigate(
                      `/Sub_Park_Details?facilityId=${encryptData(
                        d.facilityId
                      )}&action=view`
                    );
                  }}
                >
                  <img className="Card_img" src={image} alt="Park" />
                  <div className="card_text">
                    <span className="Name_location">
                      <h2 className="park_name">{d.facilityname}</h2>
                      <h3 className="park_location">{d.address}</h3>
                    </span>
                    <span className="Avil_Dis">
                      <button className="Available">Available</button>
                      <h3 className="distance">{d.distance} km(s)</h3>
                    </span>
                  </div>
                </div>
              ))}
            </Slider>
          )}
          {playGroundData.length == 0 && (
            <div className="no-data-message flex justify-center w-[100%]">
              {/* Conditionally render based on some condition */}
              <img src={No_Data_icon} alt="No Data Found" />
            </div>
          )}
        </div>
      </div>

      {/* For Events........................................................ */}
      <div className="w">
        <div className="heading-text">
          <p>Multipurpose Ground</p>
        </div>
        <div className="mt-20">
          {multipurposeData.length > 0 ? (
            <Slider {...settings}>
              {multipurposeData.length > 0 &&
                multipurposeData.map((d) => (
                  <div
                    className="park-card"
                    key={index + 1}
                    onClick={(e) => {
                      navigate(
                        `/Sub_Park_Details?facilityId=${encryptData(
                          d.facilityId
                        )}&action=view`
                      );
                    }}
                  >
                    <img className="Card_img" src={image} alt="Park" />
                    <div className="card_text">
                      <span className="Name_location">
                        <h2 className="park_name">{d.name}</h2>
                        <h3 className="park_location">
                          Baramunda, Bhubaneswar
                        </h3>
                      </span>
                      <span className="Avil_Dis">
                        <button className="Available">Available</button>
                        <h3 className="distance">10 km(s)</h3>
                      </span>
                    </div>
                  </div>
                ))}
            </Slider>
          ) : (
            <div className="no-data-message flex justify-center w-[100%]">
              {/* Conditionally render based on some condition */}
              <img src={No_Data_icon} alt="No Data Found" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const data = [
  {
    name: `Alok Murmu`,
    img: `/students/John_Morgan.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  {
    name: `Suraj Majhi`,
    img: `/students/Ellie_Anderson.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  {
    name: `Akay Sharma`,
    img: `/students/Nia_Adebayo.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  {
    name: `Sunny Naik`,
    img: `/students/Rigo_Louie.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  {
    name: `Matru Prashad`,
    img: `/students/Mia_Williams.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
];

export default Search_Card;
