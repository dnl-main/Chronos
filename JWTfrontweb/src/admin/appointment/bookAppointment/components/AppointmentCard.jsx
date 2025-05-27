import React, { useState } from 'react';
import './appointmentCard.css';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';

const AppointmentCard = ({ name, job, availability, onSelect }) => {
    const [checked, setChecked] = useState(false);

    return (
        <main className="manageAppointment-box-in-left-core-bot-cards-card">
            <div className="manageAppointment-box-in-left-core-bot-cards-card-check">
                <div
                    className={`manageAppointment-box-in-left-core-bot-cards-card-check-box ${checked ? 'checked' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering selection
                        setChecked(!checked);
                    }}
                ></div>
            </div>

            <div className="manageAppointment-box-in-left-core-bot-cards-card-container">
                <div className="manageAppointment-box-in-left-core-bot-cards-card-container-indicator"></div>

                <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile">
                    <Circle_Primary style={{ color: "var(--primary-color)", width: "4rem", height: "4rem" }} />
                    <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info">
                        <p className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-text">
                            {name || 'Loading...'}
                        </p>

                        <div className="manageAppointment-box-in-left-core-bot-cards-card-container-profile-info-job">
                            <Circle_Primary style={{ color: "var(--primary-color)", width: "1.4rem", height: "1.4rem" }} />
                            <p>{job || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="manageAppointment-box-in-left-core-bot-cards-card-container-availability">
                    <div className="manageAppointment-box-in-left-core-bot-cards-card-container-availability-bg">
                        <Circle_Primary
                            style={{
                                color: availability === 'Available' ? 'var(--green-indicator)' : 'var(--blue-indicator)',
                                width: '1.4rem',
                                height: '1.4rem',
                            }}
                        />
                        <p>{availability || 'Unknown'}</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AppointmentCard;