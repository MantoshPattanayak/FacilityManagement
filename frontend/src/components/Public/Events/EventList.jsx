import React from 'react'
import '../Events/EventList.css'
import Cardimg from "../../../assets/Card_img.png";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCalendarDays, faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";
// Axios for Call the API --------------------------------
import axiosHttpClient from "../../../utils/axios";
// Common footer---------------------------- ----------------
import CommonFooter from "../../../common/CommonFooter";
// Import Logo here ------------------------------ ------------------------------
import Park_Logo from "../../../assets/Ground_logo.png";
import MultiPark from "../../../assets/ama_bhoomi_multipurpose_grounds_logo-removebg-preview.png";
import Event_img from "../../../assets/ama_boomi_park_logo-removebg-preview.png";
// Data Not available Icon ---------------------------------------------------------------
import No_Data_icon from "../../../assets/No_Data_icon.png";
import { useEffect, useState } from "react";
// Import here to encrptData ------------------------------------------
import { Link, useLocation, useNavigate } from "react-router-dom";
import { decryptData, encryptData } from "../../../utils/encryptData";
import PublicHeader from "../../../common/PublicHeader";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
// impport shimmerUi------------------------------------------
import ShimmerUI from "./ShimmerUI";
import { truncateName, formatDate, formatTime } from '../../../utils/utilityFunctions';
import EventCardPic from '../../../assets/odissi-dance-image.jpg';

