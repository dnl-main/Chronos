import React, { useState, useEffect } from 'react';
import AppointmentCard from './components/cards/AppointmentCard'; // Adjust path as needed

const dummyAppointmentsInitial = [
  {
    id: 1,
    status: 'available',
    date: '',
    start_time: '09:00 AM',
    end_time: '10:00 AM',
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
    start_time: '01:00 PM',
    end_time: '02:00 PM',
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

export default function AppointmentManager() {
  const [appointments, setAppointments] = useState(dummyAppointmentsInitial);
  const [selectedId, setSelectedId] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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

    setAppointments(prev =>
      prev.map(appt =>
        appt.id === selectedId
          ? { ...appt, date, start_time: startTime, end_time: endTime, status: 'booked' }
          : appt
      )
    );
    alert('Appointment booked!');
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

  const handleCancel = () => {
    if (!selectedAppointment || selectedAppointment.status !== 'booked') {
      alert('Only booked appointments can be cancelled.');
      return;
    }

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
    alert('Appointment cancelled!');
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Appointments</h2>
      <div>
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

      <div style={{ marginTop: 30, padding: 20, borderTop: '1px solid #ccc' }}>
        <h3>Edit Appointment</h3>

        <label>
          Date:
          <input
            type="date"
            value={date ? formatDateForInput(date) : ''}
            onChange={(e) => setDate(formatDateForDisplay(e.target.value))}
            style={{ width: '100%', padding: 8, marginTop: 6 }}
            disabled={selectedId === null}
          />
        </label>

        <label style={{ display: 'block', marginTop: 12 }}>
          Start Time:
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
        </label>

        <label style={{ display: 'block', marginTop: 12 }}>
          End Time:
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
        </label>

        <div style={{ marginTop: 20 }}>
          <button
            onClick={handleBook}
            style={{
              padding: '10px 18px',
              marginRight: 10,
              cursor: selectedId === null || !selectedAppointment || selectedAppointment.status === 'booked' ? 'not-allowed' : 'pointer'
            }}
            disabled={selectedId === null || !selectedAppointment || selectedAppointment.status === 'booked'}
          >
            Book Appointment
          </button>

          <button
            onClick={handleUpdate}
            style={{
              padding: '10px 18px',
              marginRight: 10,
              cursor: selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked' ? 'not-allowed' : 'pointer'
            }}
            disabled={selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked'}
          >
            Update Appointment
          </button>

          <button
            onClick={handleCancel}
            style={{
              padding: '10px 18px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              cursor: selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked' ? 'not-allowed' : 'pointer'
            }}
            disabled={selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked'}
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
