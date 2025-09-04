// Dependencies imports
import React from 'react';
import Spinner from '../../../../../components/ui/Spinner';
import Cloud_Upload from '../../../../../assets/icons/Cloud_Upload.svg?react';
import File_Add from '../../../../../assets/icons/File_Add.svg?react';
import Folder_Open from '../../../../../assets/icons/Folder_Open.svg?react';
import Check from '../../../../../assets/icons/Check.svg?react';

import Circle_Primary from '../../../../../assets/icons/Circle_Primary.svg?react';
import Bell from '../../../../../assets/icons/Bell.svg?react';

// CSS Imports
import './homeUserRight.css';

// Logic hook import
import useHomeUserLogic from '../../useHomeUserLogic';

const HomeUserRight = () => {
  return (
    <div className="homeUser-top-core-right">
      <div className="homeUser-top-core-right-header">
        <p>Booking History</p>      
      </div>
      <div className="homeUser-top-core-right-cards">
        <main className="homeUser-top-core-right-cards-card">
          <div className="homeUser-top-core-right-cards-card-up">
            <Circle_Primary style={{ color: "var(--black-color-opacity-60)", width: "28px", height: "28px" }} />
            <div className="homeUser-top-core-right-cards-card-up-text">
              <p className="homeUser-top-core-right-cards-card-up-text-name">Admin Name</p>
              <p className="homeUser-top-core-right-cards-card-up-text-dept">Department</p>
            </div>
          </div>
          <div className="homeUser-top-core-right-cards-card-down">
            <button
              className="homeUser-top-core-right-cards-card-down-btn"
              // onClick={() => handleNotifyClick(certificate)}
            >
              <p>Edit</p>
              {/* <Bell style={{ color: "var(--primary-color)", width: "20px", height: "20px", '--stroke-width': '5' }} /> */}
            </button>
            <div className="homeUser-top-core-right-cards-card-down-text">
              <p className="homeUser-top-core-right-cards-card-down-text-time">11:00 - 11:30 AM</p>
              <p className="homeUser-top-core-right-cards-card-down-text-date">SEP - 30 - 25</p>
            </div>
          </div>
        </main> 
      </div>
      
    </div>
  );
};

export default HomeUserRight;
