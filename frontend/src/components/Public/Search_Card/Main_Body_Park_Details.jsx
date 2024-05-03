// Function of Main Container ---------------------------------------
import Cardimg from "../../../assets/Card_img.png";
import "./Main_Body_park_deatils.css";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
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
const Main_Body_Park_Details = () => {
  // Use state ------------------------------------------------------------------
  const [DisPlayParkData, setDisPlayParkData] = useState([]);
  // const simmerUi Loader------------------------------------------------
  const[IsLoding, setIsLoding] = useState(false);
  // useSate for search -----------------------------------------------------------
  const [givenReq, setGivenReq] = useState("");
  const [userLocation, setUserLocation] = useState(JSON.parse(sessionStorage?.getItem('location')) ? JSON.parse(sessionStorage?.getItem('location')) : {
    latitude: 20.3010259,
    longitude: 85.7380521
  });
  // fetch facility type id
  let location = useLocation();
  let facilityIdTypeFetch = decryptData(
    new URLSearchParams(location.search).get("facilityTypeId")
  );
  // for Faciltiy ----------------------------------------------------------------
  const [facilityTypeId, setFacilityTypeId] = useState(1);
  const [selectedTab, setSelectedTab] = useState('');
  const tabList = ['Nearby', 'Popular', 'Free', 'Paid']
  // Use Navigate for Navigate the page ----------------------------------------------
  let navigate = useNavigate();
  //Here (Post the data)----------------------------------------------------------------
  async function GetParkDetails() {
    try {
       setIsLoding(true)
      let res = await axiosHttpClient("View_Park_Data", "post", {
        givenReq: givenReq,
        facilityTypeId: facilityTypeId,
      });
      console.log("here Response of Park", res);
      setDisPlayParkData(res.data.data);
      setIsLoding(false);
    } catch (err) {
      console.log("here Error of Park", err);
      setIsLoding(false);
    }
  }

  // Function to handle selectedTab button click
  const handleTabClick = (e, tab) => {
    // Toggle game selection
    if (selectedTab != tab) {
      setSelectedTab(tab);
      // if(tab == 'Nearby') {
        getNearbyFacilities(e);
      // }
    }
    else if(selectedTab == tab) {   // if same tab selected, then clear tab selection, and show default facility data
      setSelectedTab('');
      GetParkDetails();
    } 
    else {
      // continue
    }
    console.log('selectedTab', selectedTab);
  }

  function setUserGeoLocation(location){
    setUserLocation(location);
    sessionStorage.setItem('location', JSON.stringify(location));
    return;
  }

  async function getNearbyFacilities(e){
    e?.preventDefault();
    console.log('nearby facilities', userLocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserGeoLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserGeoLocation({
            latitude: 20.3010259,
            longitude: 85.7380521
          });
          // Handle error, e.g., display a message to the user
        }
      );

      let bodyParams = {};
      switch(selectedTab){    // ['Nearby', 'Popular', 'Free', 'Paid']
        case 'Nearby':
          bodyParams = {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            facilityTypeId: facilityTypeId,
            range: ''
          }
          break;
        case 'Popular': bodyParams = {popular:1}; break;
        case 'Free': bodyParams = {free:1}; break;
        case 'Paid': bodyParams = {paid:1}; break;
        default: break;
      }

      try{
        setIsLoding(true)
        let res = await axiosHttpClient('VIEW_NEARBY_PARKS_API', 'post', bodyParams);
        console.log(res.data.message, res.data.data);
        setDisPlayParkData(res.data.data);
        setIsLoding(false)
      }
      catch(error){
        console.error(error);
        toast.error('Location permission not granted.')
        setIsLoding(false)
      }
    } else {
      console.error('Geolocation is not supported by this browser');
      toast.error('Location permission not granted.')
 
      // Handle case where Geolocation API is not supported
    }
  }

  // Function to handle setting facility type ID and updating search input value ---------------------------
  const handleParkLogoClick = (e, typeid) => {
    setFacilityTypeId(typeid); // Set facility ex typeid-1,typeid-2,typeid-3
    console.log("here type id, selectedTab", {typeid, selectedTab});
    if(!selectedTab){
      GetParkDetails();
    }
    else{
      getNearbyFacilities(e);
    }
  };
  // here Funcation to encrotDataid (Pass the Id)----------------------------------------------
  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }
  // Get the data for autoSuggestion  --------------------------------------------------------
  // async function getAutoSuggest(){
  //     try{
  //         let res= await axiosHttpClient('ADMIN_USER_AUTOSUGGEST_API', 'get' ,null,  givenReq)
  //            console.log("here Response of Auto  Suggest", res)
  //     }
  //     catch(err){
  //         console.log("here error", err)
  //     }
  // }
  // useEffect for Update the data (Call the Api) ------------------------------------------------
  useEffect(() => {
    if(selectedTab == '' || selectedTab == null){
      console.log('facilityTypeId useeffect - tab not selected! call getParkDetails()');
      GetParkDetails();
    }
    else{
      getNearbyFacilities();
      console.log('facilityTypeId useeffect - tab selected... not call getNearbyFacilities()');
    }
    // getAutoSuggest()
  }, [givenReq, facilityTypeId]);

  // useEffect(() => {
  //   GetParkDetails();
  // }, [])

  useEffect(() => {
    console.log('selectedTab useeffect - tab selected... not call getParkDetails()');
  }, [userLocation, selectedTab]);
 
  //Return here------------------------------------------------------------------------------------------------------------
  return (
    <div className="main__body__park">
      {/* here Header -----------------------------------------------------*/}
      <PublicHeader />
      {/* Here Below of header set image ---------------------------------------------------- */}
      <div
        className={`${
          facilityTypeId === 1
            ? "park-body-1"
            : facilityTypeId === 2
            ? "park-body-2"
            : facilityTypeId === 3
            ? "park-body-3"
            : ""
        }`}
      >
        <h1 className="name_park_img">
          {facilityTypeId === 1 && "Parks"}
          {facilityTypeId === 2 && "Sports"}
          {facilityTypeId === 3 && "Multi-purpose Grounds"}
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
            <img className="h-14" src={Event_img} alt="Event" />
            <span className="button-text">Park</span>
          </button>

          {/* Sports */}
          <button
            onClick={(e) => handleParkLogoClick(e, 2)}
            className="image-button"
          >
            <img className="h-14" src={Park_Logo} alt="Sports" />
            <span className="button-text">Sports</span>
          </button>

          {/* Multipark */}
          <button
            onClick={(e) => handleParkLogoClick(e, 3)}
            className="image-button"
          >
            <img className="h-14" src={MultiPark} alt="Multipark" />
            <span className="button-text">Multipark</span>
          </button>
        </span>
      </div>
      {/* Filter According to free, paid, NearBy, ------------------ */}
      <div className="Filter_grid">
        <div className="filter_button">
          {
            tabList?.length > 0 && tabList?.map((tab) => {
              return (
                <button className={`button-59 ${selectedTab == tab ? 'bg-[#19ba62] text-white' : ''}`} role="button" onClick={(e) => {handleTabClick(e, tab)}}>
                  {tab}
                </button>
              )
            })
          }
          {/* <button class="button-59" role="button" onClick={(e) => {getNearbyFacilities(e); handleTabClick()}}>
            NearBy
          </button>
          <button class="button-59" role="button">
            Popular
          </button>
          <button class="button-59" role="button">
            Free
          </button>
          <button class="button-59" role="button">
            Paid
          </button> */}
        </div>
        <div className="gride_page"></div>
      </div>
      {/* Heere Name of Park, sports dyamics ---------------------------------------- */}
      <span className="text_name_park">
        <h1 className="name_park">
          {facilityTypeId === 1 && "Parks"}
          {facilityTypeId === 2 && "Sports"}
          {facilityTypeId === 3 && "Multi-purpose Grounds"}
        </h1>
      </span>

      {/* Card Container Here -------------------------------------------- */}

     
      <div className="card-container">
      {IsLoding ? (
        // Show shimmer loader while data is being fetched
        <ShimmerUI />
      ) : DisPlayParkData?.length > 0 ? (
        DisPlayParkData?.map((item, index) => (
          <Link
            key={index}
            to={{
              pathname: "/Sub_Park_Details",
              search: `?facilityId=${encryptDataId(item.facilityId)}&action=view`,
            }}
          >
            <div
              className={`${
                item.facilityTypeId === 1
                  ? "park-card-1"
                  : item.facilityTypeId === 2
                  ? "park-card-2"
                  : "park-card-3"
              }`}
            >
              <img className="Card_img" src={Cardimg} alt="Park" />
              <div className="card_text">
                <span className="Name_location">
                  <h2 className="park_name">{item.facilityname}</h2>
                  <h3 className="park_location">{item.address}</h3>
                </span>
                <span className="Avil_Dis">
                  <button
                    className={`Avilable ${
                      item.status == "open" ? "text-green-500" : "text-red-500"
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
        // Show message if no data is available
        <div className="no-data-message">
          <img src={No_Data_icon} alt="No Data Found" />
        </div>
      )}
    </div>
      <CommonFooter />
      <ToastContainer/>
    </div>
  );
};

// Export Main_Body_park_details and Import to App.js ------------
export default Main_Body_Park_Details;
