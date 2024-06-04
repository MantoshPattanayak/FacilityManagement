
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
// Import here Icon from fontAwesomeIcon ------------------------------------------------------
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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
import "./AddCard.css"
// Import Toast -------------------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { decryptData } from "../../../utils/encryptData";
import CommonFooter1 from "../../../common/Common_footer1";

import { useSelector } from "react-redux";
const Add_Card = () => {
    // here useState for Get the data -----------------------------------------------
    const [GetViewCradData, setGetViewCradData] = useState([])
    // here Put (Delete the Cart) ----------------------------------------------------
     // Read the data (useing Selector ) ------------------------------------
    const languageContent = useSelector((state) => state.language.languageContent);
    // Find the language resource key
    const homeLanguageContent = languageContent.find(
      (data) => data.languageResourceKey === "publicHeaderHome"
    );


    // Delete the Cart ----------------------------------------
    async function UpdateCart(e, cartItemId) {
        e.preventDefault();
        console.log('cartItemId', cartItemId);
        if(!cartItemId) return;
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
                let res = await axiosHttpClient('View_Card_UserId', 'get', )
                console.log("here Response of View Card Data", res)
                setGetViewCradData(res.data.data)
            }
            catch (err) {
                console.log("here Error of View Card Data", err)
            }
        }
     
    // Update / call Api --------------------------------
    useEffect(() => {
        GetViewCardData()
    }, [])



    // ---------------------------------------------here Return funcatin --------------------------------------------------
    return (
        <div className="Add_to_Card_Main_conatiner9">

            <PublicHeader />
            <div className="Add_To_Card_Child_conatiner9">
            
                <div className="Add_Card_Box9">
                    <div className="Card9">
                       <h1 className="card_text9">Cart</h1>
                    </div>
                    <div className="card_item_conatiner9" >
                        {GetViewCradData.length > 0 && GetViewCradData.map((cardItem) => (
                            <div className="p-5" key={cardItem.cartItemId}>
                                <div className="card_item_conatiner_heading9">
                                    <h1 className="text_heading9">{cardItem.facilityTypeName}</h1>
                                   <button onClick={(e) =>  UpdateCart(e, cardItem.cartItemId)}> <h1 className="icon9" > <FontAwesomeIcon icon={faTrash} className="delete-icon" /></h1></button> 
                                </div>
                                <div className="Cont_card9">
                                    <span className="Location_Name_icon9">
                                        <h1 className="Location_text9"><FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" /></h1>
                                        <h1 className="Location_text9">{cardItem.facilityName}</h1>
                                    </span>
                                    <div className="date_time_people_conatiner9">
                                        <span className="date_time_text_icon9">
                                            <h1 className="Location_text9"><FontAwesomeIcon icon={faCalendarAlt} className="date-icon" /></h1>
                                            <h1 className="Location_text9">{cardItem.facilityPreference.bookingDate} </h1>
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
                                        <h1 className="money_icon_text9"><FontAwesomeIcon icon={faRupeeSign} className="money-note-icon" /></h1>
                                        <h1 className="Location_text9">INR 0.00 /_</h1>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/*------------------------------------ Payment Button --------------------------------------------- */}
                        <div className="Button_pay9">
                            <button className="button-379" role="button">
                                 <FontAwesomeIcon icon={faCreditCard} className="pay-icon" />  Pay INR 00.00
                            </button>
                        </div>
                    </div>




                </div>

            </div>

   
        </div>
    )
}
export default Add_Card;