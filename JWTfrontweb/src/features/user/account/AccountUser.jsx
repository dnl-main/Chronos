//Dependencies import
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//Components import
import EditProfilPicture from './modals/editProfilePicture/EditProfilePicture';
import ResetPassword from './modals/resetPassword/ResetPassword';

//CSS imports
import './accountUser.css';
import './accountUserMQ.css';

//Icon imports
import Phone from '../../../assets/icons/Phone.svg';
import Mail from '../../../assets/icons/Mail.svg';
import Suitcase from '../../../assets/icons/Suitcase.svg';
import Edit_Pencil_Line_01 from '../../../assets/icons/Edit_Pencil_Line_01.svg';
import User_Square from '../../../assets/icons/User_Square.svg';
import Calendar_Week from '../../../assets/icons/Calendar_Week.svg';
import defaultdp from '../../../assets/photo/defaultdp.png';
import Edit_Pencil_01 from '../../../assets/icons/Edit_Pencil_01.svg';
import LabelIcon from '../../../assets/icons/Label.svg?react';
import More_Grid_Big from '../../../assets/icons/More_Grid_Big.svg?react';


const AccountUser = () => {

const navigate = useNavigate();
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const storageUrl = import.meta.env.VITE_STORAGE_BASE_URL || 'http://127.0.0.1:8000/storage';

const [showResetPassword, setShowResetPassword] = useState(false);
const [showChangeProfilePicture, setShowChangeProfilePicture] = useState(false);
const [isEditingAddress, setIsEditingAddress] = useState(false);
const [isEditingPersonalDetails, setIsEditingPersonalDetails] = useState(false);
const [user, setUser] = useState(null);
const [error, setError] = useState(null);
const [success, setSuccess] = useState(null);
const [loading, setLoading] = useState(false);

const [personalDetails, setPersonalDetails] = useState({
  position: '',
  department: '',
  gender: '',
  civil_status: '',
  birthday: '',
});

const [originalPersonalDetails, setOriginalPersonalDetails] = useState(null);
const isModified = JSON.stringify(personalDetails) !== JSON.stringify(originalPersonalDetails);

const [addressDetails, setAddressDetails] = useState({
  province: '',
  barangay: '',
  region: '',
  street: '',
  city: '',
  zip_code: '',
  building_number: '',
});

const [originalAddressDetails, setOriginalAddressDetails] = useState(null);
const isAddressModified = JSON.stringify(addressDetails) !== JSON.stringify(originalAddressDetails);

const positionOptions = [
  { value: '', label: 'Select your position' },
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
  { value: 'Jr 4th Mate', label: 'Jr 4th Mate' },
  { value: 'Messman', label: 'Messman' },
  { value: 'Ordinary Seaman', label: 'Ordinary Seaman' },
  { value: 'Pumpman', label: 'Pumpman' },
  { value: '2nd Engineer', label: '2nd Engineer' },
  { value: '2nd Mate', label: '2nd Mate' },
  { value: '3rd Engineer', label: '3rd Engineer' },
  { value: '3rd Mate', label: '3rd Mate' },
  { value: 'Trainee 4th Engineer', label: 'Trainee 4th Engineer' },
  { value: 'Treinee Gas Engineer', label: 'Treinee Gas Engineer' },
  { value: 'Trainee', label: 'Trainee' },
  { value: 'Electrician Trainee', label: 'Electrician Trainee' },
];

const genderOptions = [
  { value: '', label: 'Select gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Others', label: 'Others' },
]

const civilStatusOptions = [
  { value: '', label: 'Select civil status' },
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
  { value: 'Seperated', label: 'Seperated' },
]

// Calculate the max date for 18 years old
  const getMaxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${apiUrl}/user`, {
          headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        });

        const data = response.data;

        const birthday = data.birthday
          ? new Date(data.birthday).toISOString().split('T')[0]
          : '';

        const details = {
          position: data.position || '',
          department: data.department || '',
          gender: data.gender || '',
          civil_status: data.civil_status || '',
          birthday,
        };

        const address = {
          province: data.province || '',
          barangay: data.barangay || '',
          region: data.region || '',
          street: data.street || '',
          city: data.city || '',
          zip_code: data.zip_code || '',
          building_number: data.building_number || '',
        };

        // Fetch profile picture from profile_pictures table
        const profilePictureResponse = await axios.get(`${apiUrl}/user/profile-picture`, {
          headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        });

        setUser({
          ...data,
          profile_picture: profilePictureResponse.data.path || null,
        });
        setPersonalDetails(details);
        setOriginalPersonalDetails(details);
        setAddressDetails(address);
        setOriginalAddressDetails(address);
      } catch (error) {
        alert('Failed to fetch user: ' + error.message);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [apiUrl, navigate]);

  const validateAddress = (address) => {
    const requiredFields = ['province', 'barangay', 'region', 'street', 'city', 'zip_code', 'building_number'];
    const errors = [];
    requiredFields.forEach((field) => {
      if (!address[field]) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
      }
    });
    return errors;
  };

  const validatePersonalDetails = (details) => {
    const requiredFields = ['gender', 'civil_status', 'birthday', 'position'];
    const errors = [];
    requiredFields.forEach((field) => {
      if (!details[field]) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
      }
    });

    // Validate age (must be at least 18 years old)
    if (details.birthday) {
      const birthday = new Date(details.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthday.getFullYear();
      const monthDiff = today.getMonth() - birthday.getMonth();
      const dayDiff = today.getDate() - birthday.getDate();

      // Adjust age if birthday hasn't occurred this year
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age;
      }

      if (age < 18) {
        errors.push('You must be at least 18 years old.');
      }
    }

    return errors;
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.post(`${apiUrl}/logout`, {}, { 
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } 
      });
    } catch (error) {
      alert('Logout failed: ' + error.message);
    } finally {
      setLoading(false);
      sessionStorage.removeItem('token');
      navigate('/login');
    }
  };

  const saveAddress = async (newAddress) => {
    const errors = validateAddress(newAddress);
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const token = sessionStorage.getItem('token');
      const response = await axios.put(`${apiUrl}/user/update-address`, newAddress, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      setUser((prevUser) => ({
        ...prevUser,
        ...response.data.user,
      }));
      setOriginalAddressDetails(newAddress);
      const successMessage = response.data.message || 'Address updated successfully!';
      setSuccess(successMessage);
      alert(successMessage);
    } catch (error) {
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.message;
      alert('Failed to save address: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const savePersonalDetails = async (details) => {
    const errors = validatePersonalDetails(details);
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const token = sessionStorage.getItem('token');
      const response = await axios.put(`${apiUrl}/user/update-personal`, details, {
        headers: { Authorization: `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
      });
      setUser((prevUser) => ({
        ...prevUser,
        ...response.data.user,
      }));
      setOriginalPersonalDetails(details);
      const successMessage = response.data.message;
      setSuccess(successMessage);
      alert(successMessage);
    } catch (error) {
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.message;
      alert('Failed to save personal details: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureSave = (profilePictureUrl) => {
    setUser((prevUser) => ({
      ...prevUser,
      profile_picture: profilePictureUrl,
    }));
    setShowChangeProfilePicture(false);
    window.location.reload();
  };

  let formattedPhone = 'Loading...';
  if (user?.mobile) {
    const rawPhone = user.mobile;
    const cleaned = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
    formattedPhone = cleaned.length >= 10
      ? `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
      : cleaned;
  }

    return (
    <div className="accountUser">
      <div className="accountUser-box">
        <div className="accountUser-box-in">
          <main className="accountUser-box-in-card">
            <header className="accountUser-box-in-card-header">
              <div className="accountUser-box-in-card-header-left">
                <More_Grid_Big
                  style={{
                    color: 'var(--black-color)',
                    width: '32px',
                    height: '32px',
                    '--stroke-width': '1.5px',
                  }}
                />
                <p className="accountUser-box-in-card-header-left-semi">Account</p>
              </div>
              <button
                className="accountUser-box-in-card-header-btn"
                onClick={handleLogout}
                disabled={loading}
              >
                <p>{'Logout'}</p>
              </button>
            </header>
            <main className="accountUser-box-in-card-main">
              <img
                src={user?.profile_picture ? `${storageUrl}/${user.profile_picture}` : defaultdp}
                className="accountUser-box-in-card-main-dp"
                alt="profile"
                onError={(e) => {
                  e.target.src = defaultdp;
                }}
              />
              <section className="accountUser-box-in-card-main-bg" />
              <section className="accountUser-box-in-card-main-info">
                <div className="accountUser-box-in-card-main-info-left">
                  <p className="accountUser-box-in-card-main-info-left-text">
                    {user ? `${user.first_name}${user.middle_name ? ` ${user.middle_name.charAt(0)}.` : ''} ${user.last_name}` : 'Loading...'}
                  </p>
                  <div className="accountUser-box-in-card-main-info-left-contact">
                    <div className="accountUser-box-in-card-main-info-left-contact-email">
                      <img src={Mail} alt="email icon" />
                      <p>{user?.email || 'Loading...'}</p>
                    </div>
                    <div className="accountUser-box-in-card-main-info-left-contact-mobile">
                      <img src={Phone} alt="phone icon" />
                      <p>{formattedPhone ? `(+63)${formattedPhone}` : 'Loading...'}</p>
                    </div>
                  </div>
                </div>
                <div className="accountUser-box-in-card-main-info-right">
                  <div className="accountUser-box-in-card-main-info-right-job">
                    <div className="accountUser-box-in-card-main-info-right-job-header">
                      <img src={Suitcase} alt="Suitcase icon" />
                      <p>Job Title</p>
                    </div>
                    <div className="accountUser-box-in-card-main-info-right-job-title">
                      <LabelIcon className="label-icon" />
                      <p>{user?.position || 'Loading...'}</p>
                    </div>
                    {personalDetails.department && (
                      <div className="accountUser-box-in-card-main-info-right-job-title">
                        <LabelIcon className="label-icon" />
                        <p>Department: {personalDetails.department}</p>
                      </div>
                    )}
                  </div>
                  <div className="accountUser-box-in-card-main-info-right-buttons">
                    <button
                      className="accountUser-box-in-card-main-info-right-buttons-password"
                      onClick={() => setShowResetPassword(true)}
                      disabled={loading}
                    >
                      <img src={Edit_Pencil_Line_01} alt="edit icon" />
                      <p>Change password</p>
                    </button>
                    <button
                      className="accountUser-box-in-card-main-info-right-buttons-profile"
                      onClick={() => setShowChangeProfilePicture(true)}
                      disabled={loading}
                    >
                      <img src={Edit_Pencil_01} alt="edit icon" />
                      <p>Edit profile</p>
                    </button>
                  </div>
                </div>
              </section>
            </main>
          </main>
          <main className="accountUser-box-in-forms">
            <section className="accountUser-box-in-forms-address">
              <div className="accountUser-box-in-forms-address-header">
                <img src={Calendar_Week} alt="calendar icon" />
                <p>Home address</p>
              </div>
              <form className="accountUser-box-in-forms-address-form">
                <div className="accountUser-box-in-forms-address-form-left">
                  <div className="accountUser-box-in-forms-address-form-left-fields">
                    <label>Province</label>
                    <input
                      type="text"
                      name="province"
                      value={addressDetails.province}
                      readOnly={!isEditingAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="accountUser-box-in-forms-address-form-left-fields">
                    <label>Barangay</label>
                    <input
                      type="text"
                      name="barangay"
                      value={addressDetails.barangay}
                      readOnly={!isEditingAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="accountUser-box-in-forms-address-form-left-fields">
                    <label>Region</label>
                    <input
                      type="text"
                      name="region"
                      value={addressDetails.region}
                      readOnly={!isEditingAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="accountUser-box-in-forms-address-form-left-fields">
                    <label>Street</label>
                    <input
                      type="text"
                      name="street"
                      value={addressDetails.street}
                      readOnly={!isEditingAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
                <div className="accountUser-box-in-forms-address-form-right">
                  <div className="accountUser-box-in-forms-address-form-right-fields">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={addressDetails.city}
                      readOnly={!isEditingAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="accountUser-box-in-forms-address-form-right-fields">
                    <label>Zip code</label>
                    <input
                      type="text"
                      name="zip_code"
                      value={addressDetails.zip_code}
                      readOnly={!isEditingAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="accountUser-box-in-forms-address-form-right-fields">
                    <label>Building no.</label>
                    <input
                      type="text"
                      name="building_number"
                      value={addressDetails.building_number}
                      readOnly={!isEditingAddress}
                      onChange={handleAddressChange}
                    />
                  </div>
                </div>
              </form>
              <div className="accountUser-box-in-forms-address-button">
                {!isEditingAddress ? (
                  <button type="button" onClick={() => setIsEditingAddress(true)} disabled={loading}>
                    <img src={Edit_Pencil_Line_01} alt="edit icon" />
                    <p>Edit Address</p>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setAddressDetails(originalAddressDetails);
                        setIsEditingAddress(false);
                        setError(null);
                        setSuccess(null);
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="confirm-btn"
                      disabled={!isAddressModified || loading}
                      onClick={() => {
                        saveAddress(addressDetails);
                        setIsEditingAddress(false);
                      }}
                    >
                      {loading ? 'Saving...' : 'Confirm'}
                    </button>
                  </>
                )}
              </div>
            </section>
            <section className="accountUser-box-in-forms-personal">
              <div className="accountUser-box-in-forms-personal-header">
                <img src={User_Square} className="delete" alt="calendar icon" />
                <p>Personal details</p>
              </div>
              <form className="accountUser-box-in-forms-personal-form">
                <div className="accountUser-box-in-forms-personal-form-top">
                  <div className="accountUser-box-in-forms-personal-form-top-left">
                    <div className="accountUser-box-in-forms-personal-form-top-left-fields">
                      <label>Position:</label>
                      <select
                        name="position"
                        value={personalDetails.position}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditingPersonalDetails}
                      >
                        {positionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="accountUser-box-in-forms-personal-form-top-left-fields">
                      <label>Gender:</label>
                      <select
                        name="gender"
                        value={personalDetails.gender}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditingPersonalDetails}
                      >
                        {genderOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="accountUser-box-in-forms-personal-form-top-right">
                    <div className="accountUser-box-in-forms-personal-form-top-right-fields">
                      <label>Civil Status:</label>
                      <select
                        name="civil_status"
                        value={personalDetails.civil_status}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditingPersonalDetails}
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
                <div className="accountUser-box-in-forms-personal-form-bottom">
                  <label>Birthday:</label>
                  <input
                    type="date"
                    name="birthday"
                    value={personalDetails.birthday}
                    max={getMaxDate()}
                    readOnly={!isEditingPersonalDetails}
                    onChange={handlePersonalDetailsChange}
                  />
                </div>
              </form>
              <div className="accountUser-box-in-forms-personal-button">
                {!isEditingPersonalDetails ? (
                  <button onClick={() => setIsEditingPersonalDetails(true)} disabled={loading}>
                    <img src={Edit_Pencil_Line_01} alt="edit icon" />
                    <p>Edit Details</p>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setPersonalDetails(originalPersonalDetails);
                        setIsEditingPersonalDetails(false);
                        setError(null);
                        setSuccess(null);
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="confirm-btn"
                      disabled={(!isModified || loading) && !error}
                      onClick={() => {
                        savePersonalDetails(personalDetails);
                        setIsEditingPersonalDetails(false);
                      }}
                    >
                      {loading ? 'Saving...' : 'Confirm'}
                    </button>
                  </>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
      {showResetPassword && <ResetPassword closeResetPassword={setShowResetPassword} />}
      {showChangeProfilePicture && (
        <EditProfilPicture
          onClose={setShowChangeProfilePicture}
          onSave={handleProfilePictureSave}
        />
      )}
    </div>
  );
};

export default AccountUser;