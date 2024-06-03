import { useState, useEffect, useRef } from "react";
import "./Sub_Park_Details.css";
// Here Import Admin Header AND fOOTER ------------------------------------
import CommonFooter from "../../../common/CommonFooter";
import AdminHeader from "../../../common/AdminHeader";

// Location icon and image all types of image---------------------------------------------
import Location_icon from "../../../assets/Location_goggle_icon-removebg-preview.png";
import Park_img from "../../../assets/Park_details.jpg";
import amabhoomi from '../../../assets/ama_bhoomi_bgi.jpg';
import sport_image from "../../../assets/sport_details_image.jpg"

import Yoga_img from "../../../assets/Yoga_img.png";
import Google_map from "../../../assets/Google_map.jpg";
import correct_icon from "../../../assets/Correct_icon.png";
import Phone_icon from "../../../assets/Phone_icon.png";
// Import Aixos method---------------------------------------------
import axiosHttpClient from "../../../utils/axios";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData } from "../../../utils/encryptData";
// Import here to encrptData ------------------------------------------

import { Link } from "react-router-dom";
import { encryptData } from "../../../utils/encryptData";
// Google MAP --------------------------------
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import PublicHeader from "../../../common/PublicHeader";
// Here Funcation of Sub_park_details------------------------------------------
const Sub_Park_Details = () => {
  // UseSate for get data -------------------------------------
  const [ServiceData, setServiceData] = useState([]);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [EventAvailable, setEventAvailable] = useState([]);
  const [FacilitiesData, setFacilitiesData] = useState([]);
  // here Check Login Status------------------------------------
  const [LoginStatus, setLoginStatus] = useState([0]);

  //here Location / crypto and navigate the page---------------
  const location = useLocation();
  const facilityId = decryptData(
    new URLSearchParams(location.search).get("facilityId")
  );
  const action = new URLSearchParams(location.search).get("action");
  const navigate = useNavigate();
  const isUserLoggedIn = sessionStorage.getItem("isUserLoggedIn") || 0;
  const [toRoute, setToRoute] = useState();
  // Here Map Api keys ------------------------------------------------------------

  const apiKey = "AIzaSyBYFMsMIXQ8SCVPzf7NucdVR1cF1DZTcao";
  const defaultCenter = { lat: 20.2961, lng: 85.8245 };
  let randomKey = Math.random();

  // Here Get the data of Sub_park_details------------------------------------------
  async function getSub_park_details() {
    // console.log('facilityId', facilityId);
    try {
      let res = await axiosHttpClient(
        "View_By_ParkId",
        "get",
        null,
        facilityId
      );

      console.log("here Response", res);
      setServiceData(res.data.serviceData);
      setAmenitiesData(res.data.amenitiesData);
      setEventAvailable(res.data.eventDetails);
      setFacilitiesData(res.data.facilitiesData);
    } catch (err) {
      console.log("here Error", err);
    }
  }
  // For Find Out the Status of Login Page -----------------------------------
  // For Find Out the Status of Login Page -------------------------------

  useEffect(() => { }, [isUserLoggedIn]);

  // UseEffect for Update the data---------------------------------------------
  useEffect(() => {
    getSub_park_details();
  }, []);
  // here Funcation to encrotDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  //Image swap  conatiner ------------------------------------------------
  // const containerRef = useRef(null);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // useEffect(() => {
  //   const container = containerRef.current;
  //   const interval = setInterval(() => {
  //     const newIndex = (currentIndex + 1) % 10;
  //     setCurrentIndex(newIndex);
  //     container.scrollLeft = newIndex * container.offsetWidth;
  //   }, 4000); 

  //   return () => clearInterval(interval);
  // }, [currentIndex]);


  function formatTime(time24) {
    //format 24 hour time as 12 hour time
    if (!time24) return;
    // Parse the input time string
    const [hours, minutes] = time24.split(":").map(Number);

    // Determine AM or PM
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12; // 0 should be 12 in 12-hour format

    // Format the time string
    const time12 = `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;

    return time12;
  }

  function formatDate(date) {
    //format input date as DD-MM-YYYY
    if (!date) return;

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  }


  // carousel logic.........................................

  const images = [Park_img, amabhoomi , Park_img, amabhoomi , Park_img];

  const [currentIndex1, setCurrentIndex1] = useState(0);


  const handlePrev = () => {
    setCurrentIndex1(currentIndex1 === 0 ? images.length - 1 : currentIndex1 - 1);
  };

  const handleNext = () => {
    setCurrentIndex1(currentIndex1 === images.length - 1 ? 0 : currentIndex1 + 1);
  };


  // Here Return Function ------------------------------------------------------------
  return (
    <div className="Sub_Manu_Conatiner">
      {/* here Header -----------------------------------------------------*/}
      <PublicHeader />

      {/* Here Heading Image (Below of header) and set the class Name according to Id  */}
      <div className={FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityTypeId === 1 ? "Header_Img" : FacilitiesData[0]?.facilityTypeId === 2 ? "playground_header_image" : FacilitiesData[0]?.facilityTypeId === 3 ? "MulitGroud" : ""}>
        <h1 className="text-park">
          {FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityName}
        </h1>
        <span className="Location_text_sub_manu">
          <img className="location_icon" src={Location_icon}></img>
          <h1 className="text_location">
            {FacilitiesData?.length > 0 && FacilitiesData[0]?.address}
          </h1>
        </span>
      </div>
      {/*---------------- Jsx for Map and Image ------------------- */}
      <div className="map_img_main_conatiner">
        {/* <div className="Image_conatiner" ref={containerRef}>
          <button className="carousel-button left" onClick={prevImage}>
            &lt;
          </button>
          {images.map((images, index) => (
            <img
              key={index}
              className="Park_image"
              src={images}
              alt={`Images ${index}`}
            />
          ))}
          <button className="carousel-button right" onClick={nextImage}>
            &gt;
          </button>
        </div> */}
 <div className="carousel-container1">
      <div className="carousel1">
        <img src={images[currentIndex1]} alt={`Slide ${currentIndex1 + 1}`} />
      </div>
      <button className="carousel1-button1 left1" onClick={handlePrev}>
        &lt;
      </button>
      <button className="carousel1-button1 right1" onClick={handleNext}>
        &gt;
      </button>
    </div>


        <div className="Map_container">
          <span className="time_status">
            <h1 className="time_text">
              {" "}
              Timing : {formatTime(
                FacilitiesData[0]?.operatingHoursFrom
              )} - {formatTime(FacilitiesData[0]?.operatingHoursTo)}
            </h1>
            <button
              className={`Open_Button ${FacilitiesData.length > 0 && FacilitiesData[0].status === "open"
                ? "open"
                : "closed"
                }`}
            >
              {FacilitiesData?.length > 0 &&
                FacilitiesData[0]?.status.toUpperCase()}
            </button>
          </span>

          <span className="Button_ticket_container">

            {
              FacilitiesData[0]?.facilityTypeId == 1 ? (
                <Link
                  to={{
                    pathname: `${isUserLoggedIn == 1 ? "/BookParks/Book_Now" : "/login-signup"
                      }`,
                    search: `${isUserLoggedIn == 1
                      ? `?facilityId=${encryptDataId(
                        FacilitiesData[0]?.facilityId
                      )}`
                      : `?facilityId=${encryptDataId(
                        FacilitiesData[0]?.facilityId
                      )}` + `&redirect=${encryptDataId("/BookParks/Book_Now")}`
                      }`,
                  }}
                  className="button-9"
                >
                  <button role="button_by">Buy  Ticket</button>
                </Link>
              )
                : FacilitiesData[0]?.facilityTypeId == 2 ? (
                  <Link
                    to={{
                      pathname: `${isUserLoggedIn == 1 ? "/BookParks/Book_Now_Sport" : "/login-signup"
                        }`,
                      search: `${isUserLoggedIn == 1
                        ? `?facilityId=${encryptDataId(
                          FacilitiesData[0]?.facilityId
                        )}`
                        : `?facilityId=${encryptDataId(
                          FacilitiesData[0]?.facilityId
                        )}` + `&redirect=${encryptDataId("/BookParks/Book_Now_Sport")}`
                        }`,
                    }}
                    className="button-9"
                  >
                    <button role="button_by">Buy  Ticket</button>
                  </Link>
                )
                  : (
                    <Link
                      to={{
                        pathname: `${isUserLoggedIn == 1 ? "/BookParks/Book_Now_Sport" : "/login-signup"
                          }`,
                        search: `${isUserLoggedIn == 1
                          ? `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}`
                          : `?facilityId=${encryptDataId(
                            FacilitiesData[0]?.facilityId
                          )}` + `&redirect=${encryptDataId("/BookParks/Book_Now_Sport")}`
                          }`,
                      }}
                      className="button-9"
                    >
                      <button role="button_by">Buy  Ticket</button>
                    </Link>
                  )
            }

            < Link
              to={{
                pathname: `${isUserLoggedIn == 1 ? "/Event_hostPage" : "/login-signup"
                  }`,
                search: `${isUserLoggedIn == 1
                  ? `?facilityId=${encryptDataId(
                    FacilitiesData[0]?.facilityId
                  )}`
                  : `?facilityId=${encryptDataId(
                    FacilitiesData[0]?.facilityId
                  )}` + `&redirect=${encryptDataId("/Event_hostPage")}`
                  }`,
              }}
              className="button-10"
            >
              <button role="button_by" className="name_button">Host Event</button>
            </Link>

          </span>

          <div className="Map_image">
            <LoadScript googleMapsApiKey={apiKey}>
              <GoogleMap
                ClassName="Map_image_Goole"
                mapContainerStyle={{ height: "300px", width: "100%" }}
                center={defaultCenter}
                zoom={8}
              >
                {/* Render markers */}
                {FacilitiesData?.map((location, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
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
        {ServiceData?.length > 0 &&
          ServiceData?.map((item, index) => (
            <div className="Service_Avilable" key={index}>
              <div className="service_item">
                <img
                  className="service_Avil_img"
                  src={Park_img}
                  alt="Parking"
                />
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
            .filter(
              (item, index, self) =>
                self.findIndex((t) => t.amenityName === item.amenityName) ===
                index
            ) // Filter unique items
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
        <h1 className="About_text">
          {FacilitiesData?.length > 0 && FacilitiesData[0]?.about}
        </h1>
      </div>
      {/* -------------------------Helpline Number ------------------------------------------ */}
      <div className="Helpline_number_conatine">
        <h1 className="Service_text">Helpline Number</h1>
        <div className="Contact_number">
          <img className="Phone_icon" src={Phone_icon}></img>
          <h1 className="Number">
            {FacilitiesData?.length > 0 && FacilitiesData[0]?.helpNumber}
          </h1>
          <h1 className="Number">9192847567</h1>
        </div>
      </div>
      {/* -------------------------Event Available ----------------------------------------------------------- */}
      <div className="Event_Available_main_conatiner">
        <h1 className="Service_text">Event Available</h1>
        <div className="Sub_Park_Details">
          {EventAvailable?.length > 0 &&
            EventAvailable?.map((item, index) => {
              return (
                <div
                  className="carousel-container"
                  ref={containerRef}
                  key={index}
                >
                  <div className="carousel-slide">
                    <img
                      className="Yoga_image"
                      src={Yoga_img}
                      alt="Event"
                    ></img>
                    <h1 className="Name_yoga"> {item.eventName}</h1>
                    <span className="Yoga_date_time">
                      <h1 className="Yoga_date">
                        Date:-{formatDate(item.eventDate)}
                      </h1>
                      <h1 className="Yoga_time">
                        Time:-{formatTime(item.eventStartTime)} -{" "}
                        {formatTime(item.eventEndTime)}
                      </h1>
                    </span>
                  </div>
                </div>
              );
            })}
          {EventAvailable?.length == 0 && <p>No events.</p>}
        </div>
      </div>
      {/*-------------------------------------------- Here Footer---------------------------------------------- */}

    </div >
  );
};

// Export Sub_Park_details ------------------------
export default Sub_Park_Details;
