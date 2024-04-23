import React, { useEffect, useState } from 'react';
import '../Resource/CreateResource.css';
import axiosHttpClient from '../../../../utils/axios';
// Import Toast ----------------------------------------------------------------
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
const CreateResource = () => {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [description, setDescription] = useState("");
  const [parentResource, setParentResource] = useState("");
  const [path, setPath] = useState("");
  const [orderIn, setOrderIn] = useState(0);
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [parentResourceList, setParentResourceList] = useState([]);
  // navigate the page --------------------------------------------------------------
  let navigate = useNavigate();
// Handle Submit (Onclcik of from )--------------------------------------------------
        const HandleSubmit = async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const parentResourceValue = formData.get('parent');
              if (isCheckboxChecked) {
                if (!name || !description || !orderIn || !path) {
                  setErrorMessage("All fields are required!!");
                  return;
                } else {
                  await insertResourceData(name, description, "", path, orderIn);
                }
              } else {
                if (!name || !description || !orderIn || !path || !parentResourceValue) {
                  setErrorMessage("All fields are required!!");
                  return;
                } else {
                  await insertResourceData(name, description, parentResourceValue, path, orderIn);
                }
              }
        }
// Here POST the data () ----------------------------------------------------------------------------
      const insertResourceData = async (name, description, parentResource, path, orderIn) => {
        try {
          let res = await axiosHttpClient('RESOURCE_CREATE_API', 'post', {
            name: name,
            description: description,
            orderIn: orderIn,
            path: path,
            parentResourceId: parentResource || null,
          })
          console.log("Response:", res);
          toast.success("Role created successfully");
        } catch (err) {
          console.error("Error:", err);
// ----------------------Toast -----------------------------
          toast.error("Failed to create role. Please try again.");
          setErrorMessage(err.message);
        }
      }
// Handle (Check - Checkbox)--------------------------------------------------------------------
      const handleCheckboxChange = () => {
        setIsCheckboxChecked(!isCheckboxChecked);
        if (isCheckboxChecked) {
          setParentResource("");
        }
      }
  // here get resoruce data ----------------------------------------------------------
  async function getResourceDataDropdown() {
    try {
      const res = await axiosHttpClient('RESOURCE_NAME_DROPDOWN', 'get')
      console.log("here is Response means get data", res)
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
    <div className='container-1'>
      {/* HEADER CREATION FOR RESOURCE LIST */}
      <div className="header-role">
        <div className="rectangle"></div>
        <div className="roles">
          <h1><b>Create Resource</b></h1>
        </div>
      </div>
      {/* Back button  */}
      <div className="back-btn">
      <button className="btn" onClick={() => navigate('/UAC/Resources/ListOfResources')}>Back</button>
      </div>
      {/* Form having inputs field */}
      <form onSubmit={HandleSubmit}>
        <div className="form">
          <div className="fields">
            <div className="title"><h3>Resource Name</h3></div>
            <input
              type="text"
              name="name"
              placeholder='Resource Name'
              className="createresource-input-fields"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="fields">
            <div className="title"><h3>Resource Description</h3></div>
            <input
              type="text"
              name="description"
              placeholder='Resource Description'
              className="createresource-input-fields"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="fields">
            <div className='checkbox'>
              <label>
                <input
                  type="checkbox"
                  checked={isCheckboxChecked}
                  onChange={handleCheckboxChange}
                />
                Is Parent Resource
              </label>
            </div>
          </div>

          <div className="fields">
            <div className="title"><h3>Parent Resource Name</h3></div>
            <select
              id="parent"
              name="parent"
              defaultValue=""
              autoComplete="parent-Type"
              disabled={isCheckboxChecked}
              onChange={(e) => setParentResource(e.target.value)}
              className={`form-select ${isCheckboxChecked ? "bg-gray-500" : ""}`}
            >
              <option value="">Select Parent Resource</option>
              {parentResourceList?.map((value, idx) => {
                return (
                  <option key={idx} value={value.resourceId}>
                    {value.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="fields">
            <div className="title"><h3>Path</h3></div>
            <input
              type="text"
              name="path"
              placeholder='Enter Path Ex- (/path12)'
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="createresource-input-fields"
            />
          </div>

          <div className="fields">
            <div className="title"><h3>Show in Order</h3></div>
            <input
              type="number"
              name="orderIn"
              id='orderIn'
              value={orderIn}
              onChange={(e) => setOrderIn(e.target.value)}
              className="createresource-input-fields"
            />
          </div>
        </div>

        <div className="buttons">
          <button className="reset-btn" type="reset">
            Reset
          </button>
          <button className="submit-btn" type="submit">
            Submit
          </button>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateResource;
