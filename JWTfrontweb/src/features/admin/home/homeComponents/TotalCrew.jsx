import React from "react";
import { Link } from "react-router-dom";
import User_Add from '../../../../assets/icons/User_Add.svg?react';
import Arrow_Right_SM from '../../../../assets/icons/Arrow_Right_SM.svg?react';
import { Heading } from "lucide-react";

const TotalCrew = ({ totalCrewCount }) => {
    return(
        <main className="home-top-main-left-down">
            <div className="home-top-main-left-down-header">
                <div className="home-top-main-left-down-header-main">
                    <header>Total Crew</header>
                    <User_Add
                        style={{ color: 'var(--primary-color)', width: '20px', height: '20px', '--stroke-width': '7px' }}
                    />
                </div>
                <Link to="/admin/availabity">
                    <button className="home-top-main-left-down-header-btn">
                        <Arrow_Right_SM
                            style={{ color:'var(--black-color)', width: '24px', height: '24px', '--stroke-width': '5' }}
                        />
                    </button>
                </Link>
            </div>
            <div className="home-top-main-left-down-data">
                <div className="home-top-main-left-down-data-all">
                    <p>{totalCrewCount}</p>
                </div>
                <div className="home-top-left-main-down-data-complete"></div>
            </div>
        </main>
    );
};

export default TotalCrew;