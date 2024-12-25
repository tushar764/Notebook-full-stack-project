import { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom"; // Correct import for useNavigate


const Notes = (props) => {
  const context = useContext(noteContext);
let navigate = useNavigate(); // Correct usage

  const { notes, getNotes, editNote } = context;

  const modalRef = useRef(null);

  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();  // Fetch notes
    } else {
      navigate("/login");  // Redirect if no token
    }
    console.log("home this is page");
  }, [navigate, getNotes]); // Run once on component load

    // Show Alert function
    const showAlert = (message, type) => {
      props.showAlert(message, type);
    };

  const handleUpdateClick = (currentNote) => {
    modalRef.current.click();
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,   });
      // props.showAlert("successfully updated","success");
 
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    try {
      await editNote(note.id, note.etitle, note.edescription, note.etag);
      showAlert("Note updated successfully!", "success");
      modalRef.current.click();
    } catch (error) {
      console.error("Error updating note:", error);
      showAlert("Failed to update note.", "danger");
    }
  };

  const handleInputChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value }
     
    );
   
  };

  return (
    <>
      <AddNote showAlert={props.showAlert}/>

      {/* Hidden button to trigger modal */}
      <button
        ref={modalRef}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value={note.etitle}
                    onChange={handleInputChange}
                    minLength={5} required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={handleInputChange}
                    minLength={5} required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value={note.etag}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button> */}
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={note.etitle.length < 5 || note.edescription.length < 5}
                onClick={handleSaveClick}
                type="button"
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes display */}
      <div className="container my-3">
        <h1>Your Notes</h1>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Noteitem
              key={note._id}
              updateNote={() => handleUpdateClick(note)}
              showAlert={showAlert} // Pass showAlert here
              note={note}
            />
          ))
        ) : (
          <p>No notes available</p>
        )}
      </div>
    </>
  );
};

export default Notes;
