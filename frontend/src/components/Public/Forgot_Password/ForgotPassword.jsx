import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import { RxCross1 } from 'react-icons/rx';
import PublicHeader from '../../../common/PublicHeader';
import CommonFooter from '../../../common/CommonFooter';
import { useNavigate, Link } from 'react-router-dom';
import { regex } from '../../../utils/regexExpAndDataLength';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import SuccessPopup from '../SuccessPopup';
import axiosHttpClient from '../../../utils/axios';
import { decryptData, encryptData } from '../../../utils/encryptData';

const ForgotPassword = () => {
    const [forgotPassword, setForgotPassword] = useState(true);
    const [otp, setOTP] = useState(false);
    const [createPassword, setCreatePassword] = useState(false);
    const [otpVal, setOtpVal] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [decideSignUpOrLogin, setDecideSignUpOrLogin] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();
    const [timer, setTimer] = useState(60);
    const [ForgotPasswordDataPost, setForgotPasswordDataPost] = useState({
        mobileNo: "",
        password: "",
        confirmPassword:"",
    });

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    async function handleSignUp(e) {
        e.preventDefault();

        if (mobileNumber === '') {
            toast.error('Please enter mobile number.');
            return;
        }

        if (!regex.PHONE_NUMBER.test(mobileNumber)) {
            setValidationMessage('Invalid mobile number. It should be a 10-digit number.');
            return;
        }

        try {
            const res = await axiosHttpClient('PUBLIC_SIGNUP_GENERATE_OTP_API', 'post', {
                encryptMobile: encryptData(mobileNumber)
            });
            console.log('response after entering mobile number', res.data);
            setValidationMessage('');
            setForgotPassword(false);
            setOTP(true);
            setTimer(60); // Reset timer for resend OTP
        } catch (error) {
            console.error(error);
            toast.error('Sign up failed. Please try again!');
        }

        
    }



    async function handleOTP(e) {
        e.preventDefault();

        if (otpVal === '') {
            toast.error('Please enter the OTP.');
            return;
        }

        if(decideSignUpOrLogin==0){
           console.log("user do not have any account");
           toast.error('User do not have any account.', {
            autoClose: 3000, // Toast timer duration in milliseconds
            onClose: () => {
              // Navigate to another page after toast timer completes
              setTimeout(() => {
                navigate('/login/SignUp');
              }, 1000); // Wait 1 second after toast timer completes before navigating
            }
          });
        }
        else{
            try {
                const res = await axiosHttpClient('PUBLIC_SIGNUP_VERIFY_OTP_API', 'post', {
                    encryptMobile: encryptData(mobileNumber),
                    encryptOtp: encryptData(otpVal)
                });
                console.log('response after otp entry', res.data);
                setOTP(false);
                setCreatePassword(true);
            }
            catch (error) {
                console.error(error);
                toast.error('OTP verification failed. Please try again!');
            }
        }

    }
//  here Post (Update data) -------------------------
function handleChange(e) {
    e.preventDefault();
    let { name, value } = e.target;
    setForgotPasswordDataPost({ ...ForgotPasswordDataPost, [name]: value });
    console.log('ForgotPasswordDataPost', ForgotPasswordDataPost);
    return;
  }
// here api...........
    async function handleCreatePassword(e) {
        e.preventDefault();

        if (ForgotPasswordDataPost.password !== ForgotPasswordDataPost.confirmPassword) {
            setValidationMessage('Passwords do not match.');
            return;
        }

        // if (!regex.PASSWORD.test(newPassword)) {
        //     setValidationMessage('Password must be 8-16 characters long and include uppercase, lowercase, number, and special character.');
        //     return;
        // }

    
            // if (Object.keys(errors).length === 0) {
                try {
                  let res = await axiosHttpClient('FORGOT_PASSWORD_API', 'put', {
                    mobileNo: encryptData(mobileNumber),
                    password: encryptData(ForgotPasswordDataPost.password)
                  });
                  console.log(res);
                  toast.success('Password updated successfully.', {
                    autoClose: 3000, // Toast timer duration in milliseconds
                    onClose: () => {
                      // Navigate to another page after toast timer completes
                      setTimeout(() => {
                        navigate('/login-signup');
                      }, 1000); // Wait 1 second after toast timer completes before navigating
                    }
                  });
                } catch (err) {
                  console.error(err);
                  toast.error('User details updation failed. Please try again.');
                }
            //   } else {
            //     // Here iterate through all input fields errors and display them
            //     Object.values(errors).forEach(error => {
            //       toast.error(error);
            //     });
            //   }
      
    }

    return (
        <div>
            <PublicHeader />
     {forgotPassword && (
        <div className="signup-container">
            <div className="context">
                {decideSignUpOrLogin === 'signup' ? (
                    <p>User does not have an account. Please sign up.</p>
                ) : (
                    <>
                        <div className="icon"><RxCross1 /></div>
                        <div className='heading-text'><h1>Forgot Password</h1></div>
                        <div className="inputs">
                            <div className="text"><p>Mobile no.</p></div>
                            <input
                                className='input-field'
                                type="text"
                                name="Mobile"
                                placeholder='Enter Mobile Number'
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                            />
                        </div>
                        {validationMessage && <p className="validation-message">{validationMessage}</p>}
                        <div className="otp-btn" onClick={handleSignUp}>
                            <button className="sendotp-btn">Send OTP</button>
                        </div>
                        <div className="no-account">
                            <p>Don't have an account?</p>
                            <a href="/login/SignUp">SignUp</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    )}

            {otp && (
                <div className="signup-container">
                    <div className="context">
                        <div className="icon"><RxCross1 /></div>
                        <div className='heading-text'><h1>Verify</h1></div>
                        <div className="inputs">
                            <div className="text"><p>OTP</p></div>
                            <input className='input-field' type="text" placeholder='Enter OTP' value={otpVal} onChange={(e) => setOtpVal(e.target.value)} />
                        </div>
                        <div className="otp-btn" onClick={handleOTP}>
                            <button className="sendotp-btn">Verify OTP</button>
                        </div>
                        <div className="resend-otp">
                            {timer === 0 ? (
                                <button className="sendotp-btn" onClick={handleSignUp}>Resend OTP</button>
                            ) : (
                                <p>Resend OTP in {timer} Sec</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {createPassword && (
                <div className="signup-container">
                    <div className="context">
                        <div className="icon"><RxCross1 /></div>
                        <div className='heading-text'><h1>Create new Password</h1></div>
                        <div className="inputs">
                            <input
                                className='input-field'
                                type="password"
                                name='password'
                                placeholder='New Password'
                                value={ForgotPasswordDataPost.password}
                                onChange={handleChange}
                                // onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                className='input-field'
                                type="password"
                                name='confirmPassword'
                                placeholder='Confirm Password'
                                value={ForgotPasswordDataPost.confirmPassword}
                                onChange={handleChange}
                                // onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {validationMessage && <p className="validation-message">{validationMessage}</p>}
                        <div className="otp-btn" onClick={handleCreatePassword}>
                            <button className="sendotp-btn">Update</button>
                        </div>
                        <div className="no-account">
                            <p>Don't have an account?</p>
                            <Link to={'/login/SignUp'}>
                                SignUp
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessPopup && <SuccessPopup />}

            <ToastContainer />
        </div>
    );
}

export default ForgotPassword;
