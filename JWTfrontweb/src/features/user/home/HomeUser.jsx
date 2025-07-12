//Dependencies imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupTokenTimeout } from '../../../app/utils/authTimeout';
import axios from 'axios';

//Components imports
import Spinner from '../../../components/ui/Spinner';
import BookAppointmentModal from '../components/modals/BookAppointment';

//CSS Imports
import './homeUser.css';
import './homeUserMQ.css';

//Icons imports
import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import House_01 from '../../../assets/icons/House_01.svg?react';


import useHomeUserLogic from './useHomeUserLogic';

import HomeUserRight from './ui/rightSide/HomeUserRight';
import HomeUserLeft from './ui/leftSide/HomeUserLeft';

const HomeUser = () => {

  const {
    user,
    loading,
    selectedStatus,
    handleStatusChange,
    handleLogout,
    formatTime,
    handleAppointmentBooked,
    handleDeleteAppointment,
    handleCertificateSubmit,
    isModalOpen,
    setIsModalOpen,
    isRescheduleModalOpen,
    setIsRescheduleModalOpen,
    appointment,
    appointmentLoading,
    certificateName,
    setCertificateName,
    primaryCertificateType,
    setPrimaryCertificateType,
    subCertificateType,
    setSubCertificateType,
    expirationDate,
    setExpirationDate,
    file,
    setFile,
    progress,
    certificateLoading,
    dateError,
    statusOptions,
    primaryTypes,
    certificateCategories,
    capitalize,
  } = useHomeUserLogic();

 
  return (
    <div className="homeUser">
      <div className="homeUser-box">
        <main className="homeUser-box-in">
          <div className="homeUser-top">
            <div className="homeUser-top-header">
              <div className="homeUser-top-header-left">
                <House_01
                  style={{
                    width: '30px',
                    height: '30px',
                    '--stroke-color': 'var(--black-color)',
                    '--stroke-width': '3px',
                    '--fill-color': 'none',
                  }}
                />
                <header>Home</header>
              </div>

              {isModalOpen && (
                <BookAppointmentModal
                  onClose={() => setIsModalOpen(false)}
                  onAppointmentBooked={handleAppointmentBooked}
                />
              )}
              {isRescheduleModalOpen && (
                <BookAppointmentModal
                  onClose={() => setIsRescheduleModalOpen(false)}
                  onAppointmentBooked={handleAppointmentBooked}
                  appointment={appointment}
                  isReschedule={true}
                />
              )}

              <div className="homeUser-top-header-right">
                <div
                  className="homeUser-top-header-right-status"
                  style={{
                    backgroundColor:
                      selectedStatus === 'Available'
                        ? '#36C081'
                        : selectedStatus === 'On Board'
                        ? 'var(--red-indicator)'
                        : selectedStatus === 'Vacation'
                        ? 'var(--yellow-indicator)'
                        : '#fff',
                    borderRadius: '50px',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <main className="homeUser-top-header-right-status-in">
                    <Circle_Primary style={{ width: '20px', height: '20px' }} />
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      style={{
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: 'inherit',
                        color: '#000',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </main>
                </div>
              </div>
            </div>

            <div className="homeUser-top-core">
              <HomeUserLeft
                appointment={appointment}
                appointmentLoading={appointmentLoading}
                formatTime={formatTime}
                handleDeleteAppointment={handleDeleteAppointment}
                setIsModalOpen={setIsModalOpen}
                setIsRescheduleModalOpen={setIsRescheduleModalOpen}
                capitalize={capitalize}
              />

              <HomeUserRight
                certificateLoading={certificateLoading}
                handleCertificateSubmit={handleCertificateSubmit}
                file={file}
                setFile={setFile}
                primaryCertificateType={primaryCertificateType}
                setPrimaryCertificateType={setPrimaryCertificateType}
                subCertificateType={subCertificateType}
                setSubCertificateType={setSubCertificateType}
                certificateName={certificateName}
                setCertificateName={setCertificateName}
                expirationDate={expirationDate}
                setExpirationDate={setExpirationDate}
                dateError={dateError}
                primaryTypes={primaryTypes}
                certificateCategories={certificateCategories}
              />
            </div>
          </div>

          <div className="homeUser-bot"></div>
        </main>
      </div>
    </div>
  );
};

export default HomeUser;