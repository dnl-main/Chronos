import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './bookNotification.css';

import Calendar_Event from '../../../../assets/icons/Calendar_Event.svg?react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Edit_Pencil_01 from '../../../../assets/icons/Edit_Pencil_01.svg?react';
import Calendar_Week from '../../../../assets/icons/Calendar_Week.svg?react';
import Clock from '../../../../assets/icons/Clock.svg?react';


const BookNotification = () => {     
	return (
		<main className="bookNotification-cards-card">
			<section className="bookNotification-cards-card-indicator">
			</section> {/* bookNotification-cards-card-indicator */}

			<section className="bookNotification-cards-card-info">
				<Circle_Primary style={{ color: "var(--black-color)", width: "72px", height: "72px" }} />
				<div className="bookNotification-cards-card-info-details">
					<div className="bookNotification-cards-card-info-details-main">
						<p className="bookNotification-cards-card-info-details-main-name">John Daniel R. Doe</p>
						<Circle_Primary style={{ color: "var(--black-color-opacity-45)", width: "8px", height: "8px" }} />
						<p className="bookNotification-cards-card-info-details-main-time">4 hours ago  - </p>
						<p className="bookNotification-cards-card-info-details-main-role">Fleet crew manager</p>
					</div> {/* bookNotification-cards-card-info-details-main */}

					<div className="bookNotification-cards-card-info-details-sub">
						<p className="bookNotification-cards-card-info-details-sub-detail">Scheduled an appointment for</p>
						<p className="bookNotification-cards-card-info-details-sub-name">Juan Dela R. Cruz</p>
					</div> {/* bookNotification-cards-card-info-details-sub */}

					<div className="bookNotification-cards-card-info-details-box">
						<div className="bookNotification-cards-card-info-details-box-date">

							<Calendar_Week style={{  
								width: "24px", 
								height: "24px", 
								'--stroke-width': '2px',
								'--stroke-color': 'var(--black-color-opacity-30)'
							}} />
							<div className="bookNotification-cards-card-info-details-box-date-day">
								<p className="bookNotification-cards-card-info-details-box-date-day-day">Monday</p>
								<p className="bookNotification-cards-card-info-details-box-date-day-date">DEC-28-2024</p>
							</div> {/* bookNotification-cards-card-info-details-box-date-day */}
						</div> {/* bookNotification-cards-card-info-details-box-date */}

						<div className="bookNotification-cards-card-info-details-box-start">
							<Clock style={{ 
								width: "24px", 
								height: "24px", 
								'--stroke-color': 'var(--black-color-opacity-30)', 
								'--stroke-width': '5px' 
							}} />
							<div className="bookNotification-cards-card-info-details-box-start-time">
								<p className="bookNotification-cards-card-info-details-box-start-time-text">Starts at</p>
								<p className="bookNotification-cards-card-info-details-box-start-time-date">11:30 AM</p>
							</div> {/* bookNotification-cards-card-info-details-box-start-time */}
						</div> {/* bookNotification-cards-card-info-details-box-start */}

						<div className="bookNotification-cards-card-info-details-box-end">
							<Clock style={{ 
								width: "24px", 
								height: "24px", 
								'--stroke-color': 'var(--black-color-opacity-30)', 
								'--stroke-width': '5px' 
							}} />
							<div className="bookNotification-cards-card-info-details-box-end-time">
								<p className="bookNotification-cards-card-info-details-box-end-time-text">Ends at</p>
								<p className="bookNotification-cards-card-info-details-box-end-time-date">12:00 PM</p>
							</div> {/* bookNotification-cards-card-info-details-box-end-time */}
						</div> {/* bookNotification-cards-card-info-details-box-end */}
					</div> {/* bookNotification-cards-card-info-details-box */}
				</div> {/* bookNotification-cards-card-info-details */}
			</section> {/* bookNotification-cards-card-info */}

			<section className="bookNotification-cards-card-role">
				<div className="bookNotification-cards-card-role-title">
					<Circle_Primary style={{ color: "var(--primary-color)", width: "32px", height: "32px" }} />
					<p>Chief Engineer</p>
				</div> {/* bookNotification-cards-card-role-title */}
			</section> {/* bookNotification-cards-card-role */}

			<section className="bookNotification-cards-card-button">
				<button>
					<Edit_Pencil_01 style={{ color: "var(--white-color)", width: "32px", height: "32px", "--stroke-width": "2px" }} />
				</button>
			</section> {/* bookNotification-cards-card-button*/}
		</main> 
	);
};

export default BookNotification;
