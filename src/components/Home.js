import React, { useContext } from "react"
import Notes from "./Notes"
import './Notes.css';


const Home = (props) => {
  const {showAlert}=props
 
  return (
    <div> 
    <Notes showAlert={showAlert} />
  </div>
  )
}

export default Home
