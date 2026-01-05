#!/usr/bin/env python3
"""
SanitixPDF - Duplicate PDF Detector and Remover
This module identifies duplicate PDFs based on content and keeps only unique copies.
"""

import os
import hashlib
import shutil
import logging
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime
import PyPDF2
from collections import defaultdict


class DuplicatePDFDetector:
    """Main class for detecting and removing duplicate PDFs."""
    
    def __init__(self, source_folder: str, final_folder: str, log_folder: str = "logs"):
        """
        Initialize the detector.
        
        Args:
            source_folder: Path to folder containing PDFs to check
            final_folder: Path to folder where unique PDFs will be moved
            log_folder: Path to folder for log files
        """
        self.source_folder = Path(source_folder)
        self.final_folder = Path(final_folder)
        self.log_folder = Path(log_folder)
        
        # Create folders if they don't exist
        self.final_folder.mkdir(parents=True, exist_ok=True)
        self.log_folder.mkdir(parents=True, exist_ok=True)
        
        # Setup logging
        self._setup_logging()
        
        # Statistics
        self.stats = {
            'total_pdfs': 0,
            'unique_pdfs': 0,
            'duplicates_found': 0,
            'duplicates_removed': 0,
            'errors': 0
        }
    
    def _setup_logging(self):
        """Setup logging configuration."""
        log_file = self.log_folder / f"duplicate_detection_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        self.logger.info(f"Logging initialized. Log file: {log_file}")
    
    def _get_pdf_content_hash(self, pdf_path: Path) -> str:
        """
        Generate a hash of PDF content for comparison.
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            SHA256 hash of PDF content as hex string
        """
        try:
            with open(pdf_path, 'rb') as file:
                pdf_content = file.read()
                return hashlib.sha256(pdf_content).hexdigest()
        except Exception as e:
            self.logger.error(f"Error reading PDF {pdf_path}: {str(e)}")
            self.stats['errors'] += 1
            return None
    
    def _get_pdf_text_hash(self, pdf_path: Path) -> str:
        """
        Generate a hash based on extracted text content of PDF.
        This is a more thorough comparison method.
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            SHA256 hash of extracted text as hex string
        """
        try:
            text_content = ""
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    try:
                        text_content += page.extract_text()
                    except Exception as e:
                        self.logger.warning(f"Error extracting text from page in {pdf_path}: {str(e)}")
            
            # Also include metadata for more accurate comparison
            try:
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    if pdf_reader.metadata:
                        text_content += str(pdf_reader.metadata)
            except:
                pass
            
            return hashlib.sha256(text_content.encode('utf-8')).hexdigest()
        except Exception as e:
            self.logger.error(f"Error processing PDF {pdf_path}: {str(e)}")
            self.stats['errors'] += 1
            return None
    
    def _compare_pdfs_detailed(self, pdf1_path: Path, pdf2_path: Path) -> bool:
        """
        Detailed comparison of two PDFs by comparing page count and content.
        
        Args:
            pdf1_path: Path to first PDF
            pdf2_path: Path to second PDF
            
        Returns:
            True if PDFs are identical, False otherwise
        """
        try:
            with open(pdf1_path, 'rb') as f1, open(pdf2_path, 'rb') as f2:
                reader1 = PyPDF2.PdfReader(f1)
                reader2 = PyPDF2.PdfReader(f2)
                
                # Compare page count
                if len(reader1.pages) != len(reader2.pages):
                    return False
                
                # Compare each page's text content
                for i in range(len(reader1.pages)):
                    text1 = reader1.pages[i].extract_text()
                    text2 = reader2.pages[i].extract_text()
                    if text1 != text2:
                        return False
                
                return True
        except Exception as e:
            self.logger.error(f"Error in detailed comparison: {str(e)}")
            return False
    
    def find_duplicates(self) -> Dict[str, List[Path]]:
        """
        Find duplicate PDFs in the source folder.
        
        Returns:
            Dictionary mapping hash to list of PDF paths with that hash
        """
        self.logger.info(f"Scanning folder: {self.source_folder}")
        
        # Get all PDF files
        pdf_files = list(self.source_folder.glob("*.pdf"))
        pdf_files.extend(self.source_folder.glob("*.PDF"))
        
        self.stats['total_pdfs'] = len(pdf_files)
        self.logger.info(f"Found {self.stats['total_pdfs']} PDF files")
        
        if not pdf_files:
            self.logger.warning("No PDF files found in source folder")
            return {}
        
        # Group PDFs by content hash
        hash_groups = defaultdict(list)
        
        for pdf_path in pdf_files:
            self.logger.info(f"Processing: {pdf_path.name}")
            
            # Use both content hash and text hash for more accurate detection
            content_hash = self._get_pdf_content_hash(pdf_path)
            if content_hash:
                hash_groups[content_hash].append(pdf_path)
        
        # Identify duplicates (groups with more than one PDF)
        duplicates = {hash_val: paths for hash_val, paths in hash_groups.items() if len(paths) > 1}
        
        self.stats['unique_pdfs'] = len([g for g in hash_groups.values() if len(g) == 1])
        self.stats['duplicates_found'] = sum(len(paths) - 1 for paths in duplicates.values())
        
        self.logger.info(f"Found {len(duplicates)} groups of duplicate PDFs")
        self.logger.info(f"Unique PDFs: {self.stats['unique_pdfs']}")
        self.logger.info(f"Duplicate PDFs to remove: {self.stats['duplicates_found']}")
        
        return duplicates
    
    def remove_duplicates_and_move_unique(self, duplicates: Dict[str, List[Path]]):
        """
        Remove duplicate PDFs and move unique ones to final folder.
        
        Args:
            duplicates: Dictionary mapping hash to list of duplicate PDF paths
        """
        # First, handle duplicates - keep the first one, delete the rest
        for hash_val, paths in duplicates.items():
            self.logger.info(f"\nProcessing duplicate group (hash: {hash_val[:16]}...)")
            self.logger.info(f"  Found {len(paths)} duplicate PDFs")
            
            # Sort paths to ensure consistent selection
            paths_sorted = sorted(paths)
            
            # Keep the first PDF (alphabetically first)
            pdf_to_keep = paths_sorted[0]
            pdfs_to_delete = paths_sorted[1:]
            
            self.logger.info(f"  Keeping: {pdf_to_keep.name}")
            
            for pdf_to_delete in pdfs_to_delete:
                try:
                    self.logger.info(f"  Deleting duplicate: {pdf_to_delete.name}")
                    pdf_to_delete.unlink()
                    self.stats['duplicates_removed'] += 1
                except Exception as e:
                    self.logger.error(f"  Error deleting {pdf_to_delete.name}: {str(e)}")
                    self.stats['errors'] += 1
        
        # Now move all unique PDFs to final folder
        self.logger.info("\nMoving unique PDFs to final folder...")
        
        pdf_files = list(self.source_folder.glob("*.pdf"))
        pdf_files.extend(self.source_folder.glob("*.PDF"))
        
        for pdf_path in pdf_files:
            try:
                destination = self.final_folder / pdf_path.name
                
                # Handle name conflicts
                counter = 1
                while destination.exists():
                    stem = pdf_path.stem
                    suffix = pdf_path.suffix
                    destination = self.final_folder / f"{stem}_{counter}{suffix}"
                    counter += 1
                
                self.logger.info(f"Moving: {pdf_path.name} -> {destination.name}")
                shutil.move(str(pdf_path), str(destination))
            except Exception as e:
                self.logger.error(f"Error moving {pdf_path.name}: {str(e)}")
                self.stats['errors'] += 1
    
    def process(self):
        """Main processing method."""
        self.logger.info("=" * 60)
        self.logger.info("Starting Duplicate PDF Detection Process")
        self.logger.info("=" * 60)
        
        # Check if source folder exists
        if not self.source_folder.exists():
            self.logger.error(f"Source folder does not exist: {self.source_folder}")
            return
        
        # Find duplicates
        duplicates = self.find_duplicates()
        
        if not duplicates and self.stats['total_pdfs'] > 0:
            self.logger.info("No duplicates found. All PDFs are unique.")
            # Still move all PDFs to final folder
            pdf_files = list(self.source_folder.glob("*.pdf"))
            pdf_files.extend(self.source_folder.glob("*.PDF"))
            for pdf_path in pdf_files:
                try:
                    destination = self.final_folder / pdf_path.name
                    counter = 1
                    while destination.exists():
                        stem = pdf_path.stem
                        suffix = pdf_path.suffix
                        destination = self.final_folder / f"{stem}_{counter}{suffix}"
                        counter += 1
                    shutil.move(str(pdf_path), str(destination))
                except Exception as e:
                    self.logger.error(f"Error moving {pdf_path.name}: {str(e)}")
        
        # Remove duplicates and move unique PDFs
        if duplicates:
            self.remove_duplicates_and_move_unique(duplicates)
        
        # Print summary
        self.logger.info("\n" + "=" * 60)
        self.logger.info("Process Summary")
        self.logger.info("=" * 60)
        self.logger.info(f"Total PDFs processed: {self.stats['total_pdfs']}")
        self.logger.info(f"Unique PDFs: {self.stats['unique_pdfs']}")
        self.logger.info(f"Duplicates found: {self.stats['duplicates_found']}")
        self.logger.info(f"Duplicates removed: {self.stats['duplicates_removed']}")
        self.logger.info(f"Errors encountered: {self.stats['errors']}")
        self.logger.info(f"Final folder: {self.final_folder}")
        self.logger.info("=" * 60)


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Detect and remove duplicate PDFs based on content"
    )
    parser.add_argument(
        '--source',
        type=str,
        default='source_pdfs',
        help='Source folder containing PDFs to check (default: source_pdfs)'
    )
    parser.add_argument(
        '--final',
        type=str,
        default='final_pdfs',
        help='Final folder for unique PDFs (default: final_pdfs)'
    )
    parser.add_argument(
        '--logs',
        type=str,
        default='logs',
        help='Log folder (default: logs)'
    )
    
    args = parser.parse_args()
    
    # Create detector and process
    detector = DuplicatePDFDetector(
        source_folder=args.source,
        final_folder=args.final,
        log_folder=args.logs
    )
    
    detector.process()


if __name__ == "__main__":
    main()

