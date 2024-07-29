import React, { useEffect, useRef, useState } from "react";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import {
  faTrash,
  faUser,
  faEnvelope,
  faMobileScreenButton,
  faLocationDot,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../../../utils/axios";
import { encryptData, decryptData } from "../../../utils/encryptData";
import CommonFooter from "../../../common/CommonFooter";
import PublicHeader from "../../../common/PublicHeader";
import { Link } from "react-router-dom";
import { logOutUser } from "../../../utils/utilityFunctions";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { Logout } from "../../../utils/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Profile() {
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();
  const publicUserId = decryptData(
    new URLSearchParams(location.search).get("publicUserId")
  );
  // const languages = ["English", "ଓଡ଼ିଆ"];
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [errors, setErrors] = useState({}); //to show error message
  const [isEmailVerified, setIsEmailVerified] = useState(true); //to show valid email
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNo: "",
    emailId: "",
    language: "English",
    password: "",
    publicUserId: "",
    lastLogin: "",
    fileId:""
  });
  const [activityData, setActivityData] = useState([]);

  //handle Location....................................................
  const [selectedDistance, setSelectedDistance] = useState("");
  // Function to handle distance selection
  const handleDistanceSelect = (e, distance) => {
    e.preventDefault();
    setSelectedDistance(distance);
    // You can perform additional actions here, such as sending notifications or updating state
  };
  console.log("locaton is .....", selectedDistance);
  // API call to fetch preferred activities data
  async function getActivitiesData() {
    try {
      let res = await axiosHttpClient("VIEW_FILTER_OPTIONS_API", "get");
      console.log("getActivitiesData", res);
      setActivityData(res.data.fetchActivityMaster[0]);
    } catch (err) {
      console.log("there is an error ", err);
    }
  }
  useEffect(() => {
    getActivitiesData();
  }, []);
  // const [inputdata, setInputdata] = useState(formData);

  const handleActivityToggle = (e, activity) => {
    e.preventDefault();
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(
        selectedActivities.filter((item) => item !== activity)
      );
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
    console.log("selectedActivities", selectedActivities);
  };

  //--------------Validation--------------------------------
  const validateFormData = (formData) => {
    // Password validation regex
    const passwordRegex = /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/;

    // Name validation regex (assuming it contains only letters and spaces)
    const nameRegex = /^[A-Z][a-zA-Z]*$/;

    // Mobile Number validation regex
    const mobileNoRegex = /^(\d{3})[- ]?(\d{3})[- ]?(\d{4})$/;

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {};
    // Validate password
    if (
      reenteredPassword.trim() !== "" &&
      !passwordRegex.test(formData.password.trim())
    ) {
      console.log("Invalid password format");
      // Show a warning message
      // alert("Password must contain only letters, numbers, and special characters.");
      // return false;
      newErrors.password =
        "Password must contain only letters, numbers, and special characters.";
    }

    // Validate name
    if (
      !nameRegex.test(formData.firstName.trim()) ||
      !nameRegex.test(formData.lastName.trim())
    ) {
      console.log("Invalid name format");
      // Show a warning message
      // alert("Name must contain only letters.");
      // return false;
      newErrors.name = "Name must contain only letters.";
    }

    // Validate email
    if (!mobileNoRegex.test(formData.phoneNo.trim())) {
      console.log("Invalid mobile number format");
      // Show a warning message
      // alert("Invalid email format.");
      // return false;
      newErrors.phoneNo = "Invalid mobile number format.";
    }

    // Validate email
    if (!emailRegex.test(formData.emailId.trim())) {
      console.log("Invalid email format");
      // Show a warning message
      alert("Invalid email format.");
      // return false;
      newErrors.email = "Invalid email format.";
      setIsEmailVerified(false);
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

    try {
      let updatedFormData = { ...formData };

      //check validation
      if (!validateFormData(formData)) {
        return; // Stop execution if validation fails
      }

      // Check if the reentered password field is not empty and matches the new password
      // if (formData.password.trim() === "" && reenteredPassword.trim() === "") {
      // } else if (formData.password.trim() !== reenteredPassword.trim()) {
      //   console.log("Passwords do not match");
      //   alert(
      //     "Passwords do not match. Please make sure your passwords match before updating."
      //   );
      //   return;
      // }

      let profilePic = [];

      if(photoUrl.data != null){
        profilePic = [
          { fileId: formData.fileId, data: photoUrl.data }
        ];
      }

      // Log form data before updating
    console.log("Form Data Before Update:", formData);
    console.log("profile photo Before Update:", profilePic);
    console.log("location Before Update:", selectedDistance);
    console.log("Activity Before Update:", selectedActivities.map((activity) => {
      return (activity);
    }));

      let response = await axiosHttpClient(
        "PROFILE_DATA_UPDATE_API",
        "put",
        {
          // publicUserId: formData.publicUserId,
          encryptFirstName: encryptData(formData.firstName),
          encryptMiddleName: encryptData(formData.middleName),
          encryptLastName: encryptData(formData.lastName),
          encryptEmail: encryptData(formData.emailId),
          encryptPhoneNo: encryptData(formData.phoneNo),
          encryptActivities: selectedActivities.map((activity) => {
            return (activity);
          }),
          isEmailVerified:isEmailVerified,
          profilePicture: profilePic,
          encryptPrefredLocation: selectedDistance,
          encryptLanguagePreference: formData.language,
        },
        null
      );

      // Log updated form data after successful update
      console.log("Updated Form Data:", {
        encryptFirstName: (formData.firstName),
          encryptMiddleName: (formData.middleName),
          encryptLastName: (formData.lastName),
          encryptEmail: (formData.emailId),
          encryptPhoneNo: (formData.phoneNo),
          encryptActivities: selectedActivities.map((activity) => {
            return (activity);
          }),
          isEmailVerified:isEmailVerified,
          profilePicture: profilePic,
          encryptPrefredLocation: selectedDistance,
          encryptLanguagePreference: formData.language,
      });

      console.log("Update response:", response.data.data);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  //profile photo handler

  const [photoUrl, setPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {f
  //       setPhotoUrl(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (parseInt(file.size / 1024) <= 500) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setPhotoUrl({
            name: file.name,
            data: reader.result,
          });
          console.log("Photo URL", {
            name: file.name,
            data: reader.result,
          });
        };

        reader.readAsDataURL(file);
      } else {
        toast.dismiss();
        toast.warning("Kindly choose a file with size less than 500 KB");
      }
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
  const handleLogout = (e) => {
    // logOutUser(e);
    dispatch(Logout());
    async function logOutAPI() {
      try {
        let res = await axiosHttpClient("LOGOUT_API", "post");
        console.log(res.data);
        toast.success("Logged out successfully!!", {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
    logOutAPI();
  };

  // get profile data from api
  async function fetchProfileDetails() {
    try {
      let res = await axiosHttpClient("PROFILE_DATA_VIEW_API", "post");
      console.log("response of fetch profile api", res.data);

      let userName = decryptData(res.data.public_user[0].userName);
      let firstName = decryptData(res.data.public_user[0].firstName);
      let middleName = decryptData(res.data.public_user[0].middleName);
      let lastName = decryptData(res.data.public_user[0].lastName);
      let phoneNo = decryptData(res.data.public_user[0].phoneNo);
      let emailId = decryptData(res.data.public_user[0].emailId);
      let language = res.data.public_user[0].language;
      let password = decryptData(res.data.public_user[0].password);
      let profileImg = res.data.public_user[0].url;
      let publicUserId = res.data.public_user[0].userId;
      let lastLogin = res.data.public_user[0].lastLogin;
      let loc = res.data.public_user[0].location;
      let fileId = res.data.public_user[0].fileId;
      

      setFormData({
        userName: userName || "",
        firstName: firstName || "",
        middleName: middleName || "",
        lastName: lastName || "",
        emailId: emailId || "",
        phoneNo: phoneNo || "",
        language: language || "English",
        password: password || "",
        publicUserId: publicUserId || 0,
        lastLogin: lastLogin || "",
        fileId: fileId || "",
      });
      setSelectedDistance(loc); //set locatin from api
      setSelectedLanguage(language || "English");
      setPhotoUrl(profileImg);
    } catch (error) {
      console.error(error);
      if (error.respone.status == 401) {
        toast.error("You are logged out. Kindly login first.", {
          autoClose: 3000, // Toast timer duration in milliseconds
          onClose: () => {
            // Navigate to another page after toast timer completes
            setTimeout(() => {
              navigate("/");
            }, 1000); // Wait 1 second after toast timer completes before navigating
          },
        });
      }
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

    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };
      // updateLanguageInAPI(updatedFormData); // Update API
      console.log("here input data", updatedFormData);
      return updatedFormData;
    });

    // if (name === "language") {
    //   setSelectedLanguage(value);
    // }
  };

  const handleButtonClick = (e, language) => {
    setFormData((prevData) => ({
      ...prevData,
      language: language,
    }));
    setSelectedLanguage(language);
    console.log("language", formData.language);
  };

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
                <div className="profile-about-icon">
                  <FontAwesomeIcon icon={faUser} />
                  <p>{formData.firstName + " " + formData.lastName}</p>
                </div>

                <div className="profile-about-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <p>{formData.emailId}</p>
                </div>

                <div className="profile-about-icon">
                  <FontAwesomeIcon icon={faMobileScreenButton} />
                  <p>{formData.phoneNo}</p>
                </div>
              </div>
            </div>
            <div>
              <ul className="profile-button--Section">
                <li>
                  <Link
                    to="/Profile"
                    className="profile-button"
                    style={{ color: "white", backgroundColor: "green" }}
                  >
                    Edit User Profile
                  </Link>
                </li>
                <li>
                  <Link to="/profile/booking-details" className="">
                    Booking Details
                  </Link>
                </li>
                <li>
                  <Link to="/UserProfile/Favorites">Favorites</Link>
                </li>
              </ul>
              {/* Logout Button */}
              <button
                className="button-67 "
                onClick={(e) => {
                  handleLogout(e);
                  navigate("/");
                }}
              >
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
                  <img
                    src={photoUrl.data}
                    alt="Uploaded"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <div className="profileIcon">
                    <FontAwesomeIcon icon={faCircleUser} />
                    <button>Add Photo</button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="photoInput"
                  name="photoInput"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                {photoUrl && (
                  <button type="button" onClick={clearPhoto}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: "#a41e1e" }}
                    />
                  </button>
                )}
              </div>

              <div className="profile-formContainer">
                <div className="profile-formContainer_Inner">
                  <label htmlFor="firstName">
                    First Name<span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={handleData}
                  />

                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="profile-formContainer_Inner">
                  <label htmlFor="middleName">
                    Middle Name<span className="required-asterisk"></span>
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    placeholder="Enter middle Name"
                    value={formData.middleName}
                    onChange={handleData}
                  />

                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="profile-formContainer_Inner">
                  <label htmlFor="lastName">
                    Last Name<span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={handleData}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="profile-formContainer_Inner">
                  <label htmlFor="phoneNo">
                    Mobile No<span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNo"
                    placeholder="Enter Mobile Number"
                    value={formData.phoneNo}
                    onChange={handleData}
                  />
                  {errors.phoneNo && (
                    <span className="error">{errors.phoneNo}</span>
                  )}
                </div>

                <div className="profile-formContainer_Inner">
                  <label htmlFor="email">
                    Email<span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailId"
                    placeholder="Enter Email"
                    value={formData.emailId}
                    onChange={handleData}
                  />
                  {errors.email && (
                    <span className="error">{errors.email}</span>
                  )}
                </div>

                {/* <div className="profile-formContainer_Inner">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleData}
                  >
                    <option>English</option>
                    <option>ଓଡ଼ିଆ</option>
                  </select>
                </div> */}

                <div className="profile-rightside--divided">
                  <label className="profile-rightside--Form-label">
                    Language
                  </label>
                  <div>
                    <button
                      type="button"
                      onClick={(e) => handleButtonClick(e, "English")}
                      className={selectedLanguage === "English" ? "active" : ""}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleButtonClick(e, "ଓଡ଼ିଆ")}
                      className={selectedLanguage === "ଓଡ଼ିଆ" ? "active" : ""}
                    >
                      ଓଡ଼ିଆ
                    </button>
                  </div>
                </div>

                <div className="preffered-activity">
                  <label htmlFor="">
                    <span>Preferred Location</span>
                  </label>
                  <div className="distance-dropdown">
                    <div className="dropdown">
                      <button className="dropbtn">
                        <FontAwesomeIcon icon={faMap} /> &nbsp;
                        {selectedDistance
                          ? `${selectedDistance}`
                          : "Select Location"}
                      </button>
                      <div className="dropdown-content">
                        <button
                          onClick={(e) => handleDistanceSelect(e, "Patia")}
                        >
                          Patia
                        </button>
                        <button
                          onClick={(e) =>
                            handleDistanceSelect(e, "Chandrashekharpur")
                          }
                        >
                          Chandrashekharpur
                        </button>
                        <button
                          onClick={(e) => handleDistanceSelect(e, "Damana")}
                        >
                          Damana
                        </button>
                        <button
                          onClick={(e) =>
                            handleDistanceSelect(e, "Jayadev Vihar")
                          }
                        >
                          Jayadev Vihar
                        </button>
                        <button
                          onClick={(e) =>
                            handleDistanceSelect(e, "Saheed Nagar")
                          }
                        >
                          Saheed Nagar
                        </button>
                        <button
                          onClick={(e) =>
                            handleDistanceSelect(e, "Madhusudan Nagar")
                          }
                        >
                          Madhusudan Nagar
                        </button>
                        <button
                          onClick={(e) => handleDistanceSelect(e, "Nayapalli")}
                        >
                          Nayapalli
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="nearby-location">
                  <label htmlFor="nearby location">Preferred Location</label>
                  <div className="preferred-locations ">
                    <button>
                      <span>Patia</span>
                    </button>
                    <button>
                      <span>Jaydev vihar</span>
                    </button>
                    <button>
                      <span>Vani vihar</span>
                    </button>
                    <button>
                      <span>Baramunda</span>
                    </button>

                  </div>
                </div> */}
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
                  {activityData?.length > 0 &&
                    activityData.map((activity) => {
                      return (
                        <button
                          className={`select-none rounded-lg border border-gray py-3 px-6 text-center font-sans text-xs uppercase ${
                            selectedActivities.includes(activity.userActivityId)
                              ? "border-solid bg-green-800 text-white"
                              : "border-solid border border-gray-600 "
                          } text-black`}
                          onClick={(e) =>
                            handleActivityToggle(e, activity.userActivityId)
                          }
                        >
                          <span>{activity.userActivityName}</span>
                        </button>
                      );
                    })}

                  {/* Add more buttons for other activities */}
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg"
                  id="ProfileActButton"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                {/* </form> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
