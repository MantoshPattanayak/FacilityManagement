import React, { useEffect, useState } from 'react';
import axiosHttpClient from '../../../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../common/AdminHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { dataLength } from '../../../../utils/regexExpAndDataLength';
import './CreateEventCategory.css';
import { decryptData } from '../../../../utils/encryptData';

export default function EditEventCategory() {
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
  const location = useLocation();
  const action = new URLSearchParams(location.search).get('action');
  const serviceId = decryptData(new URLSearchParams(location.search).get('s'));

  async function fetchServiceDetailsById() {
    try {
      let response = await axiosHttpClient('VIEW_SERVICE_BY_ID_API', 'get', {}, serviceId);
      console.log('response of fetched service details', response.data.data);
      let { code, description, statusId } = response.data.data;
      setFormData({ code, description, statusId, serviceId });
    }
    catch(error) {
      console.error(error);
    }
  }

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

  //function to seek confirmation
  function handleConfirmation(e) {
    e.preventDefault();
    toast.dismiss();
    // Disable interactions with the background
    document.querySelectorAll('.CreateNewServiceContainer')[0].style.pointerEvents = 'none';
    document.querySelectorAll('.CreateNewServiceContainer')[0].style.opacity = 0.4;

    toast.warn(
      <div>
        <p>Are you sure you want to proceed?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
              // Re-enable interactions with the background
              document.querySelectorAll('.CreateNewServiceContainer')[0].style.pointerEvents = 'auto';
              document.querySelectorAll('.CreateNewServiceContainer')[0].style.opacity = 1;
              toast.dismiss();
            }}
            className="bg-green-400 text-white p-2 border rounded-md"
          >
            Yes
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Re-enable interactions with the background
              document.querySelectorAll('.CreateNewServiceContainer')[0].style.pointerEvents = 'auto';
              document.querySelectorAll('.CreateNewServiceContainer')[0].style.opacity = 1;
              toast.dismiss();
              toast.error('Action cancelled!', {
                position: "top-right",
                autoClose: 3000,
              });
            }}
            className="bg-red-400 text-white p-2 border rounded-md"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false, // Disable auto close
        closeOnClick: false, // Disable close on click
        onClose: () => {
          // Re-enable interactions with the background if the toast is closed
          document.body.style.pointerEvents = 'auto';
        }
      }
    );
    return;
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
      let res = await axiosHttpClient('UPDATE_SERVICE_API', 'put', formData);

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

  // run on page load
  useEffect(() => {
    fetchServiceDetailsById();
  }, [])

  // refresh component on change of refresh state variable
  useEffect(() => {

  }, [refresh]);

  return (
    <div>
      <AdminHeader />
      <div className="CreateNewServiceContainer">
        <div className="form-heading">
          <h2>Edit/View Service details</h2>
          <div className="flex flex-col-reverse items-end w-[100%]">
            <button
              className='back-button'
              onClick={(e) => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
          </div>
          <div className="grid grid-rows-2 grid-cols-2 gap-x-16 gap-y-2 w-[100%]">
            <div className="form-group col-span-1">
              <label htmlFor="input2">Service Code <span className='text-red-500'>*</span></label>
              <input type="text" name='code' value={formData.code} placeholder="Enter Code" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} disabled={action=="view" ? true: false} />
              {errors.code && <p className='error-message'>{errors.code}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Service Description <span className='text-red-500'>*</span></label>
              <input type='text' name='description' value={formData.description} placeholder="Enter Description" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_LONG} onChange={handleChange} disabled={action=="view" ? true: false} />
              {errors.description && <p className='error-message'>{errors.description}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Status<span className='text-red-500'>*</span></label>
              <select name='statusId' value={formData.statusId} placeholder="Enter Description" autoComplete='off' onChange={handleChange} disabled={action=="view" ? true: false}>
                <option value={''}>Select</option>
                <option value={'1'}>ACTIVE</option>
                <option value={'2'}>INACTIVE</option>
              </select>
              {errors.description && <p className='error-message'>{errors.description}</p>}
            </div>
          </div>
          <div className="buttons-container">
            <button className="approve-button" onClick={handleConfirmation} disabled={action=="view" ? true: false}>Submit</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
