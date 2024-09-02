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
import TariffDetails from "./TariffDetails";
const Tariff_View_Details = () => {
  const facilityTypeId = decryptData(
    new URLSearchParams(location.search).get("facilityTypeId")
  );
  const facilityId = decryptData(
    new URLSearchParams(location.search).get("facilityId")
  );
  const entityId = decryptData(
    new URLSearchParams(location.search).get("activityId")
  );
  const tariffTypeId = decryptData(
    new URLSearchParams(location.search).get("tariffTypeId")
  );
  console.log("here facilitytype, facilityid, entityid, tariffTypeId", facilityId, facilityTypeId, entityId, tariffTypeId)
  const action = new URLSearchParams(location.search).get('action');
  // Get initial Data
  let navigate = useNavigate();
  // show the error msg set in useSate --------------------------------------------
  const [errors, setErrors] = useState([]);
  const [GetInitailName, setGetInitailName] = useState([])
  // Post Tariff Data and set Rows ------------------------------------------------
  const [tariffRows, setTariffRows] = useState([
    {
      facilityId: '',
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
      tariffTypeId: '',
      entityId: ''
    }
  ]);
  // Get Initial Data here (Call api) -----------------------
  async function GetTariffInitailData() {
    try {
      let res = await axiosHttpClient("VIEW_TARIFF_DATA_BY_ID_API", "post", {
        facilityTypeId,
        facilityId,
        entityId,
        tariffTypeId
      });
      console.log("View fetch data of Tariff By Id", res)
      const fetchedRows = res.data.tariffData.facilitytariffdetails.map(row => ({
        ...row,
        dayWeek: {
          sun: row.sun || '',
          mon: row.mon || '',
          tue: row.tue || '',
          wed: row.wed || '',
          thu: row.thu || '',
          fri: row.fri || '',
          sat: row.sat || ''
        }
      }));
      setTariffRows(fetchedRows);
    } catch (err) {
      console.log("Here error of View By Id  Tariff Data", err);
    }
  }
  // Handle Post Tariff Value (OnChange) ---------------------
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
  // Post the data of Tariff details ------------------------
  async function handle_Post_TariffData_Tariff(newRows) {
  
    const errorList = validate();
    if (errorList.some(err => Object.keys(err).length > 0)) {
      return; // Prevent submission if there are errors
    }
    try {
      if (!Array.isArray(newRows) || newRows.length === 0) {
        return; // No new rows to post
      }

      console.log("here new row", newRows)
      let res = await axiosHttpClient('Create_Tariff_Details_Api', 'post', {
        facilityTariffData: newRows
      });
      toast.success('Tariff Updated has been done successfully.', {
        autoClose: 2000,
        onClose: () => {
          setTimeout(() => {
            navigate('/ViewTariffList');
          }, 1000);
        }
      });
      console.log("Here Response Post Tariff Data", res);

    } catch (err) {
      toast.error('Faild to  Updated Tariff. Try agin22 !')
      console.log("Here Error of Tariff Post data", err);
    }
  }
  // Update Tariff Data ------------------------------------------------
  async function UpdateTariffData(existingRows) {
    console.log("here existing Rows", existingRows)
    const errorList = validate();
    if (errorList.some(err => Object.keys(err).length > 0)) {
      return; // Prevent submission if there are errors
    }
    try {
      if (!Array.isArray(existingRows) || existingRows.length === 0) {
        return; // No existing rows to update
      }
      console.log("here existing row", existingRows)
      let res = await axiosHttpClient('Update_Tariff_Data', 'put', {
        facilityTariffData: existingRows
      })
      toast.success('Tariff Updated has been done successfully.', {
        autoClose: 2000,
        onClose: () => {
          setTimeout(() => {
            navigate('/ViewTariffList');
          }, 1000);
        }
      });
      console.log("here Response of Tariff Updated", res)

    }
    catch (err) {
      console.log("here Error of Update Tariff Data", err)
      toast.error('Faild to  Updated Tariff. Try agin !')
    }
  }
  // here Hanlde for Post the data (accoding to action) ------------------
  const handleSubmitTariffData = () => {
    const newRows = tariffRows.filter(row => row.isNew);
    const existingRows = tariffRows.filter(row => !row.isNew);
    handle_Post_TariffData_Tariff(newRows);
    UpdateTariffData(existingRows);
  }
  // here Delete funcation (Delete Tariff data)------------------
  async function DeleteTariffData(tariffDetailId) {
    console.log("here OnClikc api call pass paramter", tariffDetailId)
    try {
      let res = await axiosHttpClient('Delete_Tariff_Data', 'post', {
        statusId: 2,
        tariffDetailId
      })
      console.log("here Response of Delete Tariff Data", res)
      toast.success('Tariff data deleted successfully.');

      GetTariffInitailData(); //Reload the data (After SucessFully Delete) ------
    }
    catch (err) {
      console.log("here Error of Delete Tariff Data", err)
      toast.error('Failed to delete tariff data.');
    }
  }
  async function GetName_and_initail_Data() {
    try {
      let res = await axiosHttpClient("Initial_Data_Tariff_Details", 'post', {
        facilityTypeId,
        facilityId,
        tariffTypeId
      })
      console.log("here Response of Get Name and initail data ", res)
      setGetInitailName(res.data.facilityData)
    }
    catch (err) {
      console.log("here Error of Get Inatil Data and Name", err)
    }
  }
  // Add row ------------------------------------------------------------
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
        tariffTypeId:'',
        entityId:'',
        isNew: true
      }
    ]);
    toast.success("Row added successfully!")
  };
  // Remove Row -----------------------------------------------------------
  const deleteRow = (index, tariffDetailId) => {
    console.log("here TariffDetailsId", tariffDetailId)
    if (tariffDetailId) {
      DeleteTariffData(tariffDetailId)
    } else {
      const updatedRows = [...tariffRows];
      updatedRows.splice(index, 1);
      console.log("Updated Row", updatedRows)
      setTariffRows(updatedRows);
    }


  };
  // Vaildation of Update Tariff Data and Create Tariff Data -------------------------
  const validate = () => {
    const errorList = [];
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
      errorList[index] = err;
    });
    setErrors(errorList);
    return errorList;
  };


  // useEffect for Update the get initail data of Tariff -----------------------
  useEffect(() => {
    GetTariffInitailData();
    GetName_and_initail_Data();
  }, []);

  return (
    <div>
      <AdminHeader />
      <div className="tariff-container">
        {/* input fields of form................ */}
        <div className="w-[100%] flex justify-center items-center">
          <div className="w-[90%] flex flex-col justify-center">
            <h1 className="Park_Name">{GetInitailName.facilityname}</h1>
            <p className="Address">{GetInitailName.address}</p>
          </div>
          <div className="w-[10%]">
            <button className="back_btn" onClick={(e)=> { navigate("/mdm/ViewTariffList") }}>
                <FontAwesomeIcon icon={faArrowLeftLong} /> Back
            </button>
          </div>
        </div>

        <div className="table-container">
          {
            action == 'Edit' &&
            <div className="table-buttons">
              <button className="add-icon" onClick={addRow}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button className="edit-icon" onClick={handleSubmitTariffData}>
                Save
              </button>
            </div>
          }
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
                {
                  action == 'Edit' &&
                  <th>Delete</th>
                }
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
                      disabled={action == 'View' ? 1 : 0}
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
                      disabled={action == 'View' ? 1 : 0}
                    />
                    {errors[index]?.operatingHoursTo && (
                      <span className="error">{errors[index].operatingHoursTo}</span>
                    )}
                  </td>
                  <td><input type="text"
                    name="sun"
                    value={row.dayWeek.sun}
                    onChange={(e) => HanldePostTraiff(e, index)}
                    disabled={action == 'View' ? 1 : 0}
                  />
                    {errors[index]?.sun && (
                      <span className="error">{errors[index].sun}</span>
                    )}
                  </td>
                  <td>
                    <input type="text"
                      name="mon"
                      value={row.dayWeek.mon}
                      onChange={(e) => HanldePostTraiff(e, index)}
                      disabled={action == 'View' ? 1 : 0}
                    />
                    {errors[index]?.mon && (
                      <span className="error">{errors[index].mon}</span>
                    )}
                  </td>
                  <td><input type="text"
                    name="tue"
                    value={row.dayWeek.tue}
                    onChange={(e) => HanldePostTraiff(e, index)}
                    disabled={action == 'View' ? 1 : 0}
                  />
                    {errors[index]?.tue && (
                      <span className="error">{errors[index].tue}</span>
                    )}
                  </td>
                  <td><input type="text" name="wed"
                    value={row.dayWeek.wed}
                    onChange={(e) => HanldePostTraiff(e, index)}
                    disabled={action == 'View' ? 1 : 0}
                  />
                    {errors[index]?.wed && (
                      <span className="error">{errors[index].wed}</span>
                    )}
                  </td>
                  <td><input type="text" name="thu" value={row.dayWeek.thu}
                    onChange={(e) => HanldePostTraiff(e, index)}
                    disabled={action == 'View' ? 1 : 0}
                  />
                    {errors[index]?.thu && (
                      <span className="error">{errors[index].thu}</span>
                    )}
                  </td>
                  <td><input type="text" name="fri"
                    value={row.dayWeek.fri}
                    onChange={(e) => HanldePostTraiff(e, index)}
                    disabled={action == 'View' ? 1 : 0}
                  />
                    {errors[index]?.fri && (
                      <span className="error">{errors[index].fri}</span>
                    )}
                  </td>
                  <td><input type="text" name="sat" value={row.dayWeek.sat}
                    onChange={(e) => HanldePostTraiff(e, index)}
                    disabled={action == 'View' ? 1 : 0}
                  />
                    {errors[index]?.sat && (
                      <span className="error">{errors[index].sat}</span>
                    )}
                  </td>
                  {
                    action == 'Edit' &&
                    <td>
                      <button className="delete-icon" onClick={() => deleteRow(index, row.tariffDetailId)}>
                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                      </button>
                    </td>
                  }
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

export default Tariff_View_Details;
