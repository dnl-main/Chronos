import React, { useState } from 'react';
import './certificateNotify.css';
import Note_Search from '../../../assets/icons/Note_Search.svg?react';

const trainingOptionsMap = {
  Medical: ['Medical 1', 'Medical 2', 'Medical 3', 'Others'],
  Training: ['Medical 1', 'Medical 2', 'Medical 3', 'Others'],
  PDOS: ['Medical 1', 'Medical 2', 'Medical 3', 'Others'],
  Others: ['Others'],
};

const Certificate = ({ onClose, onNotify }) => {
  const [certificateType, setCertificateType] = useState('');
  const [trainingType, setTrainingType] = useState('');
  const [purpose, setPurpose] = useState('Notify to Upload the Certificate');

  const [certificateOtherInput, setCertificateOtherInput] = useState('');
  const [trainingOtherInput, setTrainingOtherInput] = useState('');
  const [purposeOtherInput, setPurposeOtherInput] = useState('');
  const [note, setNote] = useState('');

  const handleCertificateTypeChange = (e) => {
    const selectedType = e.target.value;
    setCertificateType(selectedType);
    setTrainingType(''); 
    setCertificateOtherInput('');
    setTrainingOtherInput('');
  };

  const trainingOptions = certificateType ? trainingOptionsMap[certificateType] || [] : [];

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="form-row">

          {/* Certificate Type */}
          <div className="certificate-form">
            <label>Certificate Type</label>
            <select value={certificateType} onChange={handleCertificateTypeChange}>
              <option value="">Select</option>
              <option value="Medical">Medical</option>
              <option value="Training">Training</option>
              <option value="PDOS">PDOS</option>
              <option value="Others">Others</option>
            </select>
            {certificateType === 'Others' && (
              <div className="others-inputs">
                <input
                  type="text"
                  placeholder="Specify other certificate type"
                  value={certificateOtherInput}
                  onChange={(e) => setCertificateOtherInput(e.target.value)}
                  className="nested-input"
                />
              </div>
            )}
          </div>

          <div className="certificate-form">
            <label>Type of {certificateType || 'Training'}</label>
            <select
              value={trainingType}
              onChange={(e) => setTrainingType(e.target.value)}
              disabled={!certificateType}
            >
              <option value="">Select</option>
              {trainingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {trainingType === 'Others' && (
              <div className="others-inputs">
                <input
                  type="text"
                  placeholder={`Specify other type of ${certificateType}`}
                  value={trainingOtherInput}
                  onChange={(e) => setTrainingOtherInput(e.target.value)}
                  className="nested-input"
                />
              </div>
            )}
          </div>


          {/* Purpose */}
          <div className="certificate-form">
            <label>Purpose</label>
            <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option value="">Select</option>
              <option value="Notify to Upload the Certificate">Notify to Upload the Certificate</option>
              <option value="Upload Certificate">Upload Certificate</option>
              <option value="Others">Others</option>
            </select>
            {purpose === 'Others' && (
              <div className="others-inputs">
                <input
                  type="text"
                  placeholder="Specify other purpose"
                  value={purposeOtherInput}
                  onChange={(e) => setPurposeOtherInput(e.target.value)}
                  className="nested-input"
                />
              </div>
            )}
          </div>

          {/* Note */}
          <div className="certificate-form">
            <label>Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter..."
            />
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button className="btn cancel" onClick={onClose}>Cancel</button>
            <button
              className="btn notify"
              onClick={() =>
                onNotify({
                  certificateType,
                  certificateOtherInput,
                  trainingType,
                  trainingOtherInput,
                  purpose,
                  purposeOtherInput,
                  note,
                })
              }
            >
              Notify
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const CertificateCard = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCustomNotify = (data) => {
    console.log('Notify Data:', data);
    setShowModal(false);
  };

  return (
    <main>
      <section>
        <div className="certificate-cards-card-certificates-5">
          <button
            className="round-button"
            onClick={() => setShowModal(true)}
            title="Open Modal"
          >
            <Note_Search />
          </button>
        </div>
      </section>

      {showModal && (
        <Certificate onClose={() => setShowModal(false)} onNotify={handleCustomNotify} />
      )}
    </main>
  );
};

export default CertificateCard;
