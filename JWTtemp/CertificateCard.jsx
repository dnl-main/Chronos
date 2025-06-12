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

        const currentDate = new Date();
        const expirationDate = new Date(cert.expiration_date);
        return expirationDate >= currentDate ? cert : null;
    };

    const hasAllCertificates = certificateTypes.every((type) => getCertificateByType(type) !== null);

    const handleNotifyUpload = async () => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(
                `${apiUrl}/notifications/upload`,
                {
                    user_id: data.id,
                    certificate_type: 'Missing Documents',
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            onNotifyUpload?.('Missing Documents');
            alert('Notification sent successfully');
        } catch (err) {
            alert('Failed to send notification');
        }
    };

    return (
        <main className="certificate-cards-card">
            <section className="certificate-cards-card-indicator" />

            <section className="certificate-cards-card-profile">
                <div className="certificate-cards-card-profile-svg" />
                <div className="certificate-cards-card-profile-info">
                    <p className="certificate-cards-card-profile-info-text">{fullName}</p>
                    <div className="certificate-cards-card-profile-info-job">
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: '#666',
                            border: '1px solid #666',
                            borderRadius: '50%'
                        }} />
                        <p>{data.job_title || 'No Job Title'}</p>
                    </div>
                </div>
            </section>

            <section className="certificate-cards-card-certificates">
                <div className="certificate-cards-card-certificates-1">
                    <div className="certificate-indicator-1">
                        <div className="certificate-cards-card-certificates-1-text">
                            <p className="certificate-cards-card-certificates-1-text-sub">Total</p>
                            <p className="certificate-cards-card-certificates-1-text-heading">Upload</p>
                            <div className="certificate-cards-card-certificates-1-count-box">
                                <p className="certificate-cards-card-certificates-1-count-text">{certificates.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="certificate-cards-card-certificates-2">
                    <div className="certificate-indicator-2">
                        <div className="certificate-cards-card-certificates-2-text">
                            <p className="certificate-cards-card-certificates-1-text-sub">Total</p>
                            <p className="certificate-cards-card-certificates-2-text-heading">Approved</p>
                            <div className="certificate-cards-card-certificates-2-count-box">
                                <p className="certificate-cards-card-certificates-2-count-text">
                                    {
                                        certificates.filter(c => c.status === 'approved').length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="certificate-cards-card-certificates-3">
                    <div className="certificate-indicator-3">
                        <div className="certificate-cards-card-certificates-3-text">
                            <p className="certificate-cards-card-certificates-3-text-sub">Required</p>
                            <p className="certificate-cards-card-certificates-3-text-heading">Valid Certs</p>
                            <div className="certificate-cards-card-certificates-3-count-box">
                                <p className="certificate-cards-card-certificates-3-count-text">
                                    {certificateTypes.filter(type => getCertificateByType(type)).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="certificate-cards-card-certificates-4">
                    <p className="certificate-cards-card-certificates-4-text-sub">Send a</p>
                    <p className="certificate-cards-card-certificates-4-text-heading">Notification</p>
                    <button
                        className="certificate-cards-card-certificates-1-button"
                        onClick={handleNotifyUpload}
                    >
                        <p className="certificate-cards-card-certificates-4-text-sub-heading">Notify</p>
                        <div className="certificate-cards-card-certificates-1-button-icon">
                            <Bell />
                        </div>
                    </button>
                </div>
            </section>
        </main>
    );
};

export default CertificateCard;
