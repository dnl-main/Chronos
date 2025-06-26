import React, { memo } from 'react';
import './landing.css';
import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routes';

import landingBg from '../../assets/background/landingBg.png';
import landingLaptop from '../../assets/overlay/landingLaptop.png';

import Star from '../../assets/icons/Star.svg?react';
import DP_1 from '../../assets/profile/DP_1.jpg';
import DP_2 from '../../assets/profile/DP_2.jpg';
import DP_3 from '../../assets/profile/DP_3.jpg';

const RenderStars = ({ count = 5 }) =>
  [...Array(count)].map((_, i) => (
    <Star key={i} className="star-icon" style={{ width: '2.8vh', height: '2.8vh', '--fill-color': '#FFCB45' }} />
  ));

const Reviews = memo(() => (
  <div className="landing-box-left-reviews">
    <div className="landing-box-left-reviews-rating">
      <div className="landing-box-left-reviews-rating-img">
        {[DP_1, DP_2, DP_3].map((dp, i) => (
          <div key={i} className="landing-box-left-reviews-rating-img-crop">
            <img src={dp} alt={`profile-${i}`} />
          </div>
        ))}
      </div>
      <div className="landing-box-left-reviews-rating-value">
        <div className="landing-box-left-reviews-rating-value-top">
          <p className="landing-box-left-reviews-rating-value-top-medium">4.5</p>
          <div className="landing-box-left-reviews-rating-value-top-stars">
            <RenderStars />
          </div>
        </div>
        <p className="landing-box-left-reviews-rating-value-regular">(3.5K Ratings)</p>
      </div>
    </div>

    <div className="landing-box-left-reviews-result">
      {[
        { value: '+30%', text: 'Operational efficiency' },
        { value: '-40%', text: 'Time delay' },
        { value: '+35%', text: 'Data accuracy' }
      ].map(({ value, text }, i) => (
        <div key={i} className="landing-box-left-reviews-result-content">
          <div className="landing-box-left-reviews-result-content-separator" />
          <div className="landing-box-left-reviews-result-content-text">
            <p className="landing-box-left-reviews-result-text-semibold">{value}</p>
            <p className="landing-box-left-reviews-result-text-regular">{text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
));

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-box">
        <div className="landing-box-left">
          <div className="landing-box-left-logo">
            <p>Concorde</p>
          </div>

          <div className="landing-box-left-main">
            <div className="landing-box-left-main-header">
              <p className="landing-box-left-main-header-medium">Effortlessly</p>
              <div className="landing-box-left-main-header-second">
                <p className="landing-box-left-main-header-second-medium">Manage your</p>
                <p className="landing-box-left-main-header-second-bold">Crew</p>
              </div>
            </div>

            <div className="landing-box-left-main-sub">
              <p className="landing-box-left-main-sub-regular">Take control of your scheduling and</p>
              <div className="landing-box-left-main-sub-second">
                <p className="landing-box-left-main-sub-second-regular">certificate tracking with</p>
                <p className="landing-box-left-main-sub-second-bold">Concorde</p>
              </div>
            </div>

            <div className="landing-box-left-main-buttons">
              <Link to={ROUTES.SIGNUP} className="landing-box-left-main-buttons-signUp">Sign up for free</Link>
              <Link to={ROUTES.LOGIN} className="landing-box-left-main-buttons-logIn">Log in</Link>
            </div>
          </div>

          <Reviews />
        </div>

        <div className="landing-box-right">
          <img src={landingLaptop} className="landing-box-right-laptop" alt="laptop" />
          <img src={landingBg} className="landing-box-right-bg" alt="background" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
