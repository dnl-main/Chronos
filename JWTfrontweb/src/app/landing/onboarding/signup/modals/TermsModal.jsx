import React from 'react';

const TermsModal = ({ isVisible, closeModal }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-tnc-overlay">
      <div className="modal-tnc-content">
        <h2>Terms and Conditions</h2>
        {/* Insert your terms HTML here */}
        <div className="modal-button">
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
