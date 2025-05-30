import React from 'react';
import './certificatepopup.css';

const CertificatePopup = ({ certificate, onClose }) => {
  if (!certificate) return null;

  const { file_path, certificate_name } = certificate;
  const storageBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL;
  // Append ngrok-skip-browser-warning as a query parameter
  const fileUrl = `${storageBaseUrl}/${encodeURI(file_path)}?ngrok-skip-browser-warning=true`;

  const isPdf = file_path.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file_path.toLowerCase());

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
      </div>
    </div>
  );
};

export default CertificatePopup;