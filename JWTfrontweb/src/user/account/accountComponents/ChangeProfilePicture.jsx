import React, { useRef, useState } from 'react';
import './changeProfilePicture.css';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import axios from 'axios';

const ChangeProfilePicture = ({ onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000';

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append('profile_picture', file);

      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post(`${apiUrl}/user/upload-profile-picture`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' ,
            'ngrok-skip-browser-warning': 'true'
          },
        });

        if (response.data.success) {
          // Prepend /storage/ to the relative path for display
          const imageUrl = `${baseUrl}/storage/${response.data.profile_picture}`;
          onSave(imageUrl);
          alert('Profile picture updated successfully!');
        } else {
          setError(response.data.message || 'Failed to upload profile picture.');
        }
      } catch (error) {
        // console.log('Error Response:', error.response?.data, error.request, error.message);
        if (error.response) {
          const status = error.response.status;
          const errorMessage = error.response.data?.errors
            ? Object.values(error.response.data.errors).flat().join(' ')
            : error.response.data?.message || error.message;
          setError(`Upload failed (${status}): ${errorMessage}`);
        } else if (error.request) {
          setError('CORS error: Unable to reach server. Check server CORS settings or network.');
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="changePP">
      <div className="changePP-main">
        <header className="changePP-main-header">
          <div className="changePP-main-header-core">
            <div className="changePP-main-header-core-svg">
              <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            </div>
            <div className="changePP-main-header-core-text">
              <p className="changePP-main-header-core-text-semibold">Change profile picture</p>
              <p className="changePP-main-header-core-text-light">Upload a new display picture</p>
            </div>
          </div>
          <div className="changePP-main-header-line"></div>
        </header>

        <div className="changePP-main-fields">
          <label htmlFor="profilePicInput">Select new image</label>
          <input
            id="profilePicInput"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp,image/heic,image/heif"
            onChange={handleFileChange}
            ref={fileInputRef}
            disabled={loading}
          />
          {loading && (
            <div className="loading-bar-container" style={{ marginTop: '10px' }}>
              <div className="loading-bar"></div>
              <span>Uploading...</span>
            </div>
          )}
          {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>

        <div className="changePP-main-buttons">
          <button
            className="changePP-main-buttons-cancel"
            onClick={() => onClose(false)}
            disabled={loading}
          >
            <p>Cancel</p>
          </button>
          <button
            className="changePP-main-buttons-confirm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <p>{loading ? 'Uploading...' : 'Upload'}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;