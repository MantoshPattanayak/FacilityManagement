import { useState, useEffect } from 'react';
import AdminHeader from '../../../../common/AdminHeader';
import './ActionAgainstGrievance.css';
import { regex, dataLength } from '../../../../utils/regexExpAndDataLength';
import axiosHttpClient from '../../../../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from '../../../../utils/encryptData';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import instance from '../../../../../env';
import { formatDate } from '../../../../utils/utilityFunctions';

export default function ActionAgainstGrievance() {

  const location = useLocation();
  const grievanceId = decryptData(new URLSearchParams(location.search).get('g'));
  const action = new URLSearchParams(location.search).get('action');
  const navigate = useNavigate();

  let initialFormData = {
    grievanceMasterId: '',
    fullname: '',
    phoneNo: '',
    emailId: '',
    subject: '',
    details: '',
    filepath: '',
    createdOn: '',
    response: '',
    responseFilePath: '',
    actionTakenDate: '',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [responseFile, setResponseFile] = useState({
    name: '',
    data: ''
  });

  //function to call API to fetch grievance details
  async function fetchGrievanceDetails() {
    try {
      let res = await axiosHttpClient('ADMIN_VIEW_GRIEVANCE_BY_ID_API', 'get', null, grievanceId);

      console.log('response', res.data.grievanceDetails);
      setFormData(res.data.grievanceDetails);
    }
    catch (error) {
      console.error(error);
    }
  }

  // validate user input function
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

    // if (data.middleName) {
    //     if (!regex.NAME.test(data.middleName)) {
    //         errors.middleName = "Middle name is incorrect."
    //     }
    // }
    // else {
    //     // errors.middleName = "Please provide middle name."
    // }

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

  // store user input on entry
  function handleChange(e) {
    e.preventDefault();
    setErrors({});
    let { name, value } = e.target;
    if (name == 'responseFilePath') {
      let file = e.target.files[0];
      console.log('response file attachment', file);
      if (isImageFile(file.name)) {
        document.getElementById('responseFilePath').reset();
        toast.warning('Please select image file.')
        return;
      }
      else {
        if (parseInt(file.size / 1024) <= 200) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setResponseFile({
              name: file.name,
              data: reader.result
            })
          }
        }
        else {
          toast.warning('Kindly choose an image with size less than 200 KB.');
          return;
        }
      }
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
    console.log('formData', formData);
    return;
  }

  //function to seek confirmation
  function handleConfirmation(e) {
    e.preventDefault();
    toast.warn(
      <div>
        <p>Are you sure you want to proceed?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => handleSubmit(e)} className='bg-green-400 text-white p-2 border rounded-md'>Yes</button>
          <button onClick={() => {
            toast.dismiss();
            toast.error('Action cancelled!', {
              // position: toast.POSITION.TOP_CENTER,
              // autoClose: 3000,
            });
          }} className='bg-red-400 text-white p-2 border rounded-md'>No</button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false, // Disable auto close
        closeOnClick: false, // Disable close on click
      }
    );
    return;
  }

  //function to submit user response
  async function handleSubmit(e) {
    e.preventDefault();

    setErrors({});

    let errors = validateUserInput(formData);

    if (Object.keys(errors).length <= 0) {
      try {
        let response = await axiosHttpClient('ADMIN_USER_UPDATE_API', 'put', {
          grievanceId: formData.grievanceId,
          title: formData.title,
          fullName: formData.firstName + (formData.middleName ? ' ' + formData.middleName : '') + (formData.lastName ? ' ' + formData.lastName : ''),
          userName: null,
          // altMobileNumber: formData.altMobileNumber,
          mobileNo: formData.mobileNumber,
          emailId: formData.emailID,
          roleId: formData.role,
          statusId: formData.status,
          genderId: null,
        }, null);

        console.log(response.data);
        toast.success('User details updated successfully.', {
          autoClose: 2000,
          onClose: () => {
            setTimeout(() => {
              navigate('/UAC/Users/ListOfUsers');
            }, 1000);
          }
        });
      }
      catch (error) {
        console.error(error);
        toast.error('User details updation failed. Please try again.');
      }
    }
    else {
      setErrors(errors);
      console.log(errors);
      toast.error('User details updation failed. Please try again.');
    }
  }

  // function to determine if file is an image or not
  const isImageFile = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.tif', '.ico'];
    const fileExtension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  // fetch grievance details on page load
  useEffect(() => {
    fetchGrievanceDetails();
    document.title = 'ADMIN | AMA BHOOMI';
  }, [])

  return (
    <div className='grievance-action'>
      <AdminHeader />
      <div className="form-container">
        <div className="form-heading">
          <h2>{action == 'view' ? "View Grievance Details" : "Take action against grievance"}</h2>
          <div className="flex flex-col-reverse items-end w-[100%]">
            <button
              className='back-button'
              onClick={(e) => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
          </div>
          <div className="grid lg:grid-rows-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 lg:gap-x-2 gap-y-4 w-[100%]">
            <div className="form-group col-span-1">
              <label htmlFor="input2">Grievant Name</label>
              <input type="text" name='fullname' value={formData.fullname} placeholder="First name" autoComplete='off' maxLength={dataLength.NAME} onChange={handleChange} disabled />
              {errors.fullname && <p className='error-message'>{errors.fullname}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input3">Phone Number</label>
              <input type="text" name='phoneNo' value={formData.phoneNo} placeholder="Middle name" autoComplete='off' maxLength={dataLength.PHONE_NUMBER} onChange={handleChange} disabled />
              {errors.phoneNo && <p className='error-message'>{errors.phoneNo}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input1">Email ID</label>
              <input type="text" name='emailId' value={formData.emailId} placeholder="Email ID" autoComplete='off' maxLength={dataLength.EMAIL} onChange={handleChange} disabled />
              {errors.emailId && <p className='error-message'>{errors.emailId}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input1">Subject</label>
              <input type="text" name='subject' value={formData.subject} placeholder="Email ID" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} disabled />
              {errors.subject && <p className='error-message'>{errors.subject}</p>}
            </div>
            <div className="form-group col-span-2 w-full">
              <label htmlFor="input1">Details</label>
              <textarea type="text" name='details' className='w-full' rows={5} value={formData.details} placeholder="Email ID" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_LONG} onChange={handleChange} disabled />
              {errors.details && <p className='error-message'>{errors.details}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input1">Grievance Posted On</label>
              <input type="text" name='createdOn' value={formatDate(formData.createdOn)} placeholder="Email ID" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} disabled />
              {errors.createdOn && <p className='error-message'>{errors.createdOn}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input1">Grievance File Attachment</label>
              {
                (
                  <a
                    href={formData.filepath ? instance().baseURL + '/static' + formData.filepath : ''}
                    target='_blank'
                    rel="noopener noreferrer"
                    disabled={formData.filepath ? false : true}
                    className='border rounded-md p-1 max-w-min'
                  >
                    View
                  </a>
                )
              }
            </div>
            <div className="form-group col-span-2 w-full">
              <label htmlFor="input1">Action response<span className='text-red-500'>*</span></label>
              <textarea type="text" name='details' className='w-full' rows={5} value={formData.response} placeholder="Enter response" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_LONG} onChange={handleChange} />
              {errors.details && <p className='error-message'>{errors.details}</p>}
            </div>
            <div className="form-group col-span-2">
              <label htmlFor="input1">File<span className='text-red-500'>*</span></label>
              {
                formData.responseFilePath ? (
                  <a
                    href={formData.responseFilePath ? instance().baseURL + '/static' + formData.responseFilePath : ''}
                    target='_blank'
                    rel="noopener noreferrer"
                    disabled={formData.filepath ? false : true}
                    className='border rounded-md p-1 max-w-min'
                  >
                    View
                  </a>
                ) : <div className="upload-btn-wrapper">
                  <span className='flex justify-center'>
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="Upload_Iocn" />
                  </span>
                  <input
                    className="form-input"
                    id="facilityArrayOfImages"
                    name="facilityArrayOfImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                  />
                  <p className="italic text-sm font-bold text-gray-500 flex justify-center">
                    Max. Each image should be less than 200 KB.
                  </p>
                  <div className="image-preview" id="imagePreview">
                    { responseFile.name }
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="buttons-container">
            <button type='submit' className={`approve-button ${(action == 'view') ? 'hidden' : ''}`} onClick={handleConfirmation} disabled={action == 'view' ? true : false}>Submit</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
