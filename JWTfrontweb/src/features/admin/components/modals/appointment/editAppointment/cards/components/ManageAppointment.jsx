import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/manageAppointment.css';

import Book from '../../../../../../../../assets/icons/Book.svg?react';
import Close_MD from '../../../../../../../../assets/icons/Close_MD.svg?react';

import ManageAppointmentCard from '../EditAppointmentCard';
import AppointmentSummaryModal from '../../modals/AppointmentSummaryModal';
import CancelSummaryModal from '../../modals/CancelSummary';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const purposeOptions = ['Document submission', 'Contract Signing', 'Training', 'Allowance Distribution', 'Others'];

const times = [];
for (let hour = 9; hour <= 18; hour++) {
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? 'AM' : 'PM';
  times.push(`${displayHour}:00 ${period}`);
  if (hour !== 18) {
    times.push(`${displayHour}:30 ${period}`);
  }
}

const to24HourFormat = (time12h) => {
  if (!time12h) return '';
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const to12HourFormat = (time24h) => {
  if (!time24h) return '';
  const [hours, minutes] = time24h.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const ManageAppointment = ({ appointment, user, bookedAppointments = [], onClose }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedUser, setSelectedUser] = useState(user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (appointment) {
      const normalizePurpose = (p) => {
        if (!p || typeof p !== 'string') return '';
        const lowerPurpose = p.toLowerCase();
        const matchingOption = purposeOptions.find(opt => opt.toLowerCase() === lowerPurpose);
        return matchingOption || p.charAt(0).toUpperCase() + p.slice(1);
      };

      const newSelectedAppointment = {
        ...appointment,
        original_date: appointment.date || '',
        start_time: to12HourFormat(appointment.start_time) || '',
        end_time: to12HourFormat(appointment.end_time) || '',
        department: appointment.department || 'crewing',
        crewingDept: appointment.crewing_dept || '',
        operator: appointment.operator || '',
        accountingOption: appointment.accounting_task || '',
        employeeName: appointment.employee || (user ? `${user.first_name} ${user.last_name}` : ''),
        purpose: normalizePurpose(appointment.purpose),
      };
      setSelectedAppointment(newSelectedAppointment);
      setPurpose(newSelectedAppointment.purpose || '');
      setCustomPurpose(newSelectedAppointment.purpose === 'Others' ? newSelectedAppointment.purpose : '');
    }
    setSelectedUser(user);
  }, [appointment, user]);

  const normalizeTime = (time) => {
    return to24HourFormat(time);
  };

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
    return timeString; // Already in 12-hour format
  };

  const departmentOptions = ['crewing', 'medical', 'accounting'];
  const crewingDepts = ['maran gas', 'maran dry', 'maran tankers'];
  const operators = [
    'fleet crew manager',
    'senior fleet crew operator',
    'crew operator 1',
    'crew operator 2',
    'crew operator 3',
  ];
  const accountingOptions = ['allotment', 'final balance', 'check releasing'];

  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ') : '');

  const handleReschedule = async () => {
    if (!selectedAppointment?.id) {
      const errorMsg = 'No appointment selected.';
      setError(errorMsg);
      return;
    }

    if (
      !selectedAppointment.date ||
      !selectedAppointment.start_time ||
      !selectedAppointment.end_time
    ) {
      const errorMsg = 'Please fill in all fields: date, start time, and end time.';
      setError(errorMsg);
      return;
    }

    if (!selectedAppointment.department) {
      const errorMsg = 'Please select a department.';
      setError(errorMsg);
      return;
    }

    if (selectedAppointment.department === 'crewing' && !selectedAppointment.operator) {
      const errorMsg = 'Please select an operator for Crewing department.';
      setError(errorMsg);
      return;
    }

    if (selectedAppointment.department === 'accounting' && !selectedAppointment.accountingOption) {
      const errorMsg = 'Please select an accounting task.';
      setError(errorMsg);
      return;
    }

    if (!selectedAppointment.employeeName) {
      const errorMsg = 'Please provide an employee name.';
      setError(errorMsg);
      return;
    }

    if (!purpose) {
      const errorMsg = 'Please select a Purpose of visit.';
      setError(errorMsg);
      return;
    }

    if (purpose === 'Others' && !customPurpose) {
      const errorMsg = 'Please specify the purpose of visit.';
      setError(errorMsg);
      return;
    }

    const isValidDate = (date) => {
      if (!date) return false;
      const parsed = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsed >= today && !isNaN(parsed);
    };

    if (!isValidDate(selectedAppointment.date)) {
      const errorMsg = 'Date must be today or in the future in YYYY-MM-DD format.';
      setError(errorMsg);
      return;
    }

    const startMinutes = parseInt(to24HourFormat(selectedAppointment.start_time).split(':')[0]) * 60 + parseInt(to24HourFormat(selectedAppointment.start_time).split(':')[1]);
    const endMinutes = parseInt(to24HourFormat(selectedAppointment.end_time).split(':')[0]) * 60 + parseInt(to24HourFormat(selectedAppointment.end_time).split(':')[1]);

    if (endMinutes <= startMinutes) {
      const errorMsg = 'End time must be after start time.';
      setError(errorMsg);
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const payload = {
        ...(selectedUser?.id && { user_id: selectedUser.id }),
        date: selectedAppointment.date,
        start_time: to24HourFormat(selectedAppointment.start_time),
        end_time: to24HourFormat(selectedAppointment.end_time),
        department: selectedAppointment.department.toLowerCase(),
        crewing_dept: selectedAppointment.crewingDept || null,
        operator: selectedAppointment.operator ? selectedAppointment.operator.toLowerCase() : null,
        accounting_task: selectedAppointment.accountingOption || null,
        employee_name: selectedAppointment.employeeName,
        purpose: purpose === 'Others' ? customPurpose.toLowerCase() : purpose.toLowerCase(),
      };

      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await axios.put(
        `${apiUrl}/appointment/${selectedAppointment.id}/reschedule`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          withCredentials: true,
        }
      );

      setIsModalOpen(false);
      setError(null);
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(' ')
          : error.response?.data?.message || 'Failed to reschedule appointment.';
      setError(errorMessage);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('You are not authorized to reschedule appointments. Please contact an admin.');
        onClose();
        window.location.href = '/login';
      }
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment?.id) {
      const errorMsg = 'No appointment selected.';
      setError(errorMsg);
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await axios.delete(
        `${apiUrl}/appointment/${selectedAppointment.id}/cancel`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          withCredentials: true,
        }
      );

      setIsCancelModalOpen(false);
      setError(null);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel appointment.';
      setError(errorMessage);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('You are not authorized to cancel appointments. Please contact an admin.');
        onClose();
        window.location.href = '/login';
      }
    }
  };

  const handleCertificateClick = () => {
    navigate('/admin/certificate');
  };

  const isFormValid =
    selectedAppointment?.date &&
    selectedAppointment?.start_time &&
    selectedAppointment?.end_time &&
    to24HourFormat(selectedAppointment?.end_time) > to24HourFormat(selectedAppointment?.start_time) &&
    selectedAppointment?.department &&
    selectedAppointment?.employeeName &&
    (selectedAppointment?.department !== 'crewing' || selectedAppointment?.operator) &&
    (selectedAppointment?.department !== 'accounting' || selectedAppointment?.accountingOption) &&
    purpose &&
    (purpose !== 'Others' || customPurpose);

  return (
    <>
      <div className="editAppointment">
        <div className="editAppointment-box">
          <div className="editAppointment-box-in">
            <div className="editAppointment-box-in-left">
              <div className="editAppointment-box-in-left-header">
                <button
                  className="editAppointment-box-in-left-close"
                  onClick={onClose}
                >
                  <Close_MD
                    style={{
                      color: 'var(--primary-color)',
                      width: '20px',
                      height: '20px',
                      '--stroke-width': '4px',
                    }}
                  />
                </button>
                <div className="editAppointment-box-in-left-header-heading">
                  <Book
                    style={{
                      color: 'var(--black-color-opacity-45)',
                      width: '32px',
                      height: '32px',
                      '--stroke-width': '4px',
                    }}
                  />
                  <p>Edit Appointment</p>
                </div>
              </div>

              <div className="editAppointment-box-in-left-core">
                <div className="editAppointment-box-in-left-core-cards">
                  {appointment && user && (
                    <ManageAppointmentCard
                      appointment={appointment}
                      user={user}
                      onSelect={() => {
                        setSelectedAppointment({
                          ...appointment,
                          start_time: to12HourFormat(appointment.start_time),
                          end_time: to12HourFormat(appointment.end_time),
                          purpose: purpose || '',
                        });
                        setSelectedUser(user);
                      }}
                      onCertificateClick={handleCertificateClick}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="editAppointment-box-in-right">
              {error && (
                <div
                  className="manageAppointment-error"
                  style={{ color: 'red', marginBottom: '1rem' }}
                >
                  {error}
                </div>
              )}
              <main className="editAppointment-box-in-right-dept">
                <div className="editAppointment-box-in-right-dept-drop">
                  <article className="editAppointment-box-in-right-dept-drop-field">
                    <label htmlFor="department">Department</label>
                    <select
                      id="department"
                      value={selectedAppointment?.department || ''}
                      onChange={(e) => {
                        const department = e.target.value;
                        setSelectedAppointment((prev) => ({
                          ...prev,
                          department,
                          crewingDept: '',
                          operator: '',
                          accountingOption: '',
                        }));
                        setPurpose('');
                        setCustomPurpose('');
                      }}
                    >
                      <option value="">Select...</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept}>
                          {capitalize(dept)}
                        </option>
                      ))}
                    </select>
                  </article>

                  {selectedAppointment?.department === 'crewing' ? (
                    <div className="editAppointment-box-in-right-dept-drop-select">
                      <article className="editAppointment-box-in-right-dept-drop-select-inner">
                        <label htmlFor="crewingDept">Crewing Dept</label>
                        <select
                          id="crewingDept"
                          value={selectedAppointment?.crewingDept || ''}
                          onChange={(e) => {
                            setSelectedAppointment((prev) => ({
                              ...prev,
                              crewingDept: e.target.value,
                            }));
                          }}
                        >
                          <option value="">Select...</option>
                          {crewingDepts.map((cd) => (
                            <option key={cd} value={cd}>
                              {cd.split(' ').map(word => capitalize(word)).join(' ')}
                            </option>
                          ))}
                        </select>
                      </article>

                      {selectedAppointment?.crewingDept && (
                        <article className="editAppointment-box-in-right-dept-drop-select-operator">
                          <label htmlFor="operator">Operator</label>
                          <select
                            id="operator"
                            value={selectedAppointment?.operator || ''}
                            onChange={(e) => {
                              setSelectedAppointment((prev) => ({
                                ...prev,
                                operator: e.target.value,
                              }));
                            }}
                          >
                            <option value="">Select...</option>
                            {operators.map((op) => (
                              <option key={op} value={op}>
                                {op.split(' ').map(word => capitalize(word)).join(' ')}
                              </option>
                            ))}
                          </select>
                        </article>
                      )}
                    </div>
                  ) : (
                    selectedAppointment?.department && (
                      <p></p>
                    )
                  )}

                  {selectedAppointment?.department === 'accounting' && (
                    <div className="editAppointment-box-in-right-dept-drop-select">
                      <article className="editAppointment-box-in-right-dept-drop-select-inner">
                        <label htmlFor="accountingOption">Accounting Task</label>
                        <select
                          id="accountingOption"
                          value={selectedAppointment?.accountingOption || ''}
                          onChange={(e) => {
                            setSelectedAppointment((prev) => ({
                              ...prev,
                              accountingOption: e.target.value,
                            }));
                          }}
                        >
                          <option value="">Select...</option>
                          {accountingOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt.split(' ').map(word => capitalize(word)).join(' ')}
                            </option>
                          ))}
                        </select>
                      </article>
                    </div>
                  )}
                </div>

                <article className="editAppointment-box-in-right-dept-name">
                  <label htmlFor="employeeName">Name</label>
                  <input
                    type="text"
                    id="employeeName"
                    value={selectedAppointment?.employeeName || ''}
                    onChange={(e) => {
                      setSelectedAppointment((prev) => ({
                        ...prev,
                        employeeName: e.target.value,
                      }));
                    }}
                  />
                </article>

                <div className="editAppointment-box-in-right-dept-purpose">
                  <article className="editAppointment-box-in-right-dept-purpose">
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
                    <article className="editAppointment-box-in-right-dept-custom-purpose">
                      <label htmlFor="customPurpose">Specify Purpose</label>
                      <input
                        type="text"
                        id="customPurpose"
                        value={customPurpose}
                        onChange={(e) => setCustomPurpose(e.target.value)}
                        placeholder="Enter custom purpose"
                      />
                    </article>
                  )}
                </div>
              </main>

              <main className="editAppointment-box-in-right-dropdown">
                <article className="editAppointment-box-in-right-dropdown-date">
                  <label htmlFor="date">Date</label>
                  <input
                    type="text"
                    id="date"
                    value={selectedAppointment?.date || ''}
                    onChange={(e) => {
                      setSelectedAppointment({
                        ...selectedAppointment,
                        date: e.target.value,
                      });
                    }}
                    placeholder="YYYY-MM-DD"
                  />
                </article>

                <div className="editAppointment-box-in-right-dropdown-time">
                  <article className="editAppointment-box-in-right-dropdown-time-start">
                    <label htmlFor="startTime">Starts at</label>
                    <select
                      id="startTime"
                      value={selectedAppointment?.start_time || ''}
                      onChange={(e) => {
                        setSelectedAppointment({
                          ...selectedAppointment,
                          start_time: e.target.value,
                        });
                        setSelectedAppointment((prev) => ({
                          ...prev,
                          end_time: '',
                        }));
                      }}
                    >
                      <option value="">Select...</option>
                      {times.map((time, idx) => (
                        <option key={idx} value={time}>{time}</option>
                      ))}
                    </select>
                  </article>
                  <article className="editAppointment-box-in-right-dropdown-time-end">
                    <label htmlFor="endTime">Ends at</label>
                    <select
                      id="endTime"
                      value={selectedAppointment?.end_time || ''}
                      onChange={(e) => {
                        setSelectedAppointment({
                          ...selectedAppointment,
                          end_time: e.target.value,
                        });
                      }}
                    >
                      <option value="">Select...</option>
                      {selectedAppointment?.start_time
                        ? times.slice(times.findIndex(t => t === selectedAppointment.start_time) + 1).map((time, idx) => (
                            <option key={idx} value={time}>{time}</option>
                          ))
                        : times.map((time, idx) => (
                            <option key={idx} value={time}>{time}</option>
                          ))
                      }
                    </select>
                  </article>
                </div>
              </main>

              <main className="editAppointment-box-in-right-buttons">
                <button
                  className="editAppointment-box-in-right-buttons-cancel"
                  onClick={() => {
                    setIsCancelModalOpen(true);
                  }}
                >
                  <p>Cancel Appointment</p>
                </button>
                <button
                  className="editAppointment-box-in-right-buttons-book"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  disabled={!isFormValid}
                >
                  <p>Reschedule Now</p>
                </button>
              </main>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AppointmentSummaryModal
          appointment={{
            ...selectedAppointment,
            purpose: purpose === 'Others' ? customPurpose : purpose,
            start_time: to24HourFormat(selectedAppointment.start_time),
            end_time: to24HourFormat(selectedAppointment.end_time),
          }}
          user={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setError(null);
          }}
          onConfirm={() => {
            handleReschedule();
          }}
        />
      )}

      {isCancelModalOpen && (
        <CancelSummaryModal
          appointment={{
            ...selectedAppointment,
            purpose: purpose === 'Others' ? customPurpose : purpose,
            start_time: to24HourFormat(selectedAppointment.start_time),
            end_time: to24HourFormat(selectedAppointment.end_time),
          }}
          user={selectedUser}
          onClose={() => {
            setIsCancelModalOpen(false);
            setError(null);
          }}
          onConfirm={() => {
            handleCancel();
          }}
        />
      )}
    </>
  );
};

export default ManageAppointment;