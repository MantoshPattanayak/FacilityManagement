import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Search_card.css';
import PublicHeader from "../../common/PublicHeader.jsx";
import image from '../../assets/Anan_vihar.jpg';

function Search_Card() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, 
    centerMode: true,
    centerPadding: '10%', 
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
          centerPadding: '15%', 
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '25%', 
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '25%', 
        }
      }
    ]
  };

  return (
    <div>
      <PublicHeader />
      {/* Parks................................................. */}
      <div className='w'>
        <div className="heading-text">
          <p>Parks</p>
        </div>
        <div className="mt-20">
          <Slider {...settings}>
            {data.map((d) => (
              <div className="park-card" key={d.name}>
                <img className="Card_img" src={image} alt="Park" />
                <div className="card_text">
                  <span className="Name_location">
                    <h2 className="park_name">Ananda Bana</h2>
                    <h3 className="park_location">Baramunda, Bhubaneswar</h3>
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
      <div className='w'>
        <div className="heading-text">
          <p>Play grounds</p>
        </div>
        <div className="mt-20">
          <Slider {...settings}>
            {data.map((d) => (
              <div className="park-card" key={d.name}>
                <img className="Card_img" src={image} alt="Park" />
                <div className="card_text">
                  <span className="Name_location">
                    <h2 className="park_name">Ananda Bana</h2>
                    <h3 className="park_location">Baramunda, Bhubaneswar</h3>
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
      <div className='w'>
        <div className="heading-text">
          <p>Events</p>
        </div>
        <div className="mt-20">
          <Slider {...settings}>
            {data.map((d) => (
              <div className="park-card" key={d.name}>
                <img className="Card_img" src={image} alt="Park" />
                <div className="card_text">
                  <span className="Name_location">
                    <h2 className="park_name">Ananda Bana</h2>
                    <h3 className="park_location">Baramunda, Bhubaneswar</h3>
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
    </div>
  );
}

const data = [
  {
    name: `Alok Murmu`,
    img: `/students/John_Morgan.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  },
  {
    name: `Suraj Majhi`,
    img: `/students/Ellie_Anderson.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  },
  {
    name: `Akay Sharma`,
    img: `/students/Nia_Adebayo.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  },
  {
    name: `Sunny Naik`,
    img: `/students/Rigo_Louie.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  },
  {
    name: `Matru Prashad`,
    img: `/students/Mia_Williams.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  },
];

export default Search_Card;
