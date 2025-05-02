import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './BookAppointmentModal.css';
import axios from 'axios';

const BookAppointmentModal = ({
  onClose,
  setAppointmentDate,
  setAppointmentStartTime,
  setAppointmentEndTime
}) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleBook = async () => {
    if (!date || !startTime || !endTime) {
      alert('Please complete all fields before booking.');
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(`${apiUrl}/appointment`, {
        date: formattedDate,
        start_time: startTime,
        end_time: endTime
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Appointment booked successfully!');
      setAppointmentDate(formattedDate);
      setAppointmentStartTime(startTime);
      setAppointmentEndTime(endTime);
      onClose();
    } catch (error) {
      console.error('Failed to book appointment:', error.response?.data || error.message);
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Book an Appointment</h2>
        <div className="appointment-content">
          <div className="calendar-container">
            <Calendar onChange={setDate} value={date} />
          </div>
          <div className="schedule-container">
            <h3>Set your preferred schedule</h3>

            <div className="form-group">
              <label>Select a day</label>
              <div className="input-display">{date.toDateString()}</div>
            </div>

            <div className="form-group">
              <label>Starts at</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Ends at</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <button className="book-btn" onClick={handleBook}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointmentModal;
