import "./App.css";
import AudioRecorder from "./AudioRecorder.jsx";
import { useState } from "react";

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div>
      {error && <div id="error">Error: {errorMessage}</div>}
      <AudioRecorder
        setResult={setResult}
        setError={setError}
        setErrorMessage={setErrorMessage}
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
  );
}

export default App;
