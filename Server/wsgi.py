import os
from dotenv import load_dotenv

# Limit underlying C-libraries threads to avoid huge memory spikes and CPU locks on Render
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
# Disable joblib multiprocessing to fix leaked semaphores warning
os.environ["JOBLIB_MULTIPROCESSING"] = "0"

load_dotenv()

from app import app
PORT = int(os.getenv('PORT', 5000))
if __name__ == '__main__':
  app.run(host='0.0.0.0', port=PORT, debug=True)
