import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';

const MediaUpload = ({ onMediaUploaded, onCancel }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setError('');
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only images (JPEG, PNG, GIF) and PDF files are allowed');
      return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const response = await axios.post('http://localhost:8001/api/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onMediaUploaded(response.data.data);
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <FileImage size={24} />;
    } else if (file.type === 'application/pdf') {
      return <FileText size={24} />;
    }
    return <FileText size={24} />;
  };

  return (
    <div className="media-upload">
      <div className="upload-header">
        <h3>Upload Media File</h3>
        <button onClick={onCancel} className="close-btn">
          <X size={20} />
        </button>
      </div>
      
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      <div 
        className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        {selectedFile ? (
          <div className="selected-file">
            {getFileIcon(selectedFile)}
            <div className="file-info">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <Upload size={48} />
            <h4>Drop files here or click to browse</h4>
            <p>Support for images (JPEG, PNG, GIF) and PDF files</p>
            <p className="size-limit">Maximum file size: 10MB</p>
          </div>
        )}
      </div>
      
      {selectedFile && (
        <div className="upload-actions">
          <button 
            onClick={() => setSelectedFile(null)}
            className="btn btn-outline"
          >
            Remove
          </button>
          <button 
            onClick={handleUpload}
            className="btn btn-primary"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;