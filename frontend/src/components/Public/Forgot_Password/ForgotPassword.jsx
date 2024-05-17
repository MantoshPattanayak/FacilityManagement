import React, { useState } from 'react';
import './ForgotPassword.css';
import { RxCross1 } from 'react-icons/rx';
import CommonHeader from '../../../common/CommonHeader';
import CommonFooter from '../../../common/CommonFooter';
import { useNavigate } from 'react-router-dom';
import { regex } from '../../../utils/regexExpAndDataLength';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import SuccessPopup from '../SuccessPopup';

const ForgotPassword = () => {
    const [forgotPassword, setForgotPassword] = useState(true);
    const [otp, setOTP] = useState(false);
    const [createPassword, setCreatePassword] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for controlling the success popup
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!regex.PHONE_NUMBER.test(mobileNumber)) {
            setValidationMessage('Invalid mobile number. It should be a 10-digit number.');
            return;
        }
        setValidationMessage('');
        setForgotPassword(false);
        setOTP(true);
    };

    const handleOTP = (e) => {
        e.preventDefault();
        setOTP(false);
        setCreatePassword(true);
    };

    const handleCreatePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setValidationMessage('Passwords do not match.');
            return;
        }
        if (!regex.PASSWORD.test(newPassword)) {
            setValidationMessage('Password must be 8-16 characters long and include uppercase, lowercase, number, and special character.');
            return;
        }
        setValidationMessage('');
        setShowSuccessPopup(true);
        toast.success('Profile Setup done successfully.');

        // Navigate to the login page after a short delay to show the toast notification
        setTimeout(() => {
            navigate('/login-signup');
        }, 3000); // 3-second delay
    };

    return (
        <div>
            <CommonHeader />
            {forgotPassword && (
                <div className="signup-container">
                    <div className="context">
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
                            <input className='input-field' type="text" placeholder='Enter OTP' />
                        </div>
                        <div className="otp-btn" onClick={handleOTP}>
                            <button className="sendotp-btn">Verify OTP</button>
                        </div>
                        <div className="resend-otp"></div>
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
                                placeholder='New Password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                className='input-field'
                                type="password"
                                placeholder='Confirm Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {validationMessage && <p className="validation-message">{validationMessage}</p>}
                        <div className="otp-btn" onClick={handleCreatePassword}>
                            <button className="sendotp-btn">Update</button>
                        </div>
                        <div className="no-account">
                            <p>Don't have an account?</p>
                            <a href="/login/SignUp">SignUp</a>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessPopup && <SuccessPopup />}
          


            <CommonFooter />
        </div>
    );
}

export default ForgotPassword;
