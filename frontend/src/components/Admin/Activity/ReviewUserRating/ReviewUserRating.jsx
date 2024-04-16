import React from 'react';
import AdminHeader from '../../../../common/AdminHeader';
import Footer from '../../../../common/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';


export default function ReviewUserRating() {

  let tableDummyData = [
    { id: 1, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Pending', actionList: false },
    { id: 2, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Pending', actionList: false },
    { id: 3, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Pending', actionList: false },
    { id: 4, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Pending', actionList: false },
    { id: 5, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Pending', actionList: false },
    { id: 6, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Published', actionList: false },
    { id: 7, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Published', actionList: false },
    { id: 8, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Published', actionList: false },
    { id: 9, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Published', actionList: false },
    { id: 10, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Deleted', actionList: false },
    { id: 11, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Deleted', actionList: false },
    { id: 12, name: 'ABC', review: 'Deserunt occaecat culpa veniam commodo.', datePosted: '08/04/2024', status: 'Deleted', actionList: false },
  ];

  const [tableData, setTableData] = useState(tableDummyData);

  useEffect(() => {

  }, [tableData]);

  useEffect(() => {
    document.title = 'Ama Bhoomi - Review User ratings';
  }, []);

  function actionOptions(dataID) {
    let newTableData = JSON.parse(JSON.stringify(tableData));

    newTableData.forEach((data) => {
      (data.id == dataID) ? data.actionList = true : data.actionList = false;
    });

    setTableData(newTableData);

    return;
  }

  function setStatusColor(status) {
    if (status == 'Pending') {
      return 'text-yellow-400';
    }
    else if (status == 'Deleted') {
      return 'text-red-400';
    }
    else {
      return 'text-green-400';
    }
  }


  return (
    <div>
      <AdminHeader />
      <div className="Main_Conatiner_table mt-12">
        <div>
          <div className='table-heading'>
          <h2 className="table-heading">Review user rating and comments</h2>
        </div>

        <div className="search_text_conatiner justify-end">
          {/* <button className='search_field_button' onClick={() => navigate('/UAC/Users/Create')}>Create new user</button> */}
          <input type="text" className="search_input_field" placeholder="Search..." />
        </div>

        <div className="table_Container">
          <table >
            <thead>
              <tr>
                <th scope="col">Facility</th>
                <th scope="col">Review</th>
                <th scope="col">Date posted</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody >
              {
                tableData?.length > 0 && tableData?.map((data) => {
                  return (
                    <tr key={data.id}>
                      <td data-label="Name">{data.name}</td>
                      <td data-label="Review">{data.review}</td>
                      <td data-label="Date Posted">{data.datePosted}</td>
                      <td
                        data-label="Status"
                      ><p className={`${setStatusColor(data.status)}`}>{data.status}</p></td>
                      <td data-label="Action">
                        <button type="button" className='w-full' onClick={(e) => actionOptions(data.id)}><FontAwesomeIcon className='actionList' icon={faEllipsisVertical} /></button>

                        {
                          data.actionList &&
                          (
                            <span className='actionList border rounded-[9px] border-black z-50 lg:left-[80%] md:left-[79%] absolute border-[#00000033] bg-white flex flex-col align-middle justify-center'>
                              <button className='p-1 actionList'>Publish</button>
                              <button className='p-1 actionList'>Delete</button>
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
        
      </div>
      <Footer />
    </div>
  )
}
