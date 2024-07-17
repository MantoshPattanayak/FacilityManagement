

import "./Advertising_with_us.css"
import PublicHeader from "../../../common/PublicHeader";
import Ads from '../../../assets/ads.png'
const Advertising_with_us = () => {
    return (
        <div className="main_conatiner_advertising">
            <PublicHeader />
            <div className="Child_conatiner_advertising">
                <div className="Child_conatiner_advertising_set_image_content">
                    <span>
                        <h1 className="Adv_text">Advertising with us</h1>
                    </span>
                    <span>
                        <img className="ads_image" src={Ads}></img>
                    </span>
                </div>
            </div>
            <div className='Req_Partner'>
                <div className='Form_Container'>
                    <form className="Contact_Form" >
                        <div className="Form_Field_contact">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName"
                                placeholder="Please Enter your First Name"
                            // onChange={handleChange}
                            // value={ContactwithUs.fullName}
                            />
                            {/* {showError.fullName && <div className="error text-red-800">{showError.fullName}</div>} */}
                        </div>
                        <div className="Form_Field_contact">
                            <label htmlFor="mobileNo">Mobile Number</label>
                            <input type="tel" id="mobileNo" name="mobileNo"
                                placeholder="Please Enter the Mobile Number"
                            // onChange={handleChange}
                            // value={ContactwithUs.mobileNo}
                            />
                            {/* {showError.mobileNo && <div className="error text-red-800">{showError.mobileNo}</div>} */}
                        </div>
                        <div className="Form_Field_contact">
                            <label htmlFor="emailId">Email ID</label>
                            <input type="emailId" id="emailId" name="emailId"
                                placeholder="Please Enter the Email ID"
                            // onChange={handleChange}
                            // value={ContactwithUs.emailId}
                            />
                            {/* {showError.emailId && <div className="error text-red-800">{showError.emailId}</div>} */}
                        </div>
                        <div className="Form_Field_contact">
                            <label htmlFor="mobileNo">Start Date</label>
                            <input type="date" id="mobileNo" name="mobileNo"
                                placeholder="Please Enter the Mobile Number"
                            />
                        </div>
                        <div className="Form_Field_contact">
                            <label htmlFor="duration">Duration (hours)</label>
                            <input type="number" id="duration" name="duration" min="1" max="24" step="1" placeholder="Enter duration (1-24)" />
                        </div>
                        <div className="Form_Field_contact">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message"
                                placeholder="Please Enter your Message"
                            // onChange={handleChange}
                            // value={ContactwithUs.message}
                            ></textarea>
                            {/* {showError.message && <div className="error text-red-800">{showError.message}</div>} */}
                        </div>
                        <div className="Form_Field_contact">
                            <label htmlFor="duration">Upload image</label>
                            <input type="upload" id="duration" name="duration" min="1" max="24" step="1" placeholder="Enter duration (1-24)" />
                        </div>
                        <button className="button-3" role="button">Submit</button>
                        {/* <ToastContainer /> */}
                    </form>
                </div>
            </div>


        </div>
    )
}
export default Advertising_with_us;