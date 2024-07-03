import React from 'react';
import PublicHeader from '../../../common/PublicHeader';
import './Terms_ConditionPage.css';

const Terms_ConditionPage = () => {
  return (
    <div className="terms-container">
        <PublicHeader/>
       
      
      <h1 className="terms-header">Terms and Conditions</h1>
      <div className="terms-content">
        <h2>Introduction</h2>
        <p>Welcome to our website. By continuing to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern [Your Company]'s relationship with you in relation to this website.</p>
        
        <h2>Use of the Website</h2>
        <p>This website may use cookies to monitor browsing preferences. If you do allow cookies to be used, the following personal information may be stored by us for use by third parties.</p>

        <h2>Intellectual Property</h2>
        <p>The content on this website is for your general information and use only. It is subject to change without notice.</p>

        <h2>Termination of Use</h2>
        <p>Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable.</p>

        <h2>Governing Law</h2>
        <p>Your use of this website and any dispute arising out of such use of the website is subject to the laws of [Your Country/State].</p>
        <h2>Contact</h2>
        <p>Please visit our Help Center with any questions regarding the Services, or submit a support ticket with any questions regarding these Terms, Service, account, or billing matters. You may also contact us by email at help@BDA.com.</p>
      </div>
    </div>
  );
};

export default Terms_ConditionPage;
