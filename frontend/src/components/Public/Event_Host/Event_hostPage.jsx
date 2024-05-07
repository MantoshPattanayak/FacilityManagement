
import { useState, useEffect } from "react";
import "./Event_HostPage.css"
import axiosHttpClient from "../../../utils/axios";
const Event_hostPage=()=>{
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        organisationName:"",
        organisationPanCardNumber:"",
        organisationAddress:"",
        // personal Details -------------------------
        firstName:"",
        lastName:"",
        phoneNo:"",
        emailId:"",
        // Bank Details -----------------
        beneficiaryName:"",
        accountType:"",
        bankName:"",
        accountNumber:"",
        bankIFSC:"",
        // 2nd step from --------------
        eventTitle:"",
        eventDate:"",
        locationofEvent:"",
        eventCategory:"",
        startEventDate:"",
        endEventDate:"",
        descriptionofEvent:"",
        ticketsold:"",
        numberofTicket:"",
        uploadeventImage:"",
        additionalFiles:""

   
    });
// here get the Bank Name in drop down ---------------------------------
const[GetbankName, setGetbankName]=useState([])
const[EventType, setEventType]=useState([])
// handler for target the Name of Input field ------------------------------
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
   

// here Post the data -----------------------------------------------------

    async function handleSubmit(){
        try{
            let res= await axiosHttpClient('Create_Host_event', 'post', {
                // organisation Details -------------
                organisationName:formData.organisationName,
                organisationPanCardNumber:formData.organisationPanCardNumber,
                organisationAddress:formData.organisationAddress,
                // personal Details -------------------------
                firstName:formData.firstName,
                lastName:formData.lastName,
                phoneNo:formData.phoneNo,
                emailId:formData.emailId,
                // Bank Details -----------------
                beneficiaryName:formData.beneficiaryName,
                accountType:formData.accountType,
                bankName:formData.bankName,
                accountNumber:formData.accountNumber,
                bankIFSC:formData.bankIFSC,
                // 2nd from -----------------------------
                eventTitle:formData.eventTitle,
                eventDate:formData.eventDate,
                locationofEvent:formData.locationofEvent,
                eventCategory:formData.eventCategory,
                startEventDate:formData.startEventDate,
                endEventDate:formData.endEventDate,
                descriptionofEvent:formData.descriptionofEvent,
                ticketsold:formData.ticketsold,
                numberofTicket:formData.numberofTicket,
                uploadeventImage:formData.uploadeventImage || null,
                additionalFiles:formData.additionalFiles || null

            })
            console.log("here Response of Post Data", res)
        }
        catch(err){
            console.log("here Response", err)
        }
    }

// here Prev and next page -------------------------------------------------
const nextStep = (e) => {
       e.preventDefault();
    // Perform validation before moving to the next step
    const validationErrors = validation(formData);
    if (Object.keys(validationErrors).length === 0) {
        // If there are no validation errors, move to the next step
        setCurrentStep(currentStep + 1);
    } else {
        // If there are validation errors, display them and prevent moving to the next step
        console.log('Validation errors:', validationErrors);
    }
};
// 2nd from next step----------------------------------
const nextStep2 = (e) => {
    e.preventDefault();
 // Perform validation before moving to the next step
 const validationErrors = Step_2_Validation(formData);
 if (Object.keys(validationErrors).length === 0) {
     // If there are no validation errors, move to the next step
     setCurrentStep(currentStep + 1);
 } else {
     // If there are validation errors, display them and prevent moving to the next step
     console.log('Validation errors:', validationErrors);
 }
};
    const prevStep = () => {
      setCurrentStep(currentStep - 1);
    };
//  here Validation ------------------------------------------------------
const validation=(value)=>{
    const err={}
    if(!value.organisationName){
        err.organisationName="Organization / Individual Name is Required"
    }
    if(!value.organisationPanCardNumber){
        err.organisationPanCardNumber=" organisation Pan-Card Number is Required"
    }
    if(!value.organisationAddress){
        err.organisationAddress="Organisation Address is Required"
    }
   if(!value.firstName){
    err.firstName="First Name is Required"
   }
   if(!value.lastName){
    err.lastName="Last Name is Required"
   }
   if(!value.phoneNo){
    err.phoneNo="Phone No is Required"
   }
   if(!value.emailId){
    err.emailId="Email  Id is Required"
   }
   if(!value.beneficiaryName){
    err.beneficiaryName="Beneficiary Name is Required"
   }
   if(!value.accountType){
    err.accountType="Account Type is Required"
   }
   if(!value.bankName){
    err.bankName="Bank Name is Required"
   }
   if(!value.accountNumber){
    err.accountNumber="Account Number is Required"
   }
   if(!value.bankIFSC){
    err.bankIFSC="Bank IFSC code is Required"
   }
   
    return err;
}

const Step_2_Validation=(value)=>{
    const err={}

    if(!value.eventTitle){
        err.eventTitle="Event Title is Required"
       }
       if(!value.eventDate){
        err.eventDate="Event Date is Required"
       }
      if(!value.locationofEvent){
        err.locationofEvent="Location of Event is Required"
      }
      if(!value.eventCategory){
        err.eventCategory="Event Category is Required"
      }
      if(!value.startEventDate){
        err.startEventDate="Start Event Date is Required"
      }
      if(!value.endEventDate){
        err.endEventDate="End EventDate is Required"
      }
      if(!value.descriptionofEvent){
        err.descriptionofEvent="Description of Event is Required"
      }
      if(!value.ticketsold){
        err.ticketsold="Ticket Sold is Required"
      }
      if(!value.numberofTicket){
        err.numberofTicket="number of Ticket is Required"
      }
    return err;
}

  
 // here Get the Bank deatils In drop down -----------------------------------
    async function GetBankDetails(){
        try{
            let res= await axiosHttpClient('Bank_details_Api', 'get')
            console.log('here Response', res)
            setGetbankName(res.data.bankServiceData)
            setEventType(res.data.eventCategoryData)
        }
        catch(err){
            console.log("here err", err)
        }
    }
    // here Call/Update the data -----------------------------
    useEffect(()=>{
        GetBankDetails()  
    }, [])



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
                        <input type="text" id="input1"  placeholder="Organization / Individual Name" name="organisationName"
                         onChange={handleChange}
                         value={formData.organisationName}
                          />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Organization/Individual PAN card number*</label>
                        <input type="text" id="input2" placeholder="Organization/Individual PAN card number" name="organisationPanCardNumber"  
                        onChange={handleChange}
                        value={formData.organisationPanCardNumber}
                        />
                    </div>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Organization/Individual Address*</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address" name="organisationAddress"
                         onChange={handleChange}
                         value={formData.organisationAddress}
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
                        <input type="text" id="input1" placeholder="First Name" name="firstName" 
                        onChange={handleChange} 
                        value={formData.firstName}
                        />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Last Name*</label>
                        <input type="text" id="input2" placeholder="Last Name" name="lastName" 
                         onChange={handleChange}
                         value={formData.lastName}
                         />
                    </div>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Phone Number*</label>
                        <input type="text" id="input1" placeholder="Phone Number" name="phoneNo" 
                         onChange={handleChange}
                         value={formData.phoneNo}
                         />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Email Address*</label>
                        <input type="text" id="input2" placeholder="Email Address"  name="emailId"
                         onChange={handleChange}
                         value={formData.emailId}
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
                        <input type="text" id="input1" placeholder="Beneficiary Name" name="beneficiaryName"
                         onChange={handleChange} 
                         value={formData.beneficiaryName}
                         />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Account Type*</label>
                        <select id="input2" name="accountType" 
                        onChange={handleChange}
                        value={formData.accountType}
                        >
                        <option value="" disabled selected hidden>Select Account Type</option>
                            <option value="option1">Savings account</option>
                            <option value="option2">Current account</option>
                           
                        </select>
                    </div>
                </div>
                <div className="HostEvent_Row">
                <div className="HostEvent_Group">
                        <label htmlFor="input2">Bank Name*</label>
                        <select id="input2" name="bankName" 
                        onChange={handleChange}
                        value={formData.bankName}
                        >
                        <option value="" disabled selected hidden>Select Bank Name</option>
                        {GetbankName?.length>0 && GetbankName?.map((Bankname, index)=>{
                            return(
                                <option key={index} value={Bankname.id}>
                                    {Bankname.bankName}

                                </option>
                            )

                        })}
                    
                        </select>
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Account Number*</label>
                        <input type="text" id="input2" placeholder="Account Number" name="accountNumber"
                         onChange={handleChange} 
                         value={formData.accountNumber}
                         />
                    </div>

                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Bank IFSC*</label>
                        <input type="text" id="input1" placeholder="Bank IFSC" name="bankIFSC"
                          onChange={handleChange}
                          value={formData.bankIFSC}
                           />
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
           <form onSubmit={nextStep2}>
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
                        <input type="text" id="input1" placeholder="Organization / Individual Name" 
                        name="eventTitle"
                         value={formData.eventTitle} 
                         onChange={handleChange}
                         />
                          
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">Event Date</label>
                        <input type="text" id="input2" placeholder="Organization/Individual PAN card number"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                         />
                    </div>
                </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Location of Event</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address"
                        name="locationofEvent"
                        value={formData.locationofEvent}
                        onChange={handleChange}
                         />
                    </div>
                </div>

                {/* Two more similar rows for Heading 1 */}
            </div>
            <div className="HostEvent_Heading">
      
            <div className="HostEvent_Group">
                        <label htmlFor="input2">Event Category*</label>
                        <select id="input2"
                        name="eventCategory"
                        value={formData.eventCategory}
                        onChange={handleChange}
                        >
                        <option value="" disabled selected hidden>Select Event Category</option>
                        {EventType?.length>0 && EventType?.map((event, index)=>{
                            return(
                                <option key={index} value={event.eventCategoryId}>
                                    {event.eventType}

                                </option>
                            )

                        })}
                    
                        </select>
                    </div>
                <div className="HostEvent_Row">
                    <div className="HostEvent_Group">
                        <label htmlFor="input1">Start Event Date</label>
                        <input type="text" id="input1" placeholder="Phone Number"
                        name="startEventDate"
                        value={formData.startEventDate}
                        onChange={handleChange}
                         />
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">End Event Date</label>
                        <input type="text" id="input2" placeholder="Email Address"
                        name="endEventDate"
                        value={formData.endEventDate}
                        onChange={handleChange}
                         />
                    </div>

                </div>
                {/* Two more similar rows for Heading 1 */}
            </div>
            <div className="HostEvent_Heading">
           
                <div className="HostEvent_Row">
                <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Description of Event</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address"
                        name="descriptionofEvent"
                        value={formData.descriptionofEvent}
                        onChange={handleChange}
                         />
                    </div>
                   
                </div>
                <div className="HostEvent_Row">
                <div className="HostEvent_Group">
                        <label htmlFor="input2">Will there be ticket sold ?</label>
                        <select id="input2"
                        name="ticketsold"
                        value={formData.ticketsold}
                        onChange={handleChange}
                        >
                        <option value="" disabled selected hidden>Select Bank Name</option>
                            <option value="option1">Axis Bank</option>
                            <option value="option2">HDFC Bank</option>
                            <option value="option3">State Bank Of India</option>
                        </select>
                    </div>
                    <div className="HostEvent_Group">
                        <label htmlFor="input2">if yes, then how much are tickets</label>
                        <input type="text" id="input2" placeholder="Account Number" 
                        name="numberofTicket"
                        value={formData.numberofTicket}
                        onChange={handleChange}
                        />
                    </div>
                     

             
                </div>
                <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Upload Event Image</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address" 
                        name="uploadeventImage"
                        value={formData.uploadeventImage}
                        onChange={handleChange}
                        />
                    </div>
                    <div className="HostEvent_Group" id='AddressBox'>
                        <label htmlFor="input1">Upload any Additional Files</label>
                        <input type="text" id="input1" placeholder="Organization/Individual Address"
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
  
        {currentStep === 3 && (
          <form onSubmit={handleSubmit}>
            <h2>Step 3</h2>
            <p>First Name: {formData.organisationName}</p>
            <p>Last Name: {formData.organisationPanCardNumber}</p>
            <p>Email: {formData.organisationAddress}</p>
            <p>Password: {formData.firstName}</p>
            <p>{formData.lastName}</p>
            <p>{formData.phoneNo}</p>
            <p>{formData.emailId}</p>
            <p>{formData.beneficiaryName}</p>
            <p>{formData.accountType}</p>
            <p>{formData.bankName}</p>
            <p>{formData.accountNumber}</p>
            <p>bankIFSC:{formData.bankIFSC}</p>
            <p>{formData.eventTitle}</p>
            <p>{formData.eventDate}</p>
            <p>{formData.locationofEvent}</p>
            <p>{formData.eventCategory}</p>
            <p>{formData.startEventDate}</p>
            <p>{formData.endEventDate}</p>
            <p>{formData.descriptionofEvent}</p>
            <p>{formData.ticketsold}</p>
            <p>{formData.numberofTicket}</p>
            <p>{formData.uploadeventImage}</p>
            <p>{formData.additionalFiles}</p>
            
          
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    );
  };

export default Event_hostPage;