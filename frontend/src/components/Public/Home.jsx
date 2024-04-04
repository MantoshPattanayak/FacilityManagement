import React, { useEffect, useState } from 'react';
import './Home.css';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axiosHttpClient from '../../utils/axios';


const Home = () => {
  const[mapdata, setmapdata]=useState([])
  const[selectlocation, setselectlocation]=useState(null)
  const apiKey = 'AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao'; 
  const defaultCenter = { lat: 20.2961, lng: 85.8245 };
 

      // here Post the data
        async function fecthMapData(){
          try{
            let res= await axiosHttpClient('MAP_DISPLAY_DATA' , 'get');
            console.log("here get data", res)
            setmapdata(res.data.data)
          
          }
            catch(err){
              console.log(" here error", err)
            }
            }
          // here Update the data
          useEffect(()=>{
            fecthMapData()
          }, [])

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
              <span className='Explore_text'>
                 <p>Explore, book, and Enjoy Open Spaces</p>
              </span>
              
              <div className="para">
               
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
                {/* Render markers using map */}
                {mapdata.map((location, index) => (
                    <Marker key={index} position={{ lat: location.latitude, lng: location.longitude }}
                    onClick={() => setselectlocation(location.parkName)}
                    >
                        {/* Show park name in InfoWindow */}
                        {selectlocation && (
                        <InfoWindow position={defaultCenter}
                          onCloseClick={() => setselectlocation(null)} >
                            <div>
                            <h3>{location.parkName}</h3>
                            </div>
                        </InfoWindow>
                          )}
                    </Marker>
                ))}
            </GoogleMap>
        </LoadScript>
    </section>

    </>
  );
}

export default Home;
