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
        code: '',
        description: '',
    });
    const [errors, setErrors] = useState({
      code: '',
      description: '',
    });
    const [refresh, setRefresh] = useState(false);

    // validation function to validate form data while submit
    let validation = (formData) => {
        let error = {};

        if (!formData.code) {
            error.code = 'Please enter Code.';
        }
        if (!formData.description) {
            error.description = 'Please enter Description.';
        }
        return error;
    }

    // save user input data to formData object on entering values
    let handleChange = (e) => {
        let { name, value } = e.target;
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
            let res = await axiosHttpClient('CREATE_NEW_SERVICE_API', 'post', formData);

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
          code: '',
          description: '',
        });

        setErrors({
          code: '',
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
                    <h2>Add new service</h2>
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
                            <label htmlFor="input2">Service Code <span className='text-red-500'>*</span></label>
                            <input type="text" name='code' value={formData.code} placeholder="Enter Code" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} />
                            {errors.code && <p className='error-message'>{errors.code}</p>}
                        </div>
                        <div className="form-group col-span-1">
                            <label htmlFor="input2">Service Description <span className='text-red-500'>*</span></label>
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
