import { faEye, faPenToSquare, faAngleDown } from '@fortawesome/free-solid-svg-icons';
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

    // API call to fetch list of registered facilities
    async function fetchFacilityList(givenReq = null) {
        try {
            let res = await axiosHttpClient('View_Park_Data', 'post', {
                givenReq: givenReq,
                facilityTypeId: null,
            });
            setTableData(res.data.data);
            console.log(res.data.data);
        }
        catch (error) {
            console.error(error);
        }
    }

    // function to encrypt required data
    function encryptDataId(id) {
        let res = encryptData(id);
        return res;
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
    const debouncedFetchFacilityList = useCallback(debounce(fetchFacilityList, 1000), []);

    // on page load, fetch data and set title
    useEffect(() => {
        document.title = 'ADMIN | AMA BHOOMI';
        fetchFacilityList();
    }, []);

    // on search input, call fetch data function
    useEffect(() => {
        if(givenReq != null)
            debouncedFetchFacilityList(givenReq);
    }, [givenReq, debouncedFetchFacilityList]);

    return (
        <>
            <AdminHeader />
            <div className="Main_Conatiner_table_FacilityReg">
                <div className='table-heading'>
                    <h2 className="table-heading">List of Registered Facilities</h2>
                </div>

                <div className="search_text_conatiner">
                    <button className='search_field_button' onClick={() => navigate('/facility-registration')}>Register new facility</button>
                    <input type="text" className="search_input_field outline-none" value={givenReq} placeholder="Search..." onChange={(e) => setGivenReq(e.target.value)} />
                    {/* <SearchDropdown /> */}
                </div>

                <div className="table_Container">
                    <table >
                        <thead>
                            {/* <tr> */}
                            <th scope="col">Sl No.</th>
                            <th scope="col">Facility Name</th>
                            <th scope="col">Facility Address</th>
                            <th scope="col">Location (Latitude, Longitude)</th>
                            <th scope="col">Ownership</th>
                            <th scope="col">Status</th>
                            <th scope="col">View</th>
                            <th scope="col">Edit</th>
                            {/* </tr> */}
                        </thead>
                        <tbody >
                            {
                                tableData?.length > 0 && tableData?.map((data, index) => {
                                    return (
                                        <tr key={data.index}>
                                            <td data-label="Sl No.">{index + 1}</td>
                                            <td data-label="Facility Name">{data.facilityname}</td>
                                            <td data-label="Address">{data.address}</td>
                                            <td data-label="Location">{data.latitude}, {data.longitude}</td>
                                            <td data-label="Ownership">{data.ownership}</td>
                                            <td data-label="Status">{data.status}</td>
                                            <td data-label="View">
                                                <Link
                                                    to={{
                                                        pathname: '/UAC/Users/Edit',
                                                        search: `?facilityId=${encodeURIComponent(encryptDataId(data.facilityId))}&action=view`
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Link>
                                            </td>
                                            <td data-label="Edit">
                                                <Link
                                                    to={{
                                                        pathname: '/UAC/Users/Edit',
                                                        search: `?facilityId=${encodeURIComponent(encryptDataId(data.facilityId))}&action=edit`
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
        </>
    )
}