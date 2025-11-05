// src/App.js
import React from "react";
import "./App.css";
import RainfallForm from "./components/RainfallForm";

function App() {
  // Create an array of 80 elements to map into raindrop spans for a fuller effect
  const raindrops = Array.from({ length: 80 });

  return (
    <div className="App">
      <div className="background-container">
        <div className="rain">
          {raindrops.map((_, idx) => (
            <span key={idx} className="raindrop"></span>
          ))}
        </div>
      </div>

      <div className="content-container">
        <RainfallForm />
      </div>
    </div>
  );
}

export default App;