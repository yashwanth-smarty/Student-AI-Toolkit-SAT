import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './components/CodeAssistant.css';
import OpenAI from 'openai';
import React from 'react';
import CopyBox from './components/CopyBox.jsx';
// import { Worker, Viewer } from '@react-pdf-viewer/pdfjs';


// import { useEffect } from 'react';

function ResumeCritique() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [userTexts, setUserTexts] = useState([]);
  const [gptTexts, setGptTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // State to track errors

  // const [pdfUrl, setPdfUrl] = useState('file:///E:/HP/Downloads/Downloads/_ThotaYashwanth_.pdf');
  // const documents = [{ uri: 'E:\HP\Downloads\Downloads\Vijay Resume.docx' }];

  const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true
  });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };
  const handleSubmit = async () => {
    // Upload the file and extract text
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('http://127.0.0.1:5000/api/extract-text', formData);
        setExtractedText(response.data.text);

        // Append the new user input to the existing texts
        const userMessage = normalizeText(response.data.text);
        setUserTexts([...userTexts, userMessage]);

        setIsLoading(true);
        const gptResponse = await getGptResponse(userMessage);
        setGptTexts([...gptTexts, gptResponse]);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        let customError='Sorry for the inconvenince! Please try again after sometime...';
        if(error.message.includes('maximum')){
          customError='Large content detected! Please reload and upload another shorter content file.';
        }
        setError(customError);
        setIsLoading(false);
      }
    }
  };

  const getGptResponse = async (userMessage) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'system',
          content:
          "Imagine you're a Resume Critique specialist.Mention the rating for the given resume out of 10. Your role is to evaluate users' resumes and offer constructive feedback, ratings, and suggestions to help them create compelling and impactful resumes. Your expertise includes assessing content, layout, and formatting, with the goal of enhancing their chances of securing job interviews and advancing in their careers.",
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const gptResponse = response.choices[0].message.content;
    const formattedResponse = formatCodeSections(gptResponse);

    return formattedResponse;
  };

  function formatCodeSections(response) {
    const formattedResponse = [];
    let prevLineWasEmpty = false; // Flag to track if the previous line was empty
  
    response.split('\n').forEach((line) => {
      // If inside a code block, append the line to the current code block
      // If not inside a code block
      if (line.trim() === '') {
        // If the line is empty, add a single newline character
        if (!prevLineWasEmpty) {
          formattedResponse.push(<br key={formattedResponse.length} />);
          prevLineWasEmpty = true;
        }
      } else {
        // If the line has content, add it with a line break
        if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\. /.test(line)) {
          // If the line starts with a bullet point or a numerical point, add it as a list item
          formattedResponse.push(<li key={formattedResponse.length}>{line}</li>);
        } else {
          // Otherwise, add it as a regular line
          formattedResponse.push(line);
        }
        prevLineWasEmpty = false;
      }
    });
  
    return formattedResponse;
  }
  function formatUserText(userText) {
    const formattedUserText = [];
    let prevLineWasEmpty = false; // Flag to track if the previous line was empty
  
    userText.split('\n').forEach((line) => {
      // If inside a list, append the line to the current list item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || /^\d+\. /.test(line.trim())) {
        if (!prevLineWasEmpty) {
          formattedUserText.push(<br key={formattedUserText.length} />);
          prevLineWasEmpty = true;
        }
        formattedUserText.push(<li key={formattedUserText.length}>{line.trim().substring(2)}</li>);
      } else if (line.trim() === '') {
        // If the line is empty, add a single newline character
        if (!prevLineWasEmpty) {
          formattedUserText.push(<br key={formattedUserText.length} />);
          prevLineWasEmpty = true;
        }
      } else {
        // If the line has content, add it with a line break
        formattedUserText.push(line);
        prevLineWasEmpty = false;
      }
    });
  
    return formattedUserText;
  }
  
  
  
  

  // const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  // const [isTyping, setIsTyping] = useState(false);
  // const [typedMessage, setTypedMessage] = useState('');

  // useEffect(() => {
  //   // Check if there's a new gpt-text to display
  //   if (currentMessageIndex < gptTexts.length) {
  //     setIsTyping(true);
  //     setTypedMessage(''); // Clear previously typed message

  //     // Get the message to type
  //     const messageToType = gptTexts[currentMessageIndex];

  //     // Start typing the message character by character
  //     let charIndex = 0;
  //     const typingInterval = setInterval(() => {
  //       if (charIndex < messageToType.length) {
  //         setTypedMessage((prevTyped) => prevTyped + messageToType[charIndex]);
  //         charIndex++;
  //       } else {
  //         // Typing complete for this message
  //         clearInterval(typingInterval);
  //         setTimeout(() => {
  //           setIsTyping(false);
  //           setCurrentMessageIndex(currentMessageIndex + 1);
  //         }, 2000); // Delay before moving to the next message (adjust as needed)
  //       }
  //     }, 100); // Typing speed (adjust as needed)
  //   }
  // }, [gptTexts, currentMessageIndex]);

  const chatLogRef = useRef(null);

useEffect(() => {
  // Scroll to the latest message when a new message is added
  const scrollToBottom = () => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  };

  // Scroll to the end when the component mounts
  // Scroll to the end whenever userTexts or gptTexts change
  scrollToBottom();
  
  setTimeout(scrollToBottom,500);

  setTimeout(scrollToBottom,1000);

  setTimeout(scrollToBottom,1500);

  setTimeout(scrollToBottom,2000);

  setTimeout(scrollToBottom,2500);


}, [userTexts, gptTexts]);

  const normalizeText = (text) => {
    // Remove extra spaces and line breaks
    text = text.replace(/\s+/g, ' ');

    // Remove spaces before and after punctuation
    text = text.replace(/\s*([.,;!?])\s*/g, '$1 ');

    return text;
  };


  return (
    <div>
      <center><h1>Resume Critique</h1></center>
      <div className='ex-input'>
      <input type="file" onChange={handleFileChange} />
      {/* <button onClick={handleUpload} className='extract'>Extract Text</button> */}
      <button onClick={handleSubmit} className='extract-summarize'>
        Extract and Summarize
      </button>
      </div>
      {/* {extractedText && (
        <div className="text-box">
        <h2>Extracted Text:</h2>
        <div className="text-content">
          <p className="extracted-text">{normalizeText(extractedText)}</p>
        </div>
      </div>
      )} */}
      
      
      
      <div className="chat-log" ref={chatLogRef}>
  {userTexts.map((text, index) => (
    <React.Fragment key={`user-${index}`}>
      <div className="user-text">Analysing your resume data, this may take a moment... </div>
      {isLoading && index === userTexts.length - 1 && (
                <div className="loading-dots"><div className="ldot"></div><div className="ldot"></div><div className="ldot"></div></div>
              )}
      {gptTexts[index] && (
        <div className="gpt-text">
        {<CopyBox content={gptTexts[index]}/>
            }
      </div>
      )}
    </React.Fragment>
  ))}
</div>
{error && <div className="error-message">{error}</div>}

    </div>
  );
}

export default ResumeCritique;