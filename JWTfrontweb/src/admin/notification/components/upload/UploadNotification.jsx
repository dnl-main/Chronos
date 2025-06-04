import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './uploadNotification.css';

import Calendar_Event from '../../../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Edit_Pencil_01 from '../../../../assets/icons/Edit_Pencil_01.svg?react';
import Calendar_Week from '../../../../assets/icons/Calendar_Week.svg?react';
import Clock from '../../../../assets/icons/Clock.svg?react';


const UploadNotification = () => {     
	return (
		<main className="uploadNotification-cards-card">
			<section className="uploadNotification-cards-card-indicator">
			</section> {/* uploadNotification-cards-card-indicator */}

			<section className="uploadNotification-cards-card-info">
				<Circle_Primary style={{ color: "var(--black-color)", width: "72px", height: "72px" }} />
				<div className="uploadNotification-cards-card-info-details">
					<div className="uploadNotification-cards-card-info-details-main">
						<p className="uploadNotification-cards-card-info-details-main-name">John Daniel R. Doe</p>
						<Circle_Primary style={{ color: "var(--black-color-opacity-45)", width: "8px", height: "8px" }} />
						<p className="uploadNotification-cards-card-info-details-main-time">4 hours ago  - </p>
						<p className="uploadNotification-cards-card-info-details-main-role">Fleet crew manager</p>
					</div> {/* uploadNotification-cards-card-info-details-main */}

					<div className="uploadNotification-cards-card-info-details-sub">
						<p className="uploadNotification-cards-card-info-details-sub-detail">Uploaded the</p>
						<p className="uploadNotification-cards-card-info-details-sub-name">Medical Certificate</p>
					</div> {/* uploadNotification-cards-card-info-details-sub */}

					<div className="uploadNotification-cards-card-info-details-box">
						<div className="uploadNotification-cards-card-info-details-box-date">

							<Calendar_Week style={{  
								width: "24px", 
								height: "24px", 
								'--stroke-width': '2px',
								'--stroke-color': 'var(--black-color-opacity-30)'
							}} />
							<div className="uploadNotification-cards-card-info-details-box-date-day">
								<p className="uploadNotification-cards-card-info-details-box-date-day-day">Certificate</p>
								<p className="uploadNotification-cards-card-info-details-box-date-day-date">Medical</p>
							</div> {/* uploadNotification-cards-card-info-details-box-date-day */}
						</div> {/* uploadNotification-cards-card-info-details-box-date */}
					</div> {/* uploadNotification-cards-card-info-details-box */}
				</div> {/* uploadNotification-cards-card-info-details */}
			</section> {/* uploadNotification-cards-card-info */}

			<section className="uploadNotification-cards-card-role">
				<div className="uploadNotification-cards-card-role-title">
					<Circle_Primary style={{ color: "var(--primary-color)", width: "32px", height: "32px" }} />
					<p>Chief Engineer</p>
				</div> {/* uploadNotification-cards-card-role-title */}
			</section> {/* uploadNotification-cards-card-role */}

			<section className="uploadNotification-cards-card-button">
				<button>
					<Edit_Pencil_01 style={{ color: "var(--white-color)", width: "32px", height: "32px", "--stroke-width": "2px" }} />
				</button>
			</section> {/* uploadNotification-cards-card-button*/}
		</main> 
	);
};

export default UploadNotification;
