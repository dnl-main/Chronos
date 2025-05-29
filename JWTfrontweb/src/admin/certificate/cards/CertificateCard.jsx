import React from 'react';
import axios from 'axios';
import './certificateCard.css';
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Calendar_Add from '../../../assets/icons/Calendar_Add.svg?react';
import Bell from '../../../assets/icons/Bell.svg?react';
import Note_Search from '../../../assets/icons/Note_Search.svg?react';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const CertificateCard = ({ data, certificates, onCertificateClick, onNotifyUpload }) => {
    const fullName = [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(' ');

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }).toUpperCase();
    };

    const certificateTypes = ['Medical', 'Training', 'Contract', 'Employee ID'];

    const getCertificateByType = (type) => {
        const cert = certificates.find((cert) => cert.certificate_type === type);
        if (!cert) return null;

        // Check if certificate is expired
        const currentDate = new Date();
        const expirationDate = new Date(cert.expiration_date);
        if (expirationDate < currentDate) {
            return null; // Treat expired certificate as non-existent
        }
        return cert;
    };

    // Check if all certificate types are present and valid
    const hasAllCertificates = certificateTypes.every((type) => {
        const cert = getCertificateByType(type);
        return cert !== null;
    });

    const handleNotifyUpload = async (type) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(
                `${apiUrl}/notifications/upload`,
                {
                    user_id: data.id,
                    certificate_type: type,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            onNotifyUpload(type); // Notify parent if needed
            alert('Notification sent successfully'); // Replace with toast in production
        } catch (err) {
            console.error('Failed to send notification:', err);
            alert('Failed to send notification');
        }
    };

    return (
        <main className="certificate-cards-card">
            <section
                className="certificate-cards-card-indicator"
                style={hasAllCertificates ? { backgroundColor: 'rgba(152, 251, 152, 0.6)' } : {}}
            ></section>
            <section className="certificate-cards-card-profile">
                <Circle_Primary className="certificate-cards-card-profile-svg" />
                <div className="certificate-cards-card-profile-info">
                    <p className="certificate-cards-card-profile-info-text">{fullName || 'Unknown'}</p>
                    <div className="certificate-cards-card-profile-info-job">
                        <Circle_Primary style={{ color: 'var(--primary-color)', width: '32px', height: '32px' }} />
                        <p>{data.position || 'No position'}</p>
                    </div>
                </div>
            </section>
            <section className="certificate-cards-card-certificates">
                {certificateTypes.map((type, index) => {
                    const cert = getCertificateByType(type);
                    const columnIndex = index + 1;

                    return (
                        <div key={type} className={`certificate-cards-card-certificates-${columnIndex}`}>
                            <div className={`certificate-cards-card-certificates-${columnIndex}-text`}>
                                <p className={`certificate-cards-card-certificates-${columnIndex}-text-sub`}>
                                    {cert ? 'Expires at' : 'As of now'}
                                </p>
                                <p className={`certificate-cards-card-certificates-${columnIndex}-text-heading`}>
                                    {cert ? formatDate(cert.expiration_date) : 'No upload'}
                                </p>
                            </div>
                            <button
                                className={`certificate-cards-card-certificates-${cert ? '2' : '1'}-button`}
                                onClick={() => (cert ? onCertificateClick(cert) : handleNotifyUpload(type))}
                                disabled={false}
                            >
                                <p>{cert ? cert.certificate_name || 'Unknown Certificate' : 'Notify upload'}</p>
                                <div
                                    className={`certificate-cards-card-certificates-${cert ? '2' : '1'}-button-icon`}
                                >
                                    {cert ? (
                                        <Note_Search
                                            style={{
                                                color: 'var(--black-color)',
                                                width: '1.8vw',
                                                height: '3.6vh',
                                                '--stroke-width': '4px',
                                            }}
                                        />
                                    ) : (
                                        <Bell
                                            style={{
                                                color: 'var(--primary-color)',
                                                width: '1.8vw',
                                                height: '3.6vh',
                                                '--stroke-width': '4px',
                                            }}
                                        />
                                    )}
                                </div>
                            </button>
                        </div>
                    );
                })}
            </section>
            <section className="certificate-cards-card-button">
                <button>
                    <Calendar_Add className="certificate-cards-card-button-svg" />
                </button>
            </section>
        </main>
    );
};

export default CertificateCard;