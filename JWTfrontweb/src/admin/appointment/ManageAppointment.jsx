import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './manageAppointment.css';
import { useNavigate } from 'react-router-dom';
import ManageAppointmentCard from './appointmentComponents/ManageAppointmentCard';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Calendar_Week from '../../assets/icons/Calendar_Week.svg?react';
import Caret_Down_SM from '../../assets/icons/Caret_Down_SM.svg?react';
import Calendar_Check from '../../assets/icons/Calendar_Check.svg?react';
import Book from '../../assets/icons/Book.svg?react';

import Search from '../../assets/icons/Search.svg';
import Filter from '../../assets/icons/Filter.svg';

const ManageAppointment = () => {
  const location = useLocation();
  const routedAppointment = location.state?.appointment || null;
  const routedUser = location.state?.user || null;
  const bookedAppointments = location.state?.bookedAppointments || [];

  const [selectedAppointment, setSelectedAppointment] = useState(routedAppointment);
  const [selectedUser, setSelectedUser] = useState(routedUser);

  const navigate = useNavigate();


  const formatDate = (dateString) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).toUpperCase().replace(',', '');
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
      hour12: true
    });
  };
  

  return (
    <div className="manageAppointment">
  <button
    className="manageAppointment-exit-button"
    onClick={() => navigate(-1)}
  >
    Exit
  </button>

      <div className="manageAppointment-box">
        <div className="manageAppointment-box-in">

          {/* LEFT PANEL */}
          <div className="manageAppointment-box-in-left">
            <div className="manageAppointment-box-in-left-header">
              <Book style={{ color: "var(--black-color-opacity-45)", width: "32px", height: "32px", '--stroke-width': '4px' }} />
              <p>Manage Appointment</p>
            </div>

            <div className="manageAppointment-box-in-left-core">
              <div className="manageAppointment-box-in-left-core-top">
                <div className="manageAppointment-box-in-left-core-top-tabs">
                  <button className="manageAppointment-box-in-left-core-top-tabs-all">
                    <Circle_Primary style={{ color: "var(--white-color)", width: "20px", height: "20px" }} />
                    <p>All</p>
                  </button>
                  <button className="manageAppointment-box-in-left-core-top-tabs-available">
                    <Circle_Primary style={{ color: "var(--green-indicator)", width: "20px", height: "20px" }} />
                    <p>Available</p>
                  </button>
                  <button className="manageAppointment-box-in-left-core-top-tabs-booked">
                    <Circle_Primary style={{ color: "var(--blue-indicator)", width: "20px", height: "20px" }} />
                    <p>Booked</p>
                  </button>
                </div>

                <div className="manageAppointment-box-in-left-core-top-search">
                  <div className="manageAppointment-box-in-left-core-top-search-left">
                    <img src={Search} alt="Search icon" />
                    <p>Search</p>
                  </div>
                  <button className="manageAppointment-box-in-left-core-top-search-right">
                    <img src={Filter} alt="Filter icon" />
                  </button>
                </div>
              </div>

              <div className="manageAppointment-box-in-left-core-bot">
                <div className="manageAppointment-box-in-left-core-bot-cards">

                  {/* Selected appointment first */}
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

{bookedAppointments.map(ba => (
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
          </div>

          {/* RIGHT PANEL */}
          <div className="manageAppointment-box-in-right">
            <div className="manageAppointment-box-in-right-calendar">
              <p>calendar placeholder</p>
            </div>

            <div className="manageAppointment-box-in-right-dropdown">
              <button className="manageAppointment-box-in-right-dropdown-date">
                <div className="manageAppointment-box-in-right-dropdown-date-container">
                  <Calendar_Week style={{
                    width: "24px", height: "24px",
                    '--stroke-width': '2px',
                    '--stroke-color': 'var(--black-color-opacity-30)'
                  }} />
                  <div className="manageAppointment-box-in-right-dropdown-date-container-text">
                    <p className="manageAppointment-box-in-right-dropdown-date-container-text-light">Select a day</p>
                    <p className="manageAppointment-box-in-right-dropdown-date-container-text-semibold">
                      {selectedAppointment ? formatDate(selectedAppointment.date) : 'Select a day'}
                    </p>
                  </div>
                </div>
                <Caret_Down_SM style={{
                  width: "32px", height: "32px",
                  '--stroke-color': 'var(--black-color-opacity-45)',
                  '--stroke-width': '4px'
                }} />
              </button>

              <div className="manageAppointment-box-in-right-dropdown-time">
                <button className="manageAppointment-box-in-right-dropdown-time-start">
                  <div className="manageAppointment-box-in-right-dropdown-time-start-text">
                    <p className="manageAppointment-box-in-right-dropdown-time-start-text-light">Starts at</p>
                    <p className="manageAppointment-box-in-right-dropdown-time-start-text-semibold">
                      {selectedAppointment ? formatTime(selectedAppointment.start_time) : '--:--'}
                    </p>
                  </div>
                  <Caret_Down_SM style={{
                    width: "32px", height: "32px",
                    '--stroke-color': 'var(--black-color-opacity-45)',
                    '--stroke-width': '4px'
                  }} />
                </button>

                <button className="manageAppointment-box-in-right-dropdown-time-end">
                  <div className="manageAppointment-box-in-right-dropdown-time-end-text">
                    <p className="manageAppointment-box-in-right-dropdown-time-end-text-light">Ends at</p>
                    <p className="manageAppointment-box-in-right-dropdown-time-end-text-semibold">
                      {selectedAppointment ? formatTime(selectedAppointment.end_time) : '--:--'}
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

            <div className="manageAppointment-box-in-right-buttons">
              <button className="manageAppointment-box-in-right-buttons-reschedule">
                <p>Reschedule</p>
              </button>

              <button className="manageAppointment-box-in-right-buttons-cancel">
                <p>Cancel Appointment</p>
              </button>

              <button className="manageAppointment-box-in-right-buttons-book">
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

export default ManageAppointment;
