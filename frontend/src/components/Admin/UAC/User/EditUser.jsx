import { useState, useEffect } from 'react';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import '../../../../common/CommonFrom.css';
import { regex, dataLength } from '../../../../utils/regexExpAndDataLength';
import axiosHttpClient from '../../../../utils/axios';
import api from '../../../../utils/api';
import { useLocation } from 'react-router-dom';
import { decryptdata } from '../../../../utils/encryptData';

export default function EditUser() {

    const location = useLocation();
    const userId = new URLSearchParams(location.search).get('userId');
    const action = new URLSearchParams(location.search).get('action');

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

    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});

    async function fetchUserDetails() {
        try {
            let res = await axiosHttpClient('ADMIN_USER_VIEW_BY_ID_API', 'get', null, decryptdata(userId));

            console.log('response', res);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {

    }, [])

    function validateUserInput(data) {
        let errors = {};

        if (data.title) {
            // continue
        }
        else {
            errors.title = "Please provide salutation."
        }

        if (data.firstName) {
            if (!regex.NAME.test(data.firstName)) {
                errors.firstName = "First name is incorrect."
            }
        }
        else {
            errors.firstName = "Please provide first name."
        }

        if (data.middleName) {
            if (!regex.NAME.test(data.middleName)) {
                errors.middleName = "Middle name is incorrect."
            }
        }
        else {
            errors.middleName = "Please provide middle name."
        }

        if (data.lastName) {
            if (!regex.NAME.test(data.lastName)) {
                errors.lastName = "Last name is incorrect."
            }
        }
        else {
            errors.lastName = "Please provide last name."
        }

        if (data.mobileNumber) {
            if (!regex.PHONE_NUMBER.test(data.mobileNumber)) {
                errors.mobileNumber = "Last name is incorrect."
            }
        }
        else {
            errors.mobileNumber = "Please provide mobile number."
        }

        if (data.emailID) {
            if (!regex.EMAIL.test(data.emailID)) {
                errors.emailID = "Email ID is incorrect."
            }
        }
        else {
            errors.emailID = "Please provide email id."
        }

        if (data.role) {
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
        setFormData({ ...formData, [name]: value });
        console.log('formData', formData);
        return;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setErrors({});

        let errors = validateUserInput(formData);

        if (errors.length <= 0) {
            try {
                let response = await axiosHttpClient(api.ADMIN_MODULE_CREATE_USER, 'post', formData);

                console.log(response.data);
            }
            catch (error) {
                console.error(error);
            }
        }
        else {
            setErrors(errors);
        }
    }

    function clearForm(e) {
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
                    <h2>{action == 'view' ? "View User" : "Edit User"}</h2>
                    <div className="grid grid-rows-2 grid-cols-2 gap-x-8 gap-y-6 w-[100%]">
                        <div className="form-group">
                            <label htmlFor="input1">Title<span className='text-red-500'>*</span></label>
                            <select name='title' value={formData.title} onChange={handleChange} disabled={action == 'view' ? true : false}>
                                <option value={''}>Select</option>
                                <option value={'Mr'}>Mr</option>
                                <option value={'Ms'}>Ms</option>
                                <option value={'Mrs'}>Mrs</option>
                            </select>
                            {errors.title && <p className='error-message'>{errors.title}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input2">First name<span className='text-red-500'>*</span></label>
                            <input type="text" name='firstName' value={formData.firstName} placeholder="First name" maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.firstName && <p className='error-message'>{errors.firstName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input3">Middle name</label>
                            <input type="text" name='middleName' value={formData.middleName} placeholder="Middle name" maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.middleName && <p className='error-message'>{errors.middleName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Last name<span className='text-red-500'>*</span></label>
                            <input type="text" name='lastName' value={formData.lastName} placeholder="Last name" maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.lastName && <p className='error-message'>{errors.lastName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input2">Mobile number<span className='text-red-500'>*</span></label>
                            <input type="text" name='mobileNumber' value={formData.mobileNumber} placeholder="Mobile number" maxLength={dataLength.PHONE_NUMBER} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.mobileNumber && <p className='error-message'>{errors.mobileNumber}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input3">Alternate mobile number</label>
                            <input type="text" name='altMobileNumber' value={formData.altMobileNumber} placeholder="Alternate mobile number" maxLength={dataLength.PHONE_NUMBER} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.altMobileNumber && <p className='error-message'>{errors.altMobileNumber}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Email ID<span className='text-red-500'>*</span></label>
                            <input type="text" name='emailID' value={formData.emailID} placeholder="Email ID" maxLength={dataLength.EMAIL} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.emailID && <p className='error-message'>{errors.emailID}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input2">Role<span className='text-red-500'>*</span></label>
                            <select name='role' value={formData.role} onChange={handleChange} disabled={action == 'view' ? true : false}>
                                <option value={''}>Select</option>
                                <option value={'BDA Admin'}>BDA Admin</option>
                                <option value={'Park Admin'}>Park Admin</option>
                            </select>
                            {errors.role && <p className='error-message'>{errors.role}</p>}
                        </div>
                    </div>
                </div>

                <div className="buttons-container">
                    <button type='submit' className="approve-button" onClick={handleSubmit} disabled={action == 'view' ? true : false}>Submit</button>
                    <button type='submit' className="cancel-button" onClick={clearForm} disabled={action == 'view' ? true : false}>Cancel</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}
