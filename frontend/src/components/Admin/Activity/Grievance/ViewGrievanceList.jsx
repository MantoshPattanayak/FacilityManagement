import { faEye, faPenToSquare, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from '../../../../common/AdminHeader';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { decryptData, encryptData } from '../../../../utils/encryptData';
import axiosHttpClient from '../../../../utils/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './ViewGrievanceList.css';
import { formatDate } from '../../../../utils/utilityFunctions';

export default function ViewGrievanceList() {

    let navigate = useNavigate();
    let limit = 10;
    let page = 1;

    const [tableData, setTableData] = useState([]);
    const [givenReq, setGivenReq] = useState('');

    async function fetchListOfUserData(givenReq = null) {
        try {
            let res = await axiosHttpClient('ADMIN_VIEW_GRIEVANCE_LIST_API', 'post', { givenReq });
            setTableData(res.data.grievanceListData);
            console.log(res.data.grievanceListData);
        }
        catch (error) {
            console.error(error);
            setTableData([]);
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
    const debouncedFetchUserList = useCallback(debounce(fetchListOfUserData, 1000), []);

    useEffect(() => {
        document.title = 'ADMIN | AMA BHOOMI';
        fetchListOfUserData();
    }, []);

    useEffect(() => {
        if (givenReq != null)
            debouncedFetchUserList(givenReq);
    }, [givenReq, debouncedFetchUserList]);


    function encryptDataId(id) {
        let res = encryptData(id);
        return res;
    }

    return (
        <>
            <AdminHeader />
            <div className='ViewGrievanceList'>
                <div className="Main_Conatiner_table">
                    <div className='table-heading'>
                        <h2 className="">List of Grievances</h2>
                    </div>

                    <div className="search_text_conatiner">
                        {/* <button className='search_field_button' onClick={() => navigate('/UAC/Users/Create')}>Create new user</button> */}
                        <input type="text" className="search_input_field" value={givenReq} placeholder="Search..." onChange={(e) => setGivenReq(e.target.value)} />
                        {/* <SearchDropdown /> */}
                    </div>

                    <div className="table_Container">
                        <table >
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Mobile Number</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Posted Date</th>
                                    <th scope="col">Closure Date</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    tableData?.length > 0 && tableData?.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label="Name">{data.fullname}</td>
                                                <td data-label="Email">{data.emailId}</td>
                                                <td data-label="Number">{data.phoneNo}</td>
                                                <td data-label="Subject">{data.subject}</td>
                                                <td data-label="Posted Date">{formatDate(data.createdOn)}</td>
                                                <td data-label="Closure Date">{formatDate(data.actionTakenDate) || 'NA'}</td>
                                                <td data-label="Status"><p className={data.status == 'Pending' ? 'text-yellow-500' : data.status == 'Closed' ? 'text-green-500' : ''}>{data.status || 'NA'}</p></td>
                                                <td data-label="Action">
                                                    <Link
                                                        to={{
                                                            pathname: '/activity/grievance-action',
                                                            search: `?g=${encodeURIComponent(encryptDataId(data.grievanceMasterId))}${data.status == 'Pending' ? '&action=edit' : data.status == 'Closed' ? '&action=view' : '&action=view'}`
                                                        }}
                                                    >
                                                        {
                                                            data.status == 'Pending' ? <FontAwesomeIcon icon={faPenToSquare} /> : data.status == 'Closed' ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEye} />
                                                        }
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