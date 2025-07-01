import React from 'react';
import './termsModal.css';

const TermsModal = ({ isVisible, closeModal }) => {
  if (!isVisible) return null;

  return (
    <div className="tnc-modal-overlay">
      <div className="tnc-modal-container">
        <div className="tnc-modal-header">
          <p className="tnc-title">Terms and Conditions</p>
          <p className="tnc-subtitle">For Centralized Data Management for Optimized Crew Scheduling System in Friendly Maritime Services Inc.</p>
        </div>

        <div className="tnc-modal-body">
          <ol className="tnc-list">
            <li>
              <strong>Acceptance of Terms</strong>
              <p>
                By accessing or using the Centralized Data Management for Optimized Crew Scheduling System ("the System"), you ("User" or "FMS") agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, you must immediately discontinue use.
              </p>
            </li>

            <li>
              <strong>System Overview</strong>
              <ul>
                <li>Automated crew scheduling and deployment optimization</li>
                <li>Certification tracking and compliance management</li>
                <li>Data analytics for workforce planning</li>
              </ul>
            </li>

            <li>
              <strong>User Accounts</strong>
              <ol type="a">
                <li>
                  <strong>Registration</strong>
                  <ul>
                    <li>Must provide accurate and current information</li>
                    <li>Each user receives unique login credentials</li>
                  </ul>
                </li>
                <li>
                  <strong>Account Security</strong>
                  <ul>
                    <li>Users are responsible for maintaining confidentiality</li>
                    <li>Must immediately report unauthorized access</li>
                  </ul>
                </li>
              </ol>
            </li>

            <li>
              <strong>Data Management</strong>
              <ol type="a">
                <li>
                  <strong>Data Collected</strong>
                  <ul>
                    <li><strong>Admin Profiles:</strong> Full Name, Job Title, Department, Contact Number, Email</li>
                    <li><strong>User Profiles:</strong> Full Name, Gender, Birthday, Civil Status, Gmail, Phone Number, Address, Employment Details</li>
                    <li><strong>Employment Data:</strong> Rank/Position, Assigned Vessel, Contract Details</li>
                    <li><strong>Certifications and Trainings:</strong> License, Training Records, Medical Certificates</li>
                    <li><strong>Scheduling and Deployment:</strong> Status, Onboarding/Offboarding Dates, Assignments</li>
                  </ul>
                </li>
                <li>
                  <strong>Data Use</strong>
                  <ul>
                    <li>Solely for maritime crew management purposes</li>
                    <li>No commercial use or third-party sharing without consent</li>
                  </ul>
                </li>
                <li>
                  <strong>Data Retention</strong>
                  <ul>
                    <li>Active crew data retained indefinitely</li>
                    <li>Inactive data anonymized after 2 years</li>
                  </ul>
                </li>
              </ol>
            </li>

            <li>
              <strong>User Obligations</strong>
              <ol type="a">
                <li>
                  <strong>FMS agrees to:</strong>
                  <ul>
                    <li>Maintain accurate crew records</li>
                    <li>Obtain necessary consents for data processing</li>
                    <li>Use the System only for intended purposes</li>
                  </ul>
                </li>
                <li>
                  <strong>Prohibited Actions:</strong>
                  <ul>
                    <li>Reverse engineering or copying System features</li>
                    <li>Using the System for unlawful purposes</li>
                  </ul>
                </li>
              </ol>
            </li>

            <li>
              <strong>Intellectual Property</strong>
              <p>
                All System software, algorithms, and interfaces remain property of The Researchers. FMS is granted a limited, non-exclusive license to use the System.
              </p>
            </li>

            <li>
              <strong>Privacy and Security</strong>
              <ol type="a">
                <li>
                  <strong>Security Measures</strong>
                  <ul>
                    <li>Data encryption in transit and at rest</li>
                    <li>Regular security audits</li>
                  </ul>
                </li>
                <li>
                  <strong>Breach Notification</strong>
                  <ul>
                    <li>Any breach must be reported within 24 hours</li>
                  </ul>
                </li>
              </ol>
            </li>

            <li>
              <strong>Limitation of Liability</strong>
              <ul>
                <li>Indirect or consequential damages</li>
                <li>Data loss due to user negligence</li>
              </ul>
            </li>

            <li>
              <strong>Termination</strong>
              <ul>
                <li>Either party may terminate with 30 days' notice</li>
                <li>Upon termination:
                  <ul>
                    <li>All access revoked</li>
                    <li>Data returned or securely deleted</li>
                  </ul>
                </li>
              </ul>
            </li>

            <li>
              <strong>Modifications</strong>
              <ul>
                <li>Terms may be updated with 15 days' notice</li>
                <li>Continued use constitutes acceptance</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="tnc-modal-footer">
          <button className="tnc-close-btn" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
