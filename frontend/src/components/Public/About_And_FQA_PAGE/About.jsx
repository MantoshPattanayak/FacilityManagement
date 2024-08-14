

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
       <h1 className="About">About</h1>
       <img src=""></img>
     </div>
      <div className="About_div">
         <h1 className="About_heading">About</h1>
         <div className="About_us_flex_conatiner">
            <div className="About_us_text">
            <h1 className="About_us_text_details">
        In recent decades, Bhubaneswar has emerged as a thriving urban centre, drawing people from diverse backgrounds due to its significance in education, commerce, and governance. The city's cosmopolitan character has evolved through this transformative journey, symbolizing a harmonious blend of tradition and modernity.
        <br /><br />
        Bhubaneswar is steering towards a transformative vision of becoming a sports-centric city, emphasizing the promotion of outdoor and co-curricular activities for its citizens. Central to this vision is the creation of accessible facilities such as parks, open spaces, and Playfields, aiming to encourage and facilitate the adoption of a healthy lifestyle.
        <br /><br />
        The Bhubaneswar Development Authority (BDA), under the provisions of the Odisha Development Authority (ODA) Act, 1982, is mandated to ensure sustainable urban growth and planned development in the Bhubaneswar region, which includes regulating and monitoring urban development through a people-centric and innovative approach.
        <br /><br />
        The imperative to enhance open space management in Bhubaneswar becomes apparent when aligning the existing population with nationally and internationally recognized open space standards. Based on 2024 year’s population, Bhubaneswar, with approximately 15.9 lakhs people within the municipal boundary, would require around 632 hectares of land dedicated to parks and open spaces to meet these standards and by 2048 when Bhubaneswar is 100 years old, the demand will increase to 1621 hectares. Recognizing the city's growth trajectory, there is a pressing need to systematically facilitate the transformation of these open spaces into fully realized, well-functioning parks, and playfields.
        <br /><br />
        In response to this need, this policy “AMA BHOOMI” - Assuring Mass Access through Bhubaneswar Open Space Ownership and Management Initiative of BDA, intends to create an enabling environment for all stakeholders to work together in achieving the objectives set forth. Once the policy is adopted, it is expected that coherent strategies for the identification, development, maintenance, and activation of open spaces would be encouraged in the municipal limits of Bhubaneswar.
        <br /><br />
        In order to meet the growing requirement for open spaces in the city, five distinct assets shall be identified under the Policy: 1) Parks; 2) Playfields; 3) Multipurpose Grounds 4) Blueways, and 5) Greenways.
        <br /><br />
        Whether you’re seeking a spot to relax, play a sport you love, or exercise, AMA BHOOMI is dedicated to making your outdoor experience in the city as enjoyable and accessible as possible!
      </h1>
             
            </div>
            {/* <div className="About_us_img">
     
                <button class="button-37" role="button" >In This Section</button>
                  <button type="button" className="Button_About"onClick={() => navigate('/About')} >Overview</button>
                   <button type="button" className="Button_About" onClick={() => navigate('/History')}>History</button>
                  <button type="button" className="Button_About"  onClick={() => navigate('/Organogram')}>Organogram</button>
                  <button type="button" className="Button_About" onClick={() => navigate('/Stakeholders')}>Key Stakeholders</button>
                  <button type="button" className="Button_About" onClick={() => navigate('/StandOut')}>What Make Us Stand Out</button>
             
            </div> */}
         </div>
      </div>
      
    </div>
    )
}
export default About;