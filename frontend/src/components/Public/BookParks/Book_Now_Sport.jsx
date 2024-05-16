import React from "react";
import { useState, useEffect } from "react";
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
// here import Icon ------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { decryptData } from "../../../utils/encryptData";
// Toast ------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
// Import Css file here ---------------------------------
import "./Book_Now_Sport.css";
// fecth /post data -----------------------------------------------------
import axiosHttpClient from "../../../utils/axios";
const Book_Now_Sport = () => {
    // UseSate for post data -------------------------------------
    const [formData, setFormData] = useState({
        entityId: "",
        entityTypeId: "",
        facilityPreference: {
            playersLimit: 1,
            sports: "",
            startTime: "",
            endTime: "",
            bookingDate: "",
        },
    });
    const [FacilitiesData, setFacilitiesData] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Here Increment ------------------------------------------------
    const handleDecrement = () => {
        if (formData.facilityPreference.playersLimit > 1) {
            setFormData(prevState => ({
                ...prevState,
                facilityPreference: {
                    ...prevState.facilityPreference,
                    playersLimit: prevState.facilityPreference.playersLimit - 1
                }
            }));
        }
    };

    // Decrement ------------------------------------------------
    const handleIncrement = () => {
        if (formData.facilityPreference.playersLimit < 25) {
            setFormData(prevState => ({
                ...prevState,
                facilityPreference: {
                    ...prevState.facilityPreference,
                    playersLimit: prevState.facilityPreference.playersLimit + 1
                }
            }));
        }
    };

    // Handle OnChange value ------------------------------------------
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            facilityPreference: {
                ...prevState.facilityPreference,
                [name]: value
            }
        }));
    };
    // here Post the data -------------------------------
    async function HandleAddtoCart() {
        try {
            // Prepare request body
            const requestBody = {
                entityId: formData.entityId,
                entityTypeId: formData.entityTypeId,
                facilityPreference: formData.facilityPreference

            };
            let res = await axiosHttpClient("Add_to_Cart", "post", requestBody);
            toast.success('Add to Cart has been done  successfully.', {
                autoClose: 3000, // Toast timer duration in milliseconds
                onClose: () => {
                    // Navigate to another page after toast timer completes
                    setTimeout(() => {
                        navigate('/BookParks/Add_Card');
                    }, 1000); // Wait 1 second after toast timer completes before navigating
                }
            });
        } catch (err) {
            console.error("here Error of Sport Booking", err);
            toast.error('Add to Cart  failed.Try agin')
        }
    }

    // Here Get the data ofsport details------------------------------------------
    async function getSub_Sport_details(facilityId) {
        console.log("get park details", facilityId);
        try {
            let res = await axiosHttpClient("View_By_ParkId", "get", {}, facilityId);

            console.log("response of facility fetch api", res);
            setFacilitiesData(res.data.facilitiesData);
            setFormData({
                ...formData,
                ["entityTypeId"]: res.data.facilitiesData[0].facilityTypeId,
                ["facilityId"]: facilityId,
                ["entityId"]: facilityId,
            });
        } catch (err) {
            console.log("here Error", err);
        }
    }
    //  here Get types of Sport ----------------------
    async function GetSportType() {
        try {
            let res = await axiosHttpClient("here Api", "get");
            console.log("here Response of Get sport type in dropdown", res);
        } catch (err) {
            console.error("here Error of get sport types in dropdown");
        }
    }
    // useEffect for Update the data (Call Api) ------------------------
    useEffect(() => {
        let facilityId = decryptData(
            new URLSearchParams(location.search).get("facilityId")
        );
        console.log("facilityId", facilityId);
        // GetSportType();
        getSub_Sport_details(facilityId);
    }, []);

    // here Validation fun--------------------------------------------
    const validation = (value) => {
        const err = {}

        if (!value.sports) {
            err.sports = "Please Select Sport Name"
        }
        if (!value.bookingDate) {
            err.bookingDate = "Please Select Booking Date"
        }
        if (!value.startTime) {
            err.startTime = "Please Select Start Time"
        }
        if (!value.endTime) {
            err.endTime = "Please Select End Time"
        }
        if (!value.playersLimit) {
            err.playersLimit = "Please Select players Limit"
        }
        return err;
    }
    //  Return (jsx) -------------------------------------------------------------
    return (
        <div className="Book_sport_Main_conatiner">
            <ToastContainer />
            <PublicHeader />
            <div className="Book_sport_Child_conatiner">
                <div className="Add_sport_form">
                    <div className="sport_name_Book">
                        <h1> {FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityName}</h1>
                        <p> {FacilitiesData?.length > 0 && FacilitiesData[0]?.address}</p>
                    </div>
                    <div class="bookingFormWrapper">
                        <form class="bookingForm">
                            <div class="formGroup">
                                <span class="fieldName" >Sport:</span>
                                <select class="formSelect"
                                    name="sports"
                                    value={formData.sports}
                                    onChange={handleChangeInput} >
                                    <option value="football">Football</option>
                                    <option value="basketball">Basketball</option>
                                    <option value="tennis">Tennis</option>
                                    <option value="swimming">Swimming</option>
                                </select>
                            </div>
                            <div class="formGroup">
                                <span class="fieldName"   >Date:</span>
                                <input type="date" class="formInput" name="bookingDate" value={formData.bookingDate} onChange={handleChangeInput} />
                            </div>
                            <div class="formGroup">
                                <span class="fieldName"   >Satrt Time:</span>
                                <input type="time" class="formInput" name="startTime" value={formData.startTime} onChange={handleChangeInput} />
                            </div>
                            <div class="formGroup">
                                <span class="fieldName"   >End Time:</span>
                                <input type="time" class="formInput" name="endTime" value={formData.endTime} onChange={handleChangeInput} />
                            </div>
                            <div class="formGroup">
                                <span class="fieldName"  >Player Limit:</span>
                                <div className="increament_decrement_conatiner">
                                    <button
                                        type="button"
                                        className="decrement-button"

                                        onClick={handleDecrement}
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <input
                                        type="text"
                                        className="formInput_Add_member"
                                        value={formData.facilityPreference.playersLimit}
                                        name="playersLimit"
                                        onChange={handleChangeInput}
                                    />
                                    <button
                                        type="button"
                                        className="increment-button"
                                        onClick={handleIncrement}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>
                            <div class="formGroup">
                                <span class="fieldName">Price</span>
                                <h1 className="price_Sport">INR 78/_</h1>
                            </div>
                        </form>
                    </div>
                    <div className="Button_Conatiner_Sport">
                        <button type="submit" class="Add_to_Cart"
                            onClick={HandleAddtoCart}
                        >
                            <FontAwesomeIcon icon={faShoppingCart} className="Icon" />
                            Add to Cart
                        </button>
                        <button type="submit" class="Proceed_to_Payment">
                            <FontAwesomeIcon icon={faCreditCard} className="Icon" />
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
            <CommonFooter />
        </div>
    );
};
export default Book_Now_Sport;
