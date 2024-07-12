
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
import { decryptData } from "../../../utils/encryptData";
import No_item_cart from "../../../assets/No_items_to_cart.png"
import { useSelector } from "react-redux";
import RazorpayButton from "../../../common/RazorpayButton";
import { formatDate } from "../../../utils/utilityFunctions";
import park_image from "../../../assets/park.jpg"

const AddToCart = () => {
    // here useState for Get the data -----------------------------------------------
    const [GetViewCradData, setGetViewCradData] = useState([])
    //
    const[GetPriceData, setGetPriceData]=useState([])
    // here Put (Delete the Cart) ----------------------------------------------------
    // Read the data (useing Selector ) ------------------------------------
    const languageContent = useSelector((state) => state.language.languageContent);
    // Find the language resource key
    const homeLanguageContent = languageContent.find(
        (data) => data.languageResourceKey === "publicHeaderHome"
    );
    const [totalAmount, setTotalAmount] = useState(0.00);


    // Delete the Cart ----------------------------------------
    async function UpdateCart(e, cartItemId) {
        e.preventDefault();
        console.log('cartItemId', cartItemId);
        if (!cartItemId) return;
        try {
            let res = await axiosHttpClient('Update_Card', 'put', null, cartItemId);
            console.log("Update Cart", res);
            toast.success(' Cart has been removed successfully.');
            GetViewCardData()
        }
        catch (err) {
            console.log("Update Error", err);
            toast.error(' Unable to remove cart. Please try again.');
        }
    }
    //    here Get data funcation ------------------------------------------------------
    async function GetViewCardData() {
        try {
            let res = await axiosHttpClient('View_Card_UserId', 'get',)
            console.log("here Response of View Card Data", res.data.data)
            setGetViewCradData(res.data.data)
            setGetPriceData(res.data.data)

            let totalAmount = 0;
            for (let i = 0; i < res.data.data.length; i++) {
                console.log("facilityPreference", res.data.data[i].facilityPreference);
                totalAmount += parseFloat(res.data.data[i].facilityPreference.price);

            }
            setTotalAmount(totalAmount);
            console.log("totalAmount", totalAmount);
        }
        catch (err) {
            console.log("here Error of View Card Data", err)
        }
    }

    // Update / call Api --------------------------------
    useEffect(() => {
        GetViewCardData()
    }, []);



    // ---------------------------------------------here Return funcatin --------------------------------------------------
    return (
        <div className="Add_to_Card_Main_conatiner9">
            <PublicHeader />

            <div className="Add_To_Card_Child_conatiner9">
                <div className="Show_Cart_Details_save_latter">
                    <div className="Cart_details_container" >
                        {GetViewCradData.length > 0 && GetViewCradData.map((cardItem => (
                            <div className="Cart_details" key={cardItem.cartItemId}>
                                <div className="image_section">
                                    <img className="park_image_cart" src={park_image}></img>
                                </div>
                                <div className="text_contant_details_cart">
                                    <span className="park_name_date">
                                        <h1>{cardItem.facilityTypeName}</h1>
                                        <h1 className="park_Booking_Date">{formatDate(cardItem.facilityPreference.bookingDate)}</h1>
                                    </span>
                                    <span className="Details_cart_details">
                                        <h1>{cardItem.facilityName}</h1>

                                        <h1>Total Members : {(cardItem.facilityPreference.totalMembers) || cardItem.facilityPreference.playersLimit}</h1>

                                        <h1>₹{cardItem.facilityPreference.price ? parseFloat(cardItem.facilityPreference.price).toFixed(2) : parseFloat(0.00).toFixed(2)}</h1>
                                    </span>
                                    <span className="Save_remove_button">
                                        <button className="Save_Remove_Button">SAVE FOR LATER</button>
                                        <button className="Save_Remove_Button" onClick={(e) => UpdateCart(e, cardItem.cartItemId)}>REMOVE</button>
                                    </span>

                                </div>

                            </div>
                        )))}
                        <div className="Pay_Now_Buttton">
                            <button >
                                <RazorpayButton
                                    amount={totalAmount}
                                    currency={"INR"}
                                    description={"Book now"}
                                // onSuccess={handlePaymentSuccess}
                                // onFailure={handlePaymentFailure}
                                />
                            </button>
                        </div>
                    </div>
                    <div className="Save_latter_conatiner">
                        <h1>Save for later</h1>
                    </div>
                </div>

               
                <div className="Booking_Bill_Price">
                    <h1 className="parice_detials">PRICE DETAILS</h1>
                    <span className="price_bill">
                        <h1>Price</h1>
                        <h1>₹ {totalAmount} </h1>
                    </span>
                    <span className="price_bill1">
                        <h1>Total items</h1>
                        <h1>76</h1>
                    </span>
                    <span className="price_bill3">
                        <h1>Total Amount</h1>
                        <h1>₹ {totalAmount} </h1>
                    </span>
                </div>
            </div>



            <ToastContainer />
        </div>
    )
}
export default AddToCart;