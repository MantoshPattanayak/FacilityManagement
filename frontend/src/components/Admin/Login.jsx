
// import React from 'react';
// import './Login.css'; 
// import { regex, dataLength } from '../../../../frontend/src/utils/regexExpAndDataLength';

// const Login = () => {
//   return (
//     <div className='login-container'>
//       <form className='login-form'>

//         <div className='form-group'>
//           <label htmlFor='password'>Enter Email/Mobile Number:</label>
//           <input type='password' id='Email' name='password' placeholder='Email or Mobile Number' />
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
//         <a href='#' className='forgot-password'>Forgot Password?</a>
//         <span className='divider'>|</span>
//         <a href='#' className='login-otp'>Login with OTP</a>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import './Login.css';
import { regex, dataLength } from '../../../../frontend/src/utils/regexExpAndDataLength';

const Login = () => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!regex.EMAIL.test(emailOrMobile) && !regex.PHONE_NUMBER.test(emailOrMobile)) {
      errors.emailOrMobile = 'Invalid email or mobile number';
    }
    if (!regex.PASSWORD.test(password)) {
      errors.password = 'Password must be 8-16 characters, contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
    }
    if (emailOrMobile.length > dataLength.EMAIL) {
      errors.emailOrMobile = `Email or mobile number must be less than ${dataLength.EMAIL} characters`;
    }
    if (emailOrMobile.length > dataLength.Mobile) {
      errors.emailOrMobile = `Email or mobile number must be less than ${dataLength.Mobile} characters`;
    }
    if (password.length > dataLength.PASSWORD) {
      errors.password = `Password must be less than ${dataLength.PASSWORD} characters`;
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, you can submit it
      console.log('Form submitted:', { emailOrMobile, password });
      // Clear form inputs
      setEmailOrMobile('');
      setPassword('');
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>

        <div className='form-group'>
          <label htmlFor='emailOrMobile'>Enter Email/Mobile Number:</label>
          <input
            type='text'
            id='emailOrMobile'
            name='emailOrMobile'
            placeholder='Email or Mobile Number'
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />
          {errors.emailOrMobile && <span className='error'>{errors.emailOrMobile}</span>}
        </div>
        
        <div className='form-group'>
          <label htmlFor='password'>Enter Password:</label>
          <input
            type='password'
            id='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className='error'>{errors.password}</span>}
        </div>
        
        <div className="buttons">
          <button type="submit" className="submit-btn bg-green-500" id='submit'>Submit</button>
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
