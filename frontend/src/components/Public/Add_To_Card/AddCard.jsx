
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
// here Import Css file -------------------------------------------------------------------------
import "./AddCard.css"
const Add_Card = () => {

    // ---------------------------------------------here Return funcatin --------------------------------------------------
    return (
        <div className="Add_to_Card_Main_conatiner9">
           
               <PublicHeader />
            <div className="Add_To_Card_Child_conatiner9">
                <div className="Add_Card_Box9">
                    <div className="Card9">
                        <h1 className="card_text9">Cart</h1>
                    </div>
                    <div className="card_item_conatiner9">
                        <div className="card_item_conatiner_heading9">
                            <h1 className="text_heading9">Circket</h1>
                            <h1 className="icon9"> <FontAwesomeIcon icon={faTrash} className="delete-icon" /></h1>
                        </div>
                        <div className="Cont_card9">
                            <span className="Location_Name_icon9">
                                <h1 className="Location_text9"><FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" /></h1>
                                <h1 className="Location_text9">Netaji Sports Field</h1>
                            </span>
                            <div className="date_time_people_conatiner9">
                                <span className="date_time_text_icon9">
                                    <h1 className="Location_text9"><FontAwesomeIcon icon={faCalendarAlt} className="date-icon" /></h1>
                                    <h1 className="Location_text9">23, February 2024 </h1>
                                </span>
                                <span className="date_time_text_icon9">
                                    <h1 className="Location_text9"><FontAwesomeIcon icon={faClock} className="time-icon" /></h1>
                                    <h1 className="Location_text9">04.00 PM to 05.00 PM</h1>
                                </span>
                                <span className="date_time_text_icon9">
                                    <h1 className="Location_text9"> <FontAwesomeIcon icon={faUsers} className="people-icon" /></h1>
                                    <h1 className="Location_text9">5 players joined</h1>

                                </span>
                            </div>
                            <div className="Money_name_icon9">
                                <h1 className="money_icon_text9"><FontAwesomeIcon icon={faMoneyBillAlt} className="money-note-icon" /></h1>
                                <h1 className="Location_text9">INR 500 /_</h1>
                            </div>
                        </div>
                        {/*------------------------------------ Payment Button --------------------------------------------- */}
                        <div className="Button_pay9">
                            <button class="button-379" role="button">   <FontAwesomeIcon icon={faCreditCard} className="pay-icon" />  Pay INR 1500.00</button>
                        </div>
                    </div>

                </div>

            </div>

            <CommonFooter />
        </div>
    )
}
export default Add_Card;