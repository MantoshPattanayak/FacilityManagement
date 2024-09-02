import { faEye, faCheckCircle, faPenToSquare, faAngleDown, faUserPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from '../../../../common/AdminHeader';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { encryptData } from '../../../utils/encryptData';
import { encryptData } from '../../../../utils/encryptData';
import axiosHttpClient from '../../../../utils/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from 'react';
import './ViewTariffList.css';
// here Funcation of view Tariff Details -------------------------------------------------
const ViewTariffList = () => {
    let navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);
    const [givenReq, setGivenReq] = useState();
    // API call to fetch list of registered facilities -------------------------
    async function fetchTariffList(givenReq = null) {
        try {
            let res = await axiosHttpClient('View_Tariff_List_Api', 'post', {
                givenReq: givenReq,
                facilityTypeId: null,
            });
            console.log("Table Data:", res);
            setTableData(res.data.tariffData);
           
        }
        catch (error) {
            console.error(error);
            setTableData([]);
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
    //Debounced fetchTariffList function while searching -------------------------
    const debouncedFetchTariffList = useCallback(debounce(fetchTariffList, 1000), []);
    // on page load, fetch data and set title --------------------------------------
    useEffect(() => {
        document.title = 'ADMIN | AMA BHOOMI';
        fetchTariffList();
    }, []);
    // on search input, call fetch data function-------------------------------------
    useEffect(() => {
        if (givenReq != null)
            debouncedFetchTariffList(givenReq);
    }, [givenReq, debouncedFetchTariffList]);
    return (
        <div className=''>
            <AdminHeader />
            <div className="ListOfTariffs">
                <div className='table-heading'>
                    <h2 className="">List of Tariff Details</h2>
                </div>
                <div className="search_text_conatiner">
                    <input type="text" className="search_input_field" value={givenReq} placeholder="Search..." onChange={(e) => setGivenReq(e.target.value)} />
                </div>
                <div className="table_container">
                    <table>
                        <thead className='overflow-hidden'>
                            {/* <th scope="col">Sl No.</th> */}
                            <tr>
                                <th scope="col">Facility Name</th>
                                <th scope="col">Tariff Type</th>
                                <th scope="col">Create</th>
                                <th scope="col">Update</th>
                                <th scope="col">View</th>
                            </tr>
                        </thead>
                        <tbody className='overflow-y-scroll max-h-[600px]'>
                            {
                                tableData?.length > 0 && tableData?.map((data, index) => {
                                    return (
                                        <tr key={data.index}>
                                            {/* <td data-label="Sl No.">{index + 1}</td> */}
                                            <td data-label="Facility Name">{data.facilityname}</td>
                                            <td data-label="Tariff for">{data.tariffType}</td>
                                            {data.tariffCheck == 0 ? (
                                                <td data-label="View">
                                                    <Link
                                                        to={{

                                                            pathname: '/mdm/TariffDetails',
                                                            search: `?facilityId=${encryptDataId(data.facilityId)}&facilityTypeId=${encryptDataId(data.facilityTypeId)}&action=view`
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faPlusCircle} />
                                                    </Link>
                                                </td>
                                            ) : (
                                                <td>
                                                    {/* <FontAwesomeIcon icon={faCheckCircle} className='text-green-700' /> */}
                                                    Created
                                                </td>
                                            )}
                                            {data.tariffCheck == 1 ? (
                                                <td data-label="Update">
                                                    <Link
                                                        to={{
                                                            pathname: '/mdm/Tariff_View_Details',

                                                            search: `?facilityId=${encryptDataId(data.facilityId)}&facilityTypeId=${encryptDataId(data.facilityTypeId)}&activityId=${encryptDataId(data.activityId)}&tariffTypeId=${encryptDataId(data.tariffTypeId)}&action=Edit`}}title='Edit'
                                                    >
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </Link>

                                                </td>
                                            ) : (
                                                <td>Not Created</td>
                                            )}
                                            {data.tariffCheck == 1 ? (
                                                <td data-label="View">
                                                    <Link
                                                        to={{
                                                            pathname: '/mdm/Tariff_View_Details',
                                                            search: `?facilityId=${encryptDataId(data.facilityId)}&facilityTypeId=${encryptDataId(data.facilityTypeId)}&activityId=${encryptDataId(data.activityId)}&tariffTypeId=${encryptDataId(data.tariffTypeId)}&action=View`
                                                        }}
                                                        title='View'
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Link>

                                                </td>

                                            ) : (
                                                <td>Not Created</td>
                                            )}


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

export default ViewTariffList;