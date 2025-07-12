import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setupTokenTimeout } from '../../../app/utils/authTimeout';

const useHomeUserLogic = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const queryClient = useQueryClient();
  const token = useMemo(() => sessionStorage.getItem('token'), []);
    const storedUser = useMemo(() => {
      const user = sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }, []);


  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [appointment, setAppointment] = useState({
    date: '', start_time: '', end_time: '', department: '', crewing_dept: '',
    operator: '', accounting_task: '', employee: '', purpose: '', status: ''
  });
  const [certificateName, setCertificateName] = useState('');
  const [primaryCertificateType, setPrimaryCertificateType] = useState('');
  const [subCertificateType, setSubCertificateType] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ percentage: 0, uploaded: 0, total: 4 });
  const [dateError, setDateError] = useState('');

  const statusOptions = ['On Board', 'Available', 'Vacation'];

  const certificateCategories = {
    Medical: ['Health Check', 'Vaccination', 'Medical Certificate', 'Pre-Employment Medical Examination', 'Firness for Sea Service', 'Health Insurance'],
    Training: ['Workshop', 'Certification', 'Seaman Training I', 'Leadership Training I', 'Seaman Training II', 'Leadership Training II', 'Leadership Training III', 'Safety Certificates / Basic Safety Training & Crowd Management', 'Deck Cadet', 'Engine Cadet Training', 'Steward Training', 'BRM (Bridge Resource Management)', 'ERM (Engine Room Resource Management)', 'Radar / ARPA / ECDIS', 'LNG Carrier Operations', 'Oil Tanker Familiarization', 'Leadership % Teamwork'],
    PDOS: ['Cultural Briefing', 'Financial Literacy', 'Seafarer Safety Awareness', 'Shipboard Emergency Procedures', 'Secual Harassment Awareness', 'COVID Protocol Orientaion'],
    'Employment Document': ['Passport', 'ID Card', 'Contract', 'Pre-Employment Orientation Seminar (PEOS)', 'Seaman’s Book', 'Contract Of Employment', 'Crew ID-Card', 'C1/D Visa', 'Criminal Record Certificates', 'Sea Service Record'],
    SOLAS: ['International Ship Safety Equipment Certificate', 'Minimum Safe Manning Certificate', 'International Ship Construction Certificate', 'Passenger Ship Safety Certificate', 'Cargo Ship Safety Certificate', 'Cargo Ship Safety Construction Certificate', 'Cargo Ship Safety Equipment Certificate', 'Cargo Ship Safety Radio Certificate', 'International Tonnage Certificate', 'International Load Line Certificate', 'Safety Manamgement Certificate', 'Ship Security Certificate', 'International Oil Polution Prevention Certificate', 'International Sewage Pollution Prevention Certificate', 'International Air Pollution Prevention Certificate', 'PST (Personal Survival Techniques)', 'FPFF (Fire Prevention and Fire Fighting)', 'EFA (Elementary First Aid)', 'PSSR (Personal Safety and Social Responsibility)', 'Security Awareness', 'Advanced Fire Fighting', 'PSCRB (Rescue Boats)', 'Enclosed Space Rescue', 'HUET (Helicopter Escape)'],
    'STCW Certifications': ['STCW Basic Safety Training', 'STCW Proficiency in Survival Craft and Rescue Boats', 'STCW Proficiency in Fast Rescue Boats', 'STCW Proficiency in Designated Security Duties', 'STCW Proficiency in Security Awareness', 'STCW Proficiency in Crisis Management and Human Behavior', 'STCW Proficiency in Advanced Fire Fighting', 'STCW Proficiency in Medical First Aid'],
    "Seaman's Passport": ['Able Seaman — Unlimited', 'Able Seaman — Limited', 'Able Seaman', 'STCW Basic Safety (PST, FPFF, EFA, PSSR)', 'Watchkeeping Certificate', 'Crowd Management & Crisis Control', 'Radar Navigation & Collision Avoidance', 'Ship Security Awareness', 'Others'],
  };

  const primaryTypes = Object.keys(certificateCategories);

const hasRun = useRef(false);

useEffect(() => {
  if (hasRun.current) return;
  hasRun.current = true;

  if (!token) {
    navigate('/login');
    return;
  }

  setupTokenTimeout(token, storedUser, navigate);
}, []);


  const {
    data: user,
    isLoading: loadingUser,
    isError: errorUser,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      if (response.data.role !== 'user') navigate('/login');
      sessionStorage.setItem('user', JSON.stringify(response.data));
      setSelectedStatus(response.data.availability || 'Available');
      return response.data;
    },
    enabled: !!token,
    onError: () => navigate('/login'),
  });

  const {
    data: appointmentData,
    isLoading: appointmentLoading,
  } = useQuery({
    queryKey: ['appointment'],
    queryFn: async () => {
      const response = await axios.get(`${apiUrl}/appointment`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      const appt = Array.isArray(response.data) ? response.data[0] : response.data;
      return {
        id: appt?.id || null,
        date: appt?.date || '',
        start_time: appt?.start_time || '',
        end_time: appt?.end_time || '',
        department: appt?.department || '',
        crewing_dept: appt?.crewing_dept || '',
        operator: appt?.operator || '',
        accounting_task: appt?.accounting_task || '',
        employee: appt?.employee || '',
        purpose: appt?.purpose || '',
        status: appt?.status || '',
      };
    },
    enabled: !!token,
    onError: () => setAppointment({
      id: null, date: '', start_time: '', end_time: '', department: '', crewing_dept: '',
      operator: '', accounting_task: '', employee: '', purpose: '', status: ''
    }),
  });

  useEffect(() => {
    if (appointmentData) setAppointment(appointmentData);
  }, [appointmentData]);

  // const {
  //   data: certificatesData,
  //   isLoading: certificateLoading,
  // } = useQuery({
  //   queryKey: ['certificates'],
  //   queryFn: async () => {
  //     const response = await axios.get(`${apiUrl}/certificates`, {
  //       headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
  //     });
  //     return response.data;
  //   },
  //   enabled: !!token,
  //   onError: (error) => alert(error.response?.data.message || 'Failed to load certificates'),
  // });

  // useEffect(() => {
  //   if (certificatesData) {
  //     const uploaded = certificatesData.certificates?.length || 0;
  //     const total = 4;
  //     const percentage = Math.round((uploaded / total) * 100);
  //     setProgress({ percentage, uploaded, total });
  //   }
  // }, [certificatesData]);

  const statusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const response = await axios.patch(
        `${apiUrl}/user/availability`,
        { availability: newStatus },
        { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }
      );
      return response.data.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Status updated successfully');
    },
    onError: (error) => alert(error.response?.data.message || 'Failed to update status'),
  });

  useEffect(() => {
    if (user && selectedStatus && selectedStatus !== user.availability) {
      statusMutation.mutate(selectedStatus);
    }
  }, [selectedStatus, user]);

  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/logout`, {}, { headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } });
    } catch {}
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/');
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleAppointmentBooked = (appt) => setAppointment({ ...appt });

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const deleteAppointmentMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`${apiUrl}/appointment`, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
    },
    onSuccess: () => {
      setAppointment({
        id: null, date: '', start_time: '', end_time: '', department: '', crewing_dept: '',
        operator: '', accounting_task: '', employee: '', purpose: '', status: ''
      });
      alert('Appointment deleted successfully');
      queryClient.invalidateQueries(['appointment']);
    },
    onError: (error) => alert(error.response?.data.message || 'Failed to delete appointment'),
  });

  const handleDeleteAppointment = () => {
    if (!appointment.id) return alert('No appointment to delete');
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointmentMutation.mutate();
    }
  };

  const uploadCertificateMutation = useMutation({
    mutationFn: async (formData) => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true',
        },
        onUploadProgress: (event) => {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgress((prev) => ({ ...prev, percentage }));
        },
      };
      const response = await axios.post(`${apiUrl}/certificates`, formData, config);
      return response.data;
    },
    onSuccess: () => {
      alert('Certificate uploaded successfully');
      setIsModalOpen(false);
      setCertificateName('');
      setPrimaryCertificateType('');
      setSubCertificateType('');
      setExpirationDate('');
      setFile(null);
      queryClient.invalidateQueries(['certificates']);
    },
    onError: (error) => alert(error.response?.data.message || 'Failed to upload certificate'),
  });

  const handleSubmitCertificate = (e) => {
    e.preventDefault();

    if (!certificateName.trim() || !primaryCertificateType || !subCertificateType || !expirationDate || !file) {
      alert('All fields are required');
      return;
    }

    const today = new Date();
    const expDate = new Date(expirationDate);
    if (expDate < today) {
      setDateError('Expiration date cannot be in the past');
      return;
    }
    setDateError('');

    const formData = new FormData();
    formData.append('certificate_name', certificateName);
    formData.append('primary_certificate_type', primaryCertificateType);
    formData.append('sub_certificate_type', subCertificateType);
    formData.append('expiration_date', expirationDate);
    formData.append('file', file);

    uploadCertificateMutation.mutate(formData);
  };

  const rescheduleMutation = useMutation({
    mutationFn: async (rescheduleData) => {
      const response = await axios.patch(`${apiUrl}/appointment/${appointment.id}`, rescheduleData, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      return response.data;
    },
    onSuccess: (data) => {
      alert('Appointment rescheduled successfully');
      setAppointment(data);
      setIsRescheduleModalOpen(false);
      queryClient.invalidateQueries(['appointment']);
    },
    onError: (error) => alert(error.response?.data.message || 'Failed to reschedule appointment'),
  });

  const handleRescheduleAppointment = (rescheduleData) => {
    rescheduleMutation.mutate(rescheduleData);
  };

  return {
    user,
    loadingUser,
    errorUser,
    appointment,
    appointmentLoading,
    // certificatesData,
    // certificateLoading,
    // progress,
    selectedStatus,
    statusOptions,
    handleStatusChange,
    handleLogout,
    formatTime,
    handleAppointmentBooked,
    capitalize,
    isModalOpen,
    setIsModalOpen,
    certificateName,
    setCertificateName,
    primaryTypes,
    primaryCertificateType,
    setPrimaryCertificateType,
    subCertificateType,
    setSubCertificateType,
    certificateCategories,
    expirationDate,
    setExpirationDate,
    file,
    setFile,
    dateError,
    handleSubmitCertificate,
    isRescheduleModalOpen,
    setIsRescheduleModalOpen,
    handleDeleteAppointment,
    handleRescheduleAppointment,
  };
};

export default useHomeUserLogic;
