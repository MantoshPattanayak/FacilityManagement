import React from 'react';
import '../Dashboard/AdminDashboard.css';
import AdminHeader from '../../../common/AdminHeader';
import Footer from '../../../common/Footer';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const data = {
        labels: ['Mon', 'Tue', 'Wed','Fri', 'Sat'],
        datasets: [
            {
                label: '369',
                data: [3, 4, 9,2,5],
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
                <div className="heading">
                    <h2><b>Dashboard</b></h2>
                </div>
                <div className="activity-name">
                    <p>Users Footfall</p>
                </div>
                {/* Bar graph */}
                <div>
                    <Bar
                        data={data}
                        options={options}
                    />
                </div>

                {/* Activities */}
                <div className="activity-container">

                    <div className="popular-activity">
                       <p>Popular Activities</p><br />
             
                    <div className="activities">
                     <button className='activities-btn'>Running</button> 
                     <button className='activities-btn'>Swimming</button> 
                     <button className='activities-btn'>Yoga</button> 
                     <button className='activities-btn'>Open Gym</button> 
                     <button className='activities-btn'>Running</button> 
                     <button className='activities-btn'>Running</button> 
                     <button className='activities-btn'>Swimming</button> 
                     <button className='activities-btn'>Yoga</button> 
                     <button className='activities-btn'>Open Gym</button> 
                    </div>
                    </div>
                </div>

                {/* pie chart for activity per user */}

            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
