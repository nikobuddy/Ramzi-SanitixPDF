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
  /**
   * Detection method used
   */
  method?: DetectionMethod;
  /**
   * Threshold used (for fuzzy matching)
   */
  threshold?: number;
}

/**
 * Detection strategy types
 */
export type DetectionMethod = 'exact' | 'hash' | 'content' | 'hybrid' | 'fuzzy' | 'token';

/**
 * Strategy for selecting which file to keep
 */
export type KeepStrategy = 'first' | 'smallest' | 'largest' | 'newest' | 'oldest';

/**
 * Custom detection plugin/hook
 */
export interface DetectionPlugin {
  /**
   * Plugin name
   */
  name: string;
  
  /**
   * Detect duplicates using custom logic
   */
  detect: (files: PDFFile[], options: DetectionOptions) => Promise<DuplicateGroup[]>;
}

export interface DetectionOptions {
  /**
   * Method to use for duplicate detection
   * - 'exact': Exact byte-for-byte match (fastest)
   * - 'hash': Compare file hash (fast, good for exact duplicates)
   * - 'content': Compare full PDF content (most accurate, slower)
   * - 'hybrid': Use both hash and content (most thorough, slowest)
   * - 'fuzzy': Fuzzy matching with similarity threshold
   * - 'token': Token-based comparison
   */
  method?: DetectionMethod;
  
  /**
   * Similarity threshold for fuzzy matching (0-1)
   * 0.8 = 80% similarity required to be considered duplicate
   */
  threshold?: number;
  
  /**
   * Whether to extract and compare text content
   */
  compareText?: boolean;
  
  /**
   * Whether to compare metadata
   */
  compareMetadata?: boolean;
  
  /**
   * Case sensitivity for text comparison
   */
  caseSensitive?: boolean;
  
  /**
   * Ignore whitespace differences
   */
  ignoreWhitespace?: boolean;
  
  /**
   * Ignore punctuation differences
   */
  ignorePunctuation?: boolean;
  
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
   */
  keepStrategy?: KeepStrategy;
  
  /**
   * Custom detection plugins
   */
  plugins?: DetectionPlugin[];
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

