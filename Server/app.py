from flask import Flask, request, jsonify
from feature_extractor import extract_features
import os
from flask_cors import CORS
from google_sheets import insert_row

app = Flask(__name__)
CORS(app, origins="*")

@app.route('/')
def index():
  return jsonify({'message': 'Hello, World!'})

# Route for collecting audio file from the client and saving it to the server
@app.route('/upload', methods=['POST'])
def upload():
  # Checking is the audio file is present in the request
  if 'audio' not in request.files:
    return jsonify({
      'Message': "No audio file part in the request",
      'Status Code': 401,
      'Success': False,
      'Data': None
    }), 401

  # Get the audio file from the request
  file = request.files['audio']
  if file.filename == '':
    return jsonify({
      'Message': "No selected file",
      'Status Code': 400,
      'Success': False,
      'Data': None
    }), 400

  # Save the audio file to the server
  if file:
    filename = file.filename
    file.save(f'uploads/{filename}')
    
    # Extracting features
    features = extract_features(file.filename)
    try:
      insert_row([features['RMS'], features['Pitch_F0'], features['Jitter'], features['Hoarseness_HNR'], features['Fatigue']])
    except Exception as e:
      print(e)
    
    # After Extracting Deleting the audio file from server
    os.remove(f'uploads/{filename}')
  
    return jsonify({
      'Message': "File uploaded successfully",
      'Status Code': 200,
      'Success': True,
      'Data': features
    }), 200

# Predect Route
@app.route('/predict', methods=['POST'])
def predict():
  # Checking is the audio file is present in the request
  if 'audio' not in request.files:
    return jsonify({
      'Message': "No audio file part in the request",
      'Status Code': 401,
      'Success': False,
      'Data': None
    }), 401

  # Get the audio file from the request
  file = request.files['audio']
  if file.filename == '':
    return jsonify({
      'Message': "No selected file",
      'Status Code': 400,
      'Success': False,
      'Data': None
    }), 400
  
  # Save the audio file to the server
  if file:
    filename = file.filename
    file.save(f'uploads/{filename}')
    
    # Extracting features
    features = extract_features(file.filename)    
    # After Extracting Deleting the audio file from server
    os.remove(f'uploads/{filename}')

    # appending result in features
    features['status'] = False
    features['details'] = 'No Disease Detected'
  
    return jsonify({
      'Message': "Predected Result",
      'Status Code': 200,
      'Success': True,
      'Data': features
    }), 200