import React from "react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import User from "./components/User";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import "./App.css";

export default function App() {
  const [alert, setAlert] = useState("none");
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert("none");
    }, 1500);
  };
  return (
    <div className="text-info">
      <NoteState>
        <BrowserRouter>
          <Navbar />
          <Alert alert={alert} />
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert} />} />
              <Route
                exact
                path="/login"
                element={<Login showAlert={showAlert} />}
              />
              <Route
                exact
                path="/signup"
                element={<Signup showAlert={showAlert} />}
              />
              <Route exact path="/user" element={<User />} />
            </Routes>
          </div>
        </BrowserRouter>
      </NoteState>
    </div>
  );
}
