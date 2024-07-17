import React, { useEffect, useState } from "react";
// import "../Resource/CreateResource.css";
import './CreateResource.css';
import axiosHttpClient from "../../../../utils/axios";
// Import Toast ----------------------------------------------------------------
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "../../../../common/AdminHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { dataLength } from "../../../../utils/regexExpAndDataLength";

const CreateResource = () => {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [description, setDescription] = useState("");
  const [parentResource, setParentResource] = useState("");
  const [path, setPath] = useState("");
  const [orderIn, setOrderIn] = useState(0);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState("");
  const [parentResourceList, setParentResourceList] = useState([]);

  // navigate the page --------------------------------------------------------------
  let navigate = useNavigate();

  // Handle Submit (Onclcik of from )--------------------------------------------------
  const HandleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    const parentResourceValue = parentResource;
    if (isCheckboxChecked) {
      if (!name || !description || !orderIn || !path) {
        setErrors("All fields are required!!");
        toast.dismiss();
        toast.error("All fields are required!");
        return;
      } else {
        await insertResourceData(name, description, "", path, orderIn);
      }
    } else {
      if (!name || !description || !orderIn || !path || !parentResourceValue) {
        setErrors("All fields are required!!");
        toast.dismiss();
        toast.error("All fields are required!");
        return;
      } else {
        await insertResourceData(
          name,
          description,
          parentResourceValue,
          path,
          orderIn
        );
      }
    }
  };

  // Here POST the data () ----------------------------------------------------------------------------
  const insertResourceData = async (
    name,
    description,
    parentResource,
    path,
    orderIn
  ) => {
    try {
      let res = await axiosHttpClient("RESOURCE_CREATE_API", "post", {
        name: name,
        description: description,
        orderIn: orderIn,
        path: path,
        parentResourceId: parentResource || null,
      });
      console.log("Response:", res);
      toast.success("Resource created successfully");
      navigate("/UAC/Resources/ListOfResources");
    } catch (err) {
      console.error("Error:", err);
      // ----------------------Toast -----------------------------
      toast.error("Failed to create Resource. Please try again.");
      setErrorMessage(err.message);
    }
  };

  // Handle (Check - Checkbox)--------------------------------------------------------------------
  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
    if (isCheckboxChecked) {
      setParentResource("");
    }
  };

  // function to clear form data
  function clearForm(e) {
    e.preventDefault();
    setIsCheckboxChecked(false);
    setDescription('');
    setParentResource("");
    setPath("");
    setName("");
    setErrors("");
    setOrderIn("");
    toast.dismiss();
    toast.success('All form inputs are cleared!')
  }

  // here get resoruce data ----------------------------------------------------------
  async function getResourceDataDropdown() {
    try {
      const res = await axiosHttpClient("RESOURCE_NAME_DROPDOWN", "get");
      console.log("here is Response means get data", res);
      setParentResourceList(res.data.data);
    } catch (err) {
      console.error("Error fetching resource data:", err);
    }
  }

  // UseEffect for Update or Call the Api -------------------------------------------------------------
  useEffect(() => {
    getResourceDataDropdown();
  }, []);
  //-----------------------------------------------------------------------------------------------------------------------------

  return (
    <div>
      <AdminHeader />
      <div className="CreateNewResourceContainer">
        <div className="form-heading">
          <h2>Create new resource</h2>
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
              <input type="text" name='name' value={name} placeholder="Enter resource name" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={(e) => setName(e.target.value)} />
              {/* {errors.name && <p className='error-message'>{errors.name}</p>} */}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Resource Description<span className='text-red-500'>*</span></label>
              <input type="text" name='description' value={description} placeholder="Enter resource description" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={(e) => setDescription(e.target.value)} />
              {/* {errors.description && <p className='error-message'>{errors.description}</p>} */}
            </div>
            <div className="form-group col-start-1 col-span-1">
              <label htmlFor="input2">Is Parent Resource<span className='text-red-500'>*</span></label>
              <input type="checkbox" name='description' checked={isCheckboxChecked} placeholder="Enter resource description" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={handleCheckboxChange} />
              {/* {errors.description && <p className='error-message'>{errors.description}</p>} */}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Parent Resource Name<span className='text-red-500'>*</span></label>
              <select type="text" name='parent' className={`${isCheckboxChecked ? "bg-gray-500" : ""}`} value={parentResource} disabled={isCheckboxChecked} placeholder="Enter parent resource name" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={(e) => setParentResource(e.target.value)}>
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
              <input type="text" name='path' value={path} placeholder="Enter route path" autoComplete='off' maxLength={dataLength.STRING_VARCHAR_SHORT} onChange={(e) => setPath(e.target.value)} />
              {/* {errors.path && <p className='error-message'>{errors.path}</p>} */}
            </div>
            <div className="form-group col-span-1">
              <label htmlFor="input2">Show in Order<span className='text-red-500'>*</span></label>
              <input type="number" min={0} name='orderIn' value={orderIn} placeholder="Enter order" autoComplete='off' maxLength={dataLength.PHONE_NUMBER} onChange={(e) => setOrderIn(e.target.value)} />
              {/* {errors.orderIn && <p className='error-message'>{errors.orderIn}</p>} */}
            </div>
          </div>
          <div className="buttons-container">
            <button className="approve-button" onClick={HandleSubmit}>Submit</button>
            <button className="cancel-button" onClick={clearForm}>Cancel</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateResource;
