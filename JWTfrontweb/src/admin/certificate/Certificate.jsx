import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './certificate.css';

import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import CertificateCard from './cards/CertificateCard';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Notebook from '../../assets/icons/Notebook.svg?react';


const Certificate = () => {
  const [overlayContent, setOverlayContent] = useState(null);
  const navigate = useNavigate(); // remove if already declared higher
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
  
    if (!token) {
      navigate('/login');
      return;
    }
  
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
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
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userData = response.data;
  
      if (userData.role !== 'admin') {
        navigate('/login');
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
  
  // 🛑 BLOCK RENDER UNTIL CHECK IS COMPLETE
  if (loading) {
    return null; // or a loader component if you want
  }
   
   
  return (
    <div className="certificate">
      <Navbar />
      <Sidebar />
      <div className="certificate-box">
        <main className="certificate-box-in">
          <header className="certificate-header">
            <Notebook 
              style={{ width: '32px', height: '32px', '--stroke-width': '4px' }} 
            />
            <p>Certificate tracking</p>
          </header>
          
          <section className="certificate-tabs">
            <button className="certificate-tabs-all">
              <Circle_Primary style={{ width: '20px', height: '20px' }} />
              <p>All</p>
            </button>
            <button className="certificate-tabs-complete">
              <Circle_Primary style={{ width: '20px', height: '20px' }} />
              <p>Complete</p>
            </button>
            <button className="certificate-tabs-incomplete">
              <Circle_Primary style={{ width: '20px', height: '20px' }} />
              <p>Incomplete</p>
            </button>
          </section>
          
          <section className="certificate-categories">
            <p>Name and position</p>
            <p>Medical</p>
            <p>Training</p>
            <p>Certificate</p>
            <p>Training 2</p>
          </section>

          <section className="certificate-cards">
            <CertificateCard />
            <CertificateCard />
            <CertificateCard />
          </section>
        </main>
      </div>
      {overlayContent && <div className="overlay-container">{overlayContent}</div>}
    </div>
  );
};

export default Certificate;
