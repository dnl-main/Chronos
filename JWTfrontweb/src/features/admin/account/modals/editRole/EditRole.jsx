import React, { useState, useEffect } from 'react';
import './editRole.css';
import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';
import Edit_Pencil_Line_01 from '../../../../../assets/icons/Edit_Pencil_Line_01.svg?react';
import axios from 'axios';
import ProfilePictureUploader from './ProfilePictureUploader';

const departments = {
  Medical: {
    Nurse: 'Name 1',
    Doctor: 'Name 2',
    'Fleet Medical Advisor': 'Name 1',
    'Medical Coordinator': 'Name 2',
  },
  Crewing: {
    'Maran Gas': {
      'Fleet Crew Manager': 'Name 1',
      'Senior Fleet Crew Operator': 'Name 2',
      'Fleet Crew Operator': 'Name 3',
    },
    'Maran Tankers': {
      'Fleet Crew Manager': 'Name 1',
      'Senior Fleet Crew Operator': 'Name 2',
      'Fleet Crew Operator': 'Name 3',
    },
    'Maran Dry': {
      'Fleet Crew Manager': 'Name 1',
      'Senior Fleet Crew Operator': 'Name 2',
      'Fleet Crew Operator': 'Name 3',
    },
  },
  Recruitment: {
    'Senior Recruitment Officer': 'Name 1',
    'Recruitment Officer': 'Name 2',
    'Recruitment Assistant': 'Name 3',
  },
  Admin: {
    'Administrative Manager': '',
    'Administrative Officer': '',
    'Liaison Officer': '',
    'Visa': '',
  },
  Training: {
    'Training Manager': 'Name 1',
    'Training and Career Development Officer': 'Name 2',
    'Training Officer': 'Name 3',
  },
  Accounting: {
    'Chief Accounting Officer': '',
    'Audit Asst./ Reconciliation': '',
    'Allotment Officer': '',
    'Accounts Payable/Disbursement Officer': '',
    'Accounts Receivable/Billing Officer': '',
    'Payroll Officer': '',
    'General Accountant': '',
    'Auditor': '',
  },
  Support: {
    'QAR Depity DPO': 'Name 1',
    'IT Officer': 'Name 2',
  },
};


const EditRole = ({ onClose }) => {
  
  const [selectedSubDept, setSelectedSubDept] = useState('');
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDept, setSelectedDept] = useState('');
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      setSelectedDept(user.department || '');
      setSelectedJob(user.position || '');
    }
  }, []);

  const isPositionInfoSaved = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return (
      user?.position === selectedJob &&
      user?.department === selectedDept
    );
  };

const handleDeptChange = (e) => {
  const dept = e.target.value;
  setSelectedDept(dept);
  setSelectedSubDept('');
  setSelectedJob('');
};

  const handleSave = async () => {
    if (!selectedDept || !selectedJob) {
      setError('Please select a department and enter a job title.');
      return;
    }

    setLoadingPosition(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/user/update-position`,
        { position: selectedJob, department: selectedDept },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      if (response.data.status) {
        alert('Position and department updated successfully!');
        setIsEditing(false);
        const updatedUser = {
          ...JSON.parse(sessionStorage.getItem('user')),
          position: selectedJob,
          department: selectedDept,
          needs_position: false,
        };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
        onClose();
      } else {
        setError(response.data.message || 'Failed to update position and department.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setError(`Failed to update position and department: ${msg}`);
    } finally {
      setLoadingPosition(false);
    }
  };

  const handleDiscard = () => {
    if (!isPositionInfoSaved()) {
      setError('Please save your department and job title before discarding changes.');
      return;
    }
    setSelectedDept('');
    setSelectedJob('');
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="editRole">
      <div className="editRole-main">
        <header className="editRole-main-header">
          <div className="editRole-main-header-core">
            <div className="editRole-main-header-core-svg">
              <Edit_Pencil_Line_01
                style={{
                  width: '3.2vh',
                  height: '3.2vh',
                  '--stroke-color': 'var(--primary-color)',
                  '--stroke-width': '2',
                  '--fill-color': 'none',
                }}
              />
            </div>
            <div className="editRole-main-header-core-text">
              <p className="editRole-main-header-core-text-semibold">Edit Profile</p>
              <p className="editRole-main-header-core-text-light">Update your department and position</p>
            </div>
          </div>
          <div className="editRole-main-header-line"></div>
        </header>

        <div className="editRole-main-fields">
          <article className="editRole-main-fields-dept">
            <label>Department</label>
            <select value={selectedDept} onChange={handleDeptChange} disabled={!isEditing || loadingPosition}>
              <option value="">Select Department</option>
              {Object.keys(departments).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </article>
          

          {typeof departments[selectedDept] === 'object' && !Array.isArray(departments[selectedDept]) && Object.values(departments[selectedDept])[0] instanceof Object ? (
            <div className="editRole-main-fields-crewing">
              <article className="editRole-main-fields-crewing-sub">
                <label>Sub-Department</label>
                <select value={selectedSubDept} onChange={(e) => setSelectedSubDept(e.target.value)} disabled={!isEditing || loadingPosition}>
                  <option value="">Select Sub-Department</option>
                  {Object.keys(departments[selectedDept] || {}).map((subDept) => (
                    <option key={subDept} value={subDept}>{subDept}</option>
                  ))}
                </select>
              </article>

              <article className="editRole-main-fields-crewing-role">
                <label>Job Title</label>
                <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} disabled={!isEditing || loadingPosition}>
                  <option value="">Select Job Title</option>
                  {Object.keys(departments[selectedDept]?.[selectedSubDept] || {}).map((job) => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
              </article>
            </div>
          ) : (
              <article className="editRole-main-fields-role">
                <label>Job Title</label>
                <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} disabled={!isEditing || loadingPosition}>
                  <option value="">Select Job Title</option>
                  {Object.keys(departments[selectedDept] || {}).map((job) => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
              </article>
          )}

          {/* <label>Department</label>
          <select value={selectedDept} onChange={handleDeptChange} disabled={!isEditing || loadingPosition}>
            <option value="">Select Department</option>
            {Object.keys(departments).map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <label>Job Title</label>
          <input
            type="text"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            placeholder="Enter Job Title"
            disabled={!isEditing || loadingPosition}
          /> */}
        </div>
        
        <div className="editRole-main-role-buttons">
          
          <button
            className="editRole-role-buttons-discard"
            onClick={handleDiscard}
            disabled={loadingPosition}
          >
            Discard
          </button>
          <button
            className="editRole-role-buttons-save"
            onClick={handleSave}
            disabled={!selectedDept || !selectedJob || loadingPosition}
          >
            {loadingPosition ? 'Saving...' : 'Save'}
          </button>
        </div>

        {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
};

export default EditRole;
