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
      <AudioRecorder setResult={setResult} setError={setError} setErrorMessage={setErrorMessage}/>
      <br />
      <br />
      {result && (
        <div>
          <p>The result is:{typeof result}</p>
          <p>The result is:{result}</p>
        </div>
      )}

      {result && (
        <table>
          <thead>
            <tr>
              <td>Feature</td>
              <td>Value</td>
            </tr>
          </thead>
          <tbody>
            {Object.entries(result).map(([feature, value]) => (
              <tr key={feature}>
                <td>{feature}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
