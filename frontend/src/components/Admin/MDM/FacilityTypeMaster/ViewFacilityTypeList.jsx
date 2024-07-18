import { faEye, faPenToSquare, faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from '../../../../common/AdminHeader';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { decryptData, encryptData } from '../../../../utils/encryptData';
import axiosHttpClient from '../../../../utils/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ViewFacilityTypeList.css';
import { formatDate } from '../../../../utils/utilityFunctions';

export default function ViewFacilityTypeList() {
    let navigate = useNavigate();
    let limit = 10;
    let page = 1;

    const [tableData, setTableData] = useState([]);
    const [givenReq, setGivenReq] = useState('');

    async function fetchFacilityTypesList(givenReq = null) {
        try {
            let res = await axiosHttpClient('VIEW_FACILITYTYPE_LIST_API', 'post', { givenReq });
            setTableData(res.data.data);
            console.log(res.data.data);
        }
        catch (error) {
            console.error(error);
        }
    }

    // function to manage API calls while user search input entry
    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fn(...args)
            }, delay);
        }
    }

    //Debounced fetchFacilityList function while searching
    const debouncedFetchFacilityTypeList = useCallback(debounce(fetchFacilityTypesList, 1000), []);

    useEffect(() => {
        document.title = 'ADMIN | AMA BHOOMI';
        debouncedFetchFacilityTypeList();
    }, []);

    useEffect(() => {
        if (givenReq != null)
            debouncedFetchFacilityTypeList(givenReq);
    }, [givenReq, debouncedFetchFacilityTypeList]);

    function encryptDataId(id) {
        let res = encryptData(id);
        return res;
    }

    return (
        <>
            <AdminHeader />
            <div className='ViewFacilityTypeList'>
                <div className="Main_Conatiner_table">
                    <div className='table-heading'>
                        <h2 className="">List of AMA BHOOMI Assets</h2>
                    </div>

                    <div className="search_text_conatiner">
                        <button className='search_field_button' onClick={() => navigate('/mdm/create-facility-type-list')}><FontAwesomeIcon icon={faPlus} /> Add new asset</button>
                        <input type="text" className="search_input_field" value={givenReq} placeholder="Search..." onChange={(e) => setGivenReq(e.target.value)} />
                        {/* <SearchDropdown /> */}
                    </div>

                    <div className="table_Container">
                        <table >
                            <thead>
                                <tr>
                                    <th scope="col">Code</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Created On</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">View</th>
                                    <th scope="col">Edit</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    tableData?.length > 0 && tableData?.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label="Code">{data.code}</td>
                                                <td data-label="Description">{data.description}</td>
                                                <td data-label="Created On">{formatDate(data.createdOn)}</td>
                                                <td data-label="Status">
                                                    <p className={data.statusId == '1' ? 'text-green-500' : data.statusId == '2' ? 'text-red-500' : ''}>
                                                        {data.statusId == '1' ? 'ACTIVE' : data.status == '2' ? 'INACTIVE' : ''}
                                                    </p>
                                                </td>
                                                <td data-label="View">
                                                    <Link
                                                        to={{
                                                            pathname: '/mdm/edit-facility-type-list',
                                                            search: `?s=${encodeURIComponent(encryptDataId(data.facilitytypeId))}&action=view`
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Link>
                                                </td>
                                                <td data-label="Edit">
                                                    <Link
                                                        to={{
                                                            pathname: '/mdm/edit-facility-type-list',
                                                            search: `?s=${encodeURIComponent(encryptDataId(data.facilitytypeId))}${data.statusId == '1' ? '&action=edit' : data.statusId == '2' ? '&action=view' : '&action=view'}`
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
        </>
    )
}