#!/bin/bash
cd /home/runner/workspace/backend
/home/runner/workspace/.venv/bin/python -m uvicorn main:app --host localhost --port 8000 --reload
