

import PublicHeader from "../../../common/PublicHeader";
import "./About.css"
import Aboutusimg from "../../../assets/About_us3.png"
import { useLocation, useNavigate, Link } from 'react-router-dom';
const About=()=>{
  const location = useLocation();
  const navigate = useNavigate();
 return(
    <div className="About_Mian_conatiner">
      <PublicHeader/>
     <div className="Child_about_container">
       <h1 className="About">Overview</h1>
       <img src=""></img>
     </div>
      <div className="About_div">
         <h1 className="About_heading">Overview</h1>
         <div className="About_us_flex_conatiner">
            <div className="About_us_text">
             <h1 className="About_us_text_details" >
              "AMA BHOOMI" offer's convenient event booking and park reservation services to individuals and organizations,
              <br></br>enabling them to book events and parks in Bhubaneswar. With Ama Bhoomi, individuals and organizations 
              <br></br>can seamlessly plan and manage various events while also reserving parks within the city for recreational activities.
              <br></br>This platform serves as a centralized hub for event management, allowing users to browse through a diverse range of 
              <br></br>available parks and select the one that best suits their needs and preferences. Whether it's a community gathering, 
              <br></br>a corporate event, or a family celebration, Ama Bhoomi simplifies the process of securing the perfect venue.
              </h1>
             
            </div>
            <div className="About_us_img">
     
                <button class="button-37" role="button" >In This Section</button>
                  <button type="button" className="Button_About"onClick={() => navigate('/About')} >Overview</button>
                   <button type="button" className="Button_About" onClick={() => navigate('/History')}>History</button>
                  <button type="button" className="Button_About"  onClick={() => navigate('/Organogram')}>Organogram</button>
                  <button type="button" className="Button_About" onClick={() => navigate('/Stakeholders')}>Key Stakeholders</button>
                  <button type="button" className="Button_About" onClick={() => navigate('/StandOut')}>What Make Us Stand Out</button>
             
            </div>
         </div>
      </div>
      
    </div>
    )
}
export default About;