import React, { useState } from "react";
import Recorder from "./Recorder.jsx";

const App = () => {
  const [data, setData] = useState(null);

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
