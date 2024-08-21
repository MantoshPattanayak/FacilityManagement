

import PublicHeader from "../../../common/PublicHeader";
import "./ScreenReader.css"
import Aboutusimg from "../../../assets/About_us3.png"
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const About = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const [language, setLanguage] = useState(sessionStorage.getItem("language") || "EN");
    const language = useSelector(
        (state) => state.language.language || localStorage.getItem("language") || "EN"
    );

    useEffect(() => { }, [language]);

    return (
        <div className="About_Mian_conatiner">
            <PublicHeader />
            <div className="Child_about_container">
                <h1 className="About">Screen Reader Access</h1>
                <img src=""></img>
            </div>
            <div className="About_div">
                <h1 className="About_heading">
                    Screen Reader Access
                </h1>
                <div className="About_us_flex_conatiner">
                    <div className="About_us_text">
                        <h1 className="About_us_text_details">
                            <p>The website will enable people with visual impairments access the website using assistive technologies, including screen readers. The information of the website is accessible with different screen readers, such as JAWS, NVDA, SAFA, Supernova and Window-Eyes. Following table lists the information about different screen readers:</p>
                            <div className="table_Container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th colSpan={3}>Information related to the various screen readers</th>
                                        </tr>
                                        <tr>
                                            <th scope="col">Screen Reader</th>
                                            <th scope="col">Website</th>
                                            <th scope="col">Free/Commercial</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td data-label="Screen Reader">Non Visual Desktop Access (NVDA)</td>
                                            <td data-label="Website">
                                                <a href="http://www.nvda-project.org/" target="_blank" rel="noopener noreferrer" class="external">
                                                    http://www.nvda-project.org/
                                                </a>
                                            </td>
                                            <td data-label="Free/Commercial">Free</td>
                                        </tr>
                                        <tr>
                                            <td>System Access To Go</td>
                                            <td>
                                                <a href="http://www.satogo.com/" target="_blank" rel="noopener noreferrer" class="external">http://www.satogo.com/</a>
                                            </td>
                                            <td>Free</td>
                                        </tr>
                                        <tr>
                                            <td>Hal</td>
                                            <td>
                                                <a href="http://www.yourdolphin.co.uk/productdetail.asp?id=5" target="_blank" rel="noopener noreferrer" class="external">http://www.yourdolphin.co.uk/productdetail.asp?id=5</a>
                                            </td>
                                            <td>Commercial</td>
                                        </tr>
                                        <tr>
                                            <td>JAWS</td>
                                            <td>
                                                <a href="http://www.freedomscientific.com/Products/software/JAWS/" target="_blank" rel="noopener noreferrer" class="external">http://www.freedomscientific.com/Products/software/JAWS/</a>
                                            </td>
                                            <td>Commercial</td>
                                        </tr>
                                        <tr>
                                            <td>Supernova</td>
                                            <td>
                                                <a href="http://www.yourdolphin.co.uk/productdetail.asp?id=1" target="_blank" rel="noopener noreferrer" class="external">http://www.yourdolphin.co.uk/productdetail.asp?id=1</a>
                                            </td>
                                            <td>Commercial</td>
                                        </tr>
                                        <tr>
                                            <td>Window-Eyes</td>
                                            <td>
                                                <a href="http://www.gwmicro.com/Window-Eyes/" target="_blank" rel="noopener noreferrer" class="external">http://www.gwmicro.com/Window-Eyes/</a>
                                            </td>
                                            <td>Commercial</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </h1>
                    </div>
                </div>
                <h1 className="About_heading">
                    Speech Recognition Support
                </h1>
                <div className="About_us_flex_conatiner">
                    <div className="About_us_text">
                        <h1 className="About_us_text_details">
                            <p>The information of the website is accessible with different speech recognition software, such as Dragon Naturally Speaking as well as Speech Recognition support available in Windows Vista and Windows 7 operating systems. Following table lists the information about different speech recognition software:</p>
                            <div className="table_Container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th colSpan={3}>Information related to Speech Recognition Software</th>
                                        </tr>
                                        <tr>
                                            <th scope="col">Speech Recognition Software</th>
                                            <th scope="col">Website</th>
                                            <th scope="col">Free/Commercial</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td data-label="Speech Recognition Software">Windows Speech Recognition in Windows Vista</td>
                                            <td data-label="Website">
                                                <a href="http://www.microsoft.com/enable/products/windowsvista/speech.aspx	" target="_blank" rel="noopener noreferrer" class="external">
                                                    http://www.microsoft.com/enable/products/windowsvista/speech.aspx	
                                                </a>
                                            </td>
                                            <td data-label="Free/Commercial">Commercial</td>
                                        </tr>
                                        <tr>
                                            <td data-label="Speech Recognition Software">Speech Recognition in Windows 7</td>
                                            <td data-label="Website">
                                                <a href="http://www.microsoft.com/enable/products/windows7/" target="_blank" rel="noopener noreferrer" class="external">http://www.microsoft.com/enable/products/windows7/</a>
                                            </td>
                                            <td data-label="Free/Commercial">Commercial</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </h1>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default About;