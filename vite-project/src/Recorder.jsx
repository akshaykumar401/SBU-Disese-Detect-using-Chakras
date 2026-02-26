import { ReactMediaRecorder } from "react-media-recorder";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useRef, useState } from "react";
import axios from "axios";
import "./App.css";

export default function Recorder({ setData }) {
  const [cleanAudioUrl, setCleanAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const ffmpegRef = useRef(new FFmpeg());

  // Load FFmpeg once
  const loadFFmpeg = async () => {
    console.log("Loading FFmpeg...");
    await ffmpegRef.current.load();
    console.log("FFmpeg Loaded!");
  };

  // Run noise reduction
  const denoiseAudio = async (blob) => {
    try {
      setLoading(true);

      await loadFFmpeg();

      const ffmpeg = ffmpegRef.current;

      // Write input file
      await ffmpeg.writeFile("input.webm", await fetchFile(blob));

      // Apply noise reduction filter
      await ffmpeg.exec([
        "-i",
        "input.webm",
        "-af",
        "afftdn", // FFT Denoise
        "output.wav",
      ]);

      // Read output
      const data = await ffmpeg.readFile("output.wav");

      const cleanBlob = new Blob([data.buffer], {
        type: "audio/wav",
      });

      const url = URL.createObjectURL(cleanBlob);
      setCleanAudioUrl(url);

      // sending the audio file to the server
      const formData = new FormData();
      formData.append("audio", cleanBlob, "clean-audio.wav");

      try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/upload`, formData);
        setData(response.data);
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    } catch (err) {
      console.error("FFmpeg error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Audio Recorder with Noise Reduction</h2>

      <ReactMediaRecorder
        audio={{
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        }}
        onStop={(blobUrl, blob) => denoiseAudio(blob)}
        render={({ status, startRecording, stopRecording }) => (
          <div>
            <p>Status: {status}</p>

            <button onClick={startRecording}>Start</button>
            <button onClick={stopRecording}>Stop</button>
          </div>
        )}
      />

      {loading && <p>Processing audio...</p>}

      {cleanAudioUrl && (
        <div>
          <h3>Cleaned Audio</h3>

          <audio controls src={cleanAudioUrl} />

          <br />

          <a href={cleanAudioUrl} download="clean-audio.wav">
            Download
          </a>
        </div>
      )}
    </div>
  );
}
