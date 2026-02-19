from flask import Flask, request, jsonify
from feature_extractor import extract_features
import os
import subprocess
from flask_cors import CORS

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
    
    # Converting the Audio to mp3
    # subprocess.run(['ffmpeg', '-i', f'uploads/{filename}', f'uploads/mp3/{filename}.mp3'])
    
    # Extracting features
    features = extract_features(file.filename)

    print(features)
    
    # After Extracting Deleting the audio file from server
    os.remove(f'uploads/{filename}')
    # os.remove(f'uploads/mp3/{filename}.mp3')
  
    return jsonify({
      'Message': "File uploaded successfully",
      'Status Code': 200,
      'Success': True,
      'Data': features
    }), 200

