

import PublicHeader from "../../../common/PublicHeader";
import "./About.css"
import { useLocation, useNavigate, Link } from 'react-router-dom';
const History = () => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div className="About_Mian_conatiner">
            <PublicHeader />
            <div className="Child_about_container">
                <h1 className="About">History</h1>
            </div>
            <div className="About_div">
                <h1 className="About_heading">History</h1>
                <div className="About_us_flex_conatiner">
                    <div className="About_us_text">
                        <h1 className="About_us_text_details" >Babasaheb Bhimrao Ambedkar Bus Terminal (BSABT), Bhubaneswar is a state-of-the-art <br></br>bus terminal developed as a hub for various bus routes within Odisha <br></br>and for linking Bhubaneswar to other states. It aims to enhance the experience of bus travellers to and from the Capital city.
                        </h1>

                    </div>
                    <div className="About_us_img">

                        <button class="button-37" role="button">In This Section</button>
                        <button type="button" className="Button_About" onClick={() => navigate('/About')} >Overview</button>
                        <button type="button" className="Button_About" onClick={() => navigate('/History')}>History</button>
                        <button type="button" className="Button_About" onClick={() => navigate('/Organogram')}>Organogram</button>
                        <button type="button" className="Button_About" onClick={() => navigate('/Stakeholders')}>Key Stakeholders</button>
                        <button type="button" className="Button_About" onClick={() => navigate('/StandOut')}>What Make Us Stand Out</button>

                    </div>
                </div>
            </div>

        </div>
    )
}
export default History;