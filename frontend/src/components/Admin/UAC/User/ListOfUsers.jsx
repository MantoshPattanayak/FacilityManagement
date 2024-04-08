import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from 'react';

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

    useEffect(() => {
      
    }, [tableData]);
    

    function actionOptions(dataID) {
        let newTableData = JSON.parse(JSON.stringify(tableData));

        newTableData.forEach((data) => {
            (data.id == dataID) ? data.actionList = true : data.actionList = false;
        });

        console.log('1',newTableData);

        setTableData(newTableData);

        return;
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
                                <th scope="col">Action</th>
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
                                            <td data-label="Action">
                                                <button type="button" className='w-full' onClick={(e) => actionOptions(data.id)}><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                                                
                                                {
                                                    data.actionList && 
                                                    (
                                                        <span className='border rounded-[9px] border-black z-50 left-[91%] absolute border-[#00000033] bg-white flex flex-col'>
                                                            <button className='p-1 border-b'>View</button>
                                                            <button className='p-1'>Edit</button>
                                                        </span>
                                                    )
                                                }
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