export default function EventList() {

  const defaultLocation = {
    latitude: 20.3010259,
    longitude: 85.7380521
  }
  // Use state ------------------------------------------------------------------
  const [eventListData, setEventListData] = useState([]);
  // const simmerUi Loader------------------------------------------------
  const [IsLoding, setIsLoding] = useState(false);
  // useSate for search -----------------------------------------------------------
  const [givenReq, setGivenReq] = useState("");
  // State variable to track selected layout type ------------------------------
  const [layoutType, setLayoutType] = useState('grid');

  // here set the latitude and longitude --------------------------------------------
  const [userLocation, setUserLocation] = useState();
  // fetch facility type id --------------------------------------------------------
  let location = useLocation();
  const [selectedTab, setSelectedTab] = useState('');
  const tabList = ['Nearby', 'Popular', 'Free', 'Paid']

  // Use Navigate for Navigate the page ----------------------------------------------
  let navigate = useNavigate();

  // Function to handle layout change
  const handleLayoutChange = (e) => {
    setLayoutType(e.target.value);
  };

  //Here (Post the data)----------------------------------------------------------------
  async function GetEventDetails() {
    try {
      setIsLoding(true)
      let res = await axiosHttpClient("VIEW_EVENTS_LIST_API", "post", {
        givenReq: givenReq
      });
      console.log("Event details data response", res);
      setEventListData(res.data.Eventactivities);
      setIsLoding(false);
    } catch (err) {
      console.log("here Error of Park", err);
      setIsLoding(false);
    }
  }

  // Function to handle selectedTab button click  ------------------------------
  const handleTabClick = (e, tab) => {
    if (tab != selectedTab)
      setSelectedTab(tab);
    else
      setSelectedTab();
    console.log('selectedTab', selectedTab);
  }

  // here set the userLocation -------------------------------------------------------
  function setUserGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          sessionStorage.setItem('location', JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      toast.error('Location permission not granted.');
    }
    return;
  }

  // filter the data according to filter options -----------------------------------------------------
  async function getFilteredData() {
    let bodyParams = {};
    switch (selectedTab) {    // ['Nearby', 'Popular', 'Free', 'Paid']
      case 'Nearby':
        setUserGeoLocation();
        bodyParams = {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          range: ''
        }
        break;
      case 'Popular': bodyParams = { popular: 1 }; break;
      case 'Free': bodyParams = { free: 1 }; break;
      case 'Paid': bodyParams = { paid: 1 }; break;
      default: break;
    }

    try {
      setIsLoding(true)
      let res = await axiosHttpClient('VIEW_NEARBY_PARKS_API', 'post', bodyParams);
      console.log(res.data.message, res.data.data);
      setEventListData(res.data.data);
      setIsLoding(false)
    }
    catch (error) {
      console.error(error);
      toast.error('Location permission not granted.')
      setIsLoding(false)
    }
  }

  // here Function to encryptDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  // on page load, set title
  useEffect(() => {
    document.title = 'Events | AMA BHOOMI';
  }, [])

  // refresh page on searching, change in facility type or selecting filter options
  useEffect(() => {
    if (selectedTab) {  //fetch facility details based on filter options
      getFilteredData()
    }
    else { // fetch facility details based on selected facility type or searching value
      GetEventDetails();
    }
  }, [givenReq, selectedTab]);




  return (
    <div className="event-main__body__park">
    {/* here Header -----------------------------------------------------*/}
    <PublicHeader />
    {/* Here Below of header set image ---------------------------------------------------- */}
    <div
      className="event-body"
    >
      <h1 className="event-name_park_img">
        Events
      </h1>
    </div>
    {/* here Search  Bar  -------------------------------------------------- */}
    <div className="event-Search_container">
      <span className="event-Input_text_conatiner">
        <div className="event-search-container1">
          <input
            type="text"
            className="event-Search_input"
            placeholder="Search by Name, Location........"
            name="givenReq"
            id="givenReq"
            value={givenReq}
            onChange={(e) => setGivenReq(e.target.value)}
          />
          <div className="event-search-icon">
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </div>
      </span>
    </div>
    {/* Filter According to free, paid, NearBy, ------------------ */}
    <div className="event-Filter_grid">
      <div className="event-filter_button">
        {
          tabList?.length > 0 && tabList?.map((tab) => {
            return (
              <button className={`button-59 ${selectedTab == tab ? 'bg-[#19ba62] text-white' : ''}`} role="button" onClick={(e) => { handleTabClick(e, tab) }}>
                {tab}
              </button>
            )
          })
        }
      </div>
      <div class="event-gride_page">
        <select name="layout" id="layout" value={layoutType} onChange={handleLayoutChange}>
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
      </div>
    </div>

    {/* Heere Name of Park, sports dyamics ---------------------------------------- */}
    {/* <span className="event-text_name_park">
      <h1 className="event-name_park">
        Events
      </h1>
    </span> */}

    {/* Card Container Here -------------------------------------------- */}


    <div className="event-card-container">
      {IsLoding ? (
        // Show shimmer loader while data is being fetched
        <ShimmerUI />
      ) : eventListData?.length > 0 ? (
        // Conditional rendering based on layout type
        layoutType === 'grid' ? (
          eventListData?.map((item, index) => (
            <Link
              key={index}
              to={{
                pathname: "/events-details",
                search: `?eventId=${encryptDataId(item.eventId)}`,
              }}
            >
              <div
                className="event-park-card-1"
                title={item.eventName}
              >
                <img className="event-Card_img" src={EventCardPic} alt="Park" />
                <div className="event-card_text">
                  <span className="event-Name_location">
                    <h2 className="event-park_name">{truncateName(item.eventName, 25)}</h2>
                    <h3 className="event-park_location"><FontAwesomeIcon icon={faLocationDot} /> &nbsp;{truncateName(item.locationName, 25)}</h3>
                    <div className='flex gap-x-2 justify-between'>
                      <h4 className='event-park_location'><FontAwesomeIcon icon={faCalendarDays} /> &nbsp;{formatDate(item.eventDate)}</h4>
                      <h4 className='event-time-details'><FontAwesomeIcon icon={faClock} /> &nbsp;{formatTime(item.eventStartTime)} - {formatTime(item.eventEndTime)}</h4>
                    </div>
                  </span>
                  <span className="event-Avil_Dis">
                    <button
                      className={`event-Avilable ${item.status == "ACTIVE" ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                    </button>
                    <h3 className="event-distance">{Number(item.distance?.toFixed(2)) || 10} km(s)</h3>
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          // here Table data (Data in list)----------------------------------------------------------------
          <div className="event-table_Container1">
            <table>
              <thead>
                <tr>
                  <th scope="col">Name of the Event</th>
                  <th scope="col">Location</th>
                  <th className="event-left">Event Details</th>
                </tr>
              </thead>
              <tbody>
                {eventListData?.length > 0 && eventListData.map((table_item, table_index) => (
                  <tr key={table_index}>
                    <td data-label="Name">{truncateName(table_item.eventName, 40)}</td>
                    <td data-label="Location">{truncateName(table_item.locationName, 40)}</td>
                    <td className="left text-green-700 text-xl font-medium"> {/* Wrap Details within the <td> */}
                      <Link
                        key={table_index}
                        to={{
                          pathname: "/event-details",
                          search: `?eventId  =${encryptDataId(table_item.eventId)}`,
                        }}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        )
      ) : (
        // Show message if no data is available
        <div className="event-no-data-message">
          <img src={No_Data_icon} alt="No Data Found" />
        </div>
      )}
    </div>



    <CommonFooter />
    <ToastContainer />
  </div>
  )
}
