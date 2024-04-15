import React from 'react';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import './ReviewEventDetailsList.css';
import eventPhoto from '../../../../assets/ama_bhoomi_bg.jpg';

export default function ReviewEventDetailsList() {

    const tabList = [
        {
            tabName : 'Hosting Requests',
            active : true,
        },
        {
            tabName : 'Approved',
            active : false,
        },
        {
            tabName : 'Rejected',
            active : false,
        }
    ];

    const [tab, setTab] = useState(tabList);

    const eventDetailsData = [
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '09:35 AM',
            createdDate : '2024-04-15T09:35:23.410',
        },
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '09:45 AM',
            createdDate : '2024-04-15T09:45:23.410',
        },
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '09:55 AM',
            createdDate : '2024-04-15T09:55:23.410',
        },
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '10:05 AM',
            createdDate : '2024-04-15T10:05:23.410',
        },
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '11:15 AM',
            createdDate : '2024-04-14T11:15:23.410',
        },
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '11:25 AM',
            createdDate : '2024-04-14T11:25:23.410',
        },
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '11:35 AM',
            createdDate : '2024-04-14T11:35:23.410',
        },
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '11:45 AM',
            createdDate : '2024-04-14T11:45:23.410',
        },
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '11:55 AM',
            createdDate : '2024-04-14T11:55:23.410',
        },
        {
            eventName : 'International Odissi Dance Festival',
            eventAddress : 'Janata Maidan, Chandrasekharpur, Bhubaneswar',
            bookedTiming : '12:05 PM',
            createdDate : '2024-04-14T12:05:23.410',
        },
    ]

    const [eventDetails, setEventDetails] = useState(eventDetailsData);

    useEffect(() => {

    }, [tab]);

    function calculateTime (dataTime) {
        let currentDateTime = new Date();
        let inputDateTime = new Date(dataTime);

        let differenceDateTime = Math.floor((currentDateTime - inputDateTime)/(1000 * 60 * 60));

        if(differenceDateTime < 1) {
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
            if(tab.tabName == name)
                tab.active = true;
            else tab.active = false;
        });

        // console.log('tabListCopy', tabListCopy);

        setTab(tabListCopy);
        return;
    }

    return (
        <>
            <AdminHeader />
            <div className="form-container">
                <div className='form-heading'>
                    <h2>Manage event details</h2>
                </div>

                <div className="search_text_conatiner justify-end">
                    {/* <button className='search_field_button' onClick={() => navigate('/UAC/Users/Create')}>Create new user</button> */}
                    <input type="text" className="search_input_field" placeholder="Search..." />
                </div>

                <div className='eventdetails-tab'>
                    {
                        tab?.length > 0 && tab.map((tabData) => {
                            if(tabData.active){
                                return(
                                    <div className='active' onClick={(e) => manageCurrentTab(e, tabData.tabName)}>
                                        <button onClick={(e) => manageCurrentTab(e, tabData.tabName)}>{tabData.tabName}</button>
                                    </div>
                                )
                            }
                            else{
                                return(
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
                                        <div>{event.eventName}</div>
                                        <div>{event.eventAddress}</div>
                                        <div>
                                            <div>Booked at {event.bookedTiming}</div>
                                            <div>{calculateTime(event.createdDate)} ago</div>
                                        </div>
                                        <div><button className='eventdetails-eventbutton'>Event details</button></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}
