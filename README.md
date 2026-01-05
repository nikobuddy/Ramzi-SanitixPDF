# Duplicate PDF Detector

A Python-based platform for detecting and removing duplicate PDF files based on content comparison. This tool scans a folder of PDFs, identifies duplicates by comparing their content, removes duplicates, and moves unique PDFs to a final folder.

## Features

- **Content-based duplicate detection**: Compares PDFs by their actual content, not just filenames
- **Automatic duplicate removal**: Keeps one copy of each unique PDF and removes duplicates
- **Organized output**: Moves unique PDFs to a dedicated final folder
- **Comprehensive logging**: Detailed logs of all operations
- **Error handling**: Robust error handling for corrupted or unreadable PDFs
- **Statistics**: Provides summary statistics of the process

## Installation

1. Clone or download this repository

2. Install required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

1. Place all PDF files you want to check in a folder (e.g., `source_pdfs`)

2. Run the script:
```bash
python duplicate_pdf_detector.py
```

By default, the script will:
- Look for PDFs in the `source_pdfs` folder
- Move unique PDFs to the `final_pdfs` folder
- Save logs in the `logs` folder

### Custom Folders

You can specify custom folders using command-line arguments:

```bash
python duplicate_pdf_detector.py --source /path/to/source --final /path/to/final --logs /path/to/logs
```

### Arguments

- `--source`: Source folder containing PDFs to check (default: `source_pdfs`)
- `--final`: Final folder where unique PDFs will be moved (default: `final_pdfs`)
- `--logs`: Folder for log files (default: `logs`)

## How It Works

1. **Scanning**: The script scans the source folder for all PDF files
2. **Hashing**: Each PDF's content is hashed using SHA-256
3. **Grouping**: PDFs with identical hashes are grouped together
4. **Duplicate Detection**: Groups with more than one PDF are identified as duplicates
5. **Removal**: All but one PDF from each duplicate group is deleted
6. **Moving**: Unique PDFs are moved to the final folder

## Folder Structure

```
duplicate-pdf-detactore/
├── duplicate_pdf_detector.py  # Main script
├── requirements.txt            # Dependencies
├── README.md                   # This file
├── source_pdfs/                # Place your PDFs here (created automatically)
├── final_pdfs/                 # Unique PDFs will be moved here (created automatically)
└── logs/                       # Log files will be saved here (created automatically)
```

## Example

```bash
# 1. Place PDFs in source_pdfs folder
# 2. Run the script
python duplicate_pdf_detector.py

# Output:
# Processing: document1.pdf
# Processing: document2.pdf
# Processing: document3.pdf
# Found 1 groups of duplicate PDFs
# Unique PDFs: 2
# Duplicate PDFs to remove: 1
# Moving unique PDFs to final folder...
```

## Logging

The script creates detailed log files in the `logs` folder with timestamps. Each log file includes:
- All PDFs processed
- Duplicates found and removed
- Errors encountered
- Final statistics

## Notes

- The script compares PDFs based on their binary content hash
- PDFs with identical content (even if filenames differ) will be considered duplicates
- The first PDF (alphabetically) in each duplicate group is kept
- If a PDF with the same name already exists in the final folder, a number suffix is added
- The script handles both `.pdf` and `.PDF` file extensions

## Requirements

- Python 3.6 or higher
- PyPDF2 library

## Troubleshooting

- **No PDFs found**: Make sure PDFs are in the source folder and have `.pdf` or `.PDF` extension
- **Permission errors**: Ensure you have read/write permissions for the folders
- **Corrupted PDFs**: The script will log errors for corrupted PDFs and continue processing others

## License

This project is open source and available for use.

