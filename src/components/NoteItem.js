import React, { useContext } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import NoteContext from "../context/notes/NoteContext";
const NoteItem = (props) => {
  const { note, updateNote } = props;
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  return (
    <div className="container" style={{ width: "60%" }}>
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title my-1 mx-2">{note.title}</h5>
            <MdDelete
              onClick={() => {
                deleteNote(note._id);
                props.showAlert("Note deleted successfully", "success");
              }}
              className="mx-3 "
              style={{ cursor: "pointer" }}
            />
            <FaEdit
              style={{ cursor: "pointer" }}
              onClick={() => {
                updateNote(note);
              }}
            />
          </div>
          <p className="mx-2">{note.description} </p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
