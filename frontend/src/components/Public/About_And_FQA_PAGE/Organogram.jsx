

import PublicHeader from "../../../common/PublicHeader";
import "./About.css"
import Aboutusimg from "../../../assets/About_us3.png"
import { useLocation, useNavigate, Link } from 'react-router-dom';
const Organogram=()=>{
  const location = useLocation();
  const navigate = useNavigate();
 return(
    <div className="About_Mian_conatiner">
      <PublicHeader/>
     <div className="Child_about_container">
       <h1 className="About">Organogram</h1>
     </div>
      <div className="About_div">
         <h1 className="About_heading">Organogram</h1>
         <div className="About_us_flex_conatiner">
            <div className="About_us_text">
                <div>
                <img className="h-96" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM8wlfb_tHMcUVo3wId33zVAWZMbNQUVazdA&usqp=CAU"></img>
                </div>
             
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
export default Organogram;