/**
 * React hook for duplicate PDF detection
 */

import {
    DetectionResult,
    PDFFile,
    UseDuplicatePDFDetectorOptions,
    UseDuplicatePDFDetectorReturn,
} from '../types';
// @ts-ignore - React will be available as peer dependency
import { useCallback, useRef, useState } from 'react';

import { DuplicatePDFDetector } from '../core/Detector';

export function useDuplicatePDFDetector(
  options: UseDuplicatePDFDetectorOptions = {}
): UseDuplicatePDFDetectorReturn {
  const {
    autoDetect = false,
    onComplete,
    onProgress,
    onError,
    ...detectionOptions
  } = options;

  const [files, setFiles] = useState<PDFFile[]>([]);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const detectorRef = useRef<DuplicatePDFDetector>(new DuplicatePDFDetector());

  /**
   * Detect duplicates
   */
  const detectDuplicates = useCallback(async (): Promise<DetectionResult> => {
    setIsProcessing(true);
    setProgress(0);
    setStatus('Starting detection...');
    setError(null);

    try {
      const detectionResult = await detectorRef.current.detectDuplicates({
        ...detectionOptions,
        onProgress: (prog: number, stat: string) => {
          setProgress(prog);
          setStatus(stat);
          onProgress?.(prog, stat);
        },
        onError: (err: Error, file: PDFFile) => {
          setError(err);
          onError?.(err, file);
        },
      });

      setResult(detectionResult);
      onComplete?.(detectionResult);
      return detectionResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus('Error during detection');
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  }, [detectionOptions, onComplete, onProgress, onError]);

  /**
   * Add files to the detector
   */
  const addFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      try {
        setError(null);
        const addedFiles = await detectorRef.current.addFiles(newFiles);
        const updatedFiles = detectorRef.current.getFiles();
        setFiles(updatedFiles);

        if (autoDetect && updatedFiles.length > 0) {
          await detectDuplicates();
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [autoDetect, detectDuplicates]
  );

  /**
   * Remove a file by ID
   */
  const removeFile = useCallback((id: string) => {
    detectorRef.current.removeFile(id);
    setFiles(detectorRef.current.getFiles());
    setResult(null);
  }, []);

  /**
   * Clear all files
   */
  const clearFiles = useCallback(() => {
    detectorRef.current.clearFiles();
    setFiles([]);
    setResult(null);
    setProgress(0);
    setStatus('');
    setError(null);
  }, []);

  /**
   * Remove duplicates from the file list
   */
  const removeDuplicates = useCallback((): PDFFile[] => {
    const keepStrategy = detectionOptions.keepStrategy || 'first';
    const remainingFiles = detectorRef.current.removeDuplicates(keepStrategy);
    setFiles(remainingFiles);
    return remainingFiles;
  }, [detectionOptions.keepStrategy]);

  /**
   * Get unique files
   */
  const getUniqueFiles = useCallback((): PDFFile[] => {
    return detectorRef.current.getUniqueFiles();
  }, []);

  /**
   * Get duplicate groups
   */
  const getDuplicateGroups = useCallback(() => {
    return detectorRef.current.getDuplicateGroups();
  }, []);

  return {
    files,
    result,
    isProcessing,
    progress,
    status,
    error,
    addFiles,
    removeFile,
    clearFiles,
    detectDuplicates,
    removeDuplicates,
    getUniqueFiles,
    getDuplicateGroups,
  };
}

