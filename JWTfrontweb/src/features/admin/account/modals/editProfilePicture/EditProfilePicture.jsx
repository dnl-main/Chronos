import React, { useRef, useState, useEffect } from 'react';
import './editProfilePicture.css';
import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';
import axios from 'axios';

const departments = {
  Accounting: ['Accountant', 'Auditor', 'Clerk'],
  Crewing: ['Crew Manager', 'Recruiter', 'Scheduler'],
  Medical: ['Doctor', 'Nurse', 'MedTech'],
};

const ChangeProfilePicture = ({ onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [loadingProfilePicture, setLoadingProfilePicture] = useState(false);
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDept, setSelectedDept] = useState('');
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [isEditing, setIsEditing] = useState(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      setSelectedDept(user.department || '');
      setSelectedJob(user.position || '');
    }
  }, []);

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
        setError(response.data.message || 'Failed to upload profile picture.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setError(`Upload failed: ${msg}`);
    } finally {
      setLoadingProfilePicture(false);
      setSelectedFile(null);
    }
  };


  const isPositionInfoSaved = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  return user?.position && user?.department &&
         user.position === selectedJob &&
         user.department === selectedDept;
};


  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    setJobTitles(departments[dept] || []);
    setSelectedJob('');
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (!selectedDept || !selectedJob) {
      setError('Please select a department and enter a job title.');
      return;
    }

    setLoadingPosition(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/user/update-position`,
        { position: selectedJob, department: selectedDept },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      if (response.data.status) {
        alert('Position and department updated successfully!');
        setIsEditing(false);
        const updatedUser = {
          ...JSON.parse(sessionStorage.getItem('user')),
          position: selectedJob,
          department: selectedDept,
          needs_position: false,
        };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update position and department.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setError(`Failed to update position and department: ${msg}`);
    } finally {
      setLoadingPosition(false);
    }
  };

  const handleDiscard = () => {
  if (!isPositionInfoSaved()) {
    setError('Please set and save your department and job title before discarding.');
    return;
  }

  setSelectedDept('');
  setSelectedJob('');
  setIsEditing(false);
  onClose();
};



  return (
    <div className="changePP">
      <div className="changepassword-main">
        <header className="changePP-main-header">
          <div className="changePP-main-header-core">
            <div className="changePP-main-header-core-svg">
              <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            </div>
            <div className="changePP-main-header-core-text">
              <p className="changePP-main-header-core-text-semibold">Edit Profile</p>
              <p className="changePP-main-header-core-text-light">Update your profile picture or position</p>
            </div>
          </div>
          <div className="changePP-main-header-line"></div>
        </header>

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

        <div className="changePP-main-fields">
          <label>Department</label>
          <select value={selectedDept} onChange={handleDeptChange} disabled={!isEditing || loadingPosition}>
            <option value="">Select Department</option>
            {Object.keys(departments).map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <label>Job Title</label>
          <input
            type="text"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            placeholder="Enter Job Title"
            disabled={!isEditing || loadingPosition}
          />

          <div className="changePP-main-role-buttons" style={{ marginTop: '15px' }}>
            {!isEditing ? (
              <button
                className="changePP-role-button changePP-role-button-edit"
                onClick={handleEdit}
                disabled={loadingPosition}
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  className="changePP-role-button changePP-role-button-save"
                  onClick={handleSave}
                  disabled={!selectedDept || !selectedJob || loadingPosition}
                >
                  {loadingPosition ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="changePP-role-button changePP-role-button-discard"
                  onClick={handleDiscard}
                  disabled={loadingPosition}
                >
                  Discard
                </button>
              </>
            )}
          </div>
        </div>

        <div className="changePP-main-buttons" style={{ marginTop: '30px' }}>
          <button
            className="changePP-main-buttons-cancel"
            onClick={() => {
  if (!isPositionInfoSaved()) {
    setError('Please set and save your department and job title before cancelling.');
    return;
  }
  onClose(false);
}}

          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;