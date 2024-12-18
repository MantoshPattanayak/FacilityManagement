import './HostEvent.css'
const HostEvent = () => {
    return (
    <div>
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
                <button className="approve-button">Proceed</button>
            </div>
        </div>
    </div>
    )
}
export default HostEvent;
