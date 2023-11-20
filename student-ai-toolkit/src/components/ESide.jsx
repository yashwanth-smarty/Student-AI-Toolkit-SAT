import PropTypes from 'prop-types';

const ESide = ({
    notes,
    onAddNote,
    onDeleteNote,
    activeNote,
    setActiveNote,
}) => {
    const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);

    return (
        <div className="app-sidebar">
            <div className="app-sidebar-header">
                <h1>Notes</h1>
                <button onClick={onAddNote} className='eadd'>+</button>
            </div>
            <div className="app-sidebar-notes">
                {sortedNotes.map(({ id, title, body, lastModified }) => (
                    <div
                        key={id} // Add the key prop here
                        className={`app-sidebar-note ${id === activeNote && "active"}`}
                        onClick={() => setActiveNote(id)}
                    >
                        <div className="sidebar-note-title">
                            <strong>{title}</strong>
                            <button onClick={() => onDeleteNote(id)} className='edel'>Delete</button>
                        </div>

                        <p>{body && body.substr(0, 100) + "..."}</p>
                        <small className="note-meta">
                            Last Modified{" "}
                            {new Date(lastModified).toLocaleDateString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
};

ESide.propTypes = {
    notes: PropTypes.array.isRequired,
    onAddNote: PropTypes.func.isRequired,
    onDeleteNote: PropTypes.func.isRequired,
    activeNote: PropTypes.string.isRequired, // Assuming activeNote is a string
    setActiveNote: PropTypes.func.isRequired,
};

export default ESide;
