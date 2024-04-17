
import "./Footer.css";
import Footer_image from "../assets/footer_image.gif"
import tree_img from "../assets/Tree_Img.gif"
import insta from "../assets/Insta.png"
import facebook from "../assets/Facbook.png"
import linkenin from "../assets/linkedin.png"
import Twitter from "../assets/Twitter.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { faFacebook } from '@fortawesome/free-brands-svg-icons';
const Footer=()=>{
    return (

        <div className="footer_container"> 
              <div className="footer_child">
                <span className="AMA_BHOOMI_details">
                    <a href="#"><h1 className="Name_Ama"> AMA BHOOMI</h1></a>   
                    <a href="#"><p className="about">About</p></a>   
                    <a href="#"><p className="about"> Contact</p></a>   
                    <a href="#"><p className="about">Partner with Us</p></a>   
                    <a href="#"><p className="about"> Grievance / Feedback</p></a>   
                    
                </span>
                <span>
                    <img className="footer_img"  src={Footer_image}></img>
                </span>
                <span className="social_media"> 
                <h1 className="flow_us">    Follow us on Social Media</h1>
                   <div className="social_Media_div">
                   <img className="social" src={insta}></img>
                   <img   className="social" src={facebook}></img>
                   <img   className="social" src={linkenin}></img>
                   <img   className="social" src={Twitter}></img>
                   </div>
                    <img className="tree_img" src={tree_img}></img>
                 

                </span>
              </div>
              <div className="footer_button_name">
               < a href=""><h1 className="button_name">Legal Stuff</h1></a>  
                < a href=""><h1 className="button_name">Security</h1></a> 
                < a href=""><h1 className="button_name">Privacy Policy</h1></a> 
                < a href=""><h1 className="button_name">Copyright © 2024 Ama Bhoomi. All Rights Reserved.</h1></a> 
              </div>
              <h1 className="soul_name">Designed and Developed by SOUL Limited</h1>
         </div>
    )

}

export default Footer;