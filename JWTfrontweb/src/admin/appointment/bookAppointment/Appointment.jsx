import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './appointment.css';

import AppointmentCard from './components/AppointmentCard';

import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Calendar_Week from '../../../assets/icons/Calendar_Week.svg?react';
import Caret_Down_SM from '../../../assets/icons/Caret_Down_SM.svg?react';
import Calendar_Check from '../../../assets/icons/Calendar_Check.svg?react';
import Book from '../../../assets/icons/Book.svg?react';
import Close_MD from '../../../assets/icons/Close_MD.svg?react';

import Search from '../../../assets/icons/Search.svg';
import Filter from '../../../assets/icons/Filter.svg';

const Appointment = ({ onClose }) => {
    const navigate = useNavigate();
    const [crewMembers, setCrewMembers] = useState([]); // State to store fetched crew data
    const apiUrl = import.meta.env.VITE_API_BASE_URL; // Base API URL from environment

    // Fetch crew members data on component mount
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchCrewMembers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/crew-members`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                console.log('Fetched crew members:', response.data); // Debug log

                // Transform the data to match AppointmentCard props
                const transformedMembers = response.data.map(member => ({
                    id: member.id,
                    name: `${member.first_name || ''} ${member.middle_name ? member.middle_name + ' ' : ''}${member.last_name || ''}`.trim() || 'Unnamed',
                    job: member.position || 'No Job',
                    availability: member.availability || 'Unknown',
                }));
                setCrewMembers(transformedMembers);
            } catch (error) {
                console.error('Failed to fetch crew members:', error.response?.status, error.response?.data);
            }
        };

        fetchCrewMembers();
    }, [navigate, apiUrl]);

    return (
        <div className="appointmentModal">
            <div className="appointmentModal-box">
                <div className="appointmentModal-box-in">
                    {/* LEFT PANEL */}
                    <div className="appointmentModal-box-in-left">
                        <div className="appointmentModal-box-in-left-header">
                            <button
                                className="appointmentModal-box-in-left-header-button"
                                onClick={onClose}
                            >
                                <Close_MD style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '4px' }} />
                            </button>
                            <div className="appointmentModal-box-in-left-header-heading">
                                <Book style={{ color: "var(--black-color-opacity-45)", width: "32px", height: "32px", '--stroke-width': '4px' }} />
                                <p>Manage Appointment</p>
                            </div>
                        </div>

                        <div className="appointmentModal-box-in-left-core">
                            <div className="appointmentModal-box-in-left-core-top">
                                <div className="appointmentModal-box-in-left-core-top-tabs">
                                    <button className="appointmentModal-box-in-left-core-top-tabs-all">
                                        <Circle_Primary style={{ color: "var(--white-color)", width: "20px", height: "20px" }} />
                                        <p>All</p>
                                    </button>
                                    <button className="appointmentModal-box-in-left-core-top-tabs-available">
                                        <Circle_Primary style={{ color: "var(--green-indicator)", width: "20px", height: "20px" }} />
                                        <p>Available</p>
                                    </button>
                                    <button className="appointmentModal-box-in-left-core-top-tabs-booked">
                                        <Circle_Primary style={{ color: "var(--blue-indicator)", width: "20px", height: "20px" }} />
                                        <p>Booked</p>
                                    </button>
                                </div>

                                <div className="appointmentModal-box-in-left-core-top-search">
                                    <div className="appointmentModal-box-in-left-core-top-search-left">
                                        <img src={Search} alt="Search icon" />
                                        <p>Search</p>
                                    </div>
                                    <button className="appointmentModal-box-in-left-core-top-search-right">
                                        <img src={Filter} alt="Filter icon" />
                                    </button>
                                </div>
                            </div>

                            <div className="appointmentModal-box-in-left-core-bot">
                                <div className="appointmentModal-box-in-left-core-bot-cards">
                                    {crewMembers.length > 0 ? (
                                        crewMembers.map((member) => (
                                            <AppointmentCard
                                                key={member.id}
                                                name={member.name}
                                                job={member.job}
                                                availability={member.availability}
                                            />
                                        ))
                                    ) : (
                                        <p>No crew members available.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="appointmentModal-box-in-right">
                        <div className="appointmentModal-box-in-right-calendar">
                            <p>calendar placeholder</p>
                        </div>

                        <div className="appointmentModal-box-in-right-dropdown">
                            <button className="appointmentModal-box-in-right-dropdown-date">
                                <div className="appointmentModal-box-in-right-dropdown-date-container">
                                    <Calendar_Week style={{
                                        width: "24px", height: "24px",
                                        '--stroke-width': '2px',
                                        '--stroke-color': 'var(--black-color-opacity-30)'
                                    }} />
                                    <div className="appointmentModal-box-in-right-dropdown-date-container-text">
                                        <p className="appointmentModal-box-in-right-dropdown-date-container-text-light">Select a day</p>
                                        <p className="appointmentModal-box-in-right-dropdown-date-container-text-semibold">
                                            {/* {selectedAppointment ? formatDate(selectedAppointment.date) : 'Select a day'} */}
                                        </p>
                                    </div>
                                </div>
                                <Caret_Down_SM style={{
                                    width: "32px", height: "32px",
                                    '--stroke-color': 'var(--black-color-opacity-45)',
                                    '--stroke-width': '4px'
                                }} />
                            </button>

                            <div className="appointmentModal-box-in-right-dropdown-time">
                                <button className="appointmentModal-box-in-right-dropdown-time-start">
                                    <div className="appointmentModal-box-in-right-dropdown-time-start-text">
                                        <p className="appointmentModal-box-in-right-dropdown-time-start-text-light">Starts at</p>
                                        <p className="appointmentModal-box-in-right-dropdown-time-start-text-semibold">
                                            {/* {selectedAppointment ? formatTime(selectedAppointment.start_time) : '--:--'} */}
                                        </p>
                                    </div>
                                    <Caret_Down_SM style={{
                                        width: "32px", height: "32px",
                                        '--stroke-color': 'var(--black-color-opacity-45)',
                                        '--stroke-width': '4px'
                                    }} />
                                </button>

                                <button className="appointmentModal-box-in-right-dropdown-time-end">
                                    <div className="appointmentModal-box-in-right-dropdown-time-end-text">
                                        <p className="appointmentModal-box-in-right-dropdown-time-end-text-light">Ends at</p>
                                        <p className="appointmentModal-box-in-right-dropdown-time-end-text-semibold">
                                            {/* {selectedAppointment ? formatTime(selectedAppointment.end_time) : '--:--'} */}
                                        </p>
                                    </div>
                                    <Caret_Down_SM style={{
                                        width: "32px", height: "32px",
                                        '--stroke-color': 'var(--black-color-opacity-45)',
                                        '--stroke-width': '4px'
                                    }} />
                                </button>
                            </div>
                        </div>

                        <div className="appointmentModal-box-in-right-buttons">
                            <button className="appointmentModal-box-in-right-buttons-reschedule">
                                <p>Reschedule</p>
                            </button>

                            <button className="appointmentModal-box-in-right-buttons-cancel">
                                <p>Cancel Appointment</p>
                            </button>

                            <button className="appointmentModal-box-in-right-buttons-book">
                                <Calendar_Check style={{
                                    width: "20px", height: "20px",
                                    '--stroke-color': 'var(--white-color)',
                                    '--stroke-width': '7px'
                                }} />
                                <p>Book Now</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointment;