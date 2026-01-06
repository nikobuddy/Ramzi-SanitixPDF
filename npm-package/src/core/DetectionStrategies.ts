/**
 * Multiple detection strategies for duplicate detection
 */

import { DetectionOptions, DuplicateGroup, PDFFile } from '../types';

import { PDFHasher } from './PDFHasher';

export class DetectionStrategies {
  private hasher: PDFHasher;

  constructor(hasher: PDFHasher) {
    this.hasher = hasher;
  }

  /**
   * Exact match - byte-for-byte comparison
   */
  async detectExact(files: PDFFile[]): Promise<DuplicateGroup[]> {
    const hashMap = new Map<string, PDFFile[]>();

    for (const file of files) {
      const hash = await this.hasher.hashFile(file.file);
      file.hash = hash;

      if (!hashMap.has(hash)) {
        hashMap.set(hash, []);
      }
      hashMap.get(hash)!.push(file);
    }

    return this.createGroups(hashMap);
  }

  /**
   * Hash-based detection
   */
  async detectHash(files: PDFFile[]): Promise<DuplicateGroup[]> {
    return this.detectExact(files);
  }

  /**
   * Content-based detection
   */
  async detectContent(
    files: PDFFile[],
    options: Pick<DetectionOptions, 'compareText' | 'compareMetadata'>
  ): Promise<DuplicateGroup[]> {
    const hashMap = new Map<string, PDFFile[]>();

    for (const file of files) {
      const hash = await this.hasher.hashContent(file.file, {
        compareText: options.compareText ?? true,
        compareMetadata: options.compareMetadata ?? false,
      });
      file.hash = hash;

      if (!hashMap.has(hash)) {
        hashMap.set(hash, []);
      }
      hashMap.get(hash)!.push(file);
    }

    return this.createGroups(hashMap);
  }

  /**
   * Hybrid detection - uses both hash and content
   */
  async detectHybrid(
    files: PDFFile[],
    options: Pick<DetectionOptions, 'compareText' | 'compareMetadata'>
  ): Promise<DuplicateGroup[]> {
    const hashMap = new Map<string, PDFFile[]>();

    for (const file of files) {
      const fileHash = await this.hasher.hashFile(file.file);
      const contentHash = await this.hasher.hashContent(file.file, {
        compareText: options.compareText ?? true,
        compareMetadata: options.compareMetadata ?? false,
      });
      const hash = `${fileHash}:${contentHash}`;
      file.hash = hash;

      if (!hashMap.has(hash)) {
        hashMap.set(hash, []);
      }
      hashMap.get(hash)!.push(file);
    }

    return this.createGroups(hashMap);
  }

  /**
   * Fuzzy matching with similarity threshold
   */
  async detectFuzzy(
    files: PDFFile[],
    threshold: number,
    options: Pick<DetectionOptions, 'compareText' | 'compareMetadata' | 'caseSensitive' | 'ignoreWhitespace' | 'ignorePunctuation'>
  ): Promise<DuplicateGroup[]> {
    // First get content hashes
    const contentHashes = new Map<PDFFile, string>();
    
    for (const file of files) {
      const hash = await this.hasher.hashContent(file.file, {
        compareText: options.compareText ?? true,
        compareMetadata: options.compareMetadata ?? false,
      });
      contentHashes.set(file, hash);
    }

    // Group by similarity
    const groups: DuplicateGroup[] = [];
    const processed = new Set<PDFFile>();

    for (const file1 of files) {
      if (processed.has(file1)) continue;

      const similarFiles: PDFFile[] = [file1];
      const hash1 = contentHashes.get(file1)!;

      for (const file2 of files) {
        if (file1.id === file2.id || processed.has(file2)) continue;

        const hash2 = contentHashes.get(file2)!;
        const similarity = this.calculateSimilarity(hash1, hash2, options);

        if (similarity >= threshold) {
          similarFiles.push(file2);
          processed.add(file2);
        }
      }

      if (similarFiles.length > 1) {
        processed.add(file1);
        groups.push({
          hash: hash1,
          files: similarFiles,
          keepFile: similarFiles[0],
          duplicates: similarFiles.slice(1),
        });
      }
    }

    return groups;
  }

  /**
   * Token-based comparison
   */
  async detectToken(
    files: PDFFile[],
    options: Pick<DetectionOptions, 'compareText' | 'caseSensitive' | 'ignoreWhitespace' | 'ignorePunctuation'>
  ): Promise<DuplicateGroup[]> {
    // Extract tokens from each file and compare
    const tokenMap = new Map<string, PDFFile[]>();

    for (const file of files) {
      const tokens = await this.extractTokens(file, options);
      const tokenHash = this.hashTokens(tokens);
      file.hash = tokenHash;

      if (!tokenMap.has(tokenHash)) {
        tokenMap.set(tokenHash, []);
      }
      tokenMap.get(tokenHash)!.push(file);
    }

    return this.createGroups(tokenMap);
  }

  /**
   * Calculate similarity between two hashes
   */
  private calculateSimilarity(
    hash1: string,
    hash2: string,
    options: Pick<DetectionOptions, 'caseSensitive' | 'ignoreWhitespace' | 'ignorePunctuation'>
  ): number {
    // Simple similarity based on common characters
    // In a real implementation, you'd use more sophisticated algorithms
    const h1 = options.caseSensitive ? hash1 : hash1.toLowerCase();
    const h2 = options.caseSensitive ? hash2 : hash2.toLowerCase();

    let matches = 0;
    const minLength = Math.min(h1.length, h2.length);
    const maxLength = Math.max(h1.length, h2.length);

    for (let i = 0; i < minLength; i++) {
      if (h1[i] === h2[i]) matches++;
    }

    return matches / maxLength;
  }

  /**
   * Extract tokens from file content
   */
  private async extractTokens(
    file: PDFFile,
    options: Pick<DetectionOptions, 'compareText' | 'caseSensitive' | 'ignoreWhitespace' | 'ignorePunctuation'>
  ): Promise<string[]> {
    // This is a simplified version
    // In a real implementation, you'd extract actual text tokens from PDF
    const hash = await this.hasher.hashContent(file.file, {
      compareText: options.compareText ?? true,
      compareMetadata: false,
    });

    // Split hash into "tokens" (simplified)
    return hash.match(/.{8}/g) || [];
  }

  /**
   * Hash tokens array
   */
  private hashTokens(tokens: string[]): string {
    return tokens.sort().join('|');
  }

  /**
   * Create duplicate groups from hash map
   */
  private createGroups(hashMap: Map<string, PDFFile[]>): DuplicateGroup[] {
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
}

