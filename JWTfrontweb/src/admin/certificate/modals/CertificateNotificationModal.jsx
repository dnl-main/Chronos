import React, { useState } from 'react';
import axios from 'axios';
import './certificateNotify.css';
import Note_Search from '../../../assets/icons/Note_Search.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const trainingOptionsMap = {
  "Seaman's Passport": [
    "Able Seaman — Unlimited",
    "Able Seaman — Limited",
    "Able Seaman",
    "STCW Basic Safety (PST, FPFF, EFA, PSSR)",
    "Watchkeeping Certificate",
    "Crowd Management & Crisis Control",
    "Radar Navigation & Collision Avoidance",
    "Ship Security Awareness",
    "Others"
  ],
  PDOS: [
    "Cultural Briefing",
    "Financial Literacy",
    "Seafarer Safety Awareness",
    "Shipboard Emergency Procedures",
    "Sexual Harassment Awareness",
    "COVID Protocol Orientation",
    "Others"
  ],
  Solas: [
    "PST (Personal Survival Techniques)",
    "FPFF (Fire Prevention and Fire Fighting)",
    "EFA (Elementary First Aid)",
    "PSSR (Personal Safety and Social Responsibility)",
    "Security Awareness",
    "Advanced Fire Fighting",
    "PSCRB (Rescue Boats)",
    "Enclosed Space Rescue",
    "HUET (Helicopter Escape)",
    "Others"
  ],
  Training: [
    "Deck Cadet",
    "Engine Cadet Training",
    "Steward Training",
    "BRM (Bridge Resource Management)",
    "ERM (Engine Room Resource Management)",
    "Radar / ARPA / ECDIS",
    "LNG Carrier Operations",
    "Oil Tanker Familiarization",
    "Leadership & Teamwork",
    "Others"
  ],
  Others: ["Others"]
};

const CertificateNotificationModal = ({ onClose, onNotify, recipientEmail }) => {
  const [certificateType, setCertificateType] = useState('');
  const [trainingType, setTrainingType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [certificateOtherInput, setCertificateOtherInput] = useState('');
  const [trainingOtherInput, setTrainingOtherInput] = useState('');
  const [purposeOtherInput, setPurposeOtherInput] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCertificateTypeChange = (e) => {
    const selectedType = e.target.value;
    setCertificateType(selectedType);
    setTrainingType('');
    setCertificateOtherInput('');
    setTrainingOtherInput('');
  };

  const trainingOptions = certificateType
    ? trainingOptionsMap[certificateType] || []
    : [];

  const handleNotifyClick = async () => {
    if (!recipientEmail) {
      setError('Recipient email is missing.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/ping`, {
        certificateType,
        certificateOtherInput,
        trainingType,
        trainingOtherInput,
        purpose,
        purposeOtherInput,
        note,
        recipientEmail
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true,
      });

      setSuccess(response.data.message);
      setError('');
      onNotify({ certificateType, certificateOtherInput, trainingType, trainingOtherInput, purpose, purposeOtherInput, note, recipientEmail });
      setTimeout(onClose, 2000); // Close modal after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification');
      setSuccess('');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="form-row">
          {/* Reason for Notification */}
          <div className="certificate-form">
            <label>Reason for Notification</label>
            <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option value="">Select</option>
              <option value="Upload">Notify to Upload the Certificate</option>
              <option value="Reupload">Notify to Reupload the Certificate</option>
              <option value="Expiry">Remind about Expiring Certificate</option>
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
              placeholder="Enter your message or instructions..."
            />
          </div>

          {/* Certificate Type */}
          <div className="certificate-form">
            <label>Certificate Type</label>
            <select value={certificateType} onChange={handleCertificateTypeChange}>
              <option value="">Select</option>
              <option value="Seaman's Passport">Seaman's Passport</option>
              <option value="PDOS">PDOS</option>
              <option value="Solas">Solas</option>
              <option value="Training">Training</option>
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

          {/* Nested Training Type */}
          <div className="certificate-form">
            <label>Type of {certificateType || 'certificate'}</label>
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

          {/* Feedback Messages */}
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          {/* Buttons */}
          <div className="button-group">
            <button className="btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn notify" onClick={handleNotifyClick}>
              Notify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateNotificationModal;