// Function of Main Container ---------------------------------------
import Cardimg from "../../../assets/Card_img.png";
import sport_image2 from "../../../assets/Sport_image.jpg"
import "./Main_Body_park_deatils.css";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
// Axios for Call the API --------------------------------
import axiosHttpClient from "../../../utils/axios";
// Common footer---------------------------- ----------------
import CommonFooter from "../../../common/CommonFooter";
// Import Logo here ------------------------------ ------------------------------
import Park_Logo from "../../../assets/Ground_logo.png";
import MultiPark from "../../../assets/ama_bhoomi_multipurpose_grounds_logo-removebg-preview.png";
import Event_img from "../../../assets/ama_boomi_park_logo-removebg-preview.png";
import greenway from "../../../assets/Greenway.png"
import blueway from "../../../assets/blueways.png"
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
import { truncateName } from "../../../utils/utilityFunctions";
import instance from "../../../../env";
const Main_Body_Park_Details = () => {
  const defaultLocation = {
    latitude: 20.3010259,
    longitude: 85.7380521
  }
  // Use state ------------------------------------------------------------------
  const [DisPlayParkData, setDisPlayParkData] = useState([]);
  // const simmerUi Loader------------------------------------------------
  const [IsLoding, setIsLoding] = useState(false);
  // useSate for search -----------------------------------------------------------
  const [givenReq, setGivenReq] = useState("");
  // State variable to track selected layout type ------------------------------
  const [layoutType, setLayoutType] = useState('grid');

  // here set the latitude and longitude --------------------------------------------
  const [userLocation, setUserLocation] = useState(defaultLocation);
  // fetch facility type id --------------------------------------------------------
  let location = useLocation();
  // for Faciltiy ----------------------------------------------------------------
  const [facilityTypeId, setFacilityTypeId] = useState();
  const [selectedTab, setSelectedTab] = useState([]);
  // , 'Free', 'Paid' (for now remove free and paid u can add if needed) 
  const tabList = ['Nearby', 'Popular', 'Free', 'Paid']
  // for filter..........................................
  const filterpark = ['ChildrenPark', 'Boating', 'Skating', 'Yoga', 'Dance']

  // Use Navigate for Navigate the page ----------------------------------------------
  let navigate = useNavigate();

  // Function to handle layout change
  const handleLayoutChange = (e) => {
    setLayoutType(e.target.value);
  };

  //Here (Post the data)----------------------------------------------------------------
  async function GetParkDetails() {
    try {
      setIsLoding(true)
      let res = await axiosHttpClient("View_Park_Data", "post", {
        givenReq: givenReq,
        facilityTypeId: facilityTypeId
      });
      console.log("here Response of Park", res);
      setDisPlayParkData(res.data.data);
      setIsLoding(false);
    } catch (err) {
      console.log("here Error of Park", err);
      setIsLoding(false);
    }
  }

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
          // setUserLocation(defaultLocation);
          // sessionStorage.setItem('location', JSON.stringify(location));
          // Handle error, e.g., display a message to the user
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      toast.error('Location permission not granted.');
    }
    return;
  }

  // filter the data according to filter options -----------------------------------------------------
  async function getNearbyFacilities() {
    let bodyParams = {
      facilityTypeId: facilityTypeId,
      latitude: userLocation?.latitude || defaultLocation.latitude,
      longitude: userLocation?.longitude || defaultLocation.longitude
    };
    console.log('body params before', bodyParams);

    if (selectedTab.includes('Nearby')) {
      console.log('first');
      setUserGeoLocation();
      bodyParams = {
        ...bodyParams,
        latitude: userLocation.latitude || defaultLocation.latitude,
        longitude: userLocation.longitude || defaultLocation.latitude,
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

    console.log('body params after', bodyParams);

    try {
      setIsLoding(true)
      let res = await axiosHttpClient('VIEW_NEARBY_PARKS_API', 'post', bodyParams);
      console.log(res.data.message, res.data.data);
      setDisPlayParkData(res.data.data);
      setIsLoding(false)
    }
    catch (error) {
      console.error(error);
      toast.error('Location permission not granted.')
      setIsLoding(false)
    }
  }

  // Function to handle setting facility type ID and updating search input value ---------------------------
  const handleParkLogoClick = (e, typeid) => {
    setFacilityTypeId(typeid); // Set facility ex typeid-1,typeid-2,typeid-3
    console.log("here type id", { typeid });
  };

  // here Function to encryptDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  // on page load
  useEffect(() => {
    let facilityIdTypeFetch = decryptData(new URLSearchParams(location.search).get("facilityTypeId"));
    let givenReqFetch = new URLSearchParams(location.search).get("givenReq");
    try {
      let userLocation = JSON.parse(sessionStorage?.getItem('location'));
      setUserLocation(userLocation);
    }
    catch (error) {
      console.error('json parse error');
      sessionStorage.setItem('location', JSON.stringify({}));
    }
    // on page load, if we have facilityTypeId from homepage, 
    // then set facilityType or else set default facilityType to 1 (Parks)
    if (facilityIdTypeFetch)
      setFacilityTypeId(facilityIdTypeFetch);
    else
      setFacilityTypeId(1);

    if (givenReqFetch)
      setGivenReq(givenReqFetch);
    else
      setGivenReq('');
  }, [])

  // refresh page on searching, change in facility type or selecting filter options
  useEffect(() => {
    if (selectedTab.length > 0) {  //fetch facility details based on filter options
      console.log(selectedTab.length)
      getNearbyFacilities()
    }
    else { // fetch facility details based on selected facility type or searching value
      GetParkDetails();
    }
  }, [givenReq, facilityTypeId, selectedTab]);





// filter logic
const [isFilterOpen, setIsFilterOpen] = useState(false);

const toggleFilter = () => {
  setIsFilterOpen(!isFilterOpen);
};


  //Return here------------------------------------------------------------------------------------------------------------
  return (
    <div className="main__body__park">
      {/* here Header -----------------------------------------------------*/}
      <PublicHeader />
      {/* Here Below of header set image ---------------------------------------------------- */}
      <div
        className={`${(facilityTypeId == 1)
          ? "park-body-1"
          : (facilityTypeId == 2)
            ? "park-body-2"
            : (facilityTypeId == 3)
              ? "park-body-3"
              : ""
          }`}
      >
        <h1 className="name_park_img">
          {(facilityTypeId == 1) && "Parks"}
          {(facilityTypeId == 2) && "Playgrounds"}
          {(facilityTypeId == 3) && "Multi-purpose Grounds"}
        </h1>
      </div>
      {/* here Search  Bar  -------------------------------------------------- */}
      <div className="Search_container">
        <span className="Input_text_conatiner">
          <div className="search-container1">
            <input
              type="text"
              className="Search_input"
              placeholder="Search by Name, Location........"
              name="givenReq"
              id="givenReq"
              value={givenReq}
              onChange={(e) => setGivenReq(e.target.value)}
            />
            <div className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
        </span>
        {/* Here Button Container (Pass the id 1,2,3) ------------------------------*/}
        <span className="Button_Container">
          {/* Park */}
          <button
            onClick={(e) => handleParkLogoClick(e, 1)}
            className="image-button"
          >
            <img className="h-20" src={Event_img} alt="Event" />
            <span className="button-text">Park</span>
          </button>

          {/* Sports */}
          <button
            onClick={(e) => handleParkLogoClick(e, 2)}
            className="image-button"
          >
            <img className="h-20" src={Park_Logo} alt="Sports" />
            <span className="button-text">Playgrounds</span>
          </button>

          {/* Multipark */}
          <button
            onClick={(e) => handleParkLogoClick(e, 3)}
            className="image-button"
          >
            <img className="h-20" src={MultiPark} alt="Multipark" />
            <span className="button-text1">Multipurpose  Grounds</span>
          </button>
          {/* waterway */}
          <button
            onClick={(e) => handleParkLogoClick(e, 4)}
            className="image-button"
          >
            <img className="h-20" src={greenway} alt="Multipark" />
            <span className="button-text">Greenways</span>
          </button>
          {/* blueway */}
          <button
            onClick={(e) => handleParkLogoClick(e, 5)}
            className="image-button"
          >
            <img className="h-20" src={blueway} alt="Multipark" />
            <span className="button-text">Blueways</span>
          </button>
        </span>
      </div>
      {/* Filter According to free, paid, NearBy, ------------------ */}
      <div className="Filter_grid">
        {/* add filter option.............. */}
         <div className="Filter_grid">
        <div className="filter-container">
          <div className="filter_option" onClick={toggleFilter}>
            <div className="filter-icon">
              <FontAwesomeIcon icon={faFilter} />
            </div>
            <div className="text-filter">Filters</div>
          </div>
          {isFilterOpen && (
            <div className="filter-dropdown">
              <label>
                <input type="checkbox" name="yoga" />
                Yoga
              </label>
              <label>
                <input type="checkbox" name="boating" />
                Boating
              </label>
              <label>
                <input type="checkbox" name="garden" />
                Garden
              </label>
              <label>
                <input type="checkbox" name="dance" />
                Dance
              </label>
            </div>
          )}
        </div>
        {/* Other filter buttons and elements */}
      </div>


        <div className="filter_button">
          {
            tabList?.length > 0 && tabList?.map((tab) => {
              return (
                <button className={`button-59 ${selectedTab.includes(tab) ? 'bg-[#19ba62] text-white' : ''}`} role="button" onClick={(e) => { handleTabClick(e, tab) }}>
                  {tab}
                </button>
              )
            })
          }
        </div>
        <div className="gride_page">
          <select name="layout" id="layout" value={layoutType} onChange={handleLayoutChange}>
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
        </div>


      </div>
      {/* Heere Name of Park, sports dyamics ---------------------------------------- */}
      <span className="text_name_park">
        <h1 className="name_park">
          {(facilityTypeId == 1) && "Parks"}
          {(facilityTypeId == 2) && "Playgrounds"}
          {(facilityTypeId == 3) && "Multi-purpose Grounds"}
        </h1>
      </span>

      {/* Card Container Here -------------------------------------------- */}


      <div className="card-container">
        {IsLoding ? (
          // Show shimmer loader while data is being fetched
          <ShimmerUI />
        ) : DisPlayParkData?.length > 0 ? (
          // Conditional rendering based on layout type
          layoutType === 'grid' ? (
            DisPlayParkData?.map((item, index) => (
              <Link
                key={index}
                to={{
                  pathname: "/Sub_Park_Details",
                  search: `?facilityId=${encryptDataId(item.facilityId)}&action=view`,
                }}
              >
                <div
                  className={`${item.facilityTypeId === 1
                    ? "park-card-1"
                    : item.facilityTypeId === 2
                      ? "park-card-2"
                      : "park-card-3"
                    }`}
                  title={item.facilityname}
                >
                  {/* <img className="Card_img" src={  facilityTypeId === 1 ? Cardimg :facilityTypeId === 2 ? sport_image2  : 'park_image'} alt="Park" /> */}
                  <img className="Card_img" src={item.url ? instance().baseURL + '/static/' + item.url : (facilityTypeId === 1 ? Cardimg : facilityTypeId === 2 ? sport_image2 : 'park_image')} alt="Park" />
                  <div className="card_text">
                    <span className="Name_location">
                      <h2 className="park_name">{truncateName(item.facilityname, 25)}</h2>
                      <h3 className="park_location">{item.address}</h3>
                    </span>
                    <span className="Avil_Dis">
                      <button
                        className={`Avilable ${item.status == "open" ? "text-green-500" : "text-red-500"
                          }`}
                      >
                        {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                      </button>
                      <h3 className="distance">{Number(item.distance?.toFixed(2)) || 10} km(s)</h3>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // here Table data (Data in list)----------------------------------------------------------------
            <div className="table_Container1">
              <table>
                <thead>
                  <tr>
                    <th scope="col "  className="text-left" >Name </th>
                    <th scope="col"  className="text-left">Location</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Park Status</th>
                    <th className="left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {DisPlayParkData?.length > 0 && DisPlayParkData.map((table_item, table_index) => (
                    <tr key={table_index}>
                      <td data-label="Name" className="text-left">{table_item.facilityname}</td>
                      <td data-label="Location" className="text-left">{table_item.address}</td>
                      <td data-label='Distance'>{Number(table_item.distance?.toFixed(2)) || 10} km(s)</td>
                      <td data-label='Park Status' className={`Avilable ${table_item.status == "open" ? "text-green-500" : "text-red-500"}`}>{table_item.status?.charAt(0).toUpperCase() + table_item.status?.slice(1)}</td>
                      <td className="left text-green-700 text-xl font-medium"> {/* Wrap Details within the <td> */}
                        <Link
                          key={table_index}
                          to={{
                            pathname: "/Sub_Park_Details",
                            search: `?facilityId=${encryptDataId(table_item.facilityId)}`,
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
          <div className="no-data-message">
            {/* <img src={No_Data_icon} alt="No Data Found" /> */}
            {
              facilityTypeId == 1 || facilityTypeId == 2 ?
                <img src={No_Data_icon} alt="No Data Found" />
                : <h1 className="Comming_son"><>Coming Soon...</></h1>
            }
          </div>
        )}
      </div>




      <ToastContainer />
    </div>
  );
};

// Export Main_Body_park_details and Import to App.js ------------
export default Main_Body_Park_Details;
