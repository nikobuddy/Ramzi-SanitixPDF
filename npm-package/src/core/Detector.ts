/**
 * Core duplicate PDF detection engine
 */

import { DetectionOptions, DetectionResult, DuplicateGroup, PDFFile } from '../types';

import { FileManager } from './FileManager';
import { PDFHasher } from './PDFHasher';

export class DuplicatePDFDetector {
  private files: PDFFile[] = [];
  private hasher: PDFHasher;
  private fileManager: FileManager;

  constructor() {
    this.hasher = new PDFHasher();
    this.fileManager = new FileManager();
  }

  /**
   * Add files to the detector
   */
  async addFiles(files: FileList | File[]): Promise<PDFFile[]> {
    const fileArray = Array.from(files);
    const pdfFiles: PDFFile[] = [];

    for (const file of fileArray) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const pdfFile: PDFFile = {
          file,
          id: this.generateId(),
          name: file.name,
          size: file.size,
          uploadDate: new Date(),
        };
        pdfFiles.push(pdfFile);
      }
    }

    this.files.push(...pdfFiles);
    return pdfFiles;
  }

  /**
   * Remove a file by ID
   */
  removeFile(id: string): void {
    this.files = this.files.filter(f => f.id !== id);
  }

  /**
   * Clear all files
   */
  clearFiles(): void {
    this.files = [];
  }

  /**
   * Detect duplicate PDFs
   */
  async detectDuplicates(options: DetectionOptions = {}): Promise<DetectionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    
    const {
      method = 'hybrid',
      compareText = true,
      compareMetadata = false,
      onProgress,
      onError,
      keepStrategy = 'first',
    } = options;

    if (this.files.length === 0) {
      return this.createEmptyResult();
    }

    // Update progress
    onProgress?.(10, 'Starting duplicate detection...');

    // Generate hashes for all files
    const hashMap = new Map<string, PDFFile[]>();
    
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      const progress = 10 + (i / this.files.length) * 80;
      
      try {
        onProgress?.(progress, `Processing ${file.name}...`);
        
        let hash: string;
        
        if (method === 'hash') {
          hash = await this.hasher.hashFile(file.file);
        } else if (method === 'content') {
          hash = await this.hasher.hashContent(file.file, {
            compareText,
            compareMetadata,
          });
        } else {
          // Hybrid: use both
          const fileHash = await this.hasher.hashFile(file.file);
          const contentHash = await this.hasher.hashContent(file.file, {
            compareText,
            compareMetadata,
          });
          hash = `${fileHash}:${contentHash}`;
        }

        file.hash = hash;

        if (!hashMap.has(hash)) {
          hashMap.set(hash, []);
        }
        hashMap.get(hash)!.push(file);
      } catch (error) {
        const errorMsg = `Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        onError?.(error instanceof Error ? error : new Error(String(error)), file);
      }
    }

    onProgress?.(90, 'Analyzing duplicates...');

    // Find duplicate groups
    const duplicateGroups: DuplicateGroup[] = [];
    let duplicatesFound = 0;

    for (const [hash, files] of hashMap.entries()) {
      if (files.length > 1) {
        const keepFile = this.selectFileToKeep(files, keepStrategy);
        const duplicates = files.filter(f => f.id !== keepFile.id);
        
        duplicateGroups.push({
          hash,
          files,
          keepFile,
          duplicates,
        });

        duplicatesFound += duplicates.length;
      }
    }

    onProgress?.(100, 'Detection complete');

    const processingTime = Date.now() - startTime;

    const result: DetectionResult = {
      totalFiles: this.files.length,
      uniqueFiles: this.files.length - duplicatesFound,
      duplicateGroups,
      duplicatesFound,
      duplicatesRemoved: 0,
      processingTime,
      errors,
    };

    return result;
  }

  /**
   * Get unique files (one from each duplicate group)
   */
  getUniqueFiles(): PDFFile[] {
    const uniqueHashes = new Set<string>();
    const uniqueFiles: PDFFile[] = [];

    for (const file of this.files) {
      if (file.hash && !uniqueHashes.has(file.hash)) {
        uniqueHashes.add(file.hash);
        uniqueFiles.push(file);
      } else if (!file.hash) {
        // Files without hash are considered unique
        uniqueFiles.push(file);
      }
    }

    return uniqueFiles;
  }

  /**
   * Get duplicate groups
   */
  getDuplicateGroups(): DuplicateGroup[] {
    const hashMap = new Map<string, PDFFile[]>();

    for (const file of this.files) {
      if (file.hash) {
        if (!hashMap.has(file.hash)) {
          hashMap.set(file.hash, []);
        }
        hashMap.get(file.hash)!.push(file);
      }
    }

    const groups: DuplicateGroup[] = [];
    for (const [hash, files] of hashMap.entries()) {
      if (files.length > 1) {
        groups.push({
          hash,
          files,
          keepFile: files[0],
          duplicates: files.slice(1),
        });
      }
    }

    return groups;
  }

  /**
   * Remove duplicate files from the list
   */
  removeDuplicates(keepStrategy: 'first' | 'smallest' | 'largest' | 'newest' | 'oldest' = 'first'): PDFFile[] {
    const groups = this.getDuplicateGroups();
    const filesToRemove = new Set<string>();

    for (const group of groups) {
      // Select which file to keep (used for strategy logic)
      this.selectFileToKeep(group.files, keepStrategy);
      for (const file of group.duplicates) {
        filesToRemove.add(file.id);
      }
    }

    this.files = this.files.filter(f => !filesToRemove.has(f.id));
    return this.files;
  }

  /**
   * Get all files
   */
  getFiles(): PDFFile[] {
    return [...this.files];
  }

  /**
   * Select which file to keep from a group
   */
  private selectFileToKeep(
    files: PDFFile[],
    strategy: 'first' | 'smallest' | 'largest' | 'newest' | 'oldest'
  ): PDFFile {
    switch (strategy) {
      case 'smallest':
        return files.reduce((smallest, current) =>
          current.size < smallest.size ? current : smallest
        );
      case 'largest':
        return files.reduce((largest, current) =>
          current.size > largest.size ? current : largest
        );
      case 'newest':
        return files.reduce((newest, current) =>
          current.uploadDate > newest.uploadDate ? current : newest
        );
      case 'oldest':
        return files.reduce((oldest, current) =>
          current.uploadDate < oldest.uploadDate ? current : oldest
        );
      case 'first':
      default:
        return files[0];
    }
  }

  /**
   * Generate unique ID for files
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create empty result
   */
  private createEmptyResult(): DetectionResult {
    return {
      totalFiles: 0,
      uniqueFiles: 0,
      duplicateGroups: [],
      duplicatesFound: 0,
      duplicatesRemoved: 0,
      processingTime: 0,
      errors: [],
    };
  }
}

