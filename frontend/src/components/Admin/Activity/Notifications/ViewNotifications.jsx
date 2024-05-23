import React, { useEffect, useState } from 'react';
import axiosHttpClient from '../../../../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { formatDateYYYYMMDD, formatDate } from '../../../../utils/utilityFunctions';
import AdminHeader from '../../../../common/AdminHeader';
import CommonFooter from '../../../../common/CommonFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { dataLength } from '../../../../utils/regexExpAndDataLength';
import '../../../../common/CommonTable.css';
import './ViewNotifications.css';
import { encryptData } from '../../../../utils/encryptData';

export default function ViewNotifications() {
  const navigate = useNavigate();
  const [givenReq, setGivenReq] = useState('');
  const [tableData, setTableData] = useState([]);

  // function to fetch notifications list data
  let fetchNotificationsList = async () => {
    try{
      let res = await axiosHttpClient('VIEW_NOTIFICATIONS_LIST_API', 'post', {
        givenReq: givenReq
      });

      console.log('fetch notifications list data', res.data.paginatedviewNotificationsListQueryData);
      setTableData(res.data.paginatedviewNotificationsListQueryData);
    }
    catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchNotificationsList();
  }, [])

  useEffect(() => {
    fetchNotificationsList();
  }, [givenReq])

  return (
    <>
      <AdminHeader />
      <div className="ViewNotifications-Container">
        <div className='table-heading'>
          <h2 className="table-heading">View Notifications</h2>
        </div>

        <div className="search_text_conatiner">
          <button className='search_field_button' onClick={() => navigate('/Activity/AddNewNotification')}>Add new notification</button>
          <input type="text" className="search_input_field" value={givenReq} placeholder="Search..." onChange={(e) => setGivenReq(e.target.value)} />
          {/* <SearchDropdown /> */}
        </div>

        <div className="table_Container">
          <table >
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Content</th>
                <th scope="col">Valid From</th>
                <th scope="col">Valid To</th>
                {/* <th scope="col">Status</th> */}
                <th scope="col">View</th>
                <th scope="col">Edit</th>
              </tr>
            </thead>
            <tbody >
              {
                tableData?.length > 0 && tableData?.map((data) => {
                  return (
                    <tr key={data.publicNotificationsId}>
                      <td data-label="Title">{data.publicNotificationsTitle}</td>
                      <td data-label="Content">{data.publicNotificationsContent}</td>
                      <td data-label="Valid From">{formatDate(data.validFromDate)}</td>
                      <td data-label="Valid To">{formatDate(data.validToDate)}</td>
                      <td data-label="View">
                        <Link
                          to={{
                            pathname: '/Activity/EditNotification',
                            search: `?notificationId=${encodeURIComponent(encryptData(data.publicNotificationsId))}&action=view`
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </td>
                      <td data-label="Edit">
                        <Link
                          to={{
                            pathname: '/Activity/EditNotification',
                            search: `?notificationId=${encodeURIComponent(encryptData(data.publicNotificationsId))}&action=edit`
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
