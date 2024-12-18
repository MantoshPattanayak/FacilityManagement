// Function of Main Container ---------------------------------------
import Cardimg from "../../../assets/Park_image.jpg";
import sport_image2 from "../../../assets/Sport_image.jpg";
import mp_ground from "../../../assets/mp_ground_base.jpeg";
import "./Main_Body_park_deatils.css";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
// Axios for Call the API --------------------------------
import axiosHttpClient from "../../../utils/axios";
// Common footer---------------------------- ----------------
// Import Logo here ------------------------------ ------------------------------
import Playfields_img from "../../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_PLAYFIELDS.svg";
import MultiPark from "../../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_MPGROUNDS.svg";
import Parks_img from "../../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_PARKS.svg";
import greenway from "../../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_GREENWAYS.svg";
import blueway from "../../../assets/Ama_Bhoomi_Assets_Logo/AMA_BHOOMI_BLUEWAYS.svg";
// Data Not available Icon ---------------------------------------------------------------
import No_Data_icon from "../../../assets/No_Data.png";
import { useEffect, useState, useRef, useCallback } from "react";
// Import here to encrptData ------------------------------------------
import { Link, useLocation, useNavigate } from "react-router-dom";
import { decryptData, encryptData } from "../../../utils/encryptData";
import PublicHeader from "../../../common/PublicHeader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
// impport shimmerUi------------------------------------------
import ShimmerUI from "./ShimmerUI";
import { truncateName } from "../../../utils/utilityFunctions";
import instance from "../../../../env";
import { useDispatch, useSelector } from "react-redux";
const Main_Body_Park_Details = () => {
  const defaultLocation = {
    latitude: 20.3010259,
    longitude: 85.7380521,
  };
  // Use state ------------------------------------------------------------------
  const [DisPlayParkData, setDisPlayParkData] = useState([]);
  // const simmerUi Loader------------------------------------------------
  const [IsLoding, setIsLoding] = useState(false);
  // useSate for search -----------------------------------------------------------
  const [givenReq, setGivenReq] = useState("");
  // State variable to track selected layout type ------------------------------
  const [layoutType, setLayoutType] = useState("grid");

  // here set the latitude and longitude --------------------------------------------
  const [userLocation, setUserLocation] = useState(defaultLocation);
  // fetch facility type id --------------------------------------------------------
  let location = useLocation();
  // for Faciltiy ----------------------------------------------------------------
  const [facilityTypeId, setFacilityTypeId] = useState();
  const [selectedTab, setSelectedTab] = useState([]);
  // , 'Free', 'Paid' (for now remove free and paid u can add if needed)
  const tabList = ["Nearby", "Popular"]; // ['Nearby', 'Popular', 'Free', 'Paid']
  // for filter..........................................
  const [filters, setFilters] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState({
    Activity: new Array(),
    Amenities: new Array(),
    EventCategories: new Array(),
    Services: new Array(),
  });
  // use useSelector for Change the language
  const language = useSelector(
    (state) => state.language.language || localStorage.getItem("language")
  );

  // Use Navigate for Navigate the page ----------------------------------------------
  let navigate = useNavigate();

  // Function to handle layout change
  const handleLayoutChange = (e) => {
    setLayoutType(e.target.value);
  };

  //Here (Post the data)----------------------------------------------------------------
  async function GetParkDetails() {
    try {
      setIsLoding(true);
      let res = await axiosHttpClient("View_Park_Data", "post", {
        givenReq: givenReq,
        facilityTypeId: facilityTypeId,
        selectedFilter,
      });
      console.log("here Response of Park", res);
      setDisPlayParkData(res.data.data);
      setIsLoding(false);
    } catch (err) {
      console.log("here Error of Park", err);
      setIsLoding(false);
    }
  }

  //function to fetch filter options
  async function fetchFilterOptions() {
    try {
      let res = await axiosHttpClient("VIEW_FILTER_OPTIONS_API", "get");
      console.log("response of filter api", res);
      let filterOptions = {
        Activity: res.data.fetchActivityMaster[0],
        Amenities: res.data.fetchAmenitiesMaster[0],
        EventCategories: res.data.fetchEventCategories[0],
        Services: res.data.fetchServicesMaster[0],
      };
      setFilters(filterOptions);
    } catch (err) {
      console.error(err);
    }
  }

  //  function to set filter selection
  function handleFilterSelection(e, id, filterType) {
    e.preventDefault();
    let filterSelected = JSON.parse(JSON.stringify(selectedFilter));
    if (filterSelected[filterType].includes(id)) {
      // console.log('id includes...', id);
      filterSelected[filterType] = filterSelected[filterType].filter((data) => {
        return data != id;
      });
    } else {
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
      Services: [],
    });
    setIsFilterOpen(false);
    return;
  }

  // Function to handle selectedTab button click  ------------------------------
  const handleTabClick = (e, tab) => {
    if (selectedTab.includes(tab)) {
      setSelectedTab(selectedTab.filter((t) => t !== tab));
    } else {
      setSelectedTab([...selectedTab, tab]);
    }
    console.log("selectedTab", selectedTab);
  };

  // here set the userLocation -------------------------------------------------------
  function setUserGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          sessionStorage.setItem(
            "location",
            JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          );
        },
        (error) => {
          console.error("Error getting location:", error);
          // setUserLocation(defaultLocation);
          // sessionStorage.setItem('location', JSON.stringify(location));
          // Handle error, e.g., display a message to the user
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      // toast.error("Location permission not granted.");
    }
    return;
  }

  // filter the data according to filter options -----------------------------------------------------
  async function getNearbyFacilities(givenReq, facilityTypeId, selectedTab, selectedFilter) {
    let bodyParams = {
      facilityTypeId: facilityTypeId || 1,
      latitude: userLocation?.latitude || defaultLocation.latitude,
      longitude: userLocation?.longitude || defaultLocation.longitude,
      selectedFilter
    };
    console.log("body params before", bodyParams);

    if (selectedTab.includes("Nearby")) {
      console.log("first");
      setUserGeoLocation();
      bodyParams = {
        ...bodyParams,
        latitude: userLocation.latitude || defaultLocation.latitude,
        longitude: userLocation.longitude || defaultLocation.latitude,
        range: 5,
        // selectedFilter,
      };
    }
    if (selectedTab.includes("Popular")) {
      bodyParams = { ...bodyParams, popular: 1 };
    }
    // if (selectedTab.includes("Free")) {
    //   bodyParams = { ...bodyParams, free: 1 };
    // }
    // if (selectedTab.includes("Paid")) {
    //   bodyParams = { ...bodyParams, paid: 1 };
    // }

    console.log("body params after", bodyParams);

    try {
      setIsLoding(true);
      let res = await axiosHttpClient(
        "VIEW_NEARBY_PARKS_API",
        "post",
        bodyParams
      );
      console.log(res.data.message, res.data.data);
      let filterData = res.data.data;
      if(givenReq) {
        filterData = filterData.filter((park) => {
          return park.facilityname.toLowerCase().includes(givenReq.toLowerCase()) || park.address.toLowerCase().includes(givenReq.toLowerCase()) || park.status.toLowerCase().includes(givenReq.toLowerCase())})
      }
      setDisPlayParkData(filterData);
      setIsLoding(false);
    } catch (error) {
      console.error(error);
      // toast.error("Location permission not granted.");
      setIsLoding(false);
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
    let facilityIdTypeFetch = decryptData(
      new URLSearchParams(location.search).get("facilityTypeId")
    );
    let givenReqFetch = new URLSearchParams(location.search).get("givenReq");
    try {
      let userLocation = JSON.parse(sessionStorage?.getItem("location"));
      setUserLocation(userLocation);
    } catch (error) {
      console.error("json parse error");
      sessionStorage.setItem("location", JSON.stringify({}));
    }
    //api call to fetch filter options
    fetchFilterOptions();
    // on page load, if we have facilityTypeId from homepage,
    // then set facilityType or else set default facilityType to 1 (Parks)
    if (facilityIdTypeFetch) setFacilityTypeId(facilityIdTypeFetch);
    else setFacilityTypeId(1);

    if (givenReqFetch) setGivenReq(givenReqFetch);
    else setGivenReq("");
  }, []);

  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args)
      }, delay);
    }
  }

  const debouncedGetNearbyFacilities = useCallback(debounce(getNearbyFacilities, 1000), []);

  // refresh page on searching, change in facility type or selecting filter options
  useEffect(() => {
    if (selectedTab.length > 0) {
      //fetch facility details based on filter options
      console.log(selectedTab.length);
      debouncedGetNearbyFacilities(givenReq, facilityTypeId, selectedTab, selectedFilter);
    } else {
      // fetch facility details based on selected facility type or searching value
      debouncedGetNearbyFacilities(givenReq, facilityTypeId, selectedTab, selectedFilter);
    }
    console.log("selectedFilter", selectedFilter);
  }, [givenReq, facilityTypeId, selectedTab, selectedFilter]);

  // filter logic
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

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


  //  Stickey and fixed search and svg section
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Adjust this value based on when you want the section to stick
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //Return here------------------------------------------------------------------------------------------------------------
  return (
    <div className="main__body__park">
      {/* here Header -----------------------------------------------------*/}
      <PublicHeader className="header" />
      {/* Here Below of header set image ---------------------------------------------------- */}
      <div
        className={`${facilityTypeId == 1
          ? "park-body-1"
          : facilityTypeId == 2
            ? "park-body-2"
            : facilityTypeId == 3
              ? "park-body-3"
              : facilityTypeId == 4
                ? "park-body-4"
                : facilityTypeId == 5
                  ? "park-body-5"
                  : ""
          }`}
      >
        <h1 className="name_park_img">
          {facilityTypeId === 1 && language === "EN" && (
            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={Parks_img} alt="Parks Logo" />
              <h1>ESCAPE | EXPLORE | ENJOY</h1>
              <p><i>Unwind where nature thrives</i></p>
            </span>
          )}
          {facilityTypeId === 1 && language === "OD" && (
            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={Parks_img} alt="Parks Logo" />
              <h1>ବିରତ୍ତି ନିଅନ୍ତୁ | ଅନ୍ଵେଷଣ କରନ୍ତୁ | ଉପଭୋଗ କରନ୍ତୁ</h1>
              <p><i>ବିରାମ ନିଅନ୍ତୁ ଯେଉଁଠି ଚାଲେ ପ୍ରକୃତିର ରାଜ</i></p>
            </span>
          )}

          {facilityTypeId == 2 && language === "EN" && (
            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={Playfields_img}></img>
              <h1>PLAY | TRAIN | COMPETE</h1>
              <p><i>Venture into sports facilities, activities and events</i></p>
            </span>
          )}
          {facilityTypeId == 2 && language === "OD" && (
            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={Playfields_img}></img>
              <h1>ଖେଳନ୍ତୁ | ତାଲିମ ନିଅନ୍ତୁ | ପ୍ରତିଯୋଗିତା କରନ୍ତୁ</h1>
              <p><i>କ୍ରୀଡ଼ା ଭିତ୍ତିଭୂମି ଓ ସୁବିଧା, କାର୍ଯ୍ୟକଳାପ ଏବଂ ଇଭେଣ୍ଟ ଗୁଡିକୁର ଲାଭ ଉଠାନ୍ତୁ</i></p>
            </span>
          )}

          {facilityTypeId == 3 && language === "EN" && (

            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={MultiPark}></img>
              <h1>PLAN | PERFORM | PARTICIPATE</h1>
              <p><i>Discover specially crafted space that empowers community</i></p>
            </span>
          )}
          {facilityTypeId == 3 && language === "OD" && (
            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={MultiPark}></img>
              <h1>ଯୋଜନା କରନ୍ତୁ | ପ୍ରଦର୍ଶନ କରନ୍ତୁ | ଅଂଶଗ୍ରହଣ କରନ୍ତୁ</h1>
              <p><i>ସମ୍ପ୍ରଦାୟକୁ ସଶକ୍ତ କରୁଥିବା ସ୍ଵତନ୍ତ୍ର ଭାବରେ ନିର୍ମିତ ସ୍ଥାନଗୁଡିକୁ ଉପଭୋଗ କରନ୍ତୁ</i></p>
            </span>
          )}
          {facilityTypeId == 4 && language === "EN" && (
            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={blueway}></img>
              <h1>PAUSE | CAPTURE | EMBRACE</h1>
              <p><i>Uncover city’s tranquillity hidden in the waterbodies</i></p>
            </span>
          )}
          {facilityTypeId == 4 && language === "OD" && (
            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={blueway}></img>
              <h1>ବିରାମ ନିଅନ୍ତୁ | ଉପଭୋଗ କରନ୍ତୁ | ଅନୁଭବ କରନ୍ତୁ</h1>
              <p><i>ଜଳରାଶିରେ ଲୁଚି ରହିଥିବା ସହରର ଶାନ୍ତିକୁ ଅନ୍ଵେଷଣ କରନ୍ତୁ</i></p>
            </span>
          )}
          {facilityTypeId == 5 && language === "EN" && (
            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={greenway}></img>
              <h1>WALK | BREATHE | CONNECT</h1>
              <p><i>Get Moving: walk or bike around your city’s trail network</i></p>
            </span>
          )}

          {facilityTypeId == 5 && language === "OD" && (
            <span className="park_log_name_on_image">
              <img className="image_logo_with_name" src={greenway}></img>
              <h1>ଚାଲନ୍ତୁ | ନିଃଶ୍ଵାସ ନିଅନ୍ତୁ | ସଂଯୋଗ ହୁଅନ୍ତୁ</h1>
              <p><i>ଚଲାବୁଲା କରନ୍ତୁ: ଆପଣଙ୍କ ସହରର କ୍ୟୁରେଟେଡ୍ ପଥ ରେ ଚାଲନ୍ତୁ କିମ୍ବା ସାଇକେଲ ମାଧ୍ୟମରେ ବୁଲାବୁଲି କରନ୍ତୁ</i></p>
            </span>
          )}
        </h1>
      </div>
      {/* here Search  Bar  -------------------------------------------------- */}
      <div className={`Search_container ${isSticky ? "sticky" : ""}`}>
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
            <div className="search-icon-facilities">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
        </span>
        {/* Here Button Container (Pass the id 1,2,3) ------------------------------*/}
        <span className="Button_Container">
          {/* Park */}
          <button
            onClick={(e) => handleParkLogoClick(e, 1)}
            className={`image-button ${facilityTypeId == 1 ? "selected" : null
              }`}
          >
            <img className="h-20" src={Parks_img} alt="Event" />
            <span className="button-text">Parks</span>
          </button>

          {/* Sports */}
          <button
            onClick={(e) => handleParkLogoClick(e, 2)}
            className={`image-button ${facilityTypeId == 2 ? "selected" : null
              }`}
          >
            <img className="h-20" src={Playfields_img} alt="Sports" />
            <span className="button-text">Playfields</span>
          </button>

          {/* Multipark */}
          <button
            onClick={(e) => handleParkLogoClick(e, 3)}
            className={`image-button ${facilityTypeId == 3 ? "selected" : null
              }`}
          >
            <img className="h-20" src={MultiPark} alt="Multipark" />
            <span className="button-text1">
              Multipurpose Grounds
            </span>
          </button>
          {/* blueway */}
          <button
            onClick={(e) => handleParkLogoClick(e, 4)}
            className={`image-button ${facilityTypeId == 4 ? "selected" : null
              }`}
          >
            <img className="h-20" src={blueway} alt="Multipark" />
            <span className="button-text">Blueways</span>
          </button>
          {/* waterway */}
          <button
            onClick={(e) => handleParkLogoClick(e, 5)}
            className={`image-button ${facilityTypeId == 5 ? "selected" : null
              }`}
          >
            <img className="h-20" src={greenway} alt="Multipark" />
            <span className="button-text">Greenways</span>
          </button>
        </span>
      </div>
      {/* Filter According to free, paid, NearBy, ------------------ */}
      <div className="Filter_grid">
        {/* add filter option.............. */}
        <div className="flex flex-row gap-4 items-center">
          <div className="filter-container col-span-1">
            <div className="filter_option" onClick={toggleFilter}>
              <div className="filter-icon">
                <FontAwesomeIcon icon={faFilter} />
              </div>
              <div className="text-filter">Filters</div>
            </div>
            {isFilterOpen && (
              <div
                className="filter-dropdown grid grid-cols-3 gap-x-3"
                ref={filterRef}
                style={{ width: "max-content" }}
              >
                <div className="col-span-1">
                  <b>Activities</b>
                  {filters?.Activity?.length > 0 &&
                    filters.Activity.map((activity, index) => {
                      if (
                        selectedFilter.Activity.includes(
                          activity.userActivityId
                        )
                      ) {
                        return (
                          <label>
                            <input
                              type="checkbox"
                              name="boating"
                              onChange={(e) =>
                                handleFilterSelection(
                                  e,
                                  activity.userActivityId,
                                  "Activity"
                                )
                              }
                              checked={true}
                            />
                            {activity.userActivityName}
                          </label>
                        );
                      } else {
                        return (
                          <label>
                            <input
                              type="checkbox"
                              name="boating"
                              onChange={(e) =>
                                handleFilterSelection(
                                  e,
                                  activity.userActivityId,
                                  "Activity"
                                )
                              }
                              checked={false}
                            />
                            {activity.userActivityName}
                          </label>
                        );
                      }
                    })}
                </div>
                <div className="col-span-1">
                  <b>Amenities</b>
                  {filters?.Amenities?.length > 0 &&
                    filters.Amenities.map((amenity, index) => {
                      if (
                        selectedFilter.Amenities.includes(amenity.amenityId)
                      ) {
                        return (
                          <label>
                            <input
                              type="checkbox"
                              name="boating"
                              onChange={(e) =>
                                handleFilterSelection(
                                  e,
                                  amenity.amenityId,
                                  "Amenities"
                                )
                              }
                              checked
                            />
                            {amenity.amenityName}
                          </label>
                        );
                      } else {
                        return (
                          <label>
                            <input
                              type="checkbox"
                              name="boating"
                              onChange={(e) =>
                                handleFilterSelection(
                                  e,
                                  amenity.amenityId,
                                  "Amenities"
                                )
                              }
                            />
                            {amenity.amenityName}
                          </label>
                        );
                      }
                    })}
                </div>
                <div className="col-span-1">
                  <b>Services</b>
                  {filters?.Services?.length > 0 &&
                    filters.Services.map((service, index) => {
                      if (selectedFilter.Services.includes(service.serviceId)) {
                        return (
                          <label>
                            <input
                              type="checkbox"
                              name="boating"
                              onChange={(e) =>
                                handleFilterSelection(
                                  e,
                                  service.serviceId,
                                  "Services"
                                )
                              }
                              checked
                            />
                            {service.description}
                          </label>
                        );
                      } else {
                        return (
                          <label>
                            <input
                              type="checkbox"
                              name="boating"
                              onChange={(e) =>
                                handleFilterSelection(
                                  e,
                                  service.serviceId,
                                  "Services"
                                )
                              }
                            />
                            {service.description}
                          </label>
                        );
                      }
                    })}
                </div>
                <div className="cursor-pointer" onClick={clearFilterSelection}>
                  <FontAwesomeIcon icon={faTrashCan} /> Clear
                </div>
              </div>
            )}
          </div>
          {/* Other filter buttons and elements */}
          <div className="filter_button col-span-2">
            {tabList?.length > 0 &&
              tabList?.map((tab) => {
                return (
                  <button
                    className={`button-59 ${selectedTab.includes(tab) ? "bg-[#19ba62] text-white" : ""
                      }`}
                    role="button"
                    onClick={(e) => {
                      handleTabClick(e, tab);
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
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
          <select
            name="layout"
            id="layout"
            value={layoutType}
            onChange={handleLayoutChange}
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
          </select>
        </div>
      </div>
      {/* Heere Name of Park, sports dyamics ----------------------------------------
      <span className="text_name_park">
        <h1 className="name_park1">
          {facilityTypeId == 1 && "Parks"}
          {facilityTypeId == 2 && "Playgrounds"}
          {facilityTypeId == 3 && "Multipurpose Grounds"}
          {facilityTypeId == 4 && "Blueways"}
          {facilityTypeId == 5 && "Greenways"}
        </h1>
      </span> */}

      {/* Card Container Here -------------------------------------------- */}

      <div className="card-container">
        {IsLoding ? (
          // Show shimmer loader while data is being fetched
          <ShimmerUI />
        ) : DisPlayParkData?.length > 0 ? (
          // Conditional rendering based on layout type
          layoutType === "grid" ? (
            DisPlayParkData?.map((item, index) => (
              <Link
                key={index}
                to={{
                  pathname: "/Sub_Park_Details",
                  search: `?facilityId=${encryptDataId(
                    item.facilityId
                  )}&action=view`,
                }}
              >
                <div
                  className={`${item.facilityTypeId === 1
                    ? "park-card-1"
                    : item.facilityTypeId === 2
                      ? "park-card-2"
                      : item.facilityTypeId === 4
                        ? "park-card-4"
                        : "park-card-3"
                    }`}
                  title={item.facilityname}
                >
                  {/* <img className="Card_img" src={  facilityTypeId === 1 ? Cardimg :facilityTypeId === 2 ? sport_image2  : 'park_image'} alt="Park" /> */}
                  <img
                    className="Card_img"
                    src={
                      item.url
                        ? instance().baseURL + "/static" + item.url
                        : item.facilityTypeId === 1 //parks
                          ? Cardimg
                          : item.facilityTypeId === 2 //playfields
                            ? sport_image2
                            : item.facilityTypeId === 3 //mp grounds
                              ? mp_ground
                              : item.facilityTypeId === 4 //blueways
                                ? mp_ground
                                : item.facilityTypeId === 5 //greenways
                                  ? mp_ground
                                  : Cardimg
                    }
                    alt="Park"
                    onError={(e) => {
                      // Fallback to a default image if the provided URL fails
                      e.target.onerror = null; // Prevents looping
                      e.target.src =
                        item.facilityTypeId === 1
                          ? Cardimg
                          : item.facilityTypeId === 2
                            ? sport_image2
                            : item.facilityTypeId === 3 //mp grounds
                              ? mp_ground
                              : item.facilityTypeId === 4 //blueways
                                ? mp_ground
                                : item.facilityTypeId === 5 //greenways
                                  ? mp_ground
                                  : Cardimg;
                      console.log(
                        "Image Source: ",
                        item.url,
                        item.url
                          ? instance().baseURL + "/static" + item.url
                          : item.facilityTypeId === 1
                            ? Cardimg
                            : item.facilityTypeId === 2
                              ? sport_image2
                              : park_image
                      );
                    }}
                  />
                  <div className="card_text">
                    <span className="Name_location">
                      <h2 className="park_name">
                        {truncateName(item.facilityname, 25)}
                      </h2>
                      <h3 className="park_location">
                        {item.address ? truncateName(item.address, 25) : ""}
                      </h3>
                    </span>
                    <span className="Avil_Dis">
                      <button
                        className={`Avilable ${item.status == "open"
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {item.status?.charAt(0).toUpperCase() +
                          item.status?.slice(1)}
                      </button>

                      <h3 className="distance">
                        {Number(item.distance?.toFixed(2)) || 10} km(s)
                      </h3>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            // here Table data (Data in list)----------------------------------------------------------------
            <div className="Table_container_1">
              <div className="table_Container">
                <table>
                  <thead>
                    <tr>
                      <th scope="col " className="text-left">
                        Name{" "}
                      </th>
                      <th scope="col" className="text-left">
                        Location
                      </th>
                      <th scope="col">Distance</th>
                      <th scope="col">Status</th>
                      <th className="left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DisPlayParkData?.length > 0 &&
                      DisPlayParkData.map((table_item, table_index) => (
                        <tr key={table_index}>
                          <td data-label="Name" className="text-left">
                            {table_item.facilityname}
                          </td>
                          <td data-label="Location" className="text-left">
                            {table_item.address}
                          </td>
                          <td data-label="Distance">
                            {Number(table_item.distance?.toFixed(2)) || 10}{" "}
                            km(s)
                          </td>
                          <td
                            data-label="Park Status"
                            className={`Avilable ${table_item.status == "open"
                              ? "text-green-500"
                              : "text-red-500"
                              }`}
                          >
                            {table_item.status?.charAt(0).toUpperCase() +
                              table_item.status?.slice(1)}
                          </td>
                          <td className="left text-green-700 text-xl font-medium">
                            {" "}
                            {/* Wrap Details within the <td> */}
                            <Link
                              key={table_index}
                              to={{
                                pathname: "/Sub_Park_Details",
                                search: `?facilityId=${encryptDataId(
                                  table_item.facilityId
                                )}`,
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
            </div>
          )
        ) : (
          // Show message if no data is available
          <div className="no-data-message">
            {/* <img src={No_Data_icon} alt="No Data Found" /> */}
            {facilityTypeId == 1 || facilityTypeId == 2 ? (
              <img src={No_Data_icon} alt="No Data Found" />
            ) : (
              <h1 className="Comming_son">
                <>Coming Soon...</>
              </h1>
            )}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

// Export Main_Body_park_details and Import to App.js ------------
export default Main_Body_Park_Details;
