import React, { useRef, useState, useEffect } from 'react';
import './Grievance.css';
import CommonFooter from '../../../common/CommonFooter';
import CommonHeader from '../../../common/CommonHeader';
import PublicHeader from '../../../common/PublicHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosHttpClient from '../../../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

const Grievance = () => {
    const [selectedForm, setSelectedForm] = useState('Grievance');

    const handleFormChange = (event) => {
        setSelectedForm(event.target.value);
    };

    return (
        <div>
            <PublicHeader />
            <ToastContainer />
            <div className="grievenceForm">
                <div className="heading">
                    <h2>{selectedForm} Form</h2>
                </div>
                <p>If you want to lodge a {selectedForm.toLowerCase()}, kindly fill the following {selectedForm.toLowerCase()} registration form!</p>

                <div className="radiobutton">
                    <div className="insideRadioButton">
                        <input
                            type="radio"
                            id="grievance"
                            value="Grievance"
                            checked={selectedForm === 'Grievance'}
                            onChange={handleFormChange}
                        />
                        <label htmlFor="grievance">Grievance</label>
                    </div>
                    <div className="insideRadioButton">
                        <input
                            type="radio"
                            id="feedback"
                            value="Feedback"
                            checked={selectedForm === 'Feedback'}
                            onChange={handleFormChange}
                        />
                        <label htmlFor="feedback">Feedback</label>
                    </div>
                </div>

                {selectedForm === 'Grievance' ? <GrievanceForm /> : <FeedbackForm />}
            </div>
        </div>
    );
};

const GrievanceForm = () => {
    const [user, setUser] = useState({
        fullname: "",
        emailId: "",
        phoneNo: "",
        subject: "",
        details: "",
        statusId: "",
        filepath: "",
        isWhatsappNumber: "",
        grievanceCategoryId: ""
    });
    const [captcha, setCaptcha] = useState('');
    const [grievanceCategoryList, setGrievanceCategoryList] = useState([]);

    const characters = 'abc123';

    async function fetchInitialData() {
        try {
            let res = await axiosHttpClient('GRIEVANCE_INITIAL_DATA_API', 'get');
            console.log('grievance feedback initial data fetch response', res.data.data);
            setGrievanceCategoryList(res.data.data)
        }
        catch (error) {
            console.error(error);
        }
    }
    // hamdle Submit from of Grivance -----------------------------------------------------
    async function handleSubmitForm(e) {
        try {
            let res = await axiosHttpClient('USER_SUBMIT_GRIEVANCE_API', 'post', {
                fullname: user.fullname,
                emailId: user.emailId,
                phoneNo: user.phoneNo,
                subject: user.subject,
                details: user.details,
                statusId: user.statusId,
                filepath: user.filepath,
                isWhatsappNumber: user.isWhatsappNumber,
                grievanceCategoryId: user.grievanceCategoryId
            });
            console.log("here Grivance Response", res)
        }
        catch (error) {
            console.error(error);
            toast.error(`${selectedForm} form submission failed. Kindly try again!`);
        }
    }
    // handle Change ---------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };
    // fetch initial data on page load
    useEffect(() => {
        fetchInitialData();
        setCaptcha(generateString(6));
    }, [])


    const generateString = (length) => {
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };









    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };



    return (
        <div className="grievanceContainer">
            <div className="row">
                <div className="form-group">
                    <label htmlFor="nameInput">Name *</label>
                    <input type="text" id="nameInput" placeholder="Enter Name"
                        name='fullname'
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <div className="levelCheckBox">
                        <label htmlFor="mobileInput">Mobile *</label>
                        <div className="checkboxLev">
                            <input type="checkbox" id="checkBox1"
                                name='isWhatsappNumber'
                                onChange={handleChange} />
                            <label htmlFor="checkBox1">Is WhatsApp Number?</label>
                        </div>
                    </div>
                    <input
                        type="text"
                        id="mobileInput"
                        placeholder="Enter mobile Number"
                        name='phoneNo'
                        onChange={handleChange}

                    />

                </div>
            </div>

            <div className="row">
                <div className="form-group">
                    <label htmlFor="emailInput">Email</label>
                    <input
                        type="text"
                        id="emailInput"
                        placeholder="Enter Email"
                        name='emailId'
                        onChange={handleChange}

                    />
                    {/* {!isValidEmail && <p className="error-message">Please enter a valid email address.</p>} */}
                </div>
                <div className="form-group">
                    <label htmlFor="subjectInput">Subject *</label>
                    <input type="text" id="subjectInput" placeholder="Enter Subject"
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group2">
                    <label htmlFor="grievanceInput">Grievance *</label>
                    <input type="text" id="grievanceInput" placeholder="Enter Grievance"
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="row">
                <div className="form-group">
                    <label htmlFor="photoInput">Photo *</label>
                    <div className="inputButton">
                        <input
                            type="text"
                            id="photoInput"
                            placeholder="No photo uploaded"
                            onChange={handleChange}
                        />
                        <button type="button" onClick={handleButtonClick}>
                            Upload
                        </button>
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleChange}

                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="captchaInput">Captcha *</label>
                    <div className="captcha">
                        <div>{captcha}</div>
                        <input type="text" id="captchaInput" name="username" value={user.username} onChange={handleChange} placeholder="Enter Captcha" />
                        <div><FontAwesomeIcon icon={faRotateRight} /></div>
                    </div>
                </div>
            </div>
            <div className="row">
                <button type="button" className='submitbutton'>Submit</button>
            </div>
        </div>
    );
};


const FeedbackForm = () => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [isValidMobile, setIsValidMobile] = useState(true);
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleMobileChange = (event) => {
        const { value } = event.target;
        setMobileNumber(value);
    };

    const validateMobileNumber = () => {
        const mobileNumberPattern = /^\d{10}$/;
        const isValid = mobileNumberPattern.test(mobileNumber);
        setIsValidMobile(isValid);
    };

    const handleEmailChange = (event) => {
        const { value } = event.target;
        setEmail(value);
    };

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailPattern.test(email);
        setIsValidEmail(isValid);
    };

    return (
        <div className="grievanceContainer">
            <div className="row">
                <div className="form-group">
                    <label htmlFor="nameInput">Name *</label>
                    <input type="text" id="nameInput" placeholder="Enter Name" />
                </div>
                <div className="form-group">
                    <div className="levelCheckBox">
                        <label htmlFor="mobileInput">Mobile *</label>
                        <div className="checkboxLev">
                            <input type="checkbox" id="checkBox1" />
                            <label htmlFor="checkBox1">Is WhatsApp Number?</label>
                        </div>
                    </div>
                    <input
                        type="text"
                        id="mobileInput"
                        placeholder="Enter mobile Number"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        onBlur={validateMobileNumber}
                        className={!isValidMobile ? 'invalid-input' : ''}
                    />
                    {!isValidMobile && <p className="error-message">Please enter a valid mobile number.</p>}
                </div>
            </div>

            <div className="row">
                <div className="form-group">
                    <label htmlFor="emailInput">Email</label>
                    <input
                        type="text"
                        id="emailInput"
                        placeholder="Enter Email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={validateEmail}
                        className={!isValidEmail ? 'invalid-input' : ''}
                    />
                    {!isValidEmail && <p className="error-message">Please enter a valid email address.</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="subjectInput">Subject *</label>
                    <input type="text" id="subjectInput" placeholder="Enter Subject" />
                </div>
            </div>

            <div className="row">
                <div className="form-group2">
                    <label htmlFor="feedbackInput">Feedback *</label>
                    <input type="text" id="feedbackInput" placeholder="Enter Feedback" />
                </div>
            </div>
            <div className="row">
                <button type="button" className='submitbutton'>Submit</button>
            </div>
        </div>
    );
};

export default Grievance;