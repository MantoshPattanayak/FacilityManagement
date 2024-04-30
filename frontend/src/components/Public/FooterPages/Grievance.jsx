import React, { useState, useEffect } from 'react';
import './Grievance.css';

const Grievance = () => {

    //captcha verfication starts here
    const [user, setUser] = useState({
        username: "",
    });
    const [captcha, setCaptcha] = useState('');

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
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }

    const onSubmit = () => {
        const userInput = user.username.trim();
        if (userInput === captcha) {
            alert("Captcha Verified");
            // Reset form or do other actions upon successful verification
        } else {
            alert("Captcha Not Matched");
            // Reset captcha and form fields or handle the error
            setCaptcha(generateString(6));
            setUser({ username: "" });
        }
    };
    //captcha verfication ends here


    // Mobile number validationn starts here
    const [mobileNumber, setMobileNumber] = useState('');
    const [isValidMobile, setIsValidMobile] = useState(true);

    const handleMobileChange = (event) => {
        const { value } = event.target;
        setMobileNumber(value);
    };

    const validateMobileNumber = () => {
        const mobileNumberPattern = /^\d{10}$/;
        const isValid = mobileNumberPattern.test(mobileNumber);
        setIsValidMobile(isValid);
    };
    // Mobile number validationn ends here

    //email validation starts here 
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleEmailChange = (event) => {
        const { value } = event.target;
        setEmail(value);
    };

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailPattern.test(email);
        setIsValidEmail(isValid);
    };
    // email vallidation ends here


    return (
        <div>
            <div className="grievenceForm">
                <div className="heading">
                    <h2>Grievance / Feedback Form</h2>
                </div>
                <p>If you want to lodge a grievance / feedback, Kindly fill the following grievance / feedback registration form!</p>

                <div className="radiobutton">
                    <div className="insideRadioButton">
                        <input type="radio" id="grievance" value="Grievance" />
                        <label for="grievance">Grievance</label>
                    </div>
                    <div className="insideRadioButton">
                        <input type="radio" id="feedback" value="Feedback" />
                        <label for="feedback">Feedback</label>
                    </div>
                </div>

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
                                <input type="text" id="photoInput" placeholder="No photo uploaded" />
                                <button type="button">Upload</button>
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
            </div>
        </div>
    )
}

export default Grievance;
