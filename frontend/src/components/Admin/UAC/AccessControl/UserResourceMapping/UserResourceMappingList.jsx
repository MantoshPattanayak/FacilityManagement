

import { useState, useEffect } from "react";
import axiosHttpClient from "../../../../../utils/axios";
const UserResourceMappingList=()=>{
 
    const [UserroleListData, setUserRoleListData] = useState([]);


    // Function to fetch role list data
        async function getUserRoleListData() {
          try {
            let res = await axiosHttpClient('ROLE_VIEW_API','post', {
              // page: currentPage, // Send current page number
              // search: searchTerm // Send search term if needed
            });
            console.log("here Response", res);
            // setUserRoleListData(res.data.Role); // Update role list data
          } catch (error) {
            console.log(error);
          }
        }
  
        useEffect(() => {
            getUserRoleListData();
        }, []);





        
    return(
        <div className="table_Container">
     
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Number</th>
              <th scope="col">Amount</th>
              <th scope="col">Due</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
            <tr>
              <td data-label="Name">Mantosh</td>
              <td data-label="Number">78928766211</td>
              <td data-label="Amount ">9201</td>
              <td data-label="Due">211</td>
            </tr>
          </tbody>
        </table>
      </div>
    )

}
export default UserResourceMappingList;