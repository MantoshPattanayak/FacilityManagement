import React from 'react';
import './Image_Gallery.css';
import galleryImg1 from "../../../assets/Gallery_Anant Vihar Park,Phase-3,DDC Park_Pokhariput.jpg";
import galleryImg2 from "../../../assets/Gallery_BDA Children's Park.jpg";
import galleryImg3 from "../../../assets/Gallery_Disabled Friendly Park_Saheed Nagar.jpg";
import galleryImg4 from "../../../assets/Gallery_Kelucharan_Park-5.jpg";
import galleryImg5 from "../../../assets/Gallery_Madhusudan_Park.jpg";
import galleryImg6 from "../../../assets/Gallery_Mukharjee_Park.jpg";
import galleryImg7 from "../../../assets/Gallery_Prachi Park_Damana.jpg";
import galleryImg8 from "../../../assets/Gallery_Sundarpada_BDA Colony Park.jpg";

const Image_Gallery = () => {
  const images = [
    {
      img: galleryImg1,
      desc: `Anant Vihar Park,Phase-3, DDC Park, Pokhariput`,
    },
    {
      img: galleryImg2,
      desc: `BDA Children's Park`,
    },
    {
      img: galleryImg3,
      desc: `Disabled Friendly Park, Saheed Nagar`,
    },
    {
      img: galleryImg4,
      desc: `Kelucharan Park-5`,
    },
    {
      img: galleryImg5,
      desc: `Madhusudan Park`,
    },
    {
      img: galleryImg6,
      desc: `Mukharjee Park`,
    },
    {
      img: galleryImg7,
      desc: `Prachi Park, Damana`,
    },
    {
      img: galleryImg8,
      desc: `BDA Colony Park, Sundarpada`,
    },
  ];

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={index} className="image-container">
          <img src={image.img} className="gallery-image" alt="Park" />
          <div className="description">{image.desc}</div>
        </div>
      ))}
    </div>
  );
}

export default Image_Gallery;
