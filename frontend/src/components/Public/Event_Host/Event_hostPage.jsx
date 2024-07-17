
import { useState, useEffect } from "react";
import "./Event_HostPage.css"
// Axios for call the Api -----------------------------------------
import axiosHttpClient from "../../../utils/axios";
// import header
import PublicHeader from "../../../common/PublicHeader";
// Import Toast -------------------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import verfiy_img from "../../../assets/verify_img.png"

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
        price: "",
        uploadEventImage: {
            data: null,
            name: ""
        },
        additionalFiles: new Array()
    });

    // handler for target the Name of Input field -------------------------------------------------
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        switch (name) {
            case "uploadEventImage":
                let file = files[0];
                console.log('file name', files);
                if (parseInt(file.size / 1024) <= 200) {
                    const reader = new FileReader();

                    reader.onloadend = () => {
                        setFormData({ 
                            ...formData, 
                            [name]: {
                                data: reader.result,
                                name: file.name
                            } 
                        });
                    };

                    reader.readAsDataURL(file);
                }
                else {
                    alert("Kindly choose an image with size less than 200 KB.");
                    document.getElementById("myForm_files").reset();
                }
                break;
            case "additionalFiles":
                let filesData = formData.additionalFiles;
                console.log('filesData', filesData);
                // Check if number of files exceeds the limit
                if (files.length + formData.additionalFiles.length > 3) {
                    alert("You can only upload a maximum of 3 files.");

                    return;
                }

                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    if (parseInt(file.size / 1024) <= 400) { // Checking for 400KB
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            filesData.push({
                                data:reader.result,
                                name: file.name
                            });
                            // If all files are read, update form data
                            if (filesData.length === files.length) {
                                setFormData({ ...formData, [name]: filesData });
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        alert("Kindly choose images with size less than 200 KB.");
                        // Reset the form if any file exceeds size limit
                        document.getElementById("myForm_files").reset();
                        return; // Stop further processing
                    }
                }
                break;
            default:
                console.log("from data", formData)
                setFormData({ ...formData, [name]: value });
                setformErrors({ ...formErrors, [name]: '' });
                break;
        }
        console.log('form data', formData);
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
                    uploadEventImage: formData.uploadEventImage.data || null,
                    additionalFiles: formData.additionalFiles.map((file) => { return file.data }) || null
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
        const nameRegex = /^[a-zA-Z0-9,.!?'"()\s]*$/;
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
        } else if (!nameRegex.test(value.organisationAddress)) {
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
        const nameRegex = /^[a-zA-Z0-9,.!?'"()\s]*$/;
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
        // here check start Date should less then or equal to enddata
        if (new Date(value.startEventDate) > new Date(value.endEventDate)) {
            err.startEventDate = "Start Event Date should be less than or equal to End Event Date";
            err.endEventDate = "End Event Date should be greater than or equal to Start Event Date";
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
        if (!value.uploadEventImage) {
            err.uploadEventImage = "Upload Event Image is required"
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
    }, [formErrors])




    // ---------------------------------------------- here Return Function ---------------------------------------------------------------
    return (
        <div>
            <PublicHeader />
            <div className="all_From_conatiner">
                {currentStep === 1 && (

                    <form onSubmit={nextStep} className="event-host_1st_Page">

                        <div className="HostEvent_container">

                            <div className="HostEvent_Heading">
                                <h1 className="verify_name_text">Step-1 (Organisation Details)</h1>
                                <div className="HeadingTitle9">
                                    <div></div>
                                    <h2>Organisation Details</h2>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Organization / Individual Name <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" className="input_padding" id="input1" placeholder=" Please Enter the Organization / Individual Name" name="organisationName"
                                            onChange={handleChange}
                                            value={formData.organisationName}
                                        />
                                        {formErrors.organisationName && <p className="error text-red-700">{formErrors.organisationName}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Organization/Individual PAN card number <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder=" Please Enter the Organization/Individual PAN card number" name="organisationPanCardNumber"
                                            onChange={handleChange}
                                            value={formData.organisationPanCardNumber}
                                        />
                                        {formErrors.organisationPanCardNumber && <p className="error text-red-700">{formErrors.organisationPanCardNumber}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Organization/Individual Address <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Please Enter the Organization/Individual Address" name="organisationAddress"
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
                                        <label htmlFor="input1">First Name <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Please Enter First Name" name="firstName"
                                            onChange={handleChange}
                                            value={formData.firstName}
                                        />
                                        {formErrors.firstName && <p className="error text-red-700">{formErrors.firstName}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Last Name <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Please Enter Last Name" name="lastName"
                                            onChange={handleChange}
                                            value={formData.lastName}
                                        />
                                        {formErrors.lastName && <p className="error text-red-700">{formErrors.lastName}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Phone Number <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Please Enter Phone Number" name="phoneNo"
                                            onChange={handleChange}
                                            value={formData.phoneNo}
                                        />
                                        {formErrors.phoneNo && <p className="error text-red-700">{formErrors.phoneNo}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Email Address <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Please Enter Email Address" name="emailId"
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
                                        <label htmlFor="input1">Beneficiary Name <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Please Enter Beneficiary Name" name="beneficiaryName"
                                            onChange={handleChange}
                                            value={formData.beneficiaryName}
                                        />
                                        {formErrors.beneficiaryName && <p className="error text-red-700">{formErrors.beneficiaryName}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Account Type <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <select id="input2" className="input_padding" name="accountType"
                                            onChange={handleChange}
                                            value={formData.accountType}
                                        >
                                            <option value="" disabled>Select Account Type</option>
                                            <option value="Savings account">Savings account</option>
                                            <option value="Current account">Current account</option>
                                        </select>
                                        {formErrors.accountType && <p className="error text-red-700">{formErrors.accountType}</p>}
                                    </div>

                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Bank Name <span className="text-red-600 font-bold text-xl">*</span></label>
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
                                        <label htmlFor="input2">Account Number <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Plase Enter Account Number" name="accountNumber"
                                            onChange={handleChange}
                                            value={formData.accountNumber}
                                        />
                                        {formErrors.accountNumber && <p className="error text-red-700">{formErrors.accountNumber}</p>}
                                    </div>

                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Bank IFSC <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Please Enter Bank IFSC" name="bankIFSC"
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
                                <button type="submit" className="next_button1">Next</button>
                            </div>
                        </div>
                    </form>
                )}
                {/*------------------------------------------------------- 2nd Step from ----------------------------------------------------------- */}
                {currentStep === 2 && (
                    <form onSubmit={nextStep2}>

                        <div className="HostEvent_container">
                            <div className="HostEvent_Heading">
                                <h1 className="verify_name_text">Step-2 (Event Details)</h1>
                                <div className="HeadingTitle9">
                                    <div></div>
                                    <h2>Organisation Details</h2>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Event Title <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Please Enter Event Title"
                                            name="eventTitle"
                                            value={formData.eventTitle}
                                            onChange={handleChange}
                                        />
                                        {formErrors.eventTitle && <p className="error text-red-700">{formErrors.eventTitle}</p>}

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Event Date <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="date" id="input2" className="input_padding" placeholder="Please Enter the Organization/Individual PAN card number"
                                            name="eventDate"
                                            value={formData.eventDate}
                                            onChange={handleChange}
                                        />
                                        {formErrors.eventDate && <p className="error text-red-700">{formErrors.eventDate}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Location of Event <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Plase Enter the Location of Event"
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
                                    <label htmlFor="input2">Event Category<span className="text-red-600 font-bold text-xl">*</span></label>
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
                                                    {event.eventCategoryName}
                                                </option>
                                            )

                                        })}

                                    </select>
                                    {formErrors.eventCategory && <p className="error text-red-700">{formErrors.eventCategory}</p>}
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Start Event Time & Date  <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="datetime-local" id="input1" className="input_padding" placeholder="Please Enter Phone Number"
                                            name="startEventDate"
                                            value={formData.startEventDate}
                                            onChange={handleChange}
                                        />
                                        {formErrors.startEventDate && <p className="error text-red-700">{formErrors.startEventDate}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">End Event Time & Date <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="datetime-local" id="input2" className="input_padding" placeholder="Please Enter Email Address"
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
                                        <label htmlFor="input1">Description of Event <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Please Enter the Description of Event"
                                            name="descriptionofEvent"
                                            value={formData.descriptionofEvent}
                                            onChange={handleChange}
                                        />
                                        {formErrors.descriptionofEvent && <p className="error text-red-700">{formErrors.descriptionofEvent}</p>}
                                    </div>

                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Will there be ticket sold ? <span className="text-red-600 font-bold text-xl">*</span></label>
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
                                                <label htmlFor="input2">Number of tickets <span className="text-red-600 font-bold text-xl">*</span></label>
                                                <input type="text" id="No_ticket" className="input_padding" placeholder="Please Enter Number of tickets"
                                                    name="numberofTicket"
                                                    value={formData.numberofTicket}
                                                    onChange={handleChange}
                                                    disabled={formData.ticketsold === "No"}
                                                />
                                                {formErrors.numberofTicket && <p className="error text-red-700">{formErrors.numberofTicket}</p>}
                                            </div>
                                            <div className="HostEvent_Group1">
                                                <label htmlFor="input2">price <span className="text-red-600 font-bold text-xl">*</span></label>
                                                <input type="text" id="price1" className="input_padding" placeholder="Please Enter price "
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
                                {/*----------------------------- here Upload Event Image ---------------------------- */}
                                <div className="HostEvent_Group" id='AddressBox'>
                                    <label htmlFor="input1">Upload Event Image <span className="text-red-600 font-bold text-xl">*</span></label>
                                    <form id="myForm" className="m-0">
                                        <input
                                            className="form-input"
                                            id="uploadEventImage"
                                            name="uploadEventImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                        <p className="italic text-sm font-bold text-gray-500">
                                            Max. image file size is 200KB.
                                        </p>
                                    </form>

                                    {/* <p className="italic text-sm font-bold text-gray-500">
                                        Max. image or PDF file size is 200KB.
                                    </p> */}
                                    {formErrors.uploadEventImage && <p className="error text-red-700">{formErrors.uploadEventImage}</p>}
                                    {/* here Upload */}
                                    {formData.uploadEventImage && (
                                        <div
                                            onClick={(e) => {

                                                setFormData({
                                                    ...formData,
                                                    ["uploadEventImage"]: null,
                                                });
                                                document.getElementById("myForm").reset();
                                            }}

                                        >

                                        </div>
                                    )}

                                </div>
                                <div className="HostEvent_Group" id='AddressBox'>

                                </div>
                                {/*----------------------------- here Upload Additional Files ---------------------------- */}

                                <div className="HostEvent_Group" id='AddressBox'>
                                    <label htmlFor="input1">Upload Additional Files <span className="text-red-600 font-bold text-xl">*</span></label>
                                    <form id="myForm_files" className="m-0">
                                        <input
                                            className="form-input"
                                            id="additionalFiles"
                                            name="additionalFiles"
                                            type="file"
                                            accept="file/*"
                                            multiple
                                            onChange={handleChange}
                                        />
                                        <p className="italic text-sm font-bold text-gray-500">
                                            Max. image file size is 200KB.
                                        </p>
                                    </form>

                                    {/* <p className="italic text-sm font-bold text-gray-500">
                                        Max. image or PDF file size is 200KB.
                                    </p> */}

                                    {/* here Upload */}
                                    {formData.additionalFiles && formData.additionalFiles.length > 0 && (
                                        <div
                                            onClick={(e) => {

                                                setFormData({
                                                    ...formData,
                                                    ["additionalFiles"]: null,
                                                });
                                                document.getElementById("myForm_files").reset();
                                            }}
                                            id="ownerPhotoRemove"
                                            className="block"
                                        >

                                        </div>

                                    )}

                                </div>

                            </div>
                            {/* Two more similar headings */}
                            <div className="buttons-container">
                                <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                                <button type="submit" className="next_button1">Next</button>
                            </div>
                        </div>
                    </form>
                )}
                {/*           ----------------------------------- step-3 (show the data and Submit--------------------------------------------------------------------------------------------) */}
                {currentStep === 3 && (
                    <form onSubmit={handleSubmit}>
                        <div className="HostEvent_container">

                            <div className="HostEvent_Heading">
                                <span className="img_verify_text_container">
                                    <h1 className="verify_name_text">Verify Your Details</h1>
                                    <img className="h-12" src={verfiy_img}></img>
                                </span>

                                <div className="HeadingTitle9">
                                    <div></div>
                                    <h2>Organisation Details</h2>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Organization / Individual Name*</label>
                                        <input type="text" className="input_padding" id="input1" placeholder="Organization / Individual Name" name="organisationName"

                                            value={formData.organisationName}
                                            disabled
                                        />

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Organization/Individual PAN card number*</label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Organization/Individual PAN card number" name="organisationPanCardNumber"

                                            value={formData.organisationPanCardNumber}
                                            disabled
                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Organization/Individual Address*</label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Organization/Individual Address" name="organisationAddress"

                                            value={formData.organisationAddress}
                                            disabled
                                        />

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

                                            value={formData.firstName}
                                            disabled
                                        />

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Last Name*</label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Last Name" name="lastName"

                                            value={formData.lastName}
                                            disabled
                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Phone Number*</label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Phone Number" name="phoneNo"
                                            maxLength={10}
                                            value={formData.phoneNo}
                                            disabled
                                        />

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Email Address*</label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Email Address" name="emailId"

                                            value={formData.emailId}
                                            disabled
                                        />

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

                                            value={formData.beneficiaryName}
                                            disabled
                                        />

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2" >Account Type*</label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Beneficiary Name" name="beneficiaryName"
                                            value={formData.accountType}
                                            disabled
                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Bank Name*</label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Beneficiary Name" name="beneficiaryName"
                                            value={formData.bankName}
                                            disabled
                                        />

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Account Number*</label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Account Number" name="accountNumber"

                                            value={formData.accountNumber}
                                            disabled
                                        />

                                    </div>

                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Bank IFSC*</label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Bank IFSC" name="bankIFSC"

                                            value={formData.bankIFSC}
                                            disabled
                                        />

                                    </div>

                                </div>
                                {/* Two more similar rows for Heading 1 */}
                            </div>

                        </div>
                        {/* ----------------------------------------2nd from ------------------------------------------------ */}
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
                                            disabled

                                        />


                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Event Date</label>
                                        <input type="date" id="input2" className="input_padding" placeholder="Organization/Individual PAN card number"
                                            name="eventDate"
                                            value={formData.eventDate}
                                            disabled

                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Location of Event</label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Organization/Individual Address"
                                            name="locationofEvent"
                                            value={formData.locationofEvent}
                                            disabled

                                        />

                                    </div>
                                </div>

                                {/* Two more similar rows for Heading 1 */}
                            </div>
                            <div className="HostEvent_Heading">

                                <div className="HostEvent_Group">
                                    <label htmlFor="input2">Event Category*</label>
                                    <input type="text" id="input1" className="input_padding" placeholder="Organization/Individual Address"
                                        name="locationofEvent"
                                        value={formData.eventCategory}
                                        disabled

                                    />

                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Start Event Date</label>
                                        <input type="date" id="input1" className="input_padding" placeholder="Phone Number"
                                            name="startEventDate"
                                            value={formData.startEventDate}
                                            disabled

                                        />

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">End Event Date</label>
                                        <input type="date" id="input2" className="input_padding" placeholder="Email Address"
                                            name="endEventDate"
                                            value={formData.endEventDate}
                                            disabled

                                        />

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
                                            disabled

                                        />

                                    </div>

                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Will there be ticket sold ?</label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Organization/Individual Address"
                                            name="descriptionofEvent"
                                            value={formData.ticketsold}
                                            disabled

                                        />

                                    </div>




                                    <div className="HostEvent_Group1 ">
                                        <label htmlFor="input2">No of tickets</label>
                                        <input type="text" id="No_ticket" className="input_padding" placeholder="Account Number"
                                            name="numberofTicket"
                                            value={formData.numberofTicket}
                                            disabled

                                        />

                                    </div>
                                    <div className="HostEvent_Group1">
                                        <label htmlFor="input2">price</label>
                                        <input type="text" id="price1" className="input_padding" placeholder="Account Number"
                                            name="price"
                                            value={formData.price}
                                            disabled

                                        />

                                    </div>






                                </div>
                                <div className="HostEvent_Group" id='AddressBox'>
                                    <label htmlFor="input1">Upload Event Image</label>
                                    <input type="text" id="input1" className="input_padding" placeholder="Event image"
                                        name="uploadeventImage"
                                        value={formData.uploadEventImage.name}
                                        disabled

                                    />

                                </div>
                                <div className="HostEvent_Group" id='AddressBox'>
                                    <label htmlFor="input1">Upload any Additional Files</label>
                                    <input type="text" id="input1" className="input_padding" placeholder="Additional files"
                                        name="additionalFiles"
                                        value={[...formData.additionalFiles.map((file) => { return file.name})].toString()}
                                        disabled

                                    />
                                </div>

                                {/* Two more similar rows for Heading 1 */}
                            </div>
                            <div className="buttons-container">
                                <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                                <button type="submit" className="next_button1">Submit</button>
                            </div>
                        </div>

                    </form>
                )}
            </div>
            {/* ---------------------------------------------------here Toast Libary-------------------------------------- */}
            <ToastContainer />
         
        </div>
         
    );
};

export default Event_hostPage;