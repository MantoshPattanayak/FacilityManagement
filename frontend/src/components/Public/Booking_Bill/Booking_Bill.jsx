
import "./Booking_Bill.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupee, faRupeeSign, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faWhatsapp, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import axiosHttpClient from "../../../utils/axios";
import { useState, useEffect } from "react";
import { decryptData } from "../../../utils/encryptData";
import PublicHeader from "../../../common/PublicHeader";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2pdf from 'html2pdf.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    //   here share Url on social Media ---------------------------------
    const [shareUrl, setshareUrl] = useState("")
    const [title, setTitle] = useState(["Check out this ticket!"]);
    const bookingId = decryptData(new URLSearchParams(location.search).get("bookingId"));
    const entityTypeId = decryptData(new URLSearchParams(location.search).get("typeId"));
    const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
    const [checkBoxValue, setCheckBoxValue] = useState(false);
    const [userLocation, setUserLocation] = useState(JSON.parse(sessionStorage.getItem("location")) || { latitude: 20.2961, longitude: 85.8245 })
    // here Post/get the data of Bill ------------------
    async function GetBill_Data() {
        try {
            let res = await axiosHttpClient("VIEW_TICKET_BILL_API", "post", {
                bookingId: bookingId, entityTypeId: entityTypeId, origin: userLocation
            })
            console.log("here Response of Bill Data", res.data.bookingDetails);
            const dynamicUrlPart = res.data.bookingDetails.url;
            setBill_Data(res.data.bookingDetails)

            setshareUrl(`http://localhost:8000/static${dynamicUrlPart}`)
            setTitle(`           Check out ${res.data.bookingDetails.facilityname} ticket!                          `)
        }
        catch (err) {
            console.log("Here error of Get Bill Data", err)
        }
    }

    // here Generate the pdf of Bill_amount----------------------
    async function GeneratePdf() {
        try {
            let res = await axiosHttpClient('VIEW_TICKET_BILL_API', 'post', {
                bookingId: bookingId,
                entityTypeId: entityTypeId,
                origin: userLocation
            });

            console.log("here Response of Generate Pdf", res, bookingId);

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
    const ToggleSharePopup = () => {
        setShowSharePopup(!showSharePopup)
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
        return `${day}-${month}-${year}`;
    }

    async function handleCancel(e) {
        e.preventDefault();
        toast.dismiss();
        try {
            let res = await axiosHttpClient('CANCEL_REFUND_TICKET', 'post', {
                facilityBookingId: Bill_Data.facilityBookingId,
                facilityId: Bill_Data.facilityId,
                bookingReference: Bill_Data.bookingReference,
                bookingDate: Bill_Data.bookingDate
            })

            toast.success(res.data.message, {
                onClose: () => {
                    // Navigate to another page after toast timer completes
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000); // Wait 1 second after toast timer completes before navigating
                }
            });
        }
        catch (error) {
            console.error(error);
            toast.error('Cancellation of ticket. Please and try again later!');
        }
    }

    //function to seek confirmation
    function handleConfirmation(e) {
        e.preventDefault();
        toast.dismiss();
        // Disable interactions with the background
        document.querySelectorAll('.Ticket_Mian_conatiner')[0].style.pointerEvents = 'none';
        document.querySelectorAll('.Ticket_Mian_conatiner')[0].style.opacity = 0.4;

        toast.warn(
            <div>
                <p>Are you sure you want to cancel?</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCancel();
                            // Re-enable interactions with the background
                            document.querySelectorAll('.Ticket_Mian_conatiner')[0].style.pointerEvents = 'auto';
                            document.querySelectorAll('.Ticket_Mian_conatiner')[0].style.opacity = 1;
                            toast.dismiss();
                        }}
                        className="bg-green-400 text-white p-2 border rounded-md"
                    >
                        Yes
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Re-enable interactions with the background
                            document.querySelectorAll('.Ticket_Mian_conatiner')[0].style.pointerEvents = 'auto';
                            document.querySelectorAll('.Ticket_Mian_conatiner')[0].style.opacity = 1;
                            toast.dismiss();
                            toast.error('Action cancelled!', {
                                position: "top-right",
                                autoClose: 3000,
                            });
                        }}
                        className="bg-red-400 text-white p-2 border rounded-md"
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false, // Disable auto close
                closeOnClick: false, // Disable close on click
                onClose: () => {
                    // Re-enable interactions with the background if the toast is closed
                    document.body.style.pointerEvents = 'auto';
                }
            }
        );
        return;
    }

    // useEffect -------------------------------
    useEffect(() => {
        GetBill_Data();
    }, [])

    // refresh policy page based on checkbox
    useEffect(() => { }, [checkBoxValue]);

    return (
        <>
            <div className="Ticket_Mian_conatiner">
                <PublicHeader />
                <div className="ticket">
                    <div className="Name_Park">
                        { 
                            entityTypeId == 6 && Bill_Data?.eventName && 
                            (
                                <h1>{Bill_Data.eventName}</h1>
                            )
                        }
                        {
                            (entityTypeId == 1 || entityTypeId == 2 || entityTypeId == 3 || entityTypeId == 4 || entityTypeId == 5) && Bill_Data?.facilityname && 
                            (
                                <h1>{Bill_Data.facilityname}</h1>
                            )
                        }
                    </div>
                    <div className="location_QR_Location_Name">
                        <span>
                            
                            <img className="QR_IMAGE_ICON1" src={Bill_Data.googleMapsBaseURL}></img>
                            <p className="scan_text" >Scan for Direction to facility</p>

                        </span>


                    </div>
                    <div className="share_Popup_icon">
                        <span className="Share_icon" onClick={ToggleSharePopup}>
                            <FontAwesomeIcon icon={faShareAlt} className="share-icon_font" />
                        </span>
                        {showSharePopup && (
                            <div className="share-popup">
                                 <div className="cancel-button" onClick={() => setShowSharePopup(false)}>×</div>
                                <WhatsappShareButton url={shareUrl} title={title}>
                                    <FontAwesomeIcon icon={faWhatsapp} className="social-media-icon_what " />
                                </WhatsappShareButton>
                                <EmailShareButton url={shareUrl} title={title}>
                                    <FontAwesomeIcon icon={faEnvelope} className="social-media-icon_email" />
                                </EmailShareButton>
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
                            <h2><FontAwesomeIcon icon={faIndianRupee} /> {parseFloat(Bill_Data.amount).toFixed(2)} /-</h2>
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
                    <button type="Button" className="button-3791" onClick={(e) => setShowCancellationPolicy(prevState => !prevState)}>
                        Cancel</button>
                </div>
                {showCancellationPolicy &&
                    <div className="cancellationPolicyContainer">
                        <h2 className="policyHeading">Cancellation & Refund Policy</h2>
                        <li>
                            Due to limited available tickets, we request that you cancel at least 72 hours before a scheduled booking.
                            This gives us the opportunity to fill the remaning tickets.
                            If you have to cancel your tickets, we offer you a full refund to your account if you cancel before 72 hours.
                            If you cancel before the 48-72 hours, we offer you to refund 70% of ticket price. However, if you cancel less than 48 hours before scheduled
                            booking, you will lose the refund amount. The owner has the only right to be flexible here.
                        </li>
                        <li>
                            Cancellations made 7 days or more in advance of the event hosting date, will receive a 100% refund.
                            Cancellations made within 3 - 6 days will incur a 20% fee.
                            Cancellations made within 48 hours of the event will incur a 30% fee.
                        </li>
                        <li>
                            Refund amount will be processed within 3-5 business days depending upon merchat bank.
                        </li>
                        <span>
                            <input type="checkbox" checked={checkBoxValue} onChange={(e) => { setCheckBoxValue(prevState => !prevState) }} /> I agree to above mentioned policies.
                        </span>
                        <span className="flex gap-x-2">
                            <button className="proceed-button" onClick={handleConfirmation} disabled={checkBoxValue == true ? false : true}>Proceed</button>
                            <button className="close-button" onClick={(e) => setShowCancellationPolicy(false)}>Close</button>
                        </span>
                    </div>
                }
            </div>
            <ToastContainer /></>
    )
}
export default Bokking_Bill;