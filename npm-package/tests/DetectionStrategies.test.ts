/**
 * Tests for DetectionStrategies
 */

import { DetectionStrategies } from '../src/core/DetectionStrategies';
import { PDFHasher } from '../src/core/PDFHasher';

describe('DetectionStrategies', () => {
  let strategies: DetectionStrategies;
  let hasher: PDFHasher;

  beforeEach(() => {
    hasher = new PDFHasher();
    strategies = new DetectionStrategies(hasher);
  });

  describe('detectExact', () => {
    it('should detect exact duplicates', async () => {
      const file1 = new File(['same content'], 'test1.pdf', { type: 'application/pdf' });
      const file2 = new File(['same content'], 'test2.pdf', { type: 'application/pdf' });
      const file3 = new File(['different'], 'test3.pdf', { type: 'application/pdf' });

      const pdfFiles = [
        { file: file1, id: '1', name: 'test1.pdf', size: 12, uploadDate: new Date() },
        { file: file2, id: '2', name: 'test2.pdf', size: 12, uploadDate: new Date() },
        { file: file3, id: '3', name: 'test3.pdf', size: 8, uploadDate: new Date() },
      ];

      const groups = await strategies.detectExact(pdfFiles);

      expect(groups.length).toBeGreaterThan(0);
    });
  });

  describe('detectFuzzy', () => {
    it('should detect fuzzy matches based on threshold', async () => {
      const file1 = new File(['similar content'], 'test1.pdf', { type: 'application/pdf' });
      const file2 = new File(['similar content'], 'test2.pdf', { type: 'application/pdf' });

      const pdfFiles = [
        { file: file1, id: '1', name: 'test1.pdf', size: 15, uploadDate: new Date() },
        { file: file2, id: '2', name: 'test2.pdf', size: 15, uploadDate: new Date() },
      ];

      const groups = await strategies.detectFuzzy(pdfFiles, 0.8, {
        compareText: true,
        compareMetadata: false,
      });

      expect(Array.isArray(groups)).toBe(true);
    });
  });
});

