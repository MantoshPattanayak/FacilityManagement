import { useState, useEffect } from 'react';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import '../../../../common/CommonFrom.css';
import { regex, dataLength } from '../../../../utils/regexExpAndDataLength';
import axiosHttpClient from '../../../../utils/axios';
import api from '../../../../utils/api';

export default function CreateNewUser() {

    let initialFormData = {
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNumber: '',
        altMobileNumber: '',
        emailID: '',
        role: ''
    };

    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNumber: '',
        altMobileNumber: '',
        emailID: '',
        role: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {

    }, [])

    function validateUserInput(data) {
        let errors = {};

        if(data.title){
            // continue
        }
        else {
            errors.title = "Please provide salutation."
        }

        if(data.firstName){
            if(!regex.NAME.test(data.firstName)){
                errors.firstName = "First name is incorrect."
            }
        }
        else {
            errors.firstName = "Please provide first name."
        }

        if(data.middleName){
            if(!regex.NAME.test(data.middleName)){
                errors.middleName = "Middle name is incorrect."
            }
        }
        else {
            errors.middleName = "Please provide middle name."
        }

        if(data.lastName){
            if(!regex.NAME.test(data.lastName)){
                errors.lastName = "Last name is incorrect."
            }
        }
        else {
            errors.lastName = "Please provide last name."
        }

        if(data.mobileNumber){
            if(!regex.PHONE_NUMBER.test(data.mobileNumber)){
                errors.mobileNumber = "Last name is incorrect."
            }
        }
        else {
            errors.mobileNumber = "Please provide mobile number."
        }

        if(data.emailID){
            if(!regex.EMAIL.test(data.emailID)){
                errors.emailID = "Email ID is incorrect."
            }
        }
        else {
            errors.emailID = "Please provide email id."
        }

        if(data.role){
            // continue
        }
        else {
            errors.role = "Please provide role."
        }

        return errors;
    }

    function handleChange(e) {
        e.preventDefault();

        let { name, value } = e.target;
        setFormData({...formData, [name]: value});
        console.log('formData', formData);
        return;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setErrors({});

        let errors = validateUserInput(formData);

        if(errors.length <= 0){
            try {
                let response = await axiosHttpClient(api.ADMIN_MODULE_CREATE_USER, 'post', formData);

                console.log(response.data);
            }
            catch(error) {
                console.error(error);
            }
        }
        else{
            setErrors(errors);
        }
    }

    function clearForm (e) {
        // e.preventDefault();
        console.log('cancel form')
        setFormData(initialFormData);
        return;
    }

    return (
        <div>
            <AdminHeader />
            <div className="form-container">
                <div className="form-heading">
                    <h2>Create new user</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="input1">Salutation</label>
                            <select name='title' value={formData.title} onChange={handleChange}>
                                <option value={''}>Select</option>
                                <option value={'Mr'}>Mr</option>
                                <option value={'Ms'}>Ms</option>
                                <option value={'Mrs'}>Mrs</option>
                            </select>
                            {/* <input type="text" id="input1" placeholder="Input 1" /> */}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input2">First name</label>
                            <input type="text" name='firstName' value={formData.firstName} placeholder="First name" maxLength={dataLength.NAME} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input3">Middle name</label>
                            <input type="text" name='middleName' value={formData.middleName} placeholder="Middle name" maxLength={dataLength.NAME} onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="input1">Last name</label>
                            <input type="text" name='lastName' value={formData.lastName} placeholder="Last name" maxLength={dataLength.NAME} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input2">Mobile number</label>
                            <input type="text" name='mobileNumber' value={formData.mobileNumber} placeholder="Mobile number" maxLength={dataLength.PHONE_NUMBER} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input3">Alternate mobile number</label>
                            <input type="text" name='altMobileNumber' value={formData.altMobileNumber} placeholder="Alternate mobile number" maxLength={dataLength.PHONE_NUMBER} onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="input1">Email ID</label>
                            <input type="text" name='emailID' value={formData.emailID} placeholder="Email ID" maxLength={dataLength.EMAIL} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="input2">Role</label>
                            <select name='role' value={formData.role} onChange={handleChange}>
                                <option value={''}>Select</option>
                                <option value={'BDA Admin'}>BDA Admin</option>
                                <option value={'Park Admin'}>Park Admin</option>
                            </select>
                        </div>
                        {/* <div className="form-group">
                            <label htmlFor="input3">Label 3:</label>
                            <input type="text" id="input3" placeholder="Input 3" />
                        </div> */}
                    </div>
                    {/* Two more similar rows for Heading 1 */}
                </div>

                <div className="buttons-container">
                    <button className="approve-button" onClick={handleSubmit}>Submit</button>
                    <button className="cancel-button" onClick={clearForm}>Cancel</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}
