import React from "react";
import { useState, useEffect } from "react";
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
// here import Icon ------------------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faShoppingCart, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
// Import Navigate and Crypto -----------------------------------
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { decryptData, encryptData } from "../../../utils/encryptData";
// Toast ------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
// Import Css file here ---------------------------------
import "./BlueWayBookPage.css";
// fecth /post data -----------------------------------------------------
import axiosHttpClient from "../../../utils/axios";
import RazorpayButton from "../../../common/RazorpayButton";
const BlueWayBookPage = () => {
    // UseSate for post data -------------------------------------
    const [formData, setFormData] = useState({
        entityId: "",
        entityTypeId: "",
        facilityPreference: {
            playersLimit: 1,
            sports: "",
            startTime: new Date().toTimeString().split(" ")[0],
            endTime: new Date().toTimeString().split(" ")[0],
            bookingDate: new Date().toISOString().split("T")[0],
        },
    });
    const [FacilitiesData, setFacilitiesData] = useState('');
    const [sportsList, setSportsList] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const amount = 10;
    const [isDisabled, setIsDisabled] = useState(true);
    const [errors, setErrors] = useState({});

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
        console.log('formData', formData);
    };
    // here Post the data -------------------------------
    async function HandleAddtoCart() {
        try {
            // Prepare request body
            let modifiedFormData = {
                ...formData
            };
            console.log("formData handleSubmitAndProceed", modifiedFormData);
            const validationError = validation(modifiedFormData);
            let facilityPreference = {
                totalMembers: encryptData(modifiedFormData.facilityPreference.playersLimit),
                amount: encryptData(amount * modifiedFormData.facilityPreference.playersLimit),
                bookingDate: encryptData(modifiedFormData.facilityPreference.bookingDate),
                startTime: encryptData(modifiedFormData.facilityPreference.startTime),
                endTime: encryptData(modifiedFormData.facilityPreference.endTime),
                sports: encryptData(modifiedFormData.facilityPreference.sports)
            };
            console.log("facilityPreference", facilityPreference);
            if (Object.keys(validationError).length <= 0) {
                let res = await axiosHttpClient("Add_to_Cart", "post", {
                    entityId: modifiedFormData.entityId,
                    entityTypeId: modifiedFormData.entityTypeId,
                    facilityPreference,
                });
                toast.success('Added to cart successfully.', {
                    autoClose: 3000, // Toast timer duration in milliseconds
                    onClose: () => {
                        // Navigate to another page after toast timer completes
                        setTimeout(() => {
                            navigate('/cart-details');
                        }, 1000); // Wait 1 second after toast timer completes before navigating
                    }
                });
            }
            else {
                toast.error("Please fill the required data.");
            }
        } catch (err) {
            console.error("here Error of Sport Booking", err);
            toast.error('Add to Cart failed.Try agin')
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
            let res = await axiosHttpClient("PARK_BOOK_PAGE_INITIALDATA_API", "get");
            console.log("here Response of Get sport type in dropdown", res.data.data);
            setSportsList(res.data.data.filter((sports) => {
                return sports.facilityTypeId == 4
            }));
        } catch (err) {
            console.error("here Error of get sport types in dropdown");
        }
    }
    // function to handle payment success
    const handlePaymentSuccess = ({ response, res }) => {
        // console.log("Book park payment success", response);
        let bookingId = res.data.shareableLink[0].bookingId;
        let entityTypeId = res.data.shareableLink[0].entityTypeId;

        toast.success("Event has been booked successfully.", {
            autoClose: 2000,
            onClose: () => {
                setTimeout(() => {
                    navigate(
                        `/profile/booking-details/ticket?bookingId=${encryptData(
                            bookingId
                        )}&typeId=${encryptData(entityTypeId)}`
                    );
                }, 1000);
            },
        });
        // handleSubmitAndProceed();
    };

    //function handle payment failure and notify user
    const handlePaymentFailure = (response) => {
        console.log("Book park payment failure", response);
        toast.dismiss();
        toast.error(response.description);
    };

    // useEffect for Update the data (Call Api) ------------------------
    useEffect(() => {
        let facilityId = decryptData(
            new URLSearchParams(location.search).get("facilityId")
        );
        console.log("facilityId", facilityId);
        GetSportType();
        getSub_Sport_details(facilityId);
    }, []);

    // here Validation fun--------------------------------------------
    const validation = (value) => {
        const err = {}

        if (!value.facilityPreference.sports) {
            err.sports = "Please Select Sport Name"
        }
        if (!value.facilityPreference.bookingDate) {
            err.bookingDate = "Please Select Booking Date"
        }
        if (!value.facilityPreference.startTime) {
            err.startTime = "Please Select Start Time"
        }
        if (!value.facilityPreference.endTime) {
            err.endTime = "Please Select End Time"
        }
        if (!value.facilityPreference.playersLimit && value.facilityPreference.playersLimit > 40) {
            err.playersLimit = "Please enter players Limit upto 40."
        }
        console.log('error', err);
        setErrors(err);
        return err;
    }
    // on formData change, refresh screen
    useEffect(() => {
        console.log("formData", formData);
        let err = validation(formData);
        if(Object.keys(err).length > 0)
            setIsDisabled(true);
        else
            setIsDisabled(false);
    }, [formData])

    useEffect(() => {console.log("isDisabled in useEffect", isDisabled)}, [isDisabled]);
    //  Return (jsx) -------------------------------------------------------------
    return (
        <div className="Book_sport_Main_conatiner">
            <ToastContainer />
            <PublicHeader />
            <div className="Book_sport_Child_conatiner">
                <div className="Add_sport_form">
                    <div className="sport_name_Book">
                        <h1 className="Faclity_Name"> {FacilitiesData?.length > 0 && FacilitiesData[0]?.facilityName}</h1>
                        <span>
                            <p className="Faclity_adress"> {FacilitiesData?.length > 0 && FacilitiesData[0]?.address}</p>
                        </span>

                    </div>
                    <div class="bookingFormWrapper">
                        <form class="bookingForm">
                            <div class="formGroup">
                                <span class="fieldName">Activity<span className="required-asterisk">*</span>:</span>
                                <select class="formSelect"
                                    name="sports"
                                    value={formData.facilityPreference.sports}
                                    onChange={handleChangeInput} >
                                    <option value="">Select</option>
                                    {
                                        sportsList?.length > 0 && sportsList.map((sports) => {
                                            return (
                                                <option value={sports.userActivityId}>{sports.userActivityName}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div class="formGroup">
                                <span class="fieldName">Date<span className="required-asterisk">*</span>:</span>
                                <input type="date" class="formInput" name="bookingDate" value={formData.facilityPreference.bookingDate} onChange={handleChangeInput} />
                            </div>
                            <div class="formGroup">
                                <span class="fieldName">Start Time<span className="required-asterisk">*</span>:</span>
                                <input type="time" class="formInput" name="startTime" value={formData.facilityPreference.startTime} onChange={handleChangeInput} />
                            </div>
                            <div class="formGroup">
                                <span class="fieldName">End Time<span className="required-asterisk">*</span>:</span>
                                <input type="time" class="formInput" name="endTime" value={formData.facilityPreference.endTime} onChange={handleChangeInput} />
                            </div>
                            <div class="formGroup">
                                <span class="fieldName">No of Player<span className="required-asterisk">*</span></span>
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
                                <span class="fieldName">Amount</span>
                                <FontAwesomeIcon icon={faIndianRupeeSign} /><h1 className="price_Sport">&nbsp; {amount * formData.facilityPreference.playersLimit}/-</h1>
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
                                    <FontAwesomeIcon icon={faCreditCard} /> Pay Now <FontAwesomeIcon icon={faIndianRupeeSign} /> {parseFloat(amount * formData.facilityPreference.playersLimit).toFixed(2)}
                                </button>
                                : <RazorpayButton
                                    amount={(amount * formData.facilityPreference.playersLimit) || "0"}
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
                                            amount: encryptData((amount * formData.facilityPreference.playersLimit) || "0"),
                                            bookingDate: encryptData(formData.facilityPreference.bookingDate),
                                            startTime: encryptData(formData.facilityPreference.startTime),
                                            endTime: encryptData(formData.facilityPreference.endTime),
                                            sports: encryptData(formData.facilityPreference.sports)
                                        },
                                        userCartId: null
                                    }}
                                />
                        }
                    </div>
                </div>
            </div>

        </div>
    );
};
export default BlueWayBookPage;
