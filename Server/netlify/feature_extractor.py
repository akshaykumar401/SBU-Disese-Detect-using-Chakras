import numpy as np
import librosa

def extract_features(filename):
  # Opening the audio file
  audio = open(f'netlify/uploads/mp3/{filename}.mp3', 'rb').read()
  
  # Assumption: Audio is sampled at 16kHz
  SAMPLE_RATE = 16000
  
  # Converting raw audio bytes to numpy array
  audio = np.frombuffer(audio, dtype=np.int16)
  audio = audio.astype(np.float32) / 32768.0
  
  # Calculating RMS (Volume)
  volume_rms = np.sqrt(np.mean(audio ** 2))
  
  # Calculating Pitch (F0) using librosa's pyin
  f0, voiced, _ = librosa.pyin(
    audio,
    fmin=80,
    fmax=400, 
    sr=SAMPLE_RATE
  )
  pitch_f0 = np.nanmean(f0)
  
  # Calculating Jitter (variability in pitch)
  diff_f0 = np.diff(f0)
  jitter = np.nanstd(diff_f0)
  
  # Calculating Hoarseness (HNR)
  harmonic = librosa.effects.harmonic(audio)
  noise = audio - harmonic
  hnr = np.mean(harmonic ** 2) / np.mean(noise ** 2)
  
  # Calculating Fatigue (Spectral Tilt)
  spec = np.abs(librosa.stft(audio))
  centroid = np.mean(librosa.feature.spectral_centroid(S=spec))
  
  return {
    "RMS": float(volume_rms),
    "Pitch_F0": float(pitch_f0),
    "Jitter": float(jitter),
    "Hoarseness_HNR": float(hnr),
    "Fatigue": float(centroid)
  }

