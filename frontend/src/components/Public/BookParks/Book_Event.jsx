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
const Book_Event=()=>{
     // UseSate for post data -------------------------------------
     const [formData, setFormData] = useState({
        entityId: "",
        entityTypeId: "",
        facilityPreference: {
            playersLimit: 1,
            sports: "",
            startTime: "",
            durationInHours: 1,
            bookingDate: "",
        },
    });
    const [FacilitiesData, setFacilitiesData] = useState('');
    const [errors, setErrors] = useState({}); // State to hold validation errors
    const location = useLocation();
    const navigate = useNavigate();

    // Here Increment ------------------------------------------------
    const handleDecrement = () => {
        if (formData.facilityPreference.durationInHours > 1) {
            setFormData(prevState => ({
                ...prevState,
                facilityPreference: {
                    ...prevState.facilityPreference,
                    durationInHours: prevState.facilityPreference.durationInHours - 1
                }
            }));
        }
    };

    // Decrement ------------------------------------------------
    const handleIncrement = () => {
        if (formData.facilityPreference.durationInHours < 4) {
            setFormData(prevState => ({
                ...prevState,
                facilityPreference: {
                    ...prevState.facilityPreference,
                    durationInHours: prevState.facilityPreference.durationInHours + 1
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
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };
    // here Post the data (Add to Cart) -------------------------------
    async function HandleAddtoCart() {

        try {
            if (!validateForm()) return;
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

    // here Post the data (Proceed to Payement) -----------------------------
    async function HandleProccedToPayment() {
        console.log('handle proceed payment');
        try {
            if (!validateForm()) return;
            // Prepare request body
            const requestBody = {
                entityId: formData.entityId,
                entityTypeId: formData.entityTypeId,
                facilityPreference: formData.facilityPreference

            };
            let res = await axiosHttpClient("PARK_BOOK_PAGE_SUBMIT_API", "post", requestBody);
            toast.success('Booking details submitted successfully', {
                autoClose: 3000, // Toast timer duration in milliseconds
                onClose: () => {
                    // Navigate to another page after toast timer completes
                    setTimeout(() => {
                        navigate('/');
                    }, 1000); // Wait 1 second after toast timer completes before navigating
                }
            });
        } catch (err) {
            console.error("here Error of Sport Booking", err);
            toast.error('Booking details submission failed.')
        }
    }

    // Here Get the data of sport details------------------------------------------
    async function getEventDetails(facilityId) {
        console.log("get event details", facilityId);
        try {
            let res = await axiosHttpClient("VIEW_EVENT_BY_ID_API", "get", {}, facilityId);

            console.log("response of facility fetch api", res);
            setFacilitiesData(res.data.eventActivityDetails);
            setFormData({
                ...formData,
                ["entityTypeId"]: 6,
                ["facilityId"]: res.data.eventActivityDetails.eventId,
                ["entityId"]: res.data.eventActivityDetails.eventId,
            });
        } catch (err) {
            console.log("here Error", err);
        }
    }
    // useEffect for Update the data (Call Api) ------------------------
    useEffect(() => {
        let facilityId = decryptData(
            new URLSearchParams(location.search).get("eventId")
        );
        console.log("facilityId", facilityId);
        getEventDetails(facilityId);
    }, []);

    // here Validation fun--------------------------------------------
    const validation = (value) => {
        const err = {}

        if (!value.bookingDate) {
            err.bookingDate = "Please Select Booking Date"
        }
        if (!value.startTime) {
            err.startTime = "Please Select Start Time"
        }
        console.log(err);
        return err;
    }
    const validateForm = () => {
        const err = validation(formData.facilityPreference);
        setErrors(err);
        return Object.keys(err).length === 0; // Returns true if no errors
    };
    return(
        <div className="Book_sport_Main_conatiner">
        <ToastContainer />
        <PublicHeader />
        <div className="Book_sport_Child_conatiner">
            <div className="Add_sport_form">
                <div className="sport_name_Book">
                    <h1 className="Faclity_Name"> {FacilitiesData?.eventName}</h1>
                    <p className="Faclity_Address"> {FacilitiesData?.locationName}</p>
                </div>
                <div class="bookingFormWrapper">
                    <form class="bookingForm">
                        <div className="fromgroup_par">
                            <div class="formGroup">
                                <span class="fieldName" >Total Members</span>
                                <select class="formSelect"
                                    name="sports"
                                    value={formData.sports}
                                    onChange={handleChangeInput} >
                                     <option value="">1</option>
                                     <option value="">2</option>
                                     <option value="">3</option>
                                     <option value="">4</option>
                                     <option value="">5</option>
                                     <option value="">6</option>
                                     <option value="">7</option>
                                     <option value="">8</option>
                                     <option value="">9</option>
                                     <option value="">10</option>

                                     <option value="">11</option>
                                     <option value="">12</option>
                                     <option value="">1</option>

                                     <option value="">13</option>
                                     <option value="">14</option>
                                     <option value="">15</option>
                                     <option value="">16</option>

                                     <option value="">17</option>
                                     <option value="">18</option>
                                     <option value="">19</option>
                                     <option value="">20</option>
                                 
                                </select>

                            </div>
                            <span className="error_massage_span">
                                {errors.sports && <span className="errorMessage">{errors.sports}</span>}
                            </span>

                        </div>

                        <div className="fromgroup_par">
                            <div class="formGroup">
                                <span class="fieldName"   >Date:</span>
                                <input type="date" class="formInput" name="bookingDate" value={formData.bookingDate} onChange={handleChangeInput} />
                            </div>
                            <span className="error_massage_span">
                                {errors.bookingDate && <span className="errorMessage">{errors.bookingDate}</span>}
                            </span>

                        </div>
                        <div className="fromgroup_par">
                            <div class="formGroup">
                                <span class="fieldName"   >Satrt Time:</span>
                                <input type="time" class="formInput" name="startTime" value={formData.startTime} onChange={handleChangeInput} />
                            </div>
                            <span className="error_massage_span">
                                {errors.startTime && <span className="errorMessage">{errors.startTime}</span>}
                            </span>

                        </div>
                     
                        <div class="formGroup">
                            <span class="fieldName"  >Duration</span>
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
                                    value={formData.facilityPreference.durationInHours}
                                    name="durationInHours"
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
                    
                    </form>
                </div>
                <div className="Button_Conatiner_Sport">
                    <button type="submit" class="Add_to_Cart"
                        onClick={HandleAddtoCart}
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="Icon" />
                        Add to Cart
                    </button>
                    <button type="submit" class="Proceed_to_Payment" 
                    onClick={HandleProccedToPayment}
                    >
                        <FontAwesomeIcon icon={faCreditCard} className="Icon" />
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>

    </div>
    )
}

export default Book_Event;