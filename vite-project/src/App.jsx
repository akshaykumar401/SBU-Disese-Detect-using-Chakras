import React, { useState, useEffect } from "react";
import Recorder from "./Recorder.jsx";
import axios from "axios";
import "./App.css";

const App = () => {
  const [data, setData] = useState(null);

  // Method for starting the Render free server...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}`);
        console.log("Response data:", response.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
      }}
    >
      <Recorder setData={setData} />
      {data && (
        <>
          <table>
            <thead>
              <tr>
                <td>Feature</td>
                <td>Value</td>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.Data).map(([feature, value]) => (
                <tr key={feature}>
                  <td>{feature}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default App;
