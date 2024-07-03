import React from "react";
import { useState, useEffect } from "react";
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
// here import Icon ------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faPlus, faMinus, faShoppingCart, faIndianRupeeSign, faCreditCard } from "@fortawesome/free-solid-svg-icons";
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
import { calculateTimeDifferenceinHours } from "../../../utils/utilityFunctions";
const Book_Event = () => {
    // UseSate for post data -------------------------------------
    const [formData, setFormData] = useState({
        entityId: "",
        entityTypeId: "",
        facilityPreference: {
            playersLimit: 1,
            startTime: "",
            durationInHours: 1,
            bookingDate: "",
            price:""
        },
    });
    const [FacilitiesData, setFacilitiesData] = useState('');
    const [errors, setErrors] = useState({}); // State to hold validation errors
    const location = useLocation();
    const navigate = useNavigate();

    // Here Increment ------------------------------------------------
    const handleDecrement = (e) => {
        let { name } = e.target;

        if(name = "playersLimit"){
            let newValue = formData.facilityPreference.playersLimit;
            newValue--;
            if(newValue < 1){
                toast.dismiss();
                toast.warning("Atleast one member required for booking.");
                return;
            }
            let formDataCopy = JSON.parse(JSON.stringify(formData));
            formDataCopy.facilityPreference.playersLimit = newValue;
            setFormData(formDataCopy);
            return;
        }
        else{
            if (formData.facilityPreference.durationInHours > 1) {
                setFormData(prevState => ({
                    ...prevState,
                    facilityPreference: {
                        ...prevState.facilityPreference,
                        durationInHours: prevState.facilityPreference.durationInHours - 1
                    }
                }));
            }
        }
    };

    // Decrement ------------------------------------------------
    const handleIncrement = (e) => {
        e.preventDefault();
        let { name } = e.target;
        console.log(name);

        if(name = "playersLimit"){
            console.log("first");
            let newValue = formData.facilityPreference.playersLimit;
            newValue++;
            console.log("2", newValue)
            if(newValue > 5){
                toast.dismiss();
                toast.warning("Maximum members allowed per booking is 5.");
                return;
            }
            let formDataCopy = JSON.parse(JSON.stringify(formData));
            formDataCopy.facilityPreference.playersLimit = newValue;
            setFormData(formDataCopy);
            return;
        }
        else{
            console.log("3");
            if (formData.facilityPreference.durationInHours < 4) {
                setFormData(prevState => ({
                    ...prevState,
                    facilityPreference: {
                        ...prevState.facilityPreference,
                        durationInHours: prevState.facilityPreference.durationInHours + 1
                    }
                }));
            }
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
        console.log("form data submit", formData)
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
                facilityPreference: {
                    totalMembers: formData.facilityPreference.playersLimit,
                    bookingDate: formData.facilityPreference.bookingDate,
                    startTime: formData.facilityPreference.startTime,
                    durationInHours: formData.facilityPreference.durationInHours,
                    amount: formData.facilityPreference.playersLimit * formData.facilityPreference.playersLimit,
                }
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
            console.log('duration', res.data.eventActivityDetails.eventEndTime, res.data.eventActivityDetails.eventStartTime)
            setFacilitiesData(res.data.eventActivityDetails);
            setFormData({
                ...formData,
                ["entityTypeId"]: 6,
                ["facilityId"]: res.data.eventActivityDetails.eventId,
                ["entityId"]: res.data.eventActivityDetails.eventId,
                ["facilityPreference"]: {
                    playersLimit: 1,
                    startTime: res.data.eventActivityDetails.eventStartTime,
                    durationInHours: calculateTimeDifferenceinHours(res.data.eventActivityDetails.eventStartTime, res.data.eventActivityDetails.eventEndTime),
                    bookingDate: res.data.eventActivityDetails.eventDate,
                    price: res.data.eventActivityDetails.ticketPrice
                }
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

    return (
        <div className="Book_sport_Main_conatiner">
            <ToastContainer />
            <PublicHeader />
            <div className="Book_sport_Child_conatiner">
                <div className="Add_sport_form">
                    <div className="sport_name_Book">
                        <h1 className="Faclity_Name"> {FacilitiesData?.eventName}, {FacilitiesData?.locationName}</h1>
                        {/* <p className="Faclity_Address"> </p> */}
                    </div>
                    <div class="bookingFormWrapper">
                        <form class="bookingForm">
                            <div className="fromgroup_par">
                                <div class="formGroup">
                                    <span class="fieldName" >Total Members</span>
                                    <div className="increament_decrement_conatiner">
                                        <button
                                            type="button"
                                            name="playersLimit"
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
                                            disabled
                                        />
                                        <button
                                            type="button"
                                            name="playersLimit"
                                            className="increment-button"
                                            onClick={handleIncrement}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    {/* <select class="formSelect"
                                        name="playersLimit"
                                        value={formData.facilityPreference.playersLimit}
                                        onChange={handleChangeInput}
                                    >
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
                                    </select> */}

                                </div>
                                <span className="error_massage_span">
                                    {errors.playersLimit && <span className="errorMessage">{errors.playersLimit}</span>}
                                </span>

                            </div>

                            <div className="fromgroup_par">
                                <div class="formGroup">
                                    <span class="fieldName">Date</span>
                                    <input type="date" class="formInput" name="bookingDate" value={formData.facilityPreference.bookingDate} onChange={handleChangeInput} disabled />
                                </div>
                                <span className="error_massage_span">
                                    {errors.bookingDate && <span className="errorMessage">{errors.bookingDate}</span>}
                                </span>

                            </div>
                            <div className="fromgroup_par">
                                <div class="formGroup">
                                    <span class="fieldName">Start Time</span>
                                    <input type="time" class="formInput" name="startTime" value={formData.facilityPreference.startTime} onChange={handleChangeInput} disabled />
                                </div>
                                <span className="error_massage_span">
                                    {errors.startTime && <span className="errorMessage">{errors.startTime}</span>}
                                </span>

                            </div>

                            <div class="formGroup">
                                <span class="fieldName">Duration</span>
                                <div className="increament_decrement_conatiner">
                                    <button
                                        type="button"
                                        className="decrement-button"
                                        onClick={handleDecrement}
                                        disabled
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <input
                                        type="text"
                                        className="formInput_Add_member"
                                        value={formData.facilityPreference.durationInHours}
                                        name="durationInHours"
                                        onChange={handleChangeInput}
                                        disabled
                                    />
                                    <button
                                        type="button"
                                        className="increment-button"
                                        onClick={handleIncrement}
                                        disabled
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>
                            <div class="formGroup">
                                <span class="fieldName">Amount</span>
                                <FontAwesomeIcon icon={faIndianRupeeSign} /><h1 className="price_Sport">&nbsp; {formData.facilityPreference.price * formData.facilityPreference.playersLimit}/-</h1>
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