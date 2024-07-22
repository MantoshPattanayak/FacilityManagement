import React, { useRef, useState, useEffect } from "react";
import "./Grievance.css";
import PublicHeader from "../../../common/PublicHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosHttpClient from "../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const Grievance = () => {
  const [selectedForm, setSelectedForm] = useState("Grievance");

  const handleFormChange = (event) => {
    setSelectedForm(event.target.value);
  };

  return (
    <div>
      <PublicHeader />
      <div className="grievenceForm">
        <div className="heading">
          <h2>{selectedForm} Form</h2>
        </div>
        <p>
          If you want to lodge a {selectedForm.toLowerCase()}, kindly fill the
          following {selectedForm.toLowerCase()} registration form!
        </p>

        <div className="radiobutton">
          <div className="insideRadioButton">
            <input
              type="radio"
              id="grievance"
              value="Grievance"
              checked={selectedForm === "Grievance"}
              onChange={handleFormChange}
            />
            <label htmlFor="grievance">Grievance</label>
          </div>
          <div className="insideRadioButton">
            <input
              type="radio"
              id="feedback"
              value="Feedback"
              checked={selectedForm === "Feedback"}
              onChange={handleFormChange}
            />
            <label htmlFor="feedback">Feedback</label>
          </div>
        </div>

        {selectedForm === "Grievance" ? <GrievanceForm /> : <FeedbackForm />}
      </div>
    </div>
  );
};

