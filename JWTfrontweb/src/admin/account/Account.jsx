import './account.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import Calendar from '../../assets/icons/Calendar.svg';
import Phone from '../../assets/icons/Phone.svg';
import Mail from '../../assets/icons/Mail.svg';
import Suitcase from '../../assets/icons/Suitcase.svg';
import Edit_Pencil_Line_01 from '../../assets/icons/Edit_Pencil_Line_01.svg';
import User_Square from '../../assets/icons/User_Square.svg';
import Calendar_Week from '../../assets/icons/Calendar_Week.svg';

import Edit_Pencil_01 from '../../assets/icons/Edit_Pencil_01.svg?react';



import landing_dp_1 from '../../assets/profiles/landing_dp_1.png';

import LabelIcon from '../../assets/icons/Label.svg?react';
import More_Grid_Big from '../../assets/icons/More_Grid_Big.svg?react';


const Account = () => {
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

      //Phone Handling
      let formattedPhone = 'N/A';

      if (user?.mobile) {
        const rawPhone = user.mobile;
        const cleaned = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
      
        // Format only if length is enough
        if (cleaned.length >= 10) {
          formattedPhone = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        } else {
          formattedPhone = cleaned; 
        }
      }
      
      
    
  return (
    <div className="account">
      
      <Navbar />
      <Sidebar />
      <div className="account-box">
        <div className="account-box-in">
          <main className="account-box-in-card">
            <header className="account-box-in-card-header">
<More_Grid_Big 
              style={{ 
                color: "var(--black-color)", 
                width: "32px", 
                height: "32px", 
                "--stroke-width": "1.5px" 
              }} 
            />
              <p>Account</p> 
            </header> {/* account-box-in-card-header */}

            <main className="account-box-in-card-main">
              <img src={landing_dp_1} className="account-box-in-card-main-dp" alt="calendar icon" />
              {/* absolute element */}

              <section className="account-box-in-card-main-bg">
                {/* just a green bg */}
              </section> {/* account-box-in-card-main-bg */}

              <section className="account-box-in-card-main-info">
                <div className="account-box-in-card-main-info-left">
                  <p className="account-box-in-card-main-info-left-text">{user ? `${user.first_name} ${user.middle_name?.charAt(0)}. ${user.last_name}` : "Loading..."}</p>
                  <div className="account-box-in-card-main-info-left-contact">
                    <div className="account-box-in-card-main-info-left-contact-email">
                      <img src={Mail} className="" alt="email icon" />
                      <p>{user ? `${user.email}`:"Loading..."}</p>
                    </div> {/* account-box-in-card-main-info-left-contact-email */}

                    <div className="account-box-in-card-main-info-left-contact-mobile">
                      <img src={Phone} className="" alt="phone icon" />
                      <p>(+63){formattedPhone}</p>
                    </div> {/* account-box-in-card-main-info-left-contact-mobile */}
                  </div> {/* account-box-in-card-main-info-left-contact */}
                </div> {/* account-box-in-card-main-info-left */}

                <div className="account-box-in-card-main-info-right">
                  <div className="account-box-in-card-main-info-right-job">
                    <div className="account-box-in-card-main-info-right-job-header">
                      
                      <img src={Suitcase} className="" alt="Suitcase icon" />
                      <p>Job title</p>
                    </div> {/* account-box-in-card-main-info-right-job-header */}

                    <div className="account-box-in-card-main-info-right-job-title">
                      {/* <img src={Label} className="" alt="Label icon" /> */}
                      <LabelIcon className="label-icon" />
                      <p>{user.role}</p>      {/* PALITAN TO WITH ACTUAL TITLE */}
                    </div> {/* account-box-in-card-main-info-right-job-title */}
                  </div> {/* account-box-in-card-main-info-right-job */}

                  <div className="account-box-in-card-main-info-right-buttons">
                    <button className="account-box-in-card-main-info-right-buttons-password">
                      <img src={Edit_Pencil_Line_01} className="" alt="calendar icon" />
                      <p>Change password</p>
                    </button>

                    <button className="account-box-in-card-main-info-right-buttons-profile">
                      <Edit_Pencil_01 style={{ color: "var(--white-color)", width: "24px", height: "24px", "--stroke-width": "2px" }} />
                      <p>Edit profile</p>
                    </button>
                  </div> {/* account-box-in-card-main-info-right-buttons */}
                </div> {/* account-box-in-card-main-info-right */}
              </section> {/* account-box-in-card-main-info */}
            </main> {/* account-box-in-card-main */}
          </main> {/* account-box-in-card */}

          <main className="account-box-in-forms">
            <section className="account-box-in-forms-address">
              <div className="account-box-in-forms-address-header">
                <img src={Calendar_Week} className="" alt="calendar icon" />
                <p>Home address</p>
              </div> {/* account-box-in-forms-address-header */}

              <form className="account-box-in-forms-address-form">
                <div className="account-box-in-forms-address-form-left">
                  <div className="account-box-in-forms-address-form-left-fields">
                    <label htmlFor="">Region</label>
                      <input 
                        type="text" 
                        id="" 
                        name=""  
                        placeholder="Enter your region" 
                        required 
                      />  
                  </div> {/* account-box-in-forms-address-form-left-fileds */}

                  <div className="account-box-in-forms-address-form-left-fields">
                    <label htmlFor="">Barangay</label>
                      <input 
                        type="text" 
                        id="" 
                        name=""  
                        placeholder="Enter your barangay" 
                        required 
                      />  
                  </div> {/* account-box-in-forms-address-form-left-fileds */}

                  <div className="account-box-in-forms-address-form-left-fields">
                    <label htmlFor="">Street</label>
                      <input 
                        type="text" 
                        id="" 
                        name=""  
                        placeholder="Enter your street" 
                        required 
                      />  
                  </div> {/* account-box-in-forms-address-form-left-fileds */}
                </div> {/* account-box-in-forms-address-form-left */}

                <div className="account-box-in-forms-address-form-right">
                  <div className="account-box-in-forms-address-form-right-fields">
                    <label htmlFor="">City</label>
                      <input 
                        type="text" 
                        id="" 
                        name=""  
                        placeholder="Enter your city" 
                        required 
                      />  
                  </div> {/* account-box-in-forms-address-form-right-fields */}

                  <div className="account-box-in-forms-address-form-right-fields">
                    <label htmlFor="">Zip code</label>
                      <input 
                        type="text" 
                        id="" 
                        name=""  
                        placeholder="Enter your zip code" 
                        required 
                      />  
                  </div> {/* account-box-in-forms-address-form-right-fields */}

                  <div className="account-box-in-forms-address-form-right-fields">
                    <label htmlFor="">Building no.</label>
                      <input 
                        type="text" 
                        id="" 
                        name=""  
                        placeholder="Enter your building no." 
                        required 
                      />  
                  </div> {/* account-box-in-forms-address-form-right-fields */}
                </div> {/* account-box-in-forms-address-form-right */}
              </form> {/* account-box-in-forms-address-form */}
              <div className="account-box-in-forms-address-button">
                <button>
                  <img src={Edit_Pencil_Line_01} className="" alt="calendar icon" />
                  <p>Edit address</p>
                </button> 
              </div> {/* account-box-in-forms-address-button */}
              
            </section> {/* account-box-in-forms-address */}

            <section className="account-box-in-forms-personal">
              <div className="account-box-in-forms-personal-header">
                <img src={User_Square} className="delete" alt="calendar icon" />
                <p>Personal details</p>
              </div> {/* account-box-in-forms-personal-header */}

              <form className="account-box-in-forms-personal-form">
                <div className="account-box-in-forms-personal-form-top">
                  <div className="account-box-in-forms-personal-form-top-left">
                    <div className="account-box-in-forms-personal-form-top-left-fields">
                      <label htmlFor="">Position</label>
                        <input 
                          type="text" 
                          id="" 
                          name=""  
                          placeholder="Enter your first choice" 
                          required 
                        />  
                    </div> {/* account-box-in-forms-personal-form-top-left-fields */}

                    <div className="account-box-in-forms-personal-form-top-left-fields">
                      <label htmlFor="">Gender</label>
                        <input 
                          type="text" 
                          id="" 
                          name=""  
                          placeholder="Enter your Gender" 
                          required 
                        />  
                    </div> {/* account-box-in-forms-personal-form-top-left-fields */}
                  </div> {/* account-box-in-forms-personal-form-top-left */}

                  <div className="account-box-in-forms-personal-form-top-right">
                    <div className="account-box-in-forms-personal-form-top-right-fields">
                      <label htmlFor="">Position</label>
                        <input 
                          type="text" 
                          id="" 
                          name=""  
                          placeholder="Enter your second choice" 
                          required 
                        />  
                    </div> {/* account-box-in-forms-personal-form-top-right-fields */}

                    <div className="account-box-in-forms-personal-form-top-right-fields">
                      <label htmlFor="">Civil status</label>
                        <input 
                          type="text" 
                          id="" 
                          name=""  
                          placeholder="Enter your Civil status" 
                          required 
                        />  
                    </div> {/* account-box-in-forms-personal-form-top-right-fields */}
                  </div> {/* account-box-in-forms-personal-form-top-right */}
                </div> {/* account-box-in-forms-personal-form-top */}
                <div className="account-box-in-forms-personal-form-bottom">
                  <label htmlFor="">Birthday</label>
                    <input 
                      type="text" 
                      id="" 
                      name=""  
                      placeholder="Enter your building no." 
                      required 
                    />  
                </div> {/* account-box-in-forms-personal-form-bottom */}
              </form> {/* account-box-in-forms-personal-form */}
              <div className="account-box-in-forms-personal-button">
                <button>
                  <img src={Edit_Pencil_Line_01} className="delete" alt="calendar icon" />
                  <p>Edit details</p>
                </button>
              </div> {/* account-box-in-forms-personal-button */}
            </section> {/* account-box-in-forms-personal */}
          </main> {/* account-box-in-forms */}
        </div> {/* account-box-in */}
      </div> {/* account-box */}
    </div>
  );
};

export default Account;
