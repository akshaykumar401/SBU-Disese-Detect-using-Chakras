import os
import logging
from typing import List, Any
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

load_dotenv()

# Global variable to cache the sheet instance
_sheet_instance = None

def get_sheet() -> gspread.Worksheet:
  """
  Authenticate and return the Google Sheet instance.
  Uses cached instance if available.
  """
  global _sheet_instance
  if _sheet_instance is not None:
    return _sheet_instance

  try:
    scope = [
      "https://spreadsheets.google.com/feeds",
      "https://www.googleapis.com/auth/drive"
    ]

    credential_path = os.environ.get(
      'GOOGLE_CREDENTIALS_PATH', 
      'creadential/mini-project-credential.json'
    )
    
    if not os.path.exists(credential_path):
      logger.error(f"Credential file not found at: {credential_path}")
      raise FileNotFoundError(f"Google Sheet credentials missing: {credential_path}")

    creds = ServiceAccountCredentials.from_json_keyfile_name(credential_path, scope)
    client = gspread.authorize(creds)
    
    sheet_id = os.environ.get('SHEET_ID')
    if not sheet_id:
      logger.error("SHEET_ID environment variable is not set.")
      raise ValueError("SHEET_ID environment variable is required.")

    _sheet_instance = client.open_by_key(sheet_id).sheet1
    logger.info("Successfully authenticated and connected to Google Sheet.")
    return _sheet_instance

  except Exception as e:
    logger.error(f"Failed to initialize Google Sheet: {str(e)}")
    raise

def insert_row(data: List[Any]) -> bool:
  """
  Insert a row of data into the Google Sheet.
  
  Args:
    data: A list of values representing a single row.
      
  Returns:
    bool: True if successful, False otherwise.
  """
  try:
    sheet = get_sheet()
    sheet.append_row(data)
    logger.info("Successfully inserted row into Google Sheet.")
    return True
  except Exception as e:
    logger.error(f"Failed to insert row into Google Sheet: {str(e)}")
    # In case of auth error or token expiration, clear cache to retry connection next time
    global _sheet_instance
    _sheet_instance = None
    return False

