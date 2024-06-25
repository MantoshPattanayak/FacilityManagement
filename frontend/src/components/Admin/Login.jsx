import React, { useEffect, useState } from "react";
import "../Public/Login.css";
import AdminHeader from "../../common/AdminHeader";
import Footer from "../../common/Footer";
// Import Axios ------------------------
import axiosHttpClient from "../../utils/axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import PublicHeader from "../../common/PublicHeader";
// EncrptData here --------------------------------------------------------
import { decryptData, encryptData } from "../../utils/encryptData";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import CommonFooter from "../../common/CommonFooter";
// here import useDispatch to store the 
import { useDispatch } from 'react-redux';
import { adminLogin } from "../../utils/authSlice";

const AdminLogin = () => {
  // UseState for Post the data---------------------------------
  const [LogingDataPost, setLogingDataPost] = useState({
    Mobile: "",
    otp: "",
  });
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const location = useLocation();
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [timer, setTimer] = useState(0); // Initial timer value in seconds

  // Function to handle sending OTP
  async function handleGenerateOTP(e) {
    e.preventDefault();
    if (LogingDataPost.Mobile == '') {
      toast.error('Please enter mobile number.');
      return;
    }

    try {
      let res = await axiosHttpClient('PUBLIC_SIGNUP_GENERATE_OTP_API', 'post', {
        encryptMobile: encryptData(LogingDataPost.Mobile)
      });
      console.log('response after signup', res.data);
      setOtpGenerated(true);
      setTimer(60);
      toast.success('An OTP is sent to your registered mobile number.')
    }
    catch (error) {
      console.error(error);
      toast.error('OTP generation failed. Please try again!')
    }
  }

  // Aysnc functaion for Post the data ------------------------
  async function HandleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit");

    const errors = validation(LogingDataPost);
    console.log(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const res = await axiosHttpClient("PRIVATE_LOGIN_VERIFY_OTP_API", "post", {
          encryptMobile: encryptData(LogingDataPost.Mobile),
          encryptOtp: encryptData(LogingDataPost.otp)
        });
        console.log("user Login Response", res);

        // Dispatch login success action with tokens and user data -------------------
        if(res.data.decideSignUpOrLogin == 1){
          dispatch(adminLogin({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            user: res.data.user,
            sid: res.data.sid,
            accessRoutes: res.data.authorizedResource,
            roleId: res.data.role
          }));

          //find and set homepage route for admin user
          let homeRoute = res.data.authorizedResource.filter((route) => { return route.name == 'Dashboard' })[0].children[0].path;
          if(!homeRoute){
            toast.error('User access not provided!');
            return;
          }

          // pop-up to show successful login
          toast.success("Login successfully.", {
            autoClose: 2000,
            onClose: () => {
              navigate(homeRoute);
            }
          });
        }
        else{
          toast.error('User does not exist. Request admin for access.');
        }
      } catch (err) {
        console.error("Error:", err);
        toast.error("Login failed. Please try again.");
      }
    } else {
      // Iterate over validation errors and display them
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
    }
  }

  function handleChange(e) {
    e.preventDefault();
    let { name, value } = e.target;
    setLogingDataPost({ ...LogingDataPost, [name]: value });
    console.log("LogingDataPost", LogingDataPost);
    return;
  }


  // Validation here ----------------------------------------
  const validation = (value) => {
    const err = {};
    console.log(value);
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
    if (!value.otp) {
      err.password = "Please enter your OTP";
    }
    return err;
  };

  useEffect(() => { }, [LogingDataPost]);

  //refresh otp timer
  useEffect(() => {
    let intervalId;
    console.log('timer', timer);
    // Function to decrement timer every second
    const decrementTimer = () => {
      setTimer(prevTimer => {
        if (prevTimer === 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTimer - 1;
      });
    };

    // Start the timer when OTP is sent
    if (timer > 0) {
      intervalId = setInterval(decrementTimer, 1000);
    }
    // Clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, [timer]);

  return (
    <div className="Main_container_Login">
      <AdminHeader />

      <div className="signup-container">
        <div className="flex justify-center"><h1 className="font-bold">Admin login</h1></div>
        <form className="context">
          <div className="inputs">
            <div className="text">
              <label htmlFor="">Enter Mobile Number</label>
            </div>
            <input
              className="input-field"
              name="Mobile"
              type="text"
              placeholder="Enter Mobile Number"
              autoComplete="off"
              value={LogingDataPost.Mobile}
              onChange={handleChange}
              disabled={otpGenerated}
            />
          </div>
          <br />

          {otpGenerated && (
            <div className="inputs">
              <div className="text">
                <label htmlFor="">Enter OTP</label>
              </div>
              <input
                className="input-field"
                name="otp"
                type="password"
                placeholder="Enter OTP"
                autoComplete="off"
                value={LogingDataPost.otp}
                onChange={handleChange}
              />
            </div>)
          }

          { (otpGenerated == false) ?      //if otp is not generated then show send otp button
            (
              <div className="otp-btn" onClick={handleGenerateOTP}>
                <button className="sendotp-btn" type="submit">
                  Send OTP
                </button>
              </div>
            )
            :
            (                             //if otp is not generated then show send otp button
              <div className="otp-btn" onClick={HandleSubmit}>
                <button className="sendotp-btn" type="submit">
                  Submit
                </button>
              </div>
            )
          }

          {
            (otpGenerated == true) ?
            ( (timer === 0) ?(
              <div className="otp-btn" onClick={handleGenerateOTP}>
                <button className="sendotp-btn" type="submit">
                  Resend OTP
                </button>
              </div>
              ):
              (
                <div className="otp-btn bg-gray-400 cursor-not-allowed">
                  <p>Resend OTP in {timer} seconds.</p>
                </div>
              )
            )
            :
            ''
          }

          <div className="login-options">
            {/* Option for Forgot Password */}
            {/* <div className="forgot-password">
              <Link to={'/ForgotPassword'}>
                Forgot Password?
              </Link>
            </div> */}

            {/* Option for Login with OTP */}
            <div className="login-otp">
              <Link to={'/'}>
                Back to Home
              </Link>
            </div>
          </div>
        </form>
      </div>

      <ToastContainer />

    </div>
  );
};

export default AdminLogin;
