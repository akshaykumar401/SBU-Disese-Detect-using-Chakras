from flask import Flask, request, jsonify
from feature_extractor import extract_features
import os
from flask_cors import CORS

from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

# Start the Flask application
PORT = int(os.getenv('PORT', 5000))

@app.route('/')
def index():
  return jsonify({
    'Message': "Welcome to the Feature Extraction API",
    'Status Code': 200,
    'Success': True,
    'Data': None
  }), 200

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
    
    # After Extracting Deleting the audio file from server
    os.remove(f'uploads/{filename}')
  
    return jsonify({
      'Message': "File uploaded successfully",
      'Status Code': 200,
      'Success': True,
      'Data': features
    }), 200

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=PORT, debug=True)
 