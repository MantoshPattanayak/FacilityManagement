import React, { useEffect, useState } from 'react';
import axiosHttpClient from '../../../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { formatDateYYYYMMDD } from '../../../../utils/utilityFunctions';
import AdminHeader from '../../../../common/AdminHeader';
import CommonFooter from '../../../../common/CommonFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { dataLength } from '../../../../utils/regexExpAndDataLength';
import '../../../../common/CommonFrom.css';

export default function AddNewNotification() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        notificationTitle: '',
        notificationContent: '',
        validFromDate: new Date(),
        validToDate: new Date(),
        fileAttachment: {
            name: '',
            data: ''
        }
    });
    const [errors, setErrors] = useState({
        notificationTitle: '',
        notificationContent: '',
        validFromDate: '',
        validToDate: '',
        fileAttachment: ''
    });

    // validation function to validate form data while submit
    let validation = (formData) => {
        let error = {};

        if(!formData.notificationTitle){
            error.notificationTitle = 'Please enter Notification Title.';
        }
        if(!formData.notificationContent){
            error.notificationContent = 'Please enter Notification Content.';
        }
        if(!formData.validFromDate){
            error.validFromDate = 'Please enter Valid from date.';
        }
        if(!formData.validToDate){
            error.validToDate = 'Please enter Valid to date.';
        }
        if(new Date(formData.validFromDate) > new Date(formData.validToDate)){
            error.validFromDate = 'Valid from date should be less than or equal to valid to date.';
        }

        return error;
    }

    // save user input data to formData object on entering values
    let handleChange = (e) => {
        let { name, value } = e.target;
        setFormData({...formData, [name]: value});
        console.log('formData', formData);
    }

    // function to submit formdata
    let handleSubmit = async () => {
        let errors = validation(formData);
        setErrors(errors);
        if(Object.keys(errors).length > 0){
            toast.error('Please enter proper values.');
            return;
        }

        try {
            let res = await axiosHttpClient('ADD_NOTIFICATIONS_API', 'post', formData);

            console.log('form submit response', res.data);
            toast.success('Form submitted successfully!', {
                autoClose: 3000, // Toast timer duration in milliseconds
                onClose: () => {
                  // Navigate to another page after toast timer completes
                  setTimeout(() => {
                    navigate('/Activity/ViewNotifications');
                  }, 1000); // Wait 1 second after toast timer completes before navigating
                }
            });

        }
        catch(error) {
            console.error(error);
            toast.error('Form submission failed. Please try again.')
        }
    }

    // function to initialize formdata and errors object
    let clearForm = () => {
        setFormData({
            notificationTitle: '',
            notificationContent: '',
            validFromDate: formatDateYYYYMMDD(new Date().toISOString().split('T')[0]),
            validToDate: formatDateYYYYMMDD(new Date().toISOString().split('T')[0])
        });

        setErrors({
            notificationTitle: '',
            notificationContent: '',
            validFromDate: '',
            validToDate: ''
        });
    }

    useEffect(() => {

    }, [formData, errors]);

    return (
        <div>
            <AdminHeader />
            <div className="form-container">
                <div className="form-heading">
                    <h2>Add new notification</h2>
                    <div className="flex flex-col-reverse items-end w-[100%]">
                        <button
                            className='back-button'
                            onClick={(e) => navigate(-1)}
                        >
                            <FontAwesomeIcon icon={faArrowLeftLong} /> Back
                        </button>
                    </div>
                    <div className="grid grid-rows-2 grid-cols-2 gap-x-8 gap-y-4 w-[100%]">
                        <div className="form-group col-span-2">
                            <label htmlFor="input2">Notification Title <span className='text-red-500'>*</span></label>
                            <input type="text" name='notificationTitle' value={formData.notificationTitle} placeholder="Notification Title" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} />
                            {errors.notificationTitle && <p className='error-message'>{errors.notificationTitle}</p>}
                        </div>
                        <div className="form-group col-start-1 col-span-2">
                            <label htmlFor="input3">Notification Content <span className='text-red-500'>*</span></label>
                            <textarea name='notificationContent' value={formData.notificationContent} placeholder="Notification Content" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_LONG} onChange={handleChange} rows={3}/>
                            {errors.notificationContent && <p className='error-message'>{errors.notificationContent}</p>}
                        </div>
                        <div className="form-group col-start-1">
                            <label htmlFor="input1">Valid from date <span className='text-red-500'>*</span></label>
                            <input type="date" name='validFromDate' value={formatDateYYYYMMDD(new Date(formData.validFromDate).toISOString().split('T')[0])} autoComplete='off' onChange={handleChange} />
                            {errors.validFromDate && <p className='error-message'>{errors.validFromDate}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input2">Valid to date <span className='text-red-500'>*</span></label>
                            <input type="date" name='validToDate' value={formatDateYYYYMMDD(new Date(formData.validToDate).toISOString().split('T')[0])} autoComplete='off' onChange={handleChange} />
                            {errors.validToDate && <p className='error-message'>{errors.validToDate}</p>}
                        </div>
                    </div>
                </div>

                <div className="buttons-container">
                    <button className="approve-button" onClick={handleSubmit}>Submit</button>
                    <button className="cancel-button" onClick={clearForm}>Cancel</button>
                </div>
            </div>
            <ToastContainer />
            <CommonFooter />
        </div>
    )
}
