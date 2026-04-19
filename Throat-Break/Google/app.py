from flask import Flask, jsonify, request
from google_sheets import insert_row
app = Flask(__name__)


@app.route('/')
def home():
  return jsonify({
    'Message': "Welcome to the Google Sheets API",
    'Status Code': 200,
    'Success': True,
    'Data': None
  }), 200

@app.route('/enter-data', methods=['POST'])
def enter_data():
  RMS = request.form.get("RMS")
  Pitch_F0 = request.form.get("Pitch_F0")
  Jitter = request.form.get("Jitter")
  Hoarseness_HNR = request.form.get("Hoarseness_HNR")
  Fatigue = request.form.get("Fatigue")

  try:
    insert_row([RMS, Pitch_F0, Jitter, Hoarseness_HNR, Fatigue])
  except Exception as e:
    return jsonify({
      'Message': "Data Not Inserted",
      'Status Code': 500,
      'Success': False,
      'Data': None
    }), 500

  return jsonify({
    'Message': "Data Inserted Successfully",
    'Status Code': 200,
    'Success': True,
    'Data': None
  })

 