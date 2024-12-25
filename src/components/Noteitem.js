import React, { useContext } from 'react'
import noteContext from "../context/notes/noteContext";
const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    const handleDelete = () => {
        deleteNote(note._id);
        props.showAlert("Note deleted successfully!", "success"); // Trigger alert after deletion
    };

    return (
        <div className='col-md-3'>

            <div className="card my-3">

                <div className="card-body">
                    <div className='d-flex'>


                        <h5 className="card-title">   {note.title}</h5>
                        <p className="card-text">  {note.description}</p>
                        <span
                            className="material-symbols-outlined" onClick={() => { updateNote(note._id) }}
                            style={{
                                fontSize: "24px",
                                cursor: "pointer", // Add this to make it clickable
                            }}
                        >
                            edit
                        </span>
                        <span
                            className="material-symbols-outlined mx-2"
                            onClick={handleDelete}
                            style={{ fontSize: "24px", cursor: "pointer" }}
                        >
                            delete
                        </span>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Noteitem
