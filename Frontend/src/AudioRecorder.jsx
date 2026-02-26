import { useRef, useState } from "react";

function AudioRecorder({ setResult, setError, setErrorMessage, setIsLoading }) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);

  /* ==========================
      Start Recording
  ========================== */
  const startRecording = async () => {
    try {
      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      // Create recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Save chunks
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // When stop → upload
      mediaRecorder.onstop = handleStop;

      mediaRecorder.start();

      setIsRecording(true);
      setError(false);
      setErrorMessage("");
    } catch (err) {
      console.error("Mic error:", err);
      setError(true);
      setErrorMessage("Microphone permission denied");
      alert("Microphone permission denied");
    }
  };

  /* ==========================
      Stop Recording
  ========================== */
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();

    // Turn off mic
    streamRef.current?.getTracks().forEach((t) => t.stop());

    setIsRecording(false);
  };

  /* ==========================
      Send To Backend
  ========================== */
  const handleStop = async () => {
    const blob = new Blob(chunksRef.current, {
      type: "audio/webm",
    });

    // Preview
    const url = URL.createObjectURL(blob);
    setAudioURL(url);

    // Upload
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");

    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
      setError(false);
      setErrorMessage("");
      setIsLoading(false);
    } catch (err) {
      setError(true);
      setIsLoading(false);
      setResult(null);
      setErrorMessage("Audio is Not Processed");
      console.error("Upload failed:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Audio Recorder</h2>

      {!isRecording ? (
        <button onClick={startRecording}>🎙 Start</button>
      ) : (
        <button onClick={stopRecording}>⏹ Stop</button>
      )}

      {audioURL && (
        <div>
          <h4>Preview:</h4>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
