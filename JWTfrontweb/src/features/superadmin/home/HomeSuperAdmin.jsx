import React, { useEffect, useState, useRef } from 'react';
import './HomeSuperAdmin.css';
// import user_square from '../../assets/icons/user_square.png';
// import calendar_week from '../../assets/icons/calendar_week.png';

import Circle_Primary from '../../../assets/icons/Circle_Primary.svg?react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setupTokenTimeout } from '../../../app/utils/authTimeout';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const HomeSuperAdmin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
    retype_password: '',
    role: 'user',
    position: '',
    custom_position: '',
    department: '',
    street: '',
    building_number: '',
    zip_code: '',
    gender: '',
    civil_status: '',
    birthday: '',
    availability: '',
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCustomPosition, setIsCustomPosition] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // New state for tab filtering
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  // Drag-to-scroll state
  const tableRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Dropdown options
  const genderOptions = [
    { value: '', label: 'Select your gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const civilStatusOptions = [
    { value: '', label: 'Select your civil status' },
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Separated', label: 'Separated' },
  ];

  const positionOperations = [
    { value: '', label: 'Select your primary position' },
    { value: 'Able Seaman', label: 'Able Seaman' },
    { value: 'Bosun', label: 'Bosun' },
    { value: 'Chief Cook', label: 'Chief Cook' },
    { value: 'Chief Engineer', label: 'Chief Engineer' },
    { value: 'Chief Mate', label: 'Chief Mate' },
    { value: 'Cook', label: 'Cook' },
    { value: 'Deck Cadet', label: 'Deck Cadet' },
    { value: 'Electrician', label: 'Electrician' },
    { value: 'Engine Cadet', label: 'Engine Cadet' },
    { value: 'Fitter', label: 'Fitter' },
    { value: 'Galley Boy', label: 'Galley Boy' },
    { value: 'Jr 3rd Mate', label: 'Jr 3rd Mate' },
    { value: 'Jr 4th Engineer', label: 'Jr 4th Engineer' },
    { value: 'Messman', label: 'Messman' },
    { value: 'Ordinary Seaman', label: 'Ordinary Seaman' },
    { value: 'Pumpman', label: 'Pumpman' },
    { value: '2nd Engineer', label: '2nd Engineer' },
    { value: '2nd Mate', label: '2nd Mate' },
    { value: '3rd Engineer', label: '3rd Engineer' },
    { value: '3rd Mate', label: '3rd Mate' },
    { value: 'Trainee 4th Engineer', label: 'Trainee 4th Engineer' },
    { value: 'Trainee Gas Engineer', label: 'Trainee Gas Engineer' },
    { value: 'Trainee', label: 'Trainee' },
    { value: 'Electrician Trainee', label: 'Electrician Trainee' },
    { value: 'Others', label: 'Others' },
  ];

  const availabilityOptions = [
    { value: '', label: 'Select availability' },
    { value: 'Available', label: 'Available' },
    { value: 'Vacation', label: 'Vacation' },
    { value: 'On Board', label: 'On Board' },
  ];

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Superadmin' },
  ];

  // Calculate max date for 18 years ago
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Calculate age from birthday
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Derived names for submission
  const selectedRegionName =
    selectedRegion === '130000000'
      ? 'National Capital Region'
      : regions.find((r) => r.code === selectedRegion)?.name || '';
  const selectedProvinceName =
    selectedRegion === '130000000'
      ? 'Metro Manila'
      : selectedProvince === 'MM'
      ? 'Metro Manila'
      : provinces.find((p) => p.code === selectedProvince)?.name || '';
  const selectedCityName = cities.find((c) => c.code === selectedCity)?.name || '';
  const selectedBarangayName = barangays.find((b) => b.code === selectedBarangay)?.name || '';

  // Filter users based on activeTab and searchTerm
  const filteredUsers = users.filter((user) => {
    const matchesRole = activeTab === 'all' || user.role === activeTab;
    const matchesSearch = searchTerm
      ? user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesRole && matchesSearch;
  });

  // Drag-to-scroll event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }
    if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value !== '') {
        alert('Please enter a valid email address.');
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'position') {
      setIsCustomPosition(value === 'Others');
      if (value !== 'Others') {
        setFormData((prev) => ({ ...prev, custom_position: '' }));
      }
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Authentication and initial data fetching
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    setupTokenTimeout(token, storedUser ? JSON.parse(storedUser) : null, navigate);

    if (!token) {
      setLoading(false);
      navigate('/login');
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'user') {
          navigate('/user/homeuser');
          return;
        }
        if (parsedUser.role === 'admin') {
          navigate('/admin/homeadmin');
          return;
        }
        if (parsedUser.role !== 'superadmin') {
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
        return;
      }
    } else {
      navigate('/login');
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/superadmin/readusers`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        alert(error.response?.data?.message || 'Error fetching users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/regions`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        setRegions(response.data);
      } catch (error) {
        alert('Error fetching regions');
        console.error('Error fetching regions:', error);
      }
    };

    fetchUsers();
    fetchRegions();
  }, [navigate]);

  // Fetch provinces
  useEffect(() => {
    if (!selectedRegion) {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
      setSelectedProvince('');
      setSelectedCity('');
      setSelectedBarangay('');
      return;
    }

    if (selectedRegion === '130000000') {
      setProvinces([{ code: 'MM', name: 'Metro Manila' }]);
      setSelectedProvince('MM');
      setCities([]);
      setBarangays([]);
      setSelectedCity('');
      setSelectedBarangay('');
    } else {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(`${apiUrl}/provinces`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          });
          const filteredProvinces = response.data.filter(
            (province) => province.regionCode === selectedRegion
          );
          setProvinces(filteredProvinces);
          setSelectedProvince('');
          setCities([]);
          setBarangays([]);
          setSelectedCity('');
          setSelectedBarangay('');
        } catch (error) {
          alert('Error fetching provinces');
          console.error('Error fetching provinces:', error);
        }
      };
      fetchProvinces();
    }
  }, [selectedRegion]);

  // Fetch cities
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      setBarangays([]);
      setSelectedCity('');
      setSelectedBarangay('');
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await axios.get(`${apiUrl}/cities-municipalities`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const filteredCities =
          selectedProvince === 'MM'
            ? response.data.filter((city) => city.regionCode === '130000000')
            : response.data.filter((city) => city.provinceCode === selectedProvince);
        setCities(filteredCities);
        setSelectedCity('');
        setBarangays([]);
        setSelectedBarangay('');
      } catch (error) {
        alert('Error fetching cities');
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, [selectedProvince]);

  // Fetch barangays
  useEffect(() => {
    if (!selectedCity) {
      setBarangays([]);
      setSelectedBarangay('');
      return;
    }

    const fetchBarangays = async () => {
      try {
        const response = await axios.get(`${apiUrl}/barangays`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const filteredBarangays = response.data.filter(
          (barangay) =>
            barangay.cityCode === selectedCity || barangay.municipalityCode === selectedCity
        );
        setBarangays(filteredBarangays);
        setSelectedBarangay('');
      } catch (error) {
        alert('Error fetching barangays');
        console.error('Error fetching barangays:', error);
      }
    };
    fetchBarangays();
  }, [selectedCity]);

  // Handle create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'mobile',
      'password',
      'retype_password',
      'street',
      'building_number',
      'zip_code',
      'gender',
      'civil_status',
      'birthday',
      'role',
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (
      missingFields.length > 0 ||
      !selectedRegion ||
      !selectedProvince ||
      !selectedCity ||
      !selectedBarangay ||
      (formData.position === 'Others' && !formData.custom_position)
    ) {
      alert('Please fill in all required fields, including custom position if "Others" is selected.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.retype_password) {
      alert('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.birthday) {
      const age = calculateAge(formData.birthday);
      if (age < 18) {
        alert('User must be at least 18 years old.');
        setLoading(false);
        return;
      }
    }

    const token = sessionStorage.getItem('token');
    const submissionData = {
      ...formData,
      region: selectedRegionName,
      province: selectedProvinceName,
      city: selectedCityName,
      barangay: selectedBarangayName,
      position: formData.position === 'Others' ? formData.custom_position : formData.position,
    };

    try {
      const response = await axios.post(`${apiUrl}/superadmin/createusers`, submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      setUsers([...users, response.data.user]);
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        mobile: '',
        password: '',
        retype_password: '',
        role: 'user',
        position: '',
        custom_position: '',
        department: '',
        street: '',
        building_number: '',
        zip_code: '',
        gender: '',
        civil_status: '',
        birthday: '',
        availability: '',
      });
      setSelectedRegion('');
      setSelectedProvince('');
      setSelectedCity('');
      setSelectedBarangay('');
      setIsCustomPosition(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error creating user';
      alert(errorMessage);
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle update address
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requiredAddressFields = ['street', 'building_number', 'zip_code'];
    const missingFields = requiredAddressFields.filter((field) => !formData[field]);
    if (
      missingFields.length > 0 ||
      !selectedRegion ||
      !selectedProvince ||
      !selectedCity ||
      !selectedBarangay
    ) {
      alert('Please fill in all required address fields.');
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem('token');
    const submissionData = {
      region: selectedRegionName,
      province: selectedProvinceName,
      city: selectedCityName,
      barangay: selectedBarangayName,
      street: formData.street,
      building_number: formData.building_number,
      zip_code: formData.zip_code,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/superadmin/updateusers/address/${editingUserId}`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      setUsers(users.map((user) => (user.id === editingUserId ? response.data.user : user)));
      setEditingUserId(null);
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        mobile: '',
        password: '',
        retype_password: '',
        role: 'user',
        position: '',
        custom_position: '',
        department: '',
        street: '',
        building_number: '',
        zip_code: '',
        gender: '',
        civil_status: '',
        birthday: '',
        availability: '',
      });
      setSelectedRegion('');
      setSelectedProvince('');
      setSelectedCity('');
      setSelectedBarangay('');
      setIsCustomPosition(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating address';
      alert(errorMessage);
      console.error('Error updating address:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle update personal details
  const handleUpdatePersonalDetails = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requiredPersonalFields = ['first_name', 'last_name', 'email', 'mobile', 'role'];
    const missingFields = requiredPersonalFields.filter((field) => !formData[field]);
    if (
      missingFields.length > 0 ||
      (formData.position === 'Others' && !formData.custom_position)
    ) {
      alert(
        'Please fill in all required personal details fields, including custom position if "Others" is selected.'
      );
      setLoading(false);
      return;
    }

    if (formData.password && formData.password !== formData.retype_password) {
      alert('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.birthday) {
      const age = calculateAge(formData.birthday);
      if (age < 18) {
        alert('User must be at least 18 years old.');
        setLoading(false);
        return;
      }
    }

    const token = sessionStorage.getItem('token');
    const submissionData = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password || undefined,
      role: formData.role,
      position: formData.position === 'Others' ? formData.custom_position : formData.position,
      department: formData.department,
      gender: formData.gender,
      civil_status: formData.civil_status,
      birthday: formData.birthday,
      availability: formData.availability,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/superadmin/updateusers/personal/${editingUserId}`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
      setUsers(users.map((user) => (user.id === editingUserId ? response.data.user : user)));
      setEditingUserId(null);
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        mobile: '',
        password: '',
        retype_password: '',
        role: 'user',
        position: '',
        custom_position: '',
        department: '',
        street: '',
        building_number: '',
        zip_code: '',
        gender: '',
        civil_status: '',
        birthday: '',
        availability: '',
      });
      setSelectedRegion('');
      setSelectedProvince('');
      setSelectedCity('');
      setSelectedBarangay('');
      setIsCustomPosition(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating personal details';
      alert(errorMessage);
      console.error('Error updating personal details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit user
  const handleEdit = async (user) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setEditingUserId(user.id);
    const isOthers = !positionOperations.some(
      (opt) => opt.value === user.position && opt.value !== ''
    );
    setIsCustomPosition(isOthers);
    setFormData({
      first_name: user.first_name || '',
      middle_name: user.middle_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      password: '',
      retype_password: '',
      role: user.role || 'user',
      position: isOthers ? 'Others' : user.position || '',
      custom_position: isOthers ? user.position || '' : '',
      department: user.department || '',
      street: user.street || '',
      building_number: user.building_number || '',
      zip_code: user.zip_code || '',
      gender: user.gender || '',
      civil_status: user.civil_status || '',
      birthday: user.birthday || '',
      availability: user.availability || '',
    });

    try {
      if (user.region) {
        const regionResponse = await axios.get(`${apiUrl}/regions`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        const region = regionResponse.data.find((r) => r.name === user.region);
        if (region) setSelectedRegion(region.code);
        else setSelectedRegion(user.region === 'National Capital Region' ? '130000000' : '');
      }

      if (user.province) {
        if (user.region === 'National Capital Region') {
          setSelectedProvince('MM');
        } else {
          const provinceResponse = await axios.get(`${apiUrl}/provinces`, {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          });
          const province = provinceResponse.data.find((p) => p.name === user.province);
          if (province) setSelectedProvince(province.code);
        }
      }

      if (user.city) {
        const cityResponse = await axios.get(`${apiUrl}/cities-municipalities`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        const city = cityResponse.data.find((c) => c.name === user.city);
        if (city) setSelectedCity(city.code);
      }

      if (user.barangay) {
        const barangayResponse = await axios.get(`${apiUrl}/barangays`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        const barangay = barangayResponse.data.find((b) => b.name === user.barangay);
        if (barangay) setSelectedBarangay(barangay.code);
      }
    } catch (error) {
      alert('Error fetching location data for editing');
      console.error('Error fetching location data:', error);
    }
  };

  // Handle delete user
  const handleDelete = async (id) => {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(`${apiUrl}/superadmin/deleteusers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting user';
      alert(errorMessage);
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !users.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="registration-wrapper">
      <div className="registration">
        <div className="registration-header">
          <div className="registration-header-padding">
            <p className="registration-header-heading">Superadmin Dashboard</p>
            <p className="registration-header-sub">Manage users and data</p>
          </div>
        </div>

        <div className="registration-container">
          <div className="registration-container-padding">
            <div className="registration-container-header">
              <p className="registration-container-header-sub">User administration</p>
              <p className="registration-container-header-heading">Create or update user profiles</p>
            </div>

            <div className="registration-container-column">
              <form className="registration-container-column-form">
                <div className="registration-container-column-form-address">
                  <div className="registration-container-column-form-address-header">
                    {/* <img src={calendar_week} alt="Calendar icon" /> */}
                    <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                    <p className="registration-container-column-form-address-header-text">Home address</p>
                  </div>

                  <div className="registration-container-column-form-address-content">
                    <div className="registration-container-column-form-address-content-left">
                      <div className="registration-container-column-form-address-content-left-alike">
                        <label htmlFor="region">Region</label>
                        <select
                          id="region"
                          name="region"
                          value={selectedRegion}
                          onChange={(e) => setSelectedRegion(e.target.value)}
                          required
                          aria-label="Select your region"
                        >
                          <option value="">Select your region</option>
                          {regions.map((region) => (
                            <option key={region.code} value={region.code}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="registration-container-column-form-address-content-left-alike">
                        <label htmlFor="province">Province</label>
                        <select
                          id="province"
                          name="province"
                          value={selectedProvince}
                          onChange={(e) => setSelectedProvince(e.target.value)}
                          required
                          disabled={selectedRegion === '130000000' || !selectedRegion}
                          aria-label="Select your province"
                        >
                          <option value="">Select your province</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="registration-container-column-form-address-content-left-alike">
                        <label htmlFor="barangay">Barangay</label>
                        <select
                          id="barangay"
                          name="barangay"
                          value={selectedBarangay}
                          onChange={(e) => setSelectedBarangay(e.target.value)}
                          required
                          disabled={!selectedCity}
                          aria-label="Select your barangay"
                        >
                          <option value="">Select your barangay</option>
                          {barangays.map((barangay) => (
                            <option key={barangay.code} value={barangay.code}>
                              {barangay.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="registration-container-column-form-address-content-left-alike">
                        <label htmlFor="street">Street</label>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          placeholder="Enter your street"
                          value={formData.street}
                          onChange={handleInputChange}
                          required
                          aria-label="Enter your street"
                        />
                      </div>
                    </div>

                    <div className="registration-container-column-form-address-content-right">
                      <div className="registration-container-column-form-address-content-right-alike">
                        <label htmlFor="city">City/Municipality</label>
                        <select
                          id="city"
                          name="city"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          required
                          disabled={!selectedProvince}
                          aria-label="Select your city or municipality"
                        >
                          <option value="">Select your city/municipality</option>
                          {cities.map((city) => (
                            <option key={city.code} value={city.code}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="registration-container-column-form-address-content-right-alike">
                        <label htmlFor="zip_code">Zip code</label>
                        <input
                          type="text"
                          id="zip_code"
                          name="zip_code"
                          placeholder="Enter your zip code"
                          value={formData.zip_code}
                          onChange={handleInputChange}
                          required
                          aria-label="Enter your zip code"
                        />
                      </div>

                      <div className="registration-container-column-form-address-content-right-alike">
                        <label htmlFor="building_number">Building number</label>
                        <input
                          type="text"
                          id="building_number"
                          name="building_number"
                          placeholder="Enter your building number"
                          value={formData.building_number}
                          onChange={handleInputChange}
                          required
                          aria-label="Enter your building number"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="registration-container-column-form-personal">
                  <div className="registration-container-column-form-personal-header">
                    {/* <img src={user_square} alt="User icon" /> */}
                    <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                    <p className="registration-container-column-form-personal-header-text">
                      Personal & Employment Details
                    </p>
                  </div>

                  <div className="registration-container-column-form-personal-content">
                    <div className="registration-container-column-form-personal-content-left">
                      <div className="registration-container-column-form-personal-content-left-alike">
                        <label htmlFor="first_name">First Name</label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          placeholder="Enter your first name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                          aria-label="Enter your first name"
                        />
                      </div>

                      <div className="registration-container-column-form-personal-content-left-alike">
                        <label htmlFor="middle_name">Middle Name</label>
                        <input
                          type="text"
                          id="middle_name"
                          name="middle_name"
                          placeholder="Enter your middle name"
                          value={formData.middle_name}
                          onChange={handleInputChange}
                          aria-label="Enter your middle name"
                        />
                      </div>

                      <div className="registration-container-column-form-personal-content-left-alike">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          placeholder="Enter your last name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                          aria-label="Enter your last name"
                        />
                      </div>

                      <div className="registration-container-column-form-personal-content-left-alike">
                        <label htmlFor="mobile">Mobile</label>
                        <input
                          type="text"
                          id="mobile"
                          name="mobile"
                          placeholder="Enter your mobile number"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          required
                          aria-label="Enter your mobile number"
                        />
                      </div>
                    </div>

                    <div className="registration-container-column-form-personal-content-right">
                      <div className="registration-container-column-form-personal-content-right-alike">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          aria-label="Enter your email"
                        />
                      </div>

                      <div className="registration-container-column-form-personal-content-right-alike">
                        <label htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder={editingUserId ? 'New Password (optional)' : 'Enter your password'}
                            value={formData.password}
                            onChange={handleInputChange}
                            required={!editingUserId}
                            style={{ paddingRight: '40px' }}
                            aria-label={editingUserId ? 'New password (optional)' : 'Enter your password'}
                          />
                          <div
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: '15px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              cursor: 'pointer',
                              height: '20px',
                              width: '20px',
                              borderRadius: '50%',
                              backgroundColor: showPassword ? '#00889A' : '#ccc',
                              zIndex: 1,
                            }}
                            title={showPassword ? 'Hide password' : 'Show password'}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          />
                        </div>
                      </div>

                      <div className="registration-container-column-form-personal-content-right-alike">
                        <label htmlFor="retype_password">Retype Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showRetypePassword ? 'text' : 'password'}
                            id="retype_password"
                            name="retype_password"
                            placeholder="Retype your password"
                            value={formData.retype_password}
                            onChange={handleInputChange}
                            required={!editingUserId}
                            style={{ paddingRight: '40px' }}
                            aria-label="Retype your password"
                          />
                          <div
                            onClick={() => setShowRetypePassword(!showRetypePassword)}
                            style={{
                              position: 'absolute',
                              right: '15px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              cursor: 'pointer',
                              height: '20px',
                              width: '20px',
                              borderRadius: '50%',
                              backgroundColor: showRetypePassword ? '#00889A' : '#ccc',
                              zIndex: 1,
                            }}
                            title={showRetypePassword ? 'Hide password' : 'Show password'}
                            aria-label={showRetypePassword ? 'Hide password' : 'Show password'}
                          />
                        </div>
                      </div>

                      <div className="registration-container-column-form-personal-content-right-alike">
                        <label htmlFor="birthday">Birthday</label>
                        <input
                          type="date"
                          id="birthday"
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleInputChange}
                          max={getMaxDate()}
                          required
                          aria-label="Select your birthday"
                        />
                      </div>

                      <div className="registration-container-column-form-personal-content-right-alike">
                        <label htmlFor="role">Role</label>
                        <select
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                          aria-label="Select user role"
                        >
                          {roleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="registration-container-column-form-personal-content">
                    <div className="registration-container-column-form-personal-content-left">
                      <div className="registration-container-column-form-personal-content-left-alike">
                        <label htmlFor="position">Primary Position</label>
                        <select
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          aria-label="Select primary position"
                        >
                          {positionOperations.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {isCustomPosition && (
                        <div className="registration-container-column-form-personal-content-left-alike">
                          <label htmlFor="custom_position">Specify Position</label>
                          <input
                            type="text"
                            id="custom_position"
                            name="custom_position"
                            placeholder="Enter custom position"
                            value={formData.custom_position}
                            onChange={handleInputChange}
                            required
                            aria-label="Enter custom position"
                          />
                        </div>
                      )}

                      <div className="registration-container-column-form-personal-content-left-alike">
                        <label htmlFor="gender">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          aria-label="Select your gender"
                        >
                          {genderOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="registration-container-column-form-personal-content-right">
                      <div className="registration-container-column-form-personal-content-right-alike">
                        <label htmlFor="department">Department</label>
                        <input
                          type="text"
                          id="department"
                          name="department"
                          placeholder="Enter your department"
                          value={formData.department}
                          onChange={handleInputChange}
                          aria-label="Enter your department"
                        />
                      </div>

                      <div className="registration-container-column-form-personal-content-right-alike">
                        <label htmlFor="civil_status">Civil Status</label>
                        <select
                          id="civil_status"
                          name="civil_status"
                          value={formData.civil_status}
                          onChange={handleInputChange}
                          required
                          aria-label="Select your civil status"
                        >
                          {civilStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="registration-container-column-form-personal-content-right-alike">
                        <label htmlFor="availability">Availability</label>
                        <select
                          id="availability"
                          name="availability"
                          value={formData.availability}
                          onChange={handleInputChange}
                          aria-label="Select availability"
                        >
                          {availabilityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="registration-container-submit">
                  {editingUserId ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={handleUpdateAddress}
                        disabled={loading}
                        style={{ flex: 1 }}
                        aria-label="Update user address"
                      >
                        {loading ? 'Processing...' : 'Update Address'}
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdatePersonalDetails}
                        disabled={loading}
                        style={{ flex: 1 }}
                        aria-label="Update personal details"
                      >
                        {loading ? 'Processing...' : 'Update Personal Details'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      onClick={handleCreateUser}
                      disabled={loading}
                      aria-label="Create new user"
                    >
                      {loading ? 'Processing...' : 'Create User'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="registration-container">
            <div className="registration-container-padding">
              <div className="registration-container-header">
                <p className="registration-container-header-sub">User list</p>
                <p className="registration-container-header-heading">Manage existing users</p>
              </div>
              <div className="user-filter-section">
                <div className="tabs">
                  {['all', 'user', 'admin', 'superadmin'].map((tab) => (
                    <button
                      key={tab}
                      className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                      aria-label={`Filter by ${tab} role`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                    aria-label="Search users by name or email"
                  />
                </div>
              </div>
              <div
                className="table-section"
                ref={tableRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Actions</th>
                      <th>ID</th>
                      <th>First Name</th>
                      <th>Middle Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Role</th>
                      <th>Position</th>
                      <th>Department</th>
                      <th>Region</th>
                      <th>Province</th>
                      <th>City</th>
                      <th>Barangay</th>
                      <th>Street</th>
                      <th>Zip Code</th>
                      <th>Gender</th>
                      <th>Civil Status</th>
                      <th>Birthday</th>
                      <th>Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <button
                            onClick={() => handleEdit(user)}
                            className="edit-button"
                            aria-label={`Edit user ${user.first_name}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={user.role === 'superadmin' || loading}
                            className="delete-button"
                            aria-label={`Delete user ${user.first_name}`}
                          >
                            Delete
                          </button>
                        </td>
                        <td>{user.id}</td>
                        <td>{user.first_name || '-'}</td>
                        <td>{user.middle_name || '-'}</td>
                        <td>{user.last_name || '-'}</td>
                        <td>{user.email || '-'}</td>
                        <td>{user.mobile || '-'}</td>
                        <td>{user.role || '-'}</td>
                        <td>{user.position || '-'}</td>
                        <td>{user.department || '-'}</td>
                        <td>{user.region || '-'}</td>
                        <td>{user.province || '-'}</td>
                        <td>{user.city || '-'}</td>
                        <td>{user.barangay || '-'}</td>
                        <td>{user.street || '-'}</td>
                        <td>{user.zip_code || '-'}</td>
                        <td>{user.gender || '-'}</td>
                        <td>{user.civil_status || '-'}</td>
                        <td>{user.birthday || '-'}</td>
                        <td>{user.availability || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default HomeSuperAdmin;