import { Component, useRef, useState } from 'react';
import OpenAI from 'openai';
import {API_KEY} from './key.jsx';
import { useEffect } from 'react';
import React from 'react';
import './CodeBox.jsx';
import CodeBox from './CodeBox.jsx';

class AutoExpandingTextInput extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      rows: 1,
    };
    this.maxRows = 4;
  }

  handleTextChange = (event) => {
    const input = event.target;
    const currentRows = Math.floor(input.scrollHeight / input.clientHeight);
    const maxRows = Math.min(this.maxRows, currentRows);

    this.setState({
      text: input.value,
      rows: maxRows,
    });
  };

  render() {
    return (
      <textarea
        value={this.state.text}
        rows={this.state.rows}
        className="itextarea"
        placeholder="Simple counter app using React hooks"
        onChange={this.handleTextChange}
        title='Type your message...'
      />
    );
  }
}

function CodeAssistant() {
  const { webkitSpeechRecognition } = window;
  const textAreaRef = useRef(null);
  const recognition = new webkitSpeechRecognition();
  const [userTexts, setUserTexts] = useState([]); // State to store user's input texts
  const [gptTexts, setGptTexts] = useState([]); // State to store GPT-3.5 responses
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser:true
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const userMessage = textAreaRef.current.state.text;

    // Append the new user input to the existing texts
    setUserTexts([...userTexts, userMessage]);

    setIsLoading(true);

    // Call the OpenAI API to get a response
    const response = await getGptResponse(userMessage);

    // Set GPT responses in state
    setGptTexts((prevGptTexts) => [...prevGptTexts, response]);

    // Clear the textarea
    textAreaRef.current.setState({ text: '', rows: 1 });
  }

  // useEffect hook to update loading state
  useEffect(() => {
    setIsLoading(false);
  }, [gptTexts]);
  
  

  async function getGptResponse(userMessage) {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
          "Imagine you are a Code Assistant, a coding expert specializing in providing professional solutions for programming languages, debugging, translation, optimization, testing, and refactoring."  
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.3,
      max_tokens: 600,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const gptResponse = response.choices[0].message.content;
    const formattedResponse = formatCodeSections(gptResponse);
    console.log(gptResponse);
    return formattedResponse;

  }

  function formatCodeSections(response) {
    const formattedResponse = [];
    let currentCodeBlock = ''; // Track the current code block
    let isCodeBlock = false; // Flag to indicate if we are inside a code block
    let prevLineWasEmpty = false; // Flag to track if the previous line was empty
  
    const backtickRegex = /`([^`]+)`/g; // Regular expression to match words enclosed in backticks
  
    response.split('\n').forEach((line) => {
      if (line.startsWith('```')) {
        // If a line starts with "```", toggle the code block flag
        isCodeBlock = !isCodeBlock;
  
        if (!isCodeBlock) {
          // If exiting a code block, add the code block to the formatted response
          formattedResponse.push(
            <CodeBox key={formattedResponse.length} code={currentCodeBlock} />
          );
          currentCodeBlock = ''; // Reset the current code block
          prevLineWasEmpty = false; // Reset the empty line flag
        }
      } else {
        // If inside a code block, append the line to the current code block
        if (isCodeBlock) {
          currentCodeBlock += line + '\n';
        } else {
          // If not inside a code block
          if (line.trim() === '') {
            // If the line is empty, add a single newline character
            if (!prevLineWasEmpty) {
              formattedResponse.push(<br key={formattedResponse.length} />);
              prevLineWasEmpty = true;
            }
          } else {
            // If the line has content, split and highlight words enclosed in backticks
            const segments = line.split(backtickRegex);
            formattedResponse.push(
              segments.map((segment, index) =>
                index % 2 === 1 ? <strong key={index}>{segment}</strong> : segment
              )
            );
            prevLineWasEmpty = false;
          }
        }
      }
    });
  
    return formattedResponse;
  }
  
  
  
  function formatUserText(userText) {
    const formattedUserText = [];
    let prevLineWasEmpty = false; // Flag to track if the previous line was empty
    
    userText.split('\n').forEach((line) => {
      if (line.trim() === '') {
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
  
  
  
  function handleClearClick() {
    if (textAreaRef.current) {
      textAreaRef.current.setState({ text: '', rows: 1 });
      // Clear the 'user-text' and 'gpt-text' paragraphs
      const res=window.confirm("Are you sure you want to clear the Chat?");
      if(res)
      {
      setUserTexts([]);
      setGptTexts([]);
      }
      // setUserTexts([]);
      // setGptTexts([]);
    }
  }

  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (textAreaRef.current) {
      const currentText = textAreaRef.current.state.text;
      const newText = currentText ? `${currentText} ${transcript}` : transcript;
      textAreaRef.current.setState({ text: newText, rows: 1 });
    }
  };

  recognition.onend = () => {
    // Speech recognition has ended
  };

  function startRecognition() {
    recognition.start();
  }

  // function stopRecognition() {
  //   recognition.stop();
  // }



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

useEffect(() => {
  // Function to handle the ENTER key press
  function handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
      // Find the "send" img element using the ref
      const sendImg = document.querySelector('.send');
      
      // Trigger a click event on the "send" img element
      if (sendImg) {
        sendImg.click();
      }
    }
    
  }

  // Add an event listener to the document to listen for ENTER key press
  document.addEventListener('keydown', handleEnterKeyPress);

  // Clean up the event listener when the component unmounts
  return () => {
    document.removeEventListener('keydown', handleEnterKeyPress);
  };
}, []);



  return (
    <div>
      <section className="chatbox">
        <div>
          <form onSubmit={handleSubmit} className="input-holder">
            <img
              className="iaudio"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyUlEQVR4nO2UTQrCMBCFPxe6cm3xNv4cQfQyrkTBehkRpBfQpVK9ROuyXkAigaeU2grR4MZ+MItMXua1EzLwL7SAFZACCRAq540QMIWwOW+kJQYXnwamImqDJ3WLXtgAB6CpdVLSJptDmiOwxoGzivTePLSl9gZan1wMFjoUAQ2NhVBfXRwVkbQzF4MucNXBeYXGGk+lyYAARybATQW2QB9oK4bATntWM+JDxrk/KYvsm+IPAvU3zhWOlevgGeN7yP3cYK/LrcEbd22kaWbj45q9AAAAAElFTkSuQmCC"
              alt="Clear"
              onClick={startRecognition}
              title='talk here'
            />
            {/* <img
              className="clear clears"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAv0lEQVR4nO2VXQrCMBAGxwtalZY86NkVLP6hN6hQCaQgJdXdsFHEDOQt+02TbBooFP6JBrgBB2ChqFsCJ+AK1FrpLBT2YXSAE9S5MHeo8xlqLk8BEvlY6sc5RbyKBE3JY9IuZCRRRwLvwGbUC7E561SpRJ5N+m4rpUdhvvJsK5XKs0qZONNYw31E2ueUu280V/Piykjuubl0wFxeGfwyfYaa1uCR2KeIjwbPos9QU4Uv3iq3zM/dhdp5irhQ+E0ekyummbane5EAAAAASUVORK5CYII="
              alt="Clear"
              onClick={stopRecognition}
            /> */}
            <AutoExpandingTextInput ref={textAreaRef} />
            <img
              onClick={handleSubmit}
              className="send"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5UlEQVR4nO3WMUpDQRSF4Q/UQhsRbKzdQMAFaCtqmTalYh9wATZuwMIt2FoGRJusIK0QSF4jdnaCXBGmsBFM4purkAN//V+GmTOXZRJzhCmecIGNWuIJ4gsNzrDWtji+YYxTrNQWR2GEboY4CkPsZ4ijMEAnQxx4xy12a4uj8IYb7MwjbhaUf/KKS2zOIj4uBRK/wAv6WJ9lgC3soYcr3JU2m2eAaemAVQtkGwc4xzXu8fzDAR6zxA9/8qhPsi5Xk/WcIqtA4r9U5qD2JzGs/S2Oai8C47ZXn0nWsndY5NXX22W0kQ875CXXn83dMgAAAABJRU5ErkJggg=="
              alt="Send"
              title='Submit'
            />
            <img
              className="clear"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAv0lEQVR4nO2VXQrCMBAGxwtalZY86NkVLP6hN6hQCaQgJdXdsFHEDOQt+02TbBooFP6JBrgBB2ChqFsCJ+AK1FrpLBT2YXSAE9S5MHeo8xlqLk8BEvlY6sc5RbyKBE3JY9IuZCRRRwLvwGbUC7E561SpRJ5N+m4rpUdhvvJsK5XKs0qZONNYw31E2ueUu280V/Piykjuubl0wFxeGfwyfYaa1uCR2KeIjwbPos9QU4Uv3iq3zM/dhdp5irhQ+E0ekyummbane5EAAAAASUVORK5CYII="
              alt="Clear"
              onClick={handleClearClick}
              title='Clear Chat'
            />
          </form>
        </div>

        <div className="chat-log" ref={chatLogRef}>
  {userTexts.map((text, index) => (
    <React.Fragment key={`user-${index}`}>
      <div className="user-text">{formatUserText(text)}</div>
      {isLoading && index === userTexts.length - 1 && (
                <div className="loading-dots"><div className="ldot"></div><div className="ldot"></div><div className="ldot"></div></div>
              )}
      {gptTexts[index] && (
        <div className="gpt-text">
        {gptTexts[index]}
      </div>
      )}
    </React.Fragment>
  ))}
</div>

        


      </section>
    </div>
  );
}

export default CodeAssistant;