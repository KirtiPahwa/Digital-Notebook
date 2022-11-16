import NoteContext from "./NoteContext";
import { useState } from "react";
const NoteState = (props) => {
  const host = "http://localhost:4000";
  const notesInitial = [];
  const [notes, setnotes] = useState(notesInitial);

  // get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json(); //this response.json is asynchronous function . so we have to await
    setnotes(json);
  };

  // Add a note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setnotes(notes.concat(note));
  };

  // Delete a note
  const deleteNote = async (id) => {
    // API CALL
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    // const json = await response.json();
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setnotes(newNotes);
  };

  // Edit a note
  const editNote = async (eid, title, description, tag) => {
    // api call
    const response = await fetch(`${host}/api/notes/updatenote/${eid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    // const json = await response.json();
    // const newNotes = notes; //will create a shallow copy so we cann't make changes in newnotes as object inside this newnotes will be refering to the note state itself . And we cann't change the note object like that by iterating . So we have to make a deep copy .

    const newNotes = JSON.parse(JSON.stringify(notes));

    // logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === eid) {
        newNotes[index].title = title; //we cann't directly change the notes state directly.So we'll copy the notes in newNotes and will do changes in newNotes and then setnote(newNotes).Object has its own reference in memory to destroy it you can use JSON.parse (JSON.stringify(object)) no matter how nested key it has, it will remove the reference of the object and you will get a new object.This concept is called a deep copy or deep clone.

        // A shallow copy contains references and a deep copy contains its own copies of those references.
        // shallow vs Deep Copies
        // A diagram. Shallow copies hold references to objects inside the original, deep copies copy all references from the original
        // As the picture above shows, a shallow copy (or “clone”) only references the objects inside the original object, but a deep clone makes clones of the inside objects, too. In other words, a shallow clone only copies the top level of the object. Let’s compare that to real-life examples.

        // So in this if we make var newnotes=notes then shallow copy made and hence we are trying to chnage the state itself which doesnot changes like that. so we have to make deep copy so that we can change the object and then setnotes with new notes. So for that we stringify the json , which will make the nested objects inside the object lose their reference then again making it a json object.
        // https://javascript.plainenglish.io/setstate-not-working-shallow-copy-vs-deep-copy-lodash-55a015db80ff

        newNotes[index].description = description;
        newNotes[index].tag = title;
        break;
      }
    }
    setnotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, setnotes, addNote, deleteNote, editNote, getNotes }}
    >
      {" "}
      {/*value={{state,update}} in modern javascript is equivalent to value={{state:state,update:update}}  */}
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
