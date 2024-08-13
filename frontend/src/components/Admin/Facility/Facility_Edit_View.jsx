// import css---------------------------------------------------------
import "./Facility_Reg.css";
// Facility Reg funcation ---------------------------------------------
import { useState, useEffect } from "react";
import axiosHttpClient from "../../../utils/axios";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTimes, faEye } from '@fortawesome/free-solid-svg-icons';
import verfiy_img from "../../../assets/verify_img.png"
// import header and Footer-----------------------------
import AdminHeader from '../../../common/AdminHeader'
//Toast -----------------------------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { decryptData } from "../../../utils/encryptData";
const Facility_Edit_View = () => {
    const action = new URLSearchParams(location.search).get('action');
    const facilityTypeId = decryptData(
        new URLSearchParams(location.search).get("facilityTypeId")
    );
    const facilityId = decryptData(
        new URLSearchParams(location.search).get("facilityId")
    );
    console.log("Decrypt data", facilityTypeId, facilityId);
    let navigate = useNavigate();
    // useSate for page -------------------------------------------------
    const [currentStep, setCurrentStep] = useState(1);
    // Facility Data get from Getintial Fun ------------------------------
    const [GetServiceData, setGetServiceData] = useState([]);
    const [GetAmenitiesData, setGetAmenitiesData] = useState([]);
    const [FacilityTypeData, setFacilityTypeData] = useState([]);
    const [fetchEventCategoryData, setfetchEventCategoryData] = useState([]);
    const [fetchActivityData, setfetchActivityData] = useState([]);
    const [Invantory, setInvantory] = useState([])
    // here disabled use for Remove and dispable the placeholder of Onwer details -
    const [disabledFields, setDisabledFields] = useState(false);
    // here set the error ---------------------------------------------------
    const [formErrors, setformErrors] = useState([]);
    const [isPlayGround, setIsPlayGround] = useState(false);
    // Edit Post the data start ----------------------------😆😆✈✈✈✈
    // here use this useSate to store the DisPlay Facility Data --------------
    const [initialFacilityDataStore, setinitialFacilityDataStore] = useState({})
    // here Facility Post data ----------------------------------------------
    const [PostFacilityData, setPostFacilityData] = useState({
        facilityId:"",
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
        }, //here operating days will come in the form of array of data i.e. array of  days
        service: new Array(), //here services will be given in the form of object
        otherServices: "", //here others will be given in the form of string
        amenity: new Array(), // here amenities will be given in the form of form of object
        otherAmenities: "", // here other amenities will be given in the form of string
        eventCategory: new Array(),
        othereventCategory: "",
        game: new Array(),
        othergame: "",
        additionalDetails: "",
        facilityImage: {  // Facility Image Upload -----------------------
            facilityImageOne: "",
            facilityArrayOfImages: [],
        },
        parkInventory: [],
        // Post owner data ------------------------------------------------
        facilityisownedbBDA: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        emailAdress: "",
        ownerPanCard: "",
        ownership: "",
        ownersAddress1: "",
        fileNames: {  // New state to store file names ----------------------
            facilityImageOne: "",
            facilityArrayOfImages: []
        }
    });
    // here call the api for get the initial data ---------------------------
    async function GetFacilityInitailData() {
        try {
            let res = await axiosHttpClient("Get_Facility_Intail_Data", "get");
            setGetServiceData(res.data.fetchServices);
            setGetAmenitiesData(res.data.fetchAmenities);
            setFacilityTypeData(res.data.facilityType);
            setfetchEventCategoryData(res.data.fetchEventCategory);
            setfetchActivityData(res.data.fetchActivity);
            setInvantory(res.data.fetchInventory)
            console.log(" Facility Intial Data", res);
        } catch (err) {
            console.log("here error of Facility intail data ", err);
        }
    }
    // here Api of View Facility Data --------------------------------------
    // Function to handle changes in the input fields
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value, files } = e.target;
        // Handle image uploads
        if (name === "facilityImageOne" || name === "facilityArrayOfImages") {
            handleImageUpload(name, files);
        } else if (name === "facilityisownedbBDA") {
            const isOwnerByBDA = value === "Yes";
            setPostFacilityData((prevData) => ({
                ...prevData,
                [name]: value
            }));
            setDisabledFields(isOwnerByBDA);
            if (isOwnerByBDA) {
                // Reset input fields if user selects "Yes"
                setPostFacilityData((prevData) => ({
                    ...prevData,
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    emailAdress: "",
                    ownerPanCard: "",
                    ownersAddress: ""
                }));
                toast.info("No fields are required!");
                setformErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
            }
        } else if (name === "facilityType") {
            // Handle other input changes
            setPostFacilityData((prevData) => ({
                ...prevData,
                [name]: value
            }));
            setIsPlayGround(Number(value) === 2); // Check true and false
        } else if (name in PostFacilityData.facilityData) {
            setPostFacilityData((prevData) => ({
                ...prevData,
                facilityData: {
                    ...prevData.facilityData,
                    [name]: value
                }
            }));
        } else {
            setPostFacilityData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };
    // Display facility data
    async function DisplayFacilityData() {
        try {
            let res = await axiosHttpClient('Facility_Update_View_By_ID_Api', 'post', {
                facilityId,
                facilityTypeId
            });
            console.log("Response11 of Display Facility Data", res.data);
            const {
                amenity,
                eventCategory,
                facilityArrayOfImages,
                facilityData,
                facilityImageOne,
                game,
                ownersAddress,
                parkInventory,
                service
            } = res.data;
            const fetchDataDisplayFacility = {
                amenity: amenity.map(acc => acc.amenityId) || [],
                eventCategory: eventCategory.map(ec => ec.eventCategoryId) || [],
                facilityArrayOfImages: facilityArrayOfImages || [],
                facilityData: {
                    ...PostFacilityData.facilityData,
                    ...facilityData
                },
                facilityImageOne: facilityImageOne || [],
                game: game.map(acc => acc.userActivityId) || [],
                ownersAddress: ownersAddress.length > 0 ? ownersAddress[0] : {},
                parkInventory: parkInventory || [],
                service: service.map(acc => acc.serviceId) || [],
                operatingDays: {
                    sun: facilityData.sun,
                    mon: facilityData.mon,
                    tue: facilityData.tue,
                    wed: facilityData.wed,
                    thu: facilityData.thu,
                    fri: facilityData.fri,
                    sat: facilityData.sat
                }
            };
            // Update PostFacilityData state with fetched data
            setPostFacilityData(fetchDataDisplayFacility);
            // Store initial facility data
            setinitialFacilityDataStore(fetchDataDisplayFacility);
        } catch (err) {
            console.log("Error of Facility Data", err);
        }
    }

    // Function to get changed values and Compare ---------------------
    const getChnageValues = (initialData, currentData) => {
        const changedValues = {};
        // Function to deep compare objects
        const isEqual = (obj1, obj2) => {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        };
        for (const key in currentData) {
            if (key === 'parkInventory') {
                const changedInventory = [];
                currentData[key].forEach((item, index) => {
                    if (!isEqual(initialData[key][index], item)) {
                        changedInventory.push(item);
                    }
                });
                if (changedInventory.length > 0) {
                    changedValues[key] = changedInventory;
                }
            } else if (typeof currentData[key] === 'object' && !Array.isArray(currentData[key]) && currentData[key] !== null) {
                const nestedChanges = {};
                for (const nestedKey in currentData[key]) {
                    if (!isEqual(initialData[key][nestedKey], currentData[key][nestedKey])) {
                        nestedChanges[nestedKey] = currentData[key][nestedKey];
                    }
                }
                if (Object.keys(nestedChanges).length > 0) {
                    changedValues[key] = nestedChanges;
                }
            } else if (!isEqual(initialData[key], currentData[key])) {
                changedValues[key] = currentData[key];
            }
        }
        return changedValues;
    };


    // Function to handle form submission  Edit Page ---------
    async function HandleSubmitFacility(e) {
        e.preventDefault();
        toast.dismiss();
        try {
            let facilityisownedbBDAValue = PostFacilityData.facilityisownedbBDA === "Yes" ? 1 : 0;
            const ChangesValues = getChnageValues(initialFacilityDataStore, PostFacilityData);
            console.log("Changed Values", ChangesValues);
            const payloadfacilityData = {
                ...ChangesValues,
                facilityId:PostFacilityData.facilityId || null,
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
                parkInventory: PostFacilityData.parkInventory || null,
                facilityisownedbBDA: facilityisownedbBDAValue,
                firstName: PostFacilityData.firstName || null,
                lastName: PostFacilityData.lastName || null,
                phoneNumber: PostFacilityData.phoneNumber || null,
                emailAdress: PostFacilityData.emailAdress || null,
                ownerPanCard: PostFacilityData.ownerPanCard || null,
                ownership: PostFacilityData.ownership || null,
                ownersAddress: PostFacilityData.ownersAddress1 || null
            };
            let res = await axiosHttpClient("Facility_Update_Api", "put", payloadfacilityData);
            console.log("Response of Post the data of Facility", res);
            toast.success('Facility registration has been done successfully.', {
                autoClose: 2000,
                onClose: () => {
                    setTimeout(() => {
                        navigate('/facility-viewlist');
                    }, 1000);
                }
            });
        } catch (err) {
            console.log("Error of Facility Post Data", err);
            toast.error('Facility registration failed.');
        }
    }
    // here Handle for Upload Mulitple and single Image ---------------------
    const handleImageUpload = (name, files) => {
        if (files && files.length > 0) {
            if (name === "facilityImageOne") {
                const currentImagesCount1 = PostFacilityData.facilityImage.facilityImageOne.length;
                if (currentImagesCount1 + files.length > 1) {
                    toast.warning('You can upload only one image for Facility Image.');
                    document.getElementById("myForm").reset();
                    return;
                }
                let file = files[0];
                if (parseInt(file.size / 1024) <= 200) { // File size check for single image
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setPostFacilityData(prevState => ({
                            ...prevState,
                            facilityImage: {
                                ...prevState.facilityImage,
                                facilityImageOne: reader.result
                            },
                            fileNames: {
                                ...prevState.fileNames,
                                facilityImageOne: file.name
                            }
                        }));
                        displayFileName("facilityImageOne", [file.name]);
                    };
                    reader.readAsDataURL(file);
                } else {
                    toast.warning('Kindly choose an image with size less than 200 KB.');

                    document.getElementById("myForm").reset();
                }
            } else if (name === "facilityArrayOfImages") {     // Mulitple Image Upload 
                const validFiles = [];
                let totalSize = 0;
                const currentImagesCount = PostFacilityData.facilityImage.facilityArrayOfImages.length;
                if (currentImagesCount + files.length > 5) {    // max 5 image user can Upload 
                    toast.warning("You can only upload up to 5 images for Additional Facility Images.");
                    document.getElementById("myForm").reset();
                    return;
                }
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    if (parseInt(file.size / 1024) <= 200) { // File size check for multiple images
                        validFiles.push(file);
                        totalSize += parseInt(file.size / 1024);
                    } else {
                        toast.warning("Each image should be less than 200 KB.");
                        document.getElementById("myForm").reset();
                        return;
                    }
                }
                if (totalSize <= 1000) { // Adjusted total size limit for up to 5 images
                    const newFileNames = validFiles.map(file => file.name);
                    validFiles.forEach(file => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setPostFacilityData(prevState => ({
                                ...prevState,
                                facilityImage: {
                                    ...prevState.facilityImage,
                                    facilityArrayOfImages: [
                                        ...prevState.facilityImage.facilityArrayOfImages,
                                        reader.result
                                    ]
                                },
                                fileNames: {
                                    ...prevState.fileNames,
                                    facilityArrayOfImages: [...prevState.fileNames.facilityArrayOfImages, ...newFileNames]
                                }
                            }));
                        };
                        reader.readAsDataURL(file);
                    });
                    displayFileName("facilityArrayOfImages", newFileNames);

                } else {
                    toast.warning("Total size of images should not exceed 1000 KB for up to 5 images.");
                    document.getElementById("myForm").reset();

                }
            }
        }
    };
    // here for Display the Name of Image (MulitImage also)
    const displayFileName = (inputName, fileNames) => {
        const container = document.getElementById(inputName === "facilityImageOne" ? "facilityImageOneContainer" : "facilityArrayOfImagesContainer").querySelector(".image-preview");
        fileNames.forEach(fileName => {
            // const fileLabel = document.createElement("p");
            fileLabel.textContent = fileName;
            container.appendChild(fileLabel);

        });
    };
    // Remove Multiple Image here -----------------------------------------
    const handleImageRemove = (name, index) => {
        if (name === "facilityImageOne") {
            setPostFacilityData(prevState => ({
                ...prevState,
                facilityImage: {
                    ...prevState.facilityImage,
                    facilityImageOne: ""
                },
                fileNames: {
                    ...prevState.fileNames,
                    facilityImageOne: ""
                }
            }));
            toast.warning("Removed  Facility Image successfully!");
        } else if (name === "facilityArrayOfImages") {
            const updatedImages = [...PostFacilityData.facilityImage.facilityArrayOfImages];
            const updatedFileNames = [...PostFacilityData.fileNames.facilityArrayOfImages];
            updatedImages.splice(index, 1);
            updatedFileNames.splice(index, 1);
            setPostFacilityData(prevState => ({
                ...prevState,
                facilityImage: {
                    ...prevState.facilityImage,
                    facilityArrayOfImages: updatedImages
                },
                fileNames: {
                    ...prevState.fileNames,
                    facilityArrayOfImages: updatedFileNames
                }
            }));
            toast.warning("Removed Additional Facility Image successfully!");
        }
    };
    // Handle Day -----------------------------------------------------------
    const handleDayClick = (day, e) => {
        e.preventDefault(); // Ensure e is properly handled
        setPostFacilityData((prevState) => {
            const updatedOperatingDays = {
                ...prevState.operatingDays,
                [day]: prevState.operatingDays[day] ? 0 : 1, // Toggle the value between 0 and 1
            };
            const updatedPostFacilityData = {
                ...prevState,
                operatingDays: updatedOperatingDays,
            };
            return updatedPostFacilityData;
        });
        // Clear specific error for operatingDays and update validation

    };
    //  Handle serviceId (set here )-------------------------------------------
    const handleServiceClick = (Id) => {
        setPostFacilityData((prevState) => {
            let updatedService = [...prevState.service];
            if (updatedService.includes(Id)) {
                updatedService = updatedService.filter((service) => service !== Id);
            } else {
                updatedService.push(Id);
            }
            return { ...prevState, service: updatedService };
        });
    };
    // Handle Amenities Data --------------------------------------------------
    const handleAmenitiesClick = (amenityId) => {
        setPostFacilityData((prevState) => {
            // If the serviceId exists, remove it, else add it
            let updatedamenity = [...prevState.amenity];
            if (updatedamenity.includes(amenityId)) {
                updatedamenity = updatedamenity.filter(
                    (amenity) => amenity != amenityId
                );
            } else {
                updatedamenity.push(amenityId);
            }
            return { ...prevState, amenity: updatedamenity };
        });

    };
    // Handle Event------------------------------------------------------------
    const handleEventClick = (eventCategoryId) => {
        setPostFacilityData((prevState) => {
            // If the serviceId exists, remove it, else add it
            let updatedeventCategory = [...prevState.eventCategory];
            if (updatedeventCategory.includes(eventCategoryId)) {
                updatedeventCategory = updatedeventCategory.filter(
                    (event) => event != eventCategoryId
                );
            } else {
                updatedeventCategory.push(eventCategoryId);
            }
            return { ...prevState, eventCategory: updatedeventCategory };
        });

    };
    // Handle Add row of table -------------------------------------------------
    const handleAddRow = (e) => {
        e.preventDefault()
        setPostFacilityData(prevState => ({
            ...prevState,
            parkInventory: [...prevState.parkInventory, { equipmentId: "", count: "" }]
        }));
        toast.success("Row added successfully!");
    };
    // Handle Remove (Row in table)---------------------------------------------
    const handleRemoveRow = (index, e) => {
        e.preventDefault();
        // Remove the row from parkInventory
        setPostFacilityData(prevState => ({
            ...prevState,
            parkInventory: prevState.parkInventory.filter((_, i) => i !== index)
        }));

        // Remove errors associated with the removed row from formErrors
        const updatedErrors = { ...formErrors };

        // Delete errors for equipmentId and count at the specific index
        delete updatedErrors[`equipmentId${index}`];
        delete updatedErrors[`count${index}`];

        // Update formErrors state with the updatedErrors

    };
    //handleChnage of handleEquipmentChange
    const handleEquipmentChange = (index, field, value) => {
        const newParkInventory = PostFacilityData.parkInventory.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setPostFacilityData(prevState => ({
            ...prevState,
            parkInventory: newParkInventory
        }));
    };
    // Handle Game---------------------------------------------------------------
    const handleGameClick = (userActivityId) => {
        setPostFacilityData((prevState) => {
            // Ensure the game object exists in the state
            let updatedgame = [...prevState.game];
            // If the game exists, remove it, else add it
            if (updatedgame.includes(userActivityId)) {
                updatedgame = updatedgame.filter((game) => game != userActivityId);
            } else {
                updatedgame.push(userActivityId);
            }
            // Log the updated game object for debugging
            console.log("Updated game:", updatedgame);
            return { ...prevState, game: updatedgame };
        });
        // Log the current state for debugging

    };
    // here Prev and next page ---------------------------------------------------
    const nextStep = (e) => {
        e.preventDefault()
        // Perform validation before moving to the next step



        setCurrentStep(currentStep + 1);
        toast.success('Successfully moved to the next step!');






    };
    // 2nd from next step---------------------------------------------------------
    const nextStep2 = (e) => {
        e.preventDefault()

        setCurrentStep(currentStep + 1);
        toast.success('Successfully moved to the next step!');


    };
    // Prev Button ----------------------------------------------------------------
    const prevStep = (e) => {
        e.preventDefault()
        setCurrentStep(currentStep - 1);
        toast.success('Successfully moved to the Previous Step!');
    };
    // here Open Image on new tabe------------------------
    const openImageInNewTab = (imageUrl) => {
        window.open(imageUrl, '_blank');
    };
    //useEffect (Update data)-------------------------------------------------------
    useEffect(() => {
        GetFacilityInitailData();
    }, [formErrors]);

    useEffect(() => {
        DisplayFacilityData()
    }, [])

    return (
        <div>
            <div className="all_From_conatiner">
                <AdminHeader />
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
                                        <label htmlFor="input1">
                                            Facility Type{" "}
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <select
                                            id="input2"
                                            className="input_padding"
                                            name="facilityType"
                                            value={PostFacilityData?.facilityData?.facilityTypeId} // Assuming facilityTypeId is nested within facilityData
                                            onChange={handleChange}
                                            disabled={action === 'View'}
                                        >
                                            <option value="" disabled hidden>Select Facility Type</option>
                                            {FacilityTypeData?.length > 0 &&
                                                FacilityTypeData.map((name, index) => (
                                                    <option key={index} value={name.facilitytypeId}>
                                                        {name.description}
                                                    </option>
                                                ))}
                                        </select>
                                        {formErrors.facilityType && <p className="error text-red-700">{formErrors.facilityType}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">
                                            Facility Name{" "}
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="input2"
                                            className="input_padding"
                                            placeholder=" Please Enter the Facility Name"
                                            name="facilityName"
                                            value={PostFacilityData?.facilityData?.facilityName}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.facilityName && <p className="error text-red-700">{formErrors.facilityName}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">
                                            Longitude{" "}
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input_padding"
                                            id="input1"
                                            name="longitude"
                                            placeholder="Please enter the Longitude "
                                            value={PostFacilityData?.facilityData?.longitude}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.longitude && <p className="error text-red-700">{formErrors.longitude}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">
                                            Latitude
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="input2"
                                            className="input_padding"
                                            placeholder=" Please Enter the Latitude"
                                            name="latitude"
                                            value={PostFacilityData?.facilityData?.latitude}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.latitude && <p className="error text-red-700">{formErrors.latitude}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            Address
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            type="massage"
                                            id="input1"
                                            className="input_padding"
                                            placeholder="Enter address of your facility"
                                            name="address"
                                            value={PostFacilityData?.facilityData?.address}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.address && <p className="error text-red-700">{formErrors.address}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">
                                            Pincode{" "}
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input_padding"
                                            id="input1"
                                            placeholder="Enter Pincode "
                                            name="pin"
                                            value={PostFacilityData?.facilityData?.pin}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.pin && <p className="error text-red-700">{formErrors.pin}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">
                                            Area Acre{" "}
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="input2"
                                            className="input_padding"
                                            placeholder="Enter Area"
                                            name="area"
                                            value={PostFacilityData?.facilityData?.area}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.area && <p className="error text-red-700">{formErrors.area}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">
                                            Operating From Time{" "}
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            className=" p-5"
                                            placeholder="Enter Pin  "
                                            name="operatingHoursFrom"
                                            value={PostFacilityData?.facilityData?.operatingHoursFrom}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {/* {formErrors.operatingHoursFrom && <p className="error text-red-700">{formErrors.operatingHoursFrom}</p>} */}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">
                                            Operating To Time
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            id="input2"
                                            className="input_padding p-5"
                                            placeholder="Enter Area"
                                            name="operatingHoursTo"
                                            value={PostFacilityData?.facilityData?.operatingHoursTo}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {/* {formErrors.operatingHoursTo && <p className="error text-red-700">{formErrors.operatingHoursTo}</p>} */}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            Operating Days
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <span className="Operating_day" name="operatingDays">
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays?.sun ? "selected" : ""}`}
                                                onClick={(e) => handleDayClick("sun", e)}
                                                disabled={action == 'View' ? 1 : 0}
                                            >
                                                Sun
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.mon ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("mon", e)}
                                                disabled={action == 'View' ? 1 : 0}
                                            >
                                                Mon
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.tue ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("tue", e)}
                                                disabled={action == 'View' ? 1 : 0}
                                            >
                                                Tue
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.wed ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("wed", e)}
                                                disabled={action == 'View' ? 1 : 0}
                                            >
                                                Wed
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.thu ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("thu", e)}
                                                disabled={action == 'View' ? 1 : 0}
                                            >
                                                Thu
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.fri ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("fri", e)}
                                                disabled={action == 'View' ? 1 : 0}
                                            >
                                                Fri
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.sat ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("sat", e)}
                                                disabled={action == 'View' ? 1 : 0}
                                            >
                                                Sat
                                            </button>

                                        </span>

                                        {formErrors.operatingDays && <p className="error text-red-700">{formErrors.operatingDays}</p>}

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            Services
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <span className="Operating_day">
                                            {GetServiceData?.length > 0 &&
                                                GetServiceData.map((item, index) => (
                                                    <span key={index}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleServiceClick(item.serviceId)}
                                                            className={`button-4 ${PostFacilityData.service.includes(
                                                                item.serviceId
                                                            )
                                                                ? "selected"
                                                                : ""
                                                                }`}
                                                            disabled={action == 'View' ? 1 : 0}
                                                        >
                                                            {item.description}
                                                        </button>
                                                    </span>
                                                ))}
                                        </span>
                                        {formErrors.service && <p className="error text-red-700">{formErrors.service}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            Other Services

                                        </label>
                                        <input
                                            type="massage"
                                            id="input1"
                                            className="input_padding"
                                            placeholder="Enter some other amenities if you have"
                                            name="otherServices"
                                            value={PostFacilityData?.facilityData?.otherServices}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.otherServices && <p className="error text-red-700">{formErrors.otherServices}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            Amenities
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <span className="Operating_day">
                                            {GetAmenitiesData?.length > 0 &&
                                                GetAmenitiesData?.map((data, index) => (
                                                    <span key={index}>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleAmenitiesClick(data.amenityId)
                                                            }
                                                            className={`button-4 ${PostFacilityData.amenity.includes(
                                                                data.amenityId
                                                            )
                                                                ? "selected"
                                                                : ""
                                                                }`}
                                                            disabled={action == 'View' ? 1 : 0}
                                                        >
                                                            {data.amenityName}
                                                        </button>
                                                    </span>
                                                ))}
                                        </span>
                                        {formErrors.amenity && <p className="error text-red-700">{formErrors.amenity}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            Other Amenities

                                        </label>
                                        <input
                                            type="massage"
                                            id="input1"
                                            className="input_padding"
                                            placeholder="Enter some other amenities if you have"
                                            name="otherAmenities"
                                            value={PostFacilityData?.facilityData?.otherAmenities}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.otherAmenities && <p className="error text-red-700">{formErrors.otherAmenities}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            Events Category
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <span className="Operating_day">
                                            {fetchEventCategoryData?.length > 0 &&
                                                fetchEventCategoryData.map((item, index) => (
                                                    <span key={index}>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEventClick(item.eventCategoryId)
                                                            }
                                                            className={`button-4 ${PostFacilityData.eventCategory.includes(
                                                                item.eventCategoryId
                                                            )
                                                                ? "selected"
                                                                : ""
                                                                }`}
                                                            disabled={action == 'View' ? 1 : 0}
                                                        >
                                                            {item.eventCategoryName}
                                                        </button>
                                                    </span>
                                                ))}
                                        </span>
                                        {formErrors.eventCategory && <p className="error text-red-700">{formErrors.eventCategory}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            Other Events Category
                                        </label>
                                        <input
                                            type="massage"
                                            id="input1"
                                            className="input_padding"
                                            placeholder="Enter some other amenities if you have"
                                            name="othereventCategory"
                                            value={PostFacilityData?.facilityData?.othereventCategory}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.othereventCategory && <p className="error text-red-700">{formErrors.othereventCategory}</p>}
                                    </div>
                                </div>
                                {isPlayGround && (
                                    <div className="HostEvent_Row">
                                        <div className="HostEvent_Group" id="AddressBox">
                                            <label htmlFor="input1">
                                                Game
                                                <span className="text-red-600 font-bold text-xl">*</span>
                                            </label>
                                            <span className="Operating_day">
                                                {fetchActivityData?.length > 0 &&
                                                    fetchActivityData?.map((item, index) => (
                                                        <span key={index}>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleGameClick(item.userActivityId)
                                                                }
                                                                className={`button-4 ${PostFacilityData.game.includes(
                                                                    item.userActivityId
                                                                )
                                                                    ? "selected"
                                                                    : ""
                                                                    }`}
                                                                disabled={action == 'View' ? 1 : 0}
                                                            >
                                                                {item.userActivityName}
                                                            </button>
                                                        </span>
                                                    ))}
                                            </span>
                                            {formErrors.game && <p className="error text-red-700">{formErrors.game}</p>}
                                        </div>
                                    </div>
                                )}
                                {isPlayGround && (
                                    <div className="HostEvent_Row">
                                        <div className="HostEvent_Group" id="AddressBox">
                                            <label htmlFor="input1">
                                                Other Games
                                            </label>
                                            <input
                                                type="massage"
                                                id="input1"
                                                className="input_padding"
                                                placeholder="Enter some other amenities if you have"
                                                name="othergame"
                                                value={PostFacilityData?.facilityData?.othergame}
                                                onChange={handleChange}
                                                disabled={action == 'View' ? 1 : 0}
                                            />
                                            {formErrors.othergame && <p className="error text-red-700">{formErrors.othergame}</p>}
                                        </div>
                                    </div>
                                )}
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            About the Facility
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            type="massage"
                                            id="input1"
                                            className="input_padding"
                                            placeholder="About the Facility"
                                            name="additionalDetails"
                                            value={PostFacilityData?.facilityData?.additionalDetails}
                                            onChange={handleChange}
                                            disabled={action == 'View' ? 1 : 0}
                                        />
                                        {formErrors.additionalDetails && <p className="error text-red-700">{formErrors.additionalDetails}</p>}
                                    </div>
                                </div>
                                <form id="myForm" className="m-0">
                                    <div className="container" id="facilityImageOneContainer">
                                        {action == 'Edit' &&

                                            <div>
                                                <h2 className="Upload_Image_text">Upload Facility Image<span className="text-red-600 font-bold text-xl">*</span></h2>
                                                <div className="upload-btn-wrapper">
                                                    <span> <FontAwesomeIcon icon={faCloudUploadAlt} className="Upload_Iocn" /> </span>
                                                    <input
                                                        className="form-input"
                                                        id="facilityImageOne"
                                                        name="facilityImageOne"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleChange}
                                                        disabled={action == 'View' ? 1 : 0}
                                                    />
                                                    <p className="italic text-sm font-bold text-gray-500">
                                                        Max.image file should be less than or eqaul  200 KB.
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                        {formErrors.facilityImageOne && <p className="error text-red-700  text-sm">{formErrors.facilityImageOne}</p>}
                                        {PostFacilityData?.facilityImageOne && (
                                            <div className="image-preview" id="imagePreview">
                                                <p>
                                                    {PostFacilityData.facilityImageOne.map(image => (
                                                        <span key={image.attachmentId}>
                                                            {image.code}
                                                            <span
                                                                onClick={() => handleImageRemove("facilityImageOne")}
                                                                style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}>

                                                            </span>
                                                            <span
                                                                onClick={() => openImageInNewTab(image.url)}
                                                                style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}>
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </span>
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="container" id="facilityArrayOfImagesContainer">
                                        {action == 'Edit' &&
                                            <div>
                                                <h2 className="Upload_Image_text">Upload Additional Facility Images</h2>
                                                <div className="upload-btn-wrapper">
                                                    <span> <FontAwesomeIcon icon={faCloudUploadAlt} className="Upload_Iocn" /> </span>
                                                    <input
                                                        className="form-input"
                                                        id="facilityArrayOfImages"
                                                        name="facilityArrayOfImages"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleChange}
                                                        disabled={action == 'View' ? 1 : 0}
                                                    />
                                                    <p className="italic text-sm font-bold text-gray-500">
                                                        Max. Each image should be less than 200 KB.
                                                    </p>
                                                    <p className="italic text-sm font-bold text-gray-600">You can only upload up to 5  image for   Additional Facility Images .</p>
                                                </div>
                                            </div>
                                        }
                                        {PostFacilityData.facilityArrayOfImages && (
                                            <div className="image-preview" id="imagePreview">
                                                {PostFacilityData.facilityArrayOfImages.map(image => (



                                                    <span key={image.attachmentId}>
                                                        {image.code}
                                                        <span
                                                            onClick={() => handleImageRemove("facilityImageOne")}
                                                            style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}>

                                                        </span>
                                                        <span
                                                            onClick={() => openImageInNewTab(image.url)}
                                                            style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}>
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </span>
                                                    </span>

                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </form>
                                {/* Add Park inventory */}
                                <div className="Pakr_inventory_form_main_Conatiner">
                                    <h1 className="Park_Inventory_text">Park Inventory</h1>
                                    <div className="Table_Inventory">
                                        {action == 'Edit' &&
                                            <div className="Add_row_Button">
                                                <button className="Inventory_add_button" onClick={handleAddRow}>  Add Row <FontAwesomeIcon icon={faPlus} className="Add_icon" /> </button>
                                            </div>
                                        }

                                        <table className="Inventory_table">

                                            <thead className="Inventory_thead">
                                                <tr className="Inventory_tr">
                                                    <th className="Inventory_th">Items/Equipment</th>
                                                    <th className="Inventory_th">Number</th>
                                                    {action == 'Edit' &&
                                                        <th className="Inventory_th">Actions</th>
                                                    }

                                                </tr>
                                            </thead>
                                            <tbody className="Inventory_tbody">
                                                {PostFacilityData.parkInventory.map((item, index) => (
                                                    <tr className="Inventory_tr" key={index}>
                                                        <td className="Inventory_td">
                                                            <select
                                                                className="Inventory_select"
                                                                value={item.equipmentId}
                                                                onChange={(e) => handleEquipmentChange(index, 'equipmentId', e.target.value)}
                                                                disabled={action == 'View' ? 1 : 0}
                                                            >
                                                                <option value="">Select Equipment</option>
                                                                {Invantory.length > 0 && Invantory.map((item, index) => (
                                                                    <option key={index} value={item.equipmentId}>
                                                                        {item.description}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formErrors[`equipmentId${index}`] && (
                                                                <span className="error">{formErrors[`equipmentId${index}`]}</span>
                                                            )}
                                                        </td>
                                                        <td className="Inventory_td">
                                                            <input
                                                                type="number"
                                                                className="Inventory_input"
                                                                value={item.count}
                                                                onChange={(e) => handleEquipmentChange(index, 'count', e.target.value)}
                                                                disabled={action == 'View' ? 1 : 0}
                                                            />
                                                            {formErrors[`count${index}`] && (
                                                                <span className="error">{formErrors[`count${index}`]}</span>
                                                            )}
                                                        </td>
                                                        {action == 'Edit' &&
                                                            <td className="Inventory_td">
                                                                <button
                                                                    className="Inventory_button"
                                                                    onClick={(e) => handleRemoveRow(index, e)}
                                                                >
                                                                    <FontAwesomeIcon icon={faMinus} className="Remove_icon" />
                                                                </button>
                                                            </td>
                                                        }

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>


                                    </div>
                                </div>
                            </div>
                            <div className="buttons-container">
                                <button
                                    type="submit"
                                    className="next_button"
                                    onClick={nextStep}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                {/*------------------------------------------------------- 2nd Step from ----------------------------------------------------------- */}
                {currentStep === 2 && (
                    <form onSubmit={nextStep2}>
                        <div className="HostEvent_container">
                            <div className="HostEvent_Heading">
                                <h1 className="verify_name_text">Step-2 (Event Details)</h1>
                                <div className="HeadingTitle9">
                                    <div></div>
                                    <h2>Ownership Details</h2>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Facility is owned by BDA ? <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <select
                                            id="input2"
                                            name="facilityisownedbBDA"
                                            className="input_padding"
                                            // value={PostFacilityData?.ownersAddress?.facilityisownedbBDA}
                                            // onChange={handleChange}
                                            disabled={action === 'View'}
                                        >
                                            <option value="" disabled hidden>
                                                If yes, ownership details are not required
                                            </option>

                                            {action == 'View' &&
                                                PostFacilityData?.ownersAddress?.facilityisownedbBDA === 0 && (
                                                    <option value="Yes" selected={PostFacilityData.ownersAddress.facilityisownedbBDA}>
                                                        Yes
                                                    </option>
                                                )


                                            }
                                            {PostFacilityData?.ownersAddress?.facilityisownedbBDA === 1 && (
                                                <option value="No" selected={PostFacilityData.ownersAddress.facilityisownedbBDA == 1}>
                                                    No
                                                </option>
                                            )}

                                        </select>
                                        {/* {formErrors.facilityisownedbBDA && <p className="error text-red-700">{formErrors.facilityisownedbBDA}</p>} */}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">
                                            First Name{" "}
                                            {!disabledFields && <span className="text-red-600 font-bold text-xl">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            className="input_padding"
                                            id="input1"
                                            placeholder="Enter First Name  "
                                            name="firstName"
                                            value={PostFacilityData?.ownersAddress?.firstName}
                                            onChange={handleChange}
                                            disabled={disabledFields || action === 'View'}

                                        />
                                        {/* {formErrors.firstName && <p className="error text-red-700">{formErrors.firstName}</p>} */}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">
                                            Last Name{" "}
                                            {!disabledFields && <span className="text-red-600 font-bold text-xl">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            id="input2"
                                            className="input_padding"
                                            placeholder="Enter Last Name"
                                            name="lastName"
                                            value={PostFacilityData?.ownersAddress?.lastName}
                                            onChange={handleChange}
                                            disabled={disabledFields || action == 'View' ? 1 : 0}

                                        />
                                        {/* {formErrors.lastName && <p className="error text-red-700">{formErrors.lastName}</p>} */}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">
                                            Phone Number{" "}
                                            {!disabledFields && <span className="text-red-600 font-bold text-xl">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            className="input_padding"
                                            id="input1"
                                            placeholder="Enter Phone Number"
                                            name="phoneNumber"
                                            value={PostFacilityData?.ownersAddress?.phoneNumber}
                                            onChange={handleChange}
                                            disabled={disabledFields || action == 'View' ? 1 : 0}
                                        />
                                        {/* {formErrors.phoneNumber && <p className="error text-red-700">{formErrors.phoneNumber}</p>} */}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">
                                            Email Adress{" "}
                                            {!disabledFields && <span className="text-red-600 font-bold text-xl">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            id="input2"
                                            className="input_padding"
                                            placeholder="Enter Email Adress"
                                            name="emailAdress"
                                            value={PostFacilityData?.ownersAddress?.emailAddress}
                                            onChange={handleChange}
                                            disabled={disabledFields || action == 'View' ? 1 : 0}
                                        />
                                        {/* {formErrors.emailAdress && <p className="error text-red-700">{formErrors.emailAdress}</p>} */}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">
                                            Owner’s PAN card number{" "}
                                            {!disabledFields && <span className="text-red-600 font-bold text-xl">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            className="input_padding"
                                            id="input1"
                                            placeholder="Enter Owner’s PAN card number "
                                            name="ownerPanCard"
                                            value={PostFacilityData?.ownersAddress?.ownerPanCard}
                                            onChange={handleChange}
                                            disabled={disabledFields || action == 'View' ? 1 : 0}
                                        />
                                        {/* {formErrors.ownerPanCard && <p className="error text-red-700">{formErrors.ownerPanCard}</p>} */}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">
                                            Ownership{" "}
                                            {!disabledFields && <span className="text-red-600 font-bold text-xl">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            className="input_padding"
                                            id="input1"
                                            placeholder="Enter  Ownership  "
                                            name="ownership"
                                            value={PostFacilityData?.ownersAddress?.ownership}
                                            onChange={handleChange}
                                            disabled={disabledFields || action == 'View' ? 1 : 0}
                                        />
                                        {/* {formErrors.ownership && <p className="error text-red-700">{formErrors.ownership}</p>} */}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id="AddressBox">
                                        <label htmlFor="input1">
                                            Owner’s Address
                                            {!disabledFields && <span className="text-red-600 font-bold text-xl">*</span>}
                                        </label>
                                        <input
                                            type="massage"
                                            id="input1"
                                            className="input_padding"
                                            placeholder="Enter address of your facility"
                                            name="ownersAddress"
                                            // value={PostFacilityData?.ownersAddress?.ownersAddress}
                                            // onChange={handleChange}
                                            disabled={disabledFields || action == 'View' ? 1 : 0}
                                        />
                                        {/* {formErrors.ownersAddress && <p className="error text-red-700">{formErrors.ownersAddress}</p>} */}
                                    </div>
                                </div>
                            </div>
                            <div className="buttons-container">
                                <button type="button" className="prev_button" onClick={(e) => prevStep(e)}>
                                    Previous
                                </button>
                                {action == 'Edit' &&
                                    <button type="submit" className="next_button"
                                    >
                                        Next
                                    </button>
                                }

                            </div>
                        </div>
                    </form>
                )}


                {/*----------------------------------- step-3 (show the data and Submit--------------------------------------------------------------------------------------------) */}
                {
                    action == 'Edit' &&
                    <div>

                        {currentStep === 3 && (
                            <form onSubmit={HandleSubmitFacility}   >
                                <div className="Verify_FromConatriner">
                                    <div className="HostEvent_container">
                                        <div className="HostEvent_Heading">
                                            <h1 className="verify_name_text">Step-3 (Verify facility details before submit)</h1>
                                            <div className="HeadingTitle9">
                                                <div></div>
                                                <h2>Facility details</h2>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input1">
                                                        Facility Type{" "}

                                                    </label>
                                                    <select
                                                        id="input2"
                                                        className="input_padding"
                                                        name="facilityType"
                                                        value={PostFacilityData.facilityType}
                                                        disabled
                                                    >
                                                        <option value="" disabled selected hidden>
                                                            Select Facility Type
                                                        </option>
                                                        {FacilityTypeData?.length > 0 &&
                                                            FacilityTypeData?.map((name, index) => {
                                                                return (
                                                                    <option key={index} value={name.facilitytypeId}>
                                                                        {name.description}
                                                                    </option>
                                                                );
                                                            })}
                                                    </select>

                                                </div>
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input2">
                                                        Facility Name{" "}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="input2"
                                                        className="input_padding"
                                                        placeholder=" Please Enter the Facility Name"
                                                        name="facilityName"
                                                        value={PostFacilityData.facilityName}
                                                        disabled
                                                    />

                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input1">
                                                        Longitude{" "}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input_padding"
                                                        id="input1"
                                                        name="longitude"
                                                        placeholder="Please enter the Longitude "
                                                        value={PostFacilityData.longitude}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input2">
                                                        Latitude
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="input2"
                                                        className="input_padding"
                                                        placeholder=" Please Enter the Latitude"
                                                        name="latitude"
                                                        value={PostFacilityData.latitude}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        Address
                                                    </label>
                                                    <input
                                                        type="massage"
                                                        id="input1"
                                                        className="input_padding"
                                                        placeholder="Enter address of your facility"
                                                        name="address"
                                                        value={PostFacilityData.address}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input1">
                                                        Pincode{" "}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input_padding"
                                                        id="input1"
                                                        placeholder="Enter Pincode "
                                                        name="pin"
                                                        value={PostFacilityData.pin}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input2">
                                                        Area Acre{" "}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="input2"
                                                        className="input_padding"
                                                        placeholder="Enter Area"
                                                        name="area"
                                                        value={PostFacilityData.area}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input1">
                                                        Operating From Time{" "}
                                                    </label>
                                                    <input
                                                        type="time"
                                                        className=" p-5"
                                                        placeholder="Enter Pin  "
                                                        name="operatingHoursFrom"
                                                        value={PostFacilityData.operatingHoursFrom}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input2">
                                                        Operating To Time
                                                    </label>
                                                    <input
                                                        type="time"
                                                        id="input2"
                                                        className="input_padding p-5"
                                                        placeholder="Enter Area"
                                                        name="operatingHoursTo"
                                                        value={PostFacilityData.operatingHoursTo}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        Operating Days
                                                    </label>
                                                    <span className="Operating_day" name="operatingDays">
                                                        <button
                                                            type="button"
                                                            className={`button-4 ${PostFacilityData.operatingDays.sun ? "selected" : ""
                                                                }`}
                                                            onClick={(e) => handleDayClick("sun", e)}
                                                            disabled
                                                        >
                                                            Sun
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`button-4 ${PostFacilityData.operatingDays.mon ? "selected" : ""
                                                                }`}
                                                            onClick={(e) => handleDayClick("mon", e)}
                                                            disabled
                                                        >
                                                            Mon
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`button-4 ${PostFacilityData.operatingDays.tue ? "selected" : ""
                                                                }`}
                                                            onClick={(e) => handleDayClick("tue", e)}
                                                            disabled
                                                        >
                                                            Tue
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`button-4 ${PostFacilityData.operatingDays.wed ? "selected" : ""
                                                                }`}
                                                            onClick={(e) => handleDayClick("wed", e)}
                                                            disabled
                                                        >
                                                            Wed
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`button-4 ${PostFacilityData.operatingDays.thu ? "selected" : ""
                                                                }`}
                                                            onClick={(e) => handleDayClick("thu", e)}
                                                            disabled
                                                        >
                                                            Thu
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`button-4 ${PostFacilityData.operatingDays.fri ? "selected" : ""
                                                                }`}
                                                            onClick={(e) => handleDayClick("fri", e)}
                                                            disabled
                                                        >
                                                            Fri
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`button-4 ${PostFacilityData.operatingDays.sat ? "selected" : ""
                                                                }`}
                                                            onClick={(e) => handleDayClick("sat", e)}
                                                            disabled
                                                        >
                                                            Sat
                                                        </button>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        Services
                                                        <span className="text-red-600 font-bold text-xl">*</span>
                                                    </label>
                                                    <span className="Operating_day">
                                                        {GetServiceData?.length > 0 &&
                                                            GetServiceData.map((item, index) => (
                                                                <span key={index}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleServiceClick(item.serviceId)}
                                                                        disabled
                                                                        className={`button-4 ${PostFacilityData.service.includes(
                                                                            item.serviceId
                                                                        )
                                                                            ? "selected"
                                                                            : ""
                                                                            }`}
                                                                    >
                                                                        {item.description}
                                                                    </button>
                                                                </span>
                                                            ))}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        Other Services
                                                    </label>
                                                    <input
                                                        type="massage"
                                                        id="input1"
                                                        className="input_padding"
                                                        placeholder="Enter some other amenities if you have"
                                                        name="otherServices"
                                                        value={PostFacilityData.otherServices}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        Amenities

                                                    </label>
                                                    <span className="Operating_day">
                                                        {GetAmenitiesData?.length > 0 &&
                                                            GetAmenitiesData?.map((data, index) => (
                                                                <span key={index}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleAmenitiesClick(data.amenityId)
                                                                        }
                                                                        disabled
                                                                        className={`button-4 ${PostFacilityData.amenity.includes(
                                                                            data.amenityId
                                                                        )
                                                                            ? "selected"
                                                                            : ""
                                                                            }`}
                                                                    >
                                                                        {data.amenityName}
                                                                    </button>
                                                                </span>
                                                            ))}
                                                    </span>

                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        Other Amenities

                                                    </label>
                                                    <input
                                                        type="massage"
                                                        id="input1"
                                                        className="input_padding"
                                                        placeholder="Enter some other amenities if you have"
                                                        name="otherAmenities"
                                                        value={PostFacilityData.otherAmenities}
                                                        disabled
                                                    />

                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        Events Category
                                                        <span className="text-red-600 font-bold text-xl">*</span>
                                                    </label>
                                                    <span className="Operating_day">
                                                        {fetchEventCategoryData?.length > 0 &&
                                                            fetchEventCategoryData.map((item, index) => (
                                                                <span key={index}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleEventClick(item.eventCategoryId)
                                                                        }
                                                                        disabled
                                                                        className={`button-4 ${PostFacilityData.eventCategory.includes(
                                                                            item.eventCategoryId
                                                                        )
                                                                            ? "selected"
                                                                            : ""
                                                                            }`}
                                                                    >
                                                                        {item.eventCategoryName}
                                                                    </button>
                                                                </span>
                                                            ))}
                                                    </span>

                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        Other Events Category
                                                    </label>
                                                    <input
                                                        type="massage"
                                                        id="input1"
                                                        className="input_padding"
                                                        placeholder="Enter some other amenities if you have"
                                                        name="othereventCategory"
                                                        value={PostFacilityData.othereventCategory}
                                                        disabled
                                                    />

                                                </div>
                                            </div>
                                            {isPlayGround && (
                                                <div className="HostEvent_Row">
                                                    <div className="HostEvent_Group" id="AddressBox">
                                                        <label htmlFor="input1">
                                                            Game
                                                            <span className="text-red-600 font-bold text-xl">*</span>
                                                        </label>
                                                        <span className="Operating_day">
                                                            {fetchActivityData?.length > 0 &&
                                                                fetchActivityData?.map((item, index) => (
                                                                    <span key={index}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleGameClick(item.userActivityId)
                                                                            }
                                                                            disabled
                                                                            className={`button-4 ${PostFacilityData.game.includes(
                                                                                item.userActivityId
                                                                            )
                                                                                ? "selected"
                                                                                : ""
                                                                                }`}
                                                                        >
                                                                            {item.userActivityName}
                                                                        </button>
                                                                    </span>
                                                                ))}
                                                        </span>

                                                    </div>
                                                </div>
                                            )}
                                            {isPlayGround && (
                                                <div className="HostEvent_Row">
                                                    <div className="HostEvent_Group" id="AddressBox">
                                                        <label htmlFor="input1">
                                                            Other Games
                                                        </label>
                                                        <input
                                                            type="massage"
                                                            id="input1"
                                                            className="input_padding"
                                                            placeholder="Enter some other amenities if you have"
                                                            name="othergame"
                                                            value={PostFacilityData.othergame}
                                                            disabled
                                                        />

                                                    </div>
                                                </div>
                                            )}
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        About the Facility

                                                    </label>
                                                    <input
                                                        type="massage"
                                                        id="input1"
                                                        className="input_padding"
                                                        placeholder="About the Facility"
                                                        name="additionalDetails"
                                                        value={PostFacilityData.additionalDetails}
                                                        disabled
                                                    />

                                                </div>
                                            </div>
                                            {/* <form id="myForm" className="m-0">
                                                <div className="container" id="facilityImageOneContainer">
                                                    <h2 className="Upload_Image_text">Upload Facility Image</h2>
                                                    <div className="upload-btn-wrapper">
                                                        <span> <FontAwesomeIcon icon={faCloudUploadAlt} className="Upload_Iocn" /> </span>
                                                        <input
                                                            className="form-input"
                                                            id="facilityImageOne"
                                                            name="facilityImageOne"
                                                            type="file"
                                                            accept="image/*"
                                                            disabled
                                                        />

                                                    </div>

                                                    {PostFacilityData.fileNames.facilityImageOne && (
                                                        <div className="image-preview" id="imagePreview">
                                                            <p>{PostFacilityData.fileNames.facilityImageOne}

                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="container" id="facilityArrayOfImagesContainer">
                                                    <h2 className="Upload_Image_text">Upload Additional Facility Images</h2>
                                                    <div className="upload-btn-wrapper">
                                                        <span> <FontAwesomeIcon icon={faCloudUploadAlt} className="Upload_Iocn" /> </span>
                                                        <input
                                                            className="form-input"
                                                            id="facilityArrayOfImages"
                                                            name="facilityArrayOfImages"
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            disabled
                                                        />
                                                    </div>
                                                    {PostFacilityData.fileNames.facilityArrayOfImages.length > 0 && (
                                                        <div className="image-preview" id="imagePreview">
                                                            {PostFacilityData.fileNames.facilityArrayOfImages.map((fileName, index) => (
                                                                <p key={index}>
                                                                    {fileName}

                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </form> */}
                                            {/* Add Park inventory */}
                                            <div className="Pakr_inventory_form_main_Conatiner">
                                                <h1 className="Park_Inventory_text">Park Inventory</h1>
                                                <div className="Table_Inventory">
                                                    <div className="Add_row_Button">

                                                    </div>
                                                    <table className="Inventory_table">

                                                        <thead className="Inventory_thead">
                                                            <tr className="Inventory_tr">
                                                                <th className="Inventory_th">Items/Equipment</th>
                                                                <th className="Inventory_th">Number</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody className="Inventory_tbody">
                                                            {PostFacilityData.parkInventory.map((item, index) => (
                                                                <tr className="Inventory_tr" key={index}>
                                                                    <td className="Inventory_td">
                                                                        <select
                                                                            className="Inventory_select"
                                                                            value={item.equipmentId}
                                                                            disabled
                                                                        >
                                                                            <option value="">Select Equipment</option>
                                                                            {Invantory.length > 0 && Invantory.map((item, index) => (
                                                                                <option key={index} value={item.equipmentId}>
                                                                                    {item.description}
                                                                                </option>
                                                                            ))}
                                                                        </select>

                                                                    </td>
                                                                    <td className="Inventory_td">
                                                                        <input
                                                                            type="number"
                                                                            className="Inventory_input"
                                                                            value={item.count}
                                                                            disabled
                                                                        />

                                                                    </td>

                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>


                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    {/* ------------------------------------2nd From here --------------------------------- */}
                                    <div className="HostEvent_container">
                                        <div className="HostEvent_Heading">

                                            <div className="HeadingTitle9">
                                                <div></div>
                                                <h2>Ownership Details</h2>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input2">Facility is owned by BDA</label>
                                                    <select id="input2"
                                                        name="facilityisownedbBDA"
                                                        className="input_padding"
                                                        value={PostFacilityData.facilityisownedbBDA}
                                                        disabled
                                                    >
                                                        <option value="" disabled selected hidden>If yes, ownership details are not required</option>
                                                        <option value="Yes" >Yes</option>
                                                        <option value="No">No</option>
                                                    </select>
                                                    {formErrors.facilityisownedbBDA && <p className="error text-red-700">{formErrors.facilityisownedbBDA}</p>}
                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input1">
                                                        First Name{" "}

                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input_padding"
                                                        id="input1"
                                                        placeholder="Enter First Name  "
                                                        name="firstName"
                                                        value={PostFacilityData.firstName}
                                                        disabled
                                                    />

                                                </div>
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input2">
                                                        Last Name{" "}

                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="input2"
                                                        className="input_padding"
                                                        placeholder="Enter Last Name"
                                                        name="lastName"
                                                        value={PostFacilityData.lastName}

                                                        disabled
                                                    />

                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input1">
                                                        Phone Number{" "}

                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input_padding"
                                                        id="input1"
                                                        placeholder="Enter Phone Number"
                                                        name="phoneNumber"
                                                        value={PostFacilityData.phoneNumber}
                                                        onChange={handleChange}
                                                        disabled
                                                    />

                                                </div>
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input2">
                                                        Email Adress{" "}

                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="input2"
                                                        className="input_padding"
                                                        placeholder="Enter Email Adress"
                                                        name="emailAdress"
                                                        value={PostFacilityData.emailAdress}
                                                        onChange={handleChange}
                                                        disabled
                                                    />

                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input1">
                                                        Owner’s PAN card number{" "}
                                                        {!disabledFields && <span className="text-red-600 font-bold text-xl">*</span>}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input_padding"
                                                        id="input1"
                                                        placeholder="Enter Owner’s PAN card number "
                                                        name="ownerPanCard"
                                                        value={PostFacilityData.ownerPanCard}
                                                        disabled
                                                    />

                                                </div>
                                                <div className="HostEvent_Group">
                                                    <label htmlFor="input1">
                                                        Ownership{" "}

                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input_padding"
                                                        id="input1"
                                                        placeholder="Enter  Ownership  "
                                                        name="ownership"
                                                        value={PostFacilityData.ownership}
                                                        disabled
                                                    />

                                                </div>
                                            </div>
                                            <div className="HostEvent_Row">
                                                <div className="HostEvent_Group" id="AddressBox">
                                                    <label htmlFor="input1">
                                                        Owner’s Address

                                                    </label>
                                                    <input
                                                        type="massage"
                                                        id="input1"
                                                        className="input_padding"
                                                        placeholder="Enter address of your facility"
                                                        name="ownersAddress"
                                                        value={PostFacilityData.ownersAddress}
                                                        onChange={handleChange}
                                                        disabled
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="buttons-container">
                                            <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                                            <button type="submit" className="next_button"  >Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                }

            </div>
            <ToastContainer />
        </div>
    );
};
export default Facility_Edit_View;
