import React, { useEffect, useState } from "react";
import "../Public/Login.css";
import AdminHeader from "../../common/AdminHeader";
// Import Axios ------------------------
import axiosHttpClient from "../../utils/axios";
import { useNavigate, useLocation } from "react-router-dom";
import PublicHeader from "../../common/PublicHeader";
// EncrptData here --------------------------------------------------------
import { decryptData, encryptData } from "../../utils/encryptData";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import CommonFooter from "../../common/CommonFooter";

const AdminLogin = () => {
  // UseState for Post the data---------------------------------
  const [LogingDataPost, setLogingDataPost] = useState({
    Mobile: "",
    Password: "",
  });
  let navigate = useNavigate();
  const location = useLocation();
  // Aysnc functaion for Post the data ------------------------
  async function HandleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit");

    const errors = validation(LogingDataPost);
    console.log(errors);
    // sessionStorage.setItem("isAdminLoggedIn", 1);

    if (Object.keys(errors).length === 0) {
      try {
        const res = await axiosHttpClient("User_Login", "post", {
          encryptMobile: encryptData(LogingDataPost.Mobile),
          encryptPassword: encryptData(LogingDataPost.Password),
        });
        console.log("response after log in", res);
        sessionStorage.setItem("isAdminLoggedIn", 1);
        toast.success("Login successfully.");
        navigate('/Dashboard/AdminDashboard');
      } catch (err) {
        console.error("Error:", err);
        toast.error("Login failed. Please try again.");
        sessionStorage.setItem("isAdminLoggedIn", 0);
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
    // console.log("LogingDataPost", LogingDataPost);
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
    if (!value.Password) {
      err.password = "Please Enter your password";
    }
    return err;
  };

  useEffect(() => {}, [LogingDataPost]);

  return (
    <div>
      <AdminHeader />

      <div className="signup-container">
        <form className="context" onSubmit={HandleSubmit}>
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
            />
          </div>
          <br />

          <div className="inputs">
            <div className="text">
              <label htmlFor="">Enter Password</label>
            </div>
            <input
              className="input-field"
              name="Password"
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              value={LogingDataPost.Password}
              onChange={handleChange}
            />
          </div>

          <div className="otp-btn" onClick={HandleSubmit}>
            <button className="sendotp-btn" type="submit">
              Login
            </button>
          </div>

          {/* <div className="login-options">
            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>

            <div className="login-otp">
              <a href="#">Login with OTP</a>
            </div>
          </div> */}
        </form>
      </div>
      <ToastContainer />

      <CommonFooter />
    </div>
  );
};

export default AdminLogin;
