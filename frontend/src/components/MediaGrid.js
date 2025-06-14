import React, { useState } from 'react';
import { Trash2, Download, Eye, FileText, Calendar } from 'lucide-react';
import axios from 'axios';

const MediaGrid = ({ media, onMediaDeleted }) => {
  const [deleting, setDeleting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleDelete = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    setDeleting(mediaId);
    
    try {
      await axios.delete(`http://localhost:8001/api/media/${mediaId}`);
      onMediaDeleted(mediaId);
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  const handleView = (media) => {
    setSelectedMedia(media);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="media-grid">
        {media.map((item) => (
          <div key={item.id} className="media-card">
            <div className="media-preview">
              {item.is_image ? (
                <img 
                  src={item.url} 
                  alt={item.original_name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="pdf-preview">
                  <FileText size={48} />
                </div>
              )}
              <div className="media-overlay">
                <button 
                  onClick={() => handleView(item)}
                  className="overlay-btn"
                  title="View"
                >
                  <Eye size={16} />
                </button>
                <a 
                  href={item.url}
                  download={item.original_name}
                  className="overlay-btn"
                  title="Download"
                >
                  <Download size={16} />
                </a>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="overlay-btn delete-btn"
                  disabled={deleting === item.id}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="media-info">
              <h4 className="media-name" title={item.original_name}>
                {item.original_name}
              </h4>
              <div className="media-details">
                <span className="file-size">{formatFileSize(item.size)}</span>
                <span className="file-type">{item.mime_type}</span>
              </div>
              <div className="media-date">
                <Calendar size={12} />
                {formatDate(item.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing media */}
      {showModal && selectedMedia && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedMedia.original_name}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {selectedMedia.is_image ? (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.original_name}
                  className="modal-image"
                />
              ) : (
                <div className="pdf-viewer">
                  <iframe 
                    src={selectedMedia.url}
                    title={selectedMedia.original_name}
                    width="100%"
                    height="600"
                  />
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <div className="file-info">
                <p><strong>Size:</strong> {formatFileSize(selectedMedia.size)}</p>
                <p><strong>Type:</strong> {selectedMedia.mime_type}</p>
                <p><strong>Uploaded:</strong> {formatDate(selectedMedia.created_at)}</p>
              </div>
              <div className="modal-actions">
                <a 
                  href={selectedMedia.url}
                  download={selectedMedia.original_name}
                  className="btn btn-outline"
                >
                  <Download size={16} />
                  Download
                </a>
                <button 
                  onClick={() => {
                    handleDelete(selectedMedia.id);
                    setShowModal(false);
                  }}
                  className="btn btn-danger"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGrid;