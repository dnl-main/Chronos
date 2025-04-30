import React, { useState } from 'react';
import './BookAppointmentModal.css';

const BookAppointmentModal = ({ onClose, setAppointmentDate, setAppointmentStartTime, setAppointmentEndTime }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleBook = () => {
    if (!selectedDate || !startTime || !endTime) {
      alert('Please complete all fields before booking.');
      return;
    }
    
    // Set the parent states
    setAppointmentDate(selectedDate);
    setAppointmentStartTime(startTime);
    setAppointmentEndTime(endTime);
    
    alert(`Appointment booked!\nDate: ${selectedDate}\nFrom: ${startTime} to ${endTime}`);
    
    onClose(); // Close modal after booking
  };
  

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div> {/* click outside to close */}
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>X</button> {/* Close Button */}
        <h2>Book an Appointment</h2>
        <div className="calendar-scheduler">
          <div className="calendar">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="scheduler">
            <label>
              Select a day
              <input
                type="text"
                value={selectedDate ? new Date(selectedDate).toDateString() : ''}
                readOnly
              />
            </label>

            <label>
              Starts at
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </label>

            <label>
              Ends at
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </label>

            <button onClick={handleBook}>Book Now</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointmentModal;
