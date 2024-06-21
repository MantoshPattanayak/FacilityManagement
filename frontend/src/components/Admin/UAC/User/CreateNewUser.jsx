import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../common/AdminHeader';
import './CreateNewUser.css';
import { regex, dataLength } from '../../../../utils/regexExpAndDataLength';
import axiosHttpClient from '../../../../utils/axios';
import { encryptData } from '../../../../utils/encryptData';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

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
    const [roleList, setRoleList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchInitialData() {
            try {
                let res = await axiosHttpClient('ADMIN_USER_INITIALDATA_API', 'get');
                console.log(res.data);
                setRoleList(res.data.Role);
            }
            catch(error) {
                console.error(error);
            }
        }
        fetchInitialData();
    }, [])

    function validateUserInput(data) {
        let errors = {};

        if(data.title){
            // continue
        }
        else {
            errors.title = "Please provide Title."
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
            // errors.middleName = "Please provide middle name."
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
        
        if(Object.keys(errors).length <= 0){
            try {

                let encyptedData = encryptData(formData);

                let response = await axiosHttpClient('ADMIN_USER_CREATE_API', 'post', {
                    encryptTitle: encryptData(formData.title),
                    encryptFullName: encryptData(formData.firstName + (formData.middleName ? ' ' + formData.middleName  : '') + (formData.lastName ? ' ' + formData.lastName  : '')),
                    encryptMobileNo: encryptData(formData.mobileNumber),
                    encryptRole: encryptData(formData.role),
                    encryptStatus: encryptData(1),
                    encryptUsername: null,
                    encryptEmailId: encryptData(formData.emailID),
                    encryptGenderId: null,
                }, null);

                console.log(response.data);
                toast.success('New user created successfully.', {
                    autoClose: 2000,
                    onClose: () => {
                        setFormData(initialFormData);
                    }
                });
            }
            catch(error) {
                console.error(error);
                toast.error('User creation failed. Please try again.');
            }
        }
        else{
            setErrors(errors);
            console.log('errors', errors);
            toast.error('User creation failed. Please try again.');
        }
    }

    function clearForm (e) {
        // e.preventDefault();
        console.log('cancel form')
        setFormData(initialFormData);
        setErrors({});
        return;
    }

    return (
        <div className='user-create'>
            <AdminHeader />
            <div className="form-container">
                <div className="form-heading">
                    <h2>Create new user</h2>
                    <div className="flex flex-col-reverse items-end w-[100%]">
                        <button
                        className='back-button'
                            onClick={(e) => navigate(-1)}
                        >
                            <FontAwesomeIcon icon={faArrowLeftLong} /> Back
                        </button>
                    </div>
                    <div className="grid lg:grid-rows-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 lg:gap-x-8 gap-y-6 w-[100%]">
                        <div className="form-group col-span-1">
                            <label htmlFor="input1">Title<span className='text-red-500'>*</span></label>
                            <select name='title' value={formData.title} onChange={handleChange}>
                                <option value={''}>Select</option>
                                <option value={'Mr'}>Mr</option>
                                <option value={'Ms'}>Ms</option>
                                <option value={'Mrs'}>Mrs</option>
                            </select>
                            { errors.title && <p className='error-message'>{errors.title}</p> }
                        </div>
                        <div className="form-group col-span-1">
                            <label htmlFor="input2">First name<span className='text-red-500'>*</span></label>
                            <input type="text" name='firstName' value={formData.firstName} placeholder="First name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange}/>
                            { errors.firstName && <p className='error-message'>{errors.firstName}</p> }
                        </div>
                        <div className="form-group col-span-1">
                            <label htmlFor="input3">Middle name</label>
                            <input type="text" name='middleName' value={formData.middleName} placeholder="Middle name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange}/>
                            { errors.middleName && <p className='error-message'>{errors.middleName}</p> }
                        </div>
                        <div className="form-group col-span-1">
                            <label htmlFor="input1">Last name<span className='text-red-500'>*</span></label>
                            <input type="text" name='lastName' value={formData.lastName} placeholder="Last name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange}/>
                            { errors.lastName && <p className='error-message'>{errors.lastName}</p> }
                        </div>
                        <div className="form-group col-span-1">
                            <label htmlFor="input2">Mobile number<span className='text-red-500'>*</span></label>
                            <input type="text" name='mobileNumber' value={formData.mobileNumber} placeholder="Mobile number" autoComplete='off' maxLength={dataLength.PHONE_NUMBER} onChange={handleChange}/>
                            { errors.mobileNumber && <p className='error-message'>{errors.mobileNumber}</p> }
                        </div>
                        {/* <div className="form-group col-span-1">
                            <label htmlFor="input3">Alternate mobile number</label>
                            <input type="text" name='altMobileNumber' value={formData.altMobileNumber} placeholder="Alternate mobile number" autoComplete='off' maxLength={dataLength.PHONE_NUMBER} onChange={handleChange}/>
                            { errors.altMobileNumber && <p className='error-message'>{errors.altMobileNumber}</p> }
                        </div> */}
                        <div className="form-group col-span-1">
                            <label htmlFor="input1">Email ID<span className='text-red-500'>*</span></label>
                            <input type="text" name='emailID' value={formData.emailID} placeholder="Email ID" autoComplete='off' maxLength={dataLength.EMAIL} onChange={handleChange}/>
                            { errors.emailID && <p className='error-message'>{errors.emailID}</p> }
                        </div>
                        <div className="form-group col-span-1">
                            <label htmlFor="input2">Role<span className='text-red-500'>*</span></label>
                            <select name='role' value={formData.role} onChange={handleChange}>
                                <option value={''}>Select</option>
                                {
                                    roleList?.length > 0 && roleList.map((role, index) => {
                                        return <option key={index} value={role.roleId}>{role.roleName}</option>
                                    })
                                }
                            </select>
                            { errors.role && <p className='error-message'>{errors.role}</p> }
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
