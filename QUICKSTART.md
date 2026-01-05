# Quick Start Guide

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

Or use pip3:
```bash
pip3 install -r requirements.txt
```

## Step 2: Add Your PDFs

Place all PDF files you want to check in the `source_pdfs` folder:

```bash
# Copy your PDFs to the source folder
cp /path/to/your/pdfs/*.pdf source_pdfs/
```

## Step 3: Run the Detector

### Option 1: Using Python directly
```bash
python3 duplicate_pdf_detector.py
```

### Option 2: Using the run script
```bash
./run.sh
```

### Option 3: With custom folders
```bash
python3 duplicate_pdf_detector.py --source /path/to/source --final /path/to/final
```

## Step 4: Check Results

- **Unique PDFs**: Check the `final_pdfs` folder
- **Logs**: Check the `logs` folder for detailed information
- **Duplicates**: Automatically removed from source folder

## What Happens?

1. The script scans all PDFs in `source_pdfs` folder
2. Compares PDF content using SHA-256 hashing
3. Identifies duplicates (PDFs with identical content)
4. Removes duplicate PDFs (keeps only one copy)
5. Moves all unique PDFs to `final_pdfs` folder
6. Creates detailed logs in `logs` folder

## Example Output

```
============================================================
Starting Duplicate PDF Detection Process
============================================================
Scanning folder: source_pdfs
Found 10 PDF files
Processing: document1.pdf
Processing: document2.pdf
...
Found 2 groups of duplicate PDFs
Unique PDFs: 6
Duplicate PDFs to remove: 4
Moving unique PDFs to final folder...

============================================================
Process Summary
============================================================
Total PDFs processed: 10
Unique PDFs: 6
Duplicates found: 4
Duplicates removed: 4
Errors encountered: 0
Final folder: final_pdfs
============================================================
```

## Troubleshooting

- **"No module named 'PyPDF2'"**: Run `pip install -r requirements.txt`
- **"Source folder does not exist"**: Create the `source_pdfs` folder or specify a different path
- **Permission errors**: Check folder permissions

