import { useState } from "react";
import Recorder from "../components/Recorder.jsx";

const RecordingAudioPage = () => {
  const [data, setData] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col items-center min-h-[80vh]">
      <div className="w-full text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
          Audio Analysis
        </h1>
        <p className="text-gray-500 text-lg">
          Record your audio to detect diseases based on chakra properties.
        </p>
      </div>
      
      <div className="w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-10 mb-10 border border-gray-100 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl">
        <Recorder setData={setData} endpoint="/apii/upload" />
      </div>

      {data && data.Data && (
        <div className="w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800">Extracted Features & Predictions</h2>
            <p className="text-sm text-gray-500 mt-1">Found {Object.keys(data.Data).length} data points from the audio sample</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-400 uppercase text-xs font-semibold tracking-wider">
                  <th className="py-4 px-6 border-b border-gray-100">Feature</th>
                  <th className="py-4 px-6 border-b border-gray-100">Value</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {Object.entries(data.Data).map(([feature, value], index) => (
                  <tr 
                    key={feature} 
                    className={`transition-colors duration-200 hover:bg-indigo-50/30 ${
                      index !== Object.keys(data.Data).length - 1 ? 'border-b border-gray-50' : ''
                    } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="py-4 px-6 font-medium text-gray-700 whitespace-nowrap">
                      {feature.replace(/_/g, ' ')}
                    </td>
                    <td className="py-4 px-6 font-mono text-indigo-600">
                      {typeof value === 'number' && !Number.isInteger(value) 
                        ? value.toFixed(4) 
                        : value.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingAudioPage;