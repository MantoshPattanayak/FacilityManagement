import { faEye, faPenToSquare, faAngleDown, faUserPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from '../../../../common/AdminHeader';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { encryptData } from '../../../utils/encryptData';
import { encryptData } from '../../../../utils/encryptData';
import axiosHttpClient from '../../../../utils/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from 'react';
// here Funcation of view Tariff Details -------------------------------------------------
const Tariff_View_Edit = () => {
    let navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);
    const [givenReq, setGivenReq] = useState();
    // API call to fetch list of registered facilities -------------------------
    async function fetchFacilityList(givenReq = null) {
        try {
            let res = await axiosHttpClient('View_Tariff_List_Api', 'post', {
                givenReq: givenReq,
                facilityTypeId: null,
            });
            setTableData(res.data.tariffData);
            console.log("Table Data:", res);
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
        <div className='ListOfUsers1'>
            <AdminHeader />
            <div className="Main_Conatiner_table">
                <div className='table-heading'>
                    <h2 className="table-heading">View Tariff Details</h2>
                </div>
                <div className="search_text_conatiner">
                    <input type="text" className="search_input_field" value={givenReq} placeholder="Search..." onChange={(e) => setGivenReq(e.target.value)} />

                </div>
                <div className="table_Container">
                    <table >
                        <thead>
                            <th scope="col">Sl No.</th>
                            <th scope="col">Facility Name</th>
                            <th scope="col">Facility Address</th>
                            <th scope="col">Location (Latitude, Longitude)</th>
                            <th scope="col">Ownership</th>
                            <th scope="col">Create</th>
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
                                            <td data-label="View">
                                                <Link
                                                    to={{
                                                        pathname: '/TariffDetails',
                                                        search: `?facilityId=${encryptDataId(data.facilityId)}&facilityTypeId=${encryptDataId(data.facilityTypeId)}&action=view`
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPlusCircle} />
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

export default Tariff_View_Edit;