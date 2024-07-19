import React, { useEffect, useState } from 'react';
import './Image_Gallery.css';
import PublicHeader from "../../../common/PublicHeader";

import axiosHttpClient from '../../../utils/axios';
import instance from '../../../../env';

const Image_Gallery = () => {
  const[GetGalleryData, setGetGalleryData]=useState([])
  // here call the Api (Fetch the data ) ---------------------
  async function GetViewPakData() {
    try {
      let res = await axiosHttpClient('FETCH_GALLERY_LIST_DATA_API', 'post')
      console.log("Here Response of Gallery", res)
      setGetGalleryData(res.data.data)
    }
    catch (err) {
      console.log("here error Response of Gallery", err)
    }
  }
  // here call api ----------------
  useEffect(() => {
    GetViewPakData()
  }, [])
  return (
    <>
      <PublicHeader />
      <div className="image-gallery">
        {GetGalleryData.map((image, index) => (
          <div key={index} className="image-container">
            <img src={`${instance().baseURL}/static${image.url}`} className="gallery-image" alt="Park" />
            <div className="description">{image.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Image_Gallery;
