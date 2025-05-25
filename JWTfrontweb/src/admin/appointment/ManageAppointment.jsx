import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './manageAppointment.css';
import ManageAppointmentCard from './appointmentComponents/ManageAppointmentCard';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Calendar_Week from '../../assets/icons/Calendar_Week.svg?react';
import Caret_Down_SM from '../../assets/icons/Caret_Down_SM.svg?react';
import Calendar_Check from '../../assets/icons/Calendar_Check.svg?react';
import Book from '../../assets/icons/Book.svg?react';

import AppointmentSummaryModal from '../../admin/appointment/appointmentcomponents/appointmentmodal/AppointmentSummaryModal';
import CancelSummaryModal from '../../admin/appointment/appointmentcomponents/appointmentmodal/CancelSummaryModal';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const ManageAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routedAppointment = location.state?.appointment || null;
  const routedUser = location.state?.user || null;
  const bookedAppointments = location.state?.bookedAppointments || [];

  const [selectedAppointment, setSelectedAppointment] = useState(routedAppointment);
  const [selectedUser, setSelectedUser] = useState(routedUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (routedAppointment) {
      setSelectedAppointment({
        ...routedAppointment,
        original_date: routedAppointment.date,
      });
    }
  }, [routedAppointment]);

  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
      .toUpperCase()
      .replace(',', '');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    if (isNaN(hours) || isNaN(minutes)) return '--:--';
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const handleReschedule = async () => {
    if (!selectedAppointment?.id) {
      setError('No appointment selected.');
      return;
    }

    if (
      !selectedAppointment.date ||
      !selectedAppointment.start_time ||
      !selectedAppointment.end_time
    ) {
      setError('Please fill in all fields: date, start time, and end time.');
      return;
    }

    if (selectedAppointment.end_time <= selectedAppointment.start_time) {
      setError('End time must be after start time.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.patch(
        `${apiUrl}/appointment/${selectedAppointment.id}`,
        {
          date: selectedAppointment.date,
          start_time: selectedAppointment.start_time,
          end_time: selectedAppointment.end_time,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setIsModalOpen(false);
      setError(null);
      navigate('/admin/schedule', { replace: true });
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
      setError(
        error.response?.data?.message || 'Failed to reschedule appointment.'
      );
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment?.id) {
      setError('No appointment selected.');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.delete(
        `${apiUrl}/appointment/${selectedAppointment.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setIsCancelModalOpen(false);
      setError(null);
      navigate('/admin/schedule', { replace: true });
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      setError(
        error.response?.data?.message || 'Failed to cancel appointment.'
      );
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  const isFormValid =
    selectedAppointment?.date &&
    selectedAppointment?.start_time &&
    selectedAppointment?.end_time &&
    selectedAppointment?.end_time > selectedAppointment?.start_time;

  return (
    <>
      <div className="manageAppointment">
        <div className="manageAppointment-box">
          <div className="manageAppointment-box-in">
            {/* LEFT PANEL */}
            <div className="manageAppointment-box-in-left">
              <div className="manageAppointment-box-in-left-header">
                <Book
                  style={{
                    color: 'var(--black-color-opacity-45)',
                    width: '32px',
                    height: '32px',
                    '--stroke-width': '4px',
                  }}
                />
                <p>Edit Appointment</p>
                <button
                  className="manageAppointment-exit-button"
                  onClick={() => navigate(-1)}
                >
                  ×
                </button>
              </div>

              <div className="manageAppointment-box-in-left-core-bot">
                <div className="manageAppointment-box-in-left-core-bot-cards">
                  {routedAppointment && routedUser && (
                    <ManageAppointmentCard
                      appointment={routedAppointment}
                      user={routedUser}
                      onSelect={() => {
                        setSelectedAppointment(routedAppointment);
                        setSelectedUser(routedUser);
                      }}
                    />
                  )}

                  {bookedAppointments.map((ba) => (
                    <ManageAppointmentCard
                      key={ba.id}
                      appointment={ba}
                      user={ba.user}
                      onSelect={() => {
                        setSelectedAppointment(ba);
                        setSelectedUser(ba.user);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="manageAppointment-box-in-right">
              {error && (
                <div
                  className="manageAppointment-error"
                  style={{ color: 'red', marginBottom: '1rem' }}
                >
                  {error}
                </div>
              )}
              <div className="manageAppointment-box-in-right-calendar">
                <p>calendar placeholder</p>
              </div>

              <div className="manageAppointment-box-in-right-dropdown">
                <button className="manageAppointment-box-in-right-dropdown-date">
                  <div className="manageAppointment-box-in-right-dropdown-date-container">
                    <Calendar_Week
                      style={{
                        width: '24px',
                        height: '24px',
                        '--stroke-width': '2px',
                        '--stroke-color': 'var(--black-color-opacity-30)',
                      }}
                    />
                    <div className="manageAppointment-box-in-right-dropdown-date-container-text">
                      <p className="manageAppointment-box-in-right-dropdown-date-container-text-light">
                        Select a day
                      </p>
                      <p className="manageAppointment-box-in-right-dropdown-date-container-text-semibold">
                        {selectedAppointment
                          ? formatDate(selectedAppointment.date)
                          : 'Select a day'}
                      </p>
                    </div>
                  </div>
                  <Caret_Down_SM
                    style={{
                      width: '32px',
                      height: '32px',
                      '--stroke-color': 'var(--black-color-opacity-45)',
                      '--stroke-width': '4px',
                    }}
                  />
                </button>

                <div className="manageAppointment-box-in-right-dropdown-editable">
                  <div className="manageAppointment-box-in-right-dropdown-editable-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      value={selectedAppointment?.date || ''}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="manageAppointment-box-in-right-dropdown-editable-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      value={selectedAppointment?.start_time || ''}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          start_time: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="manageAppointment-box-in-right-dropdown-editable-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      value={selectedAppointment?.end_time || ''}
                      onChange={(e) =>
                        setSelectedAppointment({
                          ...selectedAppointment,
                          end_time: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  className="manageAppointment-box-in-right-buttons-cancel"
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  <p>Cancel Appointment</p>
                </button>

                <button
                  className="manageAppointment-box-in-right-buttons-book"
                  onClick={() => setIsModalOpen(true)}
                  disabled={!isFormValid}
                >
                  <Calendar_Check
                    style={{
                      width: '20px',
                      height: '20px',
                      '--stroke-color': 'var(--white-color)',
                      '--stroke-width': '7px',
                    }}
                  />
                  <p>Reschedule Now</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {isModalOpen && (
        <AppointmentSummaryModal
          appointment={selectedAppointment}
          user={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setError(null);
          }}
          onConfirm={handleReschedule}
        />
      )}

      {/* Cancel Summary Modal */}
      {isCancelModalOpen && (
        <CancelSummaryModal
          appointment={selectedAppointment}
          user={selectedUser}
          onClose={() => {
            setIsCancelModalOpen(false);
            setError(null);
          }}
          onConfirm={handleCancel}
        />
      )}
    </>
  );
};

export default ManageAppointment;