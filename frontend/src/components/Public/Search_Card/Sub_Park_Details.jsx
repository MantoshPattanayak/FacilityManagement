import { useState, useEffect , useRef} from "react";
import "./Sub_Park_Details.css"
// Here Import Admin Header AND fOOTER ------------------------------------
import CommonFooter from "../../../common/CommonFooter";
import AdminHeader from "../../../common/AdminHeader";

// Location icon and image all types of image---------------------------------------------
import Location_icon from "../../../assets/Location_goggle_icon-removebg-preview.png"
import Park_img from "../../../assets/park_img1.jpg"
import Yoga_img from "../../../assets/Yoga_img.png"
import Google_map from "../../../assets/Google_map.jpg"
import correct_icon from "../../../assets/Correct_icon.png"
import Phone_icon from "../../../assets/Phone_icon.png"
// Import Aixos method---------------------------------------------
import axiosHttpClient from "../../../utils/axios";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from "../../../utils/encryptData";
// Import here to encrptData ------------------------------------------

import { Link } from "react-router-dom";
import { encryptData } from "../../../utils/encryptData";
// Google MAP --------------------------------
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
// Here Funcation of Sub_park_details------------------------------------------
  const Sub_Park_Details=()=>{
// UseSate for get data -------------------------------------
  const[ServiceData, setServiceData]=useState([]);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const[EventAvailable, setEventAvailable] = useState([])
 const[FacilitiesData, setFacilitiesData] = useState([])
// here Check Login Status------------------------------------
const[LoginStatus, setLoginStatus] = useState([0])

//here Location / crypto and navigate the page---------------
     const location = useLocation();
    const facilityId= decryptData(new URLSearchParams(location.search).get('facilityId'));
    const action = new URLSearchParams(location.search).get('action');
    const navigate = useNavigate();
// Here Map Api keys ------------------------------------------------------------

    const apiKey = 'AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao'; 
    const defaultCenter = { lat: 20.2961, lng: 85.8245 };
    let randomKey=Math.random();


// Here Get the data of Sub_park_details------------------------------------------
    async function getSub_park_details(){
        console.log('facilityId', facilityId);
        try{
            let res= await axiosHttpClient('View_By_ParkId', 'get', null, facilityId)
               
            console.log("here Response", res)
            setServiceData(res.data.serviceData)
            setAmenitiesData(res.data.amenitiesData);
            setEventAvailable(res.data.eventDetails)
            setFacilitiesData(res.data.facilitiesData)
        }
        catch(err){
            console.log("here Error", err)
        }
    }
// For Find Out the Status of Login Page -----------------------------------


// UseEffect for Update the data---------------------------------------------
        useEffect(()=>{
            getSub_park_details()
        }, [])
 // here Funcation to encrotDataid (Pass the Id)----------------------------------------------
 function encryptDataId(id) {
    let res = encryptData(id);
    return res;
}

//Image swap  conatiner ------------------------------------------------
            const containerRef = useRef(null);
            const [currentIndex, setCurrentIndex] = useState(0);
            useEffect(() => {
            const container = containerRef.current;
            const interval = setInterval(() => {
                const newIndex = (currentIndex + 1) % 10;
                setCurrentIndex(newIndex);
                container.scrollLeft = newIndex * container.offsetWidth;
            }, 4000); // Change box set every 3 seconds
            
            return () => clearInterval(interval);
            }, [currentIndex]);
  
// Here Return Function ------------------------------------------------------------
return(
     <div className="Sub_Manu_Conatiner">
                            <AdminHeader/>
                            {/* Here Heading Image (Below of header) */}
                                    <div className="Header_Img">
                                        <h1 className="text-park">{FacilitiesData?.length>0 && FacilitiesData[0]?.facilityName}</h1>
                                        <span className="Location_text_sub_manu">
                                                <img className="location_icon" src={Location_icon}></img>
                                                <h1 className="text_location">{FacilitiesData?.length>0 && FacilitiesData[0]?.address}</h1>
                                        </span>
                                    </div>
                        {/*---------------- Jsx for Map and Image ------------------- */}
                                    <div className="map_img_main_conatiner">
                                            <div className="Image_conatiner">
                                                <img className="Park_image" src={Park_img}></img>
                                            </div>
                                            <div className="Map_container">
                                                <span className="time_status">
                                                
                                                        <h1 className="time_text"> Timing :   7PM -  8PM</h1>
                                                        <button className={`Open_Button ${FacilitiesData.length > 0 && FacilitiesData[0].status === 'open' ? 'open' : 'closed'}`}>
                                                                {FacilitiesData?.length > 0 && FacilitiesData[0]?.status}
                                                                </button>

                                                </span>
                                                <span className="Button_ticket_container">
                                                        <Link
                                                            to={{ 
                                                                pathname: '/BookParks/Book_Now',
                                                                search: `?facilityId=${encryptDataId(FacilitiesData[0]?.facilityId)}&action=view`
                                                            }}
                                                            className="button-9"
                                                        >

                                                           <button  role="button_by">Buy a Ticket</button>
                                                        </Link>




                                                    
                                                    
                                                    <button class="button-9" role="button">Host Event</button>
                                                </span>
                                                    <div className="Map_image">
                                                        <LoadScript googleMapsApiKey={apiKey}>
                                                            <GoogleMap
                                                                mapContainerStyle={{ height: '300px', width: '100%' }}
                                                                center={defaultCenter}
                                                                zoom={8}
                                                            >
                                                                {/* Render markers */}
                                                                {FacilitiesData?.map((location, index) => (
                                                                <Marker
                                                                    key={index}
                                                                    position={{ lat: location.latitude, lng: location.longitude }}
                                                                   
                                                                />
                                                                ))}

                                                            </GoogleMap>
                                                            </LoadScript>
                                                    </div>
                                            </div>
                                    </div>

                        {/* -----------------------------services------------------------------------------ */}
                                    <div className="Service_Now_conatiner">
                                        <h1 className="Service_text">Services</h1>
                                        {ServiceData?.length > 0 && ServiceData?.map((item, index) => (
                                                <div className="Service_Avilable" key={index}>
                                                    <div className="service_item"> 
                                                        <img className="service_Avil_img" src={Park_img} alt="Parking" />
                                                        <p className="service_name">{item.code}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            
                                        
                                    </div>

                        {/* --------------------------- Amenities ------------------------------------------*/}
                                    <div className="Amenities_Main_conatiner">
                                    <h1 className="Service_text">Amenities</h1>
                                    <div className="Amenities-Data">
                                        {amenitiesData
                                        .flatMap((group) => group) // Flatten the array of arrays
                                        .filter((item, index, self) => self.findIndex((t) => t.amenityName === item.amenityName) === index) // Filter unique items
                                        .map((item, index) => (
                                            <span className="flex gap-2" key={index}>
                                            <img
                                                className="Correct_icon"
                                                src={correct_icon}
                                                alt={`Amenity icon ${index}`}
                                            />
                                            <h1 className="Amenities_name">{item.amenityName}</h1>
                                            </span>
                                        ))}
                                    </div>
                                    </div>


                        {/* -------------------------- Here About -------------------------------------------- */}
                                <div className="About_Conatiner">
                                    <h1 className="Service_text">About</h1>
                                    <h1 className="About_text">{FacilitiesData?.length>0 && FacilitiesData[0]?.about}</h1>
                                </div>
                        {/* -------------------------Helpline Number ------------------------------------------ */}
                                <div className="Helpline_number_conatine">
                                    <h1 className="Service_text">Helpline Number</h1>
                                    <div className="Contact_number">
                                        <img className="Phone_icon" src={Phone_icon}></img>
                                        <h1 className="Number">{FacilitiesData?.length>0 && FacilitiesData[0]?.helpNumber}</h1>
                                        <h1 className="Number">9192847567</h1>
                                    </div>
                                </div>
                    {/* -------------------------Event Available ----------------------------------------------------------- */}
                                <div className="Event_Available_main_conatiner">
                                    <h1 className="Service_text">Event Available</h1>
                                    <div className="Sub_Park_Details">
                                            {EventAvailable?.length > 0 && EventAvailable?.map((item, index) => {
                                                return (
                                                    <div className="carousel-container" ref={containerRef} key={index}>
                                                        <div className="carousel-slide">
                                                            <img className="Yoga_image" src={Yoga_img} alt="Event"></img>
                                                            <h1 className="Name_yoga"> {item.eventName}</h1>
                                                            <span className="Yoga_date_time">
                                                                <h1 className="Yoga_date">Date -{item.eventDate}</h1>
                                                                <h1 className="Yoga_time">Time: -{item.eventStartTime + '-' + item.eventEndTime}</h1>
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                </div>
                 {/*-------------------------------------------- Here Footer---------------------------------------------- */}
                <CommonFooter/>

   </div>
 )
}

  // Export Sub_Park_details ------------------------
  export default Sub_Park_Details;