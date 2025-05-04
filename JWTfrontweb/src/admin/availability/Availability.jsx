import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './availability.css';
import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';

import AvailabilityCard from './availabilityComponents/AvailabilityCard';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Users from '../../assets/icons/Users.svg?react';


const Availability = () => {
	  const [overlayContent, setOverlayContent] = useState(null);
	  const navigate = useNavigate(); 
	  const [user, setUser] = useState(null);
	  const [loading, setLoading] = useState(true);
	  
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
	  
	  // 🛑 BLOCK RENDER TO
	  if (loading) {
		return null; 
	  }
	   
  return (
    <div className="availability">
      <Navbar />
      <Sidebar />
 
      <div className="availability-box">
        <main className="availability-box-in">
					<header className="availability-box-in-header">
						<Users style={{ width: "32px", height: "32px", color: "#14181f", strokeWidth: 2 }} />
						<p>Crew availability</p> 
					</header> {/* availability-box-in-header */}

					<section className="availability-box-in-tabs">
						<button className="availability-box-in-tabs-all">
							<Circle_Primary style={{ color: "var(--white-color)", width: "20px", height: "20px" }} />
							<p>All</p>
						</button> {/* availability-box-in-tabs-all */}

						<button className="availability-box-in-tabs-available">
							<Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
							<p>Available</p>
						</button> {/* availability-box-in-tabs-available */}

						<button className="availability-box-in-tabs-complete">
							<Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
							<p>Complete</p>
						</button> {/* availability-box-in-tabs-complete */}

						<button className="availability-box-in-tabs-incomplete">
							<Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
							<p>Incomplete</p>
						</button> {/* availability-box-in-tabs-incomplete */}

						<button className="availability-box-in-tabs-new">
							<Circle_Primary style={{ color: "var(--primary-color)", width: "20px", height: "20px" }} />
							<p>New</p>
						</button> {/* availability-box-in-tabs-new */}
					</section> {/* availability-box-in-tabs */}

					<section className="availability-box-in-categories">
						<p>Name and position</p>
						<p>Contact</p>
						<p>Availability</p>
						<p>Certificate</p>
					</section> 
					{/* availability-box-in-categories */}

					<section className="availability-box-in-cards">
						<AvailabilityCard />
						<AvailabilityCard />
						<AvailabilityCard />
					</section> {/* availability-box-in-cards */}
        </main> {/* availability-box-in */}
      </div> {/* availability-box */}
    </div>
  );
};

export default Availability;
