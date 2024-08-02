import React, { useEffect, useState } from 'react';
import '../Public/SignUp.css';
import { RxCross1 } from 'react-icons/rx';
import { FaRegCircleUser } from 'react-icons/fa6';
import { regex, dataLength } from '../../utils/regexExpAndDataLength';
import axiosHttpClient from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonRunning, faDumbbell, faPersonSwimming, faFootball, faVolleyball, faMap } from '@fortawesome/free-solid-svg-icons';
import SuccessPopup from './SuccessPopup'; // Import the SuccessPopup component
// EncrptData here --------------------------------------------------------
import { encryptData } from '../../utils/encryptData';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import PublicHeader from '../../common/PublicHeader';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../../utils/authSlice";

const SignUp = () => {
    const [signup, setSignup] = useState(true);
    const [otp, setOTP] = useState(false);
    const [profile, setProfile] = useState(false);
    const [resendTimer, setResendTimer] = useState(20);
    const [mobileNumber, setMobileNumber] = useState('');
    const [otpVal, setOtpVal] = useState('');
    const [decideSignUpOrLogin, setDecideSignUpOrLogin] = useState('')
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for controlling the success popup
    const navigate = useNavigate();
    const [signupData, setSignupData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        language: "",
        password: "",
        confirmPassword: "",
        profileImage: ""
    });
    const [timer, setTimer] = useState(60); // Initial timer value in seconds
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const [errors, setErrors] = useState({
        firstNameError: false,
        lastNameError: false,
        emailError: false,
        languageError: false
    });
    const dispatch = useDispatch();

    // API call to fetch preferred activities data
    async function getActivitiesData() {
        try {
            let res = await axiosHttpClient("VIEW_FILTER_OPTIONS_API", "get");
            console.log("getActivitiesData", res.data.fetchActivityMaster[0]);
            setActivityData(res.data.fetchActivityMaster[0]);
        }
        catch (err) {
            console.log("there is an error ", err);
        }
    }
    useEffect(() => { getActivitiesData(); }, []);

    const handleActivityToggle = (e, activity) => {
        e.preventDefault();
        if (selectedActivities.includes(activity)) {
            setSelectedActivities(
                selectedActivities.filter((item) => item !== activity)
            );
        } else {
            setSelectedActivities([...selectedActivities, activity]);
        }
        console.log('selectedActivities', selectedActivities);
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log("Selected Activities:", selectedActivities);
    // };


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
            // case 'email':
            //     error = !regex.EMAIL.test(value) || value.length > dataLength.EMAIL ? 'Invalid email' : '';
            //     break;
            // case 'password':
            //     error = !regex.PASSWORD.test(value) || value.length > dataLength.PASSWORD ? 'Invalid password' : '';
            //     break;
            // case 'confirmPassword':
            //     // Validate confirm password
            //     error = value !== signupData.password ? 'Passwords do not match' : '';
            //     setConfirmPasswordError(error);
            //     break;
            default:
                break;
        }
        // setSignupData({ ...signupData, [name]: value });

        setSignupData({ ...signupData, [name]: value, [`${name}Error`]: error });
    };

    useEffect(() => {
        let intervalId;

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
        if (otp && timer > 0) {
            intervalId = setInterval(decrementTimer, 1000);
        }

        // Clean up interval when component unmounts
        return () => clearInterval(intervalId);
    }, [otp, timer]);

    // Function to handle sending OTP
    async function handleSignUp(e) {
        e.preventDefault();
        if (mobileNumber == '') {
            toast.error('Please enter mobile number.');
            return;
        }

        try {
            let res = await axiosHttpClient('PUBLIC_SIGNUP_GENERATE_OTP_API', 'post', {
                encryptMobile: encryptData(mobileNumber)
            });
            console.log('response after signup', res.data);
            toast.success('An OTP is sent to your registered mobile number.')
            setSignup(false);
            setOTP(true);
            setTimer(60);
        }
        catch (error) {
            console.error(error);
            toast.error('Sign up failed. Please try again!')
        }
    }

    // Function to handle verifying OTP
    async function handleOTP(e) {
        e.preventDefault();
        if (otpVal == '') {
            toast.error('Please enter the OTP.');
            return;
        }

        try {
            let res = await axiosHttpClient('PUBLIC_SIGNUP_VERIFY_OTP_API', 'post', {
                encryptMobile: encryptData(mobileNumber),
                encryptOtp: encryptData(otpVal)
            });
            console.log('response after otp entry', res.data);
            setDecideSignUpOrLogin(res.data.decideSignUpOrLogin);
            // Dispatch login success action with tokens and user data -------------------
            if (res.data.decideSignUpOrLogin == 1) {
                dispatch(loginSuccess({
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken,
                    user: res.data.user,
                    sid: res.data.sid
                }));
                toast.success("Login successfully.");
                // sessionStorage.setItem("isUserLoggedIn", 1);
                navigate('/');
            }
            else {
                sessionStorage.setItem("isUserLoggedIn", 0);
                setOTP(false);
                setProfile(true);
            }
        }
        catch (error) {
            console.error(error);
            toast.error('Sign up failed. Please try again!')
        }
    }

    // Function to handle profile setup
    async function handleProfile(e) {
        e?.preventDefault();
        console.log("handleProfile");
        if (!validateForm()) {
            return; // Exit if form validation fails
        }

        try {
            const response = await axiosHttpClient('PUBLIC_SIGNUP_API', 'post', {
                encryptFirstName: encryptData(signupData.firstName),
                encryptLastName: encryptData(signupData.lastName),
                encryptEmail: encryptData(signupData.email),
                encryptLanguage: (signupData.language),
                encryptPhoneNo: encryptData(mobileNumber),
                isEmailVerified: 1,
                encryptActivity: selectedActivities,
                userImage: signupData.profileImage.data,
                location: selectedDistance,
            });
            console.log('Response:', response.data);
            // Redirect to home page after successful registration
            toast.success(response.data.message);
            sessionStorage.setItem("isUserLoggedIn", 0);
            navigate('/login-signup');
            setShowSuccessPopup(true); // Show the success popup
        } catch (error) {
            console.error('Error:', error);
            toast.error('Profile Setup failed. Please try again.');
        }
    }


    // PERFORM VALIDATION ON THE FORM
    const validateForm = () => {
        const { firstName, lastName, email, language } = signupData;
        // Check if fields are empty
        if (!firstName || !lastName || !email) {
            toast.error('All fields are required');
            return false;
        }
        // Validate first name
        if (!regex.NAME.test(firstName)) {
            toast.error('Invalid first name');
            return false;
        }
        // Validate last name
        if (!regex.NAME.test(lastName)) {
            toast.error('Invalid last name');
            return false;
        }
        // Validate email
        if (!regex.EMAIL.test(email)) {
            toast.error('Invalid email');
            return false;
        }
        if (language == '') {
            toast.error('Select language');
            return false;
        }
        return true;
    };
    // here SingUp Page (Send the Mobile Number of User)


    const [selectedDistance, setSelectedDistance] = useState(null);

    // Function to handle distance selection
    const handleDistanceSelect = (e, distance) => {
        e.preventDefault();
        setSelectedDistance(distance);
        // You can perform additional actions here, such as sending notifications or updating state
    };

    // function to handle file input
    function fileHandler(e) {
        let { name, value } = e.target;
        if (name == 'profileImage') {
            let file = e.target.files[0];
            console.log('file attachment', file);
            if (parseInt(file.size / 1024) <= 200) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    setSignupData({
                        ...signupData,
                        ["profileImage"]: {
                            name: file.name,
                            data: reader.result
                        }
                    });
                }
            }
            else {
                toast.dismiss();
                toast.warning('Kindly choose a file with size less than 500 KB.');
                return;
            }
        }
        console.log('signupData', signupData);
    }

    // function to select language
    function handleButtonClick(e, language) {
        setSignupData({
            ...signupData,
            ["language"]: language
        });
        console.log("language", signupData);
    }


    return (
        <div>
            <PublicHeader />
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
                                <input className='input-field' type="text" name="Mobile" value={mobileNumber} placeholder='Enter Mobile Number' onChange={(e) => setMobileNumber(e.target.value)} />
                            </div>
                            <div className="otp-btn" onClick={handleSignUp}>
                                <button className="sendotp-btn_login" >Send OTP</button>
                            </div>
                            {/* Option for SignIn */}
                            <div className="no-account">
                                <p>Have an account?</p>
                                <Link to='/login-signup'>
                                    Login
                                </Link>
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
                                <input className='input-field' type="text" placeholder='' value={otpVal} onChange={(e) => setOtpVal(e.target.value)} />
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
                )
            }

            {/* user profile setup */}
            {
                profile && (
                    <form onSubmit={handleProfile}>
                        <div className="profile-setup-container">
                            <div className="context-profile">
                                <div className="icon"><RxCross1 /></div>
                                <div className='heading-text'>
                                    <h1>Let's Setup your Profile</h1>
                                </div>

                                <div className="profile-picture">
                                    <div className="user-logo">
                                        {
                                            signupData.profileImage.data ? <img src={signupData.profileImage.data} />
                                                : <FaRegCircleUser />
                                        }
                                    </div>
                                    <label htmlFor="profile-image" className="add-image">
                                        {
                                            signupData.profileImage.data ? <span onClick={(e) => setSignupData({ ...signupData, ["profileImage"]: { name: '', data: '' } })}>Remove Image</span> :
                                                <span>Add Image <i>(Image size &lt; 200KB)</i></span>
                                        }
                                    </label>
                                    <input id="profile-image" name='profileImage' type="file" accept="image/*" className="input-image" onChange={fileHandler} />
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
                                            Language
                                        </label>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={(e) => handleButtonClick(e, "English")}
                                                className={`language-button ${signupData.language === "English" ? "active" : ""}`}
                                            >
                                                English
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => handleButtonClick(e, "ଓଡ଼ିଆ")}
                                                className={`language-button ${signupData.language === "ଓଡ଼ିଆ" ? "active" : ""}`}
                                            >
                                                ଓଡ଼ିଆ
                                            </button>
                                        </div>
                                        {signupData.languageError && <p className="error-message">Select language</p>} {/* Display error message */}
                                    </div>



                                </div><br />
                                {/* ...........Preferred Activity....................... */}
                                <div className="preffered-activity">
                                    <label htmlFor=""><span>Preferred Activity</span>   (user can select multiple activities)</label>
                                    <div className="activities-buttons">
                                        {activityData?.length > 0 &&
                                            activityData.map((activity) => {
                                                return (
                                                    <button
                                                        key={activity.userActivityId}
                                                        className={`activity-btn ${selectedActivities.includes(activity.userActivityId)
                                                            ? "selected"
                                                            : ""
                                                            }`}
                                                        onClick={(e) => handleActivityToggle(e, activity.userActivityId)}
                                                    >
                                                        {activity.userActivityName}
                                                    </button>
                                                    // <button className='activity-btn'
                                                    //     onClick={(e) => handleActivityToggle(e, activity.userActivityId)}
                                                    // >
                                                    //     <span>{activity.userActivityName}</span>
                                                    // </button>

                                                )
                                            })
                                        }
                                    </div>
                                </div><br />
                                {/* ...... preffered area distance............ */}
                                <div className="preffered-activity">
                                    <label htmlFor="">
                                        <span>Preferred Location</span>
                                    </label>
                                    <div className="distance-dropdown">
                                        <div className="dropdown">
                                            <button className="dropbtn">
                                                <FontAwesomeIcon icon={faMap} /> &nbsp;
                                                {selectedDistance ? `${selectedDistance}` : 'Select Location'}
                                            </button>
                                            <div className="dropdown-content">
                                                <button onClick={(e) => handleDistanceSelect(e, "Patia")}>Patia</button>
                                                <button onClick={(e) => handleDistanceSelect(e, "Chandrashekharpur")}>Chandrashekharpur</button>
                                                <button onClick={(e) => handleDistanceSelect(e, "Damana")}>Damana</button>
                                                <button onClick={(e) => handleDistanceSelect(e, "Jayadev Vihar")}>Jayadev Vihar</button>
                                                <button onClick={(e) => handleDistanceSelect(e, "Saheed Nagar")}>Saheed Nagar</button>
                                                <button onClick={(e) => handleDistanceSelect(e, "Madhusudan Nagar")}>Madhusudan Nagar</button>
                                                <button onClick={(e) => handleDistanceSelect(e, "Nayapalli")}>Nayapalli</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="preffered-activity">
                                    <label htmlFor="">
                                        <span>Preferred Location</span>
                                        (Set Preferred Location Radius: Choose a radius (e.g., 10km or 15km) to receive notifications for all parks within that distance.)
                                    </label>
                                    <div className="distance-dropdown">
                                        <div className="dropdown">
                                            <button className="dropbtn">
                                                <FontAwesomeIcon icon={faPersonRunning} />
                                                {selectedDistance ? `${selectedDistance} km` : 'Select Distance'}
                                            </button>
                                            <div className="dropdown-content">
                                                <button onClick={() => handleDistanceSelect(5)}>5km</button>
                                                <button onClick={() => handleDistanceSelect(10)}>10km</button>
                                                <button onClick={() => handleDistanceSelect(15)}>15km</button>
                                                <button onClick={() => handleDistanceSelect(20)}>20km</button>
                                                <button onClick={() => handleDistanceSelect(25)}>25km</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>*/}


                                <div className="otp-btn" onClick={handleProfile}>
                                    <button type='submit' className="sendotp-btn">Proceed</button>
                                </div>
                            </div>
                        </div>
                    </form>
                )
            }
            {showSuccessPopup && <SuccessPopup />}
        </div >
    )
}

export default SignUp
