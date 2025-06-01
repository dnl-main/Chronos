import React, { useState, useEffect } from 'react';
import './BookAppointmentModal.css';
import axios from 'axios';
import Calendar from 'react-calendar';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Book from '../../assets/icons/Book.svg?react';
import Close_MD from '../../assets/icons/Close_MD.svg?react';
import Calendar_Check from '../../assets/icons/Calendar_Check.svg?react';

const departmentOptions = ['Crewing', 'Medical', 'Accounting'];
const crewingDepts = ['Maran Gas', 'Maran Dry', 'Maran Tankers'];
const operators = [
  'Fleet crew manager',
  'Senior fleet crew operator',
  'Crew operator 1',
  'Crew operator 2',
  'Crew operator 3',
];
const accountingOptions = ['Allotment', 'Final balance', 'Check releasing'];
const purposeOptions = ['Document submission', 'Contract Signing', 'Training', 'Allowance Distribution', 'Others'];
const times = [];
for (let hour = 9; hour <= 18; hour++) {
  times.push(`${hour.toString().padStart(2, '0')}:00`);
  if (hour !== 18) {
    times.push(`${hour.toString().padStart(2, '0')}:30`);
  }
}

  const formatLocalDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };




const BookAppointmentModal = ({ onClose, onAppointmentBooked }) => {
  const [department, setDepartment] = useState('');
  const [crewingDept, setCrewingDept] = useState('');
  const [operator, setOperator] = useState('');
  const [accountingOption, setAccountingOption] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = sessionStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_BASE_URL;

      try {
        const response = await axios.get(`${apiUrl}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error('Failed to fetch user ID:', error.response?.data || error.message);
        alert('Unable to fetch user information. Please log in again.');
      }
    };

    fetchUserId();
  }, []);





  const isFormValid = () => {
  if (!userId || !department || !employeeName.trim() || !purpose || !date || !startTime || !endTime) return false;
  if (department === 'Crewing' && (!crewingDept || !operator)) return false;
  if (department === 'Accounting' && !accountingOption) return false;
  if (purpose === 'Others' && !customPurpose.trim()) return false;
  if (employeeName.trim().length < 3) return false;
  if (purpose === 'Others' && customPurpose.trim().length < 3) return false;
  // Additional validation like date/time comparisons can be added here if needed
  return true;
};

const sanitizeInput = (input) => {
  // Simple sanitization: remove <, >, &, ", ', and backticks
  return input.replace(/[<>&"'`]/g, '');
};



const handleBook = async () => {
  const trimmedEmployeeName = employeeName.trim();
  const trimmedCustomPurpose = customPurpose.trim();

  // Sanitize inputs
  const safeEmployeeName = sanitizeInput(trimmedEmployeeName);
  const safeCustomPurpose = sanitizeInput(trimmedCustomPurpose);

  if (!userId) {
    alert('User information not loaded. Please try again.');
    return;
  }

  if (!department) {
    alert('Please select a department.');
    return;
  }

  if (department === 'Crewing') {
    if (!crewingDept) {
      alert('Please select a Crewing Department.');
      return;
    }
    if (!operator) {
      alert('Please select an Operator.');
      return;
    }
  }

  if (department === 'Accounting' && !accountingOption) {
    alert('Please select an Accounting Task.');
    return;
  }

  if (!safeEmployeeName) {
    alert('Please enter the name of the employee.');
    return;
  }

  if (safeEmployeeName.length < 3) {
    alert('Employee name must be at least 3 characters.');
    return;
  }

  if (!purpose) {
    alert('Please select a purpose.');
    return;
  }

  if (purpose === 'Others' && !safeCustomPurpose) {
    alert('Please specify your purpose of visit.');
    return;
  }

  if (purpose === 'Others' && safeCustomPurpose.length < 3) {
    alert('Custom purpose must be at least 3 characters.');
    return;
  }

  if (!date) {
    alert('Please select a date.');
    return;
  }

  const today = new Date();
  const selectedDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    alert('Please select a valid date (today or later).');
    return;
  }

  if (!startTime || !endTime) {
    alert('Please select both start and end time.');
    return;
  }

  const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

  if (endMinutes <= startMinutes) {
    alert('End time must be after start time.');
    return;
  }

  const formattedDate = formatLocalDate(date);
  const token = sessionStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const payload = {
    user_id: userId,
    department: department.toLowerCase(),
    crewing_dept: department === 'Crewing' ? crewingDept.toLowerCase() : undefined,
    operator: department === 'Crewing' ? operator.toLowerCase() : undefined,
    accounting_task: department === 'Accounting' ? accountingOption.toLowerCase() : undefined,
    employee_name: safeEmployeeName,
    purpose: purpose === 'Others' ? safeCustomPurpose : purpose.toLowerCase(),
    date: formattedDate,
    start_time: startTime,
    end_time: endTime,
  };

  try {
    const response = await axios.post(`${apiUrl}/appointment`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });

    alert('Appointment booked successfully!');
    if (typeof onAppointmentBooked === 'function') onAppointmentBooked(response.data.appointment);
    if (typeof onClose === 'function') onClose();
  } catch (error) {
    const errorMessage = error.response?.data?.message ||
                         error.response?.data?.errors?.department?.[0] ||
                         error.response?.data?.errors?.purpose?.[0] ||
                         'Failed to book appointment. Please check your inputs and try again.';
    alert(errorMessage);
  }
};




  return (
    <div className="bookModalUser">
      <div className="bookModalUser-box">
        <div className="bookModalUser-box-in">
          <div className="bookModalUser-box-in-header">
            <button
              className="bookModalUser-box-in-header-btn"
              onClick={onClose}
            >
              <Close_MD style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '4px' }} />
            </button>
            <div className="bookModalUser-box-in-header-heading">
              <Book style={{ color: "var(--black-color-opacity-45)", width: "32px", height: "32px", '--stroke-width': '4px' }} />
              Book an appointment
            </div>
          </div>

          <div className="bookModalUser-box-in-core">
            <div className="bookModalUser-box-in-core-calendar">
              <Calendar
                onChange={(value) => setDate(formatLocalDate(value))}
                value={date ? new Date(date) : new Date()}
                minDate={new Date()}
                className="homeUser-calendar"
              />
            </div>

            <div className="bookModalUser-box-in-core-data">
              <section className="bookModalUser-box-in-core-data-dept">
                <div className="bookModalUser-box-in-core-data-dept-drop">
                  <article className="bookModalUser-box-in-core-data-dept-drop-field">
                    <label htmlFor="department">Department</label>
                    <select
                      id="department"
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        setCrewingDept('');
                        setOperator('');
                        setAccountingOption('');
                      }}
                    >
                      <option value="">Select...</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </article>

                  {department === 'Crewing' && (
                    <div className="bookModalUser-box-in-core-data-dept-drop-select">
                      <article className="bookModalUser-box-in-core-data-dept-drop-select-inner">
                        <label htmlFor="crewingDept">Crewing Dept</label>
                        <select
                          id="crewingDept"
                          value={crewingDept}
                          onChange={(e) => setCrewingDept(e.target.value)}
                        >
                          <option value="">Select...</option>
                          {crewingDepts.map((cd) => (
                            <option key={cd} value={cd}>{cd}</option>
                          ))}
                        </select>
                      </article>

                      {crewingDept && (
                        <article className="bookModalUser-box-in-core-data-dept-drop-select-operator">
                          <label htmlFor="operator">Operator</label>
                          <select
                            id="operator"
                            value={operator}
                            onChange={(e) => setOperator(e.target.value)}
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
                    <div className="bookModalUser-box-in-core-data-dept-drop-select">
                      <article className="bookModalUser-box-in-core-data-dept-drop-select-inner">
                        <label htmlFor="accountingOption">Accounting Task</label>
                        <select
                          id="accountingOption"
                          value={accountingOption}
                          onChange={(e) => setAccountingOption(e.target.value)}
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

                <article className="bookModalUser-box-in-core-data-dept-name">
                  <label htmlFor="employeeName">Name of employee</label>
                  <input
                    type="text"
                    id="employeeName"
                    value={employeeName}
                    maxLength={50}
                    onChange={(e) => {
                      // Remove numbers and trimStart spaces
                      const filteredValue = e.target.value.replace(/[0-9]/g, '').trimStart();
                      setEmployeeName(filteredValue);
                    }}
                  />

                </article>

                <div className="bookModalUser-box-in-core-data-dept-purpose">
                  <article className="bookModalUser-box-in-core-data-dept-purpose-field">
                    <label htmlFor="purpose">Purpose of visit</label>
                    <select
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    >
                      <option value="">Select...</option>
                      {purposeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </article>

                  {purpose === 'Others' && (
                    <article className="bookModalUser-box-in-core-data-dept-purpose-others">
                      <label htmlFor="customPurpose">Specify Purpose</label>
                      <input
                        type="text"
                        id="customPurpose"
                        value={customPurpose}
                        onChange={(e) => setCustomPurpose(e.target.value.trimStart())}
                      />
                    </article>
                  )}
                </div>
              </section>

              <section className="bookModalUser-box-in-core-data-day">
                <article className="bookModalUser-box-in-core-data-day-date">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    min={formatLocalDate(new Date())}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </article>

                <main className="bookModalUser-box-in-core-data-day-time">
                  <article className="bookModalUser-box-in-core-data-day-time-start">
  <label htmlFor="startTime">Start time</label>
  <select
    id="startTime"
    value={startTime}
    onChange={(e) => {
      setStartTime(e.target.value);
      setEndTime(''); // Reset end time when start time changes
    }}
  >
    <option value="">Select...</option>
    {times.map((time, idx) => (
      <option key={idx} value={time}>{time}</option>
    ))}
  </select>
</article>

<article className="bookModalUser-box-in-core-data-day-time-end">
  <label htmlFor="endTime">End time</label>
  <select
    id="endTime"
    value={endTime}
    onChange={(e) => setEndTime(e.target.value)}
  >
    <option value="">Select...</option>
    {startTime 
      ? times.slice(times.findIndex(t => t === startTime) + 1).map((time, idx) => (
          <option key={idx} value={time}>{time}</option>
        ))
      : times.map((time, idx) => (
          <option key={idx} value={time}>{time}</option>
        ))
    }
  </select>
</article>

                </main>
              </section>

              <section className="bookModalUser-box-in-core-data-buttons">
                <button
                  className="bookModalUser-box-in-core-data-buttons-book"
                  onClick={handleBook}
                  disabled={!isFormValid()}

                >
                  <Calendar_Check
                    style={{
                      width: "20px",
                      height: "20px",
                      '--stroke-color': 'var(--white-color)',
                      '--stroke-width': '7px',
                    }}
                  />
                  <p>Book now</p>
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;