import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import { Link, useNavigate } from 'react-router-dom';
import {useEffect, useState} from 'react';
import { encryptData } from '../../../../utils/encryptData';
import axiosHttpClient from '../../../../utils/axios';

export default function ListOfUsers() {

    let navigate = useNavigate();

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

    async function fetchListOfRoleData() {
        try {
            let res = await axiosHttpClient('ADMIN_USER_VIEW_API', 'get');

            console.log(res);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchListOfRoleData();
    }, []);
    

    function actionOptions(dataID) {
        let newTableData = JSON.parse(JSON.stringify(tableData));

        newTableData.forEach((data) => {
            (data.id == dataID) ? data.actionList = true : data.actionList = false;
        });

        console.log('1',newTableData);

        setTableData(newTableData);

        return;
    }

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
                    <input type="text" className="search_input_field" placeholder="Search..." />
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
                                    return(
                                        <tr key={data.id}>
                                            <td data-label="Name">{data.name}</td>
                                            <td data-label="Number">{data.number}</td>
                                            <td data-label="Email">{data.email}</td>
                                            <td data-label="Role">{data.role}</td>
                                            <td data-label="Status">{data.status}</td>
                                            <td data-label="View">
                                                <Link
                                                    to={{ 
                                                        pathname: '/UAC/Users/Edit',
                                                        search: `?userId=${encryptDataId(data.id)}&action=view`
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Link>
                                            </td>
                                            <td data-label="Edit">
                                                <Link
                                                    to={{ 
                                                        pathname: '/UAC/Users/Edit',
                                                        search: `?userId=${encryptDataId(data.id)}&action=edit`
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
            <Footer />
        </>
    )
}


