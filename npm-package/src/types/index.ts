/**
 * Type definitions for SanitixPDF Duplicate Detector
 */

export interface PDFFile {
  file: File;
  id: string;
  name: string;
  size: number;
  hash?: string;
  pages?: number;
  uploadDate: Date;
}

export interface DuplicateGroup {
  hash: string;
  files: PDFFile[];
  keepFile: PDFFile;
  duplicates: PDFFile[];
}

export interface DetectionResult {
  totalFiles: number;
  uniqueFiles: number;
  duplicateGroups: DuplicateGroup[];
  duplicatesFound: number;
  duplicatesRemoved: number;
  processingTime: number;
  errors: string[];
}

export interface DetectionOptions {
  /**
   * Method to use for duplicate detection
   * - 'content': Compare full PDF content (most accurate, slower)
   * - 'hash': Compare file hash (fast, good for exact duplicates)
   * - 'hybrid': Use both methods (most thorough, slowest)
   */
  method?: 'content' | 'hash' | 'hybrid';
  
  /**
   * Whether to extract and compare text content
   */
  compareText?: boolean;
  
  /**
   * Whether to compare metadata
   */
  compareMetadata?: boolean;
  
  /**
   * Callback for progress updates
   */
  onProgress?: (progress: number, status: string) => void;
  
  /**
   * Callback for errors
   */
  onError?: (error: Error, file: PDFFile) => void;
  
  /**
   * Strategy for selecting which file to keep
   * - 'first': Keep the first file in the group
   * - 'smallest': Keep the smallest file
   * - 'largest': Keep the largest file
   * - 'newest': Keep the newest file
   * - 'oldest': Keep the oldest file
   */
  keepStrategy?: 'first' | 'smallest' | 'largest' | 'newest' | 'oldest';
}

export interface UseDuplicatePDFDetectorOptions extends DetectionOptions {
  /**
   * Auto-detect duplicates when files are added
   */
  autoDetect?: boolean;
  
  /**
   * Callback when detection completes
   */
  onComplete?: (result: DetectionResult) => void;
}

export interface UseDuplicatePDFDetectorReturn {
  files: PDFFile[];
  result: DetectionResult | null;
  isProcessing: boolean;
  progress: number;
  status: string;
  error: Error | null;
  
  addFiles: (files: FileList | File[]) => Promise<void>;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  detectDuplicates: () => Promise<DetectionResult>;
  removeDuplicates: () => PDFFile[];
  getUniqueFiles: () => PDFFile[];
  getDuplicateGroups: () => DuplicateGroup[];
}

