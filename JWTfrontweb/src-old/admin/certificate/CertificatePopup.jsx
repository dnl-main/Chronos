import React from 'react';
import axios from 'axios';
import './Certificatepopup.css';

const CertificatePopup = ({ certificate, onClose, onDelete }) => {
  if (!certificate) return null;

  const { file_path, certificate_name, id } = certificate;
  const storageBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const fileUrl = `${storageBaseUrl}/${encodeURI(file_path)}?ngrok-skip-browser-warning=true`;

  const isPdf = file_path.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file_path.toLowerCase());

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const token = sessionStorage.getItem('token');
      await axios.post(
        `${apiUrl}/certificates/delete`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          withCredentials: true,
        }
      );
      alert('Certificate deleted successfully');
      if (typeof onDelete === 'function') {
        onDelete(id);
      }
      onClose();
    } catch (error) {
      alert('Failed to delete certificate');
      console.error('Delete error:', error);
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
            />
          ) : isImage ? (
            <img
              src={fileUrl}
              alt={certificate_name}
              className="certificate-popup-file"
            />
          ) : (
            <p>Unsupported file type</p>
          )}
        </div>
        <div className="certificate-popup-footer">
        </div>
      </div>
    </div>
  );
};

export default CertificatePopup;