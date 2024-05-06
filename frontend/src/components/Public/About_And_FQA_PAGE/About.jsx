

import PublicHeader from "../../../common/PublicHeader";
import "./About.css"
import Aboutusimg from "../../../assets/About_us3.png"
const About=()=>{
 return(
    <div className="About_Mian_conatiner">
      <PublicHeader/>
     <div className="Child_about_container">
       <h1 className="About"> About Us</h1>
     </div>
      <div className="About_div">
         <h1 className="About_heading"> About</h1>
         <div className="About_us_flex_conatiner">
            <div className="About_us_text">
             <h1 className="About_us_text_details" >Easy Parking Solutions: With Park, finding parking spots becomes a breeze. Our intuitive app allows  you to search for available <br></br> parking spaces in real-time, helping you save time and reduce stress.
Secure . </h1>
             
            </div>
            <div className="About_us_img">
              <img className="About_img" src={Aboutusimg}></img>
            </div>
         </div>
      </div>
      
    </div>
    )
}
export default About;