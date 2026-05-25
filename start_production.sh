#!/bin/bash
set -e
echo "==> Building frontend..."
cd /home/runner/workspace/frontend
npm run build
echo "==> Starting backend (serves API + frontend on port 5000)..."
cd /home/runner/workspace/backend
/home/runner/workspace/.venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 5000
