import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MediaUpload from './MediaUpload';
import MediaGrid from './MediaGrid';
import { Upload, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('http://localhost:8001/api/media');
      setMedia(response.data.data);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMediaUploaded = (newMedia) => {
    setMedia([newMedia, ...media]);
    setShowUpload(false);
  };

  const handleMediaDeleted = (deletedId) => {
    setMedia(media.filter(item => item.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your media...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Manage your images and PDF files</p>
        </div>
        
        <div className="dashboard-actions">
          <button 
            onClick={() => setShowUpload(!showUpload)}
            className="btn btn-primary"
          >
            <Upload size={16} />
            Upload Media
          </button>
          
          <button 
            onClick={fetchMedia}
            className="btn btn-outline"
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {showUpload && (
        <div className="upload-section">
          <MediaUpload 
            onMediaUploaded={handleMediaUploaded}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      )}

      <div className="media-section">
        <div className="section-header">
          <h2>Your Media Files</h2>
          <span className="media-count">
            {media.length} file{media.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {media.length === 0 ? (
          <div className="empty-state">
            <Upload size={48} />
            <h3>No media files yet</h3>
            <p>Upload your first image or PDF to get started</p>
            <button 
              onClick={() => setShowUpload(true)}
              className="btn btn-primary"
            >
              Upload Now
            </button>
          </div>
        ) : (
          <MediaGrid 
            media={media} 
            onMediaDeleted={handleMediaDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;