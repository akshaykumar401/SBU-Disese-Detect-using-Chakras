import { ReactMediaRecorder } from "react-media-recorder";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useRef, useState } from "react";
import axios from "axios";

export default function Recorder({ setData, endpoint }) {
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
        const response = await axios.post(endpoint, formData);
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
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-800">Smart Voice Recorder</h2>
        <p className="text-xs text-indigo-600 font-bold bg-indigo-50 py-1.5 px-4 rounded-full inline-block tracking-wide uppercase shadow-sm">
          AI Denoising Enabled
        </p>
      </div>

      <ReactMediaRecorder
        audio={{
          noiseSuppression: true,
          echoCancellation: true,
          autoGainControl: true,
        }}
        onStop={(blobUrl, blob) => denoiseAudio(blob)}
        render={({ status, startRecording, stopRecording }) => (
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 w-full flex flex-col items-center space-y-8 transition-all duration-300">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-widest">Status</span>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors duration-300 flex items-center gap-2 ${status === "recording"
                  ? "bg-red-50 text-red-500 animate-pulse border border-red-100"
                  : status === "stopped"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
              >
                {status === "recording" && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>}
                {status}
              </span>
            </div>

            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={() => { startRecording(); setData(null); }}
                disabled={status === "recording"}
                className={`flex-1 max-w-[140px] py-3.5 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${status === "recording"
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 active:scale-95"
                  }`}
              >
                <div className={`w-3 h-3 rounded-full bg-current ${status !== "recording" ? "animate-pulse" : ""}`}></div>
                Start
              </button>

              <button
                onClick={stopRecording}
                disabled={status !== "recording"}
                className={`flex-1 max-w-[140px] py-3.5 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${status !== "recording"
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-b from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 active:scale-95"
                  }`}
              >
                <div className="w-3 h-3 bg-current rounded-sm"></div>
                Stop
              </button>
            </div>
          </div>
        )}
      />

      {loading && (
        <div className="flex flex-col items-center space-y-4 p-6 bg-blue-50/80 rounded-2xl w-full border border-blue-100 shadow-sm animate-in fade-in duration-300">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-blue-700 font-semibold animate-pulse text-center">
            Processing Audio<br />
            <span className="text-sm font-medium text-blue-500">Applying AI noise reduction...</span>
          </p>
        </div>
      )}

      {cleanAudioUrl && (
        <div className="w-full bg-indigo-50/80 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            ✨ Cleaned Audio Ready
          </h3>

          <audio
            controls
            src={cleanAudioUrl}
            className="w-full h-12 outline-none rounded-full shadow-sm bg-white"
          />

          <a
            href={cleanAudioUrl}
            download="clean-audio.wav"
            className="w-full py-3.5 bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download High Quality WAV
          </a>
        </div>
      )}
    </div>
  );
}
