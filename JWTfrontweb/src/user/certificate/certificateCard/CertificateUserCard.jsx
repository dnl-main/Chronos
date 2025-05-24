import React, { useState } from 'react';
import './certificateUserCard.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';

const CertificateUserCard = ({ onFileDataChange }) => {
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("expiryDate", expiryDate.toISOString());

    try {
      const response = await fetch('/api/upload-certificate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const fileUrl = URL.createObjectURL(file);
      setUploadedFile(fileUrl);

      // Pass data up
      onFileDataChange({ uploadedFile: fileUrl, expiryDate });
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <main className="certificateUser-top-core-cards-card">
      <div className="certificateUser-top-core-cards-card-up">
        <div className="certificateUser-top-core-cards-card-up-header">
          <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
          <header>Medical certificate</header>
        </div>
        <div className="certificateUser-top-core-cards-card-up-expiry">
          <p className="certificateUser-top-core-cards-card-up-expiry-semibold">Expiration date</p>
          <div className="certificateUser-top-core-cards-card-up-expiry-btn">
            <DatePicker 
              selected={expiryDate} 
              onChange={(date) => setExpiryDate(date)} 
              dateFormat="MMM - dd - yyyy"
              className="date-picker-custom"
            />
          </div>
        </div>
      </div>

      <div className="certificateUser-top-core-cards-card-down">
        <div className="certificateUser-top-core-cards-card-down-text">
          <div className="certificateUser-top-core-cards-card-down-text-bold">
            <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
            <p>Choose a file to upload</p>
          </div>
          <p className="certificateUser-top-core-cards-card-down-text-light">JPEG, PNG, and PDF formats</p>
        </div>

        <div className="certificateUser-top-core-cards-card-down-btn">
          <input 
            type="file" 
            onChange={handleFileUpload} 
            accept=".jpeg,.png,.pdf"
            className="file-upload-input"
          />
        </div>

        {uploadedFile && (
          <div className="certificate-preview">
            <p>Uploaded:</p>
            <a href={uploadedFile} target="_blank" rel="noopener noreferrer">View File</a>
          </div>
        )}
      </div>
    </main>
  );
};

export default CertificateUserCard;
