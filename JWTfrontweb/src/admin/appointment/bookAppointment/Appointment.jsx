import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './appointment.css';

import AppointmentCard from './components/cards/AppointmentCard';
import BookModal from './components/bookModal/BookModal';
import CancelModal from './components/cancelModal/CancelModal';
import RescheduleModal from './components/rescheduleModal/RescheduleModal';


import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import Calendar_Week from '../../../assets/icons/Calendar_Week.svg?react';
import Caret_Down_SM from '../../../assets/icons/Caret_Down_SM.svg?react';
import Calendar_Check from '../../../assets/icons/Calendar_Check.svg?react';
import Book from '../../../assets/icons/Book.svg?react';
import Close_MD from '../../../assets/icons/Close_MD.svg?react';

import Search from '../../../assets/icons/Search.svg';
import Filter from '../../../assets/icons/Filter.svg';

const dummyAppointmentsInitial = [
  {
    id: 1,
    status: 'available',
    date: '',
    start_time: '',
    end_time: '',
    user: { first_name: 'Alice', middle_name: 'B', last_name: 'Cruz', position: 'Dentist' },
  },
  {
    id: 2,
    status: 'booked',
    date: 'MAY - 30 - 2025',
    start_time: '11:00 AM',
    end_time: '12:00 PM',
    user: { first_name: 'Bob', middle_name: '', last_name: 'Davis', position: 'Therapist' },
  },
  {
    id: 3,
    status: 'available',
    date: '',
    start_time: '',
    end_time: '',
    user: { first_name: 'Cara', middle_name: 'M', last_name: 'Lee', position: 'Orthodontist' },
  },
];

const timeOptions = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM',
];

function formatDateForInput(displayDate) {
  if (!displayDate) return '';
  const months = {
    JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
    JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12',
  };
  const parts = displayDate.split(' - ').map(p => p.trim().toUpperCase());
  if (parts.length !== 3) return '';
  const [mon, day, year] = parts;
  const monthNum = months[mon];
  if (!monthNum) return '';
  const dayNum = day.padStart(2, '0');
  return `${year}-${monthNum}-${dayNum}`;
}

function formatDateForDisplay(isoDate) {
  if (!isoDate) return '';
  const months = [ '', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ];
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return '';
  const monName = months[parseInt(month, 10)];
  return `${monName} - ${parseInt(day, 10)} - ${year}`;
}

