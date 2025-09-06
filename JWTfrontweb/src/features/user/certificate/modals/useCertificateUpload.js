import { useState, useRef } from 'react';   // 🔹 added useRef
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCertificateUpload = (token, apiUrl) => {
  const queryClient = useQueryClient();

  const [certificateName, setCertificateName] = useState('');
  const [primaryCertificateType, setPrimaryCertificateType] = useState('');
  const [subCertificateType, setSubCertificateType] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState({ percentage: 0 });
  const [dateError, setDateError] = useState('');

  // 🔹 NEW: synchronous guard to prevent rapid double submissions
  const submittingRef = useRef(false);

  // Must match Laravel backend categories
  const certificateCategories = {
    Medical: [
      'Health Check',
      'Pre-Employment Medical Examination',
      'Fitness for Sea Service',
      'Medical Certificate / Fitness for Sea Service',
      'Health Insurance',
      'Medical Certificate',
    ],
    Training: [
      'Workshop',
      'Certification',
      'Seaman Training I',
      'Leadership Training I',
      'Seaman Training II',
      'Leadership Training II',
      'Leadership Training III',
      'Safety Certificates / Basic Safety Training & Crowd Management',
      'Deck Cadet',
      'Engine Cadet Training',
      'Steward Training',
      'BRM (Bridge Resource Management)',
      'ERM (Engine Room Resource Management)',
      'Radar / ARPA / ECDIS',
      'LNG Carrier Operations',
      'Oil Tanker Familiarization',
      'Leadership & Teamwork',
    ],
    PDOS: [
      'Cultural Briefing',
      'Financial Literacy',
      'Seafarer Safety Awareness',
      'Shipboard Emergency Procedures',
      'Sexual Harassment Awareness',
      'COVID Protocol Orientation',
    ],
    'Employee Document': [
      'Passport',
      'Pre-Employment Orientation Seminar (PEOS)',
      'ID Card',
      'Contract',
      'Seaman’s Book',
      'Contract of Employment',
      'Crew ID-Card',
      'C1/D Visa',
      'Criminal Record Certificate',
      'Sea Service Record',
    ],
    SOLAS: [
      'International Ship Safety Equipment Certificate',
      'Minimum Safe Manning Certificate',
      'International Ship Construction Certificate',
      'Passenger Ship Safety Certificate',
      'Cargo Ship Safety Certificate',
      'Cargo Ship Safety Construction Certificate',
      'Cargo Ship Safety Equipment Certificate',
      'Cargo Ship Safety Radio Certificate',
      'International Tonnage Certificate',
      'International Load Line Certificate',
      'Safety Management Certificate',
      'Ship Security Certificate',
      'International Oil Pollution Prevention Certificate',
      'International Sewage Pollution Prevention Certificate',
      'International Air Pollution Prevention Certificate',
      'PST (Personal Survival Techniques)',
      'FPFF (Fire Prevention and Fire Fighting)',
      'EFA (Elementary First Aid)',
      'PSSR (Personal Safety and Social Responsibility)',
      'Security Awareness',
      'Advanced Fire Fighting',
      'PSCRB (Rescue Boats)',
      'Enclosed Space Rescue',
      'HUET (Helicopter Escape)',
    ],
    'STCW Certifications': [
      'STCW Basic Safety Training',
      'STCW Proficiency in Survival Craft and Rescue Boats',
      'STCW Proficiency in Fast Rescue Boats',
      'STCW Proficiency in Designated Security Duties',
      'STCW Proficiency in Security Awareness',
      'STCW Proficiency in Crisis Management and Human Behavior',
      'STCW Proficiency in Advanced Fire Fighting',
      'STCW Proficiency in Medical First Aid',
    ],
    "Seaman's Passport": [
      'Able Seaman — Unlimited',
      'Able Seaman — Limited',
      'Able Seaman',
      'STCW Basic Safety (PST, FPFF, EFA, PSSR)',
      'Watchkeeping Certificate',
      'Crowd Management & Crisis Control',
      'Radar Navigation & Collision Avoidance',
      'Ship Security Awareness',
      'Others',
    ],
  };

  const primaryTypes = Object.keys(certificateCategories);

  const uploadCertificateMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${apiUrl}/upload-certificate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true',
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percentage = Math.round((event.loaded * 100) / event.total);
            setProgress({ percentage });
          }
        },
      });
      return response.data;
    },
    onSuccess: () => {
      alert('✅ Certificate uploaded successfully');
      // Reset state
      setCertificateName('');
      setPrimaryCertificateType('');
      setSubCertificateType('');
      setExpirationDate('');
      setFile(null);
      setProgress({ percentage: 0 });
      // Refresh certificates list
      queryClient.invalidateQueries(['certificates']);
    },
    onError: (error) => {
      alert(error.response?.data.message || '❌ Failed to upload certificate');
    },
    // 🔹 ensure the ref lock gets cleared no matter what
    onSettled: () => {
      submittingRef.current = false;
    },
  });

  // 🔹 made async and added submittingRef guard
  const handleSubmitCertificate = async (e) => {
    e.preventDefault();

    // 🔹 synchronous guard: block if already in-flight
    if (submittingRef.current) {
      return;
    }

    if (!certificateName.trim() || !primaryCertificateType || !subCertificateType || !file) {
      alert('All fields are required');
      return;
    }

    if (expirationDate) {
      const today = new Date().setHours(0, 0, 0, 0);
      const expDate = new Date(expirationDate).setHours(0, 0, 0, 0);
      if (expDate < today) {
        setDateError('Expiration date cannot be in the past');
        return;
      }
    }
    setDateError('');

    const formData = new FormData();
    formData.append('certificate_name', certificateName);
    formData.append('certificate_type', `${primaryCertificateType}-${subCertificateType}`);
    if (expirationDate) {
      formData.append('expiration_date', expirationDate);
    }
    formData.append('file', file);

    // 🔹 lock immediately before starting mutation
    submittingRef.current = true;

    try {
      // 🔹 use mutateAsync so we can await and properly reset
      await uploadCertificateMutation.mutateAsync(formData);
    } catch (err) {
      // handled by onError above
    } finally {
      // 🔹 ensure lock is released even if error
      submittingRef.current = false;
    }
  };

  return {
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
    dateError,
    progress,
    certificateCategories,
    primaryTypes,
    handleSubmitCertificate,
    isUploading: uploadCertificateMutation.isLoading,
  };
};

export default useCertificateUpload;
