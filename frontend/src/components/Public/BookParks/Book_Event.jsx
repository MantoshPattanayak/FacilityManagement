import React from "react";
import { useState, useEffect } from "react";
import PublicHeader from "../../../common/PublicHeader";
// here import Icon ------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faPlus, faMinus, faShoppingCart, faIndianRupeeSign, faCreditCard, faClose } from "@fortawesome/free-solid-svg-icons";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { decryptData, encryptData } from "../../../utils/encryptData";
// Toast ------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
// Import Css file here ---------------------------------
// import "./Book_Now_Sport.css";
// fecth /post data -----------------------------------------------------
import axiosHttpClient from "../../../utils/axios";
import { calculateTimeDifferenceinHours } from "../../../utils/utilityFunctions";
import RazorpayButton from "../../../common/RazorpayButton";
import "./Book_Event.css";

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
            price: ""
        },
    });
    const [FacilitiesData, setFacilitiesData] = useState('');
    const [errors, setErrors] = useState({}); // State to hold validation errors
    const location = useLocation();
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true);

    // Here Increment ------------------------------------------------
    const handleDecrement = (e) => {
        let { name } = e.target;

        if (name = "playersLimit") {
            let newValue = formData.facilityPreference.playersLimit;
            newValue--;
            if (newValue < 1) {
                toast.dismiss();
                toast.warning("Atleast one member required for booking.");
                return;
            }
            let formDataCopy = JSON.parse(JSON.stringify(formData));
            formDataCopy.facilityPreference.playersLimit = newValue;
            setFormData(formDataCopy);
            return;
        }
        else {
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
        // console.log(name);

        if (name = "playersLimit") {
            // console.log("first");
            let newValue = formData.facilityPreference.playersLimit;
            newValue++;
            // console.log("2", newValue)
            if (newValue > 5) {
                toast.dismiss();
                toast.warning("Maximum members allowed per booking is 5.");
                return;
            }
            let formDataCopy = JSON.parse(JSON.stringify(formData));
            formDataCopy.facilityPreference.playersLimit = newValue;
            setFormData(formDataCopy);
            return;
        }
        else {
            // console.log("3");
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
                facilityPreference: {
                    totalMembers: encryptData(formData.facilityPreference.playersLimit),
                    bookingDate: encryptData(formData.facilityPreference.bookingDate),
                    startTime: encryptData(formData.facilityPreference.startTime),
                    durationInHours: encryptData(formData.facilityPreference.durationInHours),
                    amount: encryptData(formData.facilityPreference.price * formData.facilityPreference.playersLimit),
                }
            };
            let res = await axiosHttpClient("Add_to_Cart", "post", requestBody);
            toast.success('Add to Cart has been done  successfully.', {
                autoClose: 3000, // Toast timer duration in milliseconds
                onClose: () => {
                    // Navigate to another page after toast timer completes
                    setTimeout(() => {
                        navigate('/cart-details');
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
                    totalMembers: encryptData(formData.facilityPreference.playersLimit),
                    bookingDate: encryptData(formData.facilityPreference.bookingDate),
                    startTime: encryptData(formData.facilityPreference.startTime),
                    durationInHours: encryptData(formData.facilityPreference.durationInHours),
                    amount: encryptData(formData.facilityPreference.price * formData.facilityPreference.playersLimit),
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
            console.error("here Error of Event Booking", err);
            toast.error('Booking details submission failed.')
        }
    }

    // Here Get the data of sport details------------------------------------------
    async function getEventDetails(eventId) {
        console.log("get event details", eventId);
        try {
            let res = await axiosHttpClient("VIEW_EVENT_BY_ID_API", "get", {}, eventId);

            console.log("response of facility fetch api", res);
            console.log('duration', res.data.eventActivityDetails.eventEndTime, res.data.eventActivityDetails.eventStartTime)
            setFacilitiesData(res.data.eventActivityDetails);
            setFormData({
                ...formData,
                ["entityTypeId"]: 6,
                ["eventId"]: res.data.eventActivityDetails.eventId,
                ["entityId"]: res.data.eventActivityDetails.eventId,
                ["facilityPreference"]: {
                    playersLimit: 1,
                    startTime: res.data.eventActivityDetails.eventStartTime.split("T")[1].replace("Z", ''),
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
        let eventId = decryptData(
            new URLSearchParams(location.search).get("eventId")
        );
        console.log("eventId", eventId);
        getEventDetails(eventId);
    }, []);

    // here Validation fun--------------------------------------------
    const validation = (value) => {
        const err = {}
        console.log(value);
        if (!value.bookingDate) {
            err.bookingDate = "Please Select Booking Date"
        }
        if (!value.startTime) {
            err.startTime = "Please Select Start Time"
        }
        console.log(err);
        setErrors(err);
        return err;
    }
    const validateForm = () => {
        const err = validation(formData.facilityPreference);
        setErrors(err);
        return Object.keys(err).length === 0; // Returns true if no errors
    };

    const handlePaymentSuccess = ({ response, res }) => {
        console.log(response);
        console.log("booking response", res);

        let bookingId = res.data.shareableLink[0].bookingId;
        let entityTypeId = res.data.shareableLink[0].entityTypeId;

        toast.success("Event has been booked successfully.", {
            autoClose: 2000,
            onClose: () => {
                setTimeout(() => {
                    navigate(
                        `/profile/booking-details/ticket?bookingId=${encryptData(
                            bookingId
                        )}&typeId=${encryptData(6)}`
                    );
                }, 1000);
            },
        });
        // HandleProccedToPayment();
    }

    const handlePaymentFailure = (response) => {
        // console.log(response);
        toast.dismiss();
        toast.error('Payment failed!!');
        return;
    }

    useEffect(() => {
        // console.log("formData", formData);
        // let err = validation(formData);
        if (Object.keys(errors).length > 0)
            setIsDisabled(true);
        else
            setIsDisabled(false);
    }, [formData])

    return (
        <div className="Book_sport_Main_conatiner">
            {/* <ToastContainer /> */}
            <PublicHeader />
            <div className="Book_sport_Child_conatiner">
                <div className="Add_sport_form">
                    <div className="text-xl flex justify-end cursor-pointer" onClick={(e) => navigate(-1)}><FontAwesomeIcon icon={faClose} /></div>
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
                        <button type="submit" class="add-to-cart-button"
                            onClick={HandleAddtoCart}
                            disabled={isDisabled}
                        >
                            <FontAwesomeIcon icon={faShoppingCart} className="Icon" />
                            Add to Cart
                        </button>
                        {
                            isDisabled ?
                                <button
                                    className="add-to-cart-button"
                                    disabled={isDisabled}
                                >
                                    <FontAwesomeIcon icon={faCreditCard} /> Pay Now <FontAwesomeIcon icon={faIndianRupeeSign} /> {parseFloat(formData.facilityPreference.price * formData.facilityPreference.playersLimit).toFixed(2)}
                                </button>
                                : <RazorpayButton
                                    amount={(formData.facilityPreference.price * formData.facilityPreference.playersLimit) || "0"}
                                    currency={"INR"}
                                    description={"Book now"}
                                    onSuccess={handlePaymentSuccess}
                                    onFailure={handlePaymentFailure}
                                    disabled={isDisabled}
                                    data={{
                                        entityId: encryptData(formData.entityId),
                                        entityTypeId: encryptData(formData.entityTypeId),
                                        facilityPreference: {
                                            totalMembers: encryptData(formData.facilityPreference.playersLimit),
                                            bookingDate: encryptData(formData.facilityPreference.bookingDate),
                                            startTime: encryptData(formData.facilityPreference.startTime),
                                            durationInHours: encryptData(formData.facilityPreference.durationInHours),
                                            amount: encryptData((formData.facilityPreference.price * formData.facilityPreference.playersLimit) || "0"),
                                        },
                                        userCartId: null
                                    }}
                                />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Book_Event;