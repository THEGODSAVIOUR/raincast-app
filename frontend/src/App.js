// src/App.js
import React from "react";
import "./App.css";
import RainfallForm from "./components/RainfallForm";

function App() {
  // Create an array of 50 elements to map into raindrop spans
  const raindrops = Array.from({ length: 50 });

  return (
    <div className="App">
      <div className="background-container">
        {/* The container for all our raindrop elements */}
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