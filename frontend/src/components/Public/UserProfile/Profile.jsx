import React, { useEffect, useRef, useState } from "react";
import "./Profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import axiosHttpClient from "../../../utils/axios";
import { encryptData, decryptData } from "../../../utils/encryptData";

export default function Profile() {
  // function clearPhoto() {
  //   const photoInput = document.getElementById("photo");
  //   photoInput.value = ""; // Clear the value of the file input
  // }

  const [selectedActivities, setSelectedActivities] = useState([]);
  const [formData, setFormData] = useState({});
  const [inputdata, setInputdata] = useState(formData);

  const handleActivityToggle = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(
        selectedActivities.filter((item) => item !== activity)
      );
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission with selectedActivities
    console.log(selectedActivities);
  };

  //profile phhoto

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
      // setFormData({
      //   ...formData, ['firstName']: firstName
      // });
      setFormData({
        userName: userName || '',
        firstName: firstName || '',
        lastName: lastName || '',
        emailId: emailId || '',
        phoneNo: phoneNo || '',
        language: language || '',
        password: password || '',
      })
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleData = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("here input data", formData)
  }

  // on page load
  useEffect(() => {
    fetchProfileDetails();

  }, []);

  return (
    <main>
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
                <a href="#" className="">
                  {/* <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2V6m0 4v10a1 1 0 01-1 1h-3m-6 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4m0-6V5a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4"
                    ></path>
                  </svg> */}
                  Edit User Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                // className="flex items-center p-2 text-zinc-700 hover:bg-zinc-100 rounded-lg"
                >
                  {/* <svg
                    className="w-6 h-6 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 32 32"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M 16 3 C 14.136719 3 12.601563 4.277344 12.15625 6 L 3 6 L 3 26 L 29 26 L 29 6 L 19.84375 6 C 19.398438 4.277344 17.863281 3 16 3 Z M 16 5 C 16.808594 5 17.429688 5.386719 17.75 6 L 14.25 6 C 14.570313 5.386719 15.191406 5 16 5 Z M 5 8 L 27 8 L 27 17 L 5 17 Z M 16 14 C 15.449219 14 15 14.449219 15 15 C 15 15.550781 15.449219 16 16 16 C 16.550781 16 17 15.550781 17 15 C 17 14.449219 16.550781 14 16 14 Z M 5 19 L 27 19 L 27 24 L 5 24 Z"
                    ></path>
                  </svg> */}
                  Booking Details
                </a>
              </li>
              <li>
                <a href="#">
                  {/* <svg
                    className="w-6 h-6 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 12 1 C 8.6761905 1 6 3.6761905 6 7 L 6 8 C 4.9 8 4 8.9 4 10 L 4 20 C 4 21.1 4.9 22 6 22 L 18 22 C 19.1 22 20 21.1 20 20 L 20 10 C 20 8.9 19.1 8 18 8 L 18 7 C 18 3.6761905 15.32381 1 12 1 z M 12 3 C 14.27619 3 16 4.7238095 16 7 L 16 8 L 8 8 L 8 7 C 8 4.7238095 9.7238095 3 12 3 z M 8 14 C 8.55 14 9 14.45 9 15 C 9 15.55 8.55 16 8 16 C 7.45 16 7 15.55 7 15 C 7 14.45 7.45 14 8 14 z M 12 14 C 12.55 14 13 14.45 13 15 C 13 15.55 12.55 16 12 16 C 11.45 16 11 15.55 11 15 C 11 14.45 11.45 14 12 14 z M 16 14 C 16.55 14 17 14.45 17 15 C 17 15.55 16.55 16 16 16 C 15.45 16 15 15.55 15 15 C 15 14.45 15.45 14 16 14 z"></path>
                  </svg> */}
                  Change Password
                </a>
              </li>
              <li>
                <a href="#">Card Details</a>
              </li>
            </ul>
            {/* Logout Button */}
            <button className="button-67 ">
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
              <input ref={fileInputRef} type="file" id="photo" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
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
              <label htmlFor="firstName">First Name</label>
              <input type="text" name='firstName' placeholder="Enter First Name" value={formData.firstName} onChange={handleData} />
              <label htmlFor="lastName">Last Name</label>
              <input type="text" name='lastName' placeholder="Enter Last Name" value={formData.lastName} onChange={handleData} />
              <label htmlFor="email">Email</label>
              <input type="email" name='emailId' placeholder="Enter Email" value={formData.emailId} onChange={handleData} />
              <label htmlFor="language">Language</label>
              <select id="language" name='language' value={formData.language} onChange={handleData}>
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
              <label htmlFor="password">New Password</label>
              <input type="password" name='password' placeholder="Enter new Password" value={formData.password} onChange={handleData} />
              <label htmlFor="NewPassword">Reenter New Password</label>
              <input type="password" placeholder="Reenter New Password" onChange={handleData} />
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
              >
                Submit
              </button>
              {/* </form> */}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
