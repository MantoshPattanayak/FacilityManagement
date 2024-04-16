import React from 'react';
import { useLocation } from 'react-router-dom';
import axiosHttpClient from '../../../../utils/axios';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import { regex, dataLength } from '../../../../utils/regexExpAndDataLength';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

export default function EventDetailsPage(props) {
    const location = useLocation();
    const eventId = new URLSearchParams(location.search).get('eventId');
    console.log('eventId', eventId);

    async function fetchEventDetails(id) {
        try {
            let response = await axiosHttpClient('/api/fetch')
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className='w-[100%]'>
            <AdminHeader />
            <div className="form-container">
                <div className="form-heading">
                    <h2>Event Details</h2>
                    <div className='grid grid-rows-2 grid-cols-2 gap-x-8 gap-y-6 w-[100%]'>
                        <div className="form-group">
                            <label htmlFor="input1">Event Title</label>
                            <input name='eventname' type="text" placeholder="Event Title" maxLength={dataLength.NAME} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Event Category</label>
                            <input name='eventcategory' type="text" placeholder="Event Category" maxLength={dataLength.NAME} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Location of Event</label>
                            <input name='location' type="text"  placeholder="Location of Event" maxLength={dataLength.PHONE_NUMBER} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Event Date</label>
                            <input name='eventdate' type="text"  placeholder="Event Date" maxLength={dataLength.EMAIL} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Event Start Time</label>
                            <input name='eventstarttime' type="text"  placeholder="Event Start Time" maxLength={dataLength.EMAIL} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Event End Time</label>
                            <input name='eventendtime' type="text"  placeholder="Event End Time" maxLength={dataLength.EMAIL} disabled/>
                        </div>
                        <div className="form-group col-start-1 col-span-2">
                            <label htmlFor="input1">Event Description</label>
                            <textarea name='eventdescription' type="text"  placeholder="Event Description" rows={2} maxLength={dataLength.EMAIL} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Number of tickets</label>
                            <input name='numberOfTickets' type="text"  placeholder="Number of tickets" maxLength={dataLength.EMAIL} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Price</label>
                            <input name='ticketPrice' type="text"  placeholder="Price" maxLength={dataLength.EMAIL} disabled/>
                        </div>
                        <div className="form-group col-span-2">
                            <label htmlFor="input1">Uploaded Documents</label>
                            <div className='div-border'>
                                <div className="flex justify-between">
                                    <div><FontAwesomeIcon icon={faImage} /> event_image1.png</div>
                                    <div><button className='text-blue-600'>View</button></div>
                                </div>
                                <div className="flex justify-between">
                                    <div><FontAwesomeIcon icon={faImage} /> event_image2.png</div>
                                    <div><button className='text-blue-600'>View</button></div>
                                </div>
                                <div className="flex justify-between">
                                    <div><FontAwesomeIcon icon={faImage} /> event_image3.png</div>
                                    <div><button className='text-blue-600'>View</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-heading">
                    <h2>Host Details</h2>
                    <div className='grid grid-rows-2 grid-cols-2 gap-x-3 gap-y-1 w-[100%]'>
                        <div className="form-group">
                            <label htmlFor="input1">Organisation/Individual Name</label>
                            <input name='name' type="text" placeholder="Organisation/Individual Name" maxLength={dataLength.STRING_VARCHAR_SHORT} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Organisation/Individual PAN Card</label>
                            <input name='pan' type="text" placeholder="Organisation/Individual PAN Card" maxLength={dataLength.STRING_VARCHAR_SHORT} disabled/>
                        </div>
                        <div className="form-group col-span-2">
                            <label htmlFor="input1">Organisation/Individual Address</label>
                            <textarea name='address' type="text"  placeholder="Organisation/Individual Address" rows={2} maxLength={dataLength.STRING_VARCHAR_LONG} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">First Name</label>
                            <input name='name' type="text" placeholder="First Name" maxLength={dataLength.NAME} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Last Name</label>
                            <input name='pan' type="text" placeholder="Last Name" maxLength={dataLength.NAME} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Phone Number</label>
                            <input name='phone' type="text"  placeholder="Phone Number" maxLength={dataLength.PHONE_NUMBER} disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Email Address</label>
                            <input name='email' type="text"  placeholder="Phone Number" maxLength={dataLength.EMAIL} disabled/>
                        </div>
                    </div>
                </div>

                {/* Two more similar headings */}
                <div className="buttons-container">
                    <button className="approve-button">Approve</button>
                    <button className="cancel-button">Cancel</button>
                </div>
            </div>
            <Footer />
        </div>

    )
}
