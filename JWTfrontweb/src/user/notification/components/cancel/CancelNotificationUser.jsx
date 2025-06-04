import './cancelNotificationUser.css';

import Calendar_Event from '../../../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Edit_Pencil_01 from '../../../../assets/icons/Edit_Pencil_01.svg?react';
import Calendar_Week from '../../../../assets/icons/Calendar_Week.svg?react';
import Clock from '../../../../assets/icons/Clock.svg?react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const CancelNotificationUser = () => {     
	return (
		<main className="cancelNotifUser-cards-card">
			<section className="cancelNotifUser-cards-card-indicator">
			</section> {/* cancelNotifUser-cards-card-indicator */}

			<section className="cancelNotifUser-cards-card-info">
				<Circle_Primary style={{ color: "var(--red-indicator)", width: "72px", height: "72px" }} />
				<div className="cancelNotifUser-cards-card-info-details">
					<div className="cancelNotifUser-cards-card-info-details-main">
						<p className="cancelNotifUser-cards-card-info-details-main-name">John Daniel R. Doe</p>
						<Circle_Primary style={{ color: "var(--black-color-opacity-45)", width: "8px", height: "8px" }} />
						<p className="cancelNotifUser-cards-card-info-details-main-time">4 hours ago  - </p>
						<p className="cancelNotifUser-cards-card-info-details-main-role">Fleet crew manager</p>
					</div> {/* cancelNotifUser-cards-card-info-details-main */}

					<div className="cancelNotifUser-cards-card-info-details-sub">
						<p className="cancelNotifUser-cards-card-info-details-sub-detail">Your appointment has been</p>
						<p className="cancelNotifUser-cards-card-info-details-sub-name">Cancelled</p>
					</div> {/* cancelNotifUser-cards-card-info-details-sub */}

					<div className="cancelNotifUser-cards-card-info-details-box">
						<div className="cancelNotifUser-cards-card-info-details-box-date">

							<Calendar_Week style={{  
								width: "24px", 
								height: "24px", 
								'--stroke-width': '2px',
								'--stroke-color': 'var(--black-color-opacity-30)'
							}} />
							<div className="cancelNotifUser-cards-card-info-details-box-date-day">
								<p className="cancelNotifUser-cards-card-info-details-box-date-day-day">Monday</p>
								<p className="cancelNotifUser-cards-card-info-details-box-date-day-date">DEC-28-2024</p>
							</div> {/* cancelNotifUser-cards-card-info-details-box-date-day */}
						</div> {/* cancelNotifUser-cards-card-info-details-box-date */}

						<div className="cancelNotifUser-cards-card-info-details-box-start">
							<Clock style={{ 
								width: "24px", 
								height: "24px", 
								'--stroke-color': 'var(--black-color-opacity-30)', 
								'--stroke-width': '5px' 
							}} />
							<div className="cancelNotifUser-cards-card-info-details-box-start-time">
								<p className="cancelNotifUser-cards-card-info-details-box-start-time-text">Starts at</p>
								<p className="cancelNotifUser-cards-card-info-details-box-start-time-date">11:30 AM</p>
							</div> {/* cancelNotifUser-cards-card-info-details-box-start-time */}
						</div> {/* cancelNotifUser-cards-card-info-details-box-start */}

						<div className="cancelNotifUser-cards-card-info-details-box-end">
							<Clock style={{ 
								width: "24px", 
								height: "24px", 
								'--stroke-color': 'var(--black-color-opacity-30)', 
								'--stroke-width': '5px' 
							}} />
							<div className="cancelNotifUser-cards-card-info-details-box-end-time">
								<p className="cancelNotifUser-cards-card-info-details-box-end-time-text">Ends at</p>
								<p className="cancelNotifUser-cards-card-info-details-box-end-time-date">12:00 PM</p>
							</div> {/* cancelNotifUser-cards-card-info-details-box-end-time */}
						</div> {/* cancelNotifUser-cards-card-info-details-box-end */}
					</div> {/* cancelNotifUser-cards-card-info-details-box */}
				</div> {/* cancelNotifUser-cards-card-info-details */}
			</section> {/* cancelNotifUser-cards-card-info */}

			{/* <section className="cancelNotifUser-cards-card-role">
				<div className="cancelNotifUser-cards-card-role-title">
					<Circle_Primary style={{ color: "var(--primary-color)", width: "32px", height: "32px" }} />
					<p>Chief Engineer</p>
				</div> 
			</section> */}

			{/* <section className="cancelNotifUser-cards-card-button">
				<button>
					<Edit_Pencil_01 style={{ color: "var(--white-color)", width: "32px", height: "32px", "--stroke-width": "2px" }} />
				</button>
			</section>  */}
		</main> 
	);
};

export default CancelNotificationUser;
