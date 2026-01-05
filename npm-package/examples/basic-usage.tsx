/**
 * Basic usage example
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - React will be available in the consuming project
import React from 'react';
import { useDuplicatePDFDetector } from '../src';

export function BasicExample() {
  const {
    files,
    result,
    isProcessing,
    progress,
    status,
    addFiles,
    detectDuplicates,
    removeDuplicates,
    clearFiles,
  } = useDuplicatePDFDetector({
    method: 'hybrid',
    keepStrategy: 'smallest',
    onProgress: (prog, stat) => {
      console.log(`Progress: ${prog}% - ${stat}`);
    },
    onComplete: (result) => {
      console.log('Detection complete:', result);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await addFiles(e.target.files);
    }
  };

  const handleDetect = async () => {
    try {
      await detectDuplicates();
    } catch (error) {
      console.error('Detection error:', error);
    }
  };

  const handleRemoveDuplicates = () => {
    removeDuplicates();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>SanitixPDF - Duplicate Detector</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={isProcessing}
        />
        <button onClick={clearFiles} style={{ marginLeft: '10px' }}>
          Clear
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleDetect} disabled={isProcessing || files.length === 0}>
          {isProcessing ? 'Processing...' : 'Detect Duplicates'}
        </button>
        {result && (
          <button onClick={handleRemoveDuplicates} style={{ marginLeft: '10px' }}>
            Remove Duplicates
          </button>
        )}
      </div>

      {isProcessing && (
        <div style={{ marginBottom: '20px' }}>
          <div>Progress: {progress}%</div>
          <div>Status: {status}</div>
          <progress value={progress} max={100} />
        </div>
      )}

      {result && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0' }}>
          <h2>Results</h2>
          <p>Total Files: {result.totalFiles}</p>
          <p>Unique Files: {result.uniqueFiles}</p>
          <p>Duplicates Found: {result.duplicatesFound}</p>
          <p>Processing Time: {result.processingTime}ms</p>

          {result.duplicateGroups.length > 0 && (
            <div>
              <h3>Duplicate Groups:</h3>
              {result.duplicateGroups.map((group, idx) => (
                <div key={idx} style={{ marginTop: '10px', padding: '10px', background: 'white' }}>
                  <p>Group {idx + 1} ({group.files.length} files):</p>
                  <ul>
                    <li>Keep: {group.keepFile.name}</li>
                    {group.duplicates.map((dup, i) => (
                      <li key={i}>Duplicate: {dup.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h2>Files ({files.length})</h2>
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              {file.name} ({Math.round(file.size / 1024)} KB)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

