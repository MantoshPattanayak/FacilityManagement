import React from 'react';

const UnauthorizedPage = () => {
  const containerStyle = {
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 0 300px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '50%',
    width: '100%'
  };

  const headingStyle = {
    color: 'red',
    fontSize: '54px',
    marginBottom: '20px',
    textAlign:'center'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>You are not authorized to access this page.</h1>
      <p style={{ color: '#666' }}>Click to go back to <a href='/'><p className='underline text-blue-500'>Home</p></a>.</p>
    </div>
  );
};

export default UnauthorizedPage;