#!/usr/bin/env python3
"""
Setup Verification Script
Checks if all required components are properly installed and configured.
"""

import sys
import os
from pathlib import Path

def check_python_version():
    """Check Python version."""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    return True

def check_dependencies():
    """Check if required packages are installed."""
    required_packages = {
        'PyPDF2': 'PyPDF2',
        'flask': 'Flask',
        'flask_cors': 'Flask-CORS',
        'werkzeug': 'Werkzeug'
    }
    
    missing = []
    for module, package in required_packages.items():
        try:
            __import__(module)
            print(f"✅ {package} is installed")
        except ImportError:
            print(f"❌ {package} is not installed")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("   Run: pip install -r requirements.txt")
        return False
    return True

def check_directories():
    """Check if required directories exist."""
    required_dirs = ['source_pdfs', 'final_pdfs', 'logs', 'templates', 'static']
    missing_dirs = []
    
    for dir_name in required_dirs:
        if Path(dir_name).exists():
            print(f"✅ {dir_name}/ directory exists")
        else:
            print(f"⚠️  {dir_name}/ directory missing (will be created automatically)")
            missing_dirs.append(dir_name)
            # Create directory if it's a runtime directory
            if dir_name in ['source_pdfs', 'final_pdfs', 'logs']:
                Path(dir_name).mkdir(parents=True, exist_ok=True)
                print(f"   Created {dir_name}/ directory")
    
    # Only fail if templates or static are missing (these should be in repo)
    critical_dirs = ['templates', 'static']
    for dir_name in critical_dirs:
        if dir_name in missing_dirs:
            return False
    
    return True

def check_files():
    """Check if required files exist."""
    required_files = [
        'app.py',
        'duplicate_pdf_detector.py',
        'config.py',
        'requirements.txt',
        'templates/index.html',
        'static/css/style.css',
        'static/js/app.js'
    ]
    
    all_exist = True
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✅ {file_path} exists")
        else:
            print(f"❌ {file_path} is missing")
            all_exist = False
    
    return all_exist

def main():
    """Run all checks."""
    print("=" * 60)
    print("SanitixPDF - Setup Verification")
    print("=" * 60)
    print()
    
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Directories", check_directories),
        ("Files", check_files)
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n📋 Checking {name}:")
        print("-" * 40)
        result = check_func()
        results.append(result)
    
    print("\n" + "=" * 60)
    print("Verification Summary")
    print("=" * 60)
    
    if all(results):
        print("✅ All checks passed! The platform is ready to use.")
        print("\nTo start the web interface:")
        print("  python app.py")
        print("\nOr use the start script:")
        print("  ./start.sh")
        return 0
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        return 1

if __name__ == '__main__':
    sys.exit(main())

