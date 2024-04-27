
// Function of Main Container ---------------------------------------
import Cardimg from "../../../assets/Card_img.png"
import "./Main_Body_park_deatils.css"
import axiosHttpClient from "../../../utils/axios"
// Here Admin Header---------------------------- ----------------
import AdminHeader from "../../../common/AdminHeader"
// Import Logo here ------------------------------ ------------------------------
import Park_Logo from "../../../assets/Ground_logo.png"
import MultiPark from "../../../assets/ama_bhoomi_multipurpose_grounds_logo-removebg-preview.png"
import Event_img from "../../../assets/ama_boomi_park_logo-removebg-preview.png"
// Data Not available Icon
import No_Data_icon from "../../../assets/No_Data_icon.png"
import { useEffect, useState } from "react"
//  Import here to encrptData ------------------------------------------
import { Link, useNavigate } from 'react-router-dom';

import { encryptData } from "../../../utils/encryptData"
const Main_Body_Park_Details=()=>{
// Use state ------------------------------------------------------------------
const[DisPlayParkData, setDisPlayParkData]=useState([])
// useSate for search -----------------------------------------------------------
const [givenReq, setGivenReq] = useState('');
// for Faciltiy ----------------------------------------------------------------
const [facilityTypeId, setFacilityTypeId] = useState(null);
// Use Navigate for Navigate the page ----------------------------------------------
let navigate = useNavigate();
//Here (Post the data)----------------------------------------------------------------
async function GetParkDetails(){
            try{
                let res= await axiosHttpClient('View_Park_Data', 'post', {
                    givenReq: givenReq,
                    facilityTypeId: facilityTypeId
                })
                console.log("here Response of Park", res)
                setDisPlayParkData(res.data.data)
            }
            catch(err){
                console.log("here Error of Park", err)
            }
}
// Function to handle setting facility type ID and updating search input value ---------------------------
    const handleParkLogoClick = (typeid) => {
            setFacilityTypeId(typeid) // Set facility ex typeid-1,typeid-2,typeid-3
            console.log("here type id", typeid)
            GetParkDetails()
        };
 // here Funcation to encrotDataid (Pass the Id)----------------------------------------------
 function encryptDataId(id) {
    let res = encryptData(id);
    return res;
}
// useEffect for Update the data (Call the Api) ------------------------------------------------
        useEffect(()=>{
            GetParkDetails()  
        }, [givenReq])


//Return here------------------------------------------------------------------------------------------------------------
     return(
        <div className="main__body__park">
                    {/* here Header -----------------------------------------------------*/}
                    <AdminHeader />
                    {/* here Search  Bar  -------------------------------------------------- */}
                     <div className="Search_container">
                            <span className="Input_text_conatiner">
                               <input type="text" placeholder='  Search here........................'
                                  name="givenReq"
                                  id="givenReq"
                                  value={givenReq}
                                  onChange={(e) => setGivenReq(e.target.value)}
                               />
                            </span>
                            {/* Here ButTON Container (Pass the id 1,2,3) */}
                            <span className="Button_Container">
                                <button onClick={() => handleParkLogoClick(1)} ><img className="h-14" src={Park_Logo}  alt="Park Logo"></img></button> 
                                <button onClick={() => handleParkLogoClick(2)} > <img className="h-14" src={MultiPark}></img></button>  
                                <button onClick={() => handleParkLogoClick(3)}><img className="h-14" src={Event_img}></img></button>   
                            </span>
                     </div>
                     <span className="text_name_park">
                        <h1 className="name_park"> Park Nearby</h1>
                     </span>
                    {/* Card Container Here -------------------------------------------- */}
                    <div className="card-container">
                                        {DisPlayParkData.length > 0 ? (
                                            DisPlayParkData.map((item, index) => (
                                                // Navigate the sub_manu_page according to id------------------
                                                <Link
                                                    to={{ 
                                                        pathname: '/Sub_Park_Details',
                                                        search: `?facilityTypeId=${encryptDataId(item.facilityTypeId)}&action=view`
                                                    }}
                                                >
                                                <div className="Park_card" key={index}>
                                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                                    <div className="card_text">
                                                        <span className="Name_location">
                                                            <h2 className="park_name">{item.facilityName}</h2>
                                                            <h3 className="park_location">{item.address}</h3>
                                                        </span>
                                                        <span className="Avil_Dis">
                                                            <button className="Avilable">{item.status}</button>
                                                            <h3 className="distance">30KM</h3>
                                                        </span>
                                                    </div>
                                                </div>
                                                </Link>  
                                            ))
                                        ) : (
                                            // Here Show the Msg if (Data is Not available ) --------------------------------
                                            <div className="no-data-message">
                                                <img src={No_Data_icon}></img>
                                            </div>
                                        )}
                                    </div>
        </div>
        )
    }

// Export Main_Body_park_details and Import to App.js ------------
export default Main_Body_Park_Details;