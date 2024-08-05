import React, { useEffect, useState } from 'react';
import './Image_Gallery.css';
import PublicHeader from "../../../common/PublicHeader";

import axiosHttpClient from '../../../utils/axios';
import instance from '../../../../env';
import ShimmerUI from '../Search_Card/ShimmerUI';

const Image_Gallery = () => {
  const[GetGalleryData, setGetGalleryData]=useState([])
  const[isLoading, setLoading]=useState(false)
  // here call the Api (Fetch the data ) ---------------------
  async function GetViewPakData() {
    try {
      setLoading(true)
      let res = await axiosHttpClient('FETCH_GALLERY_LIST_DATA_API', 'post')
      console.log("Here Response of Gallery", res)
      setGetGalleryData(res.data.data)
      setLoading(false);
    }
  
    catch (err) {
      setLoading(false)
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
      {isLoading ? (
        // Display shimmer effect while loading
        <ShimmerUI />
      ) : (
        GetGalleryData.map((image, index) => (
          <div key={index} className="image-container">
            <img
              src={`${instance().baseURL}/static${image.url}`}
              className="gallery-image"
              alt="Park"
            />
            <div className="description">{image.description}</div>
          </div>
        ))
      )}
    </div>
    </>
  );
}

export default Image_Gallery;
