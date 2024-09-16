import React, { useEffect, useState, useRef } from "react";
import "../Public/Login.css";
import axiosHttpClient from "../../utils/axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import PublicHeader from "../../common/PublicHeader";
import { decryptData, encryptData } from "../../utils/encryptData";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../utils/authSlice";

const Login = () => {
  const length = 6;
  const [LogingDataPost, setLogingDataPost] = useState({
    Mobile: "",
    otp: new Array(length).fill(""),
  });
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const location = useLocation();
  const redirect = decryptData(
    new URLSearchParams(location.search).get("redirect")
  );
  const facilityId = new URLSearchParams(location.search).get("facilityId");
  const eventId = new URLSearchParams(location.search).get("eventId");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let intervalId;
    const decrementTimer = () => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTimer - 1;
      });
    };
    if (timer > 0) {
      intervalId = setInterval(decrementTimer, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timer]);

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    if (LogingDataPost.Mobile === "") {
      toast.error("Please enter mobile number.");
      return;
    }

    try {
      let res = await axiosHttpClient(
        "PUBLIC_SIGNUP_GENERATE_OTP_API",
        "post",
        {
          encryptMobile: encryptData(LogingDataPost.Mobile),
        }
      );
      setOtpGenerated(true);
      setTimer(60);
      toast.success("An OTP is sent to your registered mobile number.");
    } catch (error) {
      console.error(error);
      toast.error("OTP generation failed. Please try again!");
    }
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const errors = validation(LogingDataPost);

    if (Object.keys(errors).length === 0) {
      try {
        const res = await axiosHttpClient(
          "PUBLIC_SIGNUP_VERIFY_OTP_API",
          "post",
          {
            encryptMobile: encryptData(LogingDataPost.Mobile),
            encryptOtp: encryptData(LogingDataPost.otp.join("")),
          }
        );

        if (res.data.decideSignUpOrLogin === 1) {
          dispatch(
            loginSuccess({
              accessToken: res.data.accessToken,
              refreshToken: res.data.refreshToken,
              user: res.data.user,
              sid: res.data.sid,
            })
          );
          toast.success("Login successful.");
          if (redirect) {
            if (facilityId) {
              navigate(`${redirect}?facilityId=${facilityId}`);
            } else if (eventId) {
              navigate(`${redirect}?eventId=${eventId}`);
            } else {
              navigate("/");
            }
          } else {
            navigate("/");
          }
        } else {
          toast.error("User does not exist. Kindly signup first!");
        }
      } catch (err) {
        console.error("Error:", err);
        toast.error("Login failed. Please try again.");
      }
    } else {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    setLogingDataPost({ ...LogingDataPost, [name]: value });
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value)) return;

    const newOtp = [...LogingDataPost.otp];
    newOtp[index] = value.substring(value.length - 1);
    setLogingDataPost({ ...LogingDataPost, otp: newOtp });

    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !LogingDataPost.otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const validation = (value) => {
    const err = {};
    if (!value.Mobile) {
      err.Mobile = "Please Enter your Mobile Number";
    } else {
      const mobileNumberRegex = /^[1-9]\d{9}$/;
      if (!mobileNumberRegex.test(value.Mobile)) {
        err.Mobile = "Invalid Mobile Number";
      }
    }
    if (!value.otp.join("")) {
      err.otp = "Please enter your OTP";
    }
    return err;
  };

  return (
    <div className="Main_container_Login">
      <PublicHeader />
      <div className="signup-container">
        <form className="context">
          <div className="inputs">
            <div className="text">
              <label htmlFor="Mobile">Enter Mobile Number</label>
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
              <div className="textOTP">
                <label htmlFor="otp">Enter OTP</label>
              </div>
              <div className="otp-container">
                {LogingDataPost.otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(input) => (inputRefs.current[index] = input)}
                    value={value}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength="1"
                    className="otpInput"
                  />
                ))}
              </div>
            </div>
          )}
          {!otpGenerated && (
            <div className="public-login-otp-btn" onClick={handleGenerateOTP}>
              <button className="public-login-sendotp-btn_login1" type="submit">
                Send OTP
              </button>
            </div>
          )}
          {otpGenerated && (
            <div className="public-login-otp-btn" onClick={HandleSubmit}>
              <button className="public-login-sendotp-btn_login1" type="submit">
                Submit
              </button>
            </div>
          )}
          {otpGenerated && timer === 0 && (
            <div className="public-login-otp-btn" onClick={handleGenerateOTP}>
              <button
                className="public-login-sendotp-btn_login1"
                type="submit"
              >
                Resend OTP
              </button>
            </div>
          )}
          {otpGenerated && timer > 0 && (
            // <div className="public-login-otp-btn bg-gray-400 cursor-not-allowed">
            //   <p>Resend OTP in {timer} seconds.</p>
            // </div>
            <div className="public-login-otp-btn cursor-not-allowed">
              <p>Resend OTP in {timer} seconds.</p>
            </div>
          )}
          <div className="login-options">
            <div className="login-otp">
              <Link to={"/admin-login"}>Admin login</Link>
            </div>
          </div>
          <div className="no-account">
            <p>Don't have an account?</p>
            <Link to={"/login/SignUp"}>SignUp</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
