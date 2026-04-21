import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [isStart, setIsStart] = useState(false);

  // Method for starting the Render free server...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/apii`);
        if (response.status === 200) {
          try {
            const res = await axios.get(`/api`);
            if (res.status === 200) {
              setIsStart(true);
            }
          } catch (error) {
            setIsStart(false);
            console.log("ERROR: ", error)
          }
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
        <div className={`w-24 h-10 text-center pt-2 rounded-xl ${isStart ? "bg-green-600" : "bg-red-600"}`}>
          status
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