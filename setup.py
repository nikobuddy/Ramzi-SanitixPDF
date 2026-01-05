#!/usr/bin/env python3
"""
Setup script for SanitixPDF
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read the contents of README file
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding='utf-8')

# Read requirements
requirements = []
with open('requirements.txt', 'r', encoding='utf-8') as f:
    requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]

setup(
    name="sanitixpdf",
    version="1.0.0",
    author="Nisarga Lokhande",
    author_email="",
    description="A professional platform for detecting and removing duplicate PDF files based on content comparison",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/nikobuddy/Ramzi-SanitixPDF",
    project_urls={
        "Bug Tracker": "https://github.com/nikobuddy/Ramzi-SanitixPDF/issues",
        "Documentation": "https://github.com/nikobuddy/Ramzi-SanitixPDF#readme",
        "Source Code": "https://github.com/nikobuddy/Ramzi-SanitixPDF",
    },
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: End Users/Desktop",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Utilities",
        "Topic :: Office/Business",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    include_package_data=True,
    package_data={
        '': ['templates/*.html', 'static/css/*.css', 'static/js/*.js'],
    },
    entry_points={
        'console_scripts': [
            'sanitixpdf=duplicate_pdf_detector:main',
        ],
    },
    keywords="pdf duplicate detection content comparison file management",
    zip_safe=False,
)

