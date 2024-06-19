import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Unauthorized.css';

const UnauthorizedPage = () => {

  useEffect(() => {
    document.title = 'Unauthorized access!'
  }, [])
  return (
    <div className="unauthorized-container">
      <h1 className="headingStyle">You are not authorized to access this page.</h1>
      <p className="link">Click to go back to &nbsp; <Link to='/admin-login'><p className='underline text-blue-500'>Home</p></Link></p>
    </div>
  );
};

export default UnauthorizedPage;