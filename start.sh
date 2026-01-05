#!/bin/bash

# Production start script for Duplicate PDF Detector

echo "=========================================="
echo "Starting Duplicate PDF Detector Platform"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
mkdir -p source_pdfs final_pdfs logs

# Set environment variables for production
export FLASK_APP=app.py
export FLASK_ENV=production

# Start the application
echo ""
echo "Starting Flask application..."
echo "Access the application at: http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""

python3 app.py

