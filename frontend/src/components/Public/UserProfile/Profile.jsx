import React, { useEffect, useRef, useState } from "react";
import "./Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import axiosHttpClient from "../../../utils/axios";
import { encryptData, decryptData } from "../../../utils/encryptData";
import CommonFooter from "../../../common/CommonFooter";
import PublicHeader from "../../../common/PublicHeader";
import { Link } from "react-router-dom"; import { logOutUser } from "../../../utils/utilityFunctions";
import { useNavigate } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { Logout } from "../../../utils/authSlice";
export default function Profile() {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();
  const publicUserId = decryptData(
    new URLSearchParams(location.search).get("publicUserId")
  );
  const [reenteredPassword, setReenteredPassword] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [errors, setErrors] = useState({});  //to show error message
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    language: '',
    password: '',
    userId: ''
  });
  // const [inputdata, setInputdata] = useState(formData);

  const handleActivityToggle = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(
        selectedActivities.filter((item) => item !== activity)
      );
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };


  //--------------Validation--------------------------------
  const validateFormData = (formData) => {
    // Password validation regex
    const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/;

    // Name validation regex (assuming it contains only letters and spaces)
    const nameRegex = /^[A-Z][a-zA-Z]*$/;

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {};
    // Validate password
    if (reenteredPassword.trim() !== '' && !passwordRegex.test(formData.password.trim())) {
      console.log("Invalid password format");
      // Show a warning message
      // alert("Password must contain only letters, numbers, and special characters.");
      // return false;
      newErrors.password = "Password must contain only letters, numbers, and special characters.";
    }

    // Validate name
    if (!nameRegex.test(formData.firstName.trim()) || !nameRegex.test(formData.lastName.trim())) {
      console.log("Invalid name format");
      // Show a warning message
      // alert("Name must contain only letters.");
      // return false;
      newErrors.name = "Name must contain only letters.";
    }

    // Validate email
    if (!emailRegex.test(formData.emailId.trim())) {
      console.log("Invalid email format");
      // Show a warning message
      // alert("Invalid email format.");
      // return false;
      newErrors.email = "Invalid email format.";
    }

    // return true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission with selectedActivities
    console.log("Selected Activities:", selectedActivities);
  };

  //After clicking submit button Data willl upadate to api from here
  const handleUpdate = async (e) => {
    e.preventDefault();
    // handle form submission with selectedActivities
    console.log("Selected Activities:", selectedActivities); // Log selected activities

    // Log form data before updating
    console.log("Form Data Before Update:", formData);

    try {
      let updatedFormData = { ...formData };

      //check validation
      if (!validateFormData(formData)) {
        return; // Stop execution if validation fails
      }

      // Check if the reentered password field is not empty and matches the new password
      if (formData.password.trim() === '' && reenteredPassword.trim() === '') {
        // No password change, proceed with updating other data
      } else if (formData.password.trim() !== reenteredPassword.trim()) {
        console.log("Passwords do not match");
        // Show a warning message
        alert("Passwords do not match. Please make sure your passwords match before updating.");
        return;
      }

      let response = await axiosHttpClient('PROFILE_DATA_UPDATE_API', 'put', {
        publicUserId: formData.publicUserId,
        firstName: encryptData(formData.firstName),
        lastName: encryptData(formData.lastName),
        emailId: encryptData(formData.emailId),
        language: encryptData(formData.language),
        password: encryptData(formData.password)
      }, null);

      // Log updated form data after successful update
      console.log('Updated Form Data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailId: formData.emailId,
        language: formData.language,
        password: formData.password
      });

      console.log('Update response:', response.data.data);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  //profile photo handler

  const [photoUrl, setPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileClick = () => {
    if (!photoUrl) {
      fileInputRef.current.click();
    }
  };

  const clearPhoto = () => {
    setPhotoUrl(null);
  };
  //handle for Logout ------------------------------------
  const handleLogout=()=>{
    dispatch(Logout());
    navigate('/')
  }

  // get profile data from api
  async function fetchProfileDetails() {
    try {
      let res = await axiosHttpClient('PROFILE_DATA_VIEW_API', 'post');
      console.log('response of fetch profile api', res.data.public_user);

      let userName = decryptData(res.data.public_user.userName);
      let firstName = decryptData(res.data.public_user.firstName);
      let lastName = decryptData(res.data.public_user.lastName);
      let emailId = decryptData(res.data.public_user.emailId);
      let phoneNo = decryptData(res.data.public_user.phoneNo);
      let language = decryptData(res.data.public_user.language);
      let password = decryptData(res.data.public_user.password);

      setFormData({
        userName: userName || '',
        firstName: firstName || '',
        lastName: lastName || '',
        emailId: emailId || '',
        phoneNo: phoneNo || '',
        language: language || '',
        password: password || '',
        publicUserId: res.data.public_user.publicUserId
      })
    }
    catch (error) {
      console.error(error);
    }
  }

  // Handle the input changes
  const handleData = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    // if (name === 'password') {
    //   if (value === reenteredPassword && value.trim() !== '') {
    //     // Passwords match and are not empty, update password
    //     console.log("Passwords match, updating password");
    //     setFormData(prevFormData => ({
    //       ...prevFormData,
    //       password: value
    //     }));
    //   }
    // }

    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [name]: value };
      console.log("here input data", updatedFormData);
      return updatedFormData;
    });

  };

  // here Validation -----------------------------
  // const validatation=()=>{
  //   const err={};



  //   return;
  // }

  // on page load
  useEffect(() => {
    fetchProfileDetails();
  }, []);




  return (
    <main>
      <div>
        <PublicHeader />
        <div className="profile--Main-Box">
          {/* left side-section */}
          <aside className="profile-leftside--Body">
            <div className="profile-view--Body">
              <div className="profile-about">
                <p>{formData.userName}</p>
                <p>{formData.emailId}</p>
                <p>{formData.phoneNo}</p>
              </div>
            </div>
            <div>
              <ul className="profile-button--Section">
                <li>
                  <Link
                    to="/ProfileHistory"
                    className="profile-button"
                    style={{ color: 'white', backgroundColor: "green" }}
                  >
                    Edit User Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile/booking-details"
                    className=""
                  >
                    Booking Details
                  </Link>
                </li>
                <li>
                  <Link to="/UserProfile/Favorites">
                    Favorites
                  </Link>
                </li>

              </ul>
              {/* Logout Button */}
              <button className="button-67 " onClick={handleLogout}>
                <h1>Logout</h1>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </button>

            </div>
          </aside>

          {/* right side-section */}
          <div className="profile-rightside--Body">
            <h1>User-Profile</h1>

            {/* form-content */}
            <form className="profile-form-Body" onSubmit={handleSubmit}>
              <div className="profilePhoto" onClick={handleProfileClick}>
                {photoUrl ? (
                  <img src={photoUrl} alt="Uploaded" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                ) : (
                  <div className="profileIcon">
                    <FontAwesomeIcon icon={faCircleUser} />
                    <button>Add Photo</button>
                  </div>

                )}
                <input ref={fileInputRef} type="file" id="photoInput" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                {photoUrl && (
                  <button type="button" onClick={clearPhoto}>
                    <FontAwesomeIcon icon={faTrash} style={{ color: "#a41e1e", }} />
                  </button>
                )}
                {!photoUrl && (
                  <input ref={fileInputRef} type="file" id="photo" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                )}

              </div>



              <div className="profile-formContainer">
                <div className="profile-formContainer_Inner">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" name='firstName' placeholder="Enter First Name" value={formData.firstName} onChange={handleData} />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="profile-formContainer_Inner">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" name='lastName' placeholder="Enter Last Name" value={formData.lastName} onChange={handleData} />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="profile-formContainer_Inner">
                  <label htmlFor="email">Email</label>
                  <input type="email" name='emailId' placeholder="Enter Email" value={formData.emailId} onChange={handleData} />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="profile-formContainer_Inner">
                  <label htmlFor="language">Language</label>
                  <select id="language" name='language' value={formData.language} onChange={handleData}>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                  </select>
                </div>

                <div className="profile-formContainer_Inner">
                  <label htmlFor="password">New Password</label>
                  <input type="password" name='password' placeholder="Enter new Password" value={formData.password} onChange={handleData} />
                </div>

                <div className="profile-formContainer_Inner">
                  <label htmlFor="NewPassword">Reenter New Password</label>
                  <input type="password" placeholder="Reenter New Password" value={reenteredPassword} onChange={(e) => setReenteredPassword(e.target.value)} />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>
              </div>

              {/* choose preffered Activity */}
              <div className="profile--Activity-Box">
                <h2>
                  Preferred Activities{" "}
                  <span className="text-sm text-zinc-500">
                    (user can select multiple activities)
                  </span>
                </h2>
                {/* <form onSubmit={handleSubmit}> */}
                <div className="profile--Activity-options">
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Running")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Running")}
                  >
                    <span>🏃 Running</span>
                  </button>
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Yoga")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Yoga")}
                  >
                    <span>🧘 Yoga</span>
                  </button>
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Open-Gym")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Open-Gym")}
                  >
                    <span>🏋️ Open-Gym</span>
                  </button>
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Swimming")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Swimming")}
                  >
                    <span>🏊 Swimming</span>
                  </button>
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Cricket")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Cricket")}
                  >
                    <span>🏏 Cricket</span>
                  </button>
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Football")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Football")}
                  >
                    <span>⚽ Football</span>
                  </button>
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Volleyball")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Volleyball")}
                  >
                    <span>🏐 Volleyball</span>
                  </button>
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Badminton")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Badminton")}
                  >
                    <span>🏸 Badminton</span>
                  </button>
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Library")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Library")}
                  >
                    <span>📚 Library</span>
                  </button>
                  <button
                    className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${selectedActivities.includes("Boating")
                      ? "border-solid bg-green-800 text-white"
                      : "border-solid border border-gray-600 "
                      } text-black`}
                    onClick={() => handleActivityToggle("Boating")}
                  >
                    <span>🛶 Boating</span>
                  </button>
                  {/* Add more buttons for other activities */}
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg"
                  id="ProfileActButton"
                  onClick={handleUpdate}
                >
                  Submit
                </button>
                {/* </form> */}
              </div>
            </form>
          </div>
        </div>
    
      </div >
    </main >
  );
}
