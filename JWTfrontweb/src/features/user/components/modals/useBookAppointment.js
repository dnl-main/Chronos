// src/features/user/components/modals/useBookAppointment.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const departmentOptions = ['Crewing', 'Medical', 'Accounting', 'Recruitment', 'Admin', 'Training', 'Support'];
const crewingDepts = ['Maran Gas', 'Maran Dry', 'Maran Tankers'];
const operators = [
  'Fleet Crew Manager',
  'Senior Fleet Crew Operator',
  'Crew Operator 1',
  'Crew Operator 2',
  'Crew Operator 3',
];
const accountingOptions = ['Allotment', 'Final Balance', 'Check Releasing'];
const purposeOptions = ['Document Submission', 'Contract Signing', 'Training', 'Allowance Distribution', 'Others'];
const times = [];
for (let hour = 9; hour <= 18; hour++) {
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? 'AM' : 'PM';
  times.push(`${displayHour}:00 ${period}`);
  if (hour !== 18) {
    times.push(`${displayHour}:30 ${period}`);
  }
}

const formatLocalDate = (inputDate) => {
  if (!inputDate) return '';
  const dateObj = new Date(inputDate);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

const useBookAppointment = ({ appointment = {}, isReschedule = false, onClose, onAppointmentBooked }) => {
  const [department, setDepartment] = useState(
    appointment.department
      ? departmentOptions.find((opt) => opt.toLowerCase() === appointment.department.toLowerCase()) || ''
      : ''
  );
  const [crewingDept, setCrewingDept] = useState(
    appointment.crewing_dept
      ? crewingDepts.find((opt) => opt.toLowerCase() === appointment.crewing_dept.toLowerCase()) || ''
      : ''
  );
  const [operator, setOperator] = useState(
    appointment.operator
      ? operators.find((opt) => opt.toLowerCase() === appointment.operator.toLowerCase()) || ''
      : ''
  );
  const [accountingOption, setAccountingOption] = useState(
    appointment.accounting_task
      ? accountingOptions.find((opt) => opt.toLowerCase() === appointment.accounting_task.toLowerCase()) || ''
      : ''
  );
  const [employeeName, setEmployeeName] = useState(appointment.employee || '');
  const [purpose, setPurpose] = useState(
    appointment.purpose
      ? purposeOptions.find((opt) => opt.toLowerCase() === appointment.purpose.toLowerCase()) || 'Others'
      : ''
  );
  const [customPurpose, setCustomPurpose] = useState(
    appointment.purpose && !purposeOptions.find((opt) => opt.toLowerCase() === appointment.purpose.toLowerCase())
      ? appointment.purpose
      : ''
  );
  const [date, setDate] = useState(formatLocalDate(appointment.date));
  const [startTime, setStartTime] = useState(appointment.start_time ? to12HourFormat(appointment.start_time) : '');
  const [endTime, setEndTime] = useState(appointment.end_time ? to12HourFormat(appointment.end_time) : '');
  const [userId, setUserId] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [isAdminsLoaded, setIsAdminsLoaded] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const token = sessionStorage.getItem('token');
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
  }, [apiUrl]);

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.get(`${apiUrl}/crew-members/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setAdmins(response.data);
        setFilteredAdmins(response.data);
        setIsAdminsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch admins:', error.response?.data || error.message);
        alert('Unable to fetch admin list. Please try again.');
        setIsAdminsLoaded(true);
      }
    };

    fetchAdmins();
  }, [apiUrl]);

  // Filter admins based on department selection
  useEffect(() => {
    if (!isAdminsLoaded) return;

    let filtered = admins;
    if (department) {
      filtered = admins.filter((admin) => admin.department?.toLowerCase() === department.toLowerCase());
    }
    setFilteredAdmins(filtered);

    if (employeeName) {
      const isValidAdmin = filtered.some((admin) => `${admin.first_name} ${admin.last_name}` === employeeName);
      if (!isValidAdmin && department && !isReschedule) {
        setEmployeeName('');
      } else if (!isValidAdmin && department && isReschedule) {
        setEmployeeName('');
      }
    }
  }, [department, admins, employeeName, isReschedule, isAdminsLoaded]);

  const isFormValid = () => {
    if (!userId || !department || !employeeName || !purpose || !date || !startTime || !endTime) return false;
    if (department === 'Crewing' && (!crewingDept || !operator)) return false;
    if (department === 'Accounting' && !accountingOption) return false;
    if (purpose === 'Others' && !customPurpose.trim()) return false;
    if (purpose === 'Others' && customPurpose.trim().length < 3) return false;
    return true;
  };

  const sanitizeInput = (input) => {
    return input.replace(/[<>&"'`]/g, '');
  };

  const handleBook = async () => {
    const trimmedCustomPurpose = customPurpose.trim();
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

    if (!employeeName) {
      alert('Please select an admin.');
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

    const startMinutes = parseInt(to24HourFormat(startTime).split(':')[0]) * 60 + parseInt(to24HourFormat(startTime).split(':')[1]);
    const endMinutes = parseInt(to24HourFormat(endTime).split(':')[0]) * 60 + parseInt(to24HourFormat(endTime).split(':')[1]);

    if (endMinutes <= startMinutes) {
      alert('End time must be after start time.');
      return;
    }

    const formattedDate = formatLocalDate(date);
    const token = sessionStorage.getItem('token');

    const payload = {
      user_id: userId,
      department: department.toLowerCase(),
      crewing_dept: department === 'Crewing' ? crewingDept.toLowerCase() : undefined,
      operator: department === 'Crewing' ? operator.toLowerCase() : undefined,
      accounting_task: department === 'Accounting' ? accountingOption.toLowerCase() : undefined,
      employee_name: employeeName,
      purpose: purpose === 'Others' ? safeCustomPurpose : purpose.toLowerCase(),
      date: formattedDate,
      start_time: to24HourFormat(startTime),
      end_time: to24HourFormat(endTime),
    };

    try {
      let response;
      if (isReschedule && appointment.id) {
        response = await axios.patch(`${apiUrl}/appointment/${appointment.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
      } else {
        response = await axios.post(`${apiUrl}/appointment/schedule`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
      }

      alert(isReschedule ? 'Appointment rescheduled successfully!' : 'Appointment booked successfully!');
      if (typeof onAppointmentBooked === 'function') onAppointmentBooked(response.data.appointment);
      if (typeof onClose === 'function') onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.department?.[0] ||
        error.response?.data?.errors?.purpose?.[0] ||
        (isReschedule ? 'Failed to reschedule appointment. Please check your inputs and try again.' : 'Failed to book appointment. Please check your inputs and try again.');
      alert(errorMessage);
    }
  };

  return {
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
    formatLocalDate,
  };
};

export default useBookAppointment;