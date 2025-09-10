import React, { useCallback, useMemo } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const UserTable = ({
  state,
  dispatch,
  usersQuery,
  tableRef,
  isDragging,
  setIsDragging,
  startX,
  setStartX,
  scrollLeft,
  setScrollLeft,
  handleMouseDown,
  handleMouseLeave,
  handleMouseUp,
  handleMouseMove,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handlePageChange,
}) => {
  const handleEdit = useCallback(
    async (user) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      dispatch({ type: 'SET_EDITING_USER_ID', payload: user.id });
      const isOthers = !positionOperations.some((opt) => opt.value === user.position && opt.value !== '');
      dispatch({ type: 'SET_IS_CUSTOM_POSITION', payload: isOthers });
      dispatch({
        type: 'SET_FORM_DATA',
        payload: {
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
        },
      });
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (id) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = sessionStorage.getItem('token');
      try {
        await axios.delete(`${apiUrl}/superadmin/deleteusers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        usersQuery.refetch();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting user';
        alert(errorMessage);
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [usersQuery, dispatch]
  );

  const filteredUsers = useMemo(() => {
    const users = usersQuery.data?.users || [];
    return users.filter((user) => {
      const matchesRole = state.activeTab === 'all' || user.role === state.activeTab;
      const matchesSearch = state.searchTerm
        ? user.first_name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(state.searchTerm.toLowerCase())
        : true;
      return matchesRole && matchesSearch;
    });
  }, [usersQuery.data?.users, state.activeTab, state.searchTerm]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (state.currentPage - 1) * 15;
    const endIndex = startIndex + 15;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, state.currentPage]);

  const totalPages = useMemo(
    () => Math.ceil((usersQuery.data?.total || filteredUsers.length) / 15),
    [usersQuery.data?.total, filteredUsers.length]
  );

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

  return (
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
                className={`tab-button ${state.activeTab === tab ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })}
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
              value={state.searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
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
              {paginatedUsers.map((user) => (
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
                      disabled={user.role === 'superadmin' || state.loading}
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
        <div className="pagination-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => handlePageChange(state.currentPage - 1)}
            disabled={state.currentPage === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              backgroundColor: state.currentPage === 1 ? '#ccc' : '#00889A',
              color: state.currentPage === 1 ? '#000' : '#fff',
              cursor: state.currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
            aria-label="Previous page"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={state.currentPage === index + 1 ? 'active' : ''}
              style={{
                padding: '8px 12px',
                backgroundColor: state.currentPage === index + 1 ? '#00889A' : '#fff',
                color: state.currentPage === index + 1 ? '#fff' : '#000',
                border: '1px solid #ccc',
                borderRadius: '20px',
                cursor: 'pointer',
              }}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(state.currentPage + 1)}
            disabled={state.currentPage === totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              backgroundColor: state.currentPage === totalPages ? '#ccc' : '#00889A',
              color: state.currentPage === totalPages ? '#000' : '#fff',
              cursor: state.currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};


export default UserTable;