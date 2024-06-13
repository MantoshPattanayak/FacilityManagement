import { faEye, faPenToSquare, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from '../../../common/AdminHeader'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { encryptData } from '../../../utils/encryptData';
import axiosHttpClient from '../../../utils/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommonFooter from '../../../common/Common_footer1';

export default function Facility_ViewList() {

    let navigate = useNavigate();
    let limit = 10;
    let page = 1;

    const [tableData, setTableData] = useState([]);
    const [searchOptions, setSearchOptions] = useState([]);
    const [givenReq, setGivenReq] = useState();

    async function fetchFacilityList() {
        try {
            let res = await axiosHttpClient('View_Park_Data', 'post', {
                givenReq: inputFacility,
                facilityTypeId: null,
            });
            setTableData(res.data.data);
            console.log(res.data.data);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        document.title = 'ADMIN | AMA BHOOMI';
        fetchFacilityList();
    }, []);

    useEffect(() => {
        if(givenReq != null)
            autoSuggest(givenReq);
    }, [givenReq]);


    function encryptDataId(id) {
        let res = encryptData(id);
        return res;
    }

    return (
        <>
            <AdminHeader />
            <div className="Main_Conatiner_table">
                <div className='table-heading'>
                    <h2 className="table-heading">List of Users</h2>
                </div>

                <div className="search_text_conatiner">
                    <button className='search_field_button' onClick={() => navigate('/UAC/Users/Create')}>Create new user</button>
                    <input type="text" className="search_input_field" value={givenReq} placeholder="Search..." onChange={(e) => setGivenReq(e.target.value)} />
                    {/* <SearchDropdown /> */}
                </div>

                <div className="table_Container">
                    <table >
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Mobile Number</th>
                                <th scope="col">Email Address</th>
                                <th scope="col">Role</th>
                                <th scope="col">Status</th>
                                <th scope="col">View</th>
                                <th scope="col">Edit</th>
                            </tr>
                        </thead>
                        <tbody >
                            {
                                tableData?.length > 0 && tableData?.map((data) => {
                                    return (
                                        <tr key={data.privateUserId}>
                                            <td data-label="Name">{data.fullName}</td>
                                            <td data-label="Number">{data.contactNo}</td>
                                            <td data-label="Email">{data.emailId}</td>
                                            <td data-label="Role">{data.roleName}</td>
                                            <td data-label="Status">{data.status}</td>
                                            <td data-label="View">
                                                <Link
                                                    to={{
                                                        pathname: '/UAC/Users/Edit',
                                                        search: `?userId=${encodeURIComponent(encryptDataId(data.privateUserId))}&action=view`
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Link>
                                            </td>
                                            <td data-label="Edit">
                                                <Link
                                                    to={{
                                                        pathname: '/UAC/Users/Edit',
                                                        search: `?userId=${encodeURIComponent(encryptDataId(data.privateUserId))}&action=edit`
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
            <CommonFooter />
        </>
    )
}