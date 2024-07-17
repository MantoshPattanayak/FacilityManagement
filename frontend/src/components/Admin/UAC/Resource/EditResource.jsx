import React, { useEffect, useState } from "react";
// import "../Resource/CreateResource.css";
import './EditResource.css';
import axiosHttpClient from "../../../../utils/axios";
// Import Toast ----------------------------------------------------------------
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminHeader from "../../../../common/AdminHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { dataLength } from "../../../../utils/regexExpAndDataLength";
import { decryptData } from "../../../../utils/encryptData";

const EditResource = () => {
  // useSate for get the data -------------------------------
  const [DisplayResource, setDisplayResource] = useState([]);
  // useSate for Edit or post the data ------------------------
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [description, setDescription] = useState("");
  const [parentResource, setParentResource] = useState("");
  const [path, setPath] = useState("");
  const [orderIn, setOrderIn] = useState(0);
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [parentResourceList, setParentResourceList] = useState([]);
  const [formData, setFormData] = useState({});
  //here Location / crypto and navigate the page---------------
  const location = useLocation();
  const resourceId = decryptData(new URLSearchParams(location.search).get("resourceId"));
  const action = new URLSearchParams(location.search).get("action");
  const navigate = useNavigate();

  // here Get the data --------------------------------
  async function GetDisplayResource() {
    try {
      let res = await axiosHttpClient(
        "RESOURCE_VIEW_BY_ID_API",
        "get",
        null,
        resourceId
      );
      console.log("RESOURCE_VIEW_BY_ID_API", res.data.data[0]);
      setFormData(res.data.data[0]);
      if(res.data.data[0].parentResourceId == null){
        setIsCheckboxChecked(true);
      }
    } catch (err) {
      console.log("here Error", err);
    }
  }

  // Here Post the data --------------------------------
  // Handle Submit (Onclcik of from )--------------------------------------------------
  const HandleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    // const parentResourceValue = formData.get("parent");

    if (isCheckboxChecked) {  // if checkbox checked then resource is parent, dont send parentresourceId, set isParent to true
      if (!formData.name || !formData.description || !formData.orderIn || !formData.path) {
        setErrorMessage("All fields are required!!");
        toast.dismiss();
        toast.error("All fields are required!!");
        return;
      } else {
        await updateResourceData(
          formData.resourceId,
          formData.name,
          formData.description,
          formData.hasSubMenu,
          formData.orderIn,
          formData.path,
          formData.statusId,
          "",
          true
        );
      }
    } else {  // if checkbox not checked then resource is child, send parentresourceId, set isParent to false
      if (!formData.name || !formData.description || !formData.orderIn || !formData.path || !formData.parentResourceId) {
        setErrorMessage("All fields are required!!");
        toast.dismiss();
        toast.error("All fields are required!!");
        return;
      } else {
        await updateResourceData(
          formData.resourceId,
          formData.name,
          formData.description,
          formData.hasSubMenu,
          formData.orderIn,
          formData.path,
          formData.statusId,
          formData.parentResourceId,
          false
        );
      }
    }
  };

  // Here POST the data () ----------------------------------------------------------------------------
  const updateResourceData = async (
    resourceId,
    name,
    description,
    hasSubMenu,
    orderIn,
    path,
    statusId,
    parentResourceId,
    isParent
  ) => {
    try {
      let res = await axiosHttpClient("RESOURCE_UPDATE_API", "put", {
        resourceId,
        name,
        description,
        hasSubMenu,
        orderIn,
        path,
        statusId,
        parentResourceId,
        isParent
      });
      console.log("Response:", res);
      toast.success("Resource updated successfully", {
        autoClose: 3000,
        onClose: () => {
          // Navigate to another page after toast timer completes
          setTimeout(() => {
            navigate(-1);
          }, 1000); // Wait 1 second after toast timer completes before navigating
        }
      });
      navigate("/UAC/Resources/ListOfResources");
    } catch (err) {
      console.error("Error:", err);
      // ----------------------Toast -----------------------------
      toast.error("Failed to update Resource. Please try again.");
      setErrorMessage(err.message);
    }
  };

  // save user input data to formData object on entering values
  let handleChange = (e) => {
    let { name, value } = e.target;
    setErrorMessage({});
    setFormData({ ...formData, [name]: value });
    if(name == "isParent") {
      setIsCheckboxChecked(!isCheckboxChecked);
    }
    console.log('formData', formData);
    console.log('isCheckboxChecked', isCheckboxChecked);
  }

  //function to seek confirmation
  function handleConfirmation(e) {
    e.preventDefault();
    toast.dismiss();
    // Disable interactions with the background
    document.querySelectorAll('.EditNewResourceContainer')[0].style.pointerEvents = 'none';
    document.querySelectorAll('.EditNewResourceContainer')[0].style.opacity = 0.4;

    toast.warn(
      <div>
        <p>Are you sure you want to proceed?</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              HandleSubmit(e);
              // Re-enable interactions with the background
              document.querySelectorAll('.EditNewResourceContainer')[0].style.pointerEvents = 'auto';
              document.querySelectorAll('.EditNewResourceContainer')[0].style.opacity = 1;
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
              document.querySelectorAll('.EditNewResourceContainer')[0].style.pointerEvents = 'auto';
              document.querySelectorAll('.EditNewResourceContainer')[0].style.opacity = 1;
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

  // here get resoruce data ----------------------------------------------------------
  async function getResourceDataDropdown() {
    try {
      const res = await axiosHttpClient("RESOURCE_NAME_DROPDOWN", "get");
      console.log("getResourceDataDropdown", res);
      setParentResourceList(res.data.data);
    } catch (err) {
      console.error("Error fetching resource data:", err);
    }
  }

  /// UseEffect for Update the data ----------------------------
  useEffect(() => {
    GetDisplayResource();
    getResourceDataDropdown();
  }, []);
  //-----------------------------------------------------------------------------------------------------------------------------

  return (
    <div>
      <AdminHeader />
      <div className="EditNewResourceContainer">
        <div className="form-heading">
          <h2>Edit/View resource</h2>
          <div className="flex flex-col-reverse items-end w-[100%]">
            <button
              className='back-button'
              onClick={(e) => navigate(-1)}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
          </div>
          <div className="grid grid-rows-4 grid-cols-2 gap-y-2 w-[100%]">
            <div className="form-group col-span-1">
              <label htmlFor="input2">Resource Name<span className='text-red-500'>*</span></label>
              <input type="text" name='name' value={formData.name} placeholder="Enter resource name" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} disabled={action=="view" ? true: false} />
              {/* {errors.name && <p className='error-message'>{errors.name}</p>} */}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Resource Description<span className='text-red-500'>*</span></label>
              <input type="text" name='description' value={formData.description} placeholder="Enter resource description" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} disabled={action=="view" ? true: false} />
              {/* {errors.description && <p className='error-message'>{errors.description}</p>} */}
            </div>
            <div className="form-group col-start-1 col-span-1">
              <label htmlFor="input2">Is Parent Resource<span className='text-red-500'>*</span></label>
              <input type="checkbox" name='isParent' checked={isCheckboxChecked} autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} disabled={ action =="view" ? true : false } />
              {/* {errors.description && <p className='error-message'>{errors.description}</p>} */}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Parent Resource Name<span className='text-red-500'>*</span></label>
              <select type="text" name='parentResourceId' className={`${isCheckboxChecked ? "bg-gray-500" : ""}`} value={formData.parentResourceId} disabled={ action =="view" ? true : isCheckboxChecked ? true : false } autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange}>
                <option value="">Select Parent Resource</option>
                {parentResourceList?.map((value, idx) => {
                  return (
                    <option key={idx} value={value.resourceId}>
                      {value.name}
                    </option>
                  );
                })}
              </select>
              {/* {errors.parent && <p className='error-message'>{errors.parent}</p>} */}
            </div>
            <div className="form-group col-start-1 col-span-1">
              <label htmlFor="input2">Route Path<span className='text-red-500'>*</span></label>
              <input type="text" name='path' value={formData.path} placeholder="Enter route path" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} disabled={action=="view" ? true: false} />
              {/* {errors.path && <p className='error-message'>{errors.path}</p>} */}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Show in Order<span className='text-red-500'>*</span></label>
              <input type="number" min={0} name='orderIn' value={formData.orderIn} placeholder="Enter order" autoComplete='off' maxLength={dataLength.PHONE_NUMBER} onChange={handleChange} disabled={action=="view" ? true: false} />
              {/* {errors.orderIn && <p className='error-message'>{errors.orderIn}</p>} */}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Status<span className='text-red-500'>*</span></label>
              <select type="text" name='statusId' value={formData.statusId} autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleChange} disabled={action=="view" ? true: false}>
                <option value="">Select</option>
                <option value="1">ACTIVE</option>
                <option value="2">INACTIVE</option>
              </select>
              {/* {errors.parent && <p className='error-message'>{errors.parent}</p>} */}
            </div>
          </div>
          <div className="buttons-container">
            <button className="approve-button" onClick={handleConfirmation} disabled={action=="view" ? true: false}>Submit</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditResource;