const GrievanceForm = () => {
  const [user, setUser] = useState({
    fullname: "",
    emailId: "",
    phoneNo: "",
    subject: "",
    details: "",
    statusId: 15,
    filepath: "",
  //   filepath: {
  //     name: '',
  //     data: ''
  // },
    category: "",
    isWhatsappNumber: false,
    grievanceCategoryId: "",
  });
  const [grievanceCategoryList, setGrievanceCategoryList] = useState([]);
  const [isValidMobile, setIsValidMobile] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [isValidGrievance, setIsValidGrievance] = useState(true);
  const [isValidSubject, setIsValidSubject] = useState(true);
  const [isValidFile, setIsValidFile] = useState(true);
  const [file, setFile] = useState(null);
  const [captcha, setCaptcha] = useState("");
  const [isValidGrievanceCategory, setIsValidGrievanceCategory] =
    useState(true);
  const [isValidCaptcha, setIsValidCaptcha] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const characters = "abc123";

  useEffect(() => {
    fetchInitialData();
    setCaptcha(generateString(6));
  }, []);

  const fetchInitialData = async () => {
    try {
      let res = await axiosHttpClient("GRIEVANCE_INITIAL_DATA_API", "get");
      console.log("grievance initial data fetch response", res.data.data);
      setGrievanceCategoryList(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // console.log("grievance categorylist 999", grievanceCategoryList);

  const handleSubmitForm = async () => {
    try {
      let res = await axiosHttpClient("USER_SUBMIT_GRIEVANCE_API", "post", {
        fullname: user.fullname,
        emailId: user.emailId,
        phoneNo: user.phoneNo,
        subject: user.subject,
        details: user.subject,
        statusId: user.statusId,
        filepath: user.filepath.data,
        category: user.category,
        isWhatsappNumber: user.isWhatsappNumber,
        grievanceCategoryId: user.grievanceCategoryId,
      });
      console.log("here Grievance Response", res);
      toast.success("Form submitted successfully!");
      setUser({
        fullname: "",
        emailId: "",
        phoneNo: "",
        subject: "",
        details: "",
        statusId: 15,
        filepath: "",
        category: "",
        isWhatsappNumber: false,
        grievanceCategoryId: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Form submission failed. Kindly try again!");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // setUser((prevUser) => ({
    //   ...prevUser,
    //   [name]: type === "checkbox" ? checked : value,
    // }));
    if(name == "isWhatsappNumber") {
      setUser({ ...user, [name]: checked ? 1 : 0});
      console.log("formData", user);
      return;
    }
    setUser({ ...user, [name]: value });
    console.log("formData", user);
  };

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     setUser((prevUser) => ({
  //       ...prevUser,
  //       filepath: selectedFile.name,
  //     }));
  //     setFile(selectedFile);
  //     setIsValidFile(true);
  //   } else {
  //     setIsValidFile(false);
  //   }
  // };

  let handleFileChange = (e) => {
    let { name,value } = e.target;
    if (name == "fileInput") {
      console.log("entering into handleFileChange")
      let file = e.target.files[0];
      console.log("file attachment", file);
      if (parseInt(file.size / 1024) <= 500) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setUser((prevUser) => ({
            ...prevUser,
            filepath: {
              name: file.name,
              data: reader.result,
            },
          }));
        };
        reader.onerror = () => {
          console.error("Error reading file.");
          toast.error("Error reading file.");
        };
      } else {
        toast.dismiss();
        toast.warning("Kindly choose a file with size less than 500 KB.");
        return;
      }
      setIsValidFile(true);
    } else {
      console.log("existing into handleFileChange")
      setUser({ ...user, [name]: value });
      setIsValidFile(false);
    }
    console.log("formData", user);
  };

  const handleCaptchaRefresh = () => {
    setCaptcha(generateString(6));
    setUser((prevUser) => ({
      ...prevUser,
      captchaInput: "",
    }));
    setIsValidCaptcha(true);
  };

  const generateString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  useEffect(() => {
    if (isSubmitted) {
      validateFeedback();
    }
  }, [user.mobile, user.emailId, user.filepath, user.captchaInput]);

  const validateFeedback = () => {
    const isValidMobileTemp = /^\d{10}$/.test(user.phoneNo);
    const isValidEmailTemp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.emailId);
    const isValidNameTemp = user.fullname.trim() !== "";
    const isValidSubjectTemp = user.subject.trim() !== "";
    const isValidGrievanceTemp = user.details.trim() !== "";
    const isValidFileTemp = user.filepath !== null;
    const isValidCaptchaTemp = user.captchaInput === captcha;
    const isValidGrievanceCategory = user.grievanceCategoryId !== "";

    setIsValidMobile(isValidMobileTemp);
    setIsValidEmail(isValidEmailTemp);
    setIsValidName(isValidNameTemp);
    setIsValidSubject(isValidSubjectTemp);
    setIsValidGrievance(isValidGrievanceTemp);
    setIsValidFile(isValidFileTemp);
    setIsValidCaptcha(isValidCaptchaTemp);
    setIsValidGrievanceCategory(isValidGrievanceCategory);

    return (
      isValidMobileTemp &&
      isValidEmailTemp &&
      isValidNameTemp &&
      isValidSubjectTemp &&
      isValidGrievanceTemp &&
      isValidFileTemp &&
      isValidCaptchaTemp &&
      isValidGrievanceCategory
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFeedback()) {
      handleSubmitForm();
      // console.log("Form submitted successfully");
    }
    setIsSubmitted(true);
  };

  return (
    <div className="grievanceContainer">
      <div className="row">
        <div className="form-group">
          <label htmlFor="nameInput">Name *</label>
          <input
            type="text"
            id="nameInput"
            placeholder="Enter Name"
            name="fullname"
            onChange={handleChange}
            value={user.fullname}
          />
          {!isValidName && (
            <p className="error-message">Please enter your full name.</p>
          )}
        </div>
        <div className="form-group">
          <div className="levelCheckBox">
            <label htmlFor="mobileInput">Mobile *</label>
            <div className="checkboxLev">
              <input
                type="checkbox"
                id="checkBox1"
                name="isWhatsappNumber"
                onChange={handleChange}
                checked={user.isWhatsappNumber}
              />
              <label htmlFor="checkBox1">Is WhatsApp Number?</label>
            </div>
          </div>
          <input
            type="text"
            id="mobileInput"
            placeholder="Enter mobile Number"
            name="phoneNo"
            onChange={handleChange}
            value={user.phoneNo}
          />
          {!isValidMobile && (
            <p className="error-message">Please enter a valid mobile number.</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label htmlFor="grievanceCategory">Grievance Category *</label>
          <select
            id="grievanceCategory"
            name="grievanceCategoryId"
            onChange={handleChange}
            value={user.grievanceCategoryId}
          >
            <option value="" disabled hidden>
              Select Grievance Category
            </option>
            {grievanceCategoryList.map((category) => (
              <option
                key={category.grievanceCategoryId}
                value={category.grievanceCategoryId}
              >
                {category.grievanceCategoryName}
              </option>
            ))}
          </select>
          {!isValidGrievanceCategory && (
            <p className="error-message">Please select a grievance category.</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label htmlFor="emailInput">Email</label>
          <input
            type="text"
            id="emailInput"
            placeholder="Enter Email"
            name="emailId"
            onChange={handleChange}
            value={user.emailId}
          />
          {!isValidEmail && (
            <p className="error-message">Please enter a valid email address.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="subjectInput">Subject *</label>
          <input
            type="text"
            id="subjectInput"
            placeholder="Enter Subject"
            name="subject"
            onChange={handleChange}
            value={user.subject}
          />
          {!isValidSubject && (
            <p className="error-message">Please enter the subject.</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="form-group2">
          <label htmlFor="grievanceInput">Grievance *</label>
          <input
            type="text"
            id="grievanceInput"
            placeholder="Enter Grievance"
            name="details"
            onChange={handleChange}
            value={user.details}
          />
          {!isValidGrievance && (
            <p className="error-message">Please write the grievance details.</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label htmlFor="photoInput">Photo *</label>
          <div className="inputButton">
            <input
              type="text"
              id="photoInput"
              placeholder="No photo uploaded"
              name="filepath"
              readOnly
              value={user.filepath.name}
            />
            <button type="button" onClick={handleButtonClick}>
              Upload
            </button>
            <input
              type="file"
              id="fileInput"
              name="fileInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          {!isValidFile && (
            <p className="error-message">Please upload a photo.</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="captchaInput">Captcha *</label>
          <div className="captcha">
            <div>{captcha}</div>
            <input
              type="text"
              id="captchaInput"
              name="captchaInput"
              onChange={handleChange}
              value={user.captchaInput}
              placeholder="Enter Captcha"
            />
            <div onClick={handleCaptchaRefresh} style={{ cursor: "pointer" }}>
              <FontAwesomeIcon icon={faRotateRight} />
            </div>
          </div>
          {!isValidCaptcha && (
            <p className="error-message">Captcha is not verified.</p>
          )}
        </div>
      </div>
      <div className="row">
        <button type="button" onClick={handleSubmit} className="submitbutton">
          Submit
        </button>
      </div>
    </div>
  );
};

const FeedbackForm = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    statusId: 15,
    feedback: "",
    isWhatsappNumber: false,
  });
  const [feedbackCategoryList, setFeedbackCategoryList] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isValidMobile, setIsValidMobile] = useState(true);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsSubmitted(false); // Reset isSubmitted state on component mount
  }, []);

  const handleSubmitForm = async () => {
    try {
      console.log("Submitting the following user data:", user);
      let res = await axiosHttpClient("USER_SUBMIT_FEEDBACK_API", "post", user);
      console.log("here Feedback Response", res);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Form submission failed. Kindly try again!");
    }
  };

  const handleInputChange = (event, field) => {
    const { value, type, checked } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [field]: type === "checkbox" ? checked : value,
    }));
    console.log(user); // This will log the updated user state
  };

  useEffect(() => {
    if (isSubmitted) {
      validateFeedback(); // Trigger validation after state update
    }
  }, [mobileNumber, email, isSubmitted]);

  const validateFeedback = () => {
    const mobileValid = /^\d{10}$/.test(mobileNumber);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsValidMobile(mobileValid);
    setIsValidEmail(emailValid);
    return mobileValid && emailValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log(validateFeedback());
    if (validateFeedback()) {
      handleSubmitForm();
      console.log("Form submitted successfully");
    }
  };

  return (
    <div className="grievanceContainer">
      <div className="row">
        <div className="form-group">
          <label htmlFor="nameInput">Name *</label>
          <input
            type="text"
            id="nameInput"
            placeholder="Enter Name"
            value={user.name}
            onChange={(event) => handleInputChange(event, "name")}
          />
        </div>
        <div className="form-group">
          <div className="levelCheckBox">
            <label htmlFor="mobileInput">Mobile *</label>
            <div className="checkboxLev">
              <input
                type="checkbox"
                id="checkBox1"
                checked={user.isWhatsappNumber}
                onChange={(event) =>
                  handleInputChange(event, "isWhatsappNumber")
                }
              />
              <label htmlFor="checkBox1">Is WhatsApp Number?</label>
            </div>
          </div>
          <input
            type="text"
            id="mobileInput"
            placeholder="Enter mobile Number"
            value={mobileNumber}
            onChange={(event) => {
              handleInputChange(event, "mobile");
              setMobileNumber(event.target.value);
            }}
            // onBlur={validateFeedback}
            // className={!isValidMobile && isSubmitted ? "invalid-input" : ""}
          />
          {!isValidMobile && (
            <p className="error-message">Please enter a valid mobile number.</p>
          )}
        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <label htmlFor="emailInput">Email</label>
          <input
            type="text"
            id="emailInput"
            placeholder="Enter Email"
            value={email}
            onChange={(event) => {
              handleInputChange(event, "email");
              setEmail(event.target.value);
            }}
            onBlur={validateFeedback}
            // className={!isValidEmail && isSubmitted ? "invalid-input" : ""}
          />
          {!isValidEmail && (
            <p className="error-message">Please enter a valid email address.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="subjectInput">Subject *</label>
          <input
            type="text"
            id="subjectInput"
            placeholder="Enter Subject"
            value={user.subject}
            onChange={(event) => handleInputChange(event, "subject")}
          />
        </div>
      </div>

      <div className="row">
        <div className="form-group2">
          <label htmlFor="feedbackInput">Feedback *</label>
          <input
            type="text"
            id="feedbackInput"
            placeholder="Enter Feedback"
            value={user.feedback}
            onChange={(event) => handleInputChange(event, "feedback")}
          />
        </div>
      </div>
      <div className="row">
        <button type="button" onClick={handleSubmit} className="submitbutton">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Grievance;
