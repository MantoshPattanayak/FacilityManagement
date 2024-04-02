
import React from 'react';
import './Home.css';
import { FaUserSecret } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";


const Home = () => {
  return (
    <section className="bgi">

    
    <div id='section-1' className='section1'>
      <header>
     

        {/* Content inside Home Page */}
        <div className="card">
          <div className="heading">
            <p>
              <span>AMA BHOOMI</span>
            </p>
          </div>


          <div className="para">
            <p>Explore,book and Enjoy Open Spaces</p>
          </div>


<div className="search">
    <input type="search" placeholder='Search by name ,location' className='input-search' />
</div>
        </div>


      </header>
    </div>

    </section>
  );
}

export default Home;
