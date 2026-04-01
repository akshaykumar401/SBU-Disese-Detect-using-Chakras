import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
  // Method for starting the Render free server...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/apii`);
        console.log("Response data:", response.data.message);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-md p-4 flex justify-center gap-6">
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