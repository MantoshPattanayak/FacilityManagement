import { faEye, faPenToSquare, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from '../../../../common/AdminHeader';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { encryptData } from '../../../../utils/encryptData';
import axiosHttpClient from '../../../../utils/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../../Admin/UAC/AccessControl/RoleResourceMapping/SearchDropdown.css';
import CommonFooter from '../../../../common/CommonFooter';

export default function ListOfUsers() {

    let navigate = useNavigate();
    let limit = 10;
    let page = 1;

    let tableDummyData = [
        { id: 1, name: 'ABC', number: '975XXXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 2, name: 'ABC', number: '975XXXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 3, name: 'ABC', number: '975XXXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 4, name: 'ABC', number: '975XXXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 5, name: 'ABC', number: '975XXXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 6, name: 'ABC', number: '975XXXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 7, name: 'ABC', number: '975XXXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 8, name: 'ABC', number: '975XXXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 9, name: 'ABC', number: '975XXXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 10, name: 'ABC', number: '975XXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 11, name: 'ABC', number: '975XXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
        { id: 12, name: 'ABC', number: '975XXXXXXXX', email: 'abc@gmail.com', role: 'abc', status: 'Active', actionList: false },
    ];

    const [tableData, setTableData] = useState(tableDummyData);
    const [searchOptions, setSearchOptions] = useState([]);
    const [givenReq, setGivenReq] = useState();

    async function fetchListOfUserData() {
        try {
            let res = await axiosHttpClient('ADMIN_USER_VIEW_API', 'post');
            setTableData(res.data.data);
            console.log(res.data.data);
        }
        catch (error) {
            console.error(error);
        }
    }

    async function autoSuggest(givenReq) {
        try {
            let res = await axiosHttpClient('ADMIN_USER_AUTOSUGGEST_API', 'get', null, givenReq);
            console.log('auto suggest api response', res.data.data);
            setSearchOptions(res.data.data);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        document.title = 'ADMIN | AMA BHOOMI';
        fetchListOfUserData();
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


const SearchDropdown = () => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const filterFunction = () => {
        let input, filter, div, a, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        div = document.getElementById("myDropdown");
        // a = div.getElementsByTagName("a");
        a = div.getElementsByClassName("dropdown-content-child");
        for (i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    };

    return (
        <div className="search-dropdown">
            <div className="inside-search-dropdown">
                <input
                    type="text"
                    placeholder="Search.."
                    id="myInput"
                    onClick={toggleDropdown}
                    onKeyUp={filterFunction}
                />
                <div className="dropicon">
                    <FontAwesomeIcon icon={faAngleDown} />
                </div>
            </div>
            {
                isDropdownVisible &&
                (
                    <div id="myDropdown" className="dropdown-content">
                        <div className="dropdown-content-child" href="#about">
                            About
                        </div>
                        <div className="dropdown-content-child" href="#base">
                            Base
                        </div>
                        <div className="dropdown-content-child" href="#blog">
                            Blog
                        </div>
                        <div className="dropdown-content-child" href="#contact">
                            Contact
                        </div>
                        <div className="dropdown-content-child" href="#custom">
                            Custom
                        </div>
                        <div className="dropdown-content-child" href="#support">
                            Support
                        </div>
                        <div className="dropdown-content-child" href="#tools">
                            Tools
                        </div>
                    </div>
                )
            }
        </div>
    );
};

