import React from 'react'
import '../UserProfile/BookingDetails.css'
import { useState, useEffect } from 'react';
import eventPhoto from '../../../assets/ama_bhoomi_bg.jpg';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEllipsisVertical, faClock, faUser , faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import CommonHeader from '../../../common/CommonHeader';
import CommonFooter from '../../../common/CommonFooter';
import axiosHttpClient from '../../../utils/axios';

const BookingDetails = () => {
    const[GetHistoryData, setHistoryData]=useState([]);  // For storing the

// here Get the data of All Bookings Details-------------------------------------------

async function getBookingsDetails(){
    try{
        let res= await axiosHttpClient('VIEW_BOOKINGS_API', 'post', {
            facilityType:'PARKS'
        }, null)
        console.log("here response of all bookings details", res)
    }
    catch(err){
        console.log(err)
    }
}

// here UseEffect of Update the data--------------------
useEffect(()=>{
    getBookingsDetails()
}, [])





    const tabList = [
        {
            tabName: 'All Bookings',
            active: true,
        },
        {
            tabName: 'Cancelled',
            active: false,
        },
        {
            tabName: 'History',
            active: false,
        }
    ];
    const [tab, setTab] = useState(tabList);
    const eventDetailsData = [
        {
            eventName: 'International ',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '09:35 AM',
            createdDate: '2024-04-12T09:35:23.410',
        },
        {
            eventName: ' Festival',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '09:45 AM',
            createdDate: '2024-04-15T09:45:23.410',
        },
        {
            eventName: 'International Odissi Dance Festival',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '09:55 AM',
            createdDate: '2024-04-15T09:55:23.410',
        },
        {
            eventName: 'International Odissi Dance Festival',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '10:05 AM',
            createdDate: '2024-04-15T10:05:23.410',
        },
        {
            eventName: 'International Odissi Dance Festival',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '11:15 AM',
            createdDate: '2024-04-14T11:15:23.410',
        },
        {
            eventName: 'International Odissi Dance Festival',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '11:25 AM',
            createdDate: '2024-04-14T11:25:23.410',
        },
        {
            eventName: 'International Odissi Dance Festival',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '11:35 AM',
            createdDate: '2024-04-14T11:35:23.410',
        },
        {
            eventName: 'International Odissi Dance Festival',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '11:45 AM',
            createdDate: '2024-04-14T11:45:23.410',
        },
        {
            eventName: 'International Odissi Dance Festival',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '11:55 AM',
            createdDate: '2024-04-14T11:55:23.410',
        },
        {
            eventName: 'International Odissi Dance Festival',
            eventAddress: 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming: '12:05 PM',
            createdDate: '2024-04-14T12:05:23.410',
        },
    ]
    const [eventDetails, setEventDetails] = useState(eventDetailsData);
    useEffect(() => {
    }, [tab]);
    function calculateTime(dataTime) {
        let currentDateTime = new Date();
        let inputDateTime = new Date(dataTime);
        let differenceDateTime = Math.floor((currentDateTime - inputDateTime) / (1000 * 60 * 60));
        if (differenceDateTime < 1) {
            differenceDateTime = Math.floor(((currentDateTime - inputDateTime) % (1000 * 60 * 60)) / (1000 * 60));
        }
        // console.log('difference datetime', {currentDateTime, inputDateTime, differenceDateTime});
        let timeParams = (differenceDateTime < 1) ? ' min' : ' hour(s)';
        return differenceDateTime + timeParams;
    }
    function manageCurrentTab(e, name) {
        // e.preventDefault();
        let tabListCopy = JSON.parse(JSON.stringify(tab));
        tabListCopy.forEach((tab) => {
            if (tab.tabName == name)
                tab.active = true;
            else tab.active = false;
        });
        // console.log('tabListCopy', tabListCopy);
        setTab(tabListCopy);
        return;
    }
    const [selectedDate, setSelectedDate] = useState(''); // State to store selected date

    useEffect(() => {
        // Filter eventDetails based on selectedDate on change
        if (selectedDate) {
            const filteredEvents = eventDetailsData.filter((event) => {
                const eventDate = new Date(event.createdDate);
                const selectedDateObj = new Date(selectedDate);
                return eventDate.getFullYear() === selectedDateObj.getFullYear() &&
                    eventDate.getMonth() === selectedDateObj.getMonth() &&
                    eventDate.getDate() === selectedDateObj.getDate();
            });
            setEventDetails(filteredEvents);
        } else {
            setEventDetails(eventDetailsData); // Reset to all events if no date selected
        }
    }, [selectedDate]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value); // Update selected date on change
    };
    return (
        <div>
            <CommonHeader />
            <div className="booking-dtails-container">
                <div className="user-profile-section">
                    <div className="user-details">
                        <FontAwesomeIcon icon={faUser} className='icon-user' />
                        <p>Sunidhi Chauhan</p>
                        <p>7008765443</p>
                        <p>sushi@gmail.com</p>
                    </div>
                    <div className="buttons-profile">
                        <button className="edit-profile-btn">Edit User Profile</button>
                        <button className="edit-profile-btn">Booking Details</button>
                        <button className="edit-profile-btn">Favorites</button>
                        <button className="edit-profile-btn">Card Details</button>
                    </div>
                    <button className="logout-button"><FontAwesomeIcon icon={faRightFromBracket} />Logout</button>
                </div>
                <div className="right-container">
                    {/* New div with paragraph and blue border */}
                  
                    {/* <div className="form-container"> */}

                <div className='eventdetails-tab'>
                    {
                        tab?.length > 0 && tab.map((tabData) => {
                            if (tabData.active) {
                                return (
                                    <div className='active' onClick={(e) => manageCurrentTab(e, tabData.tabName)}>
                                        <button onClick={(e) => manageCurrentTab(e, tabData.tabName)}>{tabData.tabName}</button>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div onClick={(e) => manageCurrentTab(e, tabData.tabName)}>
                                        <button onClick={(e) => manageCurrentTab(e, tabData.tabName)}>{tabData.tabName}</button>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                <div className='eventdetails-cardsection'>
                    {
                        eventDetails?.length > 0 && eventDetails.map((event) => {
                            return (
                                <div className='eventdetails-carddetails'>
                                    <div className='eventdetails-photo'>
                                        <img src={eventPhoto} />
                                    </div>
                                    <div className='eventdetails-details'>
                                        <div className='eventdetails-details-eventname'>{event.eventName}</div>
                                        <div className='eventdetails-details-eventAddress'>{event.eventAddress}</div>
                                        <div className='flex justify-between eventdetails-details-eventTime'>
                                            <div>Booked at {event.bookedTiming}</div>
                                            <div><FontAwesomeIcon icon={faClock} /> {calculateTime(event.createdDate)} ago</div>
                                        </div>
                                        {/* <div><button className='eventdetails-eventbutton' onClick={navigateToDetailsPage(event.eventName)}>Event details</button></div> */}
                                        <Link
                                            className='eventdetails-eventbutton'
                                            to={{
                                                pathname: '/Activity/EventDetailsPage',
                                                search: '?eventId=456'
                                            }}
                                        >
                                            Event Details
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>



                </div>
                <CommonFooter/>
            </div>
        // </div>
    )
    
    }

export default BookingDetails
