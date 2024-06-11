
import "./Booking_Bill.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faWhatsapp, faInstagram,faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axiosHttpClient from "../../../utils/axios";
import { useState, useEffect } from "react";
import { decryptData } from "../../../utils/encryptData";
import PublicHeader from "../../../common/PublicHeader";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2pdf from 'html2pdf.js';

import {
    FacebookShareButton,
    WhatsappShareButton,
    InstapaperShareButton,
    EmailShareButton,
    TwitterShareButton,
} from 'react-share';

const Bokking_Bill = () => {
    const [Bill_Data, setBill_Data] = useState([])
    const [showSharePopup, setShowSharePopup] = useState(false);

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

    // here Generate the pdf of Bill_amount----------------------
    async function GeneratePdf() {
        try {
            let res = await axiosHttpClient('VIEW_TICKET_BILL_API', 'post', {
                bookingId: bookingId
            });

            console.log("here Response of Generate Pdf", res);

            const content = document.querySelector('.ticket');
            const date = new Date();
            const formattedDate = date.toLocaleDateString();

            const opt = {
                filename: "Booking_Ticket.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 1 },
                jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
                footer: {
                    height: "0.5in",
                    contents: `<div style="text-align: center;">Generated on: ${formattedDate}</div>`
                }
            };

            // Convert HTML to PDF and open in new tab
            html2pdf().set(opt).from(content).toPdf().get('pdf').then(function (pdf) {
                window.open(pdf.output('bloburl'), '_blank');
            });
        } catch (err) {
            console.log("here Error in Generate Pdf", err)
        }
    }


    // generate Pdf
    const hadleGeneratePd = () => {
        GeneratePdf()
    }

// Toggle Popopup-
const ToggleSharePopup=()=>{
    setShowSharePopup(!showSharePopup)
}
const shareUrl = "https://example.com"; // Replace this with your actual URL
    const title = "Check out this ticket!"; // Replace this with your desired title
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
        return `${day}-${month}-${year}`;
    }


    // useEffect -------------------------------
    useEffect(() => {
        GetBill_Data();

    }, [])

    return (
        <div className="Ticket_Mian_conatiner">
            <PublicHeader />
            <div className="ticket">
                <div className="Name_Park">

                    {Bill_Data && Bill_Data.facility && (
                        <h1>{Bill_Data.facility.facilityname}</h1>
                    )}
                </div>
                <div className="share_Popup_icon">

             
                <span className="Share_icon" onClick={ToggleSharePopup}>
                    <FontAwesomeIcon icon={faShareAlt} className="share-icon_font" />
                </span>
                {showSharePopup && (
                <div className="share-popup">
                    <FacebookShareButton url={shareUrl} quote={title}>
                        <FontAwesomeIcon icon={faFacebook} className="social-media-icon_fa" />
                    </FacebookShareButton>
                    <WhatsappShareButton url={shareUrl}>
                        <FontAwesomeIcon icon={faWhatsapp} className="social-media-icon_what " />
                    </WhatsappShareButton>
                    <InstapaperShareButton url={shareUrl} title={title}>
                        <FontAwesomeIcon icon={faInstagram} className="social-media-icon_insta" />
                    </InstapaperShareButton>
                    <EmailShareButton url={shareUrl} title={title}>
                        <FontAwesomeIcon icon={faEnvelope} className="social-media-icon_email" />
                    </EmailShareButton>
                    <TwitterShareButton url={shareUrl} title={title}>
                        <FontAwesomeIcon icon={faTwitter} className="social-media-icon_twitter" />
                    </TwitterShareButton>
                    {/* Add more share buttons as needed */}
                </div>
            )}
           </div>
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
                        <h2>{formatDate(Bill_Data.bookingDate)}</h2>
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
                        <h1>Total Member(s)</h1>
                        <h2 className="text-center">{Bill_Data.totalMembers}</h2>
                    </span>
                </div>
                <div className="QR_CODE">
                    <img className="QR_IMAGE_ICON" src={Bill_Data.QRCodeUrl}></img>

                </div>
            </div>
            <div className="Buttonn_e-ticket">
                <button type="Button" className="button-379" onClick={hadleGeneratePd}>
                    Print E-Ticket</button>
                <button type="Button" className="button-3791">
                    Cancel</button>
            </div>

        </div>

    )
}
export default Bokking_Bill;