import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './uploadNotificationUser.css';

import Calendar_Event from '../../../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Edit_Pencil_01 from '../../../../assets/icons/Edit_Pencil_01.svg?react';
import Calendar_Week from '../../../../assets/icons/Calendar_Week.svg?react';
import Clock from '../../../../assets/icons/Clock.svg?react';


const UploadNotificationUser = () => {     
	return (
		<main className="uploadNotificationUser-cards-card">
			<section className="uploadNotificationUser-cards-card-indicator">
			</section> {/* uploadNotificationUser-cards-card-indicator */}

			<section className="uploadNotificationUser-cards-card-info">
				<Circle_Primary style={{ color: "var(--black-color)", width: "72px", height: "72px" }} />
				<div className="uploadNotificationUser-cards-card-info-details">
					<div className="uploadNotificationUser-cards-card-info-details-main">
						<p className="uploadNotificationUser-cards-card-info-details-main-name">John Daniel R. Doe</p>
						<Circle_Primary style={{ color: "var(--black-color-opacity-45)", width: "8px", height: "8px" }} />
						<p className="uploadNotificationUser-cards-card-info-details-main-time">4 hours ago  - </p>
						<p className="uploadNotificationUser-cards-card-info-details-main-role">Fleet crew manager</p>
					</div> {/* uploadNotificationUser-cards-card-info-details-main */}

					<div className="uploadNotificationUser-cards-card-info-details-sub">
						<p className="uploadNotificationUser-cards-card-info-details-sub-detail">Please upload your</p>
						<p className="uploadNotificationUser-cards-card-info-details-sub-name">Medical Certificate</p>
					</div> {/* uploadNotificationUser-cards-card-info-details-sub */}

					<div className="uploadNotificationUser-cards-card-info-details-box">
						<div className="uploadNotificationUser-cards-card-info-details-box-date">

							<Calendar_Week style={{  
								width: "24px", 
								height: "24px", 
								'--stroke-width': '2px',
								'--stroke-color': 'var(--black-color-opacity-30)'
							}} />
							<div className="uploadNotificationUser-cards-card-info-details-box-date-day">
								<p className="uploadNotificationUser-cards-card-info-details-box-date-day-day">Certificate</p>
								<p className="uploadNotificationUser-cards-card-info-details-box-date-day-date">Medical</p>
							</div> {/* uploadNotificationUser-cards-card-info-details-box-date-day */}
						</div> {/* uploadNotificationUser-cards-card-info-details-box-date */}
					</div> {/* uploadNotificationUser-cards-card-info-details-box */}
				</div> {/* uploadNotificationUser-cards-card-info-details */}
			</section> {/* uploadNotificationUser-cards-card-info */}

			{/* <section className="uploadNotificationUser-cards-card-role">
				<div className="uploadNotificationUser-cards-card-role-title">
					<Circle_Primary style={{ color: "var(--primary-color)", width: "32px", height: "32px" }} />
					<p>Chief Engineer</p>
				</div>
			</section>  */}

			{/* <section className="uploadNotificationUser-cards-card-button">
				<button>
					<Edit_Pencil_01 style={{ color: "var(--white-color)", width: "32px", height: "32px", "--stroke-width": "2px" }} />
				</button>
			</section> */}
		</main> 
	);
};

export default UploadNotificationUser;
