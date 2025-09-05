import React, { useCallback, useMemo } from 'react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';

const UserForm = ({
  state,
  dispatch,
  regionsQuery,
  provincesQuery,
  citiesQuery,
  barangaysQuery,
  handleInputChange,
  userData,
  usersQuery,
  navigate,
}) => {
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

  const getMaxDate = useCallback(() => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  }, []);

  const calculateAge = useCallback((birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, []);

  const selectedRegionName = useMemo(
    () =>
      state.selectedRegion === '130000000'
        ? 'National Capital Region'
        : (regionsQuery.data || []).find((r) => r.code === state.selectedRegion)?.name || '',
    [state.selectedRegion, regionsQuery.data]
  );

  const selectedProvinceName = useMemo(
    () =>
      state.selectedRegion === '130000000'
        ? 'Metro Manila'
        : state.selectedProvince === 'MM'
        ? 'Metro Manila'
        : (provincesQuery.data || []).find((p) => p.code === state.selectedProvince)?.name || '',
    [state.selectedRegion, state.selectedProvince, provincesQuery.data]
  );

  const selectedCityName = useMemo(
    () => (citiesQuery.data || []).find((c) => c.code === state.selectedCity)?.name || '',
    [state.selectedCity, citiesQuery.data]
  );

  const selectedBarangayName = useMemo(
    () => (barangaysQuery.data || []).find((b) => b.code === state.selectedBarangay)?.name || '',
    [state.selectedBarangay, barangaysQuery.data]
  );

  const handleCreateUser = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch({ type: 'SET_LOADING', payload: true });

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
      const missingFields = requiredFields.filter((field) => !state.formData[field]);
      if (
        missingFields.length > 0 ||
        !state.selectedRegion ||
        !state.selectedProvince ||
        !state.selectedCity ||
        !state.selectedBarangay ||
        (state.formData.position === 'Others' && !state.formData.custom_position)
      ) {
        alert('Please fill in all required fields, including custom position if "Others" is selected.');
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      if (state.formData.password !== state.formData.retype_password) {
        alert('Passwords do not match.');
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      if (state.formData.birthday) {
        const age = calculateAge(state.formData.birthday);
        if (age < 18) {
          alert('User must be at least 18 years old.');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
      }

      const token = sessionStorage.getItem('token');
      const submissionData = {
        ...state.formData,
        region: selectedRegionName,
        province: selectedProvinceName,
        city: selectedCityName,
        barangay: selectedBarangayName,
        position: state.formData.position === 'Others' ? state.formData.custom_position : state.formData.position,
      };

      try {
        await axios.post(`${apiUrl}/superadmin/createusers`, submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        usersQuery.refetch();
        dispatch({ type: 'RESET_FORM' });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error creating user';
        alert(errorMessage);
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [
      state.formData,
      state.selectedRegion,
      state.selectedProvince,
      state.selectedCity,
      state.selectedBarangay,
      selectedRegionName,
      selectedProvinceName,
      selectedCityName,
      selectedBarangayName,
      calculateAge,
      usersQuery,
    ]
  );

  const handleUpdateAddress = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch({ type: 'SET_LOADING', payload: true });

      const requiredAddressFields = ['street', 'building_number', 'zip_code'];
      const missingFields = requiredAddressFields.filter((field) => !state.formData[field]);
      if (
        missingFields.length > 0 ||
        !state.selectedRegion ||
        !state.selectedProvince ||
        !state.selectedCity ||
        !state.selectedBarangay
      ) {
        alert('Please fill in all required address fields.');
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const token = sessionStorage.getItem('token');
      const submissionData = {
        region: selectedRegionName,
        province: selectedProvinceName,
        city: selectedCityName,
        barangay: selectedBarangayName,
        street: state.formData.street,
        building_number: state.formData.building_number,
        zip_code: state.formData.zip_code,
      };

      try {
        await axios.put(`${apiUrl}/superadmin/updateusers/address/${state.editingUserId}`, submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        usersQuery.refetch();
        dispatch({ type: 'RESET_FORM' });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error updating address';
        alert(errorMessage);
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [
      state.formData,
      state.selectedRegion,
      state.selectedProvince,
      state.selectedCity,
      state.selectedBarangay,
      state.editingUserId,
      selectedRegionName,
      selectedProvinceName,
      selectedCityName,
      selectedBarangayName,
      usersQuery,
    ]
  );

  const handleUpdatePersonalDetails = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch({ type: 'SET_LOADING', payload: true });

      const requiredPersonalFields = ['first_name', 'last_name', 'email', 'mobile', 'role'];
      const missingFields = requiredPersonalFields.filter((field) => !state.formData[field]);
      if (
        missingFields.length > 0 ||
        (state.formData.position === 'Others' && !state.formData.custom_position)
      ) {
        alert(
          'Please fill in all required personal details fields, including custom position if "Others" is selected.'
        );
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      if (state.formData.password && state.formData.password !== state.formData.retype_password) {
        alert('Passwords do not match.');
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      if (state.formData.birthday) {
        const age = calculateAge(state.formData.birthday);
        if (age < 18) {
          alert('User must be at least 18 years old.');
          dispatch({ type: 'SET_LOADING', payload: false });
          return;
        }
      }

      const token = sessionStorage.getItem('token');
      const submissionData = {
        first_name: state.formData.first_name,
        middle_name: state.formData.middle_name,
        last_name: state.formData.last_name,
        email: state.formData.email,
        mobile: state.formData.mobile,
        password: state.formData.password || undefined,
        role: state.formData.role,
        position: state.formData.position === 'Others' ? state.formData.custom_position : state.formData.position,
        department: state.formData.department,
        gender: state.formData.gender,
        civil_status: state.formData.civil_status,
        birthday: state.formData.birthday,
        availability: state.formData.availability,
      };

      try {
        await axios.put(`${apiUrl}/superadmin/updateusers/personal/${state.editingUserId}`, submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        usersQuery.refetch();
        dispatch({ type: 'RESET_FORM' });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error updating personal details';
        alert(errorMessage);
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [state.formData, state.editingUserId, calculateAge, usersQuery]
  );

  return (
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
                      value={state.selectedRegion}
                      onChange={(e) => dispatch({ type: 'SET_SELECTED_REGION', payload: e.target.value })}
                      required
                      aria-label="Select your region"
                    >
                      <option value="">Select your region</option>
                      {(regionsQuery.data || []).map((region) => (
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
                      value={state.selectedProvince}
                      onChange={(e) => dispatch({ type: 'SET_SELECTED_PROVINCE', payload: e.target.value })}
                      required
                      disabled={state.selectedRegion === '130000000' || !state.selectedRegion}
                      aria-label="Select your province"
                    >
                      <option value="">Select your province</option>
                      {(provincesQuery.data || []).map((province) => (
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
                      value={state.selectedBarangay}
                      onChange={(e) => dispatch({ type: 'SET_SELECTED_BARANGAY', payload: e.target.value })}
                      required
                      disabled={!state.selectedCity}
                      aria-label="Select your barangay"
                    >
                      <option value="">Select your barangay</option>
                      {(barangaysQuery.data || []).map((barangay) => (
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
                      value={state.formData.street}
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
                      value={state.selectedCity}
                      onChange={(e) => dispatch({ type: 'SET_SELECTED_CITY', payload: e.target.value })}
                      required
                      disabled={!state.selectedProvince}
                      aria-label="Select your city or municipality"
                    >
                      <option value="">Select your city/municipality</option>
                      {(citiesQuery.data || []).map((city) => (
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
                      value={state.formData.zip_code}
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
                      value={state.formData.building_number}
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
                <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                <p className="registration-container-column-form-personal-header-text">Personal & Employment Details</p>
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
                      value={state.formData.first_name}
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
                      value={state.formData.middle_name}
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
                      value={state.formData.last_name}
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
                      value={state.formData.mobile}
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
                      value={state.formData.email}
                      onChange={handleInputChange}
                      required
                      aria-label="Enter your email"
                    />
                  </div>
                  <div className="registration-container-column-form-personal-content-right-alike">
                    <label htmlFor="password">Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={state.showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder={state.editingUserId ? 'New Password (optional)' : 'Enter your password'}
                        value={state.formData.password}
                        onChange={handleInputChange}
                        required={!state.editingUserId}
                        style={{ paddingRight: '40px' }}
                        aria-label={state.editingUserId ? 'New password (optional)' : 'Enter your password'}
                      />
                      <div
                        onClick={() => dispatch({ type: 'SET_SHOW_PASSWORD', payload: !state.showPassword })}
                        style={{
                          position: 'absolute',
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          height: '20px',
                          width: '20px',
                          borderRadius: '50%',
                          backgroundColor: state.showPassword ? '#00889A' : '#ccc',
                          zIndex: 1,
                        }}
                        title={state.showPassword ? 'Hide password' : 'Show password'}
                        aria-label={state.showPassword ? 'Hide password' : 'Show password'}
                      />
                    </div>
                  </div>
                  <div className="registration-container-column-form-personal-content-right-alike">
                    <label htmlFor="retype_password">Retype Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={state.showRetypePassword ? 'text' : 'password'}
                        id="retype_password"
                        name="retype_password"
                        placeholder="Retype your password"
                        value={state.formData.retype_password}
                        onChange={handleInputChange}
                        required={!state.editingUserId}
                        style={{ paddingRight: '40px' }}
                        aria-label="Retype your password"
                      />
                      <div
                        onClick={() => dispatch({ type: 'SET_SHOW_RETYPE_PASSWORD', payload: !state.showRetypePassword })}
                        style={{
                          position: 'absolute',
                          right: '15px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          height: '20px',
                          width: '20px',
                          borderRadius: '50%',
                          backgroundColor: state.showRetypePassword ? '#00889A' : '#ccc',
                          zIndex: 1,
                        }}
                        title={state.showRetypePassword ? 'Hide password' : 'Show password'}
                        aria-label={state.showRetypePassword ? 'Hide password' : 'Show password'}
                      />
                    </div>
                  </div>
                  <div className="registration-container-column-form-personal-content-right-alike">
                    <label htmlFor="birthday">Birthday</label>
                    <input
                      type="date"
                      id="birthday"
                      name="birthday"
                      value={state.formData.birthday}
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
                      value={state.formData.role}
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
                      value={state.formData.position}
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
                  {state.isCustomPosition && (
                    <div className="registration-container-column-form-personal-content-left-alike">
                      <label htmlFor="custom_position">Specify Position</label>
                      <input
                        type="text"
                        id="custom_position"
                        name="custom_position"
                        placeholder="Enter custom position"
                        value={state.formData.custom_position}
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
                      value={state.formData.gender}
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
                      value={state.formData.department}
                      onChange={handleInputChange}
                      aria-label="Enter your department"
                    />
                  </div>
                  <div className="registration-container-column-form-personal-content-right-alike">
                    <label htmlFor="civil_status">Civil Status</label>
                    <select
                      id="civil_status"
                      name="civil_status"
                      value={state.formData.civil_status}
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
                      value={state.formData.availability}
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
              {state.editingUserId ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleUpdateAddress}
                    disabled={state.loading}
                    style={{ flex: 1 }}
                    aria-label="Update user address"
                  >
                    {state.loading ? 'Processing...' : 'Update Address'}
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdatePersonalDetails}
                    disabled={state.loading}
                    style={{ flex: 1 }}
                    aria-label="Update personal details"
                  >
                    {state.loading ? 'Processing...' : 'Update Personal Details'}
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  onClick={handleCreateUser}
                  disabled={state.loading}
                  aria-label="Create new user"
                >
                  {state.loading ? 'Processing...' : 'Create User'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;