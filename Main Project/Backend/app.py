import os
import logging
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

from module.feature_extractor import extract_features
from module.google_sheets import insert_row

# Attempt to load CORS if available (useful for React frontend integration)
try:
  from flask_cors import CORS
except ImportError:
  CORS = None

# Initialize logging
logging.basicConfig(
  level=logging.INFO,
  format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)

# Enable CORS if the library is installed
if CORS:
  CORS(app)

# Configuration
PORT = int(os.environ.get('PORT', 8000))
# Ensure DEBUG is False for production
DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
# Allowed audio extensions
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'ogg', 'flac'}

# Ensure upload directory exists before any request
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
  return '.' in filename and \
       filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
  """Health check endpoint"""
  return jsonify({
    "message": "API is running successfully",
    "data": {},
    "status": 200,
    "success": True
  }), 200

@app.route('/record', methods=['POST'])
def record():
  """Process uploaded audio to extract features and insert into to Google Sheets."""
  try:
    # Check if the audio file is present in the request
    if 'audio' not in request.files:
      logger.warning("No audio file part in request.")
      return jsonify({
        'message': "No audio file provided",
        'status_code': 400,
        'success': False,
        'data': None
      }), 400

    file = request.files['audio']
    
    # Check if user selected a file
    if file.filename == '':
      logger.warning("No file selected.")
      return jsonify({
        'message': "No selected file",
        'status_code': 400,
        'success': False,
        'data': None
      }), 400

    # Validate file type
    if file and allowed_file(file.filename):
      # secure_filename prevents Directory Traversal Attacks
      filename = secure_filename(file.filename)
      filepath = os.path.join(UPLOAD_FOLDER, filename)
      
      # Save the file temporarily
      file.save(filepath)
      logger.info(f"File {filename} saved successfully.")

      features = None
      try:
        # Assuming extract_features might fail, handle the error gracefully
        features = extract_features(filename)
        
        if features is None:
          raise ValueError("Feature extraction returned None.")

        # Map extracted features; use .get() to avoid KeyError if models change
        row_data = [
          features.get('RMS', ''), 
          features.get('Pitch_F0', ''), 
          features.get('Jitter', ''), 
          features.get('Hoarseness_HNR', ''), 
          features.get('Fatigue', '')
        ]
        
        insertion_success = insert_row(row_data)
        if not insertion_success:
          logger.error("Failed to insert row into Google Sheets.")

        logger.info(f"Features extracted successfully for {filename}")
        
      finally:
        # Cleanup: Always delete audio file from server even if feature extraction fails
        if os.path.exists(filepath):
          os.remove(filepath)
          logger.info(f"Cleaned up file {filepath}")

      if features:
        return jsonify({
          'message': "Feature Extracted Successfully",
          'status_code': 200,
          'success': True,
          'data': features
        }), 200
      else:
        return jsonify({
          'message': "Failed to extract features",
          'status_code': 500,
          'success': False,
          'data': None
        }), 500
        
    else:
      logger.warning(f"Invalid file type attempt: {file.filename}")
      return jsonify({
        'message': "Invalid file type. Allowed: wav, mp3, ogg, flac",
        'status_code': 400,
        'success': False,
        'data': None
      }), 400

  except Exception as e:
    logger.error(f"Error processing record request: {str(e)}", exc_info=True)
    return jsonify({
      'message': "Internal server error occurred while processing the request",
      'status_code': 500,
      'success': False,
      'data': None
    }), 500

@app.route('/predict', methods=['POST'])
def predict():
  """Predict thyroid disease from uploaded audio file."""
  try:
    if 'audio' not in request.files:
      logger.warning("No audio file part in request.")
      return jsonify({
        'message': "No audio file provided", 
        'status_code': 400, 
        'success': False, 
        'data': None
      }), 400

    file = request.files['audio']
    if file.filename == '':
      logger.warning("No file selected.")
      return jsonify({
        'message': "No selected file",
        'status_code': 400, 
        'success': False, 
        'data': None
      }), 400

    if file and allowed_file(file.filename):
      filename = secure_filename(file.filename)
      filepath = os.path.join(UPLOAD_FOLDER, filename)
      file.save(filepath)
      logger.info(f"File {filename} saved successfully for prediction.")

      features = None
      try:
        features = extract_features(filename)
        if features is None:
          raise ValueError("Feature extraction returned None.")
        
        # TODO: Make the ML model predict the disease...

        # This is just DUMP logic for now -> true means disease detected -> false means no disease detected
        features['is_thyroid'] = bool(features.get('Jitter', 0) > 3.0) 

      finally:
        if os.path.exists(filepath):
          os.remove(filepath)
          logger.info(f"Cleaned up file {filepath}")

      if features:
        return jsonify({
          'message': "Prediction completed Successfully",
          'status_code': 200,
          'success': True,
          'data': features
        }), 200
      else:
        return jsonify({
          'message': "Failed to extract features", 
          'status_code': 500, 
          'success': False, 
          'data': None
        }), 500
        
    else:
      logger.warning(f"Invalid file type attempt: {file.filename}")
      return jsonify({
        'message': "Invalid file type. Allowed: wav, mp3, ogg, flac", 
        'status_code': 400, 
        'success': False, 
        'data': None
      }), 400

  except Exception as e:
    logger.error(f"Error processing predict request: {str(e)}", exc_info=True)
    return jsonify({
      'message': "Internal server error occurred", 
      'status_code': 500, 
      'success': False, 
      'data': None
    }), 500

if __name__ == '__main__':
  # Using Waitress or Gunicorn is highly recommended for actual production hosting!
  logger.info(f"Starting server on port {PORT} | Debug Mode: {DEBUG}")
  app.run(host='0.0.0.0', port=PORT, debug=DEBUG)