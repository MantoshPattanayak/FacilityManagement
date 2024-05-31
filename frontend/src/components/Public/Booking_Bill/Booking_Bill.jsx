
import "./Booking_Bill.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faShareAlt } from '@fortawesome/free-solid-svg-icons';

const Bokking_Bill = () => {
    return (
        <div  className="Ticket_Mian_conatiner">
            <div className="ticket">
                <span className="Share_icon">
                    <FontAwesomeIcon icon={faShareAlt} className="share-icon_font" />
                </span>

                <div className="ticket-header">
                    <h2>Booking Ref#</h2>
                    <p>99875</p>
                </div>
                <span className="Line_one"></span>
                <div className="Location_Park">
                    <h1>Location.</h1>
                    <h2>BDA PARK Phase-11</h2>
                </div>

                <div className="Date_Time_tciket">
                    <span className="Tciket_Date">
                        <h1>Date</h1>
                        <h2>Wed 24 Apr 2024</h2>
                    </span>
                    <span className="Ticekt_time">
                        <h1>Time</h1>
                        <h2>10:00AM</h2>
                    </span>
                </div>
                <div className="Date_Time_tciket">
                    <span className="Tciket_Date">
                        <h1>Cost</h1>
                        <h2>Rs 00.00 /_</h2>
                    </span>
                    <span className="Ticekt_time">
                        <h1>Total Mamber</h1>
                        <h2>00</h2>
                    </span>
                </div>
                <div className="QR_CODE">
                    <img className="QR_IMAGE_ICON" src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"></img>

                </div>
            </div>
              <div className="Buttonn_e-ticket">
                 <button type="Button" className="button-379">
                    Print E-Ticket</button>
                    <button type="Button" className="button-3791">
                  Cancel</button>
              </div>
             
        </div>

    )
}
export default Bokking_Bill;