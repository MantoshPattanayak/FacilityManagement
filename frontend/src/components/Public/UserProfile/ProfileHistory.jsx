import React, { useState } from 'react';
import './ProfileHistory.css';
import CommonHeader from '../../../common/CommonHeader';
import CommonFooter from '../../../common/CommonFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const ProfileHistory = () => {
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
    const [selectedOption, setSelectedOption] = useState('Daily');

    function manageCurrentTab(e, name) {
        e.preventDefault();
        const tabListCopy = tabList.map(tabItem => {
            if (tabItem.tabName === name) {
                return { ...tabItem, active: true };
            } else {
                return { ...tabItem, active: false };
            }
        });
        setTab(tabListCopy);
    }

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
                    <div className='eventdetails-tab'>
                        {tab.map((tabData) => (
                            <div key={tabData.tabName} className={tabData.active ? 'active' : ''} onClick={(e) => manageCurrentTab(e, tabData.tabName)}>
                                <button>{tabData.tabName}</button>
                            </div>
                        ))}
                    </div>

                    <div className="entry-details">
                        <div className='last-entry'>
                            <p>Last Entry: 22 February 2011, 10.00 AM</p>
                        </div>
                        <div className='average-time'>                          
                            <div className="dropdown">
                            <p>Average Time in Park: 1 hour, 20 minutes</p>
                                <select className='drop' value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                </select>
                            </div>
                        </div>
                        <div className='total-visit'>                          
                            <div className="dropdown">
                            <p>Total Visits : 5</p>
                                <select className='drop' value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                                    <option value="Daily">Weekly</option>
                                    <option value="Weekly">Daily</option>
                                </select>
                            </div>
                        </div>

                        <div className="today">
                            <div className="day">
                                <p>Today</p>
                            </div>
                            <div className="park-name">
                             <p>Budha Jayanti Park</p>
                             <p>Neeladri vihar , Chandrashekharpur, Bhubaneswar. </p>
                             <p>Activity : Running, Walking.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommonFooter />
        </div>
    )
}

export default ProfileHistory;
