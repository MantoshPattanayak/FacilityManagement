


import React from 'react';
import './Home.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Home = () => {
  const apiKey = 'AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao';
  const defaultCenter = { lat: 20.2961, lng: 85.8245 };

  return (
    <>
      <section className="bgi">
        <div id='section-1' className='section1'>
          <header>
            {/* Content inside Home Page */}
            <div className="card">
              <div className="heading">
                <p>
                  <span>AMA BHOOMI</span>
                </p>
              </div>
              <div className="para">
                <p>Explore, book, and Enjoy Open Spaces</p>
              </div>
              <div className="search">
                <input type="search" placeholder='Search by name, location' className='input-search' />
              </div>
            </div>
            <div className="card-2">
              <div className="heading-about">
                <p>About us:</p>
              </div>
              <div className="about-para">
                <p>AMA BHOOMI stands for Assuring Mass Access through <br />Bhubaneswar Open Spaces and Ownership Management Initiative.</p>
              </div>
            </div>
          </header>
        </div>
      </section>

      {/* Google Maps */}
      <section className="map-container">
        <input type="search" name="search location" placeholder='search facility by name or locality' className='search-map' id="" />
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            center={defaultCenter}
            zoom={10}
          >

          </GoogleMap>
        </LoadScript>
      </section>
    </>
  );
}

export default Home;
