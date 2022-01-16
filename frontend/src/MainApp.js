import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import App from "./App";
import './App.css';
import Streaming from "./components/Streaming";
import Contest from "./components/Contest";
import Trivia from './components/Trivia';
class MainApp extends React.Component {
  render() {
    return (

      <div className="App">
          <BrowserRouter>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<App />} />
            <Route exact path="/tracker" element={<App />} />
            <Route exact path="/contest" element={<Contest />} />
            <Route path="/streaming/*" element={<Streaming />} />
            <Route path="/trivia" element={<Trivia />} />

          </Routes>
          </BrowserRouter>
        </div>

    );
  }
}

export default MainApp;
