import "./App.css";
import AudioRecorder from "./AudioRecorder.jsx";
import { useState, useEffect } from "react";
import Loader from "./components/Loaders.jsx";
import axios from "axios";

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // checking the user current state is light or dark mode
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  // useEffect for Changing the isDarkMode state...
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [isDarkMode]);


  // useEffect for Starting the Server...
  useEffect(() => {
    const startServer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}`);
        console.log(res.data);
      } catch (err) {
        console.error("Server error:", err);
      }
    }
    startServer();
  }, [])

  return (
    <>
      {isLoading && <Loader color={isDarkMode ? "white" : "black"} />}

      <div>
        {error && <div id="error">Error: {errorMessage}</div>}
        <AudioRecorder
          setResult={setResult}
          setError={setError}
          setErrorMessage={setErrorMessage}
          setIsLoading={setIsLoading}
        />

        {result && (
          <>
            <div id="result">
              <h2>Result:</h2>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>

            <table>
              <thead>
                <tr>
                  <td>Feature</td>
                  <td>Value</td>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.Data).map(([feature, value]) => (
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
    </>
  );
}

export default App;
