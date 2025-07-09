import React, { useRef, useState } from 'react';
import axios from 'axios';

const ProfilePictureUploader = ({ onSave, onError }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingProfilePicture, setLoadingProfilePicture] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setLoadingProfilePicture(true);
    setError(null);

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/user/upload-profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const imageUrl = `${baseUrl}/storage/${response.data.profile_picture}`;
        onSave(imageUrl);
        alert('Profile picture updated successfully!');
      } else {
        const msg = response.data.message || 'Failed to upload profile picture.';
        setError(msg);
        onError?.(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setError(`Upload failed: ${msg}`);
      onError?.(msg);
    } finally {
      setLoadingProfilePicture(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="changePP-main-fields">
      <label htmlFor="profilePicInput">Select new image</label>
      <input
        id="profilePicInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={loadingProfilePicture}
      />

      {loadingProfilePicture && (
        <div className="loading-bar-container" style={{ marginTop: '10px' }}>
          <div className="loading-bar"></div>
          <span>Uploading...</span>
        </div>
      )}

      {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <div className="changePP-upload-buttons">
        <button
          className="changePP-upload-button changePP-upload-button-choose"
          onClick={() => fileInputRef.current?.click()}
          disabled={loadingProfilePicture}
        >
          Choose Picture
        </button>

        {selectedFile && (
          <button
            className="changePP-upload-button changePP-upload-button-confirm"
            onClick={handleConfirmUpload}
            disabled={loadingProfilePicture}
          >
            {loadingProfilePicture ? 'Uploading...' : 'Confirm Upload'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
