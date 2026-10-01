import subprocess
import sys
import time
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent.resolve()
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def main():
    print("=" * 60)
    print(" 🪦 STARTING PROJECT CEMETERY ")
    print("=" * 60)

    # 1. Start Backend
    print("\n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=str(BACKEND_DIR)
    )

    time.sleep(2)

    # 2. Start Frontend
    print("\n[2/2] Starting Vite Frontend on http://localhost:3000 ...")
    frontend_cmd = "npm run dev" if os.name != "nt" else "cmd.exe /c npm run dev"
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        shell=True,
        cwd=str(FRONTEND_DIR)
    )

    print("\n" + "=" * 60)
    print(" ⚡ PROJECT CEMETERY RUNNING ")
    print(" ➔ Frontend UI:  http://localhost:3000")
    print(" ➔ Backend API: http://127.0.0.1:8000/docs")
    print(" Press Ctrl+C to stop both servers.")
    print("=" * 60 + "\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down Project Cemetery servers...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
