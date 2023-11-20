import { useState } from 'react';
import './SmartSynopsis.jsx';
import './CopyBox.css';
import React from 'react'
// eslint-disable-next-line react/prop-types
function CopyBox({ content }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [btnText,setBtntext]=useState("Copy")
  const copyToClipboard = () => {
    const contentString=convertToPlainText(content)
    navigator.clipboard.writeText(contentString)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1000); 
        setBtntext("Copied");// Reset success message after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy to clipboard: ', err);
      });
  };

  const convertToPlainText = (value) => {
    if (typeof value === 'string') {
      return value; // If it's already a string, return as is
    } else if (React.isValidElement(value)) {
      return React.Children.toArray(value.props.children)
        .map(child => convertToPlainText(child))
        .join(' ');
    } else if (typeof value === 'object' && value !== null) {
      // Handle objects, such as React components
      return JSON.stringify(value);
    } else {
      return String(value);
    }
  };

  return (
    <div>
      <button onClick={copyToClipboard} className='copyc'>{btnText}</button>
      {copySuccess && <div className='csuccess'>Code copied to clipboard</div>}
      {content}
    </div>
  );
}

export default CopyBox;
