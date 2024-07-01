import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Search_card.css';
import PublicHeader from "../../common/PublicHeader.jsx";


function Search_Card() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <div>
      <PublicHeader/>
    <div className='w'>
      <div className="heading-text">
        <p>Parks</p>
      </div>
      <div className="mt-20">
        <Slider {...settings}>
          {data.map((d) => (
            <div key={d.name} className="custom-card">
              <div className='custom-header'>
                <img src={d.img} alt="" className="custom-image"/>
              </div>
              <div className="custom-content">
                <p className="custom-name">{d.name}</p>
                <p className="custom-review">{d.review}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div> 

     {/* playgrounds.............................. */}
    <div className='w'>
      <div className="heading-text">
        <p>Playgrounds</p>
      </div>
      <div className="mt-20">
        <Slider {...settings}>
          {data.map((d) => (
            <div key={d.name} className="custom-card">
              <div className='custom-header'>
                <img src={d.img} alt="" className="custom-image"/>
              </div>
              <div className="custom-content">
                <p className="custom-name">{d.name}</p>
                <p className="custom-review">{d.review}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>

    {/* Multi Purpose Playgrounds....................... */}
    <div className='w'>
      <div className="heading-text">
        <p>Multi Purpose Playgrounds</p>
      </div>
      <div className="mt-20">
        <Slider {...settings}>
          {data.map((d) => (
            <div key={d.name} className="custom-card">
              <div className='custom-header'>
                <img src={d.img} alt="" className="custom-image"/>
              </div>
              <div className="custom-content">
                <p className="custom-name">{d.name}</p>
                <p className="custom-review">{d.review}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>

{/* Events.................... */}
<div className='w'>
      <div className="heading-text">
        <p>Events</p>
      </div>
      <div className="mt-20">
        <Slider {...settings}>
          {data.map((d) => (
            <div key={d.name} className="custom-card">
              <div className='custom-header'>
                <img src={d.img} alt="" className="custom-image"/>
              </div>
              <div className="custom-content">
                <p className="custom-name">{d.name}</p>
                <p className="custom-review">{d.review}</p>
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
    name: `Akay sharma`,
    img: `/students/Nia_Adebayo.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  },
  {
    name: `Sunny Naik`,
    img: `/students/Rigo_Louie.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  },
  {
    name: `Matru prashad`,
    img: `/students/Mia_Williams.jpg`,
    review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  },
];

export default Search_Card;
