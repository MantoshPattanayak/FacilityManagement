import React, { useState } from 'react';
import '../Public/Login.css';
import AdminHeader from '../../common/AdminHeader';
import Footer from '../../common/Footer';
// Import Axios ------------------------
import axiosHttpClient from '../../utils/axios';
// EncrptData here --------------------------------------------------------
import { encryptData } from '../../utils/encryptData';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const Login = () => {
    // UseState for Post the data---------------------------------
    const[LogingDataPost, setLogingDataPost]=useState({
        Mobile:"",
        Password:""
    })
    // Aysnc functaion for Post the data ------------------------

    async function HandleSubmit(e){
        e.preventDefault();
        console.log('handleSubmit');
        try{
            const errors = validation(LogingDataPost);
            if (Object.keys(errors).length === 0) {

            let res= await axiosHttpClient('User_Login', 'post',{
                encryptMobile : encryptData(LogingDataPost.Mobile),
                encryptPassword: encryptData(LogingDataPost.Password),
            })
        
            toast.success('Login successfully.');
            setLogingDataPost('')
        }
        else {
            // here Foreach for iterate the all input fields 
            Object.values(errors).forEach(error => {
              toast.error(error);
              setLogingDataPost('')
            });
          }
        }
        catch(err){
            console.log("here error", err.message )
            toast.error('Login failed. Please try again.');
            setLogingDataPost('')
           
        }
    }

  function handleChange(e) {
        e.preventDefault();
        let { name, value } = e.target;
        setLogingDataPost({...LogingDataPost, [name]: value});
        console.log('LogingDataPost', LogingDataPost);
        return;
    }
// Validation here ----------------------------------------
const validation = (value) => {
    const err = {};
  // Mobile number validation
  if (!value.Mobile) {
    err.Mobile = "Please Enter your Mobile Number";
} else {
    const mobileNumberRegex = /^[1-9]\d{9}$/; // Regex to match 10-digit mobile number not starting with 0
    if (!mobileNumberRegex.test(value.Mobile)) {
        err.Mobile = "Invalid Mobile Number";
    }
}
    // Password validation
    if (!value.Password) {
        err.password = "Please Enter your password";
    }
    return err;
}



    return (
        <div>
            <AdminHeader />

       
                <div className="signup-container">
                    <div className="context">
                        <div className="inputs">
                            <div className="text">
                                <label htmlFor="">Enter Mobile Number</label>
                            </div>
                            <input className='input-field' name='Mobile' type="text" placeholder='Enter Email/Mobile Number' value={LogingDataPost.mobileNo} onChange={handleChange}/>
                        </div><br />

                        <div className="inputs">
                            <div className="text">
                                <label htmlFor="">Enter Password</label>
                            </div>
                            <input className='input-field' name='Password' type="password" placeholder='Enter Password' value={LogingDataPost.password} onChange={handleChange}/>
                        </div>

                        <div className="otp-btn">
                            <button className="sendotp-btn" onClick={HandleSubmit}>Login</button>
                        </div>
                        <div className='login-options'>
                            {/* Option for Forgot Password */}
                            <div className="forgot-password">
                                <a href="#">Forgot Password?</a>
                            </div>

                            {/* Option for Login with OTP */}
                            <div className="login-otp">
                                <a href="#">Login with OTP</a>
                            </div>
                        </div>


                        {/* Option for SignUp */}
                        <div className="no-account">
                            <p>Don't have an account?</p>
                            <a href="#">SignUp</a>
                        </div>
                    </div>
                </div>
                <ToastContainer />

            <Footer />
        </div>
    );
}

export default Login;
