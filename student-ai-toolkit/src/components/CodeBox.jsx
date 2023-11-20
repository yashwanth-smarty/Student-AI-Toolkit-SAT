import { useState } from 'react';
import './CodeAssistant.jsx';
import './CodeAssistant.css';
// eslint-disable-next-line react/prop-types
function CodeBox({ code }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [btnText,setBtntext]=useState("Copy")
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1000); 
        setBtntext("Copied");// Reset success message after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy to clipboard: ', err);
      });
  };

  return (
    <div className="code-box">
      <button onClick={copyToClipboard} className='ccopy'>{btnText}</button>
      {copySuccess && <div className="copy-success">Code copied to clipboard</div>}
      <pre>{code}</pre>
    </div>
  );
}

export default CodeBox;
