import { useState, useEffect } from "react";
import AdminHeader from "../../../../common/AdminHeader";
import "./EditUser.css";
import { regex, dataLength } from "../../../../utils/regexExpAndDataLength";
import axiosHttpClient from "../../../../utils/axios";
import api from "../../../../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import { decryptData } from "../../../../utils/encryptData";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

export default function EditUser() {
  const location = useLocation();
  const userId = decryptData(
    new URLSearchParams(location.search).get("userId")
  );
  const action = new URLSearchParams(location.search).get("action");
  const navigate = useNavigate();

  let initialFormData = {
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    altMobileNumber: "",
    emailID: "",
    role: "",
    status: "",
    userId: "",
  };

  let modifiedFormData = {
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: "",
    altMobileNumber: "",
    emailID: "",
    role: "",
    status: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [roleList, setRoleList] = useState([]);

  const [errors, setErrors] = useState({});

  async function fetchUserDetails() {
    try {
      let res = await axiosHttpClient(
        "ADMIN_USER_VIEW_BY_ID_API",
        "get",
        null,
        userId
      );

      // console.log('response', res.data.data[0]);

      let title = decryptData(res.data.data[0].title);
      let fullName = decryptData(res.data.data[0].fullName).split(" ");
      let emailId = decryptData(res.data.data[0].emailId);
      let status = res.data.data[0].statusId;
      let mobileNumber = decryptData(res.data.data[0].contactNo);
      let altMobileNumber = decryptData(res.data.data[0].altContactNo);
      let role = res.data.data[0].roleId;

      console.log({ title, fullName, emailId, status, mobileNumber, role });

      setFormData({
        title: title || "",
        firstName: fullName[0] || "",
        middleName: fullName[1] || "",
        lastName: fullName[-1] || "",
        mobileNumber: mobileNumber || "",
        altMobileNumber: altMobileNumber || "",
        emailID: emailId || "",
        role: role || "",
        status: status || "",
        userId: userId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchInitialData() {
    try {
      let res = await axiosHttpClient("ADMIN_USER_INITIALDATA_API", "get");

      console.log("ADMIN_USER_INITIALDATA_API",res.data.Role);
      setRoleList(res.data.Role);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUserDetails();
    fetchInitialData();
  }, []);

  function validateUserInput(data) {
    let errors = {};

    console.log(data);

    if (data.title) {
      // continue
    } else {
      errors.title = "Please provide salutation.";
    }

    if (data.firstName) {
      if (!regex.NAME.test(data.firstName)) {
        errors.firstName = "First name is incorrect.";
      }
    } else {
      errors.firstName = "Please provide first name.";
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
        errors.lastName = "Last name is incorrect.";
      }
    } else {
      errors.lastName = "Please provide last name.";
    }

    if (data.mobileNumber) {
      if (!regex.PHONE_NUMBER.test(data.mobileNumber)) {
        errors.mobileNumber = "Last name is incorrect.";
      }
    } else {
      errors.mobileNumber = "Please provide mobile number.";
    }

    if (data.emailID) {
      if (!regex.EMAIL.test(data.emailID)) {
        errors.emailID = "Email ID is incorrect.";
      }
    } else {
      errors.emailID = "Please provide email id.";
    }

    if (data.role) {
      // continue
    } else {
      errors.role = "Please provide role.";
    }

    return errors;
  }

  function handleChange(e) {
    e.preventDefault();
    setErrors({});
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log("formData", formData);
    return;
  }

  //function to seek confirmation
  function handleConfirmation(e) {
    e.preventDefault();
    toast.dismiss();
    // Disable interactions with the background
    document.querySelectorAll(
      ".user-edit"
    )[0].style.pointerEvents = "none";
    document.querySelectorAll(
      ".user-edit"
    )[0].style.opacity = 0.4;

    toast.warn(
      <div>
        <p>Are you sure you want to proceed?</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
              // Re-enable interactions with the background
              document.querySelectorAll(
                ".user-edit"
              )[0].style.pointerEvents = "auto";
              document.querySelectorAll(
                ".user-edit"
              )[0].style.opacity = 1;
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
              document.querySelectorAll(
                ".user-edit"
              )[0].style.pointerEvents = "auto";
              document.querySelectorAll(
                ".user-edit"
              )[0].style.opacity = 1;
              toast.dismiss();
              toast.error("Action cancelled!", {
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
          document.body.style.pointerEvents = "auto";
        },
      }
    );
    return;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErrors({});

    let errors = validateUserInput(formData);

    if (Object.keys(errors).length <= 0) {
      try {
        let response = await axiosHttpClient(
          "ADMIN_USER_UPDATE_API",
          "put",
          {
            userId: formData.userId,
            title: formData.title,
            fullName:
              formData.firstName +
              (formData.middleName ? " " + formData.middleName : "") +
              (formData.lastName ? " " + formData.lastName : ""),
            userName: null,
            // altMobileNumber: formData.altMobileNumber,
            mobileNo: formData.mobileNumber,
            emailId: formData.emailID,
            roleId: formData.role,
            statusId: formData.status,
            genderId: null,
          },
          null
        );

        console.log(response.data);
        toast.success("User details updated successfully.", {
          autoClose: 2000,
          onClose: () => {
            setTimeout(() => {
              navigate("/UAC/Users/ListOfUsers");
            }, 1000);
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("User details updation failed. Please try again.");
      }
    } else {
      setErrors(errors);
      console.log(errors);
      toast.error("User details updation failed. Please try again.");
    }
  }

  // function clearForm(e) {
  //     // e.preventDefault();
  //     console.log('cancel form')
  //     setFormData(initialFormData);
  //     return;
  // }

  return (
    <div className="user-edit">
      <AdminHeader />
      <div className="form-container">
        <div className="form-heading">
          <h2>{action == "view" ? "View User" : "Edit User"}</h2>
          <div className="flex flex-col-reverse items-end w-[100%]">
            <button className="back-button" onClick={(e) => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
          </div>
          <div className="grid lg:grid-rows-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 lg:gap-x-8 gap-y-6 w-[100%]">
            <div className="form-group col-span-1">
              <label htmlFor="input1">
                Title<span className="text-red-500">*</span>
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={action == "view" ? true : false}
              >
                <option value={""}>Select</option>
                <option value={"Mr"}>Mr</option>
                <option value={"Ms"}>Ms</option>
                <option value={"Mrs"}>Mrs</option>
              </select>
              {errors.title && <p className="error-message">{errors.title}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">
                First name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="First name"
                autoComplete="off"
                maxLength={dataLength.NAME}
                onChange={handleChange}
                disabled={action == "view" ? true : false}
              />
              {errors.firstName && (
                <p className="error-message">{errors.firstName}</p>
              )}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input3">Middle name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                placeholder="Middle name"
                autoComplete="off"
                maxLength={dataLength.NAME}
                onChange={handleChange}
                disabled={action == "view" ? true : false}
              />
              {errors.middleName && (
                <p className="error-message">{errors.middleName}</p>
              )}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input1">
                Last name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Last name"
                autoComplete="off"
                maxLength={dataLength.NAME}
                onChange={handleChange}
                disabled={action == "view" ? true : false}
              />
              {errors.lastName && (
                <p className="error-message">{errors.lastName}</p>
              )}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">
                Mobile number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                placeholder="Mobile number"
                autoComplete="off"
                maxLength={dataLength.PHONE_NUMBER}
                onChange={handleChange}
                disabled={action == "view" ? true : false}
              />
              {errors.mobileNumber && (
                <p className="error-message">{errors.mobileNumber}</p>
              )}
            </div>
            {/* <div className="form-group col-span-1">
                            <label htmlFor="input3">Alternate mobile number</label>
                            <input type="text" name='altMobileNumber' value={formData.altMobileNumber} placeholder="Alternate mobile number" autoComplete='off' maxLength={dataLength.PHONE_NUMBER} onChange={handleChange} disabled={action == 'view' ? true : false} />
                            {errors.altMobileNumber && <p className='error-message'>{errors.altMobileNumber}</p>}
                        </div> */}
            <div className="form-group col-span-1">
              <label htmlFor="input1">
                Email ID<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="emailID"
                value={formData.emailID}
                placeholder="Email ID"
                autoComplete="off"
                maxLength={dataLength.EMAIL}
                onChange={handleChange}
                disabled={action == "view" ? true : false}
              />
              {errors.emailID && (
                <p className="error-message">{errors.emailID}</p>
              )}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">
                Role<span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={action == "view" ? true : false}
              >
                <option value={""}>Select</option>
                {roleList?.length > 0 &&
                  roleList.map((role, index) => {
                    if (role.roleId == formData.role) {
                      return (
                        <option key={index} value={role.roleId}>
                          {role.roleName}
                        </option>
                      );
                    } else {
                      return (
                        <option key={index} value={role.roleId}>
                          {role.roleName}
                        </option>
                      );
                    }
                  })}
              </select>
              {errors.role && <p className="error-message">{errors.role}</p>}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">
                Status<span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={action == "view" ? true : false}
              >
                <option value={""}>Select</option>
                <option value={"1"}>Active</option>
                <option value={"0"}>Inactive</option>
              </select>
              {errors.role && <p className="error-message">{errors.role}</p>}
            </div>
          </div>
          <div className="buttons-container">
            <button
              type="submit"
              className={`approve-button ${action == "view" ? "hidden" : ""}`}
              onClick={handleConfirmation}
              disabled={action == "view" ? true : false}
            >
              Update
            </button>
            {/* <button type='submit' className="cancel-button" onClick={clearForm} disabled={action == 'view' ? true : false}>Cancel</button> */}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
