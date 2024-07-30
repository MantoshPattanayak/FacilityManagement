import React, { useEffect, useState } from "react";
import './CreateStaffAllocation.css';
import axiosHttpClient from "../../../../utils/axios";
// Import Toast ----------------------------------------------------------------
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import AdminHeader from "../../../../common/AdminHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { dataLength } from "../../../../utils/regexExpAndDataLength";
import { formatDateYYYYMMDD } from "../../../../utils/utilityFunctions";
import SearchableDropdown from "../../../../common/SearchableDropdown";
import { decryptData } from "../../../../utils/encryptData";

const EditStaffAllocation = () => {
    const [errors, setErrors] = useState("");
    const [userList, setUserList] = useState([]);
    const [facilityList, setFacilityList] = useState([]);
    const [formData, setFormData] = useState({
        facilityStaffAllocationId: '',
        facilityId: '',
        userId: '',
        allocationStartDate: formatDateYYYYMMDD(new Date().toISOString().split('T')[0]),
        allocationEndDate: formatDateYYYYMMDD(new Date().toISOString().split("T")[0])
    });
    let navigate = useNavigate();
    const staffAllocationId = decryptData(new URLSearchParams(useLocation().search).get("s"));
    const action = new URLSearchParams(location.search).get('action');

    // Handle Submit (Onclcik of from )--------------------------------------------------
    const HandleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await axiosHttpClient("UPDATE_STAFF_ALLOCATION_LIST_API", "post", formData);
            console.log("HandleSubmit", response);
            toast.success(response.data.message, {
                autoClose: 3000, // Toast timer duration in milliseconds
                onClose: () => {
                    // Navigate to another page after toast timer completes
                    setTimeout(() => {
                        navigate('/activity/view-staff-allocation');
                    }, 1000); // Wait 1 second after toast timer completes before navigating
                }
            });
        }
        catch(error) {
            console.error(error);
            toast.error(error.response.data.message);
        }

    };

    function handleInput(e) {
        e.preventDefault();
        let { name, value } = e.target;
        toast.dismiss();
        if(name == "allocationStartDate") {
            // check if start date is less than or equal to end date
            if(formData.allocationEndDate && new Date(value) <= new Date(formData.allocationEndDate)){
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
            else {
                toast.warn("Start date should be less than or equal to End date.")
            }
        }
        if(name == "allocationEndDate") {
            // check if end date is grater than or equal to start date
            if(formData.allocationStartDate && new Date(value) >= new Date(formData.allocationStartDate)){
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
            else {
                toast.warn("End date should be greater than or equal to Start date.")
            }
        }

        return;
    }

    // function to clear form data
    function clearForm(e) {
        e.preventDefault();
        setFormData({
            facilityId: '',
            userId: '',
            allocationStartDate: '',
            allocationEndDate: ''
        })
        toast.success('All form inputs are cleared!')
    }

    // fetch dropdown date
    async function getInitialDropdownData() {
        try {
            const res = await axiosHttpClient("FETCH_INITIAL_DATA_FOR_STAFFALLOCATION", "get");
            console.log("Response Initial Data", res);
            setFacilityList(res.data.fetchFacilityData);
            let userData = res.data.fetchStaffData.map((user) => {
                return { ...user, ["fullName"]: decryptData(user.fullName) }
            })
            console.log("userData", userData);
            setUserList(userData);
        } catch (err) {
            console.error("Error fetching resource data:", err.message);
        }
    }

    async function fetchStaffAllocationData() {
      try {
        let response = await axiosHttpClient("VIEW_STAFF_ALLOCATION_DATA_API", "post", {}, staffAllocationId);
        console.log("fetch staff allocation data", response.data.paginatedMatchedData[0]);
        setFormData({
          facilityStaffAllocationId: response.data.paginatedMatchedData[0]?.facilityStaffAllocationId,
          facilityId: response.data.paginatedMatchedData[0]?.facilityId,
          userId: response.data.paginatedMatchedData[0]?.userId,
          allocationStartDate: formatDateYYYYMMDD(response.data.paginatedMatchedData[0]?.allocationStartDate.split('T')[0]),
          allocationEndDate: formatDateYYYYMMDD(response.data.paginatedMatchedData[0]?.allocationEndDate.split("T")[0])
        });
      }
      catch(error) {
        console.error("fetch data error", error);
      }
    }

    useEffect(() => {
        getInitialDropdownData();
        fetchStaffAllocationData();
    }, []);

    useEffect(() => {
        console.log("formData", formData);
    }, [formData]);

    return (
        <div>
            <AdminHeader />
            <div className="CreateStaffAllocation">
                <div className="form-heading">
                    <h2>Create new staff facility allocation</h2>
                    <div className="flex flex-col-reverse items-end w-[100%]">
                        <button
                            className='back-button'
                            onClick={(e) => navigate(-1)}
                        >
                            <FontAwesomeIcon icon={faArrowLeftLong} /> Back
                        </button>
                    </div>
                    <div className="grid grid-rows-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-2 w-[100%]">
                        <div className="form-group col-span-1">
                            <label htmlFor="input2">Staff Name<span className='text-red-500'>*</span></label>
                            <SearchableDropdown
                                key = {'userList'}
                                options = {userList}
                                label = {"fullName"}
                                id = {"userId"}
                                selectedVal = {userList.filter((user) => { return formData.userId == user.userId })[0]?.fullName}
                                handleChange = {(val) => setFormData({ ...formData, ["userId"]: val })}
                                isDisabled = { action == 'view' ? true : false }
                            />
                            {/* {errors.name && <p className='error-message'>{errors.name}</p>} */}
                        </div>
                        <div className="form-group col-span-1">
                            <label htmlFor="input2">Facility Name<span className='text-red-500'>*</span></label>
                            <SearchableDropdown
                                key={"facilityList"}
                                options={facilityList}
                                label={"facilityname"}
                                id={"facilityId"}
                                selectedVal={facilityList.filter((facility) => { return formData.facilityId == facility.facilityId })[0]?.facilityname}
                                handleChange={(val) => setFormData({ ...formData, ["facilityId"]: val })}
                                isDisabled = { action == 'view' ? true : false }
                            />
                            {/* {errors.parent && <p className='error-message'>{errors.parent}</p>} */}
                        </div>
                        <div className="form-group col-start-1 col-span-1">
                            <label htmlFor="input2">Allocation Start Date<span className='text-red-500'>*</span></label>
                            <input type="date" min={formatDateYYYYMMDD(new Date().toISOString().split('T')[0])} name='allocationStartDate' value={formData.allocationStartDate} onChange={handleInput} disabled={action == 'view' ? true : false} />
                            {/* {errors.path && <p className='error-message'>{errors.path}</p>} */}
                        </div>
                        <div className="form-group col-span-1">
                            <label htmlFor="input2">Allocation End Date<span className='text-red-500'>*</span></label>
                            <input type="date" min={formatDateYYYYMMDD(new Date().toISOString().split('T')[0])} name='allocationEndDate' value={formData.allocationEndDate} onChange={handleInput} disabled={action == 'view' ? true : false} />
                            {/* {errors.orderIn && <p className='error-message'>{errors.orderIn}</p>} */}
                        </div>
                    </div>
                    <div className="buttons-container">
                        <button className="approve-button" onClick={HandleSubmit} disabled={action == 'view' ? true : false}>Submit</button>
                        {/* <button className="cancel-button" onClick={clearForm} disabled={action == 'view' ? true : false}>Cancel</button> */}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditStaffAllocation;