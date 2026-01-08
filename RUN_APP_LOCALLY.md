# 🚀 Running SanitixPDF Locally on Your PC

This guide will help you run the SanitixPDF web application (`app.py`) on your local computer.

---

## 📋 Prerequisites

Before running the application, make sure you have:

1. **Python 3.8 or higher** installed
   - Check your version: `python3 --version` or `python --version`
   - Download from: https://www.python.org/downloads/

2. **pip** (Python package installer)
   - Usually comes with Python
   - Check: `pip3 --version` or `pip --version`

---

## 🔧 Step 1: Install Dependencies

### Option A: Using Virtual Environment (Recommended)

1. **Open Terminal/Command Prompt**
   - **Windows**: Press `Win + R`, type `cmd`, press Enter
   - **Mac/Linux**: Open Terminal application

2. **Navigate to the project directory**
   ```bash
   cd /path/to/duplicate-pdf-detactore
   ```

3. **Create a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   
   # Mac/Linux
   python3 -m venv venv
   ```

4. **Activate the virtual environment**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

5. **Install required packages**
   ```bash
   pip install -r requirements.txt
   ```

   **Expected output**: You should see packages being installed (Flask, PyPDF2, etc.)

### Option B: Direct Installation (Not Recommended)

If you prefer not to use a virtual environment:

```bash
pip3 install -r requirements.txt
```

**Note**: On some systems, you may need to use `pip3 install --user -r requirements.txt`

---

## 📁 Step 2: Prepare Your PDF Files

1. **Create or locate the `source_pdfs` folder**
   - The folder should be in the project root directory
   - If it doesn't exist, create it:
     ```bash
     mkdir source_pdfs
     ```

2. **Add PDF files to scan**
   - Copy or move your PDF files into the `source_pdfs` folder
   - The application will scan this folder for duplicates

---

## 🎯 Step 3: Run the Application

### Option A: Using Python directly

1. **Make sure virtual environment is activated** (if using one)
   ```bash
   # Mac/Linux
   source venv/bin/activate
   
   # Windows
   venv\Scripts\activate
   ```

2. **Start the Flask application**
   ```bash
   python3 app.py
   ```
   
   Or if `python3` doesn't work:
   ```bash
   python app.py
   ```

2. **You should see output like:**
   ```
   * Running on http://127.0.0.1:5000
   * Running on http://0.0.0.0:5000
   ```

### Option B: Using Flask command (Alternative)

```bash
export FLASK_APP=app.py
flask run
```

---

## 🌐 Step 4: Access the Web Interface

1. **Open your web browser**

2. **Navigate to:**
   ```
   http://localhost:8080
   ```
   or
   ```
   http://127.0.0.1:8080
   ```
   
   **Note**: The default port is now **8080** (instead of 5000) to avoid conflicts with macOS AirPlay Receiver. If you see a different port in the terminal output, use that port instead.

3. **You should see the SanitixPDF dashboard!**

---

## 📊 Using the Web Interface

### Upload PDFs
1. Click "Upload PDF" or drag and drop PDF files
2. Files will be uploaded to the `source_pdfs` folder

### Process Duplicates
1. Click the "Process Duplicates" button
2. Watch the progress bar as it scans for duplicates
3. Results will show:
   - Total PDFs processed
   - Unique PDFs found
   - Duplicates detected and removed

### View Results
- **Source PDFs**: View all PDFs in the source folder
- **Final PDFs**: View unique PDFs after duplicate removal
- **Download**: Click on any PDF to download it

---

## 🔍 Command Line Alternative: Direct Duplicate Detection

If you prefer to run duplicate detection directly from the command line (without the web interface):

1. **Activate virtual environment** (if using one)
   ```bash
   source venv/bin/activate  # Mac/Linux
   # or
   venv\Scripts\activate     # Windows
   ```

2. **Run the duplicate detector**
   ```bash
   python3 duplicate_pdf_detector.py --source source_pdfs --final final_pdfs --logs logs
   ```

**Options:**
- `--source`: Folder containing PDFs to check (default: `source_pdfs`)
- `--final`: Folder where unique PDFs will be moved (default: `final_pdfs`)
- `--logs`: Folder for log files (default: `logs`)

**Example:**
```bash
# Use custom folders
python3 duplicate_pdf_detector.py --source my_pdfs --final cleaned_pdfs --logs my_logs
```

---

## 📂 Folder Structure

After running the application, you'll have:

```
duplicate-pdf-detactore/
├── source_pdfs/      # Place your PDFs here (input)
├── final_pdfs/       # Unique PDFs after processing (output)
├── logs/             # Log files with processing details
├── app.py            # Main Flask application
└── duplicate_pdf_detector.py  # Core duplicate detection module
```

---

## ⚙️ Configuration

### Change Port (if 5000 is already in use)

Edit `config.py` or set environment variable:

```bash
# Linux/Mac
export PORT=8080
python3 app.py

