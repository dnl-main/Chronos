import react from 'react';
import { Link } from 'react-router-dom';
import Users from '../../../../assets/icons/Users.svg?react';
import Circle_Primary from '../../../../assets/icons/Circle_Primary.svg?react';
import Arrow_Right_SM from '../../../../assets/icons/Arrow_Right_SM.svg?react';

const AvailableCrew = ({ availableCrewCount, jobTitleItems }) => {
    return (
        <main className="home-top-main-left-up">
            <div className="home-top-main-left-up-header">
                <div className="home-top-main-left-up-header-main">
                    <header>Available crew</header>
                    <Users style={{ color: 'var(--black-color)', width: '20px', height: '20px' }} />
                </div>
                <Link to="/admin/availability">
                    <button className="home-top-main-left-up-header-btn">
                        <Arrow_Right_SM
                            style={{ color: 'var(--black-color)', width: '24px', height: '24px', '--stroke-width': '5' }}
                        />
                    </button>
                </Link>
            </div>
            <div className="home-top-main-left-up-data">
                <div className="home-top-main-left-up-data-all">
                    <p>{availableCrewCount}</p>
                </div>
                <div className="home-top-main-left-up-data-complete"></div>
            </div>
            <div className="home-top-main-left-up-job">
                <header className="home-top-main-left-up-job-header">
                    <p>Job titles</p>
                </header>
                <main className="home-top-main-left-up-job-main">
                    {jobTitleItems.map(({ title, count }) => (
                        <div className="home-top-main-left-up-job-main-card">
                            <Circle_Primary
                                style={{ color: 'var(--clack-color-opacity-60)', width: '20px', height: '20px' }}
                            />
                            <p>{title}</p>
                            {count > 0 && <p>({count})</p>}
                        </div>
                    ))}
                </main>
            </div>
        </main>
    );
};

export default AvailableCrew;