

// here Import Contact Us Page....
import "./ContactUs.css"
//font AwesomeIcon ---------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import ContactUsImage from "../../../assets/contact_us-removebg-preview.png"

import PublicHeader from "../../../common/PublicHeader";
import { useEffect, useState } from "react";
import axiosHttpClient from "../../../utils/axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const ContactUs = () => {
    const [ContactwithUs, setContactwithUs] = useState({
        fullName: '',
        mobileNo: '',
        emailId: '',
        message: ''
    });
    const [showError, setShowError] = useState({
        fullName: '',
        mobileNo: '',
        emailId: '',
        message: ''
    }); // State to manage validation errors

    const language = useSelector(
        (state) => state.language.language || localStorage.getItem("language")
    );

    // Function to handle form submission
    const HandleContactwithUsPage = async (e) => {
        e.preventDefault();

        // Validate form fields
        const errors = validation(ContactwithUs);
        setShowError(errors);

        // If there are errors, do not proceed with API call
        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            // Make API call
            const res = await axiosHttpClient("contact_with_us_api", 'post', {
                patner: 0,
                fullName: ContactwithUs.fullName,
                mobileNo: ContactwithUs.mobileNo,
                emailId: ContactwithUs.emailId,
                message: ContactwithUs.message
            });
            console.log("Response of Contact with us Page", res);
            toast.success("Your request is submitted successfully");
            // Clear form after successful submission if needed
            setContactwithUs({
                fullName: '',
                mobileNo: '',
                emailId: '',
                message: ''
            });
        } catch (err) {
            console.error("Error of Contact with us Page", err);
            toast.error("Your request failed. Please try again.");
        }
    };

    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactwithUs({ ...ContactwithUs, [name]: value });
        // Clear validation error when user starts typing again
        setShowError({ ...showError, [name]: '' });
    };

    // Validation function
    const validation = (values) => {
        let errors = {};
        if (!values.fullName.trim()) {
            errors.fullName = "Please enter your full name";
        }
        if (!values.mobileNo.trim()) {
            errors.mobileNo = "Please enter your mobile number";
        }
        if (!values.emailId.trim()) {
            errors.emailId = "Please enter your email address";
        }
        if (!values.message.trim()) {
            errors.message = "Please write your message";
        }
        return errors;
    };

    return (
        <div className="Main_Container_ContactUs_Pages">
            <PublicHeader />
            <div className="ContactUs_Child">
                <span className="ContactUs_Text">
                    <h1 className="Contact_us_text">
                         { language == "EN" && <>Contact Us</> }
                         { language == "OD" && <>ଯୋଗାଯୋଗ କରନ୍ତୁ</> }
                    </h1>
                    <p className="p_tag_contact">
                        { language == "EN" && <>Feel free to contact us and we will get back to you as soon possible</> }
                        { language == "OD" && <>ଦୟ।କରି ଆମ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ ଏବଂ ଆମେ ଆପଣଙ୍କୁ ଶୀଘ୍ର ଉତ୍ତର ଦେବୁ।</> }
                        
                    </p>
                </span>
                <span className="Contact_us_image">
                    <img className="Contact_image" src={ContactUsImage}></img>
                </span>
            </div>
            <div className="Container_Contact">
                <h1 className="Contact_us_text_name">
                    { language == "EN" && <>Contact Us</> }
                    { language == "OD" && <>ଯୋଗାଯୋଗ କରନ୍ତୁ</> }
                </h1>
                <div className="Child_Container_Contact">
                    <div className="Contact_Info_Container">
                        <h1 className="get_touch">
                            { language == "EN" && <>Get In Touch With Us.</> }
                            { language == "OD" && <>ଆମ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ |</> }
                        </h1>
                        <div className="Contact_Info_Box">
                            <FontAwesomeIcon className="icon_contact" icon={faMapMarkerAlt} />
                            <span className="Contact_Info_Text">
                                { language == "EN" && <>Bhubaneswar Development Authority (BDA)</> }
                                { language == "OD" && <>ଭୁବନେଶ୍ୱର ଉନ୍ନୟନ କତ୍ତୃପକ୍ଷ (BDA)</> }
                            </span>
                        </div>
                        <div className="Contact_Info_Box">
                            <FontAwesomeIcon className="icon_contact" icon={faEnvelope} />
                            <span className="Contact_Info_Text">bdabbsr1983@gmail.com</span>
                        </div>
                        <div className="Contact_Info_Box">
                            <FontAwesomeIcon className="icon_contact" icon={faPhone} />
                            <span className="Contact_Info_Text">0674-2396437</span>
                        </div>
                    </div>
                    <div className="Form_Container">
                        <form className="Contact_Form" onSubmit={HandleContactwithUsPage}>
                            <div className="Form_Field_contact">
                                <label htmlFor="fullName">Full Name</label>
                                <input type="text" id="fullName" name="fullName"
                                    placeholder="Please Enter your First Name"
                                    onChange={handleChange}
                                    value={ContactwithUs.fullName}
                                />
                                {showError.fullName && <div className="error text-red-800">{showError.fullName}</div>}
                            </div>
                            <div className="Form_Field_contact">
                                <label htmlFor="mobileNo">Mobile Number</label>
                                <input type="tel" id="mobileNo" name="mobileNo"
                                    placeholder="Please Enter the Mobile Number"
                                    onChange={handleChange}
                                    value={ContactwithUs.mobileNo}
                                />
                                {showError.mobileNo && <div className="error text-red-800">{showError.mobileNo}</div>}
                            </div>
                            <div className="Form_Field_contact">
                                <label htmlFor="emailId">Email ID</label>
                                <input type="emailId" id="emailId" name="emailId"
                                    placeholder="Please Enter the Email ID"
                                    onChange={handleChange}
                                    value={ContactwithUs.emailId}
                                />
                                {showError.emailId && <div className="error text-red-800">{showError.emailId}</div>}
                            </div>

                            <div className="Form_Field_contact">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message"
                                    placeholder="Please Enter your Message"
                                    onChange={handleChange}
                                    value={ContactwithUs.message}
                                ></textarea>
                                {showError.message && <div className="error text-red-800">{showError.message}</div>}
                            </div>
                            <button className="button-3" role="button">Submit</button>
                            <ToastContainer />
                        </form>
                    </div>
                </div>
            </div>

        </div>

    )
}
export default ContactUs;