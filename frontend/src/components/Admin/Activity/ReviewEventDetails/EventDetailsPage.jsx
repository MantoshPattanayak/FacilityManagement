import React, { useEffect, useState } from 'react';
import axiosHttpClient from '../../../../utils/axios';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import { regex, dataLength } from '../../../../utils/regexExpAndDataLength';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData } from "../../../../utils/encryptData";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import './EventDetailsPage.css';
import instance from '../../../../../env';
export default function EventDetailsPage() {
    // Decrypt the eventId Data ---------------
    const location = useLocation();
    const eventId = decryptData(
        new URLSearchParams(location.search).get("eventId")
    );
    let navigate = useNavigate();
    //GetView Event Data useSate -------------------
    const [GetViewEventData, setGetViewEventData] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [action, setAction] = useState('');
    // error msg -----------------------------------
    const [subjectError, setSubjectError] = useState('');
    const [messageBodyError, setMessageBodyError] = useState('');

    // viewEventAdditionalImages by id --------------
    const [viewEventAdditionalImages, setViewEventAdditionalImages] = useState([])
    const [subjectMessage, setsubjectMessage] = useState({
        subject: '',
        messageBody: ''
    });
    // here  get the details of Event according to id
    async function GetEventDataById() {
        try {
            let res = await axiosHttpClient('REVIEW_EVENTS_VIEW_BY_ID_API', 'get', null, eventId)
            console.log("here Success Response of Get Event Data By Id", res)
            setGetViewEventData(res.data.viewEventData[0])
            setViewEventAdditionalImages(res.data.viewEventAdditionalImages)
        }
        catch (err) {
            console.log("here Error Response of Get Event Data By ID", err)
        }
    }
    // here Approve and Reject Api -----------------------
    const Approved_RejectEvent = async (e) => {
        e.preventDefault();
        const errors = validation(subjectMessage);
        if (Object.keys(errors).length > 0) {
            // If there are errors, return early
            return;
        }
        try {
            let res = await axiosHttpClient("REVIEW_EVENTS_PERFORM_APPROVE_REJECT_API", 'put',
                {
                    action: action,
                    subject: subjectMessage.subject,
                    messageBody: subjectMessage.messageBody
                }, eventId)
            console.log("here Response of Approve Reject Api", res)
            if (action === 'APPROVE') {
                toast.success("Event Host Request is approved sucessfully!")
            } else if (action === 'REJECT') {
                toast.success("Event Host Request is rejected!")
            }
            navigate("/Activity/ReviewEventDetailsList");
        }
        catch (err) {
            console.log("here Error of Approved and Reject Api", err)
            toast.error("Event action faild. Try agin.!")
        }
    }
    // here Open Image on new tabe------------------------
    const openImageInNewTab = (imageUrl) => {
        window.open(instance().baseURL + "/static" + imageUrl, '_blank');
    };
    /// here in Open Module set the action  and set------
    const openModal = (actionType) => {
        setAction(actionType);
        console.log("here action type", actionType)
        setModalIsOpen(true);
    };
    // here in Modal set the subject and message body -------
    const closeModal = () => {
        setModalIsOpen(false);
        setsubjectMessage({ subject: '', messageBody: '' });
    };
    // Formate of Date  and Time -------------------
    function formatDateTime(dateTime) {
        if (!dateTime) return;
        // Create a Date object from the ISO 8601 string
        const dateObj = new Date(dateTime);
        // Format date (YYYY-MM-DD)
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        // Format time (24-hour to 12-hour format with AM/PM)
        let hours = dateObj.getHours();
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        const formattedTime = `${hours}:${minutes} ${period}`;

        // Combine formatted date and time
        return `${formattedDate} : ${formattedTime}`;
    }
    // here Validation of sub and message during  take action ------------
    const validation = (value) => {
        const errors = {};
        const space_block = /^[^\s][^\n\r]*$/;
        if (!value.subject) {
            errors.subject = "Subject is required";
        } else if (!space_block.test(value.subject)) {
            errors.subject = "Do not use spaces at the beginning";
        }
        if (!value.messageBody) {
            errors.messageBody = "Message is required";
        } else if (!space_block.test(value.messageBody)) {
            errors.messageBody = "Do not use spaces at the beginning";
        }
        setSubjectError(errors.subject || '');
        setMessageBodyError(errors.messageBody || '');

        return errors;
    };
    // useEffect for Call the api/Update Data ---
    useEffect(() => {
        GetEventDataById()
    }, [])
    return (
        <div className='w-[100%]'>
            <AdminHeader />
            <div className="form-container">
                <div className="form-heading">
                    <h2>Event Details</h2>
                    <div className='grid grid-rows-2 grid-cols-2 gap-x-8 gap-y-6 w-[100%]'>
                        <div className="form-group">
                            <label htmlFor="input1">Event Title</label>
                            <input name='eventname' type="text" placeholder="Event Title"
                                value={GetViewEventData.eventTitle}
                                maxLength={dataLength.NAME} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Event Category</label>
                            <input name='eventcategory' type="text" placeholder="Event Category"
                                value={GetViewEventData.eventCategoryName}
                                maxLength={dataLength.NAME} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Location of Event</label>
                            <input name='location' type="text" placeholder="Location of Event"
                                value={GetViewEventData.locationName}
                                maxLength={dataLength.PHONE_NUMBER} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Event Date</label>
                            <input name='eventdate' type="text" placeholder="Event Date"
                                value={GetViewEventData.eventDate || ''}
                                maxLength={dataLength.EMAIL} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Event Start Time</label>
                            <input name='eventstarttime' type="text"
                                placeholder="Event Start Time"
                                value={formatDateTime(GetViewEventData.eventStartTime)}
                                maxLength={dataLength.EMAIL} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Event End Time</label>
                            <input name='eventendtime' type="text"
                                placeholder="Event End Time"
                                value={formatDateTime(GetViewEventData.eventEndTime)}
                                maxLength={dataLength.EMAIL} disabled />
                        </div>
                        <div className="form-group col-start-1 col-span-2">
                            <label htmlFor="input1">Event Description</label>
                            <textarea name='eventdescription'
                                type="text" placeholder="Event Description"
                                value={GetViewEventData.descriptionOfEvent}
                                rows={2} maxLength={dataLength.EMAIL} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Number of tickets</label>
                            <input name='numberOfTickets' type="text"
                                placeholder="Number of tickets"
                                value={GetViewEventData.numberOfTickets || '0'}
                                maxLength={dataLength.EMAIL} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Price</label>
                            <input name='ticketPrice' type="text"
                                placeholder="Price"
                                value={GetViewEventData.ticketPrice || '0'}
                                maxLength={dataLength.EMAIL} disabled />
                        </div>
                        <div className="form-group col-span-2">
                            <label htmlFor="input1">Uploaded Documents</label>
                            <div className='div-border'>
                                <div className="flex justify-between">
                                    <div><FontAwesomeIcon icon={faImage} /> {GetViewEventData.eventMainImage}
                                        <button className='text-blue-600 ml-10' onClick={() => openImageInNewTab(GetViewEventData.eventMainImage)}>View</button>
                                    </div>

                                </div>
                                {viewEventAdditionalImages.length > 0 && viewEventAdditionalImages.map((item, index) => (
                                    <div className="flex justify-between" key={index}>
                                        <div><FontAwesomeIcon icon={faImage} /> {item.file}
                                            <button className='text-blue-600 ml-10' onClick={() => openImageInNewTab(item.file)}>View</button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-heading">
                    <h2>Host Details</h2>
                    <div className='grid grid-rows-2 grid-cols-2 gap-x-3 gap-y-1 w-[100%]'>
                        <div className="form-group">
                            <label htmlFor="input1">Organisation/Individual Name</label>
                            <input name='name' type="text"
                                placeholder="Organisation/Individual Name"
                                value={GetViewEventData.organisationName}
                                maxLength={dataLength.STRING_VARCHAR_SHORT} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Organisation/Individual PAN Card</label>
                            <input name='pan' type="text"
                                placeholder="Organisation/Individual PAN Card"
                                value={GetViewEventData.pancardNumber}
                                maxLength={dataLength.STRING_VARCHAR_SHORT} disabled />
                        </div>
                        <div className="form-group col-span-2">
                            <label htmlFor="input1">Organisation/Individual Address</label>
                            <textarea name='address' type="text"
                                placeholder="Organisation/Individual Address"
                                value={GetViewEventData.organisationAddress}
                                rows={2} maxLength={dataLength.STRING_VARCHAR_LONG} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">First Name</label>
                            <input name='name' type="text"
                                placeholder="First Name"
                                value={GetViewEventData.firstName}
                                maxLength={dataLength.NAME} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Last Name</label>
                            <input name='pan' type="text"
                                placeholder="Last Name"
                                value={GetViewEventData.lastName}
                                maxLength={dataLength.NAME} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Phone Number</label>
                            <input name='phone' type="text"
                                placeholder="Phone Number"
                                value={GetViewEventData.phoneNo}
                                maxLength={dataLength.PHONE_NUMBER} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Email Address</label>
                            <input name='email' type="text"
                                value={GetViewEventData.emailId}
                                placeholder="Phone Number" maxLength={dataLength.EMAIL} disabled />
                        </div>
                    </div>
                </div>

                {/* Two more similar headings */}
                <div className="buttons-container">
                    <button className="approve-button" onClick={() => openModal('APPROVE')}>Approve</button>
                    <button className="cancel-button" onClick={() => openModal('REJECT')}>REJECT</button>
                </div>
                {modalIsOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2 className='action_approve_reject'>{action === 'APPROVE' ? 'Approve Event' : 'Reject Event'}</h2>
                            <form onSubmit={(e) => Approved_RejectEvent(e)}>
                                <div className="form-group">
                                    <label>Subject:</label>
                                    <input
                                        type="text"
                                        name='subject'
                                        value={subjectMessage.subject}
                                        onChange={(e) => setsubjectMessage({ ...subjectMessage, subject: e.target.value })}
                                    />
                                    {subjectError && <span className="error-message">{subjectError}</span>}
                                </div>
                                <div className=''>
                                    <label>Message:</label>
                                    <textarea
                                        value={subjectMessage.messageBody}
                                        onChange={(e) => setsubjectMessage({ ...subjectMessage, messageBody: e.target.value })}
                                    ></textarea>
                                    {messageBodyError && <span className="error-message">{messageBodyError}</span>}
                                </div>
                                <div className="buttons-container21">
                                    <button className="approve-button" type="submit">Submit</button>
                                    <button type="button" className="cancel-button"
                                        onClick={closeModal}>Close
                                    </button> 
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}