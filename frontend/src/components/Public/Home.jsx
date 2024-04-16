
import React, { useEffect, useState,useRef } from 'react';
import './Home.css';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axiosHttpClient from '../../utils/axios';
import AdminHeader from '../../common/AdminHeader';
import Logo from "../../assets/ama_bhoomi_blueways_logo.jpeg"
import Yoga from "../../assets/Yoga.png";
import Activity1 from "../../assets/Activity1.png"
import Activity2 from "../../assets/Activity2.png"
import Activity3 from "../../assets/Activity3.png"
import Activity4 from "../../assets/Activity4.png"
import Notice_Arrow from "../../assets/Notice_Arrow.png"
import PlayStore from "../../assets/sm-playstore 1.png"
import apple from "../../assets/apple.png"
import Rating_icon from "../../assets/Rating_icon.png"
import parkLOgo from "../../assets/park_logo.png"
const Home = () => {
  const[mapdata, setmapdata]=useState([])
  const [selectedParkId, setSelectedParkId] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [givenReq, setGivenReq] = useState(null);
  const counterRef = useRef(null);
  const [selectedLocationDetails, setSelectedLocationDetails] = useState(null);
  const apiKey = 'AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao'; 
  const defaultCenter = { lat: 20.2961, lng: 85.8245 };
  let randomKey=Math.random();
 
      // here get  the data of location 
        async function fecthMapData(){
          try{
            let res= await axiosHttpClient('MAP_DISPLAY_DATA' , 'post', {
              givenReq: givenReq,
            });

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
          }, [ givenReq])

          // here Search Funcation 
          async function searchFunction(e) {
            e.preventDefault();
            try {
           
              let res = await axiosHttpClient("/busmaster/viewList", "post", {
             
                givenReq: givenReq
              });
              setmapdata(res.data.data)
       
            } catch (error) {
              console.error(error);
          
            }
          }
      
          function handleChange(e) {
            let { name, value } = e.target;
            switch (name) {
              case "givenReq":
                value = e.target.value.replace(/^\s*/, "");
                setGivenReq(value);
            }
          }



      
  
    

  // Function to handle marker click
    const handleMarkerClick = (parkId) => {
      setSelectedParkId(parkId); // Set selected parkId
      const location = mapdata.find(location => location.parkId === parkId);
      setSelectedLocationDetails(location); // Set selected location details

    };

    // Here Start Counter
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.unobserve(entry.target);
          }
        });
      });
  
      observer.observe(counterRef.current);
      return () => observer.disconnect();
    }, []);
  
    const startCounterAnimation = () => {
      if (isIntersecting) {
        const counterElements = document.querySelectorAll('.count');
        counterElements.forEach((counter) => {
          const targetCount = parseInt(counter.innerText);
          let currentCount = 0;
          const increment = Math.ceil(targetCount  / 1000); // Adjust speed
          const counterInterval = setInterval(() => {
            currentCount += increment;
            if (currentCount >= targetCount) {
              clearInterval(counterInterval);
              currentCount = targetCount;
            }
            counter.innerText = `${currentCount} +`;
          }, 20); // Adjust interval
        });
      }
    };
  
    useEffect(() => {
      startCounterAnimation();
    }, [isIntersecting]);

  return (
    <>
    
      <section className="bgi">
            <header class="fixed-header">
                <div class="logo">
                  
                </div>
              <nav>
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </nav>
        </header>
       <div className='landing_page_contant'>
           <span className='Search_Conatiner'>
              <h1>AMA BHOOMI</h1>
              <h2  className='typing-animation'>Explore, Book and Enjoy Open Spaces </h2>
              <input  className='search-input' type='text' name="       search" placeholder="       Search by Name and Location"></input>
           </span>
            
           <span className='about_Conatiner'>
           <h1>About</h1>
             <p>Ama Bhoomi stands for Assuring mass Access through BHubaneswar Open Spaces <br></br>and Ownership Management Initiative. </p>
           </span>
       </div>
        

       
      </section>

      {/* Google Maps */}
      <section className="map-container">
       <div className='flex'> 
        <input type='text' placeholder='Please Enter the Location '
          name="givenReq"
          id="givenReq"
          value={givenReq}
          onChange={handleChange}
        ></input>
        <button type='button'
        onClick={searchFunction}
        > Search here </button>
       </div>

         
         
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            center={defaultCenter}
            zoom={12}
          >
            {/* Render markers */}
            {mapdata.map((location, index) => (
              <Marker
                key={index}
                position={{ lat: location.latitude, lng: location.longitude }}
                onClick={() => handleMarkerClick(location.parkId)} // Call handleMarkerClick function with parkId when marker is clicked
              />
            ))}

            {/* Show InfoWindow for selected location */}
            {selectedLocationDetails && (
                <InfoWindow
                key={randomKey}
                position={{ lat: selectedLocationDetails.latitude, lng: selectedLocationDetails.longitude }} // Position the InfoWindow at the selected location
                onCloseClick={() => {setSelectedParkId(null); setSelectedLocationDetails(null)}}
                >
                  {
                    selectedParkId ? 
                    <div>
                      <h3>Park Name:{selectedLocationDetails.parkName}</h3>
                    </div>
                  : ''
                  }
                </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </section>
      {/* Activity Section */}
      <section className='Activity_Section'>
            <h1 className='Activity'> Activities</h1>
            <div className='Activity_container'>
             <span className='section'>
              <span className='text_right'>
                    <img className='Activity1' src={Activity1}></img>
                    <h1 className='activity_text'>Book sports venues <br></br> nearby</h1>
                   
              </span>
               
              <span className='text_right'>
                    <img className='Activity1' src={Activity2}></img>
                    <h1 className='activity_text'>Current Events </h1>
                  
              </span>
             </span>
             <span className='section'>
                <img src={Yoga}></img>
             </span>
             <span className='section'>
             <span className='text_right'>
                    <img className='Activity1' src={Activity3}></img>
                    <h1 className='activity_text'>Manage your events <br></br> and community</h1>
              </span>
              <span className='text_right'>
                    <img className='Activity1' src={Activity4}></img>
                    <h1 className='activity_text'>Different parks near <br></br> by me</h1>
              </span>
             </span>

             {/* here Acitvit data show  */}
           
            </div>
            <div className='Activity_Data' ref={counterRef}>
              <span className='Actvity_pure_data'>
                <h1 className='count'>450 +</h1>
                <p>Playground</p>
              </span>
              <span className='Actvity_pure_data'>
                <h1 className='count'>200 +</h1>
                <p>Park</p>
              </span>
              <span className='Actvity_pure_data'>
                <h1 className='count'>100 +</h1>
                <p>Open Space</p>
              </span>
              <span className='Actvity_pure_data'>
                <h1 className='count'>200 +</h1>
                <p>Event</p>
              </span>
            </div>
      </section>

      {/* Here Notice Section  */}
      <section className='Notice_Section'>
         <h1 className='Activity'> Notice</h1>

       <div className='Notice_Container'>
              <span className='notice_Name'>
                <img src={Notice_Arrow}></img>
                  <h1>The Sakuntala book fair will be inaugurated by the Chief Minister today at Janta Maidan.</h1>
              </span>
              <span className='notice_Name'>
                       <img src={Notice_Arrow}></img>
                       <h1>The mesmerizing performances of the MJ dance group await you at Jaydev Vatika. </h1>
                </span>
                <span className='notice_Name'>
                       <img src={Notice_Arrow}></img>
                       
                       <h1>Due to ongoing construction work, the Unit-9 playground will be closed for today and tomorrow.</h1>
                </span>
                <span className='notice_Name'>
                     <img src={Notice_Arrow}></img>

                       <h1>Explore the vibrant world of art and craft at Tosali Art and Craft exhibition happening at Janta Maidan.</h1>
                </span>
                <span className='notice_Name'>
                    <img src={Notice_Arrow}></img>
                    <h1>Exciting news for residents of VSS Nagar! The BDA has officially registered a new park in your area.</h1>
                </span>  
       </div>
      </section>

      {/* user Review and Feedback Section */}
      <section className='Review_Feedback_section'>
            <h1 className='Activity'>User Review</h1>
            <div className='App_rating'>
                <span className='App_rating-item'>
                   <span className='Name_rating'>
                      <img className='play_store_img' src={PlayStore}></img>
                   </span>
                   <span className='Name_rating'>
                       <h1 className='center'>4.4</h1>
                       <h1 className='Rating_data'>hguiyguyg</h1>
                       <img className='raing_img'  src={Rating_icon}></img>
                   </span>
                 
                </span>
                <span className='App_rating-item'>
                  <span className='Name_rating'>
                      <img className='play_store_img' src={apple}></img>
                   </span>
                  
                   <span className='Name_rating'>
                       <h1 className='Rating_data'>hguiyguyg</h1>
                       <img className='raing_img'  src={Rating_icon}></img>
                   </span>
                 
                </span>

            </div>
      </section>

    </>
  );
}

export default Home;
