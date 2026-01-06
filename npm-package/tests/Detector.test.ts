/**
 * Tests for DuplicatePDFDetector
 */

import { DetectionMethod } from '../src/types';
import { DuplicatePDFDetector } from '../src/core/Detector';

// Mock File objects for testing
function createMockFile(name: string, content: string = 'test content'): File {
  const blob = new Blob([content], { type: 'application/pdf' });
  return new File([blob], name, { type: 'application/pdf' });
}

describe('DuplicatePDFDetector', () => {
  let detector: DuplicatePDFDetector;

  beforeEach(() => {
    detector = new DuplicatePDFDetector();
  });

  afterEach(() => {
    detector.clearFiles();
  });

  describe('addFiles', () => {
    it('should add PDF files successfully', async () => {
      const file1 = createMockFile('test1.pdf');
      const file2 = createMockFile('test2.pdf');

      const result = await detector.addFiles([file1, file2]);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('test1.pdf');
      expect(result[1].name).toBe('test2.pdf');
    });

    it('should filter out non-PDF files', async () => {
      const pdfFile = createMockFile('test.pdf');
      const textFile = new File(['text'], 'test.txt', { type: 'text/plain' });

      const result = await detector.addFiles([pdfFile, textFile]);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('test.pdf');
    });

    it('should handle empty file list', async () => {
      const result = await detector.addFiles([]);

      expect(result).toHaveLength(0);
    });
  });

  describe('detectDuplicates', () => {
    it('should detect exact duplicates', async () => {
      const file1 = createMockFile('test1.pdf', 'same content');
      const file2 = createMockFile('test2.pdf', 'same content');
      const file3 = createMockFile('test3.pdf', 'different content');

      await detector.addFiles([file1, file2, file3]);

      const result = await detector.detectDuplicates({ method: 'exact' });

      expect(result.totalFiles).toBe(3);
      expect(result.duplicateGroups.length).toBeGreaterThan(0);
      expect(result.duplicatesFound).toBeGreaterThan(0);
    });

    it('should return empty result for no files', async () => {
      const result = await detector.detectDuplicates();

      expect(result.totalFiles).toBe(0);
      expect(result.duplicateGroups).toHaveLength(0);
      expect(result.duplicatesFound).toBe(0);
    });

    it('should use different detection methods', async () => {
      const file1 = createMockFile('test1.pdf');
      const file2 = createMockFile('test2.pdf');

      await detector.addFiles([file1, file2]);

      const methods: DetectionMethod[] = ['exact', 'hash', 'content', 'hybrid'];

      for (const method of methods) {
        const result = await detector.detectDuplicates({ method });
        expect(result.method).toBe(method);
        expect(result.totalFiles).toBe(2);
      }
    });

    it('should support fuzzy matching with threshold', async () => {
      const file1 = createMockFile('test1.pdf', 'similar content');
      const file2 = createMockFile('test2.pdf', 'similar content');

      await detector.addFiles([file1, file2]);

      const result = await detector.detectDuplicates({
        method: 'fuzzy',
        threshold: 0.8,
      });

      expect(result.threshold).toBe(0.8);
      expect(result.method).toBe('fuzzy');
    });

    it('should call progress callback', async () => {
      const file1 = createMockFile('test1.pdf');
      await detector.addFiles([file1]);

      const progressCalls: Array<[number, string]> = [];
      const onProgress = (progress: number, status: string) => {
        progressCalls.push([progress, status]);
      };

      await detector.detectDuplicates({ onProgress });

      expect(progressCalls.length).toBeGreaterThan(0);
      expect(progressCalls[0][0]).toBeGreaterThanOrEqual(0);
    });

    it('should handle errors gracefully', async () => {
      const file1 = createMockFile('test1.pdf');
      await detector.addFiles([file1]);

      const errors: string[] = [];
      const onError = (error: Error) => {
        errors.push(error.message);
      };

      const result = await detector.detectDuplicates({ onError });

      // Should complete even if errors occur
      expect(result).toBeDefined();
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicates and keep one file', async () => {
      const file1 = createMockFile('test1.pdf', 'same');
      const file2 = createMockFile('test2.pdf', 'same');
      const file3 = createMockFile('test3.pdf', 'different');

      await detector.addFiles([file1, file2, file3]);
      await detector.detectDuplicates({ method: 'exact' });

      const remaining = detector.removeDuplicates('first');

      expect(remaining.length).toBeLessThan(3);
    });

    it('should support different keep strategies', async () => {
      const file1 = createMockFile('test1.pdf', 'same');
      const file2 = createMockFile('test2.pdf', 'same');

      await detector.addFiles([file1, file2]);
      await detector.detectDuplicates();

      const strategies = ['first', 'smallest', 'largest', 'newest', 'oldest'] as const;

      for (const strategy of strategies) {
        detector.clearFiles();
        await detector.addFiles([file1, file2]);
        await detector.detectDuplicates();
        const result = detector.removeDuplicates(strategy);
        expect(result.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should support async removeDuplicates', async () => {
      const file1 = createMockFile('test1.pdf', 'same');
      const file2 = createMockFile('test2.pdf', 'same');

      await detector.addFiles([file1, file2]);
      await detector.detectDuplicates();

      const remaining = await detector.removeDuplicatesAsync('first');

      expect(remaining).toBeDefined();
      expect(Array.isArray(remaining)).toBe(true);
    });
  });

  describe('getUniqueFiles', () => {
    it('should return unique files only', async () => {
      const file1 = createMockFile('test1.pdf', 'same');
      const file2 = createMockFile('test2.pdf', 'same');
      const file3 = createMockFile('test3.pdf', 'different');

      await detector.addFiles([file1, file2, file3]);
      await detector.detectDuplicates();

      const unique = detector.getUniqueFiles();

      expect(unique.length).toBeGreaterThan(0);
      expect(unique.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getDuplicateGroups', () => {
    it('should return duplicate groups', async () => {
      const file1 = createMockFile('test1.pdf', 'same');
      const file2 = createMockFile('test2.pdf', 'same');

      await detector.addFiles([file1, file2]);
      await detector.detectDuplicates();

      const groups = detector.getDuplicateGroups();

      expect(Array.isArray(groups)).toBe(true);
    });
  });

  describe('file management', () => {
    it('should remove file by ID', async () => {
      const file1 = createMockFile('test1.pdf');
      const result = await detector.addFiles([file1]);

      const fileId = result[0].id;
      detector.removeFile(fileId);

      const files = detector.getFiles();
      expect(files).toHaveLength(0);
    });

    it('should clear all files', async () => {
      const file1 = createMockFile('test1.pdf');
      await detector.addFiles([file1]);

      detector.clearFiles();

      const files = detector.getFiles();
      expect(files).toHaveLength(0);
    });
  });
});

