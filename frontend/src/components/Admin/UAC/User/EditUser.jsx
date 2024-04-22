import { useState, useEffect } from 'react';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import '../../../../common/CommonFrom.css';
import { regex, dataLength } from '../../../../utils/regexExpAndDataLength';
import axiosHttpClient from '../../../../utils/axios';
import api from '../../../../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from '../../../../utils/encryptData';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

export default function EditUser() {

    const location = useLocation();
    const userId = decryptData(new URLSearchParams(location.search).get('userId'));
    const action = new URLSearchParams(location.search).get('action');
    const navigate = useNavigate();

    let initialFormData = {
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNumber: '',
        altMobileNumber: '',
        emailID: '',
        role: '',
        status: ''
    };

    let modifiedFormData = {
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNumber: '',
        altMobileNumber: '',
        emailID: '',
        role: '',
        status: ''
    }

    const [formData, setFormData] = useState(initialFormData);
    const [roleList, setRoleList] = useState([]);

    const [errors, setErrors] = useState({});

    async function fetchUserDetails() {
        try {
            let res = await axiosHttpClient('ADMIN_USER_VIEW_BY_ID_API', 'get', null, userId);

            // console.log('response', res.data.data[0]);

            let title = decryptData(res.data.data[0].title);
            let fullName = decryptData(res.data.data[0].fullName).split(' ');
            let emailId = decryptData(res.data.data[0].emailId);
            let status = (res.data.data[0].statusId);
            let mobileNumber = decryptData(res.data.data[0].contactNo);
            let altMobileNumber = decryptData(res.data.data[0].altContactNo);
            let role = (res.data.data[0].roleId);

            console.log({title, fullName, emailId, status, mobileNumber, role});

            setFormData({
                title: title || '',
                firstName: fullName[0] || '',
                middleName: fullName[1] || '',
                lastName: fullName[-1] || '',
                mobileNumber: mobileNumber || '',
                altMobileNumber: altMobileNumber || '',
                emailID: emailId || '',
                role: role || '',
                status: status || ''
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    async function fetchInitialData() {
        try {
            let res = await axiosHttpClient('ADMIN_USER_INITIALDATA_API', 'get');

            console.log(res.data);
        }
        catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchUserDetails();
        fetchInitialData();
    }, [])

    function validateUserInput(data) {
        let errors = {};

        console.log(data);

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
            // errors.middleName = "Please provide middle name."
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
                let response = await axiosHttpClient('ADMIN_USER_UPDATE_API', 'post', formData, null);

                console.log(response.data);
                toast.success('User details updated successfully.');
            }
            catch (error) {
                console.error(error);
                toast.error('User details updation failed. Please try again.');
            }
        }
        else {
            setErrors(errors);
            toast.error('User details updation failed. Please try again.');
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
                    <div className="flex flex-col-reverse items-end w-[100%]">
                        <button
                        className='back-button'
                            onClick={(e) => navigate(-1)}
                        >
                            <FontAwesomeIcon icon={faArrowLeftLong} /> Back
                        </button>
                    </div>
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
                            <input type="text" name='firstName' value={formData.firstName} placeholder="First name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.firstName && <p className='error-message'>{errors.firstName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input3">Middle name</label>
                            <input type="text" name='middleName' value={formData.middleName} placeholder="Middle name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.middleName && <p className='error-message'>{errors.middleName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Last name<span className='text-red-500'>*</span></label>
                            <input type="text" name='lastName' value={formData.lastName} placeholder="Last name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.lastName && <p className='error-message'>{errors.lastName}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input2">Mobile number<span className='text-red-500'>*</span></label>
                            <input type="text" name='mobileNumber' value={formData.mobileNumber} placeholder="Mobile number" autoComplete='off' maxLength={dataLength.PHONE_NUMBER} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.mobileNumber && <p className='error-message'>{errors.mobileNumber}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input3">Alternate mobile number</label>
                            <input type="text" name='altMobileNumber' value={formData.altMobileNumber} placeholder="Alternate mobile number" autoComplete='off' maxLength={dataLength.PHONE_NUMBER} onChange={handleChange} disabled={action == 'view' ? true : false}/>
                            {errors.altMobileNumber && <p className='error-message'>{errors.altMobileNumber}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="input1">Email ID<span className='text-red-500'>*</span></label>
                            <input type="text" name='emailID' value={formData.emailID} placeholder="Email ID" autoComplete='off' maxLength={dataLength.EMAIL} onChange={handleChange} disabled={action == 'view' ? true : false}/>
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
                        <div className="form-group">
                            <label htmlFor="input2">Status<span className='text-red-500'>*</span></label>
                            <select name='role' value={formData.status} onChange={handleChange} disabled={action == 'view' ? true : false}>
                                <option value={''}>Select</option>
                                <option value={'1'}>Active</option>
                                <option value={'0'}>Inactive</option>
                            </select>
                            {errors.role && <p className='error-message'>{errors.role}</p>}
                        </div>
                    </div>
                </div>

                <div className="buttons-container">
                    <button type='submit' className={`approve-button ${(action == 'view') ? 'hidden' : ''}`} onClick={handleSubmit} disabled={action == 'view' ? true : false}>Submit</button>
                    {/* <button type='submit' className="cancel-button" onClick={clearForm} disabled={action == 'view' ? true : false}>Cancel</button> */}
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </div>
    )
}
