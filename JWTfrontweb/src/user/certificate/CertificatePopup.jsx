import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './certificatepopup.css';

const CertificatePopup = ({ certificate, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  if (!certificate) return null;

  const { file_path, certificate_name } = certificate;
  const storageBaseUrl = import.meta.env.VITE_STORAGE_BASE_URL;
  const fileUrl = `${storageBaseUrl}/${encodeURI(file_path)}`;

  const isPdf = file_path.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file_path.toLowerCase());

  useEffect(() => {
    if (isPdf) {
      // Fetch PDF with ngrok-skip-browser-warning header
      const fetchPdf = async () => {
        try {
          const response = await axios.get(fileUrl, {
            responseType: 'blob',
            headers: {
              'ngrok-skip-browser-warning': 'true',
            },
          });
          // Create a blob URL for the PDF
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          setPdfUrl(blobUrl);
          // Clean up blob URL when component unmounts
          return () => URL.revokeObjectURL(blobUrl);
        } catch (error) {
          console.error('Failed to fetch PDF:', error);
          setPdfUrl(null);
        }
      };
      fetchPdf();
    }
  }, [isPdf, fileUrl]);

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
            pdfUrl ? (
              <iframe
                src={pdfUrl}
                title={certificate_name}
                className="certificate-popup-file"
                onError={() => console.error('Failed to load PDF:', pdfUrl)}
              />
            ) : (
              <p>Loading PDF...</p>
            )
          ) : isImage ? (
            <img
              src={`${fileUrl}?ngrok-skip-browser-warning=true`}
              alt={certificate_name}
              className="certificate-popup-file"
              onError={() => console.error('Failed to load image:', fileUrl)}
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