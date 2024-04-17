// import React from 'react'
// import '../Admin/Login.css'
// const Login = () => {
//   return (
//     <div className='login-container'>
//       <form className='login-form'>
//         <div className='form-group'>
//           <label htmlFor='emailOrMobile'>Enter Email / Mobile Number:</label>
//           <input type='text' id='emailOrMobile' name='emailOrMobile' placeholder='Email or Mobile Number' />
//         </div>
//         <div className='form-group'>
//           <label htmlFor='password'>Enter Password:</label>
//           <input type='password' id='password' name='password' placeholder='Password' />
//         </div>
//         <div className="buttons">
//           <button className="submit-btn">
//             Submit
//           </button>
//         </div>
//       </form>

//       <div className='extra-options'>
//         <a href='#'>Forgot Password?</a>
//         <span className='divider'>|</span>
//         <a href='#'>Login with OTP</a>
//       </div>
//     </div>
//   )
// }

// export default Login


import React from 'react';
import './Login.css'; // Import the CSS file for styling

const Login = () => {
  return (
    <div className='login-container'>
      <form className='login-form'>

        <div className='form-group'>
          <label htmlFor='password'>Enter Email/Mobile Number:</label>
          <input type='password' id='Email' name='password' placeholder='Email or Mobile Number' />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Enter Password:</label>
          <input type='password' id='password' name='password' placeholder='Password' />
        </div>
        <div className="buttons">
          <button className="submit-btn">
            Submit
          </button>
        </div>
      </form>

      <div className='extra-options'>
        <a href='#' className='forgot-password'>Forgot Password?</a>
        <span className='divider'>|</span>
        <a href='#' className='login-otp'>Login with OTP</a>
      </div>
    </div>
  );
};

export default Login;

