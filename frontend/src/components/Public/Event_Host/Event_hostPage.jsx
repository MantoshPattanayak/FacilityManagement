
import { useState, useEffect } from "react";
import "./Event_HostPage.css"
// Axios for call the Api -----------------------------------------
import axiosHttpClient from "../../../utils/axios";
// Import Toast -------------------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const Event_hostPage = () => {
    // useSate for page -----------------------------------------------
    const [currentStep, setCurrentStep] = useState(1);
    // here set the error -------------------------------------------
    const [formErrors, setformErrors] = useState({});
    const [IsSubmit, setIsSubmit] = useState(false);
    // here get the Bank Name in drop down ---------------------------------
    const [GetbankName, setGetbankName] = useState([])
    const [EventType, setEventType] = useState([])
    // here useState for post the data -----------------------
    const [formData, setFormData] = useState({
        organisationName: "",
        organisationPanCardNumber: "",
        organisationAddress: "",
        // personal Details ------------------------------
        firstName: "",
        lastName: "",
        phoneNo: "",
        emailId: "",
        // Bank Details ------------------------------------
        beneficiaryName: "",
        accountType: "",
        bankName: "",
        accountNumber: "",
        bankIFSC: "",
        // 2nd step from -----------------------------------
        eventTitle: "",
        eventDate: "",
        locationofEvent: "",
        eventCategory: "",
        startEventDate: "",
        endEventDate: "",
        descriptionofEvent: "",
        ticketsold: "",
        numberofTicket: "",
        uploadeventImage: "",
        additionalFiles: "",
        price: ""


    });

    // handler for target the Name of Input field -------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setformErrors({ ...formErrors, [name]: '' });

    };
    // here Post the data ------------------------------------------------------------------------
    async function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validation(formData);
        const validationErrors1 = Step_2_Validation(formData)
        setformErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0 && Object.keys(validationErrors1).length === 0) {
            try {
                let res = await axiosHttpClient('Create_Host_event', 'post', {
                    // organisation Details -------------
                    organisationName: formData.organisationName,
                    organisationPanCardNumber: formData.organisationPanCardNumber,
                    organisationAddress: formData.organisationAddress,
                    // personal Details -------------------------
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phoneNo: formData.phoneNo,
                    emailId: formData.emailId,
                    // Bank Details -----------------
                    beneficiaryName: formData.beneficiaryName,
                    accountType: formData.accountType,
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber,
                    bankIFSC: formData.bankIFSC,
                    // 2nd from -----------------------------
                    eventTitle: formData.eventTitle,
                    eventDate: formData.eventDate,
                    locationofEvent: formData.locationofEvent,
                    eventCategory: formData.eventCategory,
                    startEventDate: formData.startEventDate,
                    endEventDate: formData.endEventDate,
                    descriptionofEvent: formData.descriptionofEvent,
                    ticketsold: formData.ticketsold,
                    numberofTicket: formData.numberofTicket,
                    price: formData.price,
                    uploadeventImage: formData.uploadeventImage || null,
                    additionalFiles: formData.additionalFiles || null
                });
                console.log(res);
                toast.success('Host Event created successfully.');
            } catch (err) {
                console.log(err);
                toast.error('Host Event failed. Please try again.');
                setformErrors('')
            }
        } else {
            setformErrors(validationErrors)
            setformErrors(validationErrors1)
        }
    }




    // here Prev and next page ---------------------------------------------------------------------
    const nextStep = (e) => {
        e.preventDefault();
        // Perform validation before moving to the next step
        const validationErrors = validation(formData);
        setformErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // If there are no validation errors, move to the next step
            setCurrentStep(currentStep + 1);
        } else {
            // If there are validation errors, display them and prevent moving to the next step
            console.log('Validation errors:', validationErrors);
        }
    };
    // 2nd from next step----------------------------------------------------------------------------
    const nextStep2 = (e) => {
        e.preventDefault();
        // Perform validation before moving to the next step
        const validationErrors1 = Step_2_Validation(formData);
        setformErrors(validationErrors1);
        if (Object.keys(validationErrors1).length === 0) {
            // If there are no validation errors, move to the next step
            setCurrentStep(currentStep + 1);
        } else {
            // If there are validation errors, display them and prevent moving to the next step
            console.log('Validation errors:', validationErrors1);
        }
    };
    // Prev (Button) --------------------------------------------------------------------------------
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // step-1(1nd Page Validation ) -------------------------------------------------------------------
    const validation = (value) => {
        const err = {}
        const nameRegex = /^[a-zA-Z\- ]+$/;
        const space_block = /^[^\s][^\n\r]*$/;
        const panCardRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        const Addres_reges = /^[a-zA-Z0-9.,\-/ ]+$/;
        const PHONE_NUMBER = /^[1-9]\d{9}$/;
        const EMAIL_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const Ac_No_regex = /^[0-9]{9,18}$/;

        const Bankifc = /^[A-Z]{4}[0-9]{1}[A-Z0-9]{6}$/
        if (!value.organisationName) {
            err.organisationName = "Organization / Individual Name is Required"
        } else if (!nameRegex.test(value.organisationName)) {
            err.organisationName = "Please enter valid Organisation Name "
        } else if (!space_block.test(value.organisationName)) {
            err.organisationName = 'Do not use spaces at beginning '
        }
        if (!value.organisationPanCardNumber) {
            err.organisationPanCardNumber = " organisation Pan-Card Number is Required"
        } else if (!panCardRegex.test(value.organisationPanCardNumber)) {
            err.organisationPanCardNumber = 'Invalid PAN Card number'
        } else if (!space_block.test(value.organisationPanCardNumber)) {
            err.organisationPanCardNumber = 'Do not use spaces at beginning '
        }
        if (!value.organisationAddress) {
            err.organisationAddress = "Organisation Address is Required"
        } else if (!Addres_reges.test(value.organisationAddress)) {
            err.organisationAddress = "Please enter valid Organization/Individual Address"
        } else if (!space_block.test(value.organisationAddress)) {
            err.organisationAddress = 'Do not use spaces at beginning '
        }
        if (!value.firstName) {
            err.firstName = "First Name is Required"
        } else if (!nameRegex.test(value.firstName)) {
            err.firstName = "Please enter valid first Name"
        } else if (!space_block.test(value.firstName)) {
            err.firstName = 'Do not use spaces at beginning '
        }
        if (!value.lastName) {
            err.lastName = "Last Name is Required"
        } else if (!nameRegex.test(value.lastName)) {
            err.lastName = "Please enter valid last Name"
        } else if (!space_block.test(value.lastName)) {
            err.lastName = 'Do not use spaces at beginning '
        }
        if (!value.phoneNo) {
            err.phoneNo = "Phone No is Required"
        } else if (!PHONE_NUMBER.test(value.phoneNo)) {
            err.phoneNo = 'Please enter valid phone No'
        } else if (!space_block.test(value.lastName)) {
            err.lastName = 'Do not use spaces at beginning '
        }
        if (!value.emailId) {
            err.emailId = "Email_ID is Required"
        } else if (!EMAIL_regex.test(value.emailId)) {
            err.emailId = "Please enter valid Email_ID"
        } else if (!space_block.test(value.emailId)) {
            err.emailId = 'Do not use spaces at beginning '
        }
        if (!value.beneficiaryName) {
            err.beneficiaryName = "Beneficiary Name is Required"
        } else if (!nameRegex.test(value.beneficiaryName)) {
            err.beneficiaryName = "Please enter valid Beneficiary Name"
        } else if (!space_block.test(value.beneficiaryName)) {
            err.beneficiaryName = 'Do not use spaces at beginning '
        }
        if (!value.accountType) {
            err.accountType = "Account Type is Required"
        }
        if (!value.bankName) {
            err.bankName = "Bank Name is Required"
        }
        if (!value.accountNumber) {
            err.accountNumber = "Account Number is Required"
        }
        else if (!space_block.test(value.accountNumber)) {
            err.accountNumber = 'Do not use spaces at beginning '
        }
        if (!value.bankIFSC) {
            err.bankIFSC = "Bank IFSC code is Required"
        } else if (!Bankifc.test(value.bankIFSC)) {
            err.bankIFSC = "Please enter valid Bank IFSC"
        }

        return err;
    }
    // step-2(2nd Page Validation ) -------------------------------------------------------------------
    const Step_2_Validation = (value) => {
        const err = {}
        const nameRegex = /^[a-zA-Z\- ]+$/;
        const space_block = /^[^\s][^\n\r]*$/;
        const price_regex = /^[0-9]+$/;
        if (!value.eventTitle) {
            err.eventTitle = "Event Title is Required"
        } else if (!nameRegex.test(value.eventTitle)) {
            err.eventTitle = "Please enter valid Event Title"
        } else if (!space_block.test(value.eventTitle)) {
            err.eventTitle = 'Do not use spaces at beginning '
        }
        if (!value.eventDate) {
            err.eventDate = "Event Date is Required"
        }
        if (!value.locationofEvent) {
            err.locationofEvent = "Location of Event is Required"
        } else if (!nameRegex.test(value.locationofEvent)) {
            err.locationofEvent = "Please enter valid Location of Event"
        } else if (!space_block.test(value.locationofEvent)) {
            err.locationofEvent = "Do not use spaces at beginning "
        }
        if (!value.eventCategory) {
            err.eventCategory = "Event Category is Required"
        }
        if (!value.startEventDate) {
            err.startEventDate = "Start Event Date is Required"
        }
        if (!value.endEventDate) {
            err.endEventDate = "End EventDate is Required"
        }
        if (!value.descriptionofEvent) {
            err.descriptionofEvent = "Description of Event is Required"
        } else if (!nameRegex.test(value.descriptionofEvent)) {
            err.descriptionofEvent = "Please enter valid Description of Event"
        } else if (!space_block.test(value.descriptionofEvent)) {
            err.descriptionofEvent = "Do not use spaces at beginning"
        }
        if (!value.ticketsold) {
            err.ticketsold = "Ticket Sold is Required"
        }
        if (!value.ticketsold || value.ticketsold == 'Yes') {
            if (!value.numberofTicket) {
                err.numberofTicket = "Number of Ticket is Required"
            } else if (!price_regex.test(value.numberofTicket)) {
                err.numberofTicket = "Please enter vaild Number of Ticket"
            } else if (!space_block.test(value.numberofTicket)) {
                err.numberofTicket = "Do not use spaces at beginning"
            }
            if (!value.price) {
                err.price = "Price is Required"
            } else if (!price_regex.test(value.price)) {
                err.price = "Please enter valid price"
            } else if (!space_block.test(value.price)) {
                err.price = "Do not use spaces at beginning"
            }
        }

        return err;
    }

    // here Get the Bank deatils In drop down -------------------------------------------------------
    async function GetBankDetails() {
        try {
            let res = await axiosHttpClient('Bank_details_Api', 'get')
            console.log('here Response', res)
            setGetbankName(res.data.bankServiceData)
            setEventType(res.data.eventCategoryData)
        }
        catch (err) {
            console.log("here err", err)
        }
    }
    // here Call/Update the data --------------------------------------------------------------------
    useEffect(() => {
        GetBankDetails()
    }, [])

    useEffect(() => {
        console.log('form Errors', formErrors);
    }, [formErrors]);


    // ---------------------------------------------- here Return Function ---------------------------------------------------------------
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
                                    <input type="text" className="input_padding" id="input1" placeholder="Organization / Individual Name" name="organisationName"
                                        onChange={handleChange}
                                        value={formData.organisationName}
                                    />
                                    {formErrors.organisationName && <p className="error text-red-700">{formErrors.organisationName}</p>}
                                </div>
                                <div className="HostEvent_Group">
                                    <label htmlFor="input2">Organization/Individual PAN card number*</label>
                                    <input type="text" id="input2" className="input_padding" placeholder="Organization/Individual PAN card number" name="organisationPanCardNumber"
                                        onChange={handleChange}
                                        value={formData.organisationPanCardNumber}
                                    />
                                    {formErrors.organisationPanCardNumber && <p className="error text-red-700">{formErrors.organisationPanCardNumber}</p>}
                                </div>
                            </div>
                            <div className="HostEvent_Row">
                                <div className="HostEvent_Group" id='AddressBox'>
                                    <label htmlFor="input1">Organization/Individual Address*</label>
                                    <input type="text" id="input1" className="input_padding" placeholder="Organization/Individual Address" name="organisationAddress"
                                        onChange={handleChange}
                                        value={formData.organisationAddress}
                                    />
                                    {formErrors.organisationAddress && <p className="error text-red-700">{formErrors.organisationAddress}</p>}
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
                                    <input type="text" id="input1" className="input_padding" placeholder="First Name" name="firstName"
                                        onChange={handleChange}
                                        value={formData.firstName}
                                    />
                                    {formErrors.firstName && <p className="error text-red-700">{formErrors.firstName}</p>}
                                </div>
                                <div className="HostEvent_Group">
                                    <label htmlFor="input2">Last Name*</label>
                                    <input type="text" id="input2" className="input_padding" placeholder="Last Name" name="lastName"
                                        onChange={handleChange}
                                        value={formData.lastName}
                                    />
                                    {formErrors.lastName && <p className="error text-red-700">{formErrors.lastName}</p>}
                                </div>
                            </div>
                            <div className="HostEvent_Row">
                                <div className="HostEvent_Group">
                                    <label htmlFor="input1">Phone Number*</label>
                                    <input type="text" id="input1" className="input_padding" placeholder="Phone Number" name="phoneNo"
                                        onChange={handleChange}
                                        value={formData.phoneNo}
                                    />
                                    {formErrors.phoneNo && <p className="error text-red-700">{formErrors.phoneNo}</p>}
                                </div>
                                <div className="HostEvent_Group">
                                    <label htmlFor="input2">Email Address*</label>
                                    <input type="text" id="input2" className="input_padding" placeholder="Email Address" name="emailId"
                                        onChange={handleChange}
                                        value={formData.emailId}
                                    />
                                    {formErrors.emailId && <p className="error text-red-700">{formErrors.emailId}</p>}
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
                                    <input type="text" id="input1" className="input_padding" placeholder="Beneficiary Name" name="beneficiaryName"
                                        onChange={handleChange}
                                        value={formData.beneficiaryName}
                                    />
                                    {formErrors.beneficiaryName && <p className="error text-red-700">{formErrors.beneficiaryName}</p>}
                                </div>
                                <div className="HostEvent_Group">
                                    <label htmlFor="input2" >Account Type*</label>
                                    <select id="input2" className="input_padding" name="accountType"
                                        onChange={handleChange}
                                        value={formData.accountType}
                                    >
                                        <option value="" disabled selected hidden>Select Account Type</option>
                                        <option value="option1">Savings account</option>
                                        <option value="option2">Current account</option>

                                    </select>
                                    {formErrors.accountType && <p className="error text-red-700">{formErrors.accountType}</p>}
                                </div>
                            </div>
                            <div className="HostEvent_Row">
                                <div className="HostEvent_Group">
                                    <label htmlFor="input2">Bank Name*</label>
                                    <select id="input2" className="input_padding" name="bankName"
                                        onChange={handleChange}
                                        value={formData.bankName}
                                    >
                                        <option value="" disabled selected hidden>Select Bank Name</option>
                                        {GetbankName?.length > 0 && GetbankName?.map((Bankname, index) => {
                                            return (
                                                <option key={index} value={Bankname.id}>
                                                    {Bankname.bankName}

                                                </option>
                                            )

                                        })}

                                    </select>
                                    {formErrors.bankName && <p className="error text-red-700">{formErrors.bankName}</p>}
                                </div>
                                <div className="HostEvent_Group">
                                    <label htmlFor="input2">Account Number*</label>
                                    <input type="text" id="input2" className="input_padding" placeholder="Account Number" name="accountNumber"
                                        onChange={handleChange}
                                        value={formData.accountNumber}
                                    />
                                    {formErrors.accountNumber && <p className="error text-red-700">{formErrors.accountNumber}</p>}
                                </div>

                            </div>
                            <div className="HostEvent_Row">
                                <div className="HostEvent_Group">
                                    <label htmlFor="input1">Bank IFSC*</label>
                                    <input type="text" id="input1" className="input_padding" placeholder="Bank IFSC" name="bankIFSC"
                                        onChange={handleChange}
                                        value={formData.bankIFSC}
                                    />
                                    {formErrors.bankIFSC && <p className="error text-red-700">{formErrors.bankIFSC}</p>}
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
            {/*------------------------------------------------------- 2nd Step from ----------------------------------------------------------- */}
            {currentStep === 2 && (
                <form onSubmit={nextStep2}>
                    <h2 className="step_from_css">Step 2</h2>
                    <div className="HostEvent_container">
                        <div className="HostEvent_Heading">
                            <div className="HeadingTitle9">
                                <div></div>
                                <h2>Organisation Details</h2>
                            </div>
                            <div className="HostEvent_Row">
                                <div className="HostEvent_Group">
                                    <label htmlFor="input1">Event Title</label>
                                    <input type="text" id="input1" className="input_padding" placeholder="Organization / Individual Name"
                                        name="eventTitle"
                                        value={formData.eventTitle}
                                        onChange={handleChange}
                                    />
                                    {formErrors.eventTitle && <p className="error text-red-700">{formErrors.eventTitle}</p>}

                                </div>
                                <div className="HostEvent_Group">
                                    <label htmlFor="input2">Event Date</label>
                                    <input type="date" id="input2" className="input_padding" placeholder="Organization/Individual PAN card number"
                                        name="eventDate"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                    />
                                    {formErrors.eventDate && <p className="error text-red-700">{formErrors.eventDate}</p>}
                                </div>
                            </div>
                            <div className="HostEvent_Row">
                                <div className="HostEvent_Group" id='AddressBox'>
                                    <label htmlFor="input1">Location of Event</label>
                                    <input type="text" id="input1" className="input_padding" placeholder="Organization/Individual Address"
                                        name="locationofEvent"
                                        value={formData.locationofEvent}
                                        onChange={handleChange}
                                    />
                                    {formErrors.locationofEvent && <p className="error text-red-700">{formErrors.locationofEvent}</p>}
                                </div>
                            </div>

                            {/* Two more similar rows for Heading 1 */}
                        </div>
                        <div className="HostEvent_Heading">

                            <div className="HostEvent_Group">
                                <label htmlFor="input2">Event Category*</label>
                                <select id="input2"
                                    name="eventCategory"
                                    className="input_padding"
                                    value={formData.eventCategory}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled selected hidden>Select Event Category</option>
                                    {EventType?.length > 0 && EventType?.map((event, index) => {
                                        return (
                                            <option key={index} value={event.eventCategoryId}>
                                                {event.eventType}

                                            </option>
                                        )

                                    })}

                                </select>
                                {formErrors.eventCategory && <p className="error text-red-700">{formErrors.eventCategory}</p>}
                            </div>
                            <div className="HostEvent_Row">
                                <div className="HostEvent_Group">
                                    <label htmlFor="input1">Start Event Date</label>
                                    <input type="date" id="input1" className="input_padding" placeholder="Phone Number"
                                        name="startEventDate"
                                        value={formData.startEventDate}
                                        onChange={handleChange}
                                    />
                                    {formErrors.startEventDate && <p className="error text-red-700">{formErrors.startEventDate}</p>}
                                </div>
                                <div className="HostEvent_Group">
                                    <label htmlFor="input2">End Event Date</label>
                                    <input type="date" id="input2" className="input_padding" placeholder="Email Address"
                                        name="endEventDate"
                                        value={formData.endEventDate}
                                        onChange={handleChange}
                                    />
                                    {formErrors.endEventDate && <p className="error text-red-700">{formErrors.endEventDate}</p>}
                                </div>

                            </div>
                            {/* Two more similar rows for Heading 1 */}
                        </div>
                        <div className="HostEvent_Heading">

                            <div className="HostEvent_Row">
                                <div className="HostEvent_Group" id='AddressBox'>
                                    <label htmlFor="input1">Description of Event</label>
                                    <input type="text" id="input1" className="input_padding" placeholder="Organization/Individual Address"
                                        name="descriptionofEvent"
                                        value={formData.descriptionofEvent}
                                        onChange={handleChange}
                                    />
                                    {formErrors.descriptionofEvent && <p className="error text-red-700">{formErrors.descriptionofEvent}</p>}
                                </div>

                            </div>
                            <div className="HostEvent_Row">
                                <div className="HostEvent_Group">
                                    <label htmlFor="input2">Will there be ticket sold ?</label>
                                    <select id="input2"
                                        name="ticketsold"
                                        className="input_padding"
                                        value={formData.ticketsold}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled selected hidden>Select Bank Name</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>

                                    </select>
                                    {formErrors.ticketsold && <p className="error text-red-700">{formErrors.ticketsold}</p>}
                                </div>

                                {formData.ticketsold == 'No' ? null : (
                                    <>

                                        <div className="HostEvent_Group1 ">
                                            <label htmlFor="input2">No of tickets</label>
                                            <input type="text" id="No_ticket" className="input_padding" placeholder="Account Number"
                                                name="numberofTicket"
                                                value={formData.numberofTicket}
                                                onChange={handleChange}
                                                disabled={formData.ticketsold === "No"}
                                            />
                                            {formErrors.numberofTicket && <p className="error text-red-700">{formErrors.numberofTicket}</p>}
                                        </div>
                                        <div className="HostEvent_Group1">
                                            <label htmlFor="input2">price</label>
                                            <input type="text" id="price1" className="input_padding" placeholder="Account Number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                disabled={formData.ticketsold === "No"}
                                            />
                                            {formErrors.price && <p className="error text-red-700">{formErrors.price}</p>}
                                        </div>

                                    </>
                                )}




                            </div>
                            <div className="HostEvent_Group" id='AddressBox'>
                                <label htmlFor="input1">Upload Event Image</label>
                                <input type="text" id="input1" className="input_padding" placeholder="Organization/Individual Address"
                                    name="uploadeventImage"
                                    value={formData.uploadeventImage}
                                    onChange={handleChange}
                                />

                            </div>
                            <div className="HostEvent_Group" id='AddressBox'>
                                <label htmlFor="input1">Upload any Additional Files</label>
                                <input type="text" id="input1" className="input_padding" placeholder="Organization/Individual Address"
                                    name="additionalFiles"
                                    value={formData.additionalFiles}
                                    onChange={handleChange}
                                />
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
            {/*           ----------------------------------- step-3 (show the data and Submit--------------------------------------------------------------------------------------------) */}
            {currentStep === 3 && (
                <div class="container-form">
                <form onSubmit={handleSubmit} className="form-data">
                    <h2>Step 3</h2>
                    <p>First Name: {formData.organisationName}</p>
                    <p>Last Name: {formData.organisationPanCardNumber}</p>
                    <p>Email: {formData.organisationAddress}</p>
                    <p>Password: {formData.firstName}</p>
                    <p>Last Name: {formData.lastName}</p>
                    <p>Phone Number: {formData.phoneNo}</p>
                    <p>Email Id: {formData.emailId}</p>
                    <p>Benificiary Name: {formData.beneficiaryName}</p>
                    <p>Account Type: {formData.accountType}</p>
                    <p>Bank Name: {formData.bankName}</p>
                    <p>Account Number: {formData.accountNumber}</p>
                    <p>BankIFSC: {formData.bankIFSC}</p>
                    <p>Event Title: {formData.eventTitle}</p>
                    <p>Event Date: {formData.eventDate}</p>
                    <p>Location of Event: {formData.locationofEvent}</p>
                    <p>Event Catagory: {formData.eventCategory}</p>
                    <p>Start Event Date: {formData.startEventDate}</p>
                    <p>End Event Date: {formData.endEventDate}</p>
                    <p>Description Of Event: {formData.descriptionofEvent}</p>
                    <p>Ticket Sold: {formData.ticketsold}</p>
                    <p>Number Of Ticket: {formData.numberofTicket}</p>
                    <p>Upload Event Image: {formData.uploadeventImage}</p>
                    <p>Additional Files: {formData.additionalFiles}</p>


                    <button type="button" onClick={prevStep}>Previous</button>
                    <button type="submit">Submit</button>
                </form>
                </div>
            )}

            {/* ---------------------------------------------------here Toast Libary-------------------------------------- */}
            <ToastContainer />
        </div>
    );
};

export default Event_hostPage;