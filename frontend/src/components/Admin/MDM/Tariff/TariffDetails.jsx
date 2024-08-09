import React, { useEffect, useState } from "react";
import "./TariffDetails.css"; // Importing CSS file
import AdminHeader from "../../../../common/AdminHeader";
// Font Awesome icon --------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faPenToSquare, faPlus, faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import axiosHttpClient from "../../../../utils/axios";
import { decryptData } from "../../../../utils/encryptData";
//Toast -----------------------------------------------------------------
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const TariffDetails = () => {
  const facilityTypeId = decryptData(
    new URLSearchParams(location.search).get("facilityTypeId")
  );
  const facilityId = decryptData(
    new URLSearchParams(location.search).get("facilityId")
  );
  console.log("Decrypt data", facilityTypeId, facilityId);


  // Get initial Data
  let navigate = useNavigate();
  const [GetInitailData, setGetInitailData] = useState([]);
  const [GetactivityData, setGetactivityData] = useState([]);
  const [GetFacilityData, setGetFacilityData] = useState([]);
  const [errors, setErrors] = useState([]);

  // Post tariff type data
  const [PostTraifftype, setPostTraiffType] = useState({
    tariffTypeId: "",
  });
  // Post Tariff Data
  const [tariffRows, setTariffRows] = useState([
    {
      facilityId: facilityId,
      operatingHoursFrom: "",
      operatingHoursTo: "",
      dayWeek: {
        sun: '',
        mon: '',
        tue: '',
        wed: '',
        thu: '',
        fri: '',
        sat: ''
      },
      tariffTypeId: facilityTypeId,
      entityId: ''
    }
  ]);
  // Handle OnChange of Get initial Data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostTraiffType({ ...PostTraifftype, [name]: value });
    console.log("PostData", PostTraifftype);
  };
  // Get Initial Data here (Call api)
  async function GetTariffInitailData() {
    try {
      let res = await axiosHttpClient("Initial_Data_Tariff_Details", "post", {
        facilityTypeId,
        facilityId,
        tariffTypeId: PostTraifftype.tariffTypeId,
      });
      console.log("initial fetch data", res.data.tariffTypeData)
      console.log("initial data fetch 2", res.data);
      setGetInitailData(res.data.tariffTypeData);
    
       setGetactivityData(res.data.activityData);

      setGetFacilityData(res.data.facilityData);
      console.log("Here Response of Tariff Initial Data", res);
    } catch (err) {
      console.log("Here error of Initial Data of Tariff", err);
    }
  }

  // Handle Post Tariff Value (OnChange)
  const HanldePostTraiff = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...tariffRows];
    if (name === 'entityId') {
      updatedRows[index][name] = parseInt(value, 10) || 0;
    } else if (name in updatedRows[index].dayWeek) {
      updatedRows[index].dayWeek[name] = value;
    } else {
      updatedRows[index][name] = value;
    }
    setTariffRows(updatedRows);
  };

  // Post the data of Tariff details
  async function handle_Post_TariffData() {
    console.log("post data");
    const errorList = validate();
    if (errorList.some(err => Object.keys(err).length > 0)) {
      return; // Prevent submission if there are errors
    }
    try {
      let res = await axiosHttpClient('Create_Tariff_Details_Api', 'post', {
        facilityTariffData: tariffRows
      });
      toast.success('Tariff registration has been done successfully.', {
        autoClose: 2000,
        onClose: () => {
          setTimeout(() => {
            navigate('/mdm/ViewTariffList');
          }, 1000);
        }
      });
      console.log("Here Response Post Tariff Data", res);

    } catch (err) {
      toast.error('Tariff registration failed.');
      console.log("Here Error of Tariff Post data", err);
    }
  }
  // Add row
  const addRow = () => {
    setTariffRows([
      ...tariffRows,
      {
        facilityId: '',
        operatingHoursFrom: '',
        operatingHoursTo: '',
        dayWeek: {
          sun: '',
          mon: '',
          tue: '',
          wed: '',
          thu: '',
          fri: '',
          sat: ''
        },
        tariffTypeId: '',
        entityId: ''
      }
    ]);
  };
  // Remove Row
  const deleteRow = (index) => {
    const updatedRows = [...tariffRows];
    updatedRows.splice(index, 1);
    setTariffRows(updatedRows);
  };
  // Vaildation of Create Tariff -------------------------------------------
  // Vaildation of Create Tariff
  const validate = () => {
    const errorList = [];
    console.log("tariif rows", tariffRows);
    tariffRows.forEach((row, index) => {
      const err = {};
      // Validation for operating hours
      if (row.operatingHoursFrom > row.operatingHoursTo) {
        err.operatingHoursFrom = "Start operating Hours From should be less than or equal to End";
        err.operatingHoursTo = "End operating Hours To should be greater than or equal to Start";
      }
      if (!row.operatingHoursFrom) {
        err.operatingHoursFrom = "Please select the operating hours from";
      }
      if (!row.operatingHoursTo) {
        err.operatingHoursTo = "Please select the operating hours to";
      }

      // Validation for dayWeek prices
      const regexPrice = /^\d{1,3}(?:,?\d{3})*(?:\.\d{1,2})?$/;
      if (!row.dayWeek.sun) {
        err.sun = "Please Enter the Price for Sun";
      } else if (!regexPrice.test(row.dayWeek.sun)) {
        err.sun = "Please Enter a valid price for Sun";
      }
      if (!row.dayWeek.mon) {
        err.mon = "Please Enter the Price for Mon";
      } else if (!regexPrice.test(row.dayWeek.mon)) {
        err.mon = "Please Enter a valid Price for Mon";
      }
      if (!row.dayWeek.tue) {
        err.tue = "Please Enter the Price for Tue";
      } else if (!regexPrice.test(row.dayWeek.tue)) {
        err.tue = "Please Enter a valid Price for Tue";
      }
      if (!row.dayWeek.wed) {
        err.wed = "Please Enter the Price for Wed";
      } else if (!regexPrice.test(row.dayWeek.wed)) {
        err.wed = "Please Enter a valid Price for Wed";
      }
      if (!row.dayWeek.thu) {
        err.thu = "Please Enter the Price for Thu";
      } else if (!regexPrice.test(row.dayWeek.thu)) {
        err.thu = "Please Enter a valid Price for Thu";
      }
      if (!row.dayWeek.fri) {
        err.fri = "Please Enter the Price for Fri";
      } else if (!regexPrice.test(row.dayWeek.fri)) {
        err.fri = "Please Enter a valid Price for Fri";
      }
      if (!row.dayWeek.sat) {
        err.sat = "Please Enter the Price for Sat";
      } else if (!regexPrice.test(row.dayWeek.sat)) {
        err.sat = "Please Enter a valid Price for Sat";
      }

      // Validation for tariffTypeId and entityId (dropdowns)
      if (row.tariffTypeId == "") {
        err.tariffTypeId = "Please select a Facility Type";
      }
      if (row.entityId == "") {
        err.entityId = "Please select an Activities Type";
      }

      errorList[index] = err;
    });
    console.log("Error list", errorList);
    setErrors(errorList);
    return errorList;
  };


  // useEffect for Update the get initail data of Tariff -----------------------
  useEffect(() => {
    GetTariffInitailData();
  }, [PostTraifftype]);


  return (
    <div>
      <AdminHeader />
      <div className="tariff-container">

        {/* input fields of form................ */}
        <div className="w-[100%] flex justify-center items-center">
          <div className="w-[90%] flex flex-col justify-center">
            <h1 className="Park_Name">{GetFacilityData.facilityname}</h1>
            <p className="Address">{GetFacilityData.address}</p>
          </div>
          <div className="w-[10%]">
            <button className="back_btn" onClick={(e)=> { navigate("/mdm/ViewTariffList") }}>
                <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
          </div>
        </div>
        <div className="form">
          <div className="dropdown-container">
            <div className="dropdown-container">
              <select
                className="dropdown"
                name="tariffTypeId"
                value={PostTraifftype.tariffTypeId}
                onChange={handleChange}
              >
                <option value="">Select Facility Type</option>
                {GetInitailData?.length > 0 && GetInitailData?.map((item, index) => (
                  <option value={item.tariffTypeId} key={index}>
                    {item.code}
                  </option>
                ))}
              </select>

              <div className="icon">▼</div>

            </div>
            {!PostTraifftype.tariffTypeId && <p className="error">Please select a facility type.</p>}
          </div>
          <div className="dropdown-container">
            <div className="dropdown-container">
              <select
                className="dropdown"
                name="entityId"
                value={tariffRows[0]?.entityId}
                onChange={(e) => {
                  const { value } = e.target;
                  setTariffRows([{ ...tariffRows[0], entityId: parseInt(value, 10) || 0 }]);
                }}
              >
                <option value="">Select Activities Type</option>
                {GetactivityData?.map((data) => (
                  <option key={data.activityData.activityId} value={data.activityData.activityId}>
                    {data.activityData.activityName}
                  </option>
                ))}
              </select>
              <div className="icon">▼</div>
            </div>
            {!tariffRows[0]?.entityId && <p className="error">Please select an activity type.</p>}
            {/* Additional form fields and handlers */}
          </div>

        </div>

        <div className="table-container">
          <div className="table-buttons">
            <button className="add-icon" onClick={addRow}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="edit-icon" onClick={handle_Post_TariffData}>
              Save
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>From Time</th>
                <th>To Time</th>
                <th>Sun</th>
                <th>Mon</th>
                <th>Thu</th>
                <th>Wed</th>
                <th>Thurs</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Delete</th>

              </tr>
            </thead>
            <tbody>
              {tariffRows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="time"
                      name="operatingHoursFrom"
                      value={row.operatingHoursFrom}
                      onChange={(e) => HanldePostTraiff(e, index)}
                    />
                    {errors[index]?.operatingHoursFrom && (
                      <span className="error">{errors[index].operatingHoursFrom}</span>
                    )}
                  </td>
                  <td>
                    <input
                      type="time"
                      name="operatingHoursTo"
                      value={row.operatingHoursTo}
                      onChange={(e) => HanldePostTraiff(e, index)}
                    />
                    {errors[index]?.operatingHoursTo && (
                      <span className="error">{errors[index].operatingHoursTo}</span>
                    )}
                  </td>
                  <td><input type="text"
                    name="sun"
                    value={row.dayWeek.sun}
                    onChange={(e) => HanldePostTraiff(e, index)} />
                    {errors[index]?.sun && (
                      <span className="error">{errors[index].sun}</span>
                    )}

                  </td>
                  <td>
                    <input type="text"
                      name="mon"
                      value={row.dayWeek.mon}
                      onChange={(e) => HanldePostTraiff(e, index)}
                    />
                    {errors[index]?.mon && (
                      <span className="error">{errors[index].mon}</span>
                    )}
                  </td>
                  <td><input type="text"
                    name="tue"
                    value={row.dayWeek.tue}
                    onChange={(e) => HanldePostTraiff(e, index)}
                  />
                    {errors[index]?.tue && (
                      <span className="error">{errors[index].tue}</span>
                    )}
                  </td>

                  <td><input type="text" name="wed"
                    value={row.dayWeek.wed}
                    onChange={(e) => HanldePostTraiff(e, index)} />
                    {errors[index]?.wed && (
                      <span className="error">{errors[index].wed}</span>
                    )}
                  </td>
                  <td><input type="text" name="thu" value={row.dayWeek.thu}
                    onChange={(e) => HanldePostTraiff(e, index)} />
                    {errors[index]?.thu && (
                      <span className="error">{errors[index].thu}</span>
                    )}
                  </td>
                  <td><input type="text" name="fri"
                    value={row.dayWeek.fri}
                    onChange={(e) => HanldePostTraiff(e, index)} />
                    {errors[index]?.fri && (
                      <span className="error">{errors[index].fri}</span>
                    )}
                  </td>
                  <td><input type="text" name="sat" value={row.dayWeek.sat}
                    onChange={(e) => HanldePostTraiff(e, index)} />
                    {errors[index]?.sat && (
                      <span className="error">{errors[index].sat}</span>
                    )}
                  </td>
                  <td>
                    <button className="delete-icon" onClick={() => deleteRow(index)}>
                      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TariffDetails;
