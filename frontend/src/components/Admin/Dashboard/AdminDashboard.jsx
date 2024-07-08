import React, { useEffect, useState } from 'react';
import '../Dashboard/AdminDashboard.css';
import AdminHeader from '../../../common/AdminHeader';
import Footer from '../../../common/Footer';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLong, faCaretDown, faCaretUp, faAngleRight, faTrophy } from "@fortawesome/free-solid-svg-icons";
import img from '../../../assets/wave.jpg';
import axiosHttpClient from '../../../utils/axios';
Chart.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [graphData, setGraphData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
        datasets: [
            {
                label: '369',
                data: [3, 4, 9, 2, 5],
                backgroundColor: 'rgb(143, 158, 215)',
                borderColor: 'black',
                borderWidth: 1,
            }
        ]
    });
    const [facilityId, setFacilityId] = useState('');
    const [facilityListData, setFacilityListData] = useState([]);
    const options = {
        // Add your chart options here
    };
    const [adminDashboardData, setAdminDashboardData] = useState({
        activeUserCount: '',
        parksCount: '',
        playgroundsCount: '',
        popularFacilities: '',
        popularActivities: '',
        activeEventsCount: '',
        bookingEventData: '',
        specificFacilityBookingData: '',
    });

    // API call to fetch dashboard data
    async function fetchAdminDashboardData() {
        try {
            let response = await axiosHttpClient('ADMIN_DASHBOARD_FETCH_API', 'post', { facilityId });
            console.log('response fetchAdminDashboardData', response.data);
            setAdminDashboardData({
                activeUserCount: response.data.activeUserCount,
                parksCount: response.data.facilitiesCount?.filter((data) => { return data.facilityType == "PARKS" })[0].facilitycount || 0,
                playgroundsCount: response.data.facilitiesCount?.filter((data) => { return data.facilityType == "PLAYGROUNDS" })[0]?.facilitycount || 0,
                popularFacilities: response.data.popularFacilities,
                popularActivities: response.data.popularActivities,
                activeEventsCount: response.data.activeEventsCount,
                bookingEventData: response.data.bookingEventData,
                specificFacilityBookingData: response.data.specificFacilityBookingData,
            });
            /**{
                labels: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
                datasets: [
                    {
                        label: '369',
                        data: [3, 4, 9, 2, 5],
                        backgroundColor: 'rgb(143, 158, 215)',
                        borderColor: 'black',
                        borderWidth: 1,
                    }
                ]
            } */
           setGraphData({
                labels: [...response.data.specificFacilityBookingData.map((data) => {return data.bookingMonthName})],
                    datasets: [
                        {
                            label: 'Facility bookings',
                            data: [...response.data.specificFacilityBookingData.map((data) => {return data.bookingCount})],
                            backgroundColor: 'rgb(143, 158, 215)',
                            borderColor: 'grey',
                            borderWidth: 1,
                        }
                ]
           })
        }
        catch (error) {
            console.error('Error fetching dashboard data', error);
        }
    }

    // API call to fetch list of facilities
    async function fetchListOfFacilities() {
        try {
            let response = await axiosHttpClient('View_Park_Data', 'post');
            console.log('list of facilities', response.data.data);
            setFacilityListData(response.data.data);
        }
        catch (error) {
            console.error(error);
        }
    }

    // Function to calculate sum of total bookings of events
    const calculateTotalEventBookings = () => {
        let sum = 0;
        for (let i = 0; i < adminDashboardData?.bookingEventData.length; i++) {
            sum = parseInt(sum + adminDashboardData?.bookingEventData[i]?.bookingcount);
        }
        // console.log('calculateTotalEventBookings sum', sum);
        return sum;
    };

    // Function to calculate sum of total bookings of events
    const calculateTotalFacilityBookings = () => {
        let sum = 0;
        for (let i = 0; i < adminDashboardData?.specificFacilityBookingData.length; i++) {
            sum = parseInt(sum + adminDashboardData?.specificFacilityBookingData[i]?.bookingCount);
        }
        // console.log('calculateTotalEventBookings sum', sum);
        return sum;
    };

    // on page load, fetch
    useEffect(() => {
        fetchAdminDashboardData();
        fetchListOfFacilities();
    }, []);

    // on selecting facility name, refresh
    useEffect(() => {
        fetchAdminDashboardData();
    }, [facilityId]);

    return (
        <div>
            <AdminHeader />
            <div className='container-dashboard'>
                <div className="heading-dashboard">
                    <h2><b>Dashboard</b></h2>
                    <h2><FontAwesomeIcon className='download-icon' icon={faDownLong} />Download</h2>
                </div>
                <br />
                <hr />
                <div className="graph_and_data">
                    <div className="data">
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Active Users</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>{adminDashboardData.activeUserCount}</h1>
                            </div>
                        </div>
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Total Parks</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>{adminDashboardData.parksCount}</h1>
                            </div>
                        </div>
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Total Playground</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>{adminDashboardData.playgroundsCount}</h1>
                            </div>
                        </div>
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Active Events</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>{adminDashboardData.activeEventsCount}</h1>
                            </div>
                        </div>
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Total Live Event Bookings</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>{calculateTotalEventBookings()}</h1>
                            </div>
                            <div className="curve-img"><img src={img} alt="" /></div>
                        </div>
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Total Facility Bookings</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>{calculateTotalFacilityBookings()}</h1>
                            </div>
                            <div className="curve-img"><img src={img} alt="" /></div>
                        </div>
                    </div>
                    {/* <div className="graph">

                    </div> */}

                    <div className='graph'
                        style={
                            {
                                padding: '10px',
                                width: '46%'
                            }
                        }>
                        <div className="input">
                            <select className="dropdown-dashboard" value={facilityId} onChange={(e) => setFacilityId(e.target.value)}>
                                <option value={''}>Select</option>
                                {
                                    facilityListData?.length > 0 && facilityListData?.map((facility, index) => {
                                        return <option key={index} value={facility.facilityId}>{facility.facilityname}</option>
                                    })
                                }
                                <FontAwesomeIcon icon={faCaretDown} />
                            </select>
                        </div>
                        <Bar
                            data={graphData}
                            options={options}
                        ></Bar>
                    </div>
                </div>

                {/* Activities */}
                <div className="activity-container">

                    <div className="popular-activity h-fit">
                        <h2 className='popular-activity-text'>Popular Activities</h2><br />
                        {
                            adminDashboardData.popularActivities?.length > 0 && adminDashboardData.popularActivities?.map((activity, index) => {
                                if(index < 8){
                                    return (
                                        <div className="games" key={index}>
                                            <p>{activity.userActivityName}</p>
                                            {/* <span>12<FontAwesomeIcon icon={faCaretUp} className='up' /></span> */}
                                            <span>{index == 0 ? <FontAwesomeIcon icon={faTrophy} /> : index + 1}</span>
                                            <h4>{activity.activityCount} bookings </h4> 
                                        </div>
                                    )
                                }
                            })
                        }
                        <br /><br />
                        {/* <hr />
                        <div className="vew-leaderboard">
                            <a href="#">View full Leaderboard <FontAwesomeIcon icon={faAngleRight} /></a>
                        </div> */}
                    </div>

                    <div className="popular-facility h-fit">
                        <h2 className='popular-activity-text'>Popular Facilities</h2><br />
                        {adminDashboardData.popularFacilities?.length > 0 && adminDashboardData.popularFacilities?.map((facility, index) => {
                            if(index < 8){
                                return (
                                    <div className="games" key={index}>
                                        <p>{facility.facilityname}</p>
                                        {/* <span>12<FontAwesomeIcon icon={faCaretUp} className='up' /></span> */}
                                        <span>{index == 0 ? <FontAwesomeIcon icon={faTrophy} /> : index + 1}</span>
                                        <h4>{facility.bookingscount} bookings</h4>
                                    </div>
                                )
                            }
                        })}
                        <br /><br />
                        {/* <hr />
                        <div className="vew-leaderboard">
                            <a href="#">View full Leaderboard <FontAwesomeIcon icon={faAngleRight} /></a>
                        </div> */}
                    </div>
                </div>

                {/* pie chart for activity per user */}

            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default AdminDashboard;