# Windows
set PORT=8080
python app.py
```

### Change Host

```bash
# Linux/Mac
export HOST=127.0.0.1
python3 app.py

# Windows
set HOST=127.0.0.1
python app.py
```

---

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'Flask'"

**Solution**: Install dependencies
```bash
pip3 install -r requirements.txt
```

### Issue: "Port 5000 is already in use" or "Address already in use"

**This is common on macOS** - Port 5000 is often used by AirPlay Receiver.

**Solution 1: Use a different port (Recommended)**
```bash
# Mac/Linux
export PORT=8080
python3 app.py

# Windows
set PORT=8080
python app.py
```

Then access the app at: `http://localhost:8080`

**Solution 2: Disable AirPlay Receiver (macOS)**
1. Open **System Preferences** (or **System Settings** on newer macOS)
2. Go to **General** → **AirDrop & Handoff**
3. Turn off **AirPlay Receiver**
4. Try running `python3 app.py` again

**Solution 3: Find and stop the process using port 5000**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process (replace PID with the actual process ID)
kill -9 <PID>
```

### Issue: "Permission denied" or "Access denied"

**Solution**: 
- **Windows**: Run Command Prompt as Administrator
- **Mac/Linux**: Use `sudo` (if needed) or check folder permissions

### Issue: "source_pdfs folder not found"

**Solution**: Create the folder
```bash
mkdir source_pdfs
```

### Issue: Browser shows "Connection refused"

**Solution**: 
1. Make sure the Flask app is running (check terminal)
2. Verify the URL: `http://localhost:8080` (or the port shown in terminal, not `https://`)
3. Check firewall settings
4. Make sure you're using the correct port number

---

## 🛑 Stopping the Application

To stop the Flask application:
- Press `Ctrl + C` in the terminal where it's running

---

## 📝 Logs

Check the `logs/` folder for detailed processing logs:
- Each run creates a new log file with timestamp
- Logs include: files processed, duplicates found, errors, etc.

---

## 🔒 Security Notes

- **Development Mode**: The app runs in debug mode by default (for development)
- **Production**: Set `FLASK_ENV=production` for production use
- **Secret Key**: Change the `SECRET_KEY` in `config.py` for production

---

## 📚 Additional Resources

- **Main README**: See `README.md` for project overview
- **API Documentation**: Check the code comments in `app.py`
- **Core Module**: See `duplicate_pdf_detector.py` for detection logic

---

## ✅ Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Dependencies installed (`pip3 install -r requirements.txt`)
- [ ] `source_pdfs` folder exists
- [ ] PDF files added to `source_pdfs` folder
- [ ] Application started (`python3 app.py`)
- [ ] Application started (`python3 app.py`)
- [ ] Browser opened to `http://localhost:8080` (or the port shown in terminal)
- [ ] Web interface loaded successfully

---

## 🎉 You're All Set!

Once you see the SanitixPDF dashboard in your browser, you're ready to:
- Upload PDFs
- Detect duplicates
- Remove duplicates automatically
- Download cleaned PDFs

**Happy duplicate hunting!** 🚀

---

## 📊 Example Results

After running duplicate detection, you'll see results like:

```
============================================================
Process Summary
============================================================
Total PDFs processed: 4449
Unique PDFs: 2487
Duplicates found: 1258
Duplicates removed: 1258
Errors encountered: 0
Final folder: final_pdfs
============================================================
```

- **Total PDFs**: All PDFs found in `source_pdfs` folder
- **Unique PDFs**: PDFs with unique content (moved to `final_pdfs`)
- **Duplicates found**: Number of duplicate PDFs detected
- **Duplicates removed**: Number of duplicate PDFs deleted
- **Errors**: Any errors encountered during processing

All unique PDFs are automatically moved to the `final_pdfs` folder!