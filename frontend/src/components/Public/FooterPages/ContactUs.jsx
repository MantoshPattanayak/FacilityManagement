

// here Import Contact Us Page....
import "./ContactUs.css"
//font AwesomeIcon ---------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

import PublicHeader from "../../../common/PublicHeader";
const ContactUs = () => {
    return (
        <div className="Main_Container_ContactUs_Pages">
            <PublicHeader />
            <div className="Container_Contact">
                <h1 className="Contact_us_text_name">Contact Us</h1>
                <div className="Child_Container_Contact">
                    <div className="Contact_Info_Container">
                        <h1 className="get_touch">Get In Touch With Us.</h1>
                        <div className="Contact_Info_Box">
                            <FontAwesomeIcon className="icon_contact" icon={faMapMarkerAlt} />
                            <span className="Contact_Info_Text">Bhubaneswar Development Authority(BDA)</span>
                        </div>
                        <div className="Contact_Info_Box">
                            <FontAwesomeIcon className="icon_contact" icon={faEnvelope} />
                            <span className="Contact_Info_Text">hello@example.com</span>
                        </div>
                        <div className="Contact_Info_Box">
                            <FontAwesomeIcon className="icon_contact" icon={faPhone} />
                            <span className="Contact_Info_Text">+1234567890</span>
                        </div>
                    </div>
                    <div className="Form_Container">
                        <form className="Contact_Form">
                            <div className="Form_Field_contact">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" placeholder="Please Enter your First Name" />
                            </div>
                            <div className="Form_Field_contact">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" placeholder="Please Enter your Last Name" />
                            </div>
                            <div className="Form_Field_contact">
                                <label htmlFor="email">Email ID</label>
                                <input type="email" id="email" name="email" placeholder="Please Enter the Email ID" />
                            </div>
                            <div className="Form_Field_contact">
                                <label htmlFor="mobileNumber">Mobile Number</label>
                                <input type="tel" id="mobileNumber" name="mobileNumber" placeholder="Please Enter the Mobile Number" />
                            </div>
                            <div className="Form_Field_contact">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" placeholder="Please Enter your Message"></textarea>
                            </div>
                            <button className="button-3" role="button">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default ContactUs;