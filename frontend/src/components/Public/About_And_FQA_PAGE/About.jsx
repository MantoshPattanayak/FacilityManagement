

import PublicHeader from "../../../common/PublicHeader";
import "./About.css"
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
        <h1 className="About">About</h1>
        <img src=""></img>
      </div>
      <div className="About_div">
        <h1 className="About_heading">
          {!language || language == "EN" && "About"}
          {language == "OD" && "ବିଷୟରେ"}
        </h1>
        <div className="About_us_flex_conatiner">
          <div className="About_us_text">
            <h1 className="About_us_text_details">
              {
                !language || language == "EN" && (
                  <>
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
                  </>
                )
              }

              {
                language == "OD" && (
                  <>
                    ଭୁବନେଶ୍ୱରକୁ ଏକ ସକ୍ରିୟ ଜୀବନଶୈଳୀର ପରିଣତ କରିବା ପାଇଁ ଓଡ଼ିଶା ସରକାରଙ୍କ ଦ୍ୱାରା ଆମ ଭୂମି ଏକ ଅଗ୍ରଣୀ ପଦକ୍ଷେପ। ଆମର ଲକ୍ଷ୍ୟ ହେଉଛି ବହୁ ପରିମାଣରେ ପାର୍କ, ଖୋଲା ସ୍ଥାନ, ଏବଂ ଖେଳ ପଡ଼ିଆ ସୃଷ୍ଟି କରିବା ଯେଉଁଠାରେ ଆପଣ ଏବଂ ଆପଣଙ୍କ ପରିବାର ସୁସ୍ଥ, ସକ୍ରିୟ କାର୍ଯ୍ୟକଳାପରେ ନିୟୋଜିତ ହୋଇପାରିବେ। ଏହି କ୍ଷେତ୍ରଗୁଡିକର ବୃଦ୍ଧି ଏବଂ ବିସ୍ତାର କରି, ଆମେ ନିଶ୍ଚିତ କରୁଛୁ ଯେ ଭୁବନେଶ୍ୱର ସହର ପାର୍କ ଏବଂ ଖୋଲା ସ୍ଥାନଗୁଡିକ ପାଇଁ ଥିବା ସର୍ବୋଚ୍ଚ ମାନଦଣ୍ଡକୁ ପୂରଣ କରିବା ସହିତ ଅତିକ୍ରମ କରିବ। ।
                    <br /><br />
                    ଆରାମ କରିବା ପାଇଁ କିମ୍ବା ଖେଳିବା ପାଇଁ କିମ୍ବା ବ୍ୟାୟାମ କରିବା ପାଇଁ ଏକ ସ୍ଥାନ ଅନୁସନ୍ଧାନର ଅନ୍ତ କରି ସହରରେ ଆପଣଙ୍କର ବାହ୍ୟ ଅଭିଜ୍ଞତାକୁ ଯଥାସମ୍ଭବ ଉପଭୋଗ୍ୟ ଏବଂ ଉପଲବ୍ଧ କରାଇବା ପାଇଁ ଆମ ଭୂମି ପଦକ୍ଷେପ ଉତ୍ସର୍ଗୀକୃତ!
                    <br /><br />
                    ଯେହେତୁ ଭୁବନେଶ୍ୱର ବିକାଶ ପଥରେ ଆଗେଇ ଚାଲିଛି, ବର୍ତ୍ତମାନ ଖୋଲା ସ୍ଥାନ ପରିଚାଳନାକୁ ପ୍ରାଧାନ୍ୟ ଦେବା ଅତ୍ୟନ୍ତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ହୋଇପଡ଼ିଛି। ୨୦୪୮ ସୁଦ୍ଧା, ପାର୍କ ଏବଂ ଖୋଲା ସ୍ଥାନ ପାଇଁ ସହରର ଚାହିଦା ଯଥେଷ୍ଟ ବୃଦ୍ଧି ପାଇବ, ଯାହାକି ଜାତୀୟ ତଥା ଆନ୍ତର୍ଜାତୀୟ ମାନଦଣ୍ଡ ପୂରଣ ପାଇଁ ଭୁବନେଶ୍ୱର ମହାନଗର ନିଗମ (ବିଏମସି) ଅନ୍ତର୍ଗତ ପ୍ରାୟ ଏକ-ଷଷ୍ଠାଂଶ ଏହି ସ୍ଥାନଗୁଡିକ ପାଇଁ ଉତ୍ସର୍ଗୀକୃତ ହେବା ଆବଶ୍ୟକ ହେବ ବୋଲି ଆକଳନ କରାଯାଇଛି।
                    <br /><br />
                    ଏହି ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଆବଶ୍ୟକତାକୁ ସମାଧାନ କରିବା ପାଇଁ, ଆମ ଭୂମି ପଦକ୍ଷେପ ଆରମ୍ଭ କରାଯାଇଛି | ଆମ ଭୂମି - ଭୁବନେଶ୍ୱର ଖୋଲା ସ୍ଥାନ ଏବଂ ମାଲିକାନା ପରିଚାଳନା ମାଧ୍ୟମରେ ଜନ ପ୍ରବେଶକୁ ନିଶ୍ଚିତ କରିବା ପଦକ୍ଷେପ - ଖୋଲା ସ୍ଥାନକୁ ସ୍ପନ୍ଦିତ, ଉତ୍ତମ କାର୍ଯ୍ୟକ୍ଷମ ପାର୍କ ଏବଂ ଖେଳ ପଡ଼ିଆରେ ରୂପାନ୍ତର କରିବାକୁ ଲକ୍ଷ୍ୟ ରଖିଛି। ଏହି ପଦକ୍ଷେପ ଅନ୍ତର୍ଗତ ପ୍ରମୁଖ ସମ୍ପତ୍ତିରେ ପାର୍କ, ଖେଳପଡ଼ିଆ, ବହୁମୁଖୀ ପଡ଼ିଆ, ନୀଳମାର୍ଗ ଏବଂ ସବୁଜମାର୍ଗ ଅନ୍ତର୍ଭୁକ୍ତ। ଏହି ବିକାଶଗୁଡିକ ସହରର ବଢୁଥିବା ଆବଶ୍ୟକତାକୁ ଦୃଷ୍ଟିରେ ରଖି ପରିକଳ୍ପିତ ଯାହାକି ସୁନିଶ୍ଚିତ କରେ ଯେ ଭୁବନେଶ୍ୱର ଏହାର ବାସିନ୍ଦାମାନଙ୍କ ପାଇଁ ଏକ ସମୃଦ୍ଧ, ଉପଲବ୍ଧ ଏବଂ ଉପଭୋଗ୍ୟ ସ୍ଥାନ ହୋଇପାରିବ।
                    <br /><br />
                  </>
                )
              }
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