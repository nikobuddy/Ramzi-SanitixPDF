# SanitixPDF

<div align="center">

![Python Version](https://img.shields.io/badge/python-3.7+-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Flask](https://img.shields.io/badge/flask-3.0.0-blue.svg)
![PyPDF2](https://img.shields.io/badge/PyPDF2-3.0.1-red.svg)

**A professional, production-ready platform for detecting and removing duplicate PDF files based on content comparison**

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 🌟 Overview

SanitixPDF is an open-source platform that helps you identify and remove duplicate PDF files by comparing their actual content, not just filenames. It features a modern web interface and command-line tools, making it perfect for document management, library organization, and archive cleanup.

## ✨ Features

### Web Interface
- 🎨 **Modern Dashboard**: Beautiful, responsive web interface with real-time statistics
- 📤 **Drag & Drop Upload**: Easy file upload with drag-and-drop support
- 📊 **Real-time Statistics**: Live dashboard showing:
  - Total PDFs processed
  - Unique PDFs found
  - Duplicates detected and removed
- 📁 **File Management**: View, browse, and download PDFs through the web interface
- 📈 **Progress Tracking**: Real-time progress bar during processing
- 🔔 **Notifications**: Success and error notifications

### Core Functionality
- 🔍 **Content-Based Detection**: Compares PDFs by actual content using SHA-256 hashing
- 🗑️ **Automatic Duplicate Removal**: Removes duplicates, keeps one copy
- 📂 **Organized Storage**: Unique PDFs moved to final folder
- 📝 **Comprehensive Logging**: Detailed logs of all operations
- 🛡️ **Error Handling**: Robust error handling for corrupted or unreadable PDFs
- 🚀 **Production Ready**: Configurable, secure, and scalable

## 📦 Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Quick Install

```bash
# Clone the repository
git clone https://github.com/nikobuddy/Ramzi-SanitixPDF.git
cd Ramzi-SanitixPDF

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Install as Package

```bash
pip install -e .
```

## 🚀 Quick Start

### Web Interface (Recommended)

1. **Start the web server:**
   ```bash
   python app.py
   ```

2. **Open your browser:**
   Navigate to `http://localhost:5000`

3. **Use the interface:**
   - Upload PDFs using drag-and-drop or file browser
   - Click "Start Processing" to detect duplicates
   - View statistics and download unique PDFs from the final folder

### Command-Line Interface

1. **Place PDFs in source folder:**
   ```bash
   cp /path/to/pdfs/*.pdf source_pdfs/
   ```

2. **Run the detector:**
   ```bash
   python duplicate_pdf_detector.py
   ```

3. **Check results:**
   - Unique PDFs are in `final_pdfs/` folder
   - Logs are in `logs/` folder

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contributing guidelines
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Code of conduct
- **[SECURITY.md](SECURITY.md)** - Security policy

## 🏗️ Project Structure

```
SanitixPDF/
├── app.py                      # Flask web application
├── duplicate_pdf_detector.py   # Core duplicate detection engine
├── config.py                   # Configuration management
├── setup.py                    # Package installation script
├── wsgi.py                     # WSGI entry point for production
├── requirements.txt            # Python dependencies
├── start.sh                    # Production start script
├── verify_setup.py            # Setup verification script
├── templates/
│   └── index.html             # Web interface HTML
├── static/
│   ├── css/
│   │   └── style.css          # Web interface styles
│   └── js/
│       └── app.js             # Web interface JavaScript
├── .github/
│   ├── ISSUE_TEMPLATE/        # GitHub issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── source_pdfs/               # Input folder for PDFs (not in git)
├── final_pdfs/                # Output folder for unique PDFs (not in git)
└── logs/                      # Log files directory (not in git)
```

## 🔧 How It Works

1. **Upload**: PDFs are uploaded to `source_pdfs/` folder
2. **Hashing**: Each PDF's content is hashed using SHA-256
3. **Grouping**: PDFs with identical hashes are grouped together
4. **Detection**: Groups with multiple PDFs are identified as duplicates
5. **Removal**: All but one PDF from each duplicate group is deleted
6. **Storage**: Unique PDFs are moved to `final_pdfs/` folder

## 🌐 API Endpoints

The web interface uses RESTful API endpoints:

- `GET /` - Main web interface
- `POST /api/upload` - Upload PDF files
- `POST /api/process` - Start duplicate detection
- `GET /api/status` - Get processing status
- `GET /api/stats` - Get statistics about PDFs
- `POST /api/clear-source` - Clear source folder
- `POST /api/clear-final` - Clear final folder
- `GET /api/download/<filename>` - Download a PDF file

## 🚀 Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- Gunicorn setup
- Nginx reverse proxy configuration
- Systemd service setup
- SSL/HTTPS configuration
- Security best practices

## 🧪 Testing

Run the verification script to check your setup:

```bash
python verify_setup.py
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PyPDF2](https://github.com/py-pdf/pypdf2) - PDF processing library
- [Flask](https://flask.palletsprojects.com/) - Web framework
- Contributors and users of SanitixPDF

## 📞 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/nikobuddy/Ramzi-SanitixPDF/issues)
- 💡 **Feature Requests**: [Open an issue](https://github.com/nikobuddy/Ramzi-SanitixPDF/issues)
- 📧 **Questions**: Open a discussion on GitHub

## ⭐ Show Your Support

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

<div align="center">

**Made with ❤️ by Nisarga Lokhande for efficient PDF management**

[Report Bug](https://github.com/nikobuddy/Ramzi-SanitixPDF/issues) • [Request Feature](https://github.com/nikobuddy/Ramzi-SanitixPDF/issues) • [Documentation](https://github.com/nikobuddy/Ramzi-SanitixPDF#readme)

</div>
