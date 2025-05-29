import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './manageAppointmentCard.css';

import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Phone from '../../../assets/icons/Phone.svg?react';
import Mail from '../../../assets/icons/Mail.svg?react';
import Note_Search from '../../../assets/icons/Note_Search.svg?react';
import Map_Pin from '../../../assets/icons/Map_Pin.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const ManageAppointmentCard = ({ appointment, user, onCertificateClick }) => {
  const [checked, setChecked] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [errorCertificates, setErrorCertificates] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      const userId = user?.user_id || appointment?.user_id;
      if (!userId) return;

      setLoadingCertificates(true);
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/certificates`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const allCertificates = response.data.certificates || [];
        const userCertificates = allCertificates.filter(cert => cert.user_id === userId);
        setCertificates(userCertificates);
      } catch (error) {
        setErrorCertificates('Failed to load certificates.');
        setCertificates([]);
      } finally {
        setLoadingCertificates(false);
      }
    };

    fetchCertificates();
  }, [user?.user_id, appointment?.user_id]);

  if (!user || !appointment) {
    return <p>Loading...</p>;
  }

  return (
    <main className="manageAppointment-card">
      <div className="manageAppointment-card-profile">
        <div className="manageAppointment-card-profile">
          <Circle_Primary style={{ color: 'var(--primary-color)', width: '4rem', height: '4rem' }} />
          <div className="manageAppointment-card-profile-info">
            <p className="manageAppointment-card-profile-info-text">
              {`${user.first_name || ''} ${user.middle_name ? user.middle_name.charAt(0) + '.' : ''} ${user.last_name || ''}`}
            </p>
            <div className="manageAppointment-card-profile-info-job">
              <Circle_Primary style={{ color: 'var(--primary-color)', width: '1.4rem', height: '1.4rem' }} />
              <p>{user.position || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="manageAppointment-card-availability">
          <div className="manageAppointment-card-availability-bg">
            <Circle_Primary style={{ color: 'var(--green-indicator)', width: '1.4rem', height: '1.4rem' }} />
            <p>{user.availability || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="manageAppointment-card-separator"> </div>

      <div className="manageAppointment-card-personal">
        <div className="manageAppointment-card-personal-field">
          <p className="manageAppointment-card-personal-field-medium">Gender</p>
          <div className="manageAppointment-card-personal-field-data">
            <p className="manageAppointment-card-personal-field-data-regular">{user.gender || 'N/A'}</p>
          </div>
        </div>
        <div className="manageAppointment-card-personal-field">
          <p className="manageAppointment-card-personal-field-medium">Civil status</p>
          <div className="manageAppointment-card-personal-field-data">
            <p className="manageAppointment-card-personal-field-data-regular">{user.civil_status || 'N/A'}</p>
          </div>
        </div>
        <div className="manageAppointment-card-personal-field">
          <p className="manageAppointment-card-personal-field-medium">Birthday</p>
          <div className="manageAppointment-card-personal-field-data">
            <p className="manageAppointment-card-personal-field-data-regular">{user.birthday || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="manageAppointment-card-separator"> </div>

      <div className="manageAppointment-card-certificate">
        <p className="manageAppointment-card-certificate-medium">Certificate</p>
        <div className="manageAppointment-card-certificate-fields">
          {loadingCertificates ? (
            <p>Loading certificates...</p>
          ) : errorCertificates ? (
            <p style={{ color: '#888' }}>{errorCertificates}</p>
          ) : certificates.length > 0 ? (
            certificates.map((cert, index) => (
              <div
                key={cert.id || index}
                className="manageAppointment-card-certificate-fields-field"
                onClick={(e) => {
                  e.stopPropagation();
                  onCertificateClick('/admin/certificates');
                }}
                style={{ cursor: 'pointer' }}
              >
                <p className="manageAppointment-card-certificate-fields-field-light">{cert.certificate_name || 'N/A'}</p>
                <div className="manageAppointment-card-certificate-fields-field-svg">
                  <Note_Search
                    style={{
                      color: 'var(--black-color)',
                      width: '1.4rem',
                      height: '1.4rem',
                      '--stroke-width': '4px',
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No certificates found.</p>
          )}
        </div>
      </div>

      <div className="manageAppointment-card-separator"> </div>

      <div className="manageAppointment-card-contact">
        <p className="manageAppointment-card-contact-medium">Contact</p>
        <div className="manageAppointment-card-contact-details">
          <div className="manageAppointment-card-contact-details-info">
            <div className="manageAppointment-card-contact-details-info-phone">
              <Phone style={{ color: 'var(--black-color-opacity-60)', width: '1rem', height: '1rem' }} />
              <p>(+63) {user.mobile || 'N/A'}</p>
            </div>
            <div className="manageAppointment-card-contact-details-info-email">
              <Mail style={{ color: 'var(--black-color-opacity-60)', width: '1rem', height: '1rem' }} />
              <p>{user.email || 'N/A'}</p>
            </div>
          </div>
          <div className="manageAppointment-card-contact-details-address">
            <Map_Pin style={{ color: 'var(--black-color-opacity-60)', width: '1rem', height: '1rem' }} />
            <p>{user.address || 'N/A'}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManageAppointmentCard;