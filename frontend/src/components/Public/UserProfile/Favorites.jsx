import React from 'react'
import './Favorites.css'
import CommonFooter from '../../../common/CommonFooter';

import { useState, useEffect } from 'react';
import eventPhoto from '../../../assets/ama_bhoomi_bg.jpg';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faEllipsisVertical, faClock, faUser, faRightFromBracket, faBookmark } from '@fortawesome/free-solid-svg-icons';
import axiosHttpClient from "../../../utils/axios";
import { decryptData } from "../../../utils/encryptData";
import { logOutUser } from '../../../utils/utilityFunctions';
// redux --------------------------------------------------------------------------
import { useDispatch } from 'react-redux';
import { Logout } from "../../../utils/authSlice";
import PublicHeader from '../../../common/PublicHeader';
const Favorites = () => {
    const dispatch = useDispatch(); // Initialize dispatch
    const navigate = useNavigate();
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


    //get Api Here

    const [userName, setUserName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [phoneNo, setPhoneNo] = useState('');

    const publicUserId = decryptData(
        new URLSearchParams(location.search).get("publicUserId")
    );

    async function fetchProfileDetails() {
        try {
            let res = await axiosHttpClient('PROFILE_DATA_VIEW_API', 'post');
            console.log('response of fetch profile api', res.data.public_user);

            setUserName(decryptData(res.data.public_user.userName));
            setEmailId(decryptData(res.data.public_user.emailId));
            setPhoneNo(decryptData(res.data.public_user.phoneNo));
        }
        catch (error) {
            console.error("Error in fetching data:", error);
        }
    }

    useEffect(() => {
        fetchProfileDetails();
    }, []);
// Handle Logout ------------------------
//handle for Logout ------------------------------------
const handleLogout=()=>{
    dispatch(Logout());
    navigate('/')
  }

    return (
        <div>
            <PublicHeader />
            <div className="booking-dtails-container">
                <aside className="profile-leftside--Body">
                    <div className="profile-view--Body">
                        <div className="profile-about">
                            <p>{userName}</p>
                            <p>{emailId}</p>
                            <p>{phoneNo}</p>
                        </div>
                    </div>
                    <div>
                        <ul className="profile-button--Section">
                            <li>
                                <Link to="/Profile" className="">
                                    Edit User Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/BookingDetails" className="">
                                    Booking Details
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/UserProfile/Favorites"
                                    className="profile-button"
                                    style={{ color: 'white', backgroundColor: 'green' }}
                                >
                                    Favorites
                                </Link>
                            </li>
                        </ul>
                        {/* Logout Button */}
                        <button className="button-67 " onClick={handleLogout}>
                            <h1>Logout</h1>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        </button>

                    </div>
                </aside>
                <div className="right-container">
                    {/* New div with paragraph and blue border */}

                    {/* <div className="form-container"> */}


                    <div className='eventdetails-cardsection'>
                        {
                            eventDetails?.length > 0 && eventDetails.map((event) => {
                                return (
                                    <div className='eventdetails-carddetails'>
                                        <div className='eventdetails-photo'>
                                            <img src={eventPhoto} />
                                        </div>


                                        <div className='eventdetails-details'>
                                            {/* Bookmark icon */}
                                            <div className='bookmark-icon'><FontAwesomeIcon icon={faBookmark} /></div>

                                            <div className='eventdetails-details-eventname'>{event.eventName}</div>
                                            <div className='eventdetails-details-eventAddress'>{event.eventAddress}</div>
                                            <div className='flex justify-between eventdetails-details-eventTime'>
                                                <div>Booked at {event.bookedTiming}</div>
                                            </div>

                                            <div className='event-details'>
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
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>



            </div>
            <CommonFooter />
        </div>

    );
}


export default Favorites;
