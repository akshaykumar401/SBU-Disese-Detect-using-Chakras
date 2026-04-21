import { useState } from 'react';
import Recorder from '../components/Recorder.jsx';

const Predict = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-3">
          Thyroid Disease Prediction
        </h1>
        <p className="text-gray-500 text-lg">
          Record your audio to detect thyroid disease based on chakra properties.
        </p>
        <p className="text-gray-500 text-lg">
          Note: While we recording please don't move and speak clearly and Keep the mic close to your mouth while recording.
        </p>
        <p className="text-gray-500 text-lg">
          Speak: <span className="font-bold">"ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥"</span>.
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 md:p-10 border border-gray-100 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-2xl">
        <Recorder setData={setResult} endpoint="/api/predict" />
      </div>

      {/* Results Section */}
      {result && (
        <div className="mt-10 w-full bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 duration-500">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
              ✨ Prediction Results
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Status</span>
                <span className={`${result.is_thyroid ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'} px-3 py-1 font-bold rounded-full text-sm`}>
                  {result.is_thyroid ? 'Disease Detected' : 'No Disease Detected'}
                </span>
              </div>
              
              <div className="flex flex-col space-y-2 py-2">
                <span className="text-gray-500 font-medium">Details</span>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 font-mono text-sm text-gray-700 overflow-auto">
                  {result ? JSON.stringify(result, null, 2) : 'No specific data attributes returned from the model.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Predict;
