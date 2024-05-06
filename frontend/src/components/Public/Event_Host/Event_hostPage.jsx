
import { useState, useEffect } from "react";
import "./Event_HostPage.css"
const Event_hostPage=()=>{
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission
      console.log('Form submitted:', formData);
    };
  
    const nextStep = () => {
      setCurrentStep(currentStep + 1);
    };
  
    const prevStep = () => {
      setCurrentStep(currentStep - 1);
    };
  
    return (
      <div>
        {currentStep === 1 && (
             
       <form onSubmit={nextStep} className="event-host_1st_Page">
                 <h2 className="step_from_css">Step 1</h2>
               <div className="HostEvent_container">
              <div className="HostEvent_Heading">
                 <div className="HeadingTitle9">
                     <div></div>
                     <h2>Organisation Details</h2>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Organization / Individual Name*</label>
                        <input type="text" id="input1" placeholder="Organization / Individual Name" />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Organization/Individual PAN card number*</label>
                        <input type="text" id="input2" placeholder="Organization/Individual PAN card number" />
                    </div>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Organization/Individual Address*</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address" />
                    </div>
                </div>

                {/* Two more similar rows for Heading 1 */}
            </div>
            <div className="HostEvent_Heading">
                <div className="HeadingTitle9">
                    <div></div>
                    <h2>Contact Person Details</h2>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">First Name*</label>
                        <input type="text" id="input1" placeholder="First Name" />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Last Name*</label>
                        <input type="text" id="input2" placeholder="Last Name" />
                    </div>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Phone Number*</label>
                        <input type="text" id="input1" placeholder="Phone Number" />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Email Address*</label>
                        <input type="text" id="input2" placeholder="Email Address" />
                    </div>

                </div>
                {/* Two more similar rows for Heading 1 */}
            </div>
            <div className="HostEvent_Heading">
                <div className="HeadingTitle9">
                    <div></div>
                    <h2>Bank Details</h2>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Beneficiary Name*</label>
                        <input type="text" id="input1" placeholder="Beneficiary Name" />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Account Type*</label>
                        <select id="input2">
                        <option value="" disabled selected hidden>Select Account Type</option>
                            <option value="option1">Savings account</option>
                            <option value="option2">Current account</option>
                            <option value="option3">Fixed deposit account</option>
                        </select>
                    </div>
                </div>
                <div className="HostEvent_Row">
                <div className="HostEvent_Group">
                        <label htmlFor="input2">Bank Name*</label>
                        <select id="input2">
                        <option value="" disabled selected hidden>Select Bank Name</option>
                            <option value="option1">Axis Bank</option>
                            <option value="option2">HDFC Bank</option>
                            <option value="option3">State Bank Of India</option>
                        </select>
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Account Number*</label>
                        <input type="text" id="input2" placeholder="Account Number" />
                    </div>

                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Bank IFSC*</label>
                        <input type="text" id="input1" placeholder="Bank IFSC" />
                    </div>

                </div>
                {/* Two more similar rows for Heading 1 */}
            </div>
            {/* Two more similar headings */}
                      <div className="buttons-container">
                      <button type="submit" className="next_button">Next</button>
                      </div>
               </div>
       </form>
        )}
  
        {currentStep === 2 && (
           <form onSubmit={nextStep}>
                 <h2 className="step_from_css">Step 1</h2>
                <div className="HostEvent_container">
            <div className="HostEvent_Heading">
                <div className="HeadingTitle9">
                    <div></div>
                    <h2>Organisation Details</h2>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Event Title</label>
                        <input type="text" id="input1" placeholder="Organization / Individual Name" />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Event Date</label>
                        <input type="text" id="input2" placeholder="Organization/Individual PAN card number" />
                    </div>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Location of Event</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address" />
                    </div>
                </div>

                {/* Two more similar rows for Heading 1 */}
            </div>
            <div className="HostEvent_Heading">
      
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Event Category</label>
                        <input type="text" id="input1" placeholder="First Name" />
                    </div>
                 
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Start Event Date</label>
                        <input type="text" id="input1" placeholder="Phone Number" />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">End Event Date</label>
                        <input type="text" id="input2" placeholder="Email Address" />
                    </div>

                </div>
                {/* Two more similar rows for Heading 1 */}
            </div>
            <div className="HostEvent_Heading">
           
                <div className="HostEvent_Row">
                <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Description of Event</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address" />
                    </div>
                   
                </div>
                <div className="HostEvent_Row">
                <div className="HostEvent_Group">
                        <label htmlFor="input2">Will there be ticket sold ?</label>
                        <select id="input2">
                        <option value="" disabled selected hidden>Select Bank Name</option>
                            <option value="option1">Axis Bank</option>
                            <option value="option2">HDFC Bank</option>
                            <option value="option3">State Bank Of India</option>
                        </select>
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">if yes, then how much are tickets</label>
                        <input type="text" id="input2" placeholder="Account Number" />
                    </div>
                     

             
                </div>
                <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Upload Event Image</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address" />
                    </div>
                    <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Upload any Additional Files</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address" />
                    </div>
                <div className="HostEvent_Row">
                 

                </div>
                {/* Two more similar rows for Heading 1 */}
            </div>
            {/* Two more similar headings */}
            <div className="buttons-container">
                  <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                  <button type="submit" className="next_button">Next</button>
            </div>
        </div>
          </form>
        )}
  
        {currentStep === 3 && (
          <form onSubmit={handleSubmit}>
            <h2>Step 3</h2>
            <p>First Name: {formData.firstName}</p>
            <p>Last Name: {formData.lastName}</p>
            <p>Email: {formData.email}</p>
            <p>Password: {formData.password}</p>
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    );
  };

export default Event_hostPage;