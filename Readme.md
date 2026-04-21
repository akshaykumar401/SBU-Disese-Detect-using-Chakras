# Thyroid detection using Throat Chakra

A web-based application designed to analyze human voice features—symbolically linked to the throat chakra in historical medicine paradigms—and automatically detect early signs of Thyroid-related diseases using audio signal processing.

The project is structured into two main parts: a **React + Vite Frontend** for seamless user interaction and audio recording, and a robust **Python Flask Backend** for executing deep audio feature extraction utilizing Librosa.

## 🚀 Features

- **In-Browser Audio Recording:** Real-time microphone audio capture and direct file uploading.
- **Audio Processing Engine:** Computes fundamental vocal indicators used by vocal cord diagnostics:
  - **RMS (Volume)**
  - **Pitch (F0)**
  - **Jitter**
  - **Hoarseness (HNR)**
  - **Vocal Fatigue / Spectral Centroid**
- **Google Sheets Integration:** Automatically synchronizes extracted data into a Google Sheet instance for data persistence and audit trails.
- **Microservice Architecture:** Clean separation of frontend UI from backend prediction components allowing for easy ML model integrations.

---

## 🛠️ Tech Stack

**Frontend Framework**
- **React.js** (Vite Bootstrapper)
- **Tailwind CSS** (Styling & Responsiveness)
- **Axios** (API communication)

**Backend Architecture**
- **Python 3**
- **Flask & Flask-CORS** (REST API)
- **Librosa & NumPy** (Audio Signal Processing)
- **gspread & oauth2client** (Google API Interface)

---

## 🧩 Getting Started

Follow these steps to get the full stack up and running locally.

### 1. Backend Setup

The backend handles the `/record` and `/predict` routes, actively transforming user audio into readable feature coordinates.

```bash
# Navigate to the backend directory
cd "Main Project/Backend"

# Create a virtual environment and activate it 
# (For Windows: .\env\Scripts\activate)
python -m venv env
source env/bin/activate

# Install the Python dependencies
pip install -r requirements.txt

# Environment Setup
# Create a .env file locally (refer to .env.sample)
# Ensure you specify PORT, UPLOAD_FOLDER, and GOOGLE_CREDENTIALS_PATH
# Place the relevant GCP credentials JSON inside the appropriate folder.

# Run the Flask Server
python app.py
```
> The backend server will start locally at http://127.0.0.1:8000.

### 2. Frontend Setup

The frontend serves as the main interactive page allowing dynamic data collection.

```bash
# Navigate to the frontend directory
cd "Main Project/Frontend"

# Install node dependencies
npm install

# Start the Vite development server
npm run dev
```
> The application UI should now be accessible on http://localhost:5173. The proxy is pre-configured to communicate internally with the `8000` port of the backend.

---

## 🏗️ Structure Overview

```text
📁 Main Project
├── 📁 Backend/
│   ├── app.py                     # Main Flask routing and request handling
│   ├── .env                       # Environment variables
│   ├── requirements.txt           # Python dependencies
│   ├── 📁 module/
│   │   ├── feature_extractor.py   # Librosa logic (RMS, Pitch, Jitter, etc.)
│   │   └── google_sheets.py       # Wrapper to insert rows safely to GCP
│   └── 📁 uploads/                # Secure temporary vault for audio uploads
└── 📁 Frontend/
    ├── vite.config.js             # React environment & setup (Server Proxy attached)
    ├── 📁 src/
    │   ├── 📁 components/         # Reusable structural components (like Recorder.jsx)
    │   ├── 📁 pages/              # Main routes (RecordingAudioPage.jsx)
    │   ├── 📁 styles/             # Global styles (index.css)
    │   ├── App.jsx                 # Main application component
    │   └── main.jsx                # Main entry point
    └── package.json               # Package Manifest
```

---

## 📈 Future Expansions

- **Predictive ML Endpoint:** The `/predict` backend endpoint currently prepares feature formatting; ready for substituting in a Pickled/Joblib Trained Classifier to return precise binary `is_thyroid` decisions.
- **Patient Dashboard:** Adding visualizations using Chart.js bridging existing historical data stored inside the Google Sheets.


