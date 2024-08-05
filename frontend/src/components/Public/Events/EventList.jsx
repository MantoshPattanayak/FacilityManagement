import React, { useRef } from 'react'
import './EventList.css'
import Cardimg from "../../../assets/Card_img.png";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCalendarDays, faLocationDot, faClock, faFilter, faTrashCan } from "@fortawesome/free-solid-svg-icons";
// Axios for Call the API --------------------------------
import axiosHttpClient from "../../../utils/axios";
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
import instance from '../../../../env';

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
  const [userLocation, setUserLocation] = useState(defaultLocation);
  const [selectedTab, setSelectedTab] = useState('');
  const tabList = ['Nearby', 'Popular', 'Free', 'Paid']
  const [filters, setFilters] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState({
    Activity: new Array(),
    Amenities: new Array(),
    EventCategories: new Array(),
    Services: new Array()
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  //  function to set filter selection
  function handleFilterSelection(e, id, filterType) {
    e.preventDefault();
    let filterSelected = JSON.parse(JSON.stringify(selectedFilter));
    if (filterSelected[filterType].includes(id)) {
      // console.log('id includes...', id);
      filterSelected[filterType] = filterSelected[filterType].filter((data) => { return data != id });
    }
    else {
      filterSelected[filterType].push(id);
    }
    setSelectedFilter(filterSelected);
    return;
  }

  //function to clear all filter selection
  function clearFilterSelection(e) {
    // e.preventDefault();
    setSelectedFilter({
      Activity: [],
      Amenities: [],
      EventCategories: [],
      Services: []
    });
    setIsFilterOpen(false);
    return;
  }

  // Function to handle layout change
  const handleLayoutChange = (e) => {
    setLayoutType(e.target.value);
  };

  //Here (Post the data)----------------------------------------------------------------
  async function GetEventDetails() {
    let bodyParams = {
      // latitude, longitude, range, popular, free, paid, order, selectedFilter
      givenReq: givenReq,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude
    };
    console.log('body params before', bodyParams);

    if (selectedTab.includes('Nearby')) {
      setUserGeoLocation();
      bodyParams = {
        ...bodyParams,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        range: ''
      }
    }
    if (selectedTab.includes('Popular')) {
      bodyParams = { ...bodyParams, popular: 1 };
    }
    if (selectedTab.includes('Free')) {
      bodyParams = { ...bodyParams, free: 1 };
    }
    if (selectedTab.includes('Paid')) {
      bodyParams = { ...bodyParams, paid: 1 };
    }
    //add to selected filter options
    bodyParams ={ ...bodyParams, selectedFilter };
    console.log('body params after', bodyParams);

    try {
      setIsLoding(true)
      let res = await axiosHttpClient("VIEW_EVENTS_LIST_API", "post", bodyParams);
      console.log("Event details data response", res);
      setEventListData(res.data.Eventactivities);
      setIsLoding(false);
    } catch (err) {
      console.log("here Error of Park", err);
      setIsLoding(false);
    }
  }

  //API call to fetch event filter data
  async function getEventFilterOption() {
    try {
      let res = await axiosHttpClient('VIEW_FILTER_OPTIONS_API', 'get');
      console.log("events filter options", res.data);
      let filterOptions = {
        Activity: res.data.fetchActivityMaster[0],
        Amenities: res.data.fetchAmenitiesMaster[0],
        EventCategories: res.data.fetchEventCategories[0],
        Services: res.data.fetchServicesMaster[0]
      }
      setFilters(filterOptions);
    }
    catch (error) {
      console.error(error);
    }
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Function to handle selectedTab button click  ------------------------------
  const handleTabClick = (e, tab) => {
    if (selectedTab.includes(tab)) {
      setSelectedTab(selectedTab.filter(t => t !== tab));
    } else {
      setSelectedTab([...selectedTab, tab]);
    }
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

  // here Function to encryptDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  // on page load, set title
  useEffect(() => {
    document.title = 'Events | AMA BHOOMI';
    getEventFilterOption();
  }, [])

  // refresh page on searching, change in selecting filter options
  useEffect(() => {
    GetEventDetails();
  }, [givenReq, selectedTab, selectedFilter]);

  //When Click on outside filter it will close............................................
  const filterRef = useRef(null); // Ref for the filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="event-main__body__park">
      <PublicHeader />
      {/* here Header -----------------------------------------------------*/}

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

        {/* add filter option.............. */}
        <div className="grid grid-cols-5 items-center w-fit">
          <div className="filter-container col-span-1 w-fit">
            <div className="filter_option" onClick={toggleFilter}>
              <div className="filter-icon">
                <FontAwesomeIcon icon={faFilter} />
              </div>
              <div className="text-filter">Filters</div>
            </div>
            {isFilterOpen && (
              <div className="filter-dropdown grid grid-cols-1 gap-x-3" ref={filterRef} style={{width:"max-content"}}>
                {/* <div className="col-span-1">
                  <b>Activities</b>
                  {
                    filters?.Activity?.length > 0 && filters.Activity.map((activity, index) => {
                      if (selectedFilter.Activity.includes(activity.userActivityId)) {
                        return (
                          <label>
                            <input type="checkbox" name="boating" onChange={(e) => handleFilterSelection(e, activity.userActivityId, 'Activity')} checked={true} />
                            {activity.userActivityName}
                          </label>
                        )
                      }
                      else {
                        return (
                          <label>
                            <input type="checkbox" name="boating" onChange={(e) => handleFilterSelection(e, activity.userActivityId, 'Activity')} checked={false} />
                            {activity.userActivityName}
                          </label>
                        )
                      }
                    })
                  }
                </div>
                <div className="col-span-1">
                  <b>Amenities</b>
                  {
                    filters?.Amenities?.length > 0 && filters.Amenities.map((amenity, index) => {
                      if (selectedFilter.Amenities.includes(amenity.amenityId)) {
                        return (
                          <label>
                            <input type="checkbox" name="boating" onChange={(e) => handleFilterSelection(e, amenity.amenityId, 'Amenities')} checked />
                            {amenity.amenityName}
                          </label>
                        )
                      }
                      else {
                        return (
                          <label>
                            <input type="checkbox" name="boating" onChange={(e) => handleFilterSelection(e, amenity.amenityId, 'Amenities')} />
                            {amenity.amenityName}
                          </label>
                        )
                      }
                    })
                  }
                </div>
                <div className="col-span-1">
                  <b>Services</b>
                  {
                    filters?.Services?.length > 0 && filters.Services.map((service, index) => {
                      if (selectedFilter.Services.includes(service.serviceId)) {
                        return (
                          <label>
                            <input type="checkbox" name="boating" onChange={(e) => handleFilterSelection(e, service.serviceId, 'Services')} checked />
                            {service.description}
                          </label>
                        )
                      }
                      else {
                        return (
                          <label>
                            <input type="checkbox" name="boating" onChange={(e) => handleFilterSelection(e, service.serviceId, 'Services')} />
                            {service.description}
                          </label>
                        )
                      }
                    })
                  }
                </div> */}
                <div className="col-span-1">
                  <b>Event Category</b>
                  {
                    filters?.EventCategories?.length > 0 && filters.EventCategories.map((eventCategory, index) => {
                      if (selectedFilter.EventCategories.includes(eventCategory.eventCategoryId)) {
                        return (
                          <label>
                            <input type="checkbox" onChange={(e) => handleFilterSelection(e, eventCategory.eventCategoryId, 'EventCategories')} checked />
                            {eventCategory.eventCategoryName}
                          </label>
                        )
                      }
                      else {
                        return (
                          <label>
                            <input type="checkbox" onChange={(e) => handleFilterSelection(e, eventCategory.eventCategoryId, 'EventCategories')} />
                            {eventCategory.eventCategoryName}
                          </label>
                        )
                      }
                    })
                  }
                </div>
                <div className="cursor-pointer" onClick={clearFilterSelection}>
                  <FontAwesomeIcon icon={faTrashCan} /> Clear
                </div>
              </div>
            )}
          </div>
          {/* Other filter buttons and elements */}
          <div className="event-filter_button col-span-4 w-fit">
            {
              tabList?.length > 0 && tabList?.map((tab) => {
                return (
                  <button className={`event-button-59 ${selectedTab.includes(tab) ? 'bg-[#19ba62] text-white' : ''}`} role="button" onClick={(e) => { handleTabClick(e, tab) }}>
                    {tab}
                  </button>
                )
              })
            }
          </div>
        </div>


        {/* <div className="filter_button">
          {
            tabList?.length > 0 && tabList?.map((tab) => {
              return (
                <button className={`button-59 ${selectedTab.includes(tab) ? 'bg-[#19ba62] text-white' : ''}`} role="button" onClick={(e) => { handleTabClick(e, tab) }}>
                  {tab}
                </button>
              )
            })
          }
        </div> */}
        <div className="gride_page">
          <select name="layout" id="layout" value={layoutType} onChange={handleLayoutChange}>
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
        </div>
      </div>


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
                  <img 
                    className="Card_img"
                    src={item.eventMainImage ? instance().baseURL + '/static' + item.eventMainImage : EventCardPic}
                    alt="Event Image"
                  />
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
                        className={`event-Avilable ${item.status == "ACTIVE" ? "text-green-500" : "text-red-500"}`}
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
                    <th scope="col">Event Date</th>
                    <th scope="col">Event Timing</th>
                    <th scope="col">Location</th>
                    <th scope="col">Distance</th>
                    <th className="event-left">Event Details</th>
                  </tr>
                </thead>
                <tbody>
                  {eventListData?.length > 0 && eventListData.map((table_item, table_index) => (
                    <tr key={table_index}>
                      <td data-label="Name">{truncateName(table_item.eventName, 40)}</td>
                      <td data-label="Event Date">{formatDate(table_item.eventDate)}</td>
                      <td data-label="Event Timing">{formatTime(table_item.eventStartTime)} - {formatTime(table_item.eventEndTime)}</td>
                      <td data-label="Location">{truncateName(table_item.locationName, 40)}</td>
                      <td data-label="Distance">{Number(table_item.distance?.toFixed(2)) || 10} km(s)</td>
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
      <ToastContainer />

    </div>
  )
}
