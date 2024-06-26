// import css---------------------------------------------------------
import "./Facility_Reg.css";
// Facility Reg funcation ---------------------------------------------
import { useState, useEffect } from "react";
import axiosHttpClient from "../../../utils/axios";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import verfiy_img from "../../../assets/verify_img.png"
// import header and Footer-----------------------------
import AdminHeader from '../../../common/AdminHeader'
//Toast -----------------------------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
const Facility_Reg = () => {
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
    const [formErrors, setformErrors] = useState({});
    const [isPlayGround, setIsPlayGround] = useState(false);
    // here Facility Post data ----------------------------------------------
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
        ownersAddress: "",
        fileNames: {  // New state to store file names ----------------------
            facilityImageOne: "",
            facilityArrayOfImages: []
        }
    });
    let navigate = useNavigate();

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
    // here Post the data ---------------------------------------------------
    async function HandleSubmitFacility(e) {
        e.preventDefault();
        const validationErrors = Validation(PostFacilityData);
        const validationErrors1 = Validation2(PostFacilityData)
        const validationErrors2 = Validationinvantory(PostFacilityData)
        console.log("Handle Submit invatory error", validationErrors2)
        setformErrors({ ...validationErrors, ...validationErrors1 });
        toast.dismiss();
        if (Object.keys(validationErrors).length === 0 && Object.keys(validationErrors1).length === 0 && Object.keys(validationErrors2).length === 0) {
            try {
                let facilityisownedbBDAValue = PostFacilityData.facilityisownedbBDA === "Yes" ? 1 : 0;
                let res = await axiosHttpClient("Facility_Reg_Api", "post", {
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
                    // Owner Data ---------------------------------------------------------------
                    facilityisownedbBDA: facilityisownedbBDAValue,
                    firstName: PostFacilityData.firstName || null,
                    lastName: PostFacilityData.lastName || null,
                    phoneNumber: PostFacilityData.phoneNumber || null,
                    emailAdress: PostFacilityData.emailAdress || null,
                    ownerPanCard: PostFacilityData.ownerPanCard || null,
                    ownership: PostFacilityData.ownership || null,
                    ownersAddress: PostFacilityData.ownersAddress || null
                });
                console.log("here Response of Post the data of Facility", res);
                toast.success('Facility registration has been done successfully.', {
                    autoClose: 2000,
                    onClose: () => {
                        setTimeout(() => {
                            navigate('/facility-registration');
                        }, 1000);
                    }
                });
            } catch (err) {
                console.log("here error of Facility Post Data", err);
                toast.error('Facility registration failed.');
                setformErrors('')
            }
        } else {
            setformErrors(validationErrors)
            setformErrors(validationErrors1)
            setformErrors(validationErrors2)

        }
    }
    // handle Post Data------------------------------------------------------
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value, files } = e.target;
        if (name === "facilityImageOne" || name === "facilityArrayOfImages") {
            handleImageUpload(name, files);
        } else if (name === "facilityisownedbBDA") {
            const isOwnerByBDA = value === "Yes";
            setPostFacilityData({ ...PostFacilityData, [name]: value });
            // Set disabled state for specific fields
            setDisabledFields(isOwnerByBDA);
            if (isOwnerByBDA) {
                // Reset input fields if user selects "Yes"
                setPostFacilityData(prevData => ({
                    ...prevData,
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    emailAdress: "",
                    ownerPanCard: "",
                    ownersAddress: ""
                }));
                toast.info("No fields are required !");
                setformErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
            }
        } else if (name === "facilityType") {
            // Handle other input changes
            setPostFacilityData({ ...PostFacilityData, [name]: value });
            setIsPlayGround(Number(value) === 2); // Check true and False
        } else {
            setPostFacilityData({ ...PostFacilityData, [name]: value });
        }
        // Run validation on input change
        const validationErrors = Validation({ ...PostFacilityData, [name]: value });
        setformErrors(validationErrors);
    };
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
                    setformErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
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
        setformErrors(prevErrors => {
            const { operatingDays, ...otherErrors } = prevErrors;
            const validationErrors = Validation2({ ...PostFacilityData, operatingDays });
            return { ...otherErrors, ...validationErrors };
        });
        console.log("PostFacilityData:", PostFacilityData);
    };
    //  Handle serviceId (set here )-------------------------------------------
    const handleServiceClick = (Id) => {
        console.log("handle service click", Id);
        console.log("PostFacilityData service 1", PostFacilityData.service);

        setPostFacilityData((prevState) => {
            // If the serviceId exists, remove it, else add it
            let updatedService = [...prevState.service];
            if (updatedService.includes(Id)) {
                updatedService = updatedService.filter((service) => {
                    return service !== Id;
                });
            } else {
                updatedService.push(Id);
            }
            return { ...prevState, service: updatedService };

        });
        setformErrors((prevErrors) => ({ ...prevErrors, service: '' }));
        console.log("PostFacilityData service 2", PostFacilityData.service);
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
        setformErrors((prevErrors) => ({ ...prevErrors, amenity: '' }));
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
        setformErrors((prevErrors) => ({ ...prevErrors, eventCategory: '' }));
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
        setformErrors(updatedErrors);
        toast.warning("Row removed successfully!");
        console.log("Removed row at index", index);
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
        console.log("PostFacilityData:", PostFacilityData);
        setformErrors((prevErrors) => ({ ...prevErrors, game: '' }));
    };
    //function to seek confirmation ----------------------------------------------
    function handleConfirmation(e) {
        e.preventDefault();
        toast.warn(
            <div>
                <p>Are you sure you want to proceed?</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={(e) => HandleSubmitFacility(e)} className='bg-green-400 text-white p-2 border rounded-md'>Yes</button>
                    <button onClick={() => {
                        toast.dismiss();
                        toast.error('Action cancelled!', {
                            // position: toast.POSITION.TOP_CENTER,
                            // autoClose: 3000,
                        });
                    }} className='bg-red-400 text-white p-2 border rounded-md'>No</button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false, // Disable auto close
                closeOnClick: false, // Disable close on click
            }
        );
        return;
    }
    // here Prev and next page ---------------------------------------------------
    const nextStep = (e) => {
        e.preventDefault()
        // Perform validation before moving to the next step
        const validationErrors = Validation(PostFacilityData);
        const validationErrors2 = Validationinvantory(PostFacilityData)
        console.log("here error of Invantory".validationErrors2)
        setformErrors(validationErrors);
        setformErrors(validationErrors2);
        if (Object.keys(validationErrors).length === 0 && Object.keys(validationErrors2).length === 0) {
            // If there are no validation errors, move to the next step
            setCurrentStep(currentStep + 1);
            toast.success('Successfully moved to the next step!');
        } else {
            // If there are validation errors, display them and prevent moving to the next step

            toast.error('Please fill out all required fields.');
            console.log('Validation errors:', validationErrors);
            setformErrors(validationErrors)

        }
    };
    // 2nd from next step---------------------------------------------------------
    const nextStep2 = (e) => {
        e.preventDefault()
        const validationErrors1 = Validation2(PostFacilityData);
        setformErrors(validationErrors1);
        if (Object.keys(validationErrors1).length === 0) {
            // If there are no validation errors, move to the next step
            setCurrentStep(currentStep + 1);
            toast.success('Successfully moved to the next step!');
        } else {
            // If there are validation errors, display them and prevent moving to the next step
            toast.error('Please fill out all required fields.');
            console.log('Validation errors:', validationErrors1);
            setformErrors(validationErrors1)
        }
    };
    // Prev Button ----------------------------------------------------------------
    const prevStep = (e) => {
        e.preventDefault()
        setCurrentStep(currentStep - 1);
        toast.success('Successfully moved to the Previous Step!');
    };
    // Validation of 1st form ------------------------------------------------------
    const Validation = (value) => {
        const space_block = /^[^\s][^\n\r]*$/;
        const Name_Regex = /^[a-zA-Z ]+$/;
        const Longtitude_regex = /^(?:(?:\d|[1-8]\d|90)\.\d+|(?:9[0-7]|[1-8]\d|\d)(?:\.\d+)?)$/;
        const latitude_regex = /^[-+]?(?:[0-8]?\d(?:\.\d+)?|90(?:\.0+)?)$/;
        const PinCode_Regex = /^\d{6}$/;
        const Regex_Other = /^[a-zA-Z,-]+$/;
        const Area_Acre = /^\d+(\.\d+)?$/;
        const Addition_Infromateion = /^[a-zA-Z\s,\.]+$/;
        const err = {};
        if (!value.facilityType) {
            err.facilityType = "Please Select the Facility Type";
        }
        if (!value.facilityName) {
            err.facilityName = "Please Enter the Facility Name";
        } else if (!space_block.test(value.facilityName)) {
            err.facilityName = 'Do not use spaces at beginning';
        } 
        if (!value.longitude) {
            err.longitude = "Please Enter the longitude";
        } else if (!space_block.test(value.longitude)) {
            err.longitude = "Do not use spaces at beginning"
        }
        else if (!Longtitude_regex.test(value.longitude)) {
            err.longitude = "Please Enter a vaild longitude"
        }
        if (!value.latitude) {
            err.latitude = "Please Enter the latitude";
        } else if (!latitude_regex.test(value.latitude)) {
            err.latitude = "Please Enter a vaild latitude"
        } else if (!space_block.test(value.latitude)) {
            err.latitude = 'Do not use spaces at beginning'
        }
        if (!value.address) {
            err.address = "Please Enter the address";
        } else if (!Addition_Infromateion.test(value.address)) {
            err.address = 'Please Enter a vaild Address'
        } else if (!space_block.test(value.address)) {
            err.address = 'Do not use spaces at beginning'
        }
        if (!value.pin) {
            err.pin = "Please Enter the Pincode";
        } else if (!space_block.test(value.pin)) {
            err.pin = "Do not use spaces at beginning"
        } else if (!PinCode_Regex.test(value.pin)) {
            err.pin = 'Please Enter a vaild Pincode'
        }
        if (!value.area) {
            err.area = "Please Enter the Area";
        } else if (!space_block.test(value.area)) {
            err.area = 'Do not use spaces at beginning'
        } else if (!Area_Acre.test(value.area)) {
            err.area = 'Please Enter a vaild Area'
        }
        if (!value.operatingHoursFrom) {
            err.operatingHoursFrom = "Please Select the Operating Hours From";
        }
        if (!value.operatingHoursTo) {
            err.operatingHoursTo = "Please Select the Operating Hours To";
        }
        // here check start hours should less then or equal to opetingHourTo
        if ((value.operatingHoursFrom) > (value.operatingHoursTo)) {
            err.operatingHoursFrom = "Start operating Hours From should be less than or equal to End Event Date";
            err.operatingHoursTo = "End operating Hours To should be greater than or equal to Start Event Date";
        }
        const isAnyDaySelected = Object.values(value.operatingDays).some((day) => day === 1);
        if (!isAnyDaySelected) {
            err.operatingDays = "Please Select the Operating Days";
        }
        if (value.service.length === 0) {
            err.service = "Please Select the Services"
        }
        if (value.otherServices) {
            if (!Addition_Infromateion.test(value.otherServices)) {
                err.otherServices = "Please Enter a vaild Other services"
            }
            if (!space_block.test(value.otherServices)) {
                err.otherServices = 'Do not use spaces at beginning'
            }
        }
        if (value.amenity.length === 0) {
            err.amenity = 'Please Select the amenity'
        }
        if (value.otherAmenities) {
            if (!Addition_Infromateion.test(value.otherAmenities)) {
                err.otherAmenities = "Please Enter a Vaild Other Amenities"
            }
            if (!space_block.test(value.otherAmenities)) {
                err.otherAmenities = "Do not use spaces at beginning"
            }
        }
        if (value.eventCategory.length === 0) {
            err.eventCategory = "Please Select the Event Category"
        }
        if (value.othereventCategory) {
            if (!Addition_Infromateion.test(value.othereventCategory)) {
                err.othereventCategory = "Please Enter a vaild Other Event Category"
            }
            if (!space_block.test(value.othereventCategory)) {
                err.othereventCategory = "Do not use spaces at beginning"
            }
        }
        if (value.facilityType === "2" && value.game.length === 0) {
            err.game = "Please Select the Game"
        }
        if (value.othergame) {
            if (!Addition_Infromateion.test(value.othergame)) {
                err.othergame = "Please Enter a vaild Other Game"
            }
            if (!space_block.test(value.othergame)) {
                err.othergame = "Do not use spaces at beginning"
            }
        }
        if (!value.additionalDetails) {
            err.additionalDetails = "Please Enter the Additional Details"
        }
        if (!Addition_Infromateion.test(value.additionalDetails)) {
            err.additionalDetails = "Please Enter a vaild Additional Details"
        }
        if (!space_block.test(value.additionalDetails)) {
            err.additionalDetails = "Do not use spaces at beginning"
        }
        if (!value.facilityImage.facilityImageOne) {
            err.facilityImageOne = "Please Upload the Facility Image"
        }
        return err;
    }
    // Vaildation of 2nd form ------------------------------------------------------
    const Validation2 = (val) => {
        const error = {};
        const panCardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        const PHONE_NUMBER = /^[1-9]\d{9}$/;
        const Name_Regex = /^[a-zA-Z ]+$/;
        const space_block = /^[^\s][^\n\r]*$/;
        const EMAIL_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const Addition_Infromateion = /^[a-zA-Z\s,\.]+$/;
        if (!val.facilityisownedbBDA) {
            error.facilityisownedbBDA = "Please Select if the Facility is Owned by BDA or Not";
        }
        if (val.facilityisownedbBDA === 'No') {
            if (!val.firstName) {
                error.firstName = "Please Enter the First Name";
            } else if (!Name_Regex.test(val.firstName)) {
                error.firstName = "Please Enter a valid First Name";
            } else if (!space_block.test(val.firstName)) {
                error.firstName = "Do not use spaces at the beginning";
            }
            if (!val.lastName) {
                error.lastName = "Please Enter the Last Name";
            } else if (!Name_Regex.test(val.lastName)) {
                error.lastName = "Please Enter a valid Last Name";
            } else if (!space_block.test(val.lastName)) {
                error.lastName = "Do not use spaces at the beginning";
            }
            if (!val.phoneNumber) {
                error.phoneNumber = "Please Enter the Phone Number";
            } else if (!PHONE_NUMBER.test(val.phoneNumber)) {
                error.phoneNumber = "Please Enter a vaild Phone Number"
            } else if (!space_block.test(val.phoneNumber)) {
                error.phoneNumber = "Do not use spaces at beginning"
            }
            if (!val.emailAdress) {
                error.emailAdress = "Please Enter the Email Address";
            } else if (!EMAIL_regex.test(val.emailAdress)) {
                error.emailAdress = "Please Enter a valid Email Address"
            } else if (!space_block.test(val.emailAdress)) {
                error.emailAdress = "Do not use spaces at beginning"
            }
            if (!val.ownerPanCard) {
                error.ownerPanCard = "Please Enter the Owner’s PAN Card Number";
            } else if (!panCardRegex.test(val.ownerPanCard)) {
                error.ownerPanCard = "Please Enter a vaild Pan Card Number"
            } else if (!space_block.test(val.ownerPanCard)) {
                error.ownerPanCard = "Do not use spaces at beginning"
            }
            if (!val.ownersAddress) {
                error.ownersAddress = "Please Enter the Owner’s Address";
            } else if (!Addition_Infromateion.test(val.ownersAddress)) {
                error.ownersAddress = "Please Enter a vaild Owner Address"
            } else if (!space_block.test(val.ownersAddress)) {
                error.ownersAddress = "Do not use spaces at beginning"
            }
            if (!val.ownership) {
                error.ownership = "Please Enter the Ownership"
            } else if (!Name_Regex.test(val.ownership)) {
                error.ownership = "Please Enter a vaild ownership"
            } else if (!space_block.test(val.ownership)) {
                error.ownership = "Do not use spaces at beginning"
            }
        }
        return error;
    };
    // Vaildation of Invantory ---------------------------------------------------
    const Validationinvantory = (data) => {
        let errors = {};
        const Number_item_regex = /^(?:[1-9][0-9]?|100)$/;
        const equipmentIds = new Set();
        data.parkInventory.forEach((item, index) => {
            if (!item.equipmentId) {
                errors[`equipmentId${index}`] = "Equipment is required.";
            } else if (equipmentIds.has(item.equipmentId)) {
                errors[`equipmentId${index}`] = "Each equipment must be unique.";
            } else {
                equipmentIds.add(item.equipmentId);
            }
            if (!item.count) {
                errors[`count${index}`] = "Please Enter a Number of item/Equipment"
            } else if (!Number_item_regex.test(item.count)) {
                errors[`count${index}`] = "Please enter a valid number between 1 and 100."
            }

        });
        return errors;
    };
    //useEffect (Update data)-------------------------------------------------------
    useEffect(() => {
        GetFacilityInitailData();
    }, [formErrors]);

    return (
        <div>
            <div className="all_From_conatiner">
                <AdminHeader/>
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
                                            value={PostFacilityData.facilityType}
                                            onChange={handleChange}
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
                                            value={PostFacilityData.facilityName}
                                            onChange={handleChange}
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
                                            value={PostFacilityData.longitude}
                                            onChange={handleChange}
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
                                            value={PostFacilityData.latitude}
                                            onChange={handleChange}
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
                                            value={PostFacilityData.address}
                                            onChange={handleChange}
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
                                            value={PostFacilityData.pin}
                                            onChange={handleChange}
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
                                            value={PostFacilityData.area}
                                            onChange={handleChange}
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
                                            value={PostFacilityData.operatingHoursFrom}
                                            onChange={handleChange}
                                        />
                                        {formErrors.operatingHoursFrom && <p className="error text-red-700">{formErrors.operatingHoursFrom}</p>}
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
                                            value={PostFacilityData.operatingHoursTo}
                                            onChange={handleChange}
                                        />
                                        {formErrors.operatingHoursTo && <p className="error text-red-700">{formErrors.operatingHoursTo}</p>}
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
                                                className={`button-4 ${PostFacilityData.operatingDays.sun ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("sun", e)}
                                            >
                                                Sun
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.mon ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("mon", e)}
                                            >
                                                Mon
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.tue ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("tue", e)}
                                            >
                                                Tue
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.wed ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("wed", e)}
                                            >
                                                Wed
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.thu ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("thu", e)}
                                            >
                                                Thu
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.fri ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("fri", e)}
                                            >
                                                Fri
                                            </button>
                                            <button
                                                type="button"
                                                className={`button-4 ${PostFacilityData.operatingDays.sat ? "selected" : ""
                                                    }`}
                                                onClick={(e) => handleDayClick("sat", e)}
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
                                            value={PostFacilityData.otherServices}
                                            onChange={handleChange}
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
                                            value={PostFacilityData.otherAmenities}
                                            onChange={handleChange}
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
                                            value={PostFacilityData.othereventCategory}
                                            onChange={handleChange}
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
                                                value={PostFacilityData.othergame}
                                                onChange={handleChange}
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
                                            value={PostFacilityData.additionalDetails}
                                            onChange={handleChange}
                                        />
                                        {formErrors.additionalDetails && <p className="error text-red-700">{formErrors.additionalDetails}</p>}
                                    </div>
                                </div>
                                <form id="myForm" className="m-0">
                                    <div className="container" id="facilityImageOneContainer">
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
                                            />
                                            <p className="italic text-sm font-bold text-gray-500">
                                                Max.image file should be less than or eqaul  200 KB.
                                            </p>
                                        </div>
                                        {formErrors.facilityImageOne && <p className="error text-red-700  text-sm">{formErrors.facilityImageOne}</p>}
                                        {PostFacilityData.fileNames.facilityImageOne && (
                                            <div className="image-preview" id="imagePreview">
                                                <p>{PostFacilityData.fileNames.facilityImageOne}
                                                    <span onClick={() => handleImageRemove("facilityImageOne")} style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}>
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </span>
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
                                                onChange={handleChange}
                                            />
                                            <p className="italic text-sm font-bold text-gray-500">
                                                Max. Each image should be less than 200 KB.
                                            </p>
                                            <p className="italic text-sm font-bold text-gray-600">You can only upload up to 5  image for   Additional Facility Images .</p>
                                        </div>
                                        {PostFacilityData.fileNames.facilityArrayOfImages.length > 0 && (
                                            <div className="image-preview" id="imagePreview">
                                                {PostFacilityData.fileNames.facilityArrayOfImages.map((fileName, index) => (
                                                    <p key={index}>
                                                        {fileName}
                                                        <span onClick={() => handleImageRemove("facilityArrayOfImages", index)} style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}>
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </span>
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </form>
                                {/* Add Park inventory */}
                                <div className="Pakr_inventory_form_main_Conatiner">
                                    <h1 className="Park_Inventory_text">Park Inventory</h1>
                                    <div className="Table_Inventory">
                                        <div className="Add_row_Button">
                                            <button className="Inventory_add_button" onClick={handleAddRow}>  Add Row <FontAwesomeIcon icon={faPlus} className="Add_icon" /> </button>
                                        </div>
                                        <table className="Inventory_table">

                                            <thead className="Inventory_thead">
                                                <tr className="Inventory_tr">
                                                    <th className="Inventory_th">Items/Equipment</th>
                                                    <th className="Inventory_th">Number</th>
                                                    <th className="Inventory_th">Actions</th>
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
                                                            />
                                                            {formErrors[`count${index}`] && (
                                                                <span className="error">{formErrors[`count${index}`]}</span>
                                                            )}
                                                        </td>
                                                        <td className="Inventory_td">
                                                            <button
                                                                className="Inventory_button"
                                                                onClick={(e) => handleRemoveRow(index, e)}
                                                            >
                                                                <FontAwesomeIcon icon={faMinus} className="Remove_icon" />
                                                            </button>
                                                        </td>
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
                                        <select id="input2"
                                            name="facilityisownedbBDA"
                                            className="input_padding"
                                            value={PostFacilityData.facilityisownedbBDA}
                                            onChange={handleChange}
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
                                            {!disabledFields && <span className="text-red-600 font-bold text-xl">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            className="input_padding"
                                            id="input1"
                                            placeholder="Enter First Name  "
                                            name="firstName"
                                            value={PostFacilityData.firstName}
                                            onChange={handleChange}
                                            disabled={disabledFields}
                                        />
                                        {formErrors.firstName && <p className="error text-red-700">{formErrors.firstName}</p>}
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
                                            value={PostFacilityData.lastName}
                                            onChange={handleChange}
                                            disabled={disabledFields}
                                        />
                                        {formErrors.lastName && <p className="error text-red-700">{formErrors.lastName}</p>}
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
                                            value={PostFacilityData.phoneNumber}
                                            onChange={handleChange}
                                            disabled={disabledFields}
                                        />
                                        {formErrors.phoneNumber && <p className="error text-red-700">{formErrors.phoneNumber}</p>}
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
                                            value={PostFacilityData.emailAdress}
                                            onChange={handleChange}
                                            disabled={disabledFields}
                                        />
                                        {formErrors.emailAdress && <p className="error text-red-700">{formErrors.emailAdress}</p>}
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
                                            onChange={handleChange}
                                            disabled={disabledFields}
                                        />
                                        {formErrors.ownerPanCard && <p className="error text-red-700">{formErrors.ownerPanCard}</p>}
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
                                            value={PostFacilityData.ownership}
                                            onChange={handleChange}
                                            disabled={disabledFields}
                                        />
                                        {formErrors.ownership && <p className="error text-red-700">{formErrors.ownership}</p>}
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
                                            value={PostFacilityData.ownersAddress}
                                            onChange={handleChange}
                                            disabled={disabledFields}
                                        />
                                        {formErrors.ownersAddress && <p className="error text-red-700">{formErrors.ownersAddress}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="buttons-container">
                                <button type="button" className="prev_button" onClick={(e) => prevStep(e)}>
                                    Previous
                                </button>
                                <button type="submit" className="next_button"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>
                )}
                {/*----------------------------------- step-3 (show the data and Submit--------------------------------------------------------------------------------------------) */}
                {currentStep === 3 && (
                    <form onSubmit={handleConfirmation}   >
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
                                    <form id="myForm" className="m-0">
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
                                    </form>
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
            <ToastContainer />
        </div>
    );
};
export default Facility_Reg;
