
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

const AddToCart = () => {
    // here useState for Get the data -----------------------------------------------
    const [GetViewCradData, setGetViewCradData] = useState([])
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

            let totalAmount = 0;
            for(let i = 0; i < res.data.data.length; i++) {
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
                <div className="Add_Card_Box9">
                    <div className="Card9">
                        <h1 className="card_text9">Cart</h1>
                    </div>
                    {GetViewCradData.length > 0 ? (
                        <div className="card_item_conatiner9" >
                            {GetViewCradData.map((cardItem) => (
                                <div className="p-5" key={cardItem.cartItemId}>
                                    <div className="card_item_conatiner_heading9">
                                        <h1 className="text_heading9">{cardItem.facilityTypeName}</h1>
                                        <button onClick={(e) => UpdateCart(e, cardItem.cartItemId)}> <h1 className="icon9" > <FontAwesomeIcon icon={faTrash} className="delete-icon22" /></h1></button>
                                    </div>
                                    <div className="Cont_card9">
                                        <span className="Location_Name_icon9">
                                            <h1 className="Location_text9"><FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" /></h1>
                                            <h1 className="Location_text9">{cardItem.facilityName}</h1>
                                        </span>
                                        <div className="date_time_people_conatiner9">
                                            <span className="date_time_text_icon9">
                                                <h1 className="Location_text9"><FontAwesomeIcon icon={faCalendarAlt} className="date-icon" /></h1>
                                                <h1 className="Location_text9">{formatDate(cardItem.facilityPreference.bookingDate)} </h1>
                                            </span>
                                            <span className="date_time_text_icon9">
                                                <h1 className="Location_text9"><FontAwesomeIcon icon={faClock} className="time-icon" /></h1>
                                                <h1 className="Location_text9">{cardItem.facilityPreference.startTime} </h1>
                                            </span>
                                            <span className="date_time_text_icon9">
                                                <h1 className="Location_text9"> <FontAwesomeIcon icon={faUsers} className="people-icon" /></h1>
                                                <h1 className="Location_text9">{(cardItem.facilityPreference.totalMembers) || cardItem.facilityPreference.playersLimit} players joined</h1>
                                            </span>
                                        </div>
                                        <div className="Money_name_icon9">
                                            <h1 className="Location_text9"><FontAwesomeIcon icon={faIndianRupeeSign} />&nbsp;{cardItem.facilityPreference.price ? parseFloat(cardItem.facilityPreference.price).toFixed(2) : parseFloat(0.00).toFixed(2)}</h1>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/*------------------------------------ Payment Button --------------------------------------------- */}
                            <div className="Button_pay9">
                                <RazorpayButton
                                    amount={totalAmount}
                                    currency={"INR"}
                                    description={"Book now"}
                                    // onSuccess={handlePaymentSuccess}
                                    // onFailure={handlePaymentFailure}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="No_item_in_cart">
                            <img src={No_item_cart}></img>
                        </div>
                    )
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
export default AddToCart;