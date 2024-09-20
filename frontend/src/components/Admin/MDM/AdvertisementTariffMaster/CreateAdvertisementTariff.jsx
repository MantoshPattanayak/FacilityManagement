import React, { useEffect, useState } from 'react';
import axiosHttpClient from '../../../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../../../common/AdminHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faIndianRupee } from '@fortawesome/free-solid-svg-icons';
import { dataLength } from '../../../../utils/regexExpAndDataLength';
import './CreateAdvertisementTariff.css';

export default function CreateAdvertisementTariff() {
  const navigate = useNavigate();
  const [dropdownData, setDropdownData] = useState({
    durationOptionList: [],
    advertisementTypeList: []
  });
  const [formData, setFormData] = useState({
    advertisementType: '',
    amount: '', 
    durationOption: '', 
    minDuration: '', 
    maxDuration: ''
  });
  const [errors, setErrors] = useState({
    advertisementType: '',
    amount: '', 
    durationOption: '', 
    minDuration: '', 
    maxDuration: ''
  });
  const [refresh, setRefresh] = useState(false);

  async function fetchInitialData() {
    try {
        let res = await axiosHttpClient('INITIAL_AD_TARIFF_API', 'post');
        console.log('response of fetchInitialData', res.data);
        setDropdownData({
            durationOptionList: res.data.data,
            advertisementTypeList: res.data.advertisementData
        })
    }
    catch (error) {
        console.error("error at fetchInitialData API", error);
    }
  }

  // validation function to validate form data while submit
  let validation = (formData) => {
    let error = {};

    if (!formData.advertisementType) {
        error.advertisementType = 'Please select advertisement type.';
    }
    if(!formData.amount) {
        error.amount = 'Please enter amount.';
    }
    if(!formData.durationOption) {
        error.durationOption = 'Please select duration option.';
    }
    if(!formData.minDuration) {
        error.minDuration = 'Please enter minimum duration.';
    }
    if(!formData.maxDuration) {
        error.maxDuration = 'Please enter maximum duration.';
    }
    return error;
  }

  // save user input data to formData object on entering values
  let handleChange = (e) => {
    let { name, value } = e.target;
    // console.log(name, value);
    setErrors({});
    if(name == 'minDuration' || name == 'maxDuration' || name == 'amount') {
        value = value.toString().replace(/[^0-9]/g, '');
        if(name == 'minDuration' && formData.maxDuration && value && !(parseFloat(value) > 0 && parseFloat(value) < parseFloat(formData.maxDuration))) {  // if minDuration value, then check if value greater than zero and less than maxDuration
            toast.dismiss();
            toast.warn("Enter value greater than zero and less than maximum duration.");
            return;
        }
        else if (name == 'maxDuration' && formData.minDuration && value && !(parseFloat(value) >= parseFloat(formData.minDuration))) { // if maxDuration value, then check if value is greater than minDuration
            toast.dismiss();
            toast.warn("Enter value greater than minimum duration.");
            return;
        }
        setFormData({ ...formData, [name]: value });
    }
    else {
        setFormData({ ...formData, [name]: value });
    }
    
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
      let res = await axiosHttpClient('CREATE_ADVERTISEMENT_TARIFF_API', 'post', {
        ...formData,
        ["advertisementTypeId"]: formData.advertisementType
      });

      console.log('form submit response', res.data);
      toast.dismiss();
      toast.success(res.data.message, {
        autoClose: 3000, // Toast timer duration in milliseconds
        onClose: () => {
          // Navigate to another page after toast timer completes
          setTimeout(() => {
            navigate('/mdm/ViewAdvertisementTariffList');
          }, 500); // Wait 1 second after toast timer completes before navigating
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
        advertisementType: '',
        amount: '', 
        durationOption: '', 
        minDuration: '', 
        maxDuration: ''
    });

    setErrors({
      code: '',
      description: '',
    });
    setRefresh(prevState => !prevState);
  }

  // refresh component on change of refresh state variable
  useEffect(() => {}, [refresh]);

  useEffect(() => {
    fetchInitialData();
  }, [])

  return (
    <div>
      <AdminHeader />
      <div className="CreateAdvertisementTariff">
        <div className="form-heading">
          <h2>Add new advertisement tariff</h2>
          <div className="flex flex-col-reverse items-end w-[100%]">
            <button
              className='back-button'
              onClick={(e) => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
          </div>
          <div className="grid grid-rows-1 grid-cols-2 gap-y-2 w-[100%]">
            <div className="form-group col-span-1">
              <label htmlFor="input2">Advertisement Type <span className='text-red-500'>*</span></label>
              <select name='advertisementType' value={formData.advertisementType} onChange={handleChange}>
                <option value={""}>Select Advertisement Type</option>
                {
                    dropdownData.advertisementTypeList?.map((adType, index) => {
                        return(
                            <option key={index} value={adType.advertisementTypeId}>{adType.advertisementType}</option>
                        )
                    })
                }
              </select>
              {errors.advertisementType && <p className='error-message'>{errors.advertisementType}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Duration Type<span className='text-red-500'>*</span></label>
              <select name='durationOption' value={formData.durationOption} onChange={handleChange}>
                <option value={""}>Select Duration Type</option>
                {
                    dropdownData.durationOptionList?.map((durationOption, index) => {
                        return(
                            <option key={index} value={durationOption}>{durationOption}</option>
                        )
                    })
                }
              </select>
              {errors.durationOption && <p className='error-message'>{errors.durationOption}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Minimum Duration<span className='text-red-500'>*</span></label>
              <input type='text' name='minDuration' value={formData.minDuration} placeholder='Enter minimum duration' onChange={handleChange}/>
              {errors.minDuration && <p className='error-message'>{errors.minDuration}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Maximum Duration<span className='text-red-500'>*</span></label>
              <input type='text' name='maxDuration' value={formData.maxDuration} placeholder='Enter maximum duration' onChange={handleChange}/>
              {errors.maxDuration && <p className='error-message'>{errors.maxDuration}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Amount (<FontAwesomeIcon icon={faIndianRupee} size='xs'/>)<span className='text-red-500'>*</span></label>
              <input type='text' name='amount' value={formData.amount} placeholder='Enter amount (in rupee)' onChange={handleChange} />
              {errors.amount && <p className='error-message'>{errors.amount}</p>}
            </div>
          </div>
          <div className="buttons-container">
            <button className="approve-button" onClick={handleSubmit}>Submit</button>
            <button className="cancel-button" onClick={clearForm}>Cancel</button>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  )
}
