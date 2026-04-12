from app import app
import os
from dotenv import load_dotenv

load_dotenv()

# Start the Flask application
PORT = int(os.getenv('PORT', 5000))
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=PORT, debug=True)
