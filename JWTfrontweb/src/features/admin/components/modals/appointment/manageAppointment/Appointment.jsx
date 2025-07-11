import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './appointment.css';

import AppointmentCard from '../manageAppointment/cards/AppointmentCard';
import BookModal from './modals/bookModal/BookModal';
import CancelModal from './modals/cancelModal/CancelModal';
import RescheduleModal from './modals/rescheduleModal/RescheduleModal';

import Circle_Primary from '../../../../../../assets/icons/Circle_Primary.svg?react';
// import Calendar_Week from '../../../assets/icons/Calendar_Week.svg?react';
// import Caret_Down_SM from '../../../assets/icons/Caret_Down_SM.svg?react';
import Calendar_Check from '../../../../../../assets/icons/Calendar_Check.svg?react';
import Book from '../../../../../../assets/icons/Book.svg?react';
import Close_MD from '../../../../../../assets/icons/Close_MD.svg?react';
import Search from '../../../../../../assets/icons/Search.svg?react';

const departmentOptions = ['Crewing', 'Medical', 'Accounting'];
const crewingDepts = ['maran gas', 'maran dry', 'maran tankers'];
const operators = [
  'fleet crew manager',
  'senior fleet crew operator',
  'crew operator 1',
  'crew operator 2',
  'crew operator 3',
];
const accountingOptions = ['allotment', 'final balance', 'check releasing'];
const purposeOptions = ['Document submission', 'Contract Signing', 'Training', 'Allowance Distribution', 'Others'];

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
  const months = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return '';
  const monName = months[parseInt(month, 10)];
  return `${monName} - ${parseInt(day, 10)} - ${year}`;
}

const times = [];
for (let hour = 9; hour <= 18; hour++) {
  const baseHour = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? 'AM' : 'PM';
  times.push(`${baseHour.toString().padStart(2, '0')}:00 ${period}`);
  if (hour !== 18) {
    times.push(`${baseHour.toString().padStart(2, '0')}:30 ${period}`);
  }
}

function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.split(' ').filter(Boolean);
  if (!time || !modifier) return 0;
  let [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function convertTo12Hour(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const cleanTime = timeStr.split(':').slice(0, 2).join(':');
  const [hours, minutes] = cleanTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return '';
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function convertTo24Hour(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const [time, modifier] = timeStr.split(' ').filter(Boolean);
  if (!time || !modifier) return '';
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return '';
  let adjustedHours = hours;
  if (modifier.toUpperCase() === 'PM' && hours !== 12) adjustedHours += 12;
  if (modifier.toUpperCase() === 'AM' && hours === 12) adjustedHours = 0;
  return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function mapAppointment(appointment) {
  const normalizePurpose = (p) => {
    if (!p || typeof p !== 'string') return '';
    const lowerPurpose = p.toLowerCase();
    const matchingOption = purposeOptions.find(opt => opt.toLowerCase() === lowerPurpose);
    return matchingOption || p.charAt(0).toUpperCase() + p.slice(1);
  };

  return {
    id: String(appointment.id || `temp-${Math.random()}`),
    user_id: appointment.user_id || null,
    status: appointment.status || 'booked',
    date: appointment.date ? formatDateForDisplay(appointment.date) : '',
    start_time: appointment.start_time ? convertTo12Hour(appointment.start_time) : '',
    end_time: appointment.end_time ? convertTo12Hour(appointment.end_time) : '',
    department: appointment.department ? appointment.department.charAt(0).toUpperCase() + appointment.department.slice(1) : '',
    crewingDept: appointment.crewing_dept || '',
    operator: appointment.operator || '',
    accountingOption: appointment.accounting_task || '',
    employeeName: appointment.employee || '',
    purpose: normalizePurpose(appointment.purpose),
    user: appointment.user || { first_name: '', middle_name: '', last_name: '', position: '' },
  };
}

export default function Appointment({ onClose, userId }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [department, setDepartment] = useState('');
  const [crewingDept, setCrewingDept] = useState('');
  const [operator, setOperator] = useState('');
  const [accountingOption, setAccountingOption] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

  const selectedAppointment = appointments.find(appt => appt.id === selectedId);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user`, {
          headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        });
        setIsAdmin(response.data.role === 'admin');
      } catch (err) {
        setError('Error fetching user role: ' + (err.response?.data?.message || err.message));
        setIsAdmin(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${apiUrl}/appointment`, {
          headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        });
        const data = Array.isArray(response.data) ? response.data : response.data.id ? [response.data] : [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredAppointments = data.filter(appointment => {
          if (!appointment.date) return true;
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= today;
        });
        const mappedAppointments = filteredAppointments.map(mapAppointment);
        setAppointments(mappedAppointments);
        if (userId) {
          const userAppointment = mappedAppointments.find(
            appt => appt.user_id === userId && (appt.status === 'available' || appt.status === 'booked' || appt.status === 'pending')
          );
          if (userAppointment) {
            setSelectedId(userAppointment.id);
          }
        }
        return filteredAppointments;
      } catch (err) {
        setError('Error fetching appointments: ' + (err.response?.data?.message || err.message));
        return [];
      }
    };

    const fetchAvailableUsers = async (existingAppointments) => {
      try {
        const response = await axios.get(`${apiUrl}/crew-members`, {
          headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        });
        const availableUsers = response.data;
        const bookedUserIds = new Set(
          existingAppointments
            .filter(appt => appt.status === 'booked' || appt.status === 'pending')
            .map(appt => appt.user_id)
        );
        const availableAppointments = availableUsers
          .filter(user => 
            !bookedUserIds.has(user.id) && 
            ['available'].includes(user.availability?.toLowerCase())
          )
          .map(user => ({
            id: `user-${user.id}`,
            user_id: user.id,
            status: 'available',
            availability: user.availability || '',
            date: '',
            start_time: '',
            end_time: '',
            department: '',
            crewingDept: '',
            operator: '',
            accountingOption: '',
            employeeName: '',
            purpose: '',
            user: {
              first_name: user.first_name || '',
              middle_name: user.middle_name || '',
              last_name: user.last_name || '',
              position: user.position || '',
            },
          }));
        setAppointments(prev => [
          ...prev.filter(appt => !String(appt.id).startsWith('user-')),
          ...availableAppointments,
        ]);
        if (userId && !selectedId) {
          const userAppointment = availableAppointments.find(appt => appt.user_id === userId);
          if (userAppointment) {
            setSelectedId(userAppointment.id);
          }
        }
      } catch (err) {
        setError('Error fetching available users: ' + (err.response?.data?.message || err.message));
      }
    };

    const initialize = async () => {
      await fetchUserRole();
      const appointmentsData = await fetchAppointments();
      await fetchAvailableUsers(appointmentsData);
    };

    initialize();
  }, [navigate, apiUrl, userId]);

  useEffect(() => {
    if (!selectedAppointment) {
      setDate('');
      setStartTime('');
      setEndTime('');
      setDepartment('');
      setCrewingDept('');
      setOperator('');
      setAccountingOption('');
      setEmployeeName('');
      setPurpose('');
      setCustomPurpose('');
      return;
    }

    setDate(selectedAppointment.date || '');
    setStartTime(selectedAppointment.start_time || '');
    setEndTime(selectedAppointment.end_time || '');
    setDepartment(selectedAppointment.department || '');
    setCrewingDept(selectedAppointment.crewingDept || '');
    setOperator(selectedAppointment.operator || '');
    setAccountingOption(selectedAppointment.accountingOption || '');
    setEmployeeName(selectedAppointment.employeeName || '');
    setPurpose(selectedAppointment.purpose || '');
    setCustomPurpose(selectedAppointment.purpose === 'others' ? selectedAppointment.purpose : '');
  }, [selectedAppointment]);

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

  const isPastDate = (dateStr) => {
    const inputDate = new Date(formatDateForInput(dateStr));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
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
    if (isPastDate(date)) {
      alert('You cannot select a past date.');
      return;
    }
    if (!validateTimeFields()) return;
    if (!department) {
      alert('Please select a Department.');
      return;
    }
    if (department === 'Crewing' && (!crewingDept || !operator)) {
      alert('Please select Crewing Dept and Operator.');
      return;
    }
    if (department === 'Accounting' && !accountingOption) {
      alert('Please select an Accounting Task.');
      return;
    }
    if (!purpose) {
      alert('Please select a Purpose of visit.');
      return;
    }
    if (purpose === 'Others' && !customPurpose) {
      alert('Please specify the purpose of visit.');
      return;
    }
    setShowBookModal(true);
  };

  const confirmBooking = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const payload = {
        user_id: selectedAppointment?.user_id,
        date: formatDateForInput(date),
        start_time: convertTo24Hour(startTime),
        end_time: convertTo24Hour(endTime),
        department: department.toLowerCase(),
        crewing_dept: department === 'Crewing' && crewingDept ? crewingDept.toLowerCase() : null,
        operator: department === 'Crewing' && operator ? operator.toLowerCase() : null,
        accounting_task: department === 'Accounting' && accountingOption ? accountingOption.toLowerCase() : null,
        employee_name: employeeName.trim(), 
        purpose: purpose === 'Others' ? customPurpose.toLowerCase() : purpose.toLowerCase(),
      };
      if (!payload.start_time || !payload.end_time) {
        throw new Error('Start time and end time are required.');
      }
      const response = await axios.post(
        `${apiUrl}/appointment/book`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }
      );
      setAppointments(prev => [
        ...prev.filter(appt => appt.id !== selectedId),
        mapAppointment(response.data.appointment),
      ]);
      setShowBookModal(false);
      window.location.reload();
    } catch (err) {
      alert('Error booking appointment: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReschedule = () => {
    if (!isAdmin) {
      alert('Only admins can reschedule appointments.');
      return;
    }
    if (!selectedAppointment || selectedAppointment.status !== 'booked') {
      alert('Select a booked appointment to reschedule.');
      return;
    }
    if (!date) {
      alert('Please select a date.');
      return;
    }
    if (isPastDate(date)) {
      alert('You cannot select a past date.');
      return;
    }
    if (!validateTimeFields()) return;
    if (!department) {
      alert('Please select a Department.');
      return;
    }
    if (department === 'Crewing' && (!crewingDept || !operator)) {
      alert('Please select Crewing Dept and Operator.');
      return;
    }
    if (department === 'Accounting' && !accountingOption) {
      alert('Please select an Accounting Task.');
      return;
    }
    if (!purpose) {
      alert('Please select a Purpose of visit.');
      return;
    }
    if (purpose === 'Others' && !customPurpose) {
      alert('Please specify the purpose of visit.');
      return;
    }
    setShowRescheduleModal(true);
  };

  const confirmReschedule = async () => {
    if (String(selectedId).startsWith('user-')) {
      alert('Cannot reschedule a virtual appointment. Please book a new appointment.');
      setShowRescheduleModal(false);
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      const payload = {
        date: formatDateForInput(date),
        start_time: convertTo24Hour(startTime),
        end_time: convertTo24Hour(endTime),
        department: department.toLowerCase(),
        crewing_dept: crewingDept || null,
        operator: operator || null,
        accounting_task: accountingOption || null,
        employee_name: employeeName || `${selectedAppointment?.user?.first_name || ''} ${selectedAppointment?.user?.last_name || ''}`.trim() || 'Unknown User',
        purpose: selectedAppointment.purpose.toLowerCase(),
      };
      const response = await axios.put(
        `${apiUrl}/appointment/${selectedId}/reschedule`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }
      );
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === selectedId ? mapAppointment(response.data.appointment) : appt
        )
      );
      setShowRescheduleModal(false);
      window.location.reload();
      setShowConfirmation(true);
    } catch (err) {
      alert('Error rescheduling appointment: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancel = () => {
    if (!isAdmin) {
      alert('Only admins can cancel appointments.');
      return;
    }
    if (!selectedAppointment || selectedAppointment.status !== 'booked') {
      alert('Only booked appointments can be cancelled.');
      return;
    }
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`${apiUrl}/appointment/${selectedId}/cancel`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      setAppointments(prev => prev.filter(appt => appt.id !== selectedId));
      setDate('');
      setStartTime('');
      setEndTime('');
      setDepartment('');
      setCrewingDept('');
      setOperator('');
      setAccountingOption('');
      setEmployeeName('');
      setPurpose('');
      setCustomPurpose('');
      setSelectedId(null);
      setShowCancelModal(false);
      window.location.reload();
    } catch (err) {
      alert('Error cancelling appointment: ' + (err.response?.data?.message || err.message));
    }
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
                  <button
                    className={`appointmentModal-box-in-left-core-top-tabs-all ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    <Circle_Primary style={{ width: "20px", height: "20px" }} />
                    <p>All</p>
                  </button>
                  <button
                    className={`appointmentModal-box-in-left-core-top-tabs-available ${filter === 'available' ? 'active' : ''}`}
                    onClick={() => setFilter('available')}
                  >
                    <Circle_Primary style={{ width: "20px", height: "20px" }} />
                    <p>Available</p>
                  </button>
                  <button
                    className={`appointmentModal-box-in-left-core-top-tabs-booked ${filter === 'booked' ? 'active' : ''}`}
                    onClick={() => setFilter('booked')}
                  >
                    <Circle_Primary style={{ width: "20px", height: "20px" }} />
                    <p>Booked</p>
                  </button>
                  <button
                    className={`appointmentModal-box-in-left-core-top-tabs-pending ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                  >
                    <Circle_Primary style={{ width: "20px", height: "20px" }} />
                    <p>Pending</p>
                  </button>
                </div>

                <div className="appointmentModal-box-in-left-core-top-search">
                  <div className="appointmentModal-box-in-left-core-top-search-left">
                    <Search
                      style={{
                        width: '1.4rem',
                        height: '1.4rem',
                        '--stroke-color': 'var(--primary-color)',
                        '--stroke-width': '8px',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ border: 'none', outline: 'none', background: 'transparent', color: 'inherit' }}
                    />
                  </div>
                </div>
              </div>

              <div className="appointmentModal-box-in-left-core-bot">
                {error && <p className="error">{error}</p>}
                <div className="appointmentModal-box-in-left-core-bot-cards">
                  {appointments
                    .filter((appointment) => {
                      const statusMatch = filter === 'all' ? true : appointment.status === filter;
                      const fullName = `${appointment.user.first_name || ''} ${appointment.user.middle_name || ''} ${appointment.user.last_name || ''}`.toLowerCase().trim();
                      const searchMatch = fullName.includes(searchTerm.trim().toLowerCase());
                      return statusMatch && searchMatch;
                    })
                    .map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        id={appointment.id}
                        status={appointment.status}
                        date={appointment.date}
                        user={appointment.user || { first_name: '', middle_name: '', last_name: '', position: '' }}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="appointmentModal-box-in-right" style={{ position: 'relative' }}>
            {selectedId === null && (
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '1rem',
                  pointerEvents: 'all',
                  textAlign: 'center',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="var(--primary-color)"
                  strokeWidth={1.4}
                  width="48"
                  height="48"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                </svg>
                <p
                  style={{
                    color: 'var(--primary-color)',
                    fontWeight: 'var(--font-weight-medium)',
                    fontSize: 'var(--font-size-16)',
                    maxWidth: '18rem',
                    lineHeight: 1.3,
                    userSelect: 'none',
                  }}
                >
                  Please select an available, booked, or pending user first to manage appointments.
                </p>
              </div>
            )}
            
            <section className="appointmentModal-box-in-right-dept">
              <div className="appointmentModal-box-in-right-dept-drop">
                <article className="appointmentModal-box-in-right-dept-drop-field">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      setCrewingDept('');
                      setOperator('');
                      setAccountingOption('');
                      setPurpose('');
                      setCustomPurpose('');
                    }}
                    disabled={selectedId === null}
                  >
                    <option value="">Select...</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </article>

                {department === 'Crewing' && (
                  <div className="appointmentModal-box-in-right-dept-drop-select">
                    <article className="appointmentModal-box-in-right-dept-drop-select-inner">
                      <label htmlFor="crewingDept">Crewing Dept</label>
                      <select
                        id="crewingDept"
                        value={crewingDept}
                        onChange={(e) => setCrewingDept(e.target.value)}
                        disabled={selectedId === null}
                      >
                        <option value="">Select...</option>
                        {crewingDepts.map((cd) => (
                          <option key={cd} value={cd}>{cd}</option>
                        ))}
                      </select>
                    </article>

                    {crewingDept && (
                      <article className="appointmentModal-box-in-right-dept-drop-select-operator">
                        <label htmlFor="operator">Operator</label>
                        <select
                          id="operator"
                          value={operator}
                          onChange={(e) => setOperator(e.target.value)}
                          disabled={selectedId === null}
                        >
                          <option value="">Select...</option>
                          {operators.map((op) => (
                            <option key={op} value={op}>{op}</option>
                          ))}
                        </select>
                      </article>
                    )}
                  </div>
                )}

                {department === 'Accounting' && (
                  <div className="appointmentModal-box-in-right-dept-drop-select">
                    <article className="appointmentModal-box-in-right-dept-drop-select-inner">
                      <label htmlFor="accountingOption">Accounting Task</label>
                      <select
                        id="accountingOption"
                        value={accountingOption}
                        onChange={(e) => setAccountingOption(e.target.value)}
                        disabled={selectedId === null}
                      >
                        <option value="">Select...</option>
                        {accountingOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </article>
                  </div>
                )}
              </div>

              <article className="appointmentModal-box-in-right-dept-name">
                <label htmlFor="employeeName">Name of employee</label>
                <input
                  type="text"
                  id="employeeName"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  disabled={selectedId === null}
                />
              </article>

              <div className="appointmentModal-box-in-right-dept-purpose">
                <article className="appointmentModal-box-in-right-dept-purpose">
                  <label htmlFor="purpose">Purpose of visit</label>
                  <select
                    id="purpose"
                    value={purpose || ''}
                    onChange={(e) => {
                      setPurpose(e.target.value);
                      if (e.target.value !== 'Others') {
                        setCustomPurpose('');
                      }
                    }}
                    disabled={selectedId === null}
                  >
                    <option value="">Select...</option>
                    {purposeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    {purpose && !purposeOptions.includes(purpose) && (
                      <option value={purpose}>{purpose}</option>
                    )}
                  </select>
                </article>

                {purpose === 'Others' && (
                  <article className="appointmentModal-box-in-right-dept-custom-purpose">
                    <label htmlFor="customPurpose">Specify Purpose</label>
                    <input
                      type="text"
                      id="customPurpose"
                      value={customPurpose}
                      onChange={(e) => setCustomPurpose(e.target.value)}
                      placeholder="Enter custom purpose"
                      disabled={selectedId === null}
                    />
                  </article>
                )}
              </div>
            </section>

            <div className="appointmentModal-box-in-right-dropdown">
              <div className="appointmentModal-box-in-right-dropdown-date">
                <label htmlFor="">Select a day</label>
                <input
                  type="date"
                  className="appointmentModal-box-in-right-dropdown-date-input"
                  value={date ? formatDateForInput(date) : ''}
                  onChange={(e) => setDate(formatDateForDisplay(e.target.value))}
                  disabled={selectedId === null}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="appointmentModal-box-in-right-dropdown-time">
                <div className="appointmentModal-box-in-right-dropdown-time-start">
                  <label htmlFor="startTime">Starts at</label>
                  <select
                    id="startTime"
                    className="appointmentModal-box-in-right-dropdown-time-start-input"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setEndTime('');
                    }}
                    disabled={selectedId === null}
                  >
                    <option value="">Select Start Time</option>
                    {times.map((time, idx) => (
                      <option key={idx} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="appointmentModal-box-in-right-dropdown-time-end">
                  <label htmlFor="endTime">Ends at</label>
                  <select
                    id="endTime"
                    className="appointmentModal-box-in-right-dropdown-time-end-input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={selectedId === null || !startTime}
                  >
                    <option value="">Select End Time</option>
                    {times
                      .filter((time) => parseTime(time) > parseTime(startTime))
                      .map((time, idx) => (
                        <option key={idx} value={time}>{time}</option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="appointmentModal-box-in-right-buttons">
              <button
                className="appointmentModal-box-in-right-buttons-reschedule"
                onClick={handleReschedule}
                style={{
                  cursor: !isAdmin || selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked' ? 'not-allowed' : 'pointer',
                }}
                disabled={!isAdmin || selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked'}
              >
                <p>Reschedule</p>
              </button>
              {showRescheduleModal && selectedAppointment && (
                <RescheduleModal
                  date={date}
                  startTime={startTime}
                  endTime={endTime}
                  user={selectedAppointment.user}
                  status={selectedAppointment.status}
                  purpose={purpose === 'Others' ? customPurpose : purpose}
                  onClose={() => setShowRescheduleModal(false)}
                  onConfirmReschedule={confirmReschedule}
                />
              )}

              <button
                className="appointmentModal-box-in-right-buttons-cancel"
                onClick={handleCancel}
                style={{
                  cursor: !isAdmin || selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked' ? 'not-allowed' : 'pointer',
                }}
                disabled={!isAdmin || selectedId === null || !selectedAppointment || selectedAppointment.status !== 'booked'}
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
                  purpose={selectedAppointment.purpose}
                  onClose={() => setShowCancelModal(false)}
                  onConfirmCancel={confirmCancel}
                />
              )}

              <button
                className="appointmentModal-box-in-right-buttons-book"
                onClick={handleBook}
                style={{
                  cursor: selectedId === null || !selectedAppointment || selectedAppointment.status === 'booked' ? 'not-allowed' : 'pointer',
                }}
                disabled={selectedId === null || !selectedAppointment || selectedAppointment.status === 'booked'}
              >
                <Calendar_Check
                  style={{
                    width: '20px',
                    height: '20px',
                    '--stroke-color': 'var(--white-color)',
                    '--stroke-width': '7px',
                  }}
                />
                <p>Book Now</p>
              </button>
              {showBookModal && selectedAppointment && (
                <BookModal
                  date={date}
                  startTime={startTime}
                  endTime={endTime}
                  user={selectedAppointment.user}
                  status={selectedAppointment.status}
                  purpose={purpose === 'Others' ? customPurpose : purpose}
                  onClose={() => setShowBookModal(false)}
                  onConfirmBooking={confirmBooking}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}