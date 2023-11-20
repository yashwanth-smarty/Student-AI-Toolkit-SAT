import './CodeAssistant.css';
import { Component, useRef, useState } from 'react';
import OpenAI from 'openai';
import { useEffect } from 'react';
import React from 'react';
import CopyBox from './CopyBox';

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
        placeholder="Provide a sentence, and I'll provide you Grammar Guidance."
        onChange={this.handleTextChange}
        title='Type something...'
      />
    );
  }
}

function GrammarGuide() {
  const { webkitSpeechRecognition } = window;
  const textAreaRef = useRef(null);
  const recognition = new webkitSpeechRecognition();
  const [userTexts, setUserTexts] = useState([]); // State to store user's input texts
  const [gptTexts, setGptTexts] = useState([]); // State to store GPT-3.5 responses
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const openai = new OpenAI({
    apiKey: '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',
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
    setGptTexts([...gptTexts, response]);

    // Clear the textarea
    // if (textAreaRef.current) {
    //   textAreaRef.current.setState({ text: '', rows: 1 });
    // }
    setIsLoading(false);
  }

  async function getGptResponse(userMessage) {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'system',
          content: 
          "Imagine you are a Grammar Guide, a master of linguistic precision and grammar excellence. Your primary role is to assist users in enhancing the clarity and correctness of their written content in any language. You specialize in proofreading and improving grammar, spelling, punctuation, and style to ensure that the user's text is free from errors and reads professionally. Whether it's a business document, academic paper, creative writing, or any form of communication, your expertise is sought after to provide meticulous and comprehensive editing. You have a keen eye for detail, a deep understanding of language structure, and a knack for making text shine with polished clarity.",        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const gptResponse = response.choices[0].message.content;
    const formattedResponse = formatCodeSections(gptResponse);

    return formattedResponse;

  }

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

  
  recognition.interimResults = true;
  recognition.continuous = true; // Enable continuous listening
  let recognitionTimeout;

  recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(' ');
  
      if (textAreaRef.current) {
          // Update the text area with the combined transcript
          textAreaRef.current.setState({ text: transcript, rows: 1 });
      }
      clearTimeout(recognitionTimeout);
    recognitionTimeout = setTimeout(() => {
        recognition.stop(); // Stop recognition after a period of silence
    }, 1500);
  };
  
  recognition.onend = () => {
      // Speech recognition has ended
  };
  
  function startRecognition() {
    clearTimeout(recognitionTimeout); // Clear any existing timeout
      recognition.start();
  }

  // function stopRecognition() {
  //   recognition.stop();
  // }

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');

  useEffect(() => {
    // Check if there's a new gpt-text to display
    if (currentMessageIndex < gptTexts.length) {
      setIsTyping(true);
      setTypedMessage(''); // Clear previously typed message

      // Get the message to type
      const messageToType = gptTexts[currentMessageIndex];

      // Start typing the message character by character
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex < messageToType.length) {
          setTypedMessage((prevTyped) => prevTyped + messageToType[charIndex]);
          charIndex++;
        } else {
          // Typing complete for this message
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsTyping(false);
            setCurrentMessageIndex(currentMessageIndex + 1);
          }, 2000); // Delay before moving to the next message (adjust as needed)
        }
      }, 100); // Typing speed (adjust as needed)
    }
  }, [gptTexts, currentMessageIndex]);

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
        {isTyping && index === gptTexts.length - 1
            ? typedMessage 
            : <CopyBox content={gptTexts[index]}/>
            }
      </div>
      )}
    </React.Fragment>
  ))}
</div>

        


      </section>
    </div>
  );
}

export default GrammarGuide;
