import React from 'react';
import '../Dashboard/AdminDashboard.css';
import AdminHeader from '../../../common/AdminHeader';
import Footer from '../../../common/Footer';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLong , faCaretDown , faCaretUp , faAngleRight} from "@fortawesome/free-solid-svg-icons";
import img from '../../../assets/wave.jpg';
Chart.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'],
        datasets: [
            {
                label: '369',
                data: [3, 4, 9, 2, 5],
                backgroundColor: 'blue',
                borderColor: 'black',
                borderWidth: 1,
            }
        ]
    };

    const options = {
        // Add your chart options here

    };

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
                                <h1>12312</h1>
                            </div>
                        </div>
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Total Parks</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>12312</h1>
                            </div>
                        </div>
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Total Playground</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>12312</h1>
                            </div>
                        </div>
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Active Events</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>12</h1>
                            </div>
                        </div>
                        <div class="card-dashboard">
                            <div className="card-content">
                                <div className="card-top">
                                    <span className="card-title">Total Bokkings</span>
                                </div>
                            </div>
                            <div className="card-image">
                                <h1>123</h1>
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
                            <select className="dropdown-dashboard" >
                                <option value="" disabled>Select an option</option>
                                <option value="option1">Jaydev Vatika</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                                <FontAwesomeIcon icon={faCaretDown} />

                            </select>
                            
                        </div>
                        <Bar
                            data={data}
                            options={options}
                        ></Bar>
                    </div>
                </div>

               

                {/* Activities */}
                <div className="activity-container">

                    <div className="popular-activity">
                        <h2 className='popular-activity-text'>Popular Activities</h2><br />
                      <div className="games">
                        <p>Cricket</p>
                        <span>12<FontAwesomeIcon icon={faCaretUp} className='up'/></span>
                        <h4>112 bookings</h4>
                        
                      </div>
                      <div className="games">
                        <p>Dance</p>
                        <span>12<FontAwesomeIcon icon={faCaretDown} className="down" /></span>
                        <h4>112 bookings</h4>
                      </div>
                      <div className="games">
                        <p>Football</p>
                        <span>32<FontAwesomeIcon icon={faCaretUp} className='up' /></span>
                        <h4>112 bookings</h4>
                      </div>
                      <div className="games">
                        <p>Yoga</p>
                        <span>76<FontAwesomeIcon icon={faCaretDown} className="down" /></span>
                        <h4>112 bookings</h4>
                      </div>
                      <div className="games">
                        <p>Cricket</p>
                        <span>12<FontAwesomeIcon icon={faCaretDown} className="down" /></span>
                        <h4>112 bookings</h4>
                      </div>
                      <div className="games">
                        <p>Dance</p>
                        <span>12<FontAwesomeIcon icon={faCaretUp} className='up' /></span>
                        <h4>112 bookings</h4>
                      </div>
                      <div className="games">
                        <p>Football</p>
                        <span>12<FontAwesomeIcon icon={faCaretDown} className="down" /></span>
                        <h4>112 bookings</h4>
                      </div><br /><br />
                      <hr />
                      <div className="vew-leaderboard">
                        <a href="#">View full Leaderboard <FontAwesomeIcon icon={faAngleRight} /></a>
                      </div>

                    </div>
                    <div className="popular-facility">
                        <h2 className='popular-activity-text'>Popular Facility</h2><br />
                      <div className="games">
                        <p>Buddha Jayanti Park</p>
                        <span>12<FontAwesomeIcon icon={faCaretUp} className='up' /></span>
                        <h4>112 users visited</h4>
                        
                      </div>
                      <div className="games">
                        <p>DIG park</p>
                        <span>12<FontAwesomeIcon icon={faCaretDown} className="down" /></span>
                        <h4>112 users visited</h4>
                      </div>
                      <div className="games">
                        <p>Buddha Jayanti Park</p>
                        <span>32<FontAwesomeIcon icon={faCaretUp} className='up' /></span>
                        <h4>112 users visited</h4>
                      </div>
                      <div className="games">
                        <p>IG park</p>
                        <span>76<FontAwesomeIcon icon={faCaretDown} className="down" /></span>
                        <h4>112 users visited</h4>
                      </div>
                      <div className="games">
                        <p>Botanical Garden</p>
                        <span>12<FontAwesomeIcon icon={faCaretUp} className='up' /></span>
                        <h4>112 users visited</h4>
                      </div>
                      <div className="games">
                        <p>Northwest region</p>
                        <span>12<FontAwesomeIcon icon={faCaretUp} className='up' /></span>
                        <h4>112 bookings</h4>
                      </div>
                      <div className="games">
                        <p>Bharatpur</p>
                        <span>12<FontAwesomeIcon icon={faCaretDown} className="down" /></span>
                        <h4>112 bookings</h4>
                      </div><br /><br />
<hr />
                      <div className="vew-leaderboard">
                        <a href="#">View full Leaderboard <FontAwesomeIcon icon={faAngleRight} /></a>
                      </div>
                    </div>
                </div>

                {/* pie chart for activity per user */}

            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default AdminDashboard;
