
// import css
import "./Facility_Reg.css"
// Facility Reg funcation -----------------------------
import { useState, useEffect } from "react";
import axiosHttpClient from "../../../utils/axios";
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Facility_Reg = () => {
    // useSate for page -----------------------------------------------
    const [currentStep, setCurrentStep] = useState(1);
    // Facility Data --------------------------
    const [GetServiceData, setGetServiceData] = useState([])
    const [GetAmenitiesData, setGetAmenitiesData] = useState([])
    const [FacilityTypeData, setFacilityTypeData] = useState([])
    const [fetchEventCategoryData, setfetchEventCategoryData] = useState([])
    const [fetchActivityData, setfetchActivityData] = useState([])
    // here Facility Post data ----------------------------------------------------------
    const [PostFacilityData, setPostFacilityData] = useState({
        facilityType: "",
        facilityName: "",
        longitude: "",
        latitude: "",
        address: "",
        pin: "",
        area: "",
        operatingHoursFrom: "",
        operatingHoursTo: "",
        operatingDays: {
            sun: 0,
            mon: 0,
            tue: 0,
            wed: 0,
            thu: 0,
            fri: 0,
            sat: 0,
        },  //here operating days will come in the form of array of data i.e. array of  days

        service: new Array(),  //here services will be given in the form of object
        otherServices: "", //here others will be given in the form of string
        amenity: new Array(), // here amenities will be given in the form of form of object
        otherAmenities: "", // here other amenities will be given in the form of string
        eventCategory: new Array(),
        othereventCategory: "",
        game: new Array(),
        othergame: "",
        additionalDetails: "",
        facilityImage: "",
        parkInventory: ""
    })
    // here call the api for get the initial data -----------------------------------------
    async function GetFacilityIntailData() {
        try {
            let res = await axiosHttpClient('Get_Facility_Intail_Data', 'get')
            setGetServiceData(res.data.fetchServices)
            setGetAmenitiesData(res.data.fetchAmenities)
            setFacilityTypeData(res.data.facilityType)
            setfetchEventCategoryData(res.data.fetchEventCategory)
            setfetchActivityData(res.data.fetchActivity)
            console.log(" Facility Intial Data", res)
        } catch (err) {
            console.log("here error of Facility intail data ", err)
        }
    }
    // here Post the data ------------------------------
    async function HandleSubmitFacility(e) {
        e.preventDefault();

        try {
            let res = await axiosHttpClient('Facility_Reg_Api', 'post', {
                facilityType: PostFacilityData.facilityType || null,
                facilityName: PostFacilityData.facilityName || null,
                longitude: PostFacilityData.longitude || null,
                latitude: PostFacilityData.latitude || null,
                address: PostFacilityData.address || null,
                pin: PostFacilityData.pin || null,
                area: PostFacilityData.area || null,
                operatingHoursFrom: PostFacilityData.operatingHoursFrom || null,
                operatingHoursTo: PostFacilityData.operatingHoursTo || null,
                operatingDays: PostFacilityData.operatingDays || null,
                service: PostFacilityData.service || {},
                otherServices: PostFacilityData.otherServices || null,
                amenity: PostFacilityData.amenity || {},
                eventCategory: PostFacilityData.eventCategory || {},
                othereventCategory: PostFacilityData.othereventCategory || null,
                game: PostFacilityData.game || {},
                othergame: PostFacilityData.othergame || null,
                otherAmenities: PostFacilityData.otherAmenities || null,
                additionalDetails: PostFacilityData.additionalDetails || null,
                facilityImage: PostFacilityData.facilityImage || null,
                parkInventory: PostFacilityData.parkInventory || null
            })
            console.log("here Response of Post the data of Facility", res)
        }
        catch (err) {
            console.log("here error of Facility Post Data", err)
        }
    }
    // handle Post Data-------------------------
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value, files } = e.target;
        setPostFacilityData({ ...PostFacilityData, [name]: value })
        console.log("PostFacilityData:", PostFacilityData);
    }

    // Handle Day ------------------------------
    const handleDayClick = (day, e) => {
        e.preventDefault(); // Ensure e is properly handled

        setPostFacilityData(prevState => ({
            ...prevState,
            operatingDays: {
                ...prevState.operatingDays,
                [day]: prevState.operatingDays[day] ? 0 : 1 // Toggle the value between 0 and 1
            }
        }));
        console.log("Updated operatingDays:", PostFacilityData.operatingDays);
    };

    //  Handle serviceId (set here )---------------------------------------------
    const handleServiceClick = (Id) => {
        console.log('handle service click', Id);
        console.log('PostFacilityData service 1', PostFacilityData.service);
        setPostFacilityData(prevState => {
            // If the serviceId exists, remove it, else add it
            let updatedService = [...prevState.service];
            if (updatedService.includes(Id)) {
                updatedService = updatedService.filter((service) => { return service != Id });
                // delete updatedService[`service${Id}`];
            } else {
                updatedService.push(Id);
            }
            return { ...prevState, service: updatedService };
        });
        console.log('PostFacilityData service 2', PostFacilityData.service);
    };

    // Handle Amenities Data --------------------------------------------------------------
    const handleAmenitiesClick = (amenityId) => {
        setPostFacilityData(prevState => {
            // If the serviceId exists, remove it, else add it
            let updatedamenity = [...prevState.amenity];
            if (updatedamenity.includes(amenityId)) {
                updatedamenity = updatedamenity.filter((amenity) => amenity != amenityId);
            } else {
                updatedamenity.push(amenityId);
            }
            return { ...prevState, amenity: updatedamenity };
        });
    };

    // Handle Event--------------------------------------------------------------------------------
    const handleEventClick = (eventCategoryId) => {
        setPostFacilityData(prevState => {
            // If the serviceId exists, remove it, else add it
            let updatedeventCategory = [ ...prevState.eventCategory ];
            if (updatedeventCategory.includes(eventCategoryId)) {
                updatedeventCategory = updatedeventCategory.filter((event) => event != eventCategoryId);
            } else {
                updatedeventCategory.push(eventCategoryId);
            }
            return { ...prevState, eventCategory: updatedeventCategory };
        });
    };

    // Handle Event--------------------------------------------------------------------------------
    const handleGameClick = (userActivityId) => {
        setPostFacilityData(prevState => {
            // Ensure the game object exists in the state
            let updatedgame = [ ...prevState.game ];

            // If the game exists, remove it, else add it
            if (updatedgame.includes(userActivityId)) {
                updatedgame = updatedgame.filter((game) => game != userActivityId)
            } else {
                updatedgame.push(userActivityId);
            }
            // Log the updated game object for debugging
            console.log("Updated game:", updatedgame);

            return { ...prevState, game: updatedgame };
        });
        // Log the current state for debugging
        console.log("PostFacilityData:", PostFacilityData);
    };

    //useEffect (Update data)-----------------------------------------------------------------
    useEffect(() => {
        GetFacilityIntailData()
    }, [])
    // here Prev and next page ---------------------------------------------------------------------
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };
    // Prev (Button) --------------------------------------------------------------------------------
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <div>
            <div className="all_From_conatiner">
                {currentStep === 1 && (
                    <form className="event-host_1st_Page">
                        <div className="HostEvent_container">
                            <div className="HostEvent_Heading">
                                <h1 className="verify_name_text">Step-1 (Facility details)</h1>
                                <div className="HeadingTitle9">
                                    <div></div>
                                    <h2>Facility details</h2>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Facility Type <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <select id="input2" className="input_padding" name="facilityType"
                                            value={PostFacilityData.facilityType}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled selected hidden>Select Facility Type</option>
                                            {FacilityTypeData?.length > 0 && FacilityTypeData?.map((name, index) => {
                                                return (
                                                    <option key={index} value={name.facilitytypeId}>
                                                        {name.code}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Facility Name <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder=" Please Enter the Facility Name" name="facilityName"
                                            value={PostFacilityData.facilityName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Longitude <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" className="input_padding" id="input1" name="longitude" placeholder="Please enter the Longitude "
                                            value={PostFacilityData.longitude}
                                            onChange={handleChange}

                                        />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Latitude<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder=" Please Enter the Latitude" name="latitude"
                                            value={PostFacilityData.latitude}
                                            onChange={handleChange}

                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Address<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter address of your facility" name="address"
                                            value={PostFacilityData.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Pin <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" className="input_padding" id="input1" placeholder="Enter Pin  " name="pin"
                                            value={PostFacilityData.pin}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Area <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Enter Area" name="area"
                                            value={PostFacilityData.area}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Operating From Time <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="time" className="input_padding" placeholder="Enter Pin  "
                                            name="operatingHoursFrom"
                                            value={PostFacilityData.operatingHoursFrom}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Operating To Time<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="time" id="input2" className="input_padding" placeholder="Enter Area"
                                            name="operatingHoursTo"
                                            value={PostFacilityData.operatingHoursTo}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Operating Days<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day" name="operatingDays" >
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.sun ? 'selected' : ''}`} onClick={(e) => handleDayClick('sun', e)}>Sun</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.mon ? 'selected' : ''}`} onClick={(e) => handleDayClick('mon', e)}>Mon</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.tue ? 'selected' : ''}`} onClick={(e) => handleDayClick('tue', e)}>Tue</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.wed ? 'selected' : ''}`} onClick={(e) => handleDayClick('wed', e)}>Wed</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.thu ? 'selected' : ''}`} onClick={(e) => handleDayClick('thu', e)}>Thu</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.fri ? 'selected' : ''}`} onClick={(e) => handleDayClick('fri', e)}>Fri</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.sat ? 'selected' : ''}`} onClick={(e) => handleDayClick('sat', e)}>Sat</button>
                                        </span>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Services<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {GetServiceData?.length > 0 && GetServiceData.map((item, index) => (
                                                <span key={index}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleServiceClick(item.serviceId)}
                                                        className={`button-4 ${PostFacilityData.service.includes(item.serviceId) ? 'selected' : ''}`}
                                                    >
                                                        {item.description}
                                                    </button>
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Services<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have"
                                            name="otherServices"
                                            value={PostFacilityData.otherServices}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Amenities<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {GetAmenitiesData?.length > 0 && GetAmenitiesData?.map((data, index) => (
                                                <span key={index}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleAmenitiesClick(data.amenityId)}
                                                        className={`button-4 ${PostFacilityData.amenity.includes(data.amenityId) ? 'selected' : ''}`}
                                                    >
                                                        {data.amenityName}
                                                    </button>
                                                </span>
                                            ))}
                                        </span>

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Amenities<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have"
                                            name="otherAmenities"
                                            value={PostFacilityData.otherAmenities}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Events Category<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {fetchEventCategoryData?.length > 0 && fetchEventCategoryData.map((item, index) => (
                                                <span key={index}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEventClick(item.eventCategoryId)}
                                                        className={`button-4 ${PostFacilityData.eventCategory.includes(item.eventCategoryId) ? 'selected' : ''}`}

                                                    >{item.eventCategoryName}</button>
                                                </span>
                                            ))}
                                        </span>

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Events Category<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have"
                                            name="othereventCategory"
                                            value={PostFacilityData.othereventCategory}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Game<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {fetchActivityData?.length > 0 && fetchActivityData?.map((item, index) => (
                                                <span key={index}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleGameClick(item.userActivityId)}
                                                        className={`button-4 ${PostFacilityData.game.includes(item.userActivityId) ? 'selected' : ''}`}
                                                    >{item.userActivityName}</button>
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Games<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have"
                                            name="othergame"
                                            value={PostFacilityData.othergame}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">About the Facility<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="About the Facility"
                                            name="additionalDetails"
                                            value={PostFacilityData.additionalDetails}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="container">
                                    <h2 className="Upload_Image_text">Upload Facility Image<span className="text-red-600 font-bold text-xl">*</span></h2>
                                    <div className="upload-btn-wrapper">
                                        <span className=""> <FontAwesomeIcon icon={faCloudUploadAlt} className="Upload_Iocn" /> </span>
                                        {/* <input type="file" name="myfile" accept="image/*"> </input> */}
                                        <input type="file" accept="image/*"></input>
                                    </div>
                                    <div className="image-preview" id="imagePreview"></div>
                                </div>
                                <div>
                                    <div className="container">
                                        <h2 className="Upload_Image_text">Upload Another Facility Image</h2>
                                        <div className="upload-btn-wrapper">
                                            <span className=""> <FontAwesomeIcon icon={faCloudUploadAlt} className="Upload_Iocn" /> </span>
                                            {/* <input type="file" name="myfile" accept="image/*"> </input> */}
                                            <input type="file" accept="image/*"></input>
                                        </div>
                                        <div className="image-preview" id="imagePreview"></div>
                                    </div>
                                </div>
                                {/* Two more similar rows for Heading 1 */}
                            </div>
                            <div className="buttons-container">
                                <button type="submit" className="next_button" onClick={nextStep}>Next</button>
                            </div>
                        </div>

                    </form>
                )}
                {/*------------------------------------------------------- 2nd Step from ----------------------------------------------------------- */}
                {currentStep === 2 && (
                    <form onSubmit={nextStep}>

                        <h1> From2</h1>
                        <div className="buttons-container">
                            <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                            <button type="submit" className="next_button">Next</button>
                        </div>
                    </form>
                )}
                {/*           ----------------------------------- step-3 (show the data and Submit--------------------------------------------------------------------------------------------) */}
                {currentStep === 3 && (
                    <form onSubmit={HandleSubmitFacility}>
                        <div className="HostEvent_container">
                            <div className="HostEvent_Heading">
                                <h1 className="verify_name_text">Step-1 (Facility details)</h1>
                                <div className="HeadingTitle9">
                                    <div></div>
                                    <h2>Facility details</h2>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Facility Type <span className="text-red-600 font-bold text-xl">*</span></label>

                                        <input type="text" name="facilityType" value={PostFacilityData.facilityType}></input>
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Facility Name <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder=" Please Enter the Facility Name" name="facilityName"
                                            value={PostFacilityData.facilityName}

                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Longitude <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" className="input_padding" id="input1" name="longitude" placeholder="Please enter the Longitude "
                                            value={PostFacilityData.longitude}


                                        />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Latitude<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder=" Please Enter the Latitude" name="latitude" value={PostFacilityData.latitude}/>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Address<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter address of your facility" name="address" value={PostFacilityData.address}
                                        />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Pin <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" className="input_padding" id="input1" placeholder="Enter Pin  " name="pin" value={PostFacilityData.pin} />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Area <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Enter Area" name="area" value={PostFacilityData.area}/>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Operating From Time <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="time" className="input_padding" id="input1" placeholder="Enter Pin  " name="operatingHoursFrom"
                                            value={PostFacilityData.operatingHoursFrom}
                                        />
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Operating To Time<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="time" id="input2" className="input_padding" placeholder="Enter Area" name="operatingHoursTo" value={PostFacilityData.operatingHoursTo}/>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Operating Days<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day" name="operatingDays" >
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.sun ? 'selected' : ''}`} >Sun</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.mon ? 'selected' : ''}`} >Mon</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.tue ? 'selected' : ''}`} >Tue</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.wed ? 'selected' : ''}`} >Wed</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.thu ? 'selected' : ''}`} >Thu</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.fri ? 'selected' : ''}`} >Fri</button>
                                            <button type="button" className={`button-4 ${PostFacilityData.operatingDays.sat ? 'selected' : ''}`}>Sat</button>
                                        </span>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Services<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {GetServiceData?.length > 0 && GetServiceData?.map((item, index) => (
                                                <span key={index}>
                                                    <button className="button-4" role="button" name="service" value={PostFacilityData.service}>{item.code}</button>
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Services<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have" name="otherServices" value={PostFacilityData.otherServices}/>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Amenities<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {GetAmenitiesData?.length > 0 && GetAmenitiesData?.map((data, index) => (
                                                <span key={index}>
                                                    <button class="button-4" role="button" name="amenity" value={PostFacilityData.amenity}>{data.amenityName}</button>
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Amenities<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have" name="otherAmenities"value={PostFacilityData.otherAmenities} />
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Events<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {fetchEventCategoryData?.length > 0 && fetchEventCategoryData.map((item, index) => (
                                                <span key={index}>
                                                    <button class="button-4" role="button" name="eventCategoryName">{item.eventCategoryName}</button>
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Events<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have" name="eventCategoryName"/>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Game<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <span className="Operating_day">
                                            {fetchActivityData?.length > 0 && fetchActivityData?.map((item, index) => (
                                                <span key={index}>
                                                    <button className="button-4" role="button">{item.userActivityName}</button>
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Other Games<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="Enter some other amenities if you have"/>
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">About the Facility<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="massage" id="input1" className="input_padding" placeholder="About the Facility"/>
                                    </div>
                                </div>
                                <div className="container">
                                    <h2 className="Upload_Image_text">Upload Facility Image<span className="text-red-600 font-bold text-xl">*</span></h2>
                                    <div className="upload-btn-wrapper">
                                        <span className=""> <FontAwesomeIcon icon={faCloudUploadAlt} className="Upload_Iocn" /> </span>
                                        {/* <input type="file" name="myfile" accept="image/*"> </input> */}
                                        <input type="file" accept="image/*"></input>
                                    </div>
                                    <div className="image-preview" id="imagePreview"></div>
                                </div>
                                <div>
                                    <div className="container">
                                        <h2 className="Upload_Image_text">Upload Another Facility Image</h2>
                                        <div className0="upload-btn-wrapper">
                                            <span className=""> <FontAwesomeIcon icon={faCloudUploadAlt} className="Upload_Iocn" /> </span>
                                            {/* <input type="file" name="myfile" accept="image/*"> </input> */}
                                            <input type="file" accept="image/*"></input>
                                        </div>
                                        <div className="image-preview" id="imagePreview"></div>
                                    </div>
                                </div>
                                {/* Two more similar rows for Heading 1 */}
                            </div>
                        </div>
                        {/* ----------------------------------------2nd from ------------------------------------------------ */}
                        <div className="buttons-container">
                            <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                            <button type="submit" className="next_button">Submit</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
export default Facility_Reg;