import React, { useState, useEffect } from "react";
import axios from "axios";
import RecordingAudioPage from "./Pages/RecordingAudioPage.jsx"

const App = () => {
  const [data, setData] = useState(null);

  // Method for starting the Render free server...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/apii");
        console.log("Response data:", response.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <RecordingAudioPage />
    </>
  );
};

export default App;
