#!/usr/bin/env python3
"""
SanitixPDF - Flask Web Application
Production-ready web interface for detecting and removing duplicate PDF files.
"""

import os
import json
import threading
from pathlib import Path
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
from duplicate_pdf_detector import DuplicatePDFDetector
from config import config

app = Flask(__name__)
CORS(app)

# Load configuration
env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config.get(env, config['default']))

# Global state for processing status
processing_status = {
    'is_processing': False,
    'progress': 0,
    'current_status': '',
    'stats': None,
    'error': None
}

# Ensure directories exist
Path(app.config['UPLOAD_FOLDER']).mkdir(exist_ok=True)
Path(app.config['FINAL_FOLDER']).mkdir(exist_ok=True)
Path(app.config['LOGS_FOLDER']).mkdir(exist_ok=True)


def allowed_file(filename):
    """Check if file has allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def get_file_info(folder_path):
    """Get information about files in a folder."""
    folder = Path(folder_path)
    files = []
    total_size = 0
    
    for file_path in folder.glob("*.pdf"):
        try:
            stat = file_path.stat()
            files.append({
                'name': file_path.name,
                'size': stat.st_size,
                'size_mb': round(stat.st_size / (1024 * 1024), 2),
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
            })
            total_size += stat.st_size
        except Exception as e:
            print(f"Error getting info for {file_path}: {e}")
    
    for file_path in folder.glob("*.PDF"):
        try:
            stat = file_path.stat()
            files.append({
                'name': file_path.name,
                'size': stat.st_size,
                'size_mb': round(stat.st_size / (1024 * 1024), 2),
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
            })
            total_size += stat.st_size
        except Exception as e:
            print(f"Error getting info for {file_path}: {e}")
    
    return sorted(files, key=lambda x: x['name']), total_size


def process_duplicates():
    """Process duplicates in background thread."""
    global processing_status
    
    try:
        processing_status['is_processing'] = True
        processing_status['progress'] = 0
        processing_status['error'] = None
        processing_status['current_status'] = 'Initializing...'
        
        detector = DuplicatePDFDetector(
            source_folder=app.config['UPLOAD_FOLDER'],
            final_folder=app.config['FINAL_FOLDER'],
            log_folder=app.config['LOGS_FOLDER']
        )
        
        processing_status['current_status'] = 'Scanning for PDFs...'
        processing_status['progress'] = 20
        
        duplicates = detector.find_duplicates()
        
        processing_status['current_status'] = 'Processing duplicates...'
        processing_status['progress'] = 60
        
        if duplicates:
            detector.remove_duplicates_and_move_unique(duplicates)
        else:
            # Move all PDFs to final folder if no duplicates
            pdf_files = list(Path(app.config['UPLOAD_FOLDER']).glob("*.pdf"))
            pdf_files.extend(Path(app.config['UPLOAD_FOLDER']).glob("*.PDF"))
            for pdf_path in pdf_files:
                try:
                    destination = Path(app.config['FINAL_FOLDER']) / pdf_path.name
                    counter = 1
                    while destination.exists():
                        stem = pdf_path.stem
                        suffix = pdf_path.suffix
                        destination = Path(app.config['FINAL_FOLDER']) / f"{stem}_{counter}{suffix}"
                        counter += 1
                    import shutil
                    shutil.move(str(pdf_path), str(destination))
                except Exception as e:
                    print(f"Error moving {pdf_path.name}: {e}")
        
        processing_status['progress'] = 90
        processing_status['current_status'] = 'Finalizing...'
        
        # Get final statistics
        stats = {
            'total_pdfs': detector.stats['total_pdfs'],
            'unique_pdfs': detector.stats['unique_pdfs'],
            'duplicates_found': detector.stats['duplicates_found'],
            'duplicates_removed': detector.stats['duplicates_removed'],
            'errors': detector.stats['errors']
        }
        
        processing_status['stats'] = stats
        processing_status['progress'] = 100
        processing_status['current_status'] = 'Completed!'
        
    except Exception as e:
        processing_status['error'] = str(e)
        processing_status['current_status'] = f'Error: {str(e)}'
    finally:
        processing_status['is_processing'] = False


@app.route('/')
def index():
    """Main page."""
    return render_template('index.html')


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = Path(app.config['UPLOAD_FOLDER']) / filename
        
        # Handle duplicate filenames
        counter = 1
        original_name = file_path.stem
        suffix = file_path.suffix
        while file_path.exists():
            filename = f"{original_name}_{counter}{suffix}"
            file_path = Path(app.config['UPLOAD_FOLDER']) / filename
            counter += 1
        
        file.save(str(file_path))
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename
        }), 200
    
    return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400


@app.route('/api/process', methods=['POST'])
def process():
    """Start duplicate detection process."""
    global processing_status
    
    if processing_status['is_processing']:
        return jsonify({'error': 'Processing already in progress'}), 400
    
    # Reset status
    processing_status['is_processing'] = False
    processing_status['progress'] = 0
    processing_status['stats'] = None
    processing_status['error'] = None
    
    # Start processing in background thread
    thread = threading.Thread(target=process_duplicates)
    thread.daemon = True
    thread.start()
    
    return jsonify({'message': 'Processing started'}), 200


@app.route('/api/status', methods=['GET'])
def status():
    """Get processing status."""
    return jsonify(processing_status), 200


@app.route('/api/stats', methods=['GET'])
def stats():
    """Get statistics about PDFs."""
    source_files, source_size = get_file_info(app.config['UPLOAD_FOLDER'])
    final_files, final_size = get_file_info(app.config['FINAL_FOLDER'])
    
    return jsonify({
        'source': {
            'count': len(source_files),
            'files': source_files,
            'total_size_mb': round(source_size / (1024 * 1024), 2)
        },
        'final': {
            'count': len(final_files),
            'files': final_files,
            'total_size_mb': round(final_size / (1024 * 1024), 2)
        }
    }), 200


@app.route('/api/clear-source', methods=['POST'])
def clear_source():
    """Clear all files from source folder."""
    try:
        folder = Path(app.config['UPLOAD_FOLDER'])
        for file_path in folder.glob("*.pdf"):
            file_path.unlink()
        for file_path in folder.glob("*.PDF"):
            file_path.unlink()
        return jsonify({'message': 'Source folder cleared'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/clear-final', methods=['POST'])
def clear_final():
    """Clear all files from final folder."""
    try:
        folder = Path(app.config['FINAL_FOLDER'])
        for file_path in folder.glob("*.pdf"):
            file_path.unlink()
        for file_path in folder.glob("*.PDF"):
            file_path.unlink()
        return jsonify({'message': 'Final folder cleared'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/download/<filename>')
def download_file(filename):
    """Download a file from final folder."""
    return send_from_directory(
        app.config['FINAL_FOLDER'],
        filename,
        as_attachment=True
    )


if __name__ == '__main__':
    from config import Config
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    )

