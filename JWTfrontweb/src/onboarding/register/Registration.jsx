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

    const selectedRegionName = selectedRegion === '130000000'
    ? 'National Capital Region'
    : regions.find(r => r.code === selectedRegion)?.name;
  
  const selectedProvinceName = selectedRegion === '130000000'
    ? 'Metro Manila'
    : provinces.find(p => p.code === selectedProvince)?.name;
  
  const selectedCityName = cities.find(c => c.code === selectedCity)?.name;
  const selectedBarangayName = barangays.find(b => b.code === selectedBarangay)?.name;

    // State for form fields
    const [formData, setFormData] = useState({
      street: '',
      building_number: '',
      zip_code: '',
      gender: '',
      position: '',
      secondary_position: '',
      civil_status: '',
      birthday: '',
    });
  

//token
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Start as loading

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    // If no token, navigate to login immediately
    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // If role is not 'user', navigate to login
      if (parsedUser.role !== 'user') {
        navigate('/login');
        return;
      }

      setUser(parsedUser);
    } else {
      fetchUserData(token);
    }

    // Call handleAuthToken to check for token expiry and handle logout if necessary
    handleAuthToken(token, storedUser ? JSON.parse(storedUser) : null, navigate);

    // Stop loading after check
    setLoading(false);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${apiUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = response.data;

      if (userData.role !== 'user') {
        navigate('/login');  // Redirect if role is not 'user'
        return;
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

    } catch (error) {
      console.error('Failed to fetch user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;  // Or a loader component if needed
  }
  
    // Fetch regions
    useEffect(() => {
      axios.get(`${apiUrl}/regions`)
        .then((response) => setRegions(response.data))
        .catch((error) => console.error('Error fetching regions:', error));
    }, []);
  
    // Fetch provinces based on region
    useEffect(() => {
      if (!selectedRegion) return;
      if (selectedRegion === '130000000') {
        setProvinces([{ code: 'MM', name: 'Metro Manila' }]);
        setSelectedProvince('MM');
      } else {
        axios.get(`${apiUrl}/provinces`)
          .then((response) => {
            const filteredProvinces = response.data.filter((province) => province.regionCode === selectedRegion);
            setProvinces(filteredProvinces);
            setSelectedProvince('');
            setCities([]);
            setBarangays([]);
          })
          .catch((error) => console.error('Error fetching provinces:', error));
      }
    }, [selectedRegion]);
  
    // Fetch cities based on province
    useEffect(() => {
      if (!selectedProvince) return;
      if (selectedProvince === 'MM') {
        fetchCitiesForNCR();
      } else {
        axios.get(`${apiUrl}/cities-municipalities`)
          .then((response) => {
            const filteredCities = response.data.filter((city) => city.provinceCode === selectedProvince);
            setCities(filteredCities);
            setSelectedCity('');
            setBarangays([]);
          })
          .catch((error) => console.error('Error fetching cities:', error));
      }
    }, [selectedProvince]);
  
    const fetchCitiesForNCR = () => {
      axios.get(`${apiUrl}/cities-municipalities`)
        .then((response) => {
          const ncrCities = response.data.filter((city) => city.regionCode === '130000000');
          setCities(ncrCities);
          setSelectedCity('');
          setBarangays([]);
        })
        .catch((error) => console.error('Error fetching NCR cities:', error));
    };
  
    // Fetch barangays based on city
    useEffect(() => {
      if (!selectedCity) return;
      axios.get(`${apiUrl}/barangays`)
        .then((response) => {
          const filteredBarangays = response.data.filter((barangay) =>
            barangay.cityCode === selectedCity || barangay.municipalityCode === selectedCity
          );
          setBarangays(filteredBarangays);
          setSelectedBarangay('');
        })
        .catch((error) => console.error('Error fetching barangays:', error));
    }, [selectedCity]);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
       console.log("Selected Barangay:", e.target.value);
       console.log('Submitting:', {
        ...formData,
        region: selectedRegion,
        province: selectedProvince,
        city: selectedCity,
        barangay: selectedBarangay
      });
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      // Validate required fields
      const requiredFields = ['street', 'building_number', 'zip_code', 'gender', 'civil_status', 'birthday'];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0 || !selectedRegion || !selectedProvince || !selectedCity || !selectedBarangay) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }
  
      // Prepare registration data (only codes, backend will fetch names)
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
        secondary_position: formData.secondary_position,
        civil_status: formData.civil_status,
        birthday: formData.birthday,
      };
  

      //token
      const token = localStorage.getItem('token');
  
      try {
        const response = await axios.post(`${apiUrl}/registration`, registrationData, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.status === 200) {
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
          }
          alert('Registered successfully!');
          navigate('/HomeUser');
        } else {
          setError('Register update failed. Please try again.');
        }
      } catch (err) {
        console.error('Register update failed:', err);
        const errorMessage = err.response?.data?.message || 'Register failed. Please try again.';
        setError(errorMessage);
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  return (


    
    <div className="registration">
      <div className="registration-header">
      <div className="registration-header-padding">
        <p className="registration-header-heading">You're almost there!</p>
        <p className="registration-header-sub">Just one more step</p>
      </div> {/* registration-header-padding */}
      </div> {/* registration-header */}

      <div className="registration-container">
      <div className="registration-container-padding">
         
        <div className="registration-container-header">
          <p className="registration-container-header-sub">Tell us more about yourself</p>
          <p className="registration-container-header-heading">Complete your profile</p>
        </div> {/* registration-container-header */}

        <div className="registration-container-column">
          <form className="registration-container-column-form" onSubmit={handleSubmit}>
            <div className="registration-container-column-form-address">
              <div className="registration-container-column-form-address-header">
                <img src={calendar_week} className="" alt="calendar_week icon" />
                <p className="registration-container-column-form-address-header-text">Home address</p>
              </div> {/* registration-container-column-form-address-header */}
              
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
                        <option value="" selected>Select your region</option>
                        {regions.map((region) => (
                            <option key={region.code} value={region.code}>
                                {region.name}
                            </option>
                        ))}
                    </select>
                </div>

{/* ---------------------------------------Added----------------------------------------- */}
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
{/* -------------------------------------------------------------------------------------------- */}




                <div className="registration-container-column-form-address-content-left-alike">
                    <label htmlFor="barangay">Barangay</label>
                    <select
  id="barangay"
  name="barangay"
  value={selectedBarangay}
  onChange={(e) => {
    setSelectedBarangay(e.target.value);
    setFormData(prev => ({
      ...prev,
      barangay: e.target.value  // Update formData as well
    }));
  }}
  required
  disabled={!selectedCity}
>
  <option value="">Select your barangay</option>
  {barangays.map((barangay) => (
    <option key={barangay.code} value={barangay.code}>  {/* Use code as value */}
      {barangay.name}
    </option>
  ))}
</select>
                </div>



                  <div className="registration-container-column-form-address-content-left-alike">
                    <label htmlFor="">Street</label>
                      <input 
                        type="text" 
                        id="" 
                        name="street"  
                        placeholder="Enter your street" 
                        value={formData.street}
                        onChange={handleChange}
                        required 
                      />  
                  </div> {/* registration-container-column-form-address-content-left-alike */}

                </div> {/* registration-container-column-form-address-content-left */}

                <div className="registration-container-column-form-address-content-right">
                <div className="registration-container-column-form-address-content-left-alike">
                    <label htmlFor="city">City/Municipality</label>
                    <select
                        id="city"
                        name="city"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        required
                        disabled={!selectedProvince}  //Disable if region is not chosen
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
                    <label htmlFor="">Zip code</label>
                      <input 
                        type="text" 
                        id="" 
                        name="zip_code"  
                        placeholder="Enter your zip code" 
                        value={formData.zip_code}
                        onChange={handleChange}
                        required 
                      />  
                  </div> {/* registration-container-column-form-address-content-right-alike */}

                  <div className="registration-container-column-form-address-content-right-alike">
                    <label htmlFor="">Building number</label>
                      <input 
                        type="text" 
                        id="" 
                        name="building_number"  
                        placeholder="Enter your building number" 
                        value={formData.building_number}
                        onChange={handleChange}
                        required 
                      />  
                  </div> {/* registration-container-column-form-address-content-right-alike */}

                </div> {/* registration-container-column-form-address-content-right */}
              </div> {/* registration-container-column-form-address-content */}
            </div> {/* registration-container-column-form-address */}

            <div className="registration-container-column-form-personal">
              <div className="registration-container-column-form-personal-header">
                <img src={user_square} alt="user_square icon" />
                <p className="registration-container-column-form-personal-header-text">Personal details</p>
              </div> {/* registration-container-column-form-personal-header */}
              <div className="registration-container-column-form-personal-content">
                <div className="registration-container-column-form-personal-content-top">
                  <label htmlFor="">Birthday</label>
                    <input 
                      type="date" 
                      id="" 
                      name="birthday"  
                      placeholder="" 
                      value={formData.birthday}
                      onChange={handleChange}
                      required 
                    />  
                </div> {/* registration-container-column-form-personal-content-top */}

                <div className="registration-container-column-form-personal-content-bottom">
                  <div className="registration-container-column-form-personal-content-bottom-left">
                    <div className="registration-container-column-form-personal-content-bottom-left-alike">
                      <label htmlFor="">Primary Position</label>
                        <input 
                          type="text" 
                          id="" 
                          name="position"  
                          placeholder="Enter your position"
                          value={formData.position}
                          onChange={handleChange} 
                          required 
                        /> 
                    </div> {/* registration-container-column-form-personal-content-bottom-left-alike */}

                    <div className="registration-container-column-form-personal-content-bottom-left-alike">
                      <label htmlFor="">Gender</label>
                        <input 
                          type="text" 
                          id="" 
                          name="gender"  
                          placeholder="Enter your gender" 
                          value={formData.gender}
                          onChange={handleChange}
                          required 
                        /> 
                    </div> {/* registration-container-column-form-personal-content-bottom-left-alike */}
                  </div> {/* registration-container-column-form-personal-content-bottom-left */}
                  
                  <div className="registration-container-column-form-personal-content-bottom-right">
                    <div className="registration-container-column-form-personal-content-bottom-right-alike">
                      <label htmlFor="">Secondary Position </label>
                        <input 
                          type="text" 
                          id="" 
                          name="secondary_position"  
                          placeholder="Enter your position" 
                          value={formData.secondary_position}
                          onChange={handleChange}
                        /> 
                    </div> {/* registration-container-column-form-personal-content-bottom-right-alike */}

                    <div className="registration-container-column-form-personal-content-bottom-right-alike">
                      <label htmlFor="">Civil status</label>
                        <input 
                          type="text" 
                          id="" 
                          name="civil_status"
                          value={formData.civil_status}
                          onChange={handleChange}  
                          placeholder="Enter your status" 
                          required 
                        /> 
                                <div className="registration-container-submit">
                                <button
          type="submit"
          id="register-button"
          name="register"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        </div> {/* registration-container-submit */}
                    </div> {/* registration-container-column-form-personal-content-bottom-right-alike */}
                  </div> {/* registration-container-column-form-personal-content-bottom-right */}
                </div> {/* registration-container-column-form-personal-content-bottom */}
              </div> {/* registration-container-column-form-personal-content */}
            </div> {/* registration-container-column-form-personal */}
          </form> {/* registration-container-column-form */}
        </div> {/* registration-container-column */}


      </div> {/* registration-container-padding */}
      </div> {/* registration-container */}
    </div>
  );
};

export default Registration;
