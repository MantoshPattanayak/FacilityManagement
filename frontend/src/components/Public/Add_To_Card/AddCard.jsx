
import PublicHeader from "../../../common/PublicHeader";
import CommonFooter from "../../../common/CommonFooter";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import "./AddCard.css"
const Add_Card=()=>{
    return(
        <div className="Add_to_Card_Main_conatiner">
            <PublicHeader/>
            <div className="Add_To_Card_Child_conatiner">
                <div className="Add_Card_Box">
                    <div className="Card">
                       <h1 className="card_text">Cart</h1>  
                    </div>
                  <div className="card_item_conatiner">
                    <div className="card_item_conatiner_heading">
                        <h1 className="text_heading">Circket</h1>
                        <h1 className="icon"> <FontAwesomeIcon icon={faTrash} className="delete-icon" /></h1>
                    </div>
                    <div className="Cont_card">
                        <span className="Location_Name_icon">
                            <h1 className="Location_text"><FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" /></h1>
                            <h1 className="Location_text">Netaji Sports Field</h1>
                        </span>
                       <div className="date_time_people_conatiner">
                           <span className="date_time_text_icon">
                           <h1 className="Location_text"><FontAwesomeIcon icon={faCalendarAlt} className="date-icon" /></h1>
                           <h1 className="Location_text">23, February 2024 </h1>
                           
                           </span>
                           <span className="date_time_text_icon">
                           <h1 className="Location_text"><FontAwesomeIcon icon={faClock} className="time-icon" /></h1>
                            <h1 className="Location_text">04.00 PM to 05.00 PM</h1>
                            
                           </span>
                           <span className="date_time_text_icon">
                           <h1 className="Location_text"> <FontAwesomeIcon icon={faUsers} className="people-icon" /></h1>
                            <h1 className="Location_text">5 players joined</h1>
                          
                           </span>
                          
                       </div>
                       <div className="Money_name_icon">
                               <h1 className="money_icon_text"><FontAwesomeIcon icon={faMoneyBillAlt} className="money-note-icon" /></h1>
                               <h1  className="Location_text">INR 500 /_</h1>
                       </div>
                       
                 
                    </div>
                     <div className="Button_pay">
              
                          <button class="button-37" role="button">   <FontAwesomeIcon icon={faCreditCard} className="pay-icon" />  Pay INR 1500.00</button>
                     </div>
                  </div>

                </div>
               
            </div>
            
           <CommonFooter/>
        </div>
    )
}
export default Add_Card;