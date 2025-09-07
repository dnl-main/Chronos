// src/features/user/components/modals/BookAppointmentModal.jsx
import React from 'react';
import './bookAppointment.css';
import './BookAppointmentMQ.css';
import Calendar from 'react-calendar';
import useBookAppointment from './useBookAppointment';

import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Book from '../../../../assets/icons/Book.svg?react';
import Close_MD from '../../../../assets/icons/Close_MD.svg?react';
import Calendar_Check from '../../../../assets/icons/Calendar_Check.svg?react';

const BookAppointmentModal = ({ onClose, onAppointmentBooked, appointment = {}, isReschedule = false }) => {
  const {
    department,
    setDepartment,
    crewingDept,
    setCrewingDept,
    operator,
    setOperator,
    accountingOption,
    setAccountingOption,
    employeeName,
    setEmployeeName,
    purpose,
    setPurpose,
    customPurpose,
    setCustomPurpose,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    filteredAdmins,
    times,
    isFormValid,
    handleBook,
    departmentOptions,
    crewingDepts,
    operators,
    accountingOptions,
    purposeOptions,
    formatLocalDate, // Destructure formatLocalDate from the hook
  } = useBookAppointment({ appointment, isReschedule, onClose, onAppointmentBooked });

  return (
    <div className="bookModalUser">
      <div className="bookModalUser-box">
        <div className="bookModalUser-box-in">
          <div className="bookModalUser-box-in-header">
            <button className="bookModalUser-box-in-header-btn" onClick={onClose}>
              <Close_MD style={{ color: 'var(--primary-color)', width: '20px', height: '20px', '--stroke-width': '4px' }} />
            </button>
            <div className="bookModalUser-box-in-header-heading">
              <Book style={{ color: 'var(--black-color-opacity-45)', width: '32px', height: '32px', '--stroke-width': '4px' }} />
              {isReschedule ? 'Reschedule an appointment' : 'Book an appointment'}
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
                        const newDepartment = e.target.value;
                        setDepartment(newDepartment);
                        setCrewingDept('');
                        setOperator('');
                        setAccountingOption('');
                        if (employeeName && filteredAdmins.length > 0) {
                          const isValidAdmin = filteredAdmins.some(
                            (admin) =>
                              `${admin.first_name} ${admin.last_name}` === employeeName &&
                              (!newDepartment || admin.department?.toLowerCase() === newDepartment.toLowerCase())
                          );
                          if (!isValidAdmin) {
                            setEmployeeName('');
                          }
                        }
                      }}
                    >
                      <option value="">Select...</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </article>

                  {department === 'Crewing' && (
                    <div className="bookModalUser-box-in-core-data-dept-drop-select">
                      <article className="bookModalUser-box-in-core-data-dept-drop-select-inner">
                        <label htmlFor="crewingDept">Crewing Dept</label>
                        <select id="crewingDept" value={crewingDept} onChange={(e) => setCrewingDept(e.target.value)}>
                          <option value="">Select...</option>
                          {crewingDepts.map((cd) => (
                            <option key={cd} value={cd}>
                              {cd}
                            </option>
                          ))}
                        </select>
                      </article>

                      {crewingDept && (
                        <article className="bookModalUser-box-in-core-data-dept-drop-select-operator">
                          <label htmlFor="operator">Operator</label>
                          <select id="operator" value={operator} onChange={(e) => setOperator(e.target.value)}>
                            <option value="">Select...</option>
                            {operators.map((op) => (
                              <option key={op} value={op}>
                                {op}
                            </option>
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
                        <select id="accountingOption" value={accountingOption} onChange={(e) => setAccountingOption(e.target.value)}>
                          <option value="">Select...</option>
                          {accountingOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </article>
                    </div>
                  )}
                </div>

                <article className="bookModalUser-box-in-core-data-dept-name">
                  <label htmlFor="employeeName">Assigned to</label>
                  <select id="employeeName" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} disabled={!department}>
                    <option value="">Select an admin...</option>
                    {filteredAdmins
  .filter((admin) => !department || admin.department?.toLowerCase() === department.toLowerCase())
  .map((admin) => (
    <option
      key={`${admin.first_name}-${admin.last_name}`}
      value={`${admin.first_name} ${admin.last_name}`}
    >
      {`${admin.first_name} ${admin.last_name} (${admin.department || 'No Department'})`}
    </option>
  ))}

                  </select>
                </article>

                <div className="bookModalUser-box-in-core-data-dept-purpose">
                  <article className="bookModalUser-box-in-core-data-dept-purpose-field">
                    <label htmlFor="purpose">Purpose of visit</label>
                    <select id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                      <option value="">Select...</option>
                      {purposeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
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
                        setEndTime('');
                      }}
                    >
                      <option value="">Select...</option>
                      {times.map((time, idx) => (
                        <option key={idx} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </article>

                  <article className="bookModalUser-box-in-core-data-day-time-end">
                    <label htmlFor="endTime">End time</label>
                    <select id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                      <option value="">Select...</option>
                      {startTime
                        ? times.slice(times.findIndex((t) => t === startTime) + 1).map((time, idx) => (
                            <option key={idx} value={time}>
                              {time}
                            </option>
                          ))
                        : times.map((time, idx) => (
                            <option key={idx} value={time}>
                              {time}
                            </option>
                          ))}
                    </select>
                  </article>
                </main>
              </section>

              <section className="bookModalUser-box-in-core-data-buttons">
                <button className="bookModalUser-box-in-core-data-buttons-book" onClick={handleBook} disabled={!isFormValid()}>
                  <Calendar_Check
                    style={{
                      width: '20px',
                      height: '20px',
                      '--stroke-color': 'var(--white-color)',
                      '--stroke-width': '7px',
                    }}
                  />
                  <p>{isReschedule ? 'Reschedule now' : 'Book now'}</p>
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