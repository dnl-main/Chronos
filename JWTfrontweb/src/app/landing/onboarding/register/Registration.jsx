import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupTokenTimeout } from '../../../utils/authTimeout';
import axios from 'axios';
import './registration.css';

// import Calendar_Week from '../../assets/icons/Calendar_Week.svg?react';
// import User_Square from '../../assets/icons/User_Square.svg?react';

import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';


const Registration = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // State for location dropdowns
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('');

  const selectedRegionName =
    selectedRegion === '130000000'
      ? 'National Capital Region'
      : regions.find((r) => r.code === selectedRegion)?.name;

  const selectedProvinceName =
    selectedRegion === '130000000'
      ? 'Metro Manila'
      : provinces.find((p) => p.code === selectedProvince)?.name;

  const selectedCityName = cities.find((c) => c.code === selectedCity)?.name;
  const selectedBarangayName = barangays.find((b) => b.code === selectedBarangay)?.name;

  // State for form fields
  const [formData, setFormData] = useState({
    street: '',
    building_number: '',
    zip_code: '',
    gender: '',
    position: '',
    civil_status: '',
    birthday: '',
  });

  // Civil status options
  const civilStatusOptions = [
    { value: '', label: 'Select your civil status' },
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Separated', label: 'Separated' },
  ];

  // Gender options
  const genderOptions = [
    { value: '', label: 'Select your gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  // Position options
  const positionOptions = [
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

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// Function to get the maximum date for the birthday input
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

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
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'user') {
        setLoading(false);
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      setLoading(false);
    } else {
      fetchUserData(token);
    }
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const userData = response.data;

      if (userData.role !== 'user') {
        navigate('/login');
        return;
      }

      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Fetch regions
  useEffect(() => {
    axios
      .get(`${apiUrl}/regions`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => setRegions(response.data))
      .catch((error) => alert('Error fetching regions:', error));
  }, []);

  // Fetch provinces based on region
  useEffect(() => {
    if (!selectedRegion) return;
    if (selectedRegion === '130000000') {
      setProvinces([{ code: 'MM', name: 'Metro Manila' }]);
      setSelectedProvince('MM');
    } else {
      axios
        .get(`${apiUrl}/provinces`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const filteredProvinces = response.data.filter(
            (province) => province.regionCode === selectedRegion
          );
          setProvinces(filteredProvinces);
          setSelectedProvince(filteredProvinces[0]?.code || '');
          setCities([]);
          setBarangays([]);
        })
        .catch((error) => alert('Error fetching provinces:', error));
    }
  }, [selectedRegion]);

  // Fetch cities based on province
  useEffect(() => {
    if (!selectedProvince) return;
    if (selectedProvince === 'MM') {
      fetchCitiesForNCR();
    } else {
      axios
        .get(`${apiUrl}/cities-municipalities`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        })
        .then((response) => {
          const filteredCities = response.data.filter(
            (city) => city.provinceCode === selectedProvince
          );
          setCities(filteredCities);
          setSelectedCity('');
          setBarangays([]);
        })
        .catch((error) => alert('Error fetching cities:', error));
    }
  }, [selectedProvince]);

  const fetchCitiesForNCR = () => {
    axios
      .get(`${apiUrl}/cities-municipalities`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        const ncrCities = response.data.filter((city) => city.regionCode === '130000000');
        setCities(ncrCities);
        setSelectedCity('');
        setBarangays([]);
      })
      .catch((error) => alert('Error fetching NCR cities:', error));
  };

  // Fetch barangays based on city
  useEffect(() => {
    if (!selectedCity) return;
    axios
      .get(`${apiUrl}/barangays`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        const filteredBarangays = response.data.filter(
          (barangay) =>
            barangay.cityCode === selectedCity || barangay.municipalityCode === selectedCity
        );
        setBarangays(filteredBarangays);
        setSelectedBarangay('');
      })
      .catch((error) => alert('Error fetching barangays:', error));
  }, [selectedCity]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    const requiredFields = ['street', 'building_number', 'zip_code', 'gender', 'civil_status', 'birthday'];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (
      missingFields.length > 0 ||
      !selectedRegion ||
      !selectedProvince ||
      !selectedCity ||
      !selectedBarangay
    ) {
      alert('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Prepare registration data
    const registrationData = {
      region: selectedRegionName,
      province: selectedProvinceName,
      city: selectedCityName,
      barangay: selectedBarangayName,
      street: formData.street,
      building_number: formData.building_number,
      zip_code: formData.zip_code,
      gender: formData.gender,
      position: formData.position,
      civil_status: formData.civil_status,
      birthday: formData.birthday,
      availability: user?.role === 'admin' ? null : 'Available',
    };

    // Token
    const token = sessionStorage.getItem('token');

    try {
      const response = await axios.post(`${apiUrl}/registration`, registrationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (response.status === 200) {
        if (response.data.user) {
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
        alert('Registered successfully!');
        navigate('/user/HomeUser');
      } else {
        alert('Register update failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role === 'admin' || parsedUser.region) {
        setLoading(false);
        navigate('/user/HomeUser');
        return;
      }

      if (parsedUser.role !== 'user') {
        setLoading(false);
        navigate('/login');
        return;
      }

      setUser(parsedUser);
      setLoading(false);
    } else {
      fetchUserData(token);
    }
  }, [navigate]);

  if (loading) {
    return null;
  }

  return (
    // <div className="registration-1">
    <div className="registration-box">
    <div className="registration-box-in">
      <header className="registration-box-in-header">
        <p className="registration-box-in-header-bold">You're almost there!</p>
        <p className="registration-box-in-header-medium">Just one more step</p>
      </header> {/* registration-box-in-header */}

      <div className="registration-box-in-core">
        <header className="registration-box-in-core-header">
          <p className="registration-box-in-core-header-regular">Tell us more about yourself</p>
          <p className="registration-box-in-core-header-medium">Complete your profile</p>
        </header> {/* registration-box-in-core-header */}

        <form className="registration-box-in-core-main" onSubmit={handleSubmit}>
          <main className="registration-box-in-core-main-form">
          {error && <div className="error-message">{error}</div>}
                
            <aside className="registration-box-in-core-main-form-address">
              <div className="registration-box-in-core-main-form-address-header">
                {/* <Calendar_Week
                  style={{
                    width: "24px",
                    height: "24px",
                    '--stroke-width': '2px',
                    '--stroke-color': 'var(--black-color-opacity-60)',
                  }}
                /> */}
                <Circle_Primary style={{ width: '20px', height: '20px' }} />
                <p>Home address</p>
              </div> {/* registration-box-in-core-main-form-address-header */}

              <main className="registration-box-in-core-main-form-address-details">
                <section className="registration-box-in-core-main-form-address-details-left">
                  <article className="registration-box-in-core-main-form-address-details-left-alike">
                    <label htmlFor="region">Region</label>
                    <select
                      id="region" 
                      name="region" 
                      required
                      value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                      <option value=""> Select your region</option>
                      {regions.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </article> {/* registration-box-in-core-main-form-address-details-left-alike */}

                  <article className="registration-box-in-core-main-form-address-details-left-alike">
                    <label htmlFor="city">City/Municipality</label>
                    <select
                      id="city" 
                      name="city" 
                      required
                      value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedProvince}
                    >
                      <option value="">Select your city/municipality</option>
                      {cities.map((city) => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </article> {/* registration-box-in-core-main-form-address-details-left-alike */}

                  <article className="registration-box-in-core-main-form-address-details-left-alike">
                    <label htmlFor="zip_code">Zip code</label>
                    <input
                      type="text" 
                      id="zip_code" 
                      name="zip_code" 
                      placeholder="Enter your zip code"
                      value={formData.zip_code} 
                      onChange={handleChange}
                    />
                  </article> {/* registration-box-in-core-main-form-address-details-left-alike */}
                </section> {/* registration-box-in-core-main-form-address-details-left */}

                <section className="registration-box-in-core-main-form-address-details-right">
                  <article className="registration-box-in-core-main-form-address-details-right-alike">
                    <label htmlFor="province">Province</label>
                    <select
                      id="province" 
                      name="province" 
                      required
                      value={selectedProvince} 
                      onChange={(e) => setSelectedProvince(e.target.value)} 
                      disabled={!selectedRegion}
                    >
                      <option value="">Select your province</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select> 
                  </article> {/* registration-box-in-core-main-form-address-details-right-alike */}

                  <article className="registration-box-in-core-main-form-address-details-right-alike">
                    <label htmlFor="barangay">Barangay</label>
                    <select
                      id="barangay" 
                      name="barangay" 
                      required disabled={!selectedCity}
                      value={selectedBarangay}
                      onChange={(e) => {
                        setSelectedBarangay(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          barangay: e.target.value,
                        }));
                      }}
                    >
                      <option value="">Select your barangay</option>
                      {barangays.map((barangay) => (
                        <option key={barangay.code} value={barangay.code}>
                          {barangay.name}
                        </option>
                      ))}
                    </select>
                  </article> {/* registration-box-in-core-main-form-address-details-right-alike */}

                  <div className="registration-box-in-core-main-form-address-details-right-split">
                    <article className="registration-box-in-core-main-form-address-details-right-split-alike">
                      <label htmlFor="street">Street</label>
                      <input
                        type="text" 
                        id="street" 
                        name="street" 
                        placeholder="Enter your street" 
                        required
                        value={formData.street} 
                        onChange={handleChange}
                      />
                    </article> {/* registration-box-in-core-main-form-address-details-right-split-alike */}
                    
                    <article className="registration-box-in-core-main-form-address-details-right-split-alike">
                      <label htmlFor="building_number">Building number</label>
                      <input
                        type="text" 
                        id="building_number" 
                        name="building_number" 
                        placeholder="Enter your building number"
                        value={formData.building_number} 
                        onChange={handleChange}
                      />
                    </article> {/* registration-box-in-core-main-form-address-details-right-alike */}
                  </div> {/* registration-box-in-core-main-form-address-details-right-split */}


                </section> {/* registration-box-in-core-main-form-address-details-right */}
              </main> {/* registration-box-in-core-main-form-address-details */}
            </aside> {/* registration-box-in-core-main-form-address */}

            <aside className="registration-box-in-core-main-form-personal">
              <header className="registration-box-in-core-main-form-personal-header">
                {/* <User_Square
                  style={{
                    width: "24px",
                    height: "24px",
                    '--stroke-width': '2px',
                    '--stroke-color': 'var(--black-color-opacity-60)',
                  }}
                /> */}
                <Circle_Primary style={{ width: '20px', height: '20px' }} />
                <p> Personal details </p>
              </header> {/* registration-box-in-core-main-form-personal-header */}
                    
                    
              <div className="registration-box-in-core-main-form-personal-content">

                <section className="registration-box-in-core-main-form-personal-content-left">
                  <article className="registration-box-in-core-main-form-personal-content-left-alike">
                    <label htmlFor="birthday">Birthday</label>
                    <input
                      type="date" 
                      id="birthday" 
                      name="birthday" 
                      placeholder="" 
                      required
                      value={formData.birthday} 
                      onChange={handleChange} 
                      max={getMaxDate()}
                    />
                  </article> {/* registration-box-in-core-main-form-personal-content-left-alike */}

                  <article className="registration-box-in-core-main-form-personal-content-left-alike">
                    <label htmlFor="position">Primary Position</label>
                    <select
                      id="position" 
                      name="position" 
                      required
                      value={formData.position} 
                      onChange={handleChange}
                    >
                      {positionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </article> {/* registration-box-in-core-main-form-personal-content-left-alike */}
                </section> {/* registration-box-in-core-main-form-personal-content-left */}

                <section className="registration-box-in-core-main-form-personal-content-right">
                  <article className="registration-box-in-core-main-form-personal-content-right-alike">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender" 
                      name="gender" 
                      required
                      value={formData.gender} 
                       onChange={handleChange}
                    >
                      {genderOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </article>  {/* registration-box-in-core-main-form-personal-content-right-alike */}

                  <article className="registration-box-in-core-main-form-personal-content-right-alike">
                    <label htmlFor="civil_status">Civil status</label>
                    <select
                      id="civil_status" 
                      name="civil_status" 
                      required
                      value={formData.civil_status} 
                      onChange={handleChange}
                    >
                      {civilStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </article> {/* registration-box-in-core-main-form-personal-content-right-alike */}
                </section> {/* registration-box-in-core-main-form-personal-content-right */}
              </div> {/* registration-box-in-core-main-form-personal-content */}
            </aside> {/* registration-box-in-core-main-form-personal */}
          </main> {/* registration-box-in-core-main-form */}
          
          <div className="registration-box-in-core-submit">
            <button
              type="submit" 
              id="register-button" 
              name="register"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form> {/* registration-box-in-core-main */}
      </div> {/* registration-box-in-core */}
    </div> {/* registration-box-in */}
    </div> // registration-box
    // </div> // registration-1
  );
};

export default Registration;