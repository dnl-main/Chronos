import React, { useRef } from 'react';
import './changeProfilePicture.css';

import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';

const ChangeProfilePicture = ({ onClose, onSave }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSave(file);
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
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>

        <div className="changePP-main-buttons">
          <button className="changePP-main-buttons-cancel" onClick={() => onClose(false)}>
            <p>Cancel</p>
          </button>
          <button className="changePP-main-buttons-confirm" onClick={() => fileInputRef.current?.click()}>
            <p>Upload</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;
