// src/App.js
import React from "react";
import "./App.css";
import RainfallForm from "./components/RainfallForm";

function App() {
  return (
    <div className="App">
      {/* This new container will hold the animated raindrops */}
      <div className="background-container">
        <div className="rain"></div>
      </div>

      {/* This container ensures your form stays on top of the background */}
      <div className="content-container">
        <RainfallForm />
      </div>
    </div>
  );
}

export default App;