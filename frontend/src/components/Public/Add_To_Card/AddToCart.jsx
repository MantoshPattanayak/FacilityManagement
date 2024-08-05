
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
// Import here Icon from fontAwesomeIcon ------------------------------------------------------
import { faIndianRupeeSign, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faRupeeSign } from '@fortawesome/free-solid-svg-icons';
// here useSate----------------------------------------------------------
import { useEffect, useState } from "react";
// import axios for (Fetch data) -------------------------------
import axiosHttpClient from "../../../utils/axios";
// here Import Css file -------------------------------------------------------------------------
import "./AddToCart.css"
// Import Toast -------------------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { decryptData, encryptData } from "../../../utils/encryptData";
import No_item_cart from "../../../assets/No_items_to_cart.png"
import { useSelector } from "react-redux";
import RazorpayButton from "../../../common/RazorpayButton";
import { formatDate } from "../../../utils/utilityFunctions";
import park_image from "../../../assets/park.jpg"
import instance from "../../../../env";
import missing_cart from "../../../assets/missing_cart.png"
// Import  Shimmer Ui --------------
import AddCartShimmerUi from "../../../common/AddCartShimmerUi";
const AddToCart = () => {
    // here useState for Get the data -----------------------------------------------
    const [GetViewCradData, setGetViewCradData] = useState([])
    const [GetCountItem, setGetCountItem] = useState([])
    const [saveForLaterData, setsaveForLaterData] = useState([])
    // set loding false
    const [IsLoding, setIsLoding] = useState(false)
    // here Put (Delete the Cart) ----------------------------------------------------
    // Read the data (useing Selector ) ------------------------------------
    const languageContent = useSelector((state) => state.language.languageContent);
    // Find the language resource key
    const homeLanguageContent = languageContent.find(
        (data) => data.languageResourceKey === "publicHeaderHome"
    );
    const [totalAmount, setTotalAmount] = useState(0.00);
    const [refresh, setRefresh] = useState(false);
    const [toastId, setToastId] = useState(null);
    const [cartId, setCartId] = useState('');
    const notify = (message) => {
        if (!toast.isActive(toastId)) {
            const id = toast.success(message, {
                onClose: () => {
                    toast.dismiss(toastId);
                }
            });
            setToastId(id);
        }
    };

    // Delete the Cart ----------------------------------------
    async function UpdateCart(e, cartItemId, action) {
        e.preventDefault();
        console.log('cartItemId', cartItemId);
        if (!cartItemId || !action) return;
        try {
            let res = await axiosHttpClient('Update_Card', 'put', {
                cartItemId: cartItemId,
                action: action
            });
            console.log("Update Cart", res);
            setRefresh(prevState => !prevState);
            if (action === 'REMOVED') {
                // toast.dismiss();
                notify(' Cart item has been removed successfully.');
            } else if (action === 'SAVED_FOR_LATER') {
                // toast.dismiss();
                notify(' Cart item has been saved for later successfully.');
            } else if (action === 'IN_CART') {
                // toast.dismiss();
                notify('Item has been moved to cart successfully.');
            }
            // GetViewCardData(res.data)
        }
        catch (err) {
            console.log("Update Error", err);
            // toast.dismiss();
            notify('Unable to remove cart. Please try again.');
        }
    }
    // here Get data funcation ------------------------------------------------------
    async function GetViewCardData() {
        setIsLoding(true)
        try {
            let res = await axiosHttpClient('View_Card_UserId', 'get',)
            console.log("here Response of View Card Data", res)
            setGetViewCradData(res.data.data)
            setGetCountItem(res.data);
            setsaveForLaterData(res.data.saveForLater)
            setCartId(res.data.data[0].cartId);
            let totalAmount = 0;
            for (let i = 0; i < res.data.data.length; i++) {
                let amount = parseFloat(decryptData(res.data.data[i].facilityPreference.amount));
                if (!isNaN(amount)) {
                    totalAmount += amount;
                }
            }
            setTotalAmount(totalAmount);
            console.log("totalAmount", totalAmount);
            setIsLoding(false)
        }
        catch (err) {
            setIsLoding(false)
            console.log("here Error of View Card Data", err)
        }
    }
    // formate of date and Time -----------------------
    function formatTime(time24) {
        if (!time24) return;
        const [hours, minutes] = time24.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;
        return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
    }

    const handlePaymentSuccess = ({ response, res }) => {
        // console.log("Book park payment success", response);
        console.log("booking response", res);
        // let bookingId = res.data.shareableLink[0].bookingId;
        // let entityTypeId = res.data.shareableLink[0].entityTypeId;

        toast.success("Payment has been done successfully.", {
            autoClose: 2000,
            onClose: () => {
                setTimeout(() => {
                    navigate(`/profile/booking-details`);
                }, 1000);
            },
        });
        // handleSubmitAndProceed();
    };

    const handlePaymentFailure = (response) => {
        // console.log("Book park payment failure", response);
        toast.dismiss();
        toast.error(response.description);
    };

    // Update / call Api --------------------------------
    useEffect(() => {
        GetViewCardData()
    }, []);

    useEffect(() => { GetViewCardData() }, [refresh]);

    // ---------------------------------------------here Return funcatin --------------------------------------------------
    return (
        <div className="Add_to_Card_Main_conatiner9">
            <PublicHeader />

            <div className="Add_To_Card_Child_conatiner9">
                <div className="Show_Cart_Details_save_latter">
                    <div className="Cart_details_container1">
                        <h1 className="cart_items_text">Cart items</h1>
                    </div>
                    {/* Cart Details Section */}
                    {IsLoding ? (
                        // Display shimmer effect while loading
                        <AddCartShimmerUi />
                    ) : (
                        <div className="Cart_details_container">
                            {GetViewCradData?.length > 0 ? (
                                GetViewCradData?.map((cardItem) => (
                                    <div className="Cart_details" key={cardItem.cartItemId}>
                                        <div className="image_section">
                                            <img className="park_image_cart" src={`${instance().baseURL}/static${cardItem.imageUrl}`} alt="No image" />
                                        </div>
                                        <div className="text_contant_details_cart">
                                            <span className="park_name_date">
                                                <h1 className="Park_name_cart">{cardItem.facilityTypeName}</h1>
                                                <h1 className="park_Booking_Date">{formatDate(decryptData(cardItem.facilityPreference.bookingDate))}</h1>
                                            </span>
                                            <span className="Details_cart_details">
                                                <h1 className="facility_name_cart">{cardItem.facilityName}</h1>
                                                <p className="p_tag_text">Total Members : {(decryptData(cardItem.facilityPreference.totalMembers)) || decryptData(cardItem.facilityPreference.playersLimit)}</p>
                                                <p className="p_tag_text">Time: {formatTime(decryptData(cardItem.facilityPreference.startTime)) || ''} </p>
                                                <h1 className="cart_amount">₹ {decryptData(cardItem.facilityPreference.amount) ? parseFloat(decryptData(cardItem.facilityPreference.amount)).toFixed(2) : parseFloat(0.00).toFixed(2)}</h1>
                                            </span>
                                            <span className="Save_remove_button">
                                                <button className="Save_Remove_Button" onClick={(e) => UpdateCart(e, cardItem.cartItemId, 'SAVED_FOR_LATER')}>SAVE FOR LATER</button>
                                                <button className="Save_Remove_Button" onClick={(e) => UpdateCart(e, cardItem.cartItemId, 'REMOVED')}>REMOVE</button>
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="mssing_cart_image">
                                    <img className="image_missing" src={missing_cart}></img>
                                </div>

                            )}
                             
                            {/* Payment button section */}
                            {GetViewCradData.length > 0 && (
                                <div className="Pay_Now_Buttton">
                                    <button >
                                        <RazorpayButton
                                            amount={totalAmount || 0}
                                            currency={"INR"}
                                            description={"Book now"}
                                        // onSuccess={handlePaymentSuccess}
                                        // onFailure={handlePaymentFailure}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Save for Later Section */}
                    <div className="Save_latter_conatiner">
                        <h1 className="Save_for_later_text">Save for later   </h1>
                        {IsLoding ? (
                        // Display shimmer effect while loading
                        <AddCartShimmerUi />
                    ) : (
                        <div className="Cart_details_container">
                            {saveForLaterData?.length > 0 ? (
                                saveForLaterData?.map((Item) => (
                                    <div className="Cart_details" key={Item.cartItemId}>
                                        <div className="image_section">
                                            <img className="park_image_cart" src={`${instance().baseURL}/static${Item.imageUrl}`} alt="No image" />
                                        </div>
                                        <div className="text_contant_details_cart">
                                            <span className="park_name_date">
                                                <h1 className="Park_name_cart">{Item.facilityTypeName}</h1>
                                                <h1 className="park_Booking_Date">{formatDate(decryptData(Item.facilityPreference.bookingDate))}</h1>
                                            </span>
                                            <span className="Details_cart_details">
                                                <h1 className="facility_name_cart">{Item.facilityName}</h1>
                                                <p className="p_tag_text">Total Members : {(decryptData(Item.facilityPreference.totalMembers)) || decryptData(Item.facilityPreference.playersLimit)}</p>
                                                <p className="p_tag_text">Time: {formatTime(decryptData(Item.facilityPreference.startTime)) || ''} </p>
                                                <h1 className="cart_amount">₹ {decryptData(Item.facilityPreference.amount) ? parseFloat(decryptData(Item.facilityPreference.amount)).toFixed(2) : parseFloat(0.00).toFixed(2)}</h1>
                                            </span>
                                            <span className="Save_remove_button">
                                                <button className="Save_Remove_Button" onClick={(e) => UpdateCart(e, Item.cartItemId, 'IN_CART')}>MOVE TO CART</button>
                                                <button className="Save_Remove_Button" onClick={(e) => UpdateCart(e, Item.cartItemId, 'REMOVED')}>REMOVE</button>
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="missing_cart_item"></p>
                            )}
                        </div>
                        )}
                    </div>
                </div>
                {/* Price Details Section */}
                <div className="Booking_Bill_Mian_Conatiner">
                    <div className="Booking_Bill_Price">
                        <h1 className="parice_detials">PRICE DETAILS</h1>
                        <span className="price_bill">
                            <h1>Price</h1>
                            <h1>₹ {totalAmount || 0} </h1>
                        </span>
                        <span className="price_bill1">
                            <h1>Total items</h1>
                            {GetCountItem.count > 0 && (
                                <h1>{GetCountItem.count}</h1>
                            )}
                        </span>
                        <span className="price_bill3">
                            <h1>Total Amount</h1>
                            <h1>₹ {totalAmount || 0} </h1>
                        </span>

                    </div>
                    <h1 className="Safe_text">Safe and Secure Payments.Easy returns.</h1>

                </div>
            </div>

            {/* Toast Notifications */}
            {/* <ToastContainer /> */}
        </div>


    )
}
export default AddToCart;