import React, { useState, useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const AddNotes = (props) => {
  const context = useContext(NoteContext);
  const { addNote } = context;
  const [notes, setnotes] = useState({ title: "", description: "", tag: "" });
  const onChange = (e) => {
    setnotes({ ...notes, [e.target.name]: e.target.value });
  };
  const handleClick = (e) => {
    e.preventDefault();
    addNote(notes.title, notes.description, notes.tag);
    props.showAlert("Note added successfully", "success");
    setnotes({ title: "", description: "", tag: "" });
  };
  return (
    <div>
      <div className="container my-3" style={{ width: "60%" }}>
        <h2>Add Note</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              minLength={5}
              required
              type="text"
              className="form-control"
              id="title"
              name="title"
              onChange={onChange}
              value={notes.title}
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="Descriptions" className="form-label">
              Description
            </label>
            <input
              minLength={5}
              required
              type="text"
              value={notes.description}
              onChange={onChange}
              className="form-control"
              id="description"
              name="description"
            />
          </div>

          <button
            disabled={notes.title.length < 3 || notes.description.length < 5}
            type="submit"
            className="btn btn-primary"
            onClick={handleClick}
          >
            Add Note
          </button>
        </form>

        <div className="row"></div>
      </div>
    </div>
  );
};

export default AddNotes;

// <div className="mb-3">
//   <label htmlFor="tag" className="form-label">
//     Tag
//   </label>
//   <input
//     minLength={5}
//     required
//     type="text"
//     value={notes.tag}
//     onChange={onChange}
//     className="form-control"
//     id="tag"
//     name="tag"
//   />
// </div>
