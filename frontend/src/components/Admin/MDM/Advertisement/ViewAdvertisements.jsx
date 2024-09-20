import { React, useEffect, useState, useCallback } from "react";
import axiosHttpClient from "../../../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import AdminHeader from "../../../../common/AdminHeader";
import { useNavigate } from "react-router-dom";
import "./ViewAdvertisements.css";
import "../../../../common/CommonTable.css";

export default function ViewAdvertisements() {
  const [tableData, setTableData] = useState([]);
  const [givenReq, setGivenReq] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  let navigate = useNavigate();

  async function fetchAdvertisementData(givenReq, pageSize, pageNumber) {
    try {
      const res = await axiosHttpClient("VIEW_ADVARTISEMENT_API", "post", {
        givenReq: givenReq,
        page_size: pageSize,
        page_number: pageNumber,
      });
      console.log("view ad response = ", res.data);
      setTableData(res.data.data);
    } catch (error) {
      console.error(error);
      setTableData([]);
    }
  }

  const debounce = (fn, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const debouncedFetchAdvertisementData = useCallback(
    debounce(fetchAdvertisementData, 500),
    []
  );

  useEffect(() => {
    debouncedFetchAdvertisementData(givenReq, pageSize, pageNumber);
  }, [givenReq, pageSize, pageNumber, debouncedFetchAdvertisementData]);

  return (
    <>
      <AdminHeader />
      <div className="AdvertisementList">
        <div className="table-heading">
          <h2>Advertisement List</h2>
        </div>

        <div className="search_text_container">
          <button
            className="search_field_button"
            onClick={() => navigate("/MDM/CreateAdvertisement")}
          >
            Add New Advertisement
          </button>
          <input
            type="text"
            className="search_input_field"
            value={givenReq}
            placeholder="Search by Type..."
            onChange={(e) => setGivenReq(e.target.value)}
          />
        </div>

        <div className="table_Container">
          <table>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                {/* <th>URL</th> */}
                <th>View</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.length > 0 &&
                tableData.map((data, index) => (
                  <tr key={data.advertisementId}>
                    <td>{index + 1}</td>
                    <td>{data.advertisementType}</td>
                    <td>{data.description || "NA"}</td>
                    <td
                      className={`${
                        data.statusId === 1
                          ? "active-status"
                          : "inactive-status"
                      }`}
                    >
                      {data.statusId===1 ? "ACTIVE":"INACTIVE"}
                    </td>
                    {/* <td>{decodeURI(data.url)}</td> */}
                    <td>
                      <FontAwesomeIcon icon={faEye} />
                    </td>
                    <td>
                    <FontAwesomeIcon
                        icon={faPenToSquare}
                        onClick={() =>
                          navigate("/MDM/UpdateAdvertisement", {
                            state: { advertisement: data },
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Previous
          </button>
          <span>Page {pageNumber}</span>
          <button onClick={() => setPageNumber(pageNumber + 1)}>Next</button>
        </div>
      </div>
    </>
  );
}
