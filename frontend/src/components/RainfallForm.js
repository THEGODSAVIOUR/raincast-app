// src/components/RainfallForm.js

import React, { useState } from "react";
import "./RainfallForm.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const RainfallForm = () => {
  const [numReadings, setNumReadings] = useState("");
  const [readings, setReadings] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [highest, setHighest] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNumChange = (e) => {
    const n = parseInt(e.target.value, 10);
    setNumReadings(e.target.value);
    setSortedResults([]); setPrediction(""); setHighest(null);
    if (!isNaN(n) && n > 0 && n <= 10) {
      setReadings(Array.from({ length: n }, () => ({ air: "", dew: "" }))); setError("");
    } else if (n > 10) {
      setError("Please enter a number of readings between 1 and 10."); setReadings([]);
    } else {
      setReadings([]);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedReadings = [...readings];
    updatedReadings[index][field] = value;
    setReadings(updatedReadings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (readings.some((r) => r.air === "" || r.dew === "")) {
      setError("Please fill in all temperature and dew point values."); return;
    }
    for (let r of readings) {
      const air = parseFloat(r.air); const dew = parseFloat(r.dew);
      if (air < 23 || air > 28) { setError("Air temperature must be between 23°C and 28°C."); return; }
      if (dew < 7 || dew > 16) { setError("Dew point must be between 7°C and 16°C."); return; }
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://127.0.0.1:5000"}/predict`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ readings: readings.map((r) => ({ air: r.air, dew: r.dew })) }),
      });
      if (!response.ok) throw new Error("Could not fetch prediction from backend.");
      const data = await response.json();
      setSortedResults(data.sorted_results || []); setHighest(data.highest || null); setPrediction(data.prediction || "");
    } catch (err) {
      setError("Failed to fetch. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = [...sortedResults].sort((a, b) => a.air_temp - b.air_temp);

  return (
    <div className="container">
      <h1 className="title">🌦️ Raincast</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-section">
          <label htmlFor="numReadings">Number of Readings:</label>
          <input id="numReadings" type="number" min="1" max="10" value={numReadings} onChange={handleNumChange} placeholder="e.g., 3"/>
        </div>
        {readings.length > 0 && (
          <>
            <div className="reading-inputs">
              {readings.map((reading, index) => (
                <div key={index} className="reading-row">
                  <h3>Reading {index + 1}</h3>
                  <div className="input-pair">
                    <input type="number" placeholder="Air (°C)" value={reading.air} onChange={(e) => handleInputChange(index, "air", e.target.value)}/>
                    <input type="number" placeholder="Dew (°C)" value={reading.dew} onChange={(e) => handleInputChange(index, "dew", e.target.value)}/>
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>{loading ? "Predicting..." : "Predict Rainfall"}</button>
          </>
        )}
        {error && <p className="error">{error}</p>}
      </form>

      {sortedResults.length > 0 && (
        <div className="result-section">
          <div className={`prediction-badge ${prediction.includes("High") ? "high" : "low"}`}>
            {prediction}
          </div>
          <div className="results-content">
            <div className="results-data">
              <h3>Humidity Readings</h3>
              <table>
                <thead>
                  <tr>
                    <th>Air Temp (°C)</th>
                    <th>Dew Point (°C)</th>
                    <th>Humidity (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((r, index) => (
                    <tr key={index} className={highest && r.relative_humidity === highest.relative_humidity ? "highlight" : ""}>
                      <td>{r.air_temp}</td>
                      <td>{r.dew_point}</td>
                      <td>{r.relative_humidity.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="results-chart">
              <h3>Humidity Trend</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  {/* THE ONLY CHANGE IS ON THE NEXT LINE: left margin is now 30 */}
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 30, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)"/>
                    <XAxis dataKey="air_temp" type="number" domain={['dataMin', 'dataMax']}>
                      <Label value="Air Temperature (°C)" offset={-15} position="insideBottom"/>
                    </XAxis>
                    <YAxis>
                      <Label value="Humidity (%)" angle={-90} position="insideLeft" style={{ textAnchor: "middle" }}/>
                    </YAxis>
                    <Tooltip />
                    <Line type="monotone" dataKey="relative_humidity" stroke={prediction.includes("High") ? "var(--primary-color)" : "#f39c12"} strokeWidth={3} dot={{ r: 5 }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RainfallForm;