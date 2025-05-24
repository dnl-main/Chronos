import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';

import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import ScheduleCard from '../schedule/scheduleComponents/ScheduleCard';

import Calendar_Event from '../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Arrow_Right_SM from '../../assets/icons/Arrow_Right_SM.svg?react';
import Users from '../../assets/icons/Users.svg?react';
import Bell from '../../assets/icons/Bell.svg?react';
import Notebook from '../../assets/icons/Notebook.svg?react';
import Book from '../../assets/icons/Book.svg?react';
import Calendar_Week from '../../assets/icons/Calendar_Week.svg?react';
import User_Add from '../../assets/icons/User_Add.svg?react';
import More_Grid_Big from '../../assets/icons/More_Grid_Big.svg?react';

const Home = () => {
    const [overlayContent, setOverlayContent] = useState(null);
    const navigate = useNavigate(); 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    
    useEffect(() => {
      const token = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');
    
      if (!token) {
        navigate('/login');
        return;
      }
    
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'user') {
          navigate('/user/homeuser');
          return;
        }
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
    
        if (userData.role === 'user') {
          navigate('/user/homeuser');
          return;
        }
        if (userData.role !== 'admin') {
          navigate('/login');
          return;
        }
    
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
//BLOCK TO
    if (loading) {
      return null; 
    }
     
  
  return (
    <div className="home">
    {/* <Navbar /> i uncomment if user navbar is okay na
    <Sidebar /> */}
    <div className="home-box">
      <main className="home-box-in">
        <div className="home-top">
          <header className="home-top-header">
            <More_Grid_Big 
              style={{ 
                color: "var(--black-color)", 
                width: "32px", 
                height: "32px", 
                "--stroke-width": "1.5px" 
              }} 
            />
            <p>Dashboard</p> 
          </header> {/* home-top-header */}

            <main className="home-top-main">
              <section className="home-top-main-left">
                <main className="home-top-main-left-up">
                  <div className="home-top-main-left-up-header">
                    <div className="home-top-main-left-up-header-main">
                      <header>Available crew</header>
                      <Users style={{ color: "var(--black-color)", width: "20px", height: "20px" }} />
                    </div>
                    <button className="home-top-main-left-up-header-btn">
                      <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                    </button>
                  </div>
                  <div className="home-top-main-left-up-data">
                    <div className="home-top-main-left-up-data-all">
                      <p>{crewCount.total}</p>
                    </div>
                    <div className="home-top-main-left-up-data-complete">
                      <p>21 Complete</p>
                    </div>
                  </div>
                  <div className="home-top-main-left-up-job">
                    <header className="home-top-main-left-up-job-header">
                      <p>Job title</p>
                    </header>
                    <main className="home-top-main-left-up-job-main">
                      <div className="home-top-main-left-up-job-main-card">
                        <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                        <p>Chief engineer</p>
                        <p>(10)</p>
                      </div>
                      <div className="home-top-main-left-up-job-main-card">
                        <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                        <p>Trainee 4th engineer</p>
                        <p>(8)</p>
                      </div>
                      <div className="home-top-main-left-up-job-main-card">
                        <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                        <p>Trainee 4th engineer</p>
                        <p>(8)</p>
                      </div>
                      <div className="home-top-main-left-up-job-main-card">
                        <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                        <p>Chief engineer</p>
                        <p>(10)</p>
                      </div>
                      <div className="home-top-main-left-up-job-main-card">
                        <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                        <p>Chief engineer</p>
                        <p>(10)</p>
                      </div>
                      <div className="home-top-main-left-up-job-main-card">
                        <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "20px", height: "20px" }} />
                        <p>More</p>
                      </div>
                    </main>
                  </div>
                </main>
                <main className="home-top-main-left-down">
                  <div className="home-top-main-left-down-header">
                    <div className="home-top-main-left-down-header-main">
                      <header>Weekly new applicants</header>
                      <User_Add style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '7px' }} />
                    </div>
                    <button className="home-top-main-left-down-header-btn">
                      <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                    </button>
                  </div>
                  <div className="home-top-main-left-down-data">
                    <div className="home-top-main-left-down-data-all">
                      <p>54</p>
                    </div>
                    <div className="home-top-main-left-down-data-complete">
                      <p>+10 Today</p>
                    </div>
                  </div>
                </main>
              </section>

              <section className="home-top-main-mid">
                <main className="home-top-main-mid-up">
                  <div className="home-top-main-mid-up-header">
                    <div className="home-top-main-mid-up-header-main">
                      <header>Coming today</header>
                      <Calendar_Event style={{ color: "var(--black-color)", width: "20px", height: "20px", '--stroke-width': '6px' }} />
                    </div>
                    <button>
                      <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                    </button>
                  </div>
                  <div className="home-top-main-mid-up-data">
                    <p>{todayCount}</p>
                  </div>
                  <div className="home-top-main-mid-up-time">
                    <p className="home-top-main-mid-up-time-sub">Arrival time</p>
                    <p className="home-top-main-mid-up-time-main">
                      {todayAppointments.length > 0
                        ? new Date(`1970-01-01T${todayAppointments[0].start_time}`).toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </main>
                <main className="home-top-main-mid-down">
                  <div className="home-top-main-mid-down-header">
                    <div className="home-top-main-mid-down-header-main">
                      <header>Upcoming appointment</header>
                      <Book
                        style={{
                          color: "var(--black-color)",
                          width: "20px",
                          height: "20px",
                          '--stroke-width': '4',
                        }}
                      />
                    </div>
                    <button className="home-top-main-left-down-header-btn">
                      <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                    </button>
                  </div>
                  <div className="home-top-main-mid-down-data">
                    <p>{upcomingCount}</p>
                  </div>
                  <div className="home-top-main-mid-down-time">
                    <p className="home-top-main-mid-down-time-sub">Arrival date</p>
                    <p className="home-top-main-mid-down-time-main">
                      {todayAppointments.length > 0
                        ? new Date(todayAppointments[0].date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </main>
              </section>

              <section className="home-top-main-right">
                <div className="home-top-main-right-header">
                  <div className="home-top-main-right-header-main">
                    <header>Expiring certificates</header>
                    <Notebook style={{ color: "var(--black-color)", width: "20px", height: "20px" }} />
                  </div>
                  <button className="home-top-main-right-header-btn">
                    <Arrow_Right_SM style={{ color: "var(--black-color)", width: "24px", height: "24px", '--stroke-width': '5' }} />
                  </button>
                </div>
                <div className="home-top-main-right-cards">
                  <main className="home-top-main-right-cards-card">
                    <div className="home-top-main-right-cards-card-up">
                      <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "28px", height: "28px" }} />
                      <div className="home-top-main-right-cards-card-up-text">
                        <p className="home-top-main-right-cards-card-up-text-name">John R. Smith</p>
                        <p className="home-top-main-right-cards-card-up-text-cert">Java National Certificate</p>
                      </div>
                    </div>
                    <div className="home-top-main-right-cards-card-down">
                      <button className="home-top-main-right-cards-card-down-btn">
                        <p>Notify</p>
                        <Bell style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '5' }} />
                      </button>
                      <div className="home-top-main-right-cards-card-down-text">
                        <p className="home-top-main-right-cards-card-down-text-expiry">Expires at:</p>
                        <p className="home-top-main-right-cards-card-down-text-date">OCT-31-2025</p>
                      </div>
                    </div>
                  </main>
                  <main className="home-top-main-right-cards-card">
                    <div className="home-top-main-right-cards-card-up">
                      <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "28px", height: "28px" }} />
                      <div className="home-top-main-right-cards-card-up-text">
                        <p className="home-top-main-right-cards-card-up-text-name">John R. Smith</p>
                        <p className="home-top-main-right-cards-card-up-text-cert">Java National Certificate</p>
                      </div>
                    </div>
                    <div className="home-top-main-right-cards-card-down">
                      <button className="home-top-main-right-cards-card-down-btn">
                        <p>Notify</p>
                        <Bell style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '5' }} />
                      </button>
                      <div className="home-top-main-right-cards-card-down-text">
                        <p className="home-top-main-right-cards-card-down-text-expiry">Expires at:</p>
                        <p className="home-top-main-right-cards-card-down-text-date">OCT-31-2025</p>
                      </div>
                    </div>
                  </main>
                  <main className="home-top-main-right-cards-card">
                    <div className="home-top-main-right-cards-card-up">
                      <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "28px", height: "28px" }} />
                      <div className="home-top-main-right-cards-card-up-text">
                        <p className="home-top-main-right-cards-card-up-text-name">John R. Smith</p>
                        <p className="home-top-main-right-cards-card-up-text-cert">Java National Certificate</p>
                      </div>
                    </div>
                    <div className="home-top-main-right-cards-card-down">
                      <button className="home-top-main-right-cards-card-down-btn">
                        <p>Notify</p>
                        <Bell style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '5' }} />
                      </button>
                      <div className="home-top-main-right-cards-card-down-text">
                        <p className="home-top-main-right-cards-card-down-text-expiry">Expires at:</p>
                        <p className="home-top-main-right-cards-card-down-text-date">OCT-31-2025</p>
                      </div>
                    </div>
                  </main>
                </div>
              </section>
            </main>
          </div>

          <div className="home-bot">
            <header className="home-bot-header">
              <Calendar_Week
                style={{
                  width: "24px",
                  height: "24px",
                  '--stroke-width': '2px',
                  '--stroke-color': 'var(--black-color)',
                }}
              />
              <p>Coming today</p>
            </header>
            <div className="home-bot-cards">
              {todayAppointments.length > 0 ? (
                todayAppointments.slice(0, 3).map((app) => (
                  <ScheduleCard
                    key={app.id}
                    appointment={app}
                    user={app.user}
                    allAppointments={todayAppointments}
                  />
                ))
              ) : (
                <p>No appointments today.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;