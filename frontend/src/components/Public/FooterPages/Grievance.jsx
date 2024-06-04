import React, { useRef, useState, useEffect } from 'react';
import './Grievance.css';
import CommonFooter from '../../../common/CommonFooter';
import CommonHeader from '../../../common/CommonHeader';
import PublicHeader from '../../../common/PublicHeader';

const Grievance = () => {
    const [selectedForm, setSelectedForm] = useState('Grievance');

    const handleFormChange = (event) => {
        setSelectedForm(event.target.value);
    };

    return (
        <div>
            <PublicHeader/>
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
    const [user, setUser] = useState({ username: "" });
    const [captcha, setCaptcha] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [isValidMobile, setIsValidMobile] = useState(true);
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);

    const characters = 'abc123';

    useEffect(() => {
        setCaptcha(generateString(6));
    }, []);

    const generateString = (length) => {
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const onSubmit = () => {
        const userInput = user.username.trim();
        if (userInput === captcha) {
            alert("Captcha Verified");
        } else {
            alert("Captcha Not Matched");
            setCaptcha(generateString(6));
            setUser({ username: "" });
        }
    };

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
    // const handlePhotoChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         setPhoto(file.name);
    //     } else {
    //         setPhoto('');
    //     }
    // };

    const [photoName, setPhotoName] = useState('');

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPhotoName(file.name);
        }
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
                    <label htmlFor="grievanceInput">Grievance *</label>
                    <input type="text" id="grievanceInput" placeholder="Enter Grievance" />
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
                            value={photoName}
                            readOnly
                        />
                        <button type="button" onClick={handleButtonClick}>
                            Upload
                        </button>
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="captchaInput">Captcha *</label>
                    <div className="captcha">
                        <div>{captcha}</div>
                        <input type="text" id="captchaInput" name="username" value={user.username} onChange={handleChange} placeholder="Enter Captcha" />
                    </div>
                </div>
            </div>
            <div className="row">
                <button type="button" onClick={onSubmit} className='submitbutton'>Submit</button>
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