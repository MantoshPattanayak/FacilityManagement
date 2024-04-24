
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
import { useEffect, useState } from "react"
const Main_Body_Park_Details=()=>{
// Use state
const[DisPlayParkData, setDisPlayParkData]=useState([])
//Here (Post the data)----------------------------------------------------------------
    async function GetParkDetails(){
            try{
                let res= await axiosHttpClient('here Api', 'post', {

                })
                console.log("here Response of Park", res)
                setDisPlayParkData(res.data)
            }
            catch(err){
                console.log("here Error of Park", err)
            }
    }
// useEffect for Update the data (Call the Api) ------------------------------------------------
    useEffect(()=>{
        GetParkDetails()  
    }, [])


//Return here------------------------------------------------------------------------------------------------------------
        return(
            <div className="main__body__park">
                    {/* here Header -----------------------------------------------------*/}
                    <AdminHeader />
                    {/* here Search  Bar  -------------------------------------------------- */}
                     <div className="Search_container">
                            <span className="Input_text_conatiner">
                               <input type="text" placeholder={`Search by Name or ID...`}/>
                            </span>
                            <span className="Button_Container">
                            <img className="h-14" src={Park_Logo}></img>
                            <img className="h-14" src={MultiPark}></img>
                            <img className="h-14" src={Event_img}></img>
                            </span>
                       
                     </div>
                     <span className="text_name_park">
                        <h1 className="name_park"> Park Nearby</h1>
                     </span>
                    {/* Card Container Here -------------------------------------------- */}
                        <div className="card-container">
                            
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>

                                 <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                                <div className="Park_card">
                                    <img className="Card_img" src={Cardimg} alt="Park" />
                                    <div className="card_text">
                                        <span className="Name_location">
                                            <h2 className="park_name">Patia Park</h2>
                                            <h3 className="park_location">Bhubaneswar</h3>
                                        </span>
                                        <span className="Avil_Dis">
                                            <button className="Avilable">Open</button>
                                            <h3 className="distance">30KM</h3>
                                        </span>
                                    </div>
                                </div>
                         </div>
            </div>
        )
    }

// Export Main_Body_park_details and Import to App.js ------------
export default Main_Body_Park_Details;