import ReactMarkdown from "react-markdown";
import PropTypes from 'prop-types';
import { useRef } from "react";

const EMain = ({ activeNote, onUpdateNote }) => {
  const onEditField = (field, value) => {
    onUpdateNote({
      ...activeNote,
      [field]: value,
      lastModified: Date.now(),
    });
  };
  const enotearea = useRef(null);  
 const { webkitSpeechRecognition } = window;
 const recognition = new webkitSpeechRecognition();
 recognition.interimResults = true;
 recognition.continuous = true; // Enable continuous listening
 let recognitionTimeout;
//  let prevtext='';
recognition.onresult = (event) => {
  const transcript = Array.from(event.results)
    .map((result) => result[0].transcript)
    .join('');

  if (enotearea.current) {
    enotearea.current.value = transcript;
    console.log(enotearea.current.value);
  }

  // Clear previous timeout
  clearTimeout(recognitionTimeout);

  // Set a new timeout to stop recognition after a period of silence
  recognitionTimeout = setTimeout(() => {
    recognition.stop();
  }, 1000); // Adjust the timeout duration as needed
};



  
recognition.onend = () => {
    // Speech recognition has ended
};

function startRecognition() {
    clearTimeout(recognitionTimeout); // Clear any existing timeout
    recognition.start();
}

if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <input
          type="text"
          id="title"
          placeholder="Note Title"
          className="etitle"
          value={activeNote.title}
          onChange={(e) => onEditField("title", e.target.value)}
          autoFocus
        />
        <img
              className="eaudio"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyUlEQVR4nO2UTQrCMBCFPxe6cm3xNv4cQfQyrkTBehkRpBfQpVK9ROuyXkAigaeU2grR4MZ+MItMXua1EzLwL7SAFZACCRAq540QMIWwOW+kJQYXnwamImqDJ3WLXtgAB6CpdVLSJptDmiOwxoGzivTePLSl9gZan1wMFjoUAQ2NhVBfXRwVkbQzF4MucNXBeYXGGk+lyYAARybATQW2QB9oK4bATntWM+JDxrk/KYvsm+IPAvU3zhWOlevgGeN7yP3cYK/LrcEbd22kaWbj45q9AAAAAElFTkSuQmCC"
              alt="Clear"
              onClick={startRecognition}
              title='talk here'
            />
        <textarea
          id="body"
          placeholder="Write your note here..."
          value={activeNote.body}
          className="notearea"
          onChange={(e) => onEditField("body", e.target.value)}
          ref={enotearea}
        />
      </div>
      <div className="app-main-note-preview">
        <h1 className="preview-title">{activeNote.title}</h1>
        <ReactMarkdown className="markdown-preview">
          {activeNote.body}
        </ReactMarkdown>
      </div>
    </div>
  );
};
EMain.propTypes = {
    activeNote: PropTypes.object, // Define the correct shape of your activeNote object
    onUpdateNote: PropTypes.func.isRequired,
  };
export default EMain;