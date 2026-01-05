"""
SanitixPDF - Configuration file
Production-ready settings for SanitixPDF platform
"""

import os
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).parent
SOURCE_FOLDER = BASE_DIR / 'source_pdfs'
FINAL_FOLDER = BASE_DIR / 'final_pdfs'
LOGS_FOLDER = BASE_DIR / 'logs'

# Flask configuration
class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024  # 500MB
    UPLOAD_FOLDER = str(SOURCE_FOLDER)
    FINAL_FOLDER = str(FINAL_FOLDER)
    LOGS_FOLDER = str(LOGS_FOLDER)
    ALLOWED_EXTENSIONS = {'pdf', 'PDF'}
    
    # Server configuration
    HOST = os.environ.get('HOST') or '0.0.0.0'
    PORT = int(os.environ.get('PORT') or 5000)
    DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or os.urandom(32)

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

