import { useState, useEffect } from "react";
import "./Sub_Park_Details.css"
// Here Import Admin Header ------------------------------------
import AdminHeader from "../../../common/AdminHeader";
// Location icon and image all types of image---------------------------------------------
import Location_icon from "../../../assets/Location_goggle_icon-removebg-preview.png"
import Park_img from "../../../assets/park_img1.jpg"
import Google_map from "../../../assets/Google_map.jpg"
import correct_icon from "../../../assets/Correct_icon.png"
import Phone_icon from "../../../assets/Phone_icon.png"
// Import Aixos method---------------------------------------------
import axiosHttpClient from "../../../utils/axios";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from "../../../utils/encryptData";
// Here Funcation of Sub_park_details------------------------------------------
  const Sub_Park_Details=()=>{
// UseSate for get data -------------------------------------
  const[ServiceData, setServiceData]=useState([]);
//here Location / crypto and navigate the page---------------
     const location = useLocation();
    const facilityTypeId = decryptData(new URLSearchParams(location.search).get('facilityTypeId'));
    const action = new URLSearchParams(location.search).get('action');
    const navigate = useNavigate();

// Here Get the data of Sub_park_details------------------------------------------
    async function getSub_park_details(){
        try{
            let res= await axiosHttpClient('View_By_ParkId', 'get', null, facilityTypeId)
               
            console.log("here Response", res)
            setServiceData(res.data.ServiceData)
        }
        catch(err){
            console.log("here Error", err)
        }
    }
// UseEffect for Update the data---------------------------------------------
useEffect(()=>{
    getSub_park_details()
}, [])

// Here Return Function ------------------------------------------------------------
            return(
                <div className="Sub_Manu_Conatiner">
                    <AdminHeader/>
                    {/* Here Heading Image (Below of header) */}
                        <div className="Header_Img">
                              <h1 className="text-park">Buddha Jayanti Park</h1>
                            <span className="Location_text_sub_manu">
                                    <img className="location_icon" src={Location_icon}></img>
                                    <h1 className="text_location">Bhubaneswar, Odisha</h1>
                            </span>
                        </div>
                 {/*---------------- Jsx for Map and Image ------------------- */}
                        <div className="map_img_main_conatiner">
                                <div className="Image_conatiner">
                                    <img className="Park_image" src={Park_img}></img>
                                </div>
                                <div className="Map_container">
                                    <span className="time_status">
                                    
                                            <h1 className="time_text"> Timeing :   7PM -  8PM</h1>
                                            <button className="Open_Button">Open</button>
                                    </span>
                                    <span className="Button_ticket_container">
                                        <button class="button-9" role="button">Buy a Ticket</button>
                                        <button class="button-9" role="button">Host Event</button>
                                    </span>
                                        <img className="Google_map" src={Google_map}></img>
                                </div>
                        </div>

                {/* -----------------------------services------------------------------------------ */}
                       <div className="Service_Now_conatiner">
                          <h1 className="Service_text">Services</h1>
                            <div className="Service_Avilable">
                                <div class="service_item"> 
                                    <img className="service_Avil_img" src={Park_img}></img>
                                    <p class="service_name">Park Service</p>
                                </div>
                            </div>
                       </div>

                {/* --------------------------- Amenities ------------------------------------------*/}
                <div className="Amenities_Main_conatiner">
                    <h1 className="Service_text">Amenities</h1>
                    <div className="Amenities-Data">
                               <span className="flex gap-2">
                                    <img className="Correct_icon" src={correct_icon}></img>
                                    <h1 className="Amenities_name">Park</h1>
                               </span>
                               <span className="flex gap-2">
                                    <img className="Correct_icon" src={correct_icon}></img>
                                    <h1 className="Amenities_name">Park</h1>
                               </span>
                               <span className="flex gap-2">
                                    <img className="Correct_icon" src={correct_icon}></img>
                                    <h1 className="Amenities_name">Park</h1>
                               </span>
                               <span className="flex gap-2">
                                    <img className="Correct_icon" src={correct_icon}></img>
                                    <h1 className="Amenities_name">Park</h1>
                               </span>
                               <span className="flex gap-2">
                                    <img className="Correct_icon" src={correct_icon}></img>
                                    <h1 className="Amenities_name">Park</h1>
                               </span>
                               <span className="flex gap-2">
                                    <img className="Correct_icon" src={correct_icon}></img>
                                    <h1 className="Amenities_name">Park</h1>
                               </span>
                    </div>

                </div>
                {/* -------------------------- Here About -------------------------------------------- */}
                <div className="About_Conatiner">
                   <h1 className="Service_text">About</h1>
                   <h1 className="About_text">Welcome to our vibrant playground, a hub of recreational delight for all. With a plethora of activities and serene spaces, it's the ultimate destination for fun and relaxation. From dynamic play areas for kids to tranquil spots for unwinding, there's something for everyone to enjoy. Dive into action at our well-equipped play zones, surrounded by lush greenery and scenic vistas. Whether you're seeking adventure or simply soaking in nature's beauty, our playground offers the perfect setting. With facilities for cricket, football, volleyball, yoga, and more, join us for endless hours of play, laughter, and cherished moments with family and friends in this lively community space.</h1>
                </div>
                {/* -------------------------Helpline Number ------------------------------------------ */}
                <div className="Helpline_number_conatine">
                    <h1 className="Service_text">Helpline Number</h1>
                    <div className="Contact_number">
                        <img className="Phone_icon" src={Phone_icon}></img>
                        <h1 className="Number">6834567212 ,</h1>
                        <h1 className="Number">9192847567</h1>
                    </div>
                </div>
             {/* -------------------------Event Available ----------------------------------------------------------- */}
             <div className="Event_Available_main_conatiner">
                 <h1 className="Service_text">Event Available</h1>

             </div>








                </div>
            )
        }

  // Export Sub_Park_details ------------------------
  export default Sub_Park_Details;