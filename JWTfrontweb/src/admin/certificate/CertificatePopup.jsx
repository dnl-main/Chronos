import React from 'react';
import axios from 'axios';
import './Certificatepopup.css';

const CertificatePopup = ({ certificate, onClose, onDelete }) => {
  if (!certificate) return null;

  const { file_path, certificate_name, id } = certificate;
  // Use VITE_STORAGE_BASE_URL for storage files
  const storageBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const fileUrl = `${storageBaseUrl}/${encodeURI(file_path)}`;

  const isPdf = file_path.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file_path.toLowerCase());

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`${apiUrl}/certificates/delete`,{id},{
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      alert('Certificate deleted successfully'); // Replace with toast in production
      onDelete(id); // Notify parent to update state
      onClose(); // Close the popup
    } catch (error) {
      // console.error('Failed to delete certificate:', error);
      alert('Failed to delete certificate');
    }
  };

  return (
    <div className="certificate-popup-overlay">
      <div className="certificate-popup">
        <header className="certificate-popup-header">
          <h2>{certificate_name || 'Certificate'}</h2>
          <button className="certificate-popup-close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="certificate-popup-content">
          {isPdf ? (
            <iframe
              src={fileUrl}
              title={certificate_name}
              className="certificate-popup-file"
              // onError={() => console.error('Failed to load PDF:', fileUrl)}
            />
          ) : isImage ? (
            <img
              src={fileUrl}
              alt={certificate_name}
              className="certificate-popup-file"
              // onError={() => console.error('Failed to load image:', fileUrl)}
            />
          ) : (
            <p>Unsupported file type</p>
          )}
        </div>
        <div className="certificate-popup-footer">
          <button className="certificate-popup-delete" onClick={handleDelete}>
            Delete Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificatePopup;