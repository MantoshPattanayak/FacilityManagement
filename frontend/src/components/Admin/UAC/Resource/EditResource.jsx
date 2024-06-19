import React, { useEffect, useState } from "react";
import "../Resource/EditResource.css";
// Axios for (Fetch Api)--------------------------
import axiosHttpClient from "../../../../utils/axios";
// Import Navigate and Crypto -----------------------------------
import { decryptData } from "../../../../utils/encryptData";
import { useLocation, useNavigate } from "react-router-dom";
// Import toast ---------------------------------------
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const EditDisplayResource = () => {
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

  //here Location / crypto and navigate the page---------------
  const location = useLocation();
  const resourceId = decryptData(
    new URLSearchParams(location.search).get("resourceId")
  );
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
      console.log("Get data of Edit Display resource", res);
    } catch (err) {
      console.log("here Error", err);
    }
  }

  // Here Post the data --------------------------------Z
  // Handle Submit (Onclcik of from )--------------------------------------------------
  const HandleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const parentResourceValue = formData.get("parent");
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
      toast.success("Role created successfully");
    } catch (err) {
      console.error("Error:", err);
      // ----------------------Toast -----------------------------
      toast.error("Failed to create role. Please try again.");
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

  /// UseEffect for Update the data ----------------------------
  useEffect(() => {
    GetDisplayResource();
    getResourceDataDropdown();
  }, []);

  return (
    <div className="editResParent">
      <div className="container-1">
        {/* HEADER CREATION FOR RESOURCE LIST */}
        <div className="header-role">
          <div className="rectangle"></div>
          <div className="roles">
            <h1>
              <b>Update Resource</b>
            </h1>
          </div>
        </div>
        {/* Back button  */}
        <div className="back-btn">
          <button
            className="btn"
            onClick={() => navigate("/UAC/Resources/ListOfResources")}
          >
            Back
          </button>
        </div>
        {/* Form having inputs field */}
        <form className="EditResForm" onSubmit={HandleSubmit}>
          <div className="form">
            <div className="fields">
              <div className="title">
                <h3>Resource Name</h3>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Update Name"
                id=""
                className="input-fields"
              />
            </div>

            <div className="fields">
              <div className="title">
                <h3>Resource Description</h3>
              </div>
              <input
                type="text"
                name="name"
                placeholder=" Update Resource Description"
                id=""
                className="input-fields"
              />
            </div>

            <div className="fields">
              <div className="checkbox">
                <span>Is Parent-Resource</span>{" "}
                <input type="checkbox" name="Is parent-resource" id="" />
              </div>
            </div>

            <div className="fields">
              <div className="title">
                <h3>Parent Resource Name</h3>
              </div>
              <select name="cars" id="cars" className="input-fields">
                <option value="Dashboard">a</option>
                <option value="mainforce">b</option>
                <option value="mercedes">c</option>
                <option value="durex">d</option>
              </select>
            </div>

            <div className="fields">
              <div className="title">
                <h3>Path</h3>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Enter Path Ex- (/path12)"
                id=""
                className="input-fields"
              />
            </div>

            <div className="fields">
              <div className="title">
                <h3>Show in Order</h3>
              </div>
              <input
                type="number"
                name="number"
                id=""
                defaultValue={0}
                className="input-fields"
              />
            </div>
          </div>

          <div className="buttons">
            <div className="submit-btn">Submit</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDisplayResource;
