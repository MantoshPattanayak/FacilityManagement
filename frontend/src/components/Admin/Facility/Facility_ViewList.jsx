import { faEye, faPenToSquare, faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from '../../../common/AdminHeader'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { encryptData } from '../../../utils/encryptData';
import axiosHttpClient from '../../../utils/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Facility_ViewList.css';
import { useCallback } from 'react';
export default function Facility_ViewList() {
    let navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);
    const [givenReq, setGivenReq] = useState();
    // API call to fetch list of registered facilities -------------------------
    async function fetchFacilityList(givenReq = null) {
        try {
            let res = await axiosHttpClient('View_Park_Data', 'post', {
                givenReq: givenReq,
                facilityTypeId: null,
            });
            setTableData(res.data.data);
            console.log("Here Response of Facility List Data", res);
        }
        catch (error) {
            console.error(error);
        }
    }
    // function to encrypt required data ----------------------------------------
    function encryptDataId(id) {
        let res = encryptData(id);
        return res;
    }
    // function to manage API calls while user search input entry ---------------
    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }
    //Debounced fetchFacilityList function while searching -------------------------
    const debouncedFetchFacilityList = useCallback(debounce(fetchFacilityList, 1000), []);
    // on page load, fetch data and set title --------------------------------------
    useEffect(() => {
        document.title = 'ADMIN | AMA BHOOMI';
        fetchFacilityList();
    }, []);
    // on search input, call fetch data function-------------------------------------
    useEffect(() => {
        if (givenReq != null)
            debouncedFetchFacilityList(givenReq);
    }, [givenReq, debouncedFetchFacilityList]);

    return (
        <div className=''>
            <AdminHeader />
            <div className="ListOfFacilities">
                <div className='table-heading'>
                    <h2 className="">List of Facility Details</h2>
                </div>
                <div className="search_text_conatiner">
                    <button className='search_field_button' onClick={() => navigate('/facility-registration')}>
                        <FontAwesomeIcon icon={faPlus} /> Facility Registration
                    </button>
                    <input type="text" className="search_input_field" value={givenReq} placeholder="Search..." onChange={(e) => setGivenReq(e.target.value)} />
                    {/* <SearchDropdown /> */}
                </div>
                <div className="table_Container">
                    <table >
                        <thead>
                            {/* <th scope="col">Sl No.</th> */}
                            <th scope="col">Facility Name</th>
                            <th scope="col">Facility Address</th>
                            <th scope="col">Location (Latitude, Longitude)</th>
                            <th scope="col">Ownership</th>
                            {/* <th scope="col">Status</th> */}
                            <th scope="col">View</th>
                            <th scope="col">Edit</th>
                        </thead>
                        <tbody >
                            {
                                tableData?.length > 0 && tableData?.map((data, index) => {
                                    return (
                                        <tr key={data.index}>
                                            {/* <td data-label="Sl No.">{index + 1}</td> */}
                                            <td data-label="Facility Name">{data.facilityname}</td>
                                            <td data-label="Address">{data.address}</td>
                                            <td data-label="Location">{data.latitude}, {data.longitude}</td>
                                            <td data-label="Ownership">{data.ownership}</td>
                                            {/* <td data-label="Status">{data.status}</td> */}
                                            <td data-label="View">
                                                <Link
                                                    to={{
                                                        pathname: '/Facility_Edit_View',
                                                        search: `?facilityId=${encodeURIComponent(encryptDataId(data.facilityId.toString()))}&facilityTypeId=${encodeURIComponent(encryptDataId(data.facilityTypeId))}&action=View`
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Link>
                                            </td>
                                            <td data-label="Edit">
                                                <Link
                                                    to={{
                                                        pathname: '/Facility_Edit_View',
                                                        search: `?facilityId=${encodeURIComponent(encryptDataId(data.facilityId))}&facilityTypeId=${encodeURIComponent(encryptDataId(data.facilityTypeId))}&action=Edit`
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}