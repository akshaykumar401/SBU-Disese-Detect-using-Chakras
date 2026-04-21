import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api`);
        if (response.status === 200) {
          setIsStart(true);
        }
      } catch (error) {
        setIsStart(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-md p-4 flex justify-center gap-6">
        <div 
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-sm transition-all duration-300 border ${
            isStart 
              ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
              : "bg-rose-50 text-rose-600 border-rose-200"
          }`}
          title={isStart ? "Backend is connected" : "Backend is disconnected"}
        >
          <div className="relative flex h-3 w-3">
            {isStart && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              isStart ? "bg-emerald-500" : "bg-rose-500"
            }`}></span>
          </div>
          {isStart ? "API Online" : "API Offline"}
        </div>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Predict
        </Link>
        <Link
          to="/recording-audio"
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Record
        </Link>
      </nav>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default App