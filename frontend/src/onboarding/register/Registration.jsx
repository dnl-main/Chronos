import React, { useState, useEffect } from 'react';
import './registration.css';
import user_square from '../../assets/icons/user_square.png';
import calendar_week from '../../assets/icons/calendar_week.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleAuthToken } from '../../utils/timeout';

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

// Position options (title case and alphabetically sorted)
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
    handleAuthToken(token, storedUser ? JSON.parse(storedUser) : null, navigate);

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
    <div className="registration-wrapper">
      <div className="registration">
        <div className="registration-header">
          <div className="registration-header-padding">
            <p className="registration-header-heading">You're almost there!</p>
            <p className="registration-header-sub">Just one more step</p>
          </div>
        </div>

        <div className="registration-container">
          <div className="registration-container-padding">
            <div className="registration-container-header">
              <p className="registration-container-header-sub">Tell us more about yourself</p>
              <p className="registration-container-header-heading">Complete your profile</p>
            </div>

            <div className="registration-container-column">
              <form className="registration-container-column-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="registration-container-column-form-address">
                  <div className="registration-container-column-form-address-header">
                    <img src={calendar_week} className="" alt="calendar_week icon" />
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
                          <option value="" selected>
                            Select your region
                          </option>
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
                          disabled={!selectedRegion}
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
                          onChange={(e) => {
                            setSelectedBarangay(e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              barangay: e.target.value,
                            }));
                          }}
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
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="registration-container-column-form-address-content-right">
                      <div className="registration-container-column-form-address-content-left-alike">
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
                          onChange={handleChange}
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
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="registration-container-column-form-personal">
                  <div className="registration-container-column-form-personal-header">
                    <img src={user_square} alt="user_square icon" />
                    <p className="registration-container-column-form-personal-header-text">
                      Personal details
                    </p>
                  </div>
                  <div className="registration-container-column-form-personal-content">
                    <div className="registration-container-column-form-personal-content-top">
                      <label htmlFor="birthday">Birthday</label>
                      <input
                        type="date"
                        id="birthday"
                        name="birthday"
                        placeholder=""
                        value={formData.birthday}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="registration-container-column-form-personal-content-bottom">
                      <div className="registration-container-column-form-personal-content-bottom-left">
                        <div className="registration-container-column-form-personal-content-bottom-left-alike">
                          <label htmlFor="position">Primary Position</label>
                          <select
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                          >
                            {positionOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="registration-container-column-form-personal-content-bottom-left-alike">
                          <label htmlFor="gender">Gender</label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
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

                      <div className="registration-container-column-form-personal-content-bottom-right">
                        <div className="registration-container-column-form-personal-content-bottom-right-alike">
                          <label htmlFor="civil_status">Civil status</label>
                          <select
                            id="civil_status"
                            name="civil_status"
                            value={formData.civil_status}
                            onChange={handleChange}
                            required
                          >
                            {civilStatusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="registration-container-submit">
                  <button
                    type="submit"
                    id="register-button"
                    name="register"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;