import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { setupTokenTimeout } from '../../../utils/authTimeout';

import './registration.css';

import Circle_Primary  from '../../../../assets/icons/Circle_Primary.svg?react';
import Calendar_Week   from '../../../../assets/icons/Calendar_Week.svg?react';
import User_Square   from '../../../../assets/icons/User_Square.svg?react';

const Registration = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    // Setup token expiration handler
    setupTokenTimeout(navigate);

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

  
  const [location, setLocation] = useState({
    region: '',
    province: '',
    city: '',
    barangay: '',
  });

  // Fetch regions
  const {
    data: regions = [],
    isLoading: isLoadingRegions,
    isError: isRegionsError,
    error: regionsError,
  } = useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/regions`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // optional: cache for 5 mins
  });

  // Fetch provinces based on region
  const {
    data: provinces = [],
    isLoading: isLoadingProvinces,
    isError: isProvincesError,
    error: provincesError,
  } = useQuery({
    queryKey: ['provinces', location.region],
    queryFn: async () => {
      if (location.region === '130000000') {
        // Metro Manila (NCR)
        return [{ code: 'MM', name: 'Metro Manila' }];
      }

      const res = await axios.get(`${apiUrl}/provinces`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });

      return res.data.filter((province) => province.regionCode === location.region);
    },
    enabled: !!location.region, // only run when a region is selected
    staleTime: 1000 * 60 * 5,
  });



  // Fetch cities based on province
  const {
    data: citiesData = [],
    isLoading: isLoadingCities,
    isError: isCitiesError,
    error: citiesError,
  } = useQuery({
    queryKey: ['cities', location.province],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/cities-municipalities`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });

      if (location.province === 'MM') {
        // NCR
        return res.data.filter((city) => city.regionCode === '130000000');
      } else {
        return res.data.filter((city) => city.provinceCode === location.province);
      }
    },
    enabled: !!location.province,
    staleTime: 1000 * 60 * 5,
  });

  const cities = citiesData;



  // Fetch barangays based on city
  const {
    data: barangays = [],
    isLoading: isLoadingBarangays,
    isError: isBarangaysError,
    error: barangaysError,
  } = useQuery({
    queryKey: ['barangays', location.city],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/barangays`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });

      return res.data.filter(
        (barangay) =>
          barangay.cityCode === location.city || barangay.municipalityCode === location.city
      );
    },
    enabled: !!location.city, // Only fetch when city is selected
    staleTime: 1000 * 60 * 5,
  });

  const selectedRegionName = useMemo(() => {
    if (location.region === '130000000') return 'National Capital Region';
    return regions.find((r) => r.code === location.region)?.name || '';
  }, [location.region, regions]);

  const selectedProvinceName = useMemo(() => {
    if (location.region === '130000000') return 'Metro Manila';
    return provinces.find((p) => p.code === location.province)?.name || '';
  }, [location.region, location.province, provinces]);

  const selectedCityName = useMemo(() => {
    return cities.find((c) => c.code === location.city)?.name || '';
  }, [location.city, cities]);

  const selectedBarangayName = useMemo(() => {
    return barangays.find((b) => b.code === location.barangay)?.name || '';
  }, [location.barangay, barangays]);

  
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
  const civilStatusOptions = useMemo(() => [
    { value: '', label: 'Select your civil status' },
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Widowed', label: 'Widowed' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Separated', label: 'Separated' },
  ], []);

  const genderOptions = useMemo(() => [
    { value: '', label: 'Select your gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Non-binary', label: 'Non-binary' },
    { value: 'Transgender', label: 'Transgender' },
    { value: 'Intersex', label: 'Intersex' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
    { value: 'Other', label: 'Other' },
  ], []);

  const positionOptions = useMemo(() => {
    const positions = [
      'Able Seaman', 'Bosun', 'Chief Cook', 'Chief Engineer', 'Chief Mate',
      'Cook', 'Deck Cadet', 'Electrician', 'Engine Cadet', 'Fitter',
      'Galley Boy', 'Jr 3rd Mate', 'Jr 4th Engineer', 'Messman',
      'Ordinary Seaman', 'Pumpman', '2nd Engineer', '2nd Mate',
      '3rd Engineer', '3rd Mate', 'Trainee 4th Engineer',
      'Trainee Gas Engineer', 'Trainee', 'Electrician Trainee'
    ];
    return [{ value: '', label: 'Select your primary position' }, ...positions.map(p => ({ value: p, label: p }))];
  }, []);


  // Function to get the maximum date for the birthday input
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);



  // Validate required fields
    const isFormValid = () => {
      const requiredFields = ['street', 'building_number', 'zip_code', 'gender', 'civil_status', 'birthday'];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      const missingLocation = !location.region || !location.province || !location.city || !location.barangay;

      return missingFields.length === 0 && !missingLocation;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isFormValid()) {
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
                <Calendar_Week
                  style={{
                    width: "24px",
                    height: "24px",
                    '--stroke-width': '2px',
                    '--stroke-color': 'var(--black-color-opacity-60)',
                  }}
                />
                {/* <Circle_Primary style={{ width: '20px', height: '20px' }} /> */}
                <p>Home address</p>
              </div> {/* registration-box-in-core-main-form-address-header */}

              <main className="registration-box-in-core-main-form-address-details">
                <section className="registration-box-in-core-main-form-address-details-top">
                  <article className="registration-box-in-core-main-form-address-details-top-alike">
                    <label htmlFor="region">Region</label>
                    <select
                      id="region" 
                      name="region" 
                      required
                      value={location.region} 
                      onChange={(e) =>
                        setLocation((prev) => ({ ...prev, region: e.target.value }))
                      }
                    >
                      <option value=""> Select your region</option>
                      {regions.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </article> {/* registration-box-in-core-main-form-address-details-top-alike */}

                  <article className="registration-box-in-core-main-form-address-details-top-alike">
                    <label htmlFor="province">Province</label>
                    <select
                      id="province"
                      name="province"
                      required
                      value={location.province}
                      onChange={(e) =>
                        setLocation((prev) => ({ ...prev, province: e.target.value }))
                      }
                      disabled={!location.region}
                    >
                      <option value="">Select your province</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </article> {/* registration-box-in-core-main-form-address-details-top-alike */}
                </section> {/* registration-box-in-core-main-form-address-details-top */}

                <section className="registration-box-in-core-main-form-address-details-mid">
                  <article className="registration-box-in-core-main-form-address-details-mid-alike">
                    <label htmlFor="city">City/Municipality</label>
                    <select
                      id="city"
                      name="city"
                      required
                      value={location.city}
                      onChange={(e) =>
                        setLocation((prev) => ({ ...prev, city: e.target.value }))
                      }
                      disabled={!location.province}
                    >
                      <option value="">Select your city/municipality</option>
                      {cities.map((city) => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                    </select>

                  </article> {/* registration-box-in-core-main-form-address-details-mid-alike */}

                  <article className="registration-box-in-core-main-form-address-details-mid-alike">
                    <label htmlFor="barangay">Barangay</label>
                    <select
                      id="barangay"
                      name="barangay"
                      required
                      disabled={!location.city}
                      value={location.barangay}
                      onChange={(e) => {
                        const value = e.target.value;
                        setLocation((prev) => ({ ...prev, barangay: value }));
                        setFormData((prev) => ({
                          ...prev,
                          barangay: value,
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

                  </article> {/* registration-box-in-core-main-form-address-details-mid-alike */}
                </section> {/* registration-box-in-core-main-form-address-details-mid */}

                <section className="registration-box-in-core-main-form-address-details-bot">
                  <div className="registration-box-in-core-main-form-address-details-bot-left">
                    <article className="registration-box-in-core-main-form-address-details-bot-left-alike">
                      <label htmlFor="zip_code">Zip code</label>
                      <input
                        type="text" 
                        id="zip_code" 
                        name="zip_code" 
                        placeholder="Enter your zip code"
                        value={formData.zip_code} 
                        onChange={handleChange}
                      />
                    </article> {/* registration-box-in-core-main-form-address-details-bot-left-alike */}
                  </div> {/* registration-box-in-core-main-form-address-details-bot-left */}

                  <div className="registration-box-in-core-main-form-address-details-bot-right">
                    <article className="registration-box-in-core-main-form-address-details-bot-right-alike">
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
                    </article> {/* registration-box-in-core-main-form-address-details-bot-right-alike */}
                    
                    <article className="registration-box-in-core-main-form-address-details-bot-right-alike">
                      <label htmlFor="building_number">Building number</label>
                      <input
                        type="text" 
                        id="building_number" 
                        name="building_number" 
                        placeholder="Enter your building number"
                        value={formData.building_number} 
                        onChange={handleChange}
                      />
                    </article> {/* registration-box-in-core-main-form-address--details-bot-right-alike */}
                  </div> {/* registration-box-in-core-main-form-address-details-bot-right */}
                </section> {/* registration-box-in-core-main-form-address-details-bot */}
              </main> {/* registration-box-in-core-main-form-address-details */}
            </aside> {/* registration-box-in-core-main-form-address */}

            <aside className="registration-box-in-core-main-form-personal">
              <header className="registration-box-in-core-main-form-personal-header">
                <User_Square
                  style={{
                    width: "24px",
                    height: "24px",
                    '--stroke-width': '2px',
                    '--stroke-color': 'var(--black-color-opacity-60)',
                  }}
                />
                {/* <Circle_Primary style={{ width: '20px', height: '20px' }} /> */}
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