import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadCertificate.css';


import Back from '../../assets/overlay/back.png';
import Upload from '../../assets/overlay/upload.png';
import Med from '../../assets/overlay/med.png';
import File from '../../assets/overlay/file.png';
import Replace from '../../assets/overlay/replace.png';
import Close from '../../assets/overlay/close.png';


const UploadCertificate = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showMedcertOverlay, setShowMedcertOverlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [progress, setProgress] = useState(70);

  const navigate = useNavigate();

  const handleNotifyClick = () => {
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 3000);
  };

  const handleJavaNCIIclick = () => {
    setShowMedcertOverlay(true);
  };

  const handleRedirect = () => {
    setShowOverlay(false);
    navigate('/certificate');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setProgress(100);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`File "${fileName}" uploaded successfully!`);
      setSelectedFile(null);
      setFileName('');
      setFileSize('');
      setProgress(70);
      navigate('/upload-certificate');
    } else {
      alert('Please select a file to upload.');
    }
  };

  const handleBack = () => {
    setShowMedcertOverlay(false);
  };

  return (
    <main className="certificate-cards-card">
      <section className="certificate-cards-card-indicator" />

      {/* Profile Section */}
      <section className="certificate-cards-card-profile">
        <Circle_Primary className="certificate-cards-card-profile-svg" />
        <div className="certificate-cards-card-profile-info">
          <p className="certificate-cards-card-profile-info-text">Juan Dela R. Cruz</p>
          <p className="certificate-cards-card-profile-info-job">Chief Engineer</p>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="certificate-cards-card-certificates">
        <div className="certificate-cards-card-certificates-1">
          <div className="certificate-cards-card-certificates-1-text">
            <p className="certificate-cards-card-certificates-1-text-sub">As of now</p>
            <p className="certificate-cards-card-certificates-1-text-heading">No upload</p>
          </div>
          <button
            className="certificate-cards-card-certificates-1-button"
            onClick={handleNotifyClick}
            aria-label="Notify upload"
          >
            <p>Notify upload</p>
            <Bell className="certificate-cards-card-certificates-1-icon" />
          </button>
        </div>

        {[2, 3, 4].map((num) => (
          <div key={num} className={`certificate-cards-card-certificates-${num}`}>
            <div className={`certificate-cards-card-certificates-${num}-text`}>
              <p className={`certificate-cards-card-certificates-${num}-text-sub`}>Expires at</p>
              <p className={`certificate-cards-card-certificates-${num}-text-heading`}>FEB-28-2025</p>
            </div>
            <button
              className={`certificate-cards-card-certificates-${num}-button`}
              onClick={handleJavaNCIIclick}
              aria-label="Java NCII certificate"
            >
              <p>Java NCII</p>
              <Note_Search className="certificate-cards-card-certificates-1-icon" />
            </button>
          </div>
        ))}
      </section>

      {/* Bottom Add Calendar Button */}
      <section className="certificate-cards-card-button">
        <button aria-label="Add Calendar Event">
          <Calendar_Add className="certificate-cards-card-button-svg" />
        </button>
      </section>

      {/* Notify Overlay */}
      {showOverlay && (
        <div className="overlay-notify">
          <div className="overlay-content-notify">
            <h1>Notification Sent</h1>
            <p>We've sent them a reminder to upload their certificate</p>
            <img src={NotifyImg} alt="Notification Sent" className="notify-img" />
            <button className="overlay-content-notify-button" onClick={handleRedirect}>
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Upload Certificate Overlay */}
      {showMedcertOverlay && (
        <div className="overlay-upload">
          <div className="upload-container">
            <img src={Back} alt="Back" className="back-img" onClick={handleBack} />
            <img src={Upload} alt="Upload Certificate" className="upload-img" />
            <h2 className="upload-title">Upload Certificate</h2>

            <div className="upload-box">
              <label className="file-label" htmlFor="file-type">File Upload</label>
              <h2 className="file-description">Select the type of certificate</h2>
              <img src={Med} alt="Certificate Type" className="med-img" />
              <select className="file-type" id="file-type">
                <option value="medical">Medical</option>
                <option value="other">Other</option>
              </select>

              {/* Date Picker */}
              <div className="upload-details">
                <label className="date-description" htmlFor="date-input">
                  Select expiration date
                </label>
                <input
                  type="date"
                  id="date-input"
                  className="date-input"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="file-upload">
              <img src={File} alt="File Icon" className="file-img" />
              <div className="file-info">
                <p className="file-name">{fileName || 'No file selected'}</p>
                <p className="file-size">{fileSize || '0 MB'}</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <button
                className="replace-btn"
                onClick={() => document.getElementById('file-upload').click()}
                aria-label="Replace File"
              >
                Replace File
              </button>
            </div>

            <input
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <img src={Replace} alt="Replace Icon" className="replace-img" />
            <img src={Close} alt="Close Overlay" className="close-img" onClick={handleBack} />

            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Upload File
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default UploadCertificate;