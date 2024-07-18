import {
  faEye,
  faPenToSquare,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import AdminHeader from "../../../../common/AdminHeader";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { decryptData, encryptData } from "../../../../utils/encryptData";
import axiosHttpClient from "../../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ViewFeedbackList.css";
// import "../Grievance/ViewGrievanceList.css"
import { formatDate } from "../../../../utils/utilityFunctions";

export default function ViewFeedbackList() {
  let navigate = useNavigate();
  let limit = 10;
  let page = 1;

  const [tableData, setTableData] = useState([]);
  const [givenReq, setGivenReq] = useState("");

  async function fetchListOfUserData(givenReq = null) {
    try {
      let res = await axiosHttpClient("ADMIN_VIEW_FEEDBACK_LIST", "post", {
        givenReq,
      });
      console.log("here Respons of userData", res);
      if (Array.isArray(res.data.data)) {
        // Sort the data by createdOn date in descending order
        const sortedData = res.data.data.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        setTableData(sortedData);
      } else {
        console.error("Fetched data is not an array:", res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }



  // function to manage API calls while user search input entry
  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  //Debounced fetchFacilityList function while searching
  const debouncedFetchUserList = useCallback(
    debounce(fetchListOfUserData, 1000),
    []
  );

  useEffect(() => {
    document.title = "ADMIN | AMA BHOOMI";
    fetchListOfUserData();
  }, []);

  useEffect(() => {
    if (givenReq != null) debouncedFetchUserList(givenReq);
  }, [givenReq, debouncedFetchUserList]);

  function encryptDataId(id) {
    let res = encryptData(id);
    return res;
  }

  const handleViewDetails = (id) => {
    navigate(
      `/activity/ViewFeedbackDetails?feedbackId=${encryptDataId(
        id
      )}&action=view`
    );
  };

  return (
    <>
      <AdminHeader />
      <div className="ViewFeedbackList">
        <div className="Main_Conatiner_table">
          <div className="table-heading">
            <h2 className="">List of Feedback</h2>
          </div>

          <div className="search_text_conatiner">
            {/* <button className='search_field_button' onClick={() => navigate('/UAC/Users/Create')}>Create new user</button> */}
            <input
              type="text"
              className="search_input_field"
              value={givenReq}
              placeholder="Search..."
              onChange={(e) => setGivenReq(e.target.value)}
            />
            {/* <SearchDropdown /> */}
          </div>

          <div className="table_Container">
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Mobile Number</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Posted Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.length > 0 ? (
                  tableData?.map((data, index) => (
                    <tr key={index}>
                      <td data-label="Name">{data.name}</td>
                      <td data-label="Email">{data.email}</td>
                      <td data-label="Number">{data.mobile}</td>
                      <td data-label="Subject">{data.subject}</td>
                      <td data-label="Posted Date">
                        {formatDate(data.createdOn)}
                      </td>
                      {/* <td data-label="Action">
                        <Link
                          to={{
                            pathname: "/activity/ViewFeedbackDetails",
                            search: `?feedbackId=${encryptDataId(data.feedbackId)}&action=view`,
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td> */}
                      <td data-label="Action">
                        <FontAwesomeIcon
                          icon={faEye}
                          onClick={() => handleViewDetails(data.feedbackId)}
                          style={{ cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No feedback data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
