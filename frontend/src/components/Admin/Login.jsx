import React, { useEffect, useState } from "react";
import "../Public/Login.css";
import AdminHeader from "../../common/AdminHeader";
// Import Axios ------------------------
import axiosHttpClient from "../../utils/axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
// EncrptData here --------------------------------------------
import { decryptData, encryptData } from "../../utils/encryptData";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import CommonFooter from "../../common/CommonFooter";
// here import useDispatch to store the
import { useDispatch } from "react-redux";
import { adminLogin } from "../../utils/authSlice";

const AdminLogin = () => {
  // UseState for Post the data--------------------------------
  const [LogingDataPost, setLogingDataPost] = useState({
    Email: "",
    Password: "",
  });
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const location = useLocation();

  // Aysnc functaion for Post the data ------------------------
  async function HandleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit");

    const errors = validation(LogingDataPost);
    console.log(errors);
    toast.dismiss();
    if (Object.keys(errors).length === 0) {
      console.log("email to be post: ", encryptData(LogingDataPost.Email));
      console.log(
        "password to be post: ",
        encryptData(LogingDataPost.Password)
      );
      try {
        const res = await axiosHttpClient("ADMIN_LOGIN_API", "post", {
          encryptEmail: encryptData(LogingDataPost.Email),
          encryptPassword: encryptData(LogingDataPost.Password),
        });
        console.log("user Login Response", res);
        console.log("access token  ", res.data.message);
        // Dispatch login success action with tokens and user data -------------------
        if (res.data.message === "logged in") {
          dispatch(
            adminLogin({
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
              user: res.data.user,
              sid: res.data.sid,
              accessRoutes: res.data.menuItems,
              roleId: res.data.role,
            })
          );

          if (res.data.menuItems) {
            let homeRoute = res.data.menuItems.filter(
              (route) => route.name === "Dashboard"
            )[0]?.children[0]?.path;
            if (!homeRoute) {
              toast.error("User access not provided!");
              return;
            }

            toast.success("Login successfully.", {
              autoClose: 2000,
              onClose: () => {
                navigate(homeRoute);
              },
            });
          } else {
            toast.error("Authorized resources not found!");
          }
        } else {
          toast.error("User does not exist. Request admin for access.");
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
    // Email number validation
    if (!value.Email) {
      err.Email = "Please Enter your Email Id";
    } else {
      const EmailIdRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Regex to match 10-digit Email number not starting with 0
      if (!EmailIdRegex.test(value.Email)) {
        err.Email = "Invalid Email Id";
      }
    }
    // Password validation
    if (!value.Password) {
      err.Password = "Please enter your password";
    }
    return err;
  };

  useEffect(() => {}, [LogingDataPost]);

  return (
    <div className="Main_container_Login">
      <AdminHeader />

      <div className="signup-container">
        <div className="flex justify-center">
          <h1 className="font-bold">Admin login</h1>
        </div>
        <form className="context">
          <div className="inputs">
            <div className="text">
              <label htmlFor="">Enter Email</label>
            </div>
            <input
              className="input-field"
              name="Email"
              type="text"
              placeholder="Enter Email Id"
              autoComplete="off"
              value={LogingDataPost.Email}
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
          <br />
          <div className="otp-btn" onClick={HandleSubmit}>
            <button className="sendotp-btn" type="submit">
              Submit
            </button>
          </div>
          <div className="login-options">
            <div className="login-otp">
              <Link to={"/"}>Back to Home</Link>
            </div>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
