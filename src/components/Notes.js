import React, { useContext, useRef, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import NoteItem from "./NoteItem";
import AddNotes from "./AddNotes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(NoteContext);
  let navigator = useNavigate();
  const { notes, getNotes, editNote } = context;
  useEffect(() => {
    if (localStorage.getItem("token")) getNotes();
    else navigator("/login");
    //eslint-disable-next-line
  }, []);
  const [note, setNote] = useState({
    eid: "",
    etitle: "",
    edescription: "",
    etag: "",
  });
  const updateNote = (currentNote) => {
    ref.current.click();

    setNote({
      eid: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };
  const ref = useRef("");
  const refclose = useRef("");

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  const handleChange = (e) => {
    editNote(note.eid, note.etitle, note.edescription, note.etag);
    refclose.current.click();
    setNote({ eid: "", etitle: "", edescription: "", etag: "" });
    props.showAlert("Updated successfully", "success");
  };
  return (
    <>
      <AddNotes showAlert={props.showAlert} />
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none minLength={5} required"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        Launch demo modal
      </button>

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
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Notes
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="etitle"
                    minLength={5}
                    required
                    onChange={onChange}
                    value={note.etitle}
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="Descriptions" className="form-label">
                    Descriptions
                  </label>
                  <input
                    type="text"
                    onChange={onChange}
                    className="form-control"
                    id="description"
                    name="edescription"
                    minLength={5}
                    required
                    value={note.edescription}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                ref={refclose}
              >
                Close
              </button>
              <button
                disabled={
                  note.etitle.length < 3 || note.edescription.length < 5
                }
                type="button"
                className="btn btn-primary"
                onClick={handleChange}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <h2 style={{ margin: "50px 20% 0px" }}>Your Notes</h2>
      {notes.length === 0 && "No notes to display"}
      <div className="row">
        {notes.map((note) => {
          return (
            <NoteItem
              key={note._id}
              note={note}
              updateNote={updateNote}
              showAlert={props.showAlert}
            />
          );
        })}
      </div>
    </>
  );
};

export default Notes;

// <div className="mb-3">
//                   <label htmlFor="tag" className="form-label">
//                     Tag
//                   </label>
//                   <input
//                     type="text"
//                     onChange={onChange}
//                     className="form-control"
//                     id="tag"
//                     minLength={5}
//                     required
//                     name="etag"
//                     value={note.etag}
//                   />
//                 </div>
