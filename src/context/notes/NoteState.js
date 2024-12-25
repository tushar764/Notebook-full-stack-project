
import { useState, } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial =[]

  const [notes, setNotes] = useState(notesInitial)

  // Get all a note
  const getNotes = async() => {

    // TODO: API call
     // Api Call

     const response = await fetch(`${host}/api/notes1/fetchallnotes`,{
      method:'GET',
      headers:{
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      },
      

    });
   
const json= await response.json()
console.log(json)
setNotes(json)
 

  }


  // Add a note
  const addNote = async(title, description, tag) => {
    console.log("adding a note")
    // TODO: API call
     // Api Call

     const response = await fetch(`${host}/api/notes1/addnote`,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      },
      body:JSON.stringify({title,description,tag})

    });

    // // this line causing error
    // const json =response.json()
    const note = await response.json();
    setNotes(notes.concat(note))



  }
  // DeleteNote
  const deleteNote = async(id) => {
 const response = await fetch(`${host}/api/notes1/deletenote/${id}`,{
      method:'DELETE',
      headers:{
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      }
      // body:JSON.stringify(title,description,tag)

    });
    const json =response.json()
    console.log(json)


    console.log("Deleting the note with id " + id);
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);

  }

  // edit a note
  const editNote = async(id, title, description, tag) => {
    // Api Call

    const response = await fetch(`${host}/api/notes1/updatenote/${id}`,{
      method:'PUT',
      headers:{
        'Content-Type': 'application/json',
        "auth-token":localStorage.getItem('token')
      },
      body:JSON.stringify({title,description,tag})

    });
    const json =await response.json()
    console.log(json)
 
let newNotes = JSON.parse(JSON.stringify(notes))

    // logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }

    }
setNotes(newNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote,getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;