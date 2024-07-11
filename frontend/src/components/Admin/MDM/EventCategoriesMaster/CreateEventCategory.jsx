import React, { useEffect, useState } from 'react';
import axiosHttpClient from '../../../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../common/AdminHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { dataLength } from '../../../../utils/regexExpAndDataLength';
import './CreateEventCategory.css';

export default function CreateEventCategory() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        eventCategoryName: '',
        description: '',
    });
    const [errors, setErrors] = useState({
      eventCategoryName: '',
      description: '',
    });
    const [refresh, setRefresh] = useState(false);

    // validation function to validate form data while submit
    let validation = (formData) => {
        let error = {};

        if (!formData.eventCategoryName) {
            error.eventCategoryName = 'Please enter Name.';
        }
        if (!formData.description) {
            error.description = 'Please enter Description.';
        }

        //highlight input fields whose field values are incorrect
        for(let i = 0; i <= Object.keys(error).length; i++) {
            const inputElement = document.getElementsByName(Object.keys(error)[i]);
            inputElement[0] ? inputElement[0].style.border = '2px solid #C84040' : '';
            // Add focus event listener
            inputElement[0] ? inputElement[0].addEventListener('focus', () => {
                inputElement[0].style.border = '2px solid #176BFB'; // Change border color on focus
            }) : '';
        
            // Add blur event listener to reset the border style when focus is lost
            inputElement[0] ? inputElement[0].addEventListener('blur', () => {
                inputElement[0].style.border = '2px solid #C84040'; // Reset to original border color
            }) : '';
        }
        return error;
    }

    // save user input data to formData object on entering values
    let handleChange = (e) => {
        let { name, value } = e.target;
        // if error in input field, then handle the border color while entering input
        // const inputElement = document.getElementsByName(name);
        // let borderStyle = inputElement[0].style.border;
        // if(borderStyle.includes('rgb(200, 64, 64)')) {
        //     inputElement[0].style.border = "2px solid #176BFB";
        // }
        setErrors({});
        setFormData({ ...formData, [name]: value });
        console.log('formData', formData);
    }

    // function to submit formdata
    let handleSubmit = async () => {
        let errors = validation(formData);
        setErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error('Please enter proper values.');
            return;
        }

        try {
            let res = await axiosHttpClient('CREATE_NEW_EVENTCATEGORY_API', 'post', formData);

            console.log('form submit response', res.data);
            toast.dismiss();
            toast.success(res.data.message, {
                autoClose: 3000, // Toast timer duration in milliseconds
                onClose: () => {
                    // Navigate to another page after toast timer completes
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000); // Wait 1 second after toast timer completes before navigating
                }
            });
        }
        catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
        }
    }

    // function to initialize formdata and errors object
    let clearForm = () => {
      toast.dismiss();
        setFormData({
          eventCategoryName: '',
          description: '',
        });

        setErrors({
          eventCategoryName: '',
          description: '',
        });
        setRefresh(prevState => !prevState);
    }

    // refresh component on change of refresh state variable
    useEffect(() => {

    }, [refresh]);

    return (
        <div>
            <AdminHeader />
            <div className="CreateEventCategoryContainer">
                <div className="form-heading">
                    <h2>Add new event category</h2>
                    <div className="flex flex-col-reverse items-end w-[100%]">
                        <button
                            className='back-button'
                            onClick={(e) => navigate(-1)}
                        >
                            <FontAwesomeIcon icon={faArrowLeftLong} /> Back
                        </button>
                    </div>
                    <div className="grid grid-rows-1 grid-cols-2 gap-x-16 gap-y-2 w-[100%]">
                        <div className="form-group col-span-1">
                            <label htmlFor="input2">Event Category Name<span className='text-red-500'>*</span></label>
                            <input type="text" name='eventCategoryName' value={formData.eventCategoryName} placeholder="Enter Name" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} />
                            {errors.eventCategoryName && <p className='error-message'>{errors.eventCategoryName}</p>}
                        </div>
                        <div className="form-group col-span-1">
                            <label htmlFor="input2">Event Category Description <span className='text-red-500'>*</span></label>
                            <input type='text' name='description' value={formData.description} placeholder="Enter Description" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_LONG} onChange={handleChange} />
                            {errors.description && <p className='error-message'>{errors.description}</p>}
                        </div>
                    </div>
                    <div className="buttons-container">
                      <button className="approve-button" onClick={handleSubmit}>Submit</button>
                      <button className="cancel-button" onClick={clearForm}>Cancel</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
