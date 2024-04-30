import React, { useEffect, useState } from 'react';
import '../../Public/BookParks/Book_Now.css';
import AdminHeader from '../../../common/AdminHeader';
import Footer from '../../../common/Footer'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'; // Import the icon
// Import Aixos method---------------------------------------------
import axiosHttpClient from "../../../utils/axios";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from "../../../utils/encryptData";

const Book_Now = () => {
  const [selectedGames, setSelectedGames] = useState([]);
  // UseSate for get data -------------------------------------

 const[FacilitiesData, setFacilitiesData] = useState([])
  //here Location / crypto and navigate the page---------------
  const location = useLocation();
  const facilityId= decryptData(new URLSearchParams(location.search).get('facilityId'));
  const action = new URLSearchParams(location.search).get('action');
  const navigate = useNavigate();
// Here Get the data of Sub_park_details------------------------------------------
async function getSub_park_details(){
  console.log('facilityId', facilityId);
  try{
      let res= await axiosHttpClient('View_By_ParkId', 'get', null, facilityId)
         
      console.log("here Response", res)
      setFacilitiesData(res.data.facilitiesData)
     

  }
  catch(err){
      console.log("here Error", err)
  }
}
// UseEffect for Update/Call API--------------------------------
  useEffect(()=>{
    getSub_park_details()
  },[])


  // Function to handle game button click
  const handleGameClick = (game) => {
    // Toggle game selection
    if (selectedGames.includes(game)) {
      setSelectedGames(selectedGames.filter(item => item !== game));
    } else {
      setSelectedGames([...selectedGames, game]);
    }
  }

  return (
    <div>
      <AdminHeader/>
      <div className="booknow-container">
        <div className="park-container">
          <div className="heading">
           <h1> {FacilitiesData?.length>0 && FacilitiesData[0]?.facilityName}</h1>
          </div>
          <div className="address">
           <p> {FacilitiesData?.length>0 && FacilitiesData[0]?.address}</p>
          </div>

          <div className="input-fields">
            <p>Total Member</p> <input type="number" name="member" id="" className='member-input' defaultValue={0}/>
          </div><br />

          <div className="activity-preference">
            <span>Activity Preference</span>
            <div className="games">
              <button 
                className={`game-btn ${selectedGames.includes('Walking') ? 'selected' : ''}`}
                onClick={() => handleGameClick('Walking')}
              >
                Walking
              </button>
              <button 
                className={`game-btn ${selectedGames.includes('Yoga') ? 'selected' : ''}`}
                onClick={() => handleGameClick('Yoga')}
              >
                Yoga
              </button>
              <button 
                className={`game-btn ${selectedGames.includes('Open Gym') ? 'selected' : ''}`}
                onClick={() => handleGameClick('Open Gym')}
              >
                Open Gym
              </button>
              <button 
                className={`game-btn ${selectedGames.includes('Sketing') ? 'selected' : ''}`}
                onClick={() => handleGameClick('Sketing')}
              >
                Sketing
              </button>
              <button 
                className={`game-btn ${selectedGames.includes('Children Park') ? 'selected' : ''}`}
                onClick={() => handleGameClick('Children Park')}
              >
                Children Park
              </button>
              <button 
                className={`game-btn ${selectedGames.includes('Slide') ? 'selected' : ''}`}
                onClick={() => handleGameClick('Slide')}
              >
                Slide
              </button>
              <button 
                className={`game-btn ${selectedGames.includes('Zoomba') ? 'selected' : ''}`}
                onClick={() => handleGameClick('Zoomba')}
              >
                Zoomba
              </button>
             
            </div>
          </div>
           
           <div className="other-activities">
            <label htmlFor="activities">Other Activities(if any):</label>
            <input type="text" name="other-activities" id="" className='input-field-otheractivities' />
           </div>

         
           <div className="date">
           <label htmlFor="">Date :</label>
            <input type="date" name="date" id="" className='input-field-date'/>
           </div><br />
         

        <div className="start-time">
        <label htmlFor=""> Start Time :</label>
           <input type="time" name="time" id="" className='input-field-date'/>
        </div>

        <div className="duration">
        <label htmlFor="">  Duration :</label>
           <input type="text" name="" id="" className='input-field-date' />
        </div>

        {/* Add to cart button */}
        <div className="button">
            <button className="addtocart-btn">
               Processed to payment
            </button>
        </div>
     </div>

        <div className="cart-container">
          <div className="cart-icon">
            <FontAwesomeIcon icon={faCartShopping} />
            <p>Cart is empty</p>
          </div>
        </div>
        
      </div>
      <Footer/>
    </div>
  );
}

export default Book_Now;
