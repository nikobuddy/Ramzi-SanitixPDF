/**
 * Core duplicate PDF detection engine
 */

import { DetectionOptions, DetectionResult, DuplicateGroup, KeepStrategy, PDFFile } from '../types';

import { DetectionStrategies } from './DetectionStrategies';
import { FileManager } from './FileManager';
import { PDFHasher } from './PDFHasher';

export class DuplicatePDFDetector {
  private files: PDFFile[] = [];
  private hasher: PDFHasher;
  private fileManager: FileManager;
  private strategies: DetectionStrategies;

  constructor() {
    this.hasher = new PDFHasher();
    this.fileManager = new FileManager();
    this.strategies = new DetectionStrategies(this.hasher);
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
   * Detect duplicate PDFs (async-first API)
   */
  async detectDuplicates(options: DetectionOptions = {}): Promise<DetectionResult> {
    return this.detectDuplicatesAsync(options);
  }

  /**
   * Async-first API for duplicate detection
   */
  async detectDuplicatesAsync(options: DetectionOptions = {}): Promise<DetectionResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    
    const {
      method = 'hybrid',
      threshold = 0.8,
      compareText = true,
      compareMetadata = false,
      onProgress,
      onError,
      keepStrategy = 'first',
      plugins = [],
    } = options;

    if (this.files.length === 0) {
      return this.createEmptyResult();
    }

    onProgress?.(10, 'Starting duplicate detection...');

    let duplicateGroups: DuplicateGroup[] = [];

    try {
      // Use custom plugins if provided
      if (plugins.length > 0) {
        for (const plugin of plugins) {
          onProgress?.(30, `Using plugin: ${plugin.name}...`);
          const pluginGroups = await plugin.detect(this.files, options);
          duplicateGroups.push(...pluginGroups);
        }
      } else {
        // Use built-in strategies
        onProgress?.(20, `Using detection method: ${method}...`);

        switch (method) {
          case 'exact':
          case 'hash':
            duplicateGroups = await this.strategies.detectHash(this.files);
            break;
          case 'content':
            duplicateGroups = await this.strategies.detectContent(this.files, {
              compareText,
              compareMetadata,
            });
            break;
          case 'hybrid':
            duplicateGroups = await this.strategies.detectHybrid(this.files, {
              compareText,
              compareMetadata,
            });
            break;
          case 'fuzzy':
            duplicateGroups = await this.strategies.detectFuzzy(this.files, threshold, {
              compareText,
              compareMetadata,
              caseSensitive: options.caseSensitive,
              ignoreWhitespace: options.ignoreWhitespace,
              ignorePunctuation: options.ignorePunctuation,
            });
            break;
          case 'token':
            duplicateGroups = await this.strategies.detectToken(this.files, {
              compareText,
              caseSensitive: options.caseSensitive,
              ignoreWhitespace: options.ignoreWhitespace,
              ignorePunctuation: options.ignorePunctuation,
            });
            break;
          default:
            duplicateGroups = await this.strategies.detectHybrid(this.files, {
              compareText,
              compareMetadata,
            });
        }
      }

      // Apply keep strategy to groups
      for (const group of duplicateGroups) {
        const keepFile = this.selectFileToKeep(group.files, keepStrategy);
        group.keepFile = keepFile;
        group.duplicates = group.files.filter(f => f.id !== keepFile.id);
      }

      onProgress?.(90, 'Analyzing duplicates...');
    } catch (error) {
      const errorMsg = `Error during detection: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      onError?.(error instanceof Error ? error : new Error(String(error)), this.files[0]);
    }

    const duplicatesFound = duplicateGroups.reduce((sum, group) => sum + group.duplicates.length, 0);
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
      method,
      threshold: method === 'fuzzy' ? threshold : undefined,
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
   * Remove duplicate files from the list (async version)
   */
  async removeDuplicatesAsync(keepStrategy: KeepStrategy = 'first'): Promise<PDFFile[]> {
    return this.removeDuplicates(keepStrategy);
  }

  /**
   * Remove duplicate files from the list
   */
  removeDuplicates(keepStrategy: KeepStrategy = 'first'): PDFFile[] {
    const groups = this.getDuplicateGroups();
    const filesToRemove = new Set<string>();

    for (const group of groups) {
      const keepFile = this.selectFileToKeep(group.files, keepStrategy);
      for (const file of group.files) {
        if (file.id !== keepFile.id) {
          filesToRemove.add(file.id);
        }
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
    strategy: KeepStrategy
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

