import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";

const Loader = ({ color = "white" }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "25%",
        left: "50%",
        transform: "translate(-50%, -10%)",
        zIndex: 99,        
      }}
    >
      <Waveform size="35" stroke="3.5" speed="1" color={color} />
      <p>Loading</p>
    </div>
  );
};

export default Loader;
