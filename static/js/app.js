// Global state
let uploadInterval = null;
let statusInterval = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeUpload();
    loadStats();
    setInterval(loadStats, 5000); // Refresh stats every 5 seconds
});

// Upload functionality
function initializeUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(f => 
            f.name.toLowerCase().endsWith('.pdf')
        );
        handleFiles(files);
    });
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    });
}

async function handleFiles(files) {
    const uploadedFilesDiv = document.getElementById('uploadedFiles');
    const progressDiv = document.getElementById('uploadProgress');
    
    progressDiv.classList.remove('hidden');
    progressDiv.innerHTML = '<p>Uploading files...</p>';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok) {
                const fileItem = document.createElement('div');
                fileItem.className = 'uploaded-file-item';
                fileItem.innerHTML = `
                    <div>
                        <i class="fas fa-check-circle"></i>
                        <span>${data.filename}</span>
                    </div>
                    <span>${formatFileSize(file.size)}</span>
                `;
                uploadedFilesDiv.appendChild(fileItem);
            } else {
                showNotification(`Error uploading ${file.name}: ${data.error}`, 'error');
            }
        } catch (error) {
            showNotification(`Error uploading ${file.name}: ${error.message}`, 'error');
        }
    }
    
    progressDiv.classList.add('hidden');
    loadStats();
}

// Processing
async function startProcessing() {
    const processBtn = document.getElementById('processBtn');
    const statusDiv = document.getElementById('processingStatus');
    
    processBtn.disabled = true;
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    statusDiv.classList.remove('hidden');
    
    try {
        const response = await fetch('/api/process', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Start polling for status
            statusInterval = setInterval(checkProcessingStatus, 1000);
            checkProcessingStatus();
        } else {
            showNotification(data.error || 'Failed to start processing', 'error');
            processBtn.disabled = false;
            processBtn.innerHTML = '<i class="fas fa-play"></i> Start Processing';
        }
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
        processBtn.disabled = false;
        processBtn.innerHTML = '<i class="fas fa-play"></i> Start Processing';
    }
}

async function checkProcessingStatus() {
    try {
        const response = await fetch('/api/status');
        const status = await response.json();
        
        const progressBar = document.getElementById('progressBar');
        const statusText = document.getElementById('statusText');
        const processBtn = document.getElementById('processBtn');
        
        progressBar.style.width = status.progress + '%';
        progressBar.textContent = status.progress + '%';
        statusText.textContent = status.current_status || 'Processing...';
        
        if (status.stats) {
            updateStatistics(status.stats);
        }
        
        if (!status.is_processing) {
            clearInterval(statusInterval);
            processBtn.disabled = false;
            processBtn.innerHTML = '<i class="fas fa-play"></i> Start Processing';
            
            if (status.error) {
                showNotification(`Error: ${status.error}`, 'error');
            } else {
                showNotification('Processing completed successfully!', 'success');
                loadStats();
            }
        }
    } catch (error) {
        console.error('Error checking status:', error);
    }
}

// Statistics
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        // Update file counts
        document.getElementById('sourceCount').textContent = data.source.count;
        document.getElementById('finalCount').textContent = data.final.count;
        
        // Update file lists
        updateFileList('sourceFileList', data.source.files, false);
        updateFileList('finalFileList', data.final.files, true);
        
        // Update total PDFs stat
        document.getElementById('totalPdfs').textContent = data.source.count;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function updateFileList(listId, files, isFinal) {
    const listDiv = document.getElementById(listId);
    
    if (files.length === 0) {
        listDiv.innerHTML = '<p class="empty-message">No PDFs in this folder</p>';
        return;
    }
    
    listDiv.innerHTML = files.map(file => `
        <div class="file-item">
            <div class="file-item-info">
                <i class="fas fa-file-pdf file-item-icon"></i>
                <div class="file-item-details">
                    <div class="file-item-name" title="${file.name}">${file.name}</div>
                    <div class="file-item-size">${file.size_mb} MB • ${formatDate(file.modified)}</div>
                </div>
            </div>
            ${isFinal ? `
                <div class="file-item-actions">
                    <button class="btn-icon" onclick="downloadFile('${file.name}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function updateStatistics(stats) {
    document.getElementById('totalPdfs').textContent = stats.total_pdfs || 0;
    document.getElementById('uniquePdfs').textContent = stats.unique_pdfs || 0;
    document.getElementById('duplicatePdfs').textContent = stats.duplicates_found || 0;
    document.getElementById('removedPdfs').textContent = stats.duplicates_removed || 0;
}

// Clear functions
async function clearSource() {
    if (!confirm('Are you sure you want to clear all PDFs from the source folder?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/clear-source', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Source folder cleared', 'success');
            loadStats();
        } else {
            showNotification(data.error || 'Failed to clear source folder', 'error');
        }
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
}

async function clearFinal() {
    if (!confirm('Are you sure you want to clear all PDFs from the final folder?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/clear-final', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Final folder cleared', 'success');
            loadStats();
        } else {
            showNotification(data.error || 'Failed to clear final folder', 'error');
        }
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// Download file
function downloadFile(filename) {
    window.open(`/api/download/${encodeURIComponent(filename)}`, '_blank');
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function showNotification(message, type = 'info') {
    // Simple notification - you can enhance this with a toast library
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

