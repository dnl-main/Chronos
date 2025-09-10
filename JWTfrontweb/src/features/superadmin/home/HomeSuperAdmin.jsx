import React, { useReducer, useEffect, useRef, Suspense, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueries } from '@tanstack/react-query';
import axios from 'axios';
import './HomeSuperAdmin.css';
import { setupTokenTimeout } from '../../../app/utils/authTimeout';
import UserForm from './superAdminComponent/userForm';
import UserTable from './superAdminComponent/UserTable';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Reducer for state management
const initialState = {
  showPassword: false,
  showRetypePassword: false,
  selectedRegion: '',
  selectedProvince: '',
  selectedCity: '',
  selectedBarangay: '',
  formData: {
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
  },
  editingUserId: null,
  isCustomPosition: false,
  activeTab: 'all',
  searchTerm: '',
  loading: false,
  error: null,
  currentPage: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SHOW_PASSWORD':
      return { ...state, showPassword: action.payload };
    case 'SET_SHOW_RETYPE_PASSWORD':
      return { ...state, showRetypePassword: action.payload };
    case 'SET_SELECTED_REGION':
      return { ...state, selectedRegion: action.payload };
    case 'SET_SELECTED_PROVINCE':
      return { ...state, selectedProvince: action.payload };
    case 'SET_SELECTED_CITY':
      return { ...state, selectedCity: action.payload };
    case 'SET_SELECTED_BARANGAY':
      return { ...state, selectedBarangay: action.payload };
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_EDITING_USER_ID':
      return { ...state, editingUserId: action.payload };
    case 'SET_IS_CUSTOM_POSITION':
      return { ...state, isCustomPosition: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload, currentPage: 1 };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_FORM':
      return {
        ...state,
        formData: initialState.formData,
        selectedRegion: '',
        selectedProvince: '',
        selectedCity: '',
        selectedBarangay: '',
        editingUserId: null,
        isCustomPosition: false,
      };
    default:
      return state;
  }
};



const HomeSuperAdmin = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const tableRef = useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  const itemsPerPage = 15;

  // Fetch user data with TanStack Query
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = sessionStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await axios.get(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return response.data;
    },
    enabled: !!sessionStorage.getItem('token'),
    staleTime: 1000 * 60 * 5,
  });

  const [usersQuery, regionsQuery, provincesQuery, citiesQuery, barangaysQuery] = useQueries({
    queries: [
      {
        queryKey: ['users', state.activeTab, state.searchTerm],
        queryFn: async () => {
          const token = sessionStorage.getItem('token');
          const params = {
            role: state.activeTab === 'all' ? undefined : state.activeTab,
            search: state.searchTerm || undefined,
          };
          const response = await axios.get(`${apiUrl}/superadmin/readusers`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
            params,
          });
          return {
            users: response.data.users || [],
            total: response.data.total || 0,
          };
        },
        enabled: !!userData && userData.role === 'superadmin',
        staleTime: 1000 * 60,
      },
      {
        queryKey: ['regions'],
        queryFn: async () => {
          const response = await axios.get(`${apiUrl}/regions`, {
            headers: { 'ngrok-skip-browser-warning': 'true' },
          });
          return response.data || [];
        },
        staleTime: 1000 * 60 * 60,
      },
      {
        queryKey: ['provinces', state.selectedRegion],
        queryFn: async () => {
          if (!state.selectedRegion) return [];
          if (state.selectedRegion === '130000000') return [{ code: 'MM', name: 'Metro Manila' }];
          const response = await axios.get(`${apiUrl}/provinces`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          });
          return response.data.filter((province) => province.regionCode === state.selectedRegion) || [];
        },
        enabled: !!state.selectedRegion,
        staleTime: 1000 * 60 * 60,
      },
      {
        queryKey: ['cities', state.selectedProvince],
        queryFn: async () => {
          if (!state.selectedProvince) return [];
          const response = await axios.get(`${apiUrl}/cities-municipalities`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          });
          return state.selectedProvince === 'MM'
            ? response.data.filter((city) => city.regionCode === '130000000')
            : response.data.filter((city) => city.provinceCode === state.selectedProvince) || [];
        },
        enabled: !!state.selectedProvince,
        staleTime: 1000 * 60 * 60,
      },
      {
        queryKey: ['barangays', state.selectedCity],
        queryFn: async () => {
          if (!state.selectedCity) return [];
          const response = await axios.get(`${apiUrl}/barangays`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          });
          return response.data.filter(
            (barangay) => barangay.cityCode === state.selectedCity || barangay.municipalityCode === state.selectedCity
          ) || [];
        },
        enabled: !!state.selectedCity,
        staleTime: 1000 * 60 * 60,
      },
    ],
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    setupTokenTimeout(token, storedUser ? JSON.parse(storedUser) : null, navigate);

    if (!token) {
      dispatch({ type: 'SET_ERROR', payload: 'No token found' });
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
        dispatch({ type: 'SET_ERROR', payload: 'Error parsing user data' });
        navigate('/login');
        return;
      }
    }

    if (userData && userData.role !== 'superadmin') {
      navigate('/login');
    }

    dispatch({
      type: 'SET_LOADING',
      payload: userLoading || usersQuery.isLoading || regionsQuery.isLoading,
    });

    if (userError || usersQuery.error || regionsQuery.error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    }
  }, [userData, userError, userLoading, usersQuery.isLoading, regionsQuery.isLoading, navigate]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'mobile' && !/^\d*$/.test(value)) {
      return;
    }
    if (name === 'email' && value !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      alert('Please enter a valid email address.');
      return;
    }
    dispatch({ type: 'SET_FORM_DATA', payload: { [name]: value } });
    if (name === 'position') {
      dispatch({ type: 'SET_IS_CUSTOM_POSITION', payload: value === 'Others' });
      if (value !== 'Others') {
        dispatch({ type: 'SET_FORM_DATA', payload: { custom_position: '' } });
      }
    }
  }, []);

  const handleSearchChange = useCallback((e) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
  }, []);

  const handlePageChange = useCallback((page) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, []);

  if (usersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (state.error || usersQuery.error) {
    return <div>Error: {state.error || usersQuery.error.message}</div>;
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
        <Suspense fallback={<div>Loading form...</div>}>
          <UserForm
            state={state}
            dispatch={dispatch}
            regionsQuery={regionsQuery}
            provincesQuery={provincesQuery}
            citiesQuery={citiesQuery}
            barangaysQuery={barangaysQuery}
            handleInputChange={handleInputChange}
            userData={userData}
            usersQuery={usersQuery}
            navigate={navigate}
          />
        </Suspense>
        <Suspense fallback={<div>Loading table...</div>}>
          <UserTable
            state={state}
            dispatch={dispatch}
            usersQuery={usersQuery}
            tableRef={tableRef}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            startX={startX}
            setStartX={setStartX}
            scrollLeft={scrollLeft}
            setScrollLeft={setScrollLeft}
            handleMouseDown={handleMouseDown}
            handleMouseLeave={handleMouseLeave}
            handleMouseUp={handleMouseUp}
            handleMouseMove={handleMouseMove}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
            handlePageChange={handlePageChange}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HomeSuperAdmin;