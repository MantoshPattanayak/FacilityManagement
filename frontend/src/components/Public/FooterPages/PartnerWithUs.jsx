// Import Css file -----------------------
import './PartnerWithUs.css'
import PublicHeader from '../../../common/PublicHeader';
import patherwithus from '../../../assets/patnerwithus.png'
import howtowork from '../../../assets/workwith.png'
// Funcation Pather With us ------------------------
import { useState, useEffect } from 'react';
import axiosHttpClient from '../../../utils/axios';
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const Partnerwithus = () => {
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
            const res = await axiosHttpClient("contact_with_us_api",'post', {
                patner:1,
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
        <div className='PatherWithUs_main_Conatiner'>
            <PublicHeader />
            <div className='Child_PatnerUs_Conatiner'>
                <div className='Patnerwithus_text_image_container'>
                    <div className='Patnerwithus_Image_Conatiner'>
                        <span className='text_patner'>
                            <h1 className='Join'> Join </h1>
                            <h1 className='Patner_Network'>Partner Network</h1>
                            <p>Let's work together.Join our community of partners who are dedicated to fostering growth <br></br>
                                By partnering with us, you'll have access to a network of professionals, resources, and opportunities <br></br> that can help you achieve your goals and make a meaningful impact in your industry </p>
                            <span className='Join_Now_Button'>
                                <button class="button-38" role="button">Join Now</button>
                            </span>
                        </span>
                        <span className='Patner_image'>
                            <img src={patherwithus}></img>
                        </span>

                    </div>
                    <div className='Patnerwitus_text_conatiner'>
                        <span className='Image_how_work'>
                            <img src={howtowork}></img>
                        </span>
                        <span className='Image_how_work_text'>
                            <h1 className='How'>How to</h1>
                            <h1 className='work'>Work</h1>
                            <p>To work effectively, start by  organizing your tasks and  setting clear priorities. <br></br>
                                Break down larger projects into manageable steps and  allocate time for focused  work <br></br>
                                without distractions.Remember to take regular breaks to maintain productivity and stay  refreshed.
                            </p>
                            <span className='Join_Now_Button'>
                                <button class="button-38" role="button">Let's Work</button>
                            </span>
                        </span>
                    </div>
                    <div className='Become_Patner'>
                        <h1 className='become_patner_text'>Become Our Patner</h1>
                        <p className='Become_p_tag'>
                            Join us in creating a network
                            of innovation and success. As
                            a partner, you'll gain access
                            to exclusive resources, expert
                            <br></br>
                            support, and a community
                            dedicated to achieving
                            excellence together. Let's
                            grow and thrive as partners
                            in this journey.
                            <br></br>
                            Join us in creating a network
                            of innovation and success. As
                            a partner, you'll gain access
                            to exclusive resources, expert
                            support, and a community

                        </p>
                    </div>
                    <div className='Req_Partner'>
            <h1 className='interested'>Interested in becoming Partner</h1>
           
            <div className='Form_Container'>
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
        </div>
    )
}
export default Partnerwithus;