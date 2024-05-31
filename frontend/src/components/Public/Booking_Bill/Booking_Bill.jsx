
import "./Booking_Bill.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import axiosHttpClient from "../../../utils/axios";
import { useState, useEffect } from "react";
import { decryptData } from "../../../utils/encryptData";
import PublicHeader from "../../../common/PublicHeader";
const Bokking_Bill = () => {
    const [Bill_Data, setBill_Data] = useState([])
    
    const bookingId = decryptData(
        new URLSearchParams(location.search).get("bookingId")
    );
    // here Post/get the data of Bill ------------------
    async function GetBill_Data() {
        try {
            let res = await axiosHttpClient("VIEW_TICKET_BILL_API", "post", {

                bookingId: bookingId
            })
            console.log("here Response of Bill Data", res)
            setBill_Data(res.data.bookingDetails)

        }
        catch (err) {
            console.log("Here error of Get Bill Data", err)
        }
    }

    // formate of date and Time ------------------
    function formatTime(time24) {
        //format 24 hour time as 12 hour time
        if (!time24) return;
        // Parse the input time string
        const [hours, minutes] = time24.split(":").map(Number);
    
        // Determine AM or PM
        const period = hours >= 12 ? "PM" : "AM";
    
        // Convert hours to 12-hour format
        const hours12 = hours % 12 || 12; // 0 should be 12 in 12-hour format
    
        // Format the time string
        const time12 = `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
    
        return time12;
      }
    
      function formatDate(dateString) {
        // Check if the input date string is valid
        if (!dateString) return '';
    
        // Convert the date string to a JavaScript Date object
        const date = new Date(dateString);
    
        // Extract year, month, and day components from the Date object
        const year = date.getFullYear();
        // Add 1 to month because JavaScript months are zero-indexed
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
    
        // Construct the formatted date string as "YYYY-MM-DD"
        return `${year}-${month}-${day}`;
    }
    
    
    // useEffect -------------------------------
    useEffect(() => {
        GetBill_Data()
    }, [])

    return (
        <div className="Ticket_Mian_conatiner">
            <PublicHeader/>
            <div className="ticket">
                <div className="Name_Park">
                
                    {Bill_Data && Bill_Data.facility && (
                        <h1>{Bill_Data.facility.facilityname}</h1>
                    )}
                </div>
                <span className="Share_icon">
                    <FontAwesomeIcon icon={faShareAlt} className="share-icon_font" />
                </span>
                  
                <div className="ticket-header">
                    <h2>Booking Ref#</h2>
                    <p>{Bill_Data.bookingReference}</p>
                </div>
                <span className="Line_one"></span>
                <div className="Location_Park">
                  
                    <h1>Location.</h1>
                    {Bill_Data && Bill_Data.facility && (
                        <h2>{Bill_Data.facility.address}</h2>
                    )}
                  
                   
                </div>

                <div className="Date_Time_tciket">
                    <span className="Tciket_Date">
                        <h1>Date</h1>
                        <h2>{ formatDate(Bill_Data.bookingDate)}</h2>
                    </span>
                    <span className="Ticekt_time">
                        <h1>Time</h1>
                        <h2>{formatTime(Bill_Data.createdOn)}</h2>
                    </span>
                </div>
                <div className="Date_Time_tciket">
                    <span className="Tciket_Date">
                        <h1>Cost</h1>
                        <h2>Rs {Bill_Data.amount} /_</h2>
                    </span>
                    <span className="Ticekt_time">
                        <h1>Total Mamber</h1>
                        <h2>{Bill_Data.totalMembers}</h2>
                    </span>
                </div>
                <div className="QR_CODE">
                    <img className="QR_IMAGE_ICON" src={Bill_Data.QRCodeUrl}></img>

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