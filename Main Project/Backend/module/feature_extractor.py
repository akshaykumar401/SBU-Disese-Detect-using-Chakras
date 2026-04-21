import os
import logging
import numpy as np
import librosa

logger = logging.getLogger(__name__)

# Configure a base directory to prevent path traversal
BASE_UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads'))

def extract_features(filename: str) -> dict:
  """
  Extracts audio features using librosa from the specified file.
  
  Args:
    filename (str): Name of the audio file in the uploads directory.
      
  Returns:
    dict: Dictionary containing extracted audio features or None if processing fails.
  """
  try:
    # Prevent Path Traversal Vulnerability
    file_path = os.path.abspath(os.path.join(BASE_UPLOAD_DIR, filename))
    if not file_path.startswith(BASE_UPLOAD_DIR):
      raise ValueError("Invalid file path. Path traversal detected.")

    if not os.path.isfile(file_path):
      raise FileNotFoundError(f"Audio file {filename} not found at {file_path}.")

    # Safely opening the audio file
    with open(file_path, 'rb') as f:
      raw_audio = f.read()
    
    # Assumption: Audio is sampled at 16kHz
    SAMPLE_RATE = 16000
    
    # Converting raw audio bytes to numpy array safely
    # Handling potential ValueError if buffer length isn't a multiple of element size
    audio = np.frombuffer(raw_audio, dtype=np.int16)
    if audio.size == 0:
      raise ValueError("Audio file is empty or cannot be parsed as 16-bit PCM.")

    audio = audio.astype(np.float32) / 32768.0
    
    # Calculating RMS (Volume)
    volume_rms = np.sqrt(np.mean(audio ** 2))
    
    # Calculating Pitch (F0) using librosa's pyin
    # librosa.pyin may return all NaNs if no pitch is detected
    f0, _, _ = librosa.pyin(
      audio,
      fmin=80,
      fmax=400, 
      sr=SAMPLE_RATE,
      fill_na=np.nan
    )
    
    # Safely handle mean calculation if all values are NaN
    pitch_f0 = float(np.nanmean(f0)) if not np.all(np.isnan(f0)) else 0.0
    
    # Calculating Jitter (variability in pitch)
    diff_f0 = np.diff(f0)
    jitter = float(np.nanstd(diff_f0)) if not np.all(np.isnan(diff_f0)) else 0.0
    
    # Calculating Hoarseness (HNR)
    harmonic = librosa.effects.harmonic(audio)
    noise = audio - harmonic
    
    # Prevent Division by Zero with epsilon
    epsilon = 1e-10
    hnr = np.mean(harmonic ** 2) / (np.mean(noise ** 2) + epsilon)
    
    # Calculating Fatigue (Spectral Tilt)
    spec = np.abs(librosa.stft(audio))
    centroid = np.mean(librosa.feature.spectral_centroid(S=spec, sr=SAMPLE_RATE))
    
    return {
      "RMS": float(volume_rms) if not np.isnan(volume_rms) else 0.0,
      "Pitch_F0": pitch_f0,
      "Jitter": jitter,
      "Hoarseness_HNR": float(hnr) if not np.isnan(hnr) else 0.0,
      "Fatigue": float(centroid) if not np.isnan(centroid) else 0.0
    }
  except Exception as e:
    logger.error(f"Error extracting features from {filename}: {str(e)}")
    raise
