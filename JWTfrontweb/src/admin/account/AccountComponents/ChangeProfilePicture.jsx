import React, { useRef, useState } from 'react';
import './changeProfilePicture.css';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import axios from 'axios';

const departments = {
  Accounting: ['Accountant', 'Auditor', 'Clerk'],
  Crewing: ['Crew Manager', 'Recruiter', 'Scheduler'],
  Medical: ['Doctor', 'Nurse', 'MedTech'],
};

const ChangeProfilePicture = ({ onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDept, setSelectedDept] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const [isEditing, setIsEditing] = useState(false);

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
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          const imageUrl = `${baseUrl}/storage/${response.data.profile_picture}`;
          onSave(imageUrl);
          alert('Profile picture updated successfully!');
        } else {
          setError(response.data.message || 'Failed to upload profile picture.');
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message;
        setError(`Upload failed: ${msg}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    setJobTitle(''); // Clear job title when department changes
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    // Placeholder for saving to backend
    if (!selectedDept || !jobTitle) {
      alert('Please select a department and enter a job title.');
      return;
    }
    alert(`Saved: ${selectedDept} - ${jobTitle}`);
    setIsEditing(false);
  };
  const handleDiscard = () => {
    setSelectedDept('');
    setJobTitle('');
    setIsEditing(false);
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
              <p className="changePP-main-header-core-text-light">Update your display picture and details</p>
            </div>
          </div>
          <div className="changePP-main-header-line"></div>
        </header>

        {/* Profile Picture Upload */}
        <div className="changePP-main-section">
          <div className="changePP-main-fields changePP-upload">
            <label htmlFor="profilePicInput">Select new image</label>
            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
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
        </div>

        {/* Separator */}
        <hr className="changePP-main-divider" />

        {/* Department and Job Title Fields */}
        <div className="changePP-main-section">
          <div className="changePP-main-fields">
            <label>Department</label>
            <select value={selectedDept} onChange={handleDeptChange} disabled={!isEditing}>
              <option value="">Select Department</option>
              {Object.keys(departments).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <label>Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={!isEditing || !selectedDept}
              placeholder="Enter job title"
            />
          </div>
        </div>

        {/* Upload Buttons */}
        <div className="changePP-main-buttons">
          <button
            className="changePP-main-buttons-cancel"
            onClick={() => onClose(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="changePP-main-buttons-confirm"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {/* Department/Job Buttons */}
        <div className="changePP-main-buttons">
          {!isEditing ? (
            <button onClick={handleEdit}>Edit</button>
          ) : (
            <>
              <button onClick={handleSave} disabled={!selectedDept || !jobTitle}>Save</button>
              <button onClick={handleDiscard}>Discard</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;