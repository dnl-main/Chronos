import React, { useEffect, useState, useRef } from 'react';
import './HomeSuperAdmin.css';
import user_square from '../../assets/icons/user_square.png';
import calendar_week from '../../assets/icons/calendar_week.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleAuthToken } from '../../utils/timeout';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const HomeSuperAdmin = () => {
  const navigate = useNavigate();
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
    role: 'user',
    position: '',
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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const walk = (x - startX) * 2; // Adjust drag speed
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
    const walk = (x - startX) * 2; // Adjust drag speed
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Authentication and initial data fetching
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    handleAuthToken(token, storedUser ? JSON.parse(storedUser) : null, navigate);

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
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching users');
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
        console.error('Error fetching barangays:', error);
      }
    };
    fetchBarangays();
  }, [selectedCity]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'mobile',
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
      !selectedBarangay
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem('token');
    const submissionData = {
      ...formData,
      region: selectedRegionName,
      province: selectedProvinceName,
      city: selectedCityName,
      barangay: selectedBarangayName,
    };

    try {
      if (editingUserId) {
        const response = await axios.put(
          `${apiUrl}/superadmin/updateusers/${editingUserId}`,
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
      } else {
        const response = await axios.post(`${apiUrl}/superadmin/createusers`, submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setUsers([...users, response.data.user]);
      }
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        mobile: '',
        password: '',
        role: 'user',
        position: '',
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
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving user');
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (user) => {
    setEditingUserId(user.id);
    setFormData({
      first_name: user.first_name || '',
      middle_name: user.middle_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      password: '',
      role: user.role || 'user',
      position: user.position || '',
      department: user.department || '',
      street: user.street || '',
      building_number: user.building_number || '',
      zip_code: user.zip_code || '',
      gender: user.gender || '',
      civil_status: user.civil_status || '',
      birthday: user.birthday || '',
      availability: user.availability || '',
    });

    // Set location dropdowns
    if (user.region) {
      setSelectedRegion(user.region === 'National Capital Region' ? '130000000' : '');
      const regionResponse = await axios.get(`${apiUrl}/regions`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      const region = regionResponse.data.find((r) => r.name === user.region);
      if (region) setSelectedRegion(region.code);
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
  };

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
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting user');
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !users.length) {
    return null;
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
              <form className="registration-container-column-form" onSubmit={handleCreateOrUpdate}>
                {error && <div className="error-message">{error}</div>}

                <div className="registration-container-column-form-address">
                  <div className="registration-container-column-form-address-header">
                    <img src={calendar_week} alt="calendar_week icon" />
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
                        />
                      </div>
                    </div>
                  </div>
                </div>

               <div className="registration-container-column-form-personal">
  <div className="registration-container-column-form-personal-header">
    <img src={user_square} alt="user_square icon" />
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
        />
      </div>
      <div className="registration-container-column-form-personal-content-right-alike">
        <label htmlFor="mobile">Mobile</label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          placeholder="Enter your mobile number"
          value={formData.mobile}
          onChange={handleInputChange}
          required
        />
      </div>

    
    </div>

    <div className="registration-container-column-form-personal-content-right">
  <div className="registration-container-column-form-personal-content-left-alike">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="registration-container-column-form-personal-content-right-alike">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder={editingUserId ? 'New Password (optional)' : 'Enter your password'}
          value={formData.password}
          onChange={handleInputChange}
          required={!editingUserId}
        />
      </div>

      <div className="registration-container-column-form-personal-content-right-alike">
        <label htmlFor="birthday">Birthday</label>
        <input
          type="date"
          id="birthday"
          name="birthday"
          value={formData.birthday}
          onChange={handleInputChange}
          required
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
        >
          {positionOperations.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="registration-container-column-form-personal-content-left-alike">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
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
                  <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : editingUserId ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="registration-container">
          <div className="registration-container-padding">
            <div className="registration-container-header">
              <p className="registration-container-header-sub">User list</p>
              <p className="registration-container-header-heading">Manage existing users</p>
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
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <button
                          onClick={() => handleEdit(user)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={user.role === 'superadmin' || loading}
                          className="delete-button"
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
  );
};

export default HomeSuperAdmin;