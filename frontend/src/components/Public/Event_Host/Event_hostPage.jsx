
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
import { useNavigate } from "react-router-dom";
import RazorpayButton from "../../../common/RazorpayButton";
import { encryptData } from "../../../utils/encryptData";

const Event_hostPage = () => {
    // useSate for page -----------------------------------------------
    const [currentStep, setCurrentStep] = useState(1);
    // here set the error -------------------------------------------
    const [formErrors, setformErrors] = useState({});
    const navigate = useNavigate();
    // here get the Bank Name in drop down ---------------------------------
    const [GetbankName, setGetbankName] = useState([])
    const [EventType, setEventType] = useState([])
    const [GetFacility, setGetFacility] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredEventTypes, setFilteredEventTypes] = useState([]);
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
            uploadEventImage: null,
            additionalFiles: new Array(),
            facilityId: null,
            amount:'5000'
        
        

    });

    // handler for target the Name of Input field -------------------------------------------------
    const handleChange = (e) => {
        const { name, files, value } = e.target;
        // Check if files is defined before accessing its properties
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            console.log("file array", fileArray)
            switch (name) {

                case "uploadImage":
                    // find Total Image user can Upload ....
                    const totalUploadedImages = formData.additionalFiles.length + fileArray.length;
                    console.log("here total image", totalUploadedImages)
                    if (totalUploadedImages > 5 || (formData.uploadEventImage && totalUploadedImages) >= 6) {
                        alert("You can only upload a maximum of 1 primary image and 5 additional images.");
                        document.getElementById("myForm").reset();
                        return;
                    }
                    const [firstFile, ...otherFiles] = fileArray;
                    if (firstFile) {
                        if (parseInt(firstFile.size / 1024) <= 200) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const primaryImage = {
                                    data: reader.result,
                                    name: firstFile.name
                                };
                                let updatedAdditionalFiles = [...formData.additionalFiles];
                                // Move the previous primary image to additional files
                                if (formData.uploadEventImage) {
                                    updatedAdditionalFiles = [formData.uploadEventImage, ...updatedAdditionalFiles];
                                }
                                // Process additional files
                                const additionalImages = otherFiles.map(file => {
                                    if (parseInt(file.size / 1024) <= 400) {
                                        return {
                                            data: URL.createObjectURL(file),
                                            name: file.name
                                        };
                                    } else {
                                        alert("Additional images must be less than 400 KB.");
                                        document.getElementById("myForm").reset();
                                        return null; // Prevent processing further
                                    }
                                }).filter(file => file !== null); // Filter out null values
                                console.log('additionalImages', additionalImages)
                                // Combine previous additional files with new ones
                                updatedAdditionalFiles = [...updatedAdditionalFiles, ...additionalImages].slice(0, 4);
                                setFormData({
                                    ...formData,
                                    uploadEventImage: primaryImage,
                                    additionalFiles: updatedAdditionalFiles,
                                });
                            };
                            reader.readAsDataURL(firstFile);
                        } else {
                            alert("The primary image must be less than 200 KB.");
                            document.getElementById("myForm").reset();
                        }
                    }
                    break;

                default:
                    // Handle text input changes
                    if (name.startsWith('textField')) {
                        setFormData({ ...formData, [name]: value });
                    } else {
                        console.log("Unsupported file input");
                    }
                    break;
            }
        } else {
            // Handle text input changes
            setFormData({ ...formData, [name]: value });
            setformErrors({ ...formErrors, [name]: '' });
        }
    };
    // here Remove the image -----
    const handleRemoveImage = (e, index, type) => {
        e.preventDefault()
        if (type === "primary") {
            setFormData((prevState) => ({
                ...prevState,
                uploadEventImage: null, // Remove primary image
            }));
        } else if (type === "secondary") {
            setFormData((prevState) => ({
                ...prevState,
                additionalFiles: prevState.additionalFiles.filter((_, i) => i !== index), // Remove specific secondary image
            }));
        } else {
            setformErrors({ ...formErrors, [name]: '' });
        }
    };


    // here Post the data ------------------------------------------------------------------------
    async function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validation(formData);
        const validationErrors1 = Step_2_Validation(formData)
        setformErrors(validationErrors);
        setformErrors(validationErrors1);
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
                    ticketsold: formData.ticketsold || null,
                    numberofTicket: formData.numberofTicket || null,
                    price: formData.price || null,
                    uploadEventImage: formData.uploadEventImage.data || null,
                    additionalFiles: formData.additionalFiles.map((file) => { return file.data }) || null,
                    facilityId: formData.facilityId
                });
                console.log(res);
                toast.success('Host Event created successfully.', {
                    onClose: () => {
                        setTimeout(() => {
                            navigate('/');
                        }, 1000)
                    }
                });
            } catch (err) {
                console.log(err);
                toast.error(err.response.data.message);
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
        console.log("here vaildation error", validationErrors1)
        if (Object.keys(validationErrors1).length === 0) {
            // If there are no validation errors, move to the next step
            setCurrentStep(currentStep + 1);
        } else {
            // If there are validation errors, display them and prevent moving to the next step
            console.log('Validation errors:', validationErrors1);
        }
    };
    const nextStep3 = (e) => {
        e.preventDefault()
        setCurrentStep(currentStep + 1);

    }
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
        if (!value.uploadEventImage) {
            err.uploadEventImage = "Primary image is Required"
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
        if (value.ticketsold === '1') {
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
    /// here set the initail data of facility Type --------------------------------
    async function GetFacilityType() {
        try {
            let res = await axiosHttpClient('Get_initail_Data_Facility_Type', 'post', {

            })
            console.log("here Response of get facilityn type data", res)
            setGetFacility(res.data.faciltyData)
            setEventType(res.data.data)
        }
        catch (err) {
            console.log(" here Response of err", err)
        }
    }
    // search fun ---------------------------
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredOptions(GetFacility);
        } else {
            setFilteredOptions(
                GetFacility.filter((facility) =>
                    facility.facilityname.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, GetFacility]);
    // here change input of facility Type --------------------
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setIsDropdownOpen(true);
    };
    // here set the handleOption   and  Set both facilityId and facilityName in form data
    const handleOptionSelect = (facilityId, facilityname, address) => {
        console.log({ facilityId, facilityname, address });
        setFormData({ ...formData, facilityId, facilityName: facilityname, locationofEvent: address });
        setSearchTerm(facilityname);
        setIsDropdownOpen(false);
        filterEventTypes(facilityId);
    };
    // filter the  Event Type accoding to facilityId-------------------
    const filterEventTypes = (facilityId) => {
        const filtered = EventType.filter(event => event.facilityId === facilityId);
        setFilteredEventTypes(filtered);
    };

    // here Get the Bank deatils In drop down -------------------------------------------------------
    async function GetBankDetails() {
        try {
            let res = await axiosHttpClient('Bank_details_Api', 'get')
            console.log('here Response of get initial ', res)
            setGetbankName(res.data.bankServiceData)
        }
        catch (err) {
            console.log("here err", err)
        }
    }
    // here Call/Update the data --------------------------------------------------------------------
    useEffect(() => {
        GetBankDetails()
        GetFacilityType()
    }, [formErrors])

    // handle payment success
    const handlePaymentSuccess = ({ response, res }) => {
        // console.log("Book park payment success", response);
        console.log("booking response", res);
        let bookingId = res.data.shareableLink[0].bookingId;
        let entityTypeId = res.data.shareableLink[0].entityTypeId;
        console.log("here entityty id", entityTypeId)
    
        toast.success("Event host Request has been Submitted successfully.", {
          autoClose: 2000,
          onClose: () => {
            setTimeout(() => {
              navigate(
                `/profile/booking-details/ticket?bookingId=${encryptData(
                  bookingId
                )}&typeId=${encryptData(entityTypeId)}`
              );
            }, 1000);
          },
        });
        // handleSubmitAndProceed();
      };
    
      const handlePaymentFailure = (response) => {
        // console.log("Book park payment failure", response);
        toast.dismiss();
        toast.error(response.description);
      };




    // ---------------------------------------------- here Return Function ---------------------------------------------------------------
    return (
        <div className="main">
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

                                {/* Two more similar rows for Heading 1 */}
                            </div>
                            <div className="HostEvent_Heading">

                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="searchableDropdown">Facility Name
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            id="searchableDropdown"
                                            name="facilityId"
                                            className="input_padding22"

                                            value={searchTerm}
                                            onChange={handleInputChange}
                                            onClick={() => setIsDropdownOpen(true)}
                                            placeholder="Select Facility"
                                        />
                                        {isDropdownOpen && (
                                            <ul className="dropdown-menu">
                                                {filteredOptions.length > 0 ? (
                                                    filteredOptions.map((event, index) => (
                                                        <li
                                                            key={index}
                                                            onClick={() => handleOptionSelect(event.facilityId, event.facilityname, event.address)}
                                                            className="dropdown-item"
                                                        >
                                                            {event.facilityname}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="dropdown-item">No results found</li>
                                                )}
                                            </ul>
                                        )}
                                        {formErrors.eventCategory && <p className="error text-red-700">{formErrors.eventCategory}</p>}
                                    </div>

                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Event Category<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <select id="input2"
                                            name="eventCategory"
                                            className="input_padding"
                                            value={formData.eventCategory}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled selected hidden>Select Event Category</option>
                                            {filteredEventTypes.length > 0 && filteredEventTypes.map((event, index) => (
                                                <option key={index} value={event.eventCategoryId}>
                                                    {event.eventCategoryName}
                                                </option>
                                            ))}

                                        </select>
                                        {formErrors.eventCategory && <p className="error text-red-700">{formErrors.eventCategory}</p>}
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
                                        <textarea type="text" id="input1" className="input_padding" placeholder="Please Enter the Description of Event"
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
                                            <option value="" disabled selected hidden>Select</option>
                                            <option value="1">Yes</option>
                                            <option value="0">No</option>

                                        </select>
                                        {formErrors.ticketsold && <p className="error text-red-700">{formErrors.ticketsold}</p>}
                                    </div>

                                    {formData.ticketsold == 'No' ? null : (
                                        <>

                                            <div className="HostEvent_Group1 ">
                                                <label htmlFor="input2">Number of tickets <span className="text-red-600 font-bold text-xl">*</span></label>
                                                <input type="text" id="No_ticket" className="input_padding" placeholder="Enter Number of tickets"
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
                                            className="Upload_image_addition_"
                                            id="uploadImage"
                                            name="uploadImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                        <p className="italic text-sm font-bold text-gray-500">
                                            Max. image file size is 200KB for the primary image and 400KB for additional images.
                                        </p>
                                        {formErrors.uploadEventImage && <p className="error text-red-700">{formErrors.uploadEventImage}</p>}
                                    </form>
                                    <div>
                                        {formData.uploadEventImage && (
                                            <div >
                                                <h4 className="Additional_image">Primary Image:</h4>
                                                <div className=" primary_image">
                                                    <div>
                                                        <img className="image_primary"
                                                            src={formData.uploadEventImage.data}
                                                        />
                                                        <p>{formData.uploadEventImage.name}</p>
                                                        <button className="Remove_image" onClick={(e) => handleRemoveImage(e, null, "primary")}>Remove</button>
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                        <div >
                                            <h4 className="Additional_image" >Additional Images:</h4>
                                            <div className="secondry_image  ">
                                                {
                                                    formData?.additionalFiles?.map((file, index) => (
                                                        <div key={index - 1}>
                                                            <img
                                                                className="image_primary"
                                                                src={file.data}
                                                                alt={file.name}
                                                            >
                                                            </img>
                                                            <p className="tex_file_name" >{file.name}</p>
                                                            <button className="Remove_image" onClick={(e) => handleRemoveImage(e, index, "secondary")}>Remove</button>
                                                        </div>
                                                    ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {/*----------------------------- here Upload Additional Files ---------------------------- */}
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
                    <form onSubmit={nextStep2}     >
                        <div className="HostEvent_container">

                            <div className="HostEvent_Heading">
                                <span className="img_verify_text_container">
                                    <h1 className="verify_name_text">Verify Your Details</h1>

                                </span>

                                <div className="HeadingTitle9">
                                    <div></div>
                                    <h2>Organisation Details</h2>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Organization / Individual Name<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" className="input_padding" id="input1" placeholder="Organization / Individual Name" name="organisationName"

                                            value={formData.organisationName}
                                            disabled
                                        />

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Organization/Individual PAN card number<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Organization/Individual PAN card number" name="organisationPanCardNumber"

                                            value={formData.organisationPanCardNumber}
                                            disabled
                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group" id='AddressBox'>
                                        <label htmlFor="input1">Organization/Individual Address<span className="text-red-600 font-bold text-xl">*</span></label>
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
                                        <label htmlFor="input1">First Name<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="First Name" name="firstName"

                                            value={formData.firstName}
                                            disabled
                                        />

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Last Name<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Last Name" name="lastName"

                                            value={formData.lastName}
                                            disabled
                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Phone Number<span className="text-red-600 font-bold text-xl">*</span></label>
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
                                        <label htmlFor="input1">Beneficiary Name<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Beneficiary Name" name="beneficiaryName"

                                            value={formData.beneficiaryName}
                                            disabled
                                        />

                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2" >Account Type<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input1" className="input_padding" placeholder="Beneficiary Name" name="beneficiaryName"
                                            value={formData.accountType}
                                            disabled
                                        />

                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Bank Name <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <select id="input2" className="input_padding" name="bankName"
                                            disabled
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
                                        <label htmlFor="input2">Account Number<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="text" id="input2" className="input_padding" placeholder="Account Number" name="accountNumber"

                                            value={formData.accountNumber}
                                            disabled
                                        />

                                    </div>

                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Bank IFSC<span className="text-red-600 font-bold text-xl">*</span></label>
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

                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="searchableDropdown">Facility Name
                                            <span className="text-red-600 font-bold text-xl">*</span>
                                        </label>
                                        <input
                                            id="searchableDropdown"
                                            name="eventCategory"
                                            className="input_padding22"
                                            value={searchTerm}
                                            disabled
                                            onClick={() => setIsDropdownOpen(true)}
                                            placeholder="Select Facility"
                                        />
                                        {isDropdownOpen && (
                                            <ul className="dropdown-menu">
                                                {filteredOptions.length > 0 ? (
                                                    filteredOptions.map((event, index) => (
                                                        <li
                                                            key={index}
                                                            onClick={() => handleOptionSelect(event.facilityId, event.facilityname, event.address)}
                                                            className="dropdown-item"
                                                        >
                                                            {event.facilityname}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="dropdown-item">No results found</li>
                                                )}
                                            </ul>
                                        )}
                                        {formErrors.eventCategory && <p className="error text-red-700">{formErrors.eventCategory}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">Event Category<span className="text-red-600 font-bold text-xl">*</span></label>
                                        <select id="input2"
                                            name="eventCategory"
                                            className="input_padding"
                                            value={formData.eventCategory}
                                            disabled
                                        >
                                            <option value="" disabled selected hidden>Select Event Category</option>
                                            {filteredEventTypes.length > 0 && filteredEventTypes.map((event, index) => (
                                                <option key={index} value={event.eventCategoryId}>
                                                    {event.eventCategoryName}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.eventCategory && <p className="error text-red-700">{formErrors.eventCategory}</p>}
                                    </div>
                                </div>
                                <div className="HostEvent_Row">
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input1">Start Event Time & Date  <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="datetime-local" id="input1" className="input_padding" placeholder="Please Enter Phone Number"
                                            name="startEventDate"
                                            value={formData.startEventDate}
                                            disabled
                                        />
                                        {formErrors.startEventDate && <p className="error text-red-700">{formErrors.startEventDate}</p>}
                                    </div>
                                    <div className="HostEvent_Group">
                                        <label htmlFor="input2">End Event Time & Date <span className="text-red-600 font-bold text-xl">*</span></label>
                                        <input type="datetime-local" id="input2" className="input_padding" placeholder="Please Enter Email Address"
                                            name="endEventDate"
                                            value={formData.endEventDate}
                                            disabled
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
                                    <label htmlFor="input1"> Event Image <span className="text-red-600 font-bold text-xl">*</span></label>
                                    <form id="myForm" className="m-0">


                                        {formErrors.uploadEventImage && <p className="error text-red-700">{formErrors.uploadEventImage}</p>}
                                    </form>
                                    <div>
                                        {formData.uploadEventImage && (
                                            <div >
                                                <h4 className="Additional_image">Primary Image:</h4>
                                                <div className=" primary_image">
                                                    <div>
                                                        <img className="image_primary"
                                                            src={formData.uploadEventImage.data}
                                                            disabled
                                                        />
                                                        <p>{formData.uploadEventImage.name}</p>

                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                        <div >
                                            <h4 className="Additional_image" >Additional Images:</h4>
                                            <div className="secondry_image  ">
                                                {
                                                    formData.additionalFiles.map((file, index) => (
                                                        <div key={index - 1}>
                                                            <img
                                                                src={file.data}
                                                                alt={file.name}
                                                                disabled
                                                            >
                                                            </img>
                                                            <p className="tex_file_name" >{file.name}</p>

                                                        </div>
                                                    ))}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Two more similar rows for Heading 1 */}
                            </div>
                            <div className="buttons-container">
                                <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                                <button type="submit" className="next_button1">Next</button>
                            </div>
                        </div>

                    </form>
                )}
                {currentStep === 4 && (
                    // onSubmit={handleSubmit}
                    <form >
                        <div className="HostEvent_container">
                            <div className="HostEvent_Heading">
                                <h1 className="verify_name_text"></h1>
                                <div className="HeadingTitle9">
                                    <div></div>
                                    <h2>Order Summary</h2>
                                </div>
                                <div class="parent-container">
                                    <div class="Order_summary">
                                   <span className="order_summary_text">
                                       <h1>Event Title:</h1>
                                       <p >{formData.eventTitle}</p>
                                   </span>
                                   <span className="order_summary_text">
                                        <h1>Event Category:</h1>
                                        <p>{
                                            filteredEventTypes.map((event, index) => {
                                                if(event.eventCategoryId==formData.eventCategory)
                                                    return event.eventCategoryName
                                                })
                                        }</p>
                                    </span>
                                    <span className="order_summary_text">
                                    <h1>Event Location:</h1> 
                                    <p>{formData.locationofEvent }</p>
                                    </span>
                                    <span className="order_summary_text">
                                    <h1>Event Date:</h1>
                                    <p>{formData.eventDate}</p>
                                    </span>
                                    <span className="order_summary_text">
                                        <h1>Event Start Time:</h1>
                                        <p>{formData.startEventDate}</p>
                                    </span>
                                    <span className="order_summary_text">
                                        <h1>Event Close Time:</h1>
                                        <p>{formData.endEventDate}</p>
                                        </span>
                                        <span className="order_summary_text">
                                            <h1>Number of tickets:</h1>
                                            <p> {formData.numberofTicket || '0'}</p>
                                        </span>
                                        <span className="order_summary_text">
                                            <h1>Price of each event ticket</h1>
                                            <p>{formData.price || '0'}</p>
                                        </span>
                                        <span className="price_bill1">

                                        </span>
                                        <span className="order_summary_text">
                                            <h1> <strong>Total Amount</strong> (To be paid)</h1>
                                            <p className="font-bold">₹5000/_ </p>
                                        </span>
                                    </div>
                                </div>

                            </div>
                            <div className="buttons-container">
                                <button type="button" className="prev_button" onClick={prevStep}>Previous</button>
                                <RazorpayButton
                                    amount={5000 || 0}
                                    currency={"INR"}
                                    description={"Book now"}
                                    onSuccess={handlePaymentSuccess}
                                    onFailure={handlePaymentFailure}
                                    data={{
                                        entityId: encryptData(formData.facilityId),
                                        entityTypeId: encryptData('7'),
                                        facilityPreference:{
                                            organisationName:encryptData(formData.organisationName),
                                            organisationPanCardNumber: encryptData(formData.organisationPanCardNumber),
                                            organisationAddress: encryptData(formData.organisationAddress),
                                            // personal Details -------------------------
                                            firstName: encryptData(formData.firstName),
                                            lastName: encryptData(formData.lastName),
                                            phoneNo: encryptData(formData.phoneNo),
                                            emailId: encryptData(formData.emailId),
                                            // Bank Details -----------------
                                            beneficiaryName: encryptData(formData.beneficiaryName),
                                            accountType: encryptData(formData.accountType),
                                            bankName: encryptData(formData.bankName),
                                            accountNumber: encryptData(formData.accountNumber),
                                            bankIFSC: encryptData(formData.bankIFSC),
                                            // 2nd from -----------------------------
                                            eventTitle: encryptData(formData.eventTitle),
                                            eventDate: encryptData(formData.eventDate),
                                            locationofEvent: encryptData(formData.locationofEvent),
                                            eventCategory: encryptData(formData.eventCategory),
                                            startEventDate: encryptData(formData.startEventDate),
                                            endEventDate: encryptData(formData.endEventDate),
                                            descriptionofEvent: encryptData(formData.descriptionofEvent),
                                            ticketsold: encryptData(formData.ticketsold || null),
                                            numberofTicket: encryptData(formData.numberofTicket || null),
                                            price: encryptData(formData.price || null),
                                            uploadEventImage: (formData.uploadEventImage.data || null),
                                            additionalFiles: (formData.additionalFiles.map((file) => { return file.data }) || null),
                                            facilityId: encryptData(formData.facilityId),
                                            amount:encryptData(formData.amount || "0")
                                        }
                                      
                                    }}
                                />
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