import React from 'react';
import './Disclaimer.css';
import PublicHeader from '../../../common/PublicHeader';

const Disclaimer = () => {
    return (
        <div className="disclaimer-container">
            <PublicHeader/>
        <h1 className="disclaimer-title">Disclaimer</h1>
        <div className="disclaimer-content">
            <p>All the information on this website – AMA BHOOMI Portal - is published in good faith and for general information purpose only. The website and Application do not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website/application, is strictly at your own risk. AMA BHOOMI portal will not be liable for any losses and/or damages in connection with the use of our website or application. </p>
            <p>From our website/application, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.</p>
            <p>Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.</p>
            <p>The services links of other agencies are being provided as a convenience and for informational purposes only; they do not constitute an endorsement or an approval by any government agency of any of the products, services or opinions of the corporation or organization or individual. The organization bears no responsibility for the accuracy, legality or content of the external site or for that of subsequent links. Contact the external site for answers to questions regarding its content.</p>

            <h2>Update</h2>
            <p>Should we update, amend or make any changes to this document, those changes will be prominently posted here</p>
        </div>
    </div>
    );
};

export default Disclaimer;
