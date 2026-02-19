import "./App.css";
import AudioRecorder from "./AudioRecorder.jsx";
import { useState } from "react";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div>
      <AudioRecorder setResult={setResult} />

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
