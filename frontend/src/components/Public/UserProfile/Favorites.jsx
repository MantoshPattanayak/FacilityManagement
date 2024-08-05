import React from 'react'
import './Favorites.css'
import CommonFooter from '../../../common/CommonFooter';

import { useState, useEffect } from 'react';
import eventPhoto from '../../../assets/ama_bhoomi_bg.jpg';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faEllipsisVertical, faClock, faUser, faRightFromBracket, faEnvelope, faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import axiosHttpClient from "../../../utils/axios";
import { decryptData, encryptData } from "../../../utils/encryptData";
import { formatDate, logOutUser, truncateName } from '../../../utils/utilityFunctions';
// redux --------------------------------------------------------------------------
import { useDispatch } from 'react-redux';
import { Logout } from "../../../utils/authSlice";
import PublicHeader from '../../../common/PublicHeader';
import No_Data_icon from "../../../assets/No_Data_icon.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from '../../../../env';
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
    const [bookmarkDetails, setBookmarkDetails] = useState([]);
    const [refresh, setRefresh] = useState(false);
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

    /*
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
    }, [selectedDate]);*/

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value); // Update selected date on change
    };


    //get Api Here

    const [userName, setUserName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [phoneNo, setPhoneNo] = useState('');

    async function fetchProfileDetails() {
        try {
            let res = await axiosHttpClient('PROFILE_DATA_VIEW_API', 'post');
            console.log('response of fetch profile api', res.data.public_user);

            setUserName(decryptData(res.data.public_user.firstName) + ' ' + decryptData(res.data.public_user.lastName));
            setEmailId(decryptData(res.data.public_user.emailId));
            setPhoneNo(decryptData(res.data.public_user.phoneNo));
        }
        catch (error) {
            console.error("Error in fetching data:", error);
            if (error.respone.status == 401) {
                toast.error('You are logged out. Kindly login first.', {
                    autoClose: 3000, // Toast timer duration in milliseconds
                    onClose: () => {
                        // Navigate to another page after toast timer completes
                        setTimeout(() => {
                            navigate("/");
                        }, 1000); // Wait 1 second after toast timer completes before navigating
                    },
                })
            }
        }
    }

    async function fetchBookmarkList() {
        try {
            let res = await axiosHttpClient('VIEW_BOOKMARKS_LIST_API', 'post');
            console.log('response bookmark list', res.data.data.sort((a, b) => {return a.id - b.id}));
            setBookmarkDetails(res.data.data);
        }
        catch (error) {
            console.error(error);
            if (error.response.status == 404) {
                toast.error('No bookmark data');
            }
        }
    }

    // toast warning to get user confirmation before perform crucial action
    const handleConfirmAction = (e, bookmarkId) => {
        e.preventDefault();
        console.log('bookmark id in warning box', bookmarkId);
        toast.warn(
            <div>
                <p>Are you sure you want to proceed?</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => removeBookmark(bookmarkId)} className='bg-green-400 text-white p-2 border rounded-md'>Yes</button>
                    <button onClick={() => handleCancel()} className='bg-red-400 text-white p-2 border rounded-md'>No</button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false, // Disable auto close
                closeOnClick: false, // Disable close on click
            }
        );
        return;
    };

    // toast message that action is cancelled
    const handleCancel = () => {
        toast.dismiss();
        toast.error('Action cancelled!', {
            // position: toast.POSITION.TOP_CENTER,
            // autoClose: 3000,
        });
    };
    async function removeBookmark(bookmarkId) {
        try {
            let res = await axiosHttpClient('REMOVE_BOOKMARK_API', 'post', {
                bookmarkId: bookmarkId
            });
            console.log('remove bookmark api response', res.data);
            toast.dismiss();
            toast.success('User bookmark removed.', {
                autoClose: 3000, // Toast timer duration in milliseconds
                onClose: () => {
                    // Navigate to another page after toast timer completes
                    setTimeout(() => {
                        navigate("/UserProfile/Favorites");
                    }, 1000); // Wait 1 second after toast timer completes before navigating
                },
            });
            setRefresh(true);
        }
        catch (error) {
            console.error(error);
            toast.error('Bookmark removal failed.');
        }
    }

    useEffect(() => {
        fetchProfileDetails();
        fetchBookmarkList();
    }, []);

    //refresh componenet on 
    useEffect(() => {
        if (refresh) {
            fetchBookmarkList();
        }
    }, [refresh])

    //handle for Logout ------------------------------------
    const handleLogout = (e) => {
        // logOutUser(e);
        e.preventDefault();
        dispatch(Logout());
        async function logOutAPI() {
            try {
                let res = await axiosHttpClient('LOGOUT_API', 'post');
                console.log(res.data);
                toast.success('Logged out successfully!!', {
                    autoClose: 3000, // Toast timer duration in milliseconds
                    onClose: () => {
                        // Navigate to another page after toast timer completes
                        setTimeout(() => {
                            navigate("/");
                        }, 1000); // Wait 1 second after toast timer completes before navigating
                    },
                });
            }
            catch (error) {
                console.error(error);
            }
        }
        logOutAPI();
    }

    return (
        <div>
            <PublicHeader />
            <div className="Fev-Sec-container">
                <aside className="profile-leftside--Body">
                    <div className="profile-view--Body">
                        <div className="profile-about">
                            <div className="profile-about-icon" >
                                <FontAwesomeIcon icon={faUser} />
                                <p>{userName}</p>
                            </div>

                            <div className="profile-about-icon" >
                                <FontAwesomeIcon icon={faEnvelope} />
                                <p>{emailId}</p>
                            </div>

                            <div className="profile-about-icon" >
                                <FontAwesomeIcon icon={faMobileScreenButton} />
                                <p>{phoneNo}</p>
                            </div>
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
                <div className="right-container-favorite">
                    {/* New div with paragraph and blue border */}

                    {/* <div className="form-container"> */}

                    {
                        bookmarkDetails?.length > 0 ? (
                            <div className='eventdetails-cardsection'>
                                {
                                    bookmarkDetails?.length > 0 && bookmarkDetails.map((bookmark) => {
                                        return (
                                            <div className='eventdetails-carddetails'>
                                                <div className='eventdetails-photo'>
                                                    <img src={bookmark.url ? instance().baseURL + '/static/' + bookmark.url : eventPhoto} className='border rounded-md' alt='photo' />
                                                </div>


                                                <div className='eventdetails-details'>
                                                    {/* Bookmark icon */}
                                                    <div className='bookmark-icon' onClick={(e) => handleConfirmAction(e, bookmark.bookmarkId)}><FontAwesomeIcon icon={faBookmarkSolid} /></div>

                                                    <div className='eventdetails-details-eventname' title={bookmark.name}>{truncateName(bookmark.name, 25)}</div>
                                                    <div className='eventdetails-details-eventAddress' title={bookmark.address}>{truncateName(bookmark.address, 25)}</div>
                                                    {/* <div className='flex justify-between eventdetails-details-eventTime'>
                                                        <div>Bookmarked on {formatDate(bookmark.bookmarkDate)}</div>
                                                    </div> */}

                                                    <div className='event-details'>
                                                        {
                                                            bookmark.facilityType == 'Event' ? (
                                                                <Link
                                                                    className='eventdetails-eventbutton'
                                                                    to={{
                                                                        pathname: '/events-details',
                                                                        search: '?eventId=' + encryptData(bookmark.id)
                                                                    }}
                                                                >
                                                                    Details
                                                                </Link>
                                                            ) :
                                                                (
                                                                    <Link
                                                                        className='eventdetails-eventbutton'
                                                                        to={{
                                                                            pathname: '/Sub_Park_Details',
                                                                            search: '?facilityId=' + encryptData(bookmark.id)
                                                                        }}
                                                                    >
                                                                        Details
                                                                    </Link>
                                                                )
                                                        }

                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                            : (
                                <div className="flex justify-center w-full">
                                    <img src={No_Data_icon} alt="No Data Found" />
                                </div>
                            )
                    }
                    <ToastContainer />
                </div>
            </div>
        </div>

    );
}


export default Favorites;
