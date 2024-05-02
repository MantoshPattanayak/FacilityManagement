import React, { useEffect, useState } from 'react';
import '../../Public/BookParks/Book_Now.css';
import AdminHeader from '../../../common/AdminHeader';
import CommonFooter from '../../../common/CommonFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'; // Import the icon
// Import Aixos method---------------------------------------------
import axiosHttpClient from "../../../utils/axios";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from "../../../utils/encryptData";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import PublicHeader from '../../../common/PublicHeader';
import { formatDate } from '../../../utils/utilityFunctions';

const Book_Now = () => {
  const [selectedGames, setSelectedGames] = useState([]);
  // UseSate for get data -------------------------------------

  const [FacilitiesData, setFacilitiesData] = useState([])
  //here Location / crypto and navigate the page---------------
  const location = useLocation();
  const facilityId = decryptData(new URLSearchParams(location.search).get('facilityId'));
  const action = new URLSearchParams(location.search).get('action');
  const navigate = useNavigate();
  const [activityPreferenceData, setActivityPreferenceData] = useState([]);
  const [formData, setFormData] = useState({
    totalMembers: '',
    amount: '10.00',
    activityPreference: [],
    otherActivities: '',
    bookingDate: new Date().toISOString().split('T')[0],
    startTime: '',
    durationInHours: '',
    facilityId: ''
  })

  // Here Get the data of Sub_park_details------------------------------------------
  async function getSub_park_details() {
    console.log('facilityId', facilityId);
    try {
      let res = await axiosHttpClient('View_By_ParkId', 'get', null, facilityId)

      console.log("here Response", res)
      setFacilitiesData(res.data.facilitiesData)
      setFormData({...formData, ['facilityId']: res.data.facilitiesData[0].facilityId});
    }
    catch (err) {
      console.log("here Error", err)
    }
  }

  // API call to fetch dropdown data and selection data
  async function getParkBookingInitialData() {
    try {
      let res = await axiosHttpClient('PARK_BOOK_PAGE_INITIALDATA_API', 'get');

      console.log("getParkBookingInitialData", res);
      setActivityPreferenceData(res.data.data);
    }
    catch (err) {
      console.log("here Error", err)
    }
  }

  // UseEffect for Update/Call API--------------------------------
  useEffect(() => {
    getSub_park_details();
    getParkBookingInitialData();
  }, []);

  useEffect(() => {
    console.log('selectedGames', selectedGames);
    console.log('formData', formData);
  }, [selectedGames, formData])


  // Function to handle game button click
  const handleGameClick = (game) => {
    // Toggle game selection
    if (selectedGames.includes(game)) {
      setSelectedGames(selectedGames.filter(item => item !== game));
    } else {
      setSelectedGames([...selectedGames, game]);
    }
    // setFormData({...formData, ['activityPreference']: selectedGames});
    console.log('selectedGames', selectedGames);
  }

  const handleChangeInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value});
  }

  async function handleSubmitAndProceed() {
    let modifiedFormData = {...formData, ['activityPreference']: selectedGames};
    console.log('formData handleSubmitAndProceed', modifiedFormData);
    const validationError = validation(modifiedFormData);
    if(Object.keys(validationError).length == 0) {
      try{
        let res = await axiosHttpClient('PARK_BOOK_PAGE_SUBMIT_API', 'post', modifiedFormData);
        console.log('submit and response', res);
        toast.success('Booking details submitted successfully.', {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate('/');
            }, 1000); // Wait 1 second after toast timer completes before navigating
          }
        });
      }
      catch(error) {
        console.log(error);
        toast.error('Booking details submission failedc.')
      }
    }
    else{
      toast.error('Please fill the required data.')
    }
  }

  const validation = (formData) => {
    let errors ={};
    if(!formData.totalMembers) {
      errors.totalMembers = 'Please provide number of members';
    }
    if(!formData.bookingDate) {
      errors.date = 'Please provide date.'
    }
    if(!formData.startTime){
      errors.startTime = 'Please provide Start time.';
    }
    if(!formData.durationInHours){
      errors.durationInHours = 'Please provide duration.';
    }
    return errors;
  }

  return (
    <div>
      <ToastContainer />
      <PublicHeader />
      <div className="booknow-container">
        <div className="park-container">
          <div className="heading">
            <h1> {FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityName}</h1>
          </div>
          <div className="address">
            <p> {FacilitiesData?.length > 0 && FacilitiesData[0]?.address}</p>
          </div>

          <div className="input-fields">
            <p>Total Members</p> 
            <input type="number" name="totalMembers" value={formData.totalMembers} id="" className='member-input' onChange={handleChangeInput}/>
          </div><br />

          <div className="activity-preference">
            <span>Activity Preference</span>
            <div className="games">
              {
                activityPreferenceData?.length > 0 && activityPreferenceData.map((activity) => {
                  return (
                    <button
                      className={`game-btn ${selectedGames.includes(activity.userActivityId) ? 'selected' : ''}`}
                      onClick={() => handleGameClick(activity.userActivityId)}
                    >
                      {activity.userActivityName}
                    </button>
                  )
                })
              }
            </div>
          </div>

          <div className="other-activities">
            <label htmlFor="activities">Other Activities(if any)</label>
            <input type="text" name="otherActivities" value={formData.otherActivities} id="" className='input-field-otheractivities' onChange={handleChangeInput}/>
          </div><br />


          <div className="date">
            <label htmlFor="">Date :</label>
            <input type="date" name="bookingDate" value={formData.bookingDate} id="" className='input-field-date' onChange={handleChangeInput}/>
          </div><br />


          <div className="start-time">
            <label htmlFor=""> Start Time :</label>
            <input type="time" name="startTime" value={formData.startTime} id="" className='input-field-date' onChange={handleChangeInput}/>
          </div>

          <div className="duration">
            <label htmlFor="">  Duration :</label>
            <input type="text" name="durationInHours" value={formData.durationInHours} id="" className='input-field-date' onChange={handleChangeInput}/>
          </div>

          {/* Add to cart button */}
          <div className="button">
            <button className="addtocart-btn" onClick={handleSubmitAndProceed}>
              Proceed to payment
            </button>
          </div>
        </div>

        {/* <div className="cart-container">
          <div className="cart-icon">
            <FontAwesomeIcon icon={faCartShopping} />
            <p>Cart is empty</p>
          </div>
        </div> */}

      </div>
      <CommonFooter />
    </div>
  );
}

export default Book_Now;
