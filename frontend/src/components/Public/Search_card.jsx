import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Search_card.css";
import PublicHeader from "../../common/PublicHeader.jsx";
import image from "../../assets/Anan_vihar.jpg";
import axiosHttpClient from "../../utils/axios.js";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import No_Data_icon from "../../assets/No_Data.png";
import { Link } from "react-router-dom";
function Search_Card() {
  const location = useLocation();
  const [givenReq, setGivenReq] = new URLSearchParams(location.search).get(
    "query"
  );
  const [parkData, setParkData] = useState([]);
  const [playGroundData, setPlayGroundData] = useState([]);
  const [multipurposeData, setMultipurposeData] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "10%",
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
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

  async function searchFacilityData() {
    try {
      let res = await axiosHttpClient(
        "overall_search_map_data",
        "get",
        {},
        givenReq
      );
      console.log("response of filter api", res.data);
      setParkData(res.data.parkData);
      setPlayGroundData(res.data.playgroundData);
      setMultipurposeData(res.data.multipurposeData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    searchFacilityData();
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
          <Slider {...settings}>
            {parkData.map((d, index) => (
              <div className="park-card" key={d.name}>
                <Link
                  key={d.name}
                  to={{
                    pathname: "/Sub_Park_Details",
                    search: `?facilityId=${encryptDataId(
                      d.facilityId
                    )}&action=view`,
                  }}
                  className="park-card"
                ></Link>
                <img className="Card_img" src={image} alt="Park" />
                <div className="card_text">
                  <span className="Name_location">
                    <h2 className="park_name">{d.facilityname}</h2>
                    <h3 className="park_location">{d.address}</h3>
                  </span>
                  <span className="Avil_Dis">
                    <button className="Available">Available</button>
                    <h3 className="distance">10 km(s)</h3>
                  </span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Play grounds.................................................  */}
      <div className="w">
        <div className="heading-text">
          <p>Play grounds</p>
        </div>
        <div className="mt-20">
          <Slider {...settings}>
            {playGroundData?.map((d, index) => (
              <div className="park-card" key={d.name}>
                <img className="Card_img" src={image} alt="Park" />
                <div className="card_text">
                  <span className="Name_location">
                    <h2 className="park_name">{d.facilityname}</h2>
                    <h3 className="park_location">{d.address}</h3>
                  </span>
                  <span className="Avil_Dis">
                    <button className="Available">Available</button>
                    <h3 className="distance">10 km(s)</h3>
                  </span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* For Events........................................................ */}
      <div className="w">
        <div className="heading-text">
          <p>Multipurpose Ground</p>
        </div>
        <div className="mt-20">
          <Slider {...settings}>
            {multipurposeData.length > 0 ? (
              multipurposeData.map((d) => (
                <div className="park-card" key={d.ownership}>
                  <img className="Card_img" src={image} alt="Park" />
                  <div className="card_text">
                    <span className="Name_location">
                      <h2 className="park_name">{d.name}</h2>
                      <h3 className="park_location">Baramunda, Bhubaneswar</h3>
                    </span>
                    <span className="Avil_Dis">
                      <button className="Available">Available</button>
                      <h3 className="distance">10 km(s)</h3>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-message">
                {/* Conditionally render based on some condition */}
                <img src={No_Data_icon} alt="No Data Found" />
              </div>
            )}
          </Slider>
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
