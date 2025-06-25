import React from 'react';
import './landing.css';

import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routes'; 

import concorde from '../../assets/logo/concorde.png';
import landingBg from '../../assets/background/landingBg.png';
import landingLaptop from '../../assets/overlay/landingLaptop.png';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Star from '../../assets/icons/Star.svg?react';
import DP_1 from '../../assets/profile/DP_1.jpg';
import DP_2 from '../../assets/profile/DP_2.jpg';
import DP_3 from '../../assets/profile/DP_3.jpg';

const Landing = () => {

  return (
    
    <div className="landing">
    <div className="landing-box">
      <div className="landing-box-left">
        <div className="landing-box-left-logo">
          <p>Concorde</p>
          {/* !!NEED GAWIN SVG/ REBRAND */}
          {/* <img src={concorde} className="" alt="brand logo" /> */}
          {/* <Circle_Primary style={{ width: '20px', height: '20px' }} /> */}
        </div> {/* landing-box-left-logo */}

        <div className="landing-box-left-main">
          <div className="landing-box-left-main-header">
            <p className="landing-box-left-main-header-medium">Effortlessly</p>

            <div className="landing-box-left-main-header-second">
              <p className="landing-box-left-main-header-second-medium"> Manage your</p>
              <p className="landing-box-left-main-header-second-bold">Crew</p>
            </div> {/* landing-box-left-main-header -second*/}
          </div> {/* landing-box-left-main-header */}

          <div className="landing-box-left-main-sub">
            <p className="landing-box-left-main-sub-regular">Take control of your scheduling and</p>
            <div className="landing-box-left-main-sub-second">
              <p className="landing-box-left-main-sub-second-regular">certificate tracking with</p>
              <p className="landing-box-left-main-sub-second-bold">Concorde</p>
            </div> {/* landing-box-left-main-sub-second */}
          </div> {/* landing-box-left-main-sub */}

          <div className="landing-box-left-main-buttons">
            <Link to="/signup" className="landing-box-left-main-buttons-signUp">
              Sign up for free
            </Link>
            <Link to="/login" className="landing-box-left-main-buttons-logIn">
              Log in
            </Link>
          </div> {/* landing-box-left-main-buttons */}
        </div> {/* landing-box-left-main */}

        <div className="landing-box-left-reviews">
          <div className="landing-box-left-reviews-rating">
            <div className="landing-box-left-reviews-rating-img">
              <div className="landing-box-left-reviews-rating-img-crop">
                <img src={DP_1} className="" alt="profile pic" />
              </div> {/* landing-box-left-reviews-rating-img-crop */}

              <div className="landing-box-left-reviews-rating-img-crop">
                <img src={DP_2} className="" alt="profile pic" />
              </div> {/* landing-box-left-reviews-rating-img-crop */}

              <div className="landing-box-left-reviews-rating-img-crop">
                <img src={DP_3} className="" alt="profile pic" />
              </div> {/* landing-box-left-reviews-rating-img-crop */}
            </div> {/* landing-box-left-reviews-rating-img */}

            <div className="landing-box-left-reviews-rating-value">
              <div className="landing-box-left-reviews-rating-value-top">
                <p className="landing-box-left-reviews-rating-value-top-medium">4.5</p>
                <div className="landing-box-left-reviews-rating-value-top-stars">
                  <Star style={{ width: '2.8vh', height: '2.8vh', '--fill-color': '#FFCB45', }} />
                  <Star style={{ width: '2.8vh', height: '2.8vh', '--fill-color': '#FFCB45', }} />
                  <Star style={{ width: '2.8vh', height: '2.8vh', '--fill-color': '#FFCB45', }} />
                  <Star style={{ width: '2.8vh', height: '2.8vh', '--fill-color': '#FFCB45', }} />
                  <Star style={{ width: '2.8vh', height: '2.8vh', '--fill-color': '#FFCB45', }} />
                </div>
              </div> {/* landing-box-left-reviews-rating-value-top */}
              <p className="landing-box-left-reviews-rating-value-regular">(3.5K Ratings)</p>
            </div> {/* landing-box-left-reviews-rating-value */}
          </div> {/* landing-box-left-reviews-rating */}

          <div className="landing-box-left-reviews-result">
            <div className="landing-box-left-reviews-result-content">
              <div className="landing-box-left-reviews-result-content-separator"></div>
              <div className="landing-box-left-reviews-result-content-text">
                <p className="landing-box-left-reviews-result-text-semibold">+30%</p>
                <p className="landing-box-left-reviews-result-text-regular">Operational efficiency</p>
              </div> {/* landing-box-left-reviews-result-content-text */}
            </div> {/* landing-box-left-reviews-result-content */}

            <div className="landing-box-left-reviews-result-content">
              <div className="landing-box-left-reviews-result-content-separator"></div>
              <div className="landing-box-left-reviews-result-content-text">
                <p className="landing-box-left-reviews-result-text-semibold">-40%</p>
                <p className="landing-box-left-reviews-result-text-regular">Time delay</p>
              </div> {/* landing-box-left-reviews-result-content-text */}
            </div> {/* landing-box-left-reviews-result-content */}

            <div className="landing-box-left-reviews-result-content">
              <div className="landing-box-left-reviews-result-content-separator"></div>
              <div className="landing-box-left-reviews-result-content-text">
                <p className="landing-box-left-reviews-result-text-semibold">+35%</p>
                <p className="landing-box-left-reviews-result-text-regular">Data accuracy</p>
              </div> {/* landing-box-left-reviews-result-content-text */}
            </div> {/* landing-box-left-reviews-result-content */}
          </div> {/* landing-box-left-reviews-result */}
        </div> {/* landing-box-left-reviews */}
      </div> {/* landing-box-left */}

      <div className="landing-box-right">
        <img src={landingLaptop} className="landing-box-right-laptop" alt="laptop" />
        <img src={landingBg} className="landing-box-right-bg" alt="bg" />
      </div> {/* landing-box-right */}
    </div> {/* landing-box-box */}
    </div> // landing
  );
};

export default Landing;
