
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
             <div class="container">
             <div class="row justify-content-center">
                 <div class="col-lg-6">
                     <form onSubmit={nextStep} className="event-host_1st_Page">
                         <h2>Step 1</h2>
                         <div class="form-group">
                             <label for="firstName">First Name:</label>
                             <input type="text" id="firstName" name="firstName" class="form-control" value={formData.firstName} onChange={handleChange} />
                         </div>
                         <div class="form-group">
                             <label for="lastName">Last Name:</label>
                             <input type="text" id="lastName" name="lastName" class="form-control" value={formData.lastName} onChange={handleChange} />
                         </div>
                         <div class="form-group">
                             <label for="firstName2">First Name2:</label>
                             <input type="text" id="firstName2" name="firstName2" class="form-control" value={formData.firstName} onChange={handleChange} />
                         </div>
                         <div class="form-group">
                             <label for="lastName2">Last Name2:</label>
                             <input type="text" id="lastName2" name="lastName2" class="form-control" value={formData.lastName} onChange={handleChange} />
                         </div>
                         <div class="form-group">
                             <label for="remark">Remark:</label>
                             <textarea id="remark" name="remark" class="form-control" value={formData.remark} onChange={handleChange}></textarea>
                         </div>
                         <button type="submit" class="btn btn-primary">Next</button>
                     </form>
                 </div>
             </div>
         </div>
         
             
    
        )}
  
        {currentStep === 2 && (
          <form onSubmit={nextStep}>
            <h2>Step 2</h2>
            <label>
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <br />
            <label>
              Password:
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </label>
            <br />
            <button type="button" onClick={prevStep}>Previous</button>
            <button type="submit">Next</button>
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