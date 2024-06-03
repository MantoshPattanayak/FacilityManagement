import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaCopy } from 'react-icons/fa';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ShareComponent = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div>
      <FacebookShareButton url={url}>
        <FaFacebook />
      </FacebookShareButton>

      <TwitterShareButton url={url}>
        <FaTwitter />
      </TwitterShareButton>

      <LinkedinShareButton url={url}>
        <FaLinkedin />
      </LinkedinShareButton>

      <CopyToClipboard text={url} onCopy={handleCopy}>
        <div>
          <FaCopy />
        </div>
      </CopyToClipboard>

      {copied && <span style={{ marginLeft: '5px' }}>Link copied!</span>}
    </div>
  );
};

export default ShareComponent;