function parseTime(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export default function Appointment({ onClose }) {
  const [appointments, setAppointments] = useState(dummyAppointmentsInitial);
  const [selectedId, setSelectedId] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const selectedAppointment = appointments.find(appt => appt.id === selectedId);

  useEffect(() => {
    if (selectedId === null) {
      setDate('');
      setStartTime('');
      setEndTime('');
      return;
    }
    if (selectedAppointment) {
      setDate(selectedAppointment.date);
      setStartTime(selectedAppointment.start_time);
      setEndTime(selectedAppointment.end_time);
    }
  }, [selectedId, selectedAppointment]);

  const validateTimeFields = () => {
    if (!startTime || !endTime) {
      alert('Please select both start and end times.');
      return false;
    }
    if (parseTime(startTime) >= parseTime(endTime)) {
      alert('Start time must be earlier than end time.');
      return false;
    }
    return true;
  };


const handleBook = () => {
  if (!selectedAppointment || selectedAppointment.status === 'booked') {
    alert('Select an available appointment to book.');
    return;
  }
  if (!date) {
    alert('Please select a date.');
    return;
  }
  if (!validateTimeFields()) return;

  setShowBookModal(true);  // Only open modal here
};


const confirmBooking = () => {
  setAppointments(prev =>
    prev.map(appt =>
      appt.id === selectedId
        ? { ...appt, date, start_time: startTime, end_time: endTime, status: 'booked' }
        : appt
    )
  );
};



const handleReschedule = () => {
  if (!selectedAppointment || selectedAppointment.status !== 'booked') {
    alert('Select a booked appointment to reschedule.');
    return;
  }
  if (!date) {
    alert('Please select a date.');
    return;
  }
  if (!validateTimeFields()) return;

  setShowRescheduleModal(true); // Show modal
};

const confirmReschedule = () => {
  setAppointments(prev =>
    prev.map(appt =>
      appt.id === selectedId
        ? { ...appt, date, start_time: startTime, end_time: endTime }
        : appt
    )
  );

  setShowRescheduleModal(false);
  setShowConfirmation(true); 
};




  const handleUpdate = () => {
    if (!selectedAppointment || selectedAppointment.status !== 'booked') {
      alert('Select a booked appointment to update.');
      return;
    }
    if (!date) {
      alert('Please select a date.');
      return;
    }
    if (!validateTimeFields()) return;

    setAppointments(prev =>
      prev.map(appt =>
        appt.id === selectedId
          ? { ...appt, date, start_time: startTime, end_time: endTime }
          : appt
      )
    );
    alert('Appointment updated!');
  };






// CANCEL BUTTON LOGIC
  const handleCancel = () => {
  if (!selectedAppointment || selectedAppointment.status !== 'booked') {
    alert('Only booked appointments can be cancelled.');
    return;
  }

  setShowCancelModal(true); 
};


const confirmCancel = () => {
  setAppointments(prev =>
    prev.map(appt =>
      appt.id === selectedId
        ? { ...appt, date: '', start_time: '', end_time: '', status: 'available' }
        : appt
    )
  );
  setDate('');
  setStartTime('');
  setEndTime('');
  setShowCancelModal(false);  // Close modal
  alert('Appointment cancelled!');
};



  return (
    <div className="appointmentModal">
      <div className="appointmentModal-box">
        <div className="appointmentModal-box-in">

          {/* LEFT PANEL */}
          <div className="appointmentModal-box-in-left">
            <div className="appointmentModal-box-in-left-header">
              <button
                className="appointmentModal-box-in-left-header-button"
                onClick={onClose}  // Close modal when clicked
              >
                {/* <Circle_Primary style={{ color: "var(--green-indicator)", width: "20px", height: "20px" }} /> */}
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
                  {appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      id={appointment.id}
                      status={appointment.status}
                      date={appointment.date}
                      user={appointment.user}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                    />
                  ))}
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
                      <input
                        type="date"
                        className="appointmentModal-box-in-right-dropdown-date-container-text"
                        
                        value={date ? formatDateForInput(date) : ''}
                        onChange={(e) => setDate(formatDateForDisplay(e.target.value))}
                        style={{ width: '100%', padding: 8, marginTop: 6 }}
                        disabled={selectedId === null}
                      />
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
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      style={{ width: '100%', padding: 8, marginTop: 6 }}
                      disabled={selectedId === null}
                    >
                      <option value="">Select Start Time</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
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
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      style={{ width: '100%', padding: 8, marginTop: 6 }}
                      disabled={selectedId === null}
                    >
                      <option value="">Select End Time</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
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
              <button
  className="appointmentModal-box-in-right-buttons-reschedule"
  onClick={handleReschedule}
  style={{
    cursor: selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked' ? 'not-allowed' : 'pointer'
  }}
  disabled={selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked'}
>
  <p>Reschedule</p>
</button>



              <button className="appointmentModal-box-in-right-buttons-cancel"
                onClick={handleCancel}
                  style={{
                    cursor: selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked' ? 'not-allowed' : 'pointer'
                  }}
                disabled={selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked'}
              >
                <p>Cancel Appointment</p>
              </button>
              {showCancelModal && selectedAppointment && (
                <CancelModal
                  user={selectedAppointment.user}
                  date={selectedAppointment.date}
                  startTime={selectedAppointment.start_time}
                  endTime={selectedAppointment.end_time}
                  status={selectedAppointment.status}
                  onClose={() => setShowCancelModal(false)}
                  onConfirmCancel={confirmCancel}
                />
              )}

              <button className="appointmentModal-box-in-right-buttons-book"
                onClick={handleBook}
                  style={{
                    padding: '10px 18px',
                    marginRight: 10,
                    cursor: selectedId === null || !selectedAppointment || selectedAppointment.status === 'booked' ? 'not-allowed' : 'pointer'
                  }}
                disabled={selectedId === null || !selectedAppointment || selectedAppointment.status === 'booked'}
              >
                <Calendar_Check style={{
                  width: "20px", height: "20px",
                  '--stroke-color': 'var(--white-color)',
                  '--stroke-width': '7px'
                }} />
                <p>Book Now</p>
              </button>
              {showBookModal && selectedAppointment && (
                <BookModal
                  date={date}
                  startTime={startTime}
                  endTime={endTime}
                  user={selectedAppointment.user}
                  status={selectedAppointment.status}
                  onClose={() => setShowBookModal(false)}
                  onConfirmBooking={confirmBooking}  // <-- here
                />
              )}

              {showRescheduleModal && selectedAppointment && (
  <RescheduleModal
    date={date}
    startTime={startTime}
    endTime={endTime}
    user={selectedAppointment.user}
    status={selectedAppointment.status}
    onClose={() => setShowRescheduleModal(false)}
    onConfirmReschedule={confirmReschedule}
  />
)}


            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

