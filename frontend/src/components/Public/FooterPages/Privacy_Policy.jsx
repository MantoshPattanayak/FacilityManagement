import React from 'react';
import './Privacy_Policy.css';
import PublicHeader from '../../../common/PublicHeader';
const Privacy_Policy = () => {
  return (
    <div className="privacy-container">
        <PublicHeader/>
      <h1 className="privacy-header">Privacy Policy</h1>
      <div className="privacy-content">
        <p>Your privacy is important to us. It is [Your Company]'s policy to respect your privacy regarding any information we may collect from you across our website, [Your Website URL], and other sites we own and operate.</p>
        
        <h2>Information We Collect</h2>
        <p>We only collect information about you if we have a reason to do so—for example, to provide our services, to communicate with you, or to make our services better.</p>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect in various ways, including to:</p>
        <ul>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
        </ul>

        <h2>Sharing Your Information</h2>
        <p>We do not share personal information with third parties except as necessary to provide our services or as required by law.</p>

        <h2>Security of Your Information</h2>
        <p>We use administrative, technical, and physical security measures to help protect your personal information.</p>

        <h2>Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul>
          <li>Email: help@BDA.com</li>
          <li>Phone: +123456789</li>
          <li>Address: BDA Office Bhubaneswar, Odisha</li>
        </ul>
      </div>
    </div>
  );
};

export default Privacy_Policy;
