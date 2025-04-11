import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './certificateUser.css';

import Back from '../../assets/overlay/back.png';
import Upload from '../../assets/overlay/upload.png';
import Med from '../../assets/overlay/med.png';
import File from '../../assets/overlay/file.png';
import Replace from '../../assets/overlay/replace.png';
import Close from '../../assets/overlay/close.png';

const CertificateUser = () => {
  const [showMedcertOverlay, setShowMedcertOverlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [progress, setProgress] = useState(0);
  const [filePreview, setFilePreview] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();

  const handleUploadMoreClick = () => {
    setShowMedcertOverlay(true);
  };

  const handleBack = () => {
    setShowMedcertOverlay(false);
    setSelectedFile(null);
    setFileName('');
    setFileSize('');
    setProgress(0);
    setFilePreview(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setProgress(100);

      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreviewUrl(URL.createObjectURL(file));
        setFilePreview(null);
      } else {
        setFilePreview(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`File "${fileName}" uploaded successfully!`);
      
      // Reset states after upload
      setSelectedFile(null);
      setFileName('');
      setFileSize('');
      setProgress(0);
      setFilePreview(null);
      setPreviewUrl(null);

      // Display overlay and navigate to the next route
      setShowMedcertOverlay(true); // Show the MedcertOverlay after the upload

      // Navigate to the 'UploadCertificate' page
      navigate('/upload-certificate');
    } else {
      alert('Please select a file to upload.');
    }
  };

  const handleUploadFileButtonClick = () => {
    setShowMedcertOverlay(true);
  };

  //token
   // State for user and UI
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
 
   // Fetch user data on mount
   useEffect(() => {
     const token = localStorage.getItem('token');
     const storedUser = localStorage.getItem('user');
 
     if (!token) {
       navigate('/login');
       return;
     }
 
     if (storedUser) {
       setUser(JSON.parse(storedUser));
     } else {
       fetchUserData(token);
     }
   }, [navigate]);
 
   const fetchUserData = async (token) => {
     try {
       const response = await axios.get(`${apiUrl}/user`, {
         headers: { Authorization: `Bearer ${token}` },
       });
       setUser(response.data);
       localStorage.setItem('user', JSON.stringify(response.data));
     } catch (error) {
       console.error('Failed to fetch user data:', error);
       navigate('/login');
     }
   };

  return (
    <div className="container">
      <h1>Certificate</h1>

      <div className="certificates">
        {[1, 2, 3, 4].map((id) => (
          <div className="certificate-card" key={id}>
            <h3>Medical Certificate</h3>
            <label htmlFor={`expiration-date-${id}`}>Expiration Date</label>
            <input type="date" id={`expiration-date-${id}`} />
            <label htmlFor={`file-upload-${id}`}>Choose a file to upload</label>
            <input type="file" id={`file-upload-${id}`} accept=".jpg, .jpeg, .png, .pdf" />
            <button onClick={handleUploadMoreClick}>
              {id === 2 ? 'Replace Files' : 'Browse Files'}
            </button>
          </div>
        ))}
      </div>

      <div className="upload-more">
        <button onClick={handleUploadMoreClick}>+ Upload More</button>
      </div>

      {/* Overlay for Uploading More Certificates */}
      {showMedcertOverlay && (
        <div className="overlay-upload">
          <div className="upload-container">
            <img
              src={Back}
              alt="Back"
              className="back-img"
              onClick={handleBack}
            />
            <img src={Upload} alt="Upload Certificate" className="upload-img" />
            <h2 className="upload-title">Upload Certificate</h2>

            <div className="upload-box">
              <label className="file-label">File Upload</label>
              <h2 className="file-description">Select the type of certificate</h2>
              <img src={Med} alt="Certificate Type" className="med-img" />
              <select className="file-type">
                <option value="medical">Medical</option>
                <option value="other">Other</option>
              </select>
              <div className="file-drop-zone">
                <img src={File} alt="Cloud" className="cloud-img" />
                <p className="file-instruction">Choose a file to upload</p>
                <p className="file-types">JPEG, PNG, and PDF formats, up to 50 MB.</p>
                <img src={Replace} alt="Browse" className="browse-img" />
                <input
                  type="file"
                  id="file-upload"
                  className="file-input"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button className="browse-button" onClick={() => document.getElementById('file-upload').click()}>
                  Browse files
                </button>
              </div>
              {selectedFile && <p className="file-name">Selected File: {selectedFile.name}</p>}

              {filePreview && (
                <div className="image-preview-container">
                  <h3>Image Preview:</h3>
                  <img src={filePreview} alt="Preview" className="image-preview" />
                </div>
              )}

              {previewUrl && (
                <div className="pdf-preview-container">
                  <h3 className="pdf-preview-title">PDF Preview:</h3>
                  <iframe
                    src={previewUrl}
                    title="PDF Preview"
                    className="pdf-preview-frame"
                    width="100%"
                    height="400px"
                    style={{ border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' }}
                  />
                </div>
              )}
              
              <button className="upload-button" onClick={handleUpload}>Upload File</button> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateUser;
