import React, { useEffect, useState } from 'react';
import '../Public/SignUp.css';
import AdminHeader from '../../common/AdminHeader';
import Footer from '../../common/Footer';
import { RxCross1 } from 'react-icons/rx';
import { FaRegCircleUser } from 'react-icons/fa6';
import { regex, dataLength } from '../../utils/regexExpAndDataLength';
import axiosHttpClient from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonRunning, faDumbbell, faPersonSwimming, faFootball, faVolleyball } from '@fortawesome/free-solid-svg-icons';
import SuccessPopup from './SuccessPopup'; // Import the SuccessPopup component

const SignUp = () => {
    const [signup, setSignup] = useState(true);
    const [otp, setOTP] = useState(false);
    const [profile, setProfile] = useState(false);
    const [resendTimer, setResendTimer] = useState(20);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for controlling the success popup
    const navigate = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [signupData, setSignupData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        language: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let error = '';
        switch (name) {
            case 'firstName':
                error = !regex.NAME.test(value) || value.length > dataLength.NAME ? 'Invalid first name' : '';
                break;
            case 'lastName':
                error = !regex.NAME.test(value) || value.length > dataLength.NAME ? 'Invalid last name' : '';
                break;
            case 'email':
                error = !regex.EMAIL.test(value) || value.length > dataLength.EMAIL ? 'Invalid email' : '';
                break;
            case 'password':
                error = !regex.PASSWORD.test(value) || value.length > dataLength.PASSWORD ? 'Invalid password' : '';
                break;
            case 'confirmPassword':
                // Validate confirm password
                error = value !== signupData.password ? 'Passwords do not match' : '';
                setConfirmPasswordError(error);
                break;
            default:
                break;
        }
        // Update state for the respective field
        if (name === 'password') {
            setSignupData({ ...signupData, [name]: value });
        } else {
            setConfirmPassword(value);
        }
        setSignupData({ ...signupData, [name]: value, [`${name}Error`]: error });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            // Check if the timer value is greater than 0 before decrementing
            if (resendTimer > 0) {
                setResendTimer(prevTimer => prevTimer - 1);
            }
        }, 1000); // Interval of 1 second
        // Clear the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [resendTimer]);

    // Function to handle sending OTP
    async function handleSignUp(e) {
        e.preventDefault();
        setSignup(false);
        setOTP(true);
        //  code to send OTP  write here
    }

    // Function to handle verifying OTP
    async function handleOTP(e) {
        e.preventDefault();
        setOTP(false);
        setProfile(true);
    }

    // Function to handle profile setup
    async function handleProfile(e) {
        e.preventDefault();
        if (!validateForm()) {
            return; // Exit if form validation fails
        }
        try {
            const response = await axiosHttpClient('PUBLIC_SIGNUP_API', 'post', {
                firstName: signupData.firstName,
                middleName: signupData.middleName,
                lastName: signupData.lastName,
                email: signupData.email,
                language: signupData.language,
                password: signupData.password
            });
            console.log('Response:', response.data);
            // Redirect to home page after successful registration
            navigate('/Public/Home');
            setShowSuccessPopup(true); // Show the success popup
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /// use Effect 
    useEffect(() => {
        handleProfile()
    }, [])

    // Function to handle resending OTP
    function resendOTP() {
        setResendTimer(20);
    }

    // PERFORM VALIDATION ON THE FORM
    const validateForm = () => {
        const { firstName, lastName, email, password } = signupData;
        // Check if fields are empty
        if (!firstName || !lastName || !email || !password) {
            alert('All fields are required');
            return false;
        }
        // Validate first name
        if (!regex.NAME.test(firstName) || firstName.length > dataLength.NAME) {
            alert('Invalid first name');
            return false;
        }
        // Validate last name
        if (!regex.NAME.test(lastName) || lastName.length > dataLength.NAME) {
            alert('Invalid last name');
            return false;
        }
        // Validate email
        if (!regex.EMAIL.test(email) || email.length > dataLength.EMAIL) {
            alert('Invalid email');
            return false;
        }
        // Validate password
        if (!regex.PASSWORD.test(password) || password.length > dataLength.PASSWORD) {
            alert('Invalid password');
            return false;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return false;
        }
        return true;
    };




    return (
        <div>
            <AdminHeader />
            {
                signup && (
                    <div className="signup-container">
                        <div className="context">
                            <div className="icon"><RxCross1 /></div>
                            <div className='heading-text'> <h1>Login/SignUp</h1>
                            </div>
                            <div className="inputs">
                                <div className="text">
                                    <p>Mobile no.</p>
                                </div>
                                <input className='input-field' type="text" name="Mobile" placeholder='Enter Mobile Number' />
                            </div>
                            <div className="otp-btn">
                                <button className="sendotp-btn" onClick={handleSignUp}>Send OTP</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Verify OTP section */}

            {
                otp && (
                    <div className="signup-container">
                        <div className="context">
                            <div className="icon"><RxCross1 /></div>
                            <div className='heading-text'> <h1>Verify</h1></div>
                            <div className="inputs">
                                <div className="text"><p>OTP</p></div>
                                <input className='input-field' type="text" placeholder='' />
                            </div>
                            <div className="otp-btn">
                                <button className="sendotp-btn" onClick={handleOTP}>Verify OTP</button>
                            </div>
                            <div className="resend-otp">
                                {resendTimer === 0 ? (
                                    <button className="sendotp-btn" onClick={resendOTP}>Resend OTP</button>
                                ) : (
                                    <p>Resend OTP in {resendTimer} Sec</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}




            {/* user profile setup */}
            {
                profile && (
                    // <form onSubmit={handleCreate}>
                    <div className="profile-setup-container">
                        <div className="context-profile">
                            <div className="icon"><RxCross1 /></div>
                            <div className='heading-text'>
                                <h1>Let's Setup your Profile</h1>
                            </div>

                            <div className="profile-picture">
                                <div className="user-logo"><FaRegCircleUser /></div>
                                <label htmlFor="profile-image" className="add-image">Add Image</label>
                                <input id="profile-image" type="file" accept="image/*" className="input-image" />
                            </div>

                            <div className="inputs">
                                <div className="name-field">
                                    <label htmlFor="">
                                        First Name
                                    </label>
                                    <input
                                        className={`input-field ${signupData.firstNameError ? 'input-error' : ''}`} // Apply input-error class if there's an error
                                        type="text"
                                        name='firstName'
                                        onChange={handleChange}
                                        value={signupData.firstName}
                                        placeholder='Enter First Name'
                                    />
                                    {signupData.firstNameError && <p className="error-message">Invalid first name</p>} {/* Display error message */}
                                </div>

                                <div className="name-field">
                                    <label htmlFor="">
                                        Last Name
                                    </label>
                                    <input
                                        className={`input-field ${signupData.lastNameError ? 'input-error' : ''}`} // Apply input-error class if there's an error
                                        type="text"
                                        name='lastName'
                                        onChange={handleChange}
                                        value={signupData.lastName}
                                        placeholder='Enter Last Name'
                                    />
                                    {signupData.lastNameError && <p className="error-message">Invalid last name</p>} {/* Display error message */}
                                </div>

                                <div className="name-field">
                                    <label htmlFor="">
                                        Email
                                    </label>
                                    <input
                                        className={`input-field ${signupData.emailError ? 'input-error' : ''}`} // Apply input-error class if there's an error
                                        type="text"
                                        name='email'
                                        onChange={handleChange}
                                        value={signupData.email}
                                        placeholder='Enter Email'
                                    />
                                    {signupData.emailError && <p className="error-message">Invalid email</p>} {/* Display error message */}
                                </div>

                                <div className="name-field">
                                    <label htmlFor="">
                                        Password
                                    </label>
                                    <input
                                        className={`input-field ${signupData.passwordError ? 'input-error' : ''}`} // Apply input-error class if there's an error
                                        type="password"
                                        name='password'
                                        onChange={handleChange}
                                        value={signupData.password}
                                        placeholder='Create Password'
                                    />
                                    {signupData.passwordError && <p className="error-message">Invalid password</p>} {/* Display error message */}
                                </div>

                                <div className="name-field">
                                    <label htmlFor="">
                                        Confirm Password
                                    </label>
                                    <input
                                        className={`input-field ${confirmPasswordError ? 'input-error' : ''}`}
                                        type="password"
                                        name='confirmPassword'
                                        onChange={handleChange}
                                        value={confirmPassword}
                                        placeholder='Confirm Password'
                                    />
                                    {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                                </div>

                            </div><br />

                            <div className="preffered-activity">
                                <label htmlFor=""><span>Preferred Activity</span>   (user can select multiple activities)</label>
                                <div className="activity">
                                    <button className='activity-btn'>Yoga</button>
                                    <button className='activity-btn'><FontAwesomeIcon icon={faPersonRunning} />Running</button>
                                    <button className='activity-btn'><FontAwesomeIcon icon={faDumbbell} />Open Gym</button>
                                    <button className='activity-btn'><FontAwesomeIcon icon={faPersonSwimming} />Swimming</button>
                                    <button className='activity-btn'>Cricket</button>
                                    <button className='activity-btn'><FontAwesomeIcon icon={faFootball} />Football</button>
                                    <button className='activity-btn'><FontAwesomeIcon icon={faVolleyball} />Voelyball</button>
                                    <button className='activity-btn'>Badminton</button>
                                    <button className='activity-btn'>Rugby</button>                                  

                                </div>
                            </div>
                            <div className="otp-btn">
                                <button type='submit' className="sendotp-btn" onClick={handleProfile}>Proceed</button>
                            </div>
                        </div>
                    </div>
                    // </form>
                )
            }
            {showSuccessPopup && <SuccessPopup />}

            <Footer />
        </div>
    )
}

export default SignUp
