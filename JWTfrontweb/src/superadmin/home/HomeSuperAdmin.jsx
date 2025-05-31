import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function HomeSuperadmin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
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
    region: '',
    province: '',
    city: '',
    barangay: '',
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
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    // Redirect to login if no token
    if (!token) {
      navigate('/login');
      return;
    }

    // Check and parse stored user
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

    // Fetch users
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/superadmin/readusers`, {
          headers: { Authorization: `Bearer ${token}` },
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

    // Fetch regions
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/regions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRegions(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchUsers();
    fetchRegions();
  }, [navigate]);

  // Fetch provinces when region changes
  useEffect(() => {
    if (formData.region) {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(`${apiUrl}/provinces?region=${formData.region}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
          });
          setProvinces(response.data);
          setCities([]);
          setBarangays([]);
          setFormData((prev) => ({ ...prev, province: '', city: '', barangay: '' }));
        } catch (error) {
          console.error('Error fetching provinces:', error);
        }
      };
      fetchProvinces();
    } else {
      setProvinces([]);
      setCities([]);
      setBarangays([]);
      setFormData((prev) => ({ ...prev, province: '', city: '', barangay: '' }));
    }
  }, [formData.region]);

  // Fetch cities when province changes
  useEffect(() => {
    if (formData.province) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`${apiUrl}/cities-municipalities?province=${formData.province}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
          });
          setCities(response.data);
          setBarangays([]);
          setFormData((prev) => ({ ...prev, city: '', barangay: '' }));
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setBarangays([]);
      setFormData((prev) => ({ ...prev, city: '', barangay: '' }));
    }
  }, [formData.province]);

  // Fetch barangays when city changes
  useEffect(() => {
    if (formData.city) {
      const fetchBarangays = async () => {
        try {
          const response = await axios.get(`${apiUrl}/barangays?city=${formData.city}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
          });
          setBarangays(response.data);
          setFormData((prev) => ({ ...prev, barangay: '' }));
        } catch (error) {
          console.error('Error fetching barangays:', error);
        }
      };
      fetchBarangays();
    } else {
      setBarangays([]);
      setFormData((prev) => ({ ...prev, barangay: '' }));
    }
  }, [formData.city]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = sessionStorage.getItem('token');
    try {
      if (editingUserId) {
        const response = await axios.put(`${apiUrl}/superadmin/updateusers/${editingUserId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.map((user) => (user.id === editingUserId ? response.data.user : user)));
        setEditingUserId(null);
      } else {
        const response = await axios.post(`${apiUrl}/superadmin/createusers`, formData, {
          headers: { Authorization: `Bearer ${token}` },
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
        region: '',
        province: '',
        city: '',
        barangay: '',
        street: '',
        building_number: '',
        zip_code: '',
        gender: '',
        civil_status: '',
        birthday: '',
        availability: '',
      });
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving user');
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
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
      region: user.region || '',
      province: user.province || '',
      city: user.city || '',
      barangay: user.barangay || '',
      street: user.street || '',
      building_number: user.building_number || '',
      zip_code: user.zip_code || '',
      gender: user.gender || '',
      civil_status: user.civil_status || '',
      birthday: user.birthday || '',
      availability: user.availability || '',
    });
    setError(null);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    try {
      await axios.delete(`${apiUrl}/superadmin/deleteusers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  return (
    <div
      style={{
        marginTop: '80px',
        maxWidth: '1650px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Superadmin Dashboard</h1>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          Loading...
        </div>
      )}

      <form
        onSubmit={handleCreateOrUpdate}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '30px',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
          <h3>Personal Information</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="First Name"
              required
              style={{ padding: '8px', width: '200px' }}
            />
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleInputChange}
              placeholder="Middle Name"
              style={{ padding: '8px', width: '200px' }}
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
              style={{ padding: '8px', width: '200px' }}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              style={{ padding: '8px', width: '200px' }}
            />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Mobile"
              required
              style={{ padding: '8px', width: '200px' }}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={editingUserId ? 'New Password (optional)' : 'Password'}
              required={!editingUserId}
              style={{ padding: '8px', width: '200px' }}
            />
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              placeholder="Birthday (YYYY-MM-DD)"
              style={{ padding: '8px', width: '200px' }}
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '200px' }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="civil_status"
              value={formData.civil_status}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '200px' }}
            >
              <option value="">Select Civil Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
          <h3>Employment Information</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              style={{ padding: '8px', width: '200px' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Position"
              style={{ padding: '8px', width: '200px' }}
            />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Department"
              style={{ padding: '8px', width: '200px' }}
            />
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '200px' }}
            >
              <option value="">Select Availability</option>
              <option value="Available">Available</option>
              <option value="Vacation">Vacation</option>
              <option value="On Board">On Board</option>
            </select>
          </div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
          <h3>Address Information</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <select
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '200px' }}
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
            <select
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '200px' }}
              disabled={!formData.region}
            >
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '200px' }}
              disabled={!formData.province}
            >
              <option value="">Select City/Municipality</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
            <select
              name="barangay"
              value={formData.barangay}
              onChange={handleInputChange}
              style={{ padding: '8px', width: '200px' }}
              disabled={!formData.city}
            >
              <option value="">Select Barangay</option>
              {barangays.map((barangay) => (
                <option key={barangay.code} value={barangay.code}>
                  {barangay.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Street"
              style={{ padding: '8px', width: '200px' }}
            />
            <input
              type="text"
              name="building_number"
              value={formData.building_number}
              onChange={handleInputChange}
              placeholder="Building Number"
              style={{ padding: '8px', width: '200px' }}
            />
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              placeholder="Zip Code"
              style={{ padding: '8px', width: '200px' }}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            alignSelf: 'center',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {editingUserId ? 'Update User' : 'Create User'}
        </button>
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table
          border="1"
          style={{
            width: '100%',
            maxWidth: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>First Name</th>
              <th style={{ padding: '10px' }}>Middle Name</th>
              <th style={{ padding: '10px' }}>Last Name</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Mobile</th>
              <th style={{ padding: '10px' }}>Role</th>
              <th style={{ padding: '10px' }}>Position</th>
              <th style={{ padding: '10px' }}>Department</th>
              <th style={{ padding: '10px' }}>Region</th>
              <th style={{ padding: '10px' }}>Province</th>
              <th style={{ padding: '10px' }}>City</th>
              <th style={{ padding: '10px' }}>Barangay</th>
              <th style={{ padding: '10px' }}>Street</th>
              <th style={{ padding: '10px' }}>Zip Code</th>
              <th style={{ padding: '10px' }}>Gender</th>
              <th style={{ padding: '10px' }}>Civil Status</th>
              <th style={{ padding: '10px' }}>Birthday</th>
              <th style={{ padding: '10px' }}>Availability</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '10px' }}>{user.id}</td>
                <td style={{ padding: '10px' }}>{user.first_name || '-'}</td>
                <td style={{ padding: '10px' }}>{user.middle_name || '-'}</td>
                <td style={{ padding: '10px' }}>{user.last_name || '-'}</td>
                <td style={{ padding: '10px' }}>{user.email || '-'}</td>
                <td style={{ padding: '10px' }}>{user.mobile || '-'}</td>
                <td style={{ padding: '10px' }}>{user.role || '-'}</td>
                <td style={{ padding: '10px' }}>{user.position || '-'}</td>
                <td style={{ padding: '10px' }}>{user.department || '-'}</td>
                <td style={{ padding: '10px' }}>{user.region || '-'}</td>
                <td style={{ padding: '10px' }}>{user.province || '-'}</td>
                <td style={{ padding: '10px' }}>{user.city || '-'}</td>
                <td style={{ padding: '10px' }}>{user.barangay || '-'}</td>
                <td style={{ padding: '10px' }}>{user.street || '-'}</td>
                <td style={{ padding: '10px' }}>{user.zip_code || '-'}</td>
                <td style={{ padding: '10px' }}>{user.gender || '-'}</td>
                <td style={{ padding: '10px' }}>{user.civil_status || '-'}</td>
                <td style={{ padding: '10px' }}>{user.birthday || '-'}</td>
                <td style={{ padding: '10px' }}>{user.availability || '-'}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      marginRight: '5px',
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={user.role === 'superadmin' || loading}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: user.role === 'superadmin' || loading ? '#6c757d' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: user.role === 'superadmin' || loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomeSuperadmin;