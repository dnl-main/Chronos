import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './rescheduleNotificationUser.css';

import Calendar_Event from '../../../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Edit_Pencil_01 from '../../../../assets/icons/Edit_Pencil_01.svg?react';
import Calendar_Week from '../../../../assets/icons/Calendar_Week.svg?react';
import Clock from '../../../../assets/icons/Clock.svg?react';

const RescheduleNotificationUser = () => {     
	return (
		<main className="rescheduleNotificationUser-cards-card">
			<section className="rescheduleNotificationUser-cards-card-indicator">
			</section> {/* rescheduleNotificationUser-cards-card-indicator */}

			<section className="rescheduleNotificationUser-cards-card-info">
				<Circle_Primary style={{ color: "var(--black-color)", width: "72px", height: "72px" }} />
				<div className="rescheduleNotificationUser-cards-card-info-details">
					<div className="rescheduleNotificationUser-cards-card-info-details-main">
						<p className="rescheduleNotificationUser-cards-card-info-details-main-name">John Daniel R. Doe</p>
						<Circle_Primary style={{ color: "var(--black-color-opacity-45)", width: "8px", height: "8px" }} />
						<p className="rescheduleNotificationUser-cards-card-info-details-main-time">4 hours ago  - </p>
						<p className="rescheduleNotificationUser-cards-card-info-details-main-role">Fleet crew manager</p>
					</div> {/* rescheduleNotificationUser-cards-card-info-details-main */}

					<div className="rescheduleNotificationUser-cards-card-info-details-sub">
						<p className="rescheduleNotificationUser-cards-card-info-details-sub-detail">Your appointment has been</p>
						<p className="rescheduleNotificationUser-cards-card-info-details-sub-name">Rescheduled</p>
					</div> {/* rescheduleNotificationUser-cards-card-info-details-sub */}

					<div className="rescheduleNotificationUser-cards-card-info-details-box">
						<div className="rescheduleNotificationUser-cards-card-info-details-box-date">

							<Calendar_Week style={{  
								width: "24px", 
								height: "24px", 
								'--stroke-width': '2px',
								'--stroke-color': 'var(--black-color-opacity-30)'
							}} />
							<div className="rescheduleNotificationUser-cards-card-info-details-box-date-day">
								<p className="rescheduleNotificationUser-cards-card-info-details-box-date-day-day">Monday</p>
								<p className="rescheduleNotificationUser-cards-card-info-details-box-date-day-date">DEC-28-2024</p>
							</div> {/* rescheduleNotificationUser-cards-card-info-details-box-date-day */}
						</div> {/* rescheduleNotificationUser-cards-card-info-details-box-date */}

						<div className="rescheduleNotificationUser-cards-card-info-details-box-start">
							<Clock style={{ 
								width: "24px", 
								height: "24px", 
								'--stroke-color': 'var(--black-color-opacity-30)', 
								'--stroke-width': '5px' 
							}} />
							<div className="rescheduleNotificationUser-cards-card-info-details-box-start-time">
								<p className="rescheduleNotificationUser-cards-card-info-details-box-start-time-text">Starts at</p>
								<p className="rescheduleNotificationUser-cards-card-info-details-box-start-time-date">11:30 AM</p>
							</div> {/* rescheduleNotificationUser-cards-card-info-details-box-start-time */}
						</div> {/* rescheduleNotificationUser-cards-card-info-details-box-start */}

						<div className="rescheduleNotificationUser-cards-card-info-details-box-end">
							<Clock style={{ 
								width: "24px", 
								height: "24px", 
								'--stroke-color': 'var(--black-color-opacity-30)', 
								'--stroke-width': '5px' 
							}} />
							<div className="rescheduleNotificationUser-cards-card-info-details-box-end-time">
								<p className="rescheduleNotificationUser-cards-card-info-details-box-end-time-text">Ends at</p>
								<p className="rescheduleNotificationUser-cards-card-info-details-box-end-time-date">12:00 PM</p>
							</div> {/* rescheduleNotificationUser-cards-card-info-details-box-end-time */}
						</div> {/* rescheduleNotificationUser-cards-card-info-details-box-end */}
					</div> {/* rescheduleNotificationUser-cards-card-info-details-box */}
				</div> {/* rescheduleNotificationUser-cards-card-info-details */}
			</section> {/* rescheduleNotificationUser-cards-card-info */}

			{/* <section className="rescheduleNotificationUser-cards-card-role">
				<div className="rescheduleNotificationUser-cards-card-role-title">
					<Circle_Primary style={{ color: "var(--primary-color)", width: "32px", height: "32px" }} />
					<p>Chief Engineer</p>
				</div> 
			</section>  */}

			{/* <section className="rescheduleNotificationUser-cards-card-button">
				<button>
					<Edit_Pencil_01 style={{ color: "var(--white-color)", width: "32px", height: "32px", "--stroke-width": "2px" }} />
				</button>
			</section>  */}
		</main> 
	);
};

export default RescheduleNotificationUser;
