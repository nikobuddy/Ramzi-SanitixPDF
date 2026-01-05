#!/bin/bash

# Duplicate PDF Detector - Run Script
# This script makes it easy to run the duplicate PDF detector

echo "=========================================="
echo "Duplicate PDF Detector"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if dependencies are installed
if ! python3 -c "import PyPDF2" &> /dev/null; then
    echo "Installing dependencies..."
    pip3 install -r requirements.txt
fi

# Run the detector
echo "Starting duplicate PDF detection..."
echo ""
python3 duplicate_pdf_detector.py "$@"

echo ""
echo "Process completed! Check the final_pdfs folder for unique PDFs."

