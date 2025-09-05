
import React from 'react';
import { Link } from 'react-router-dom';
import Notebook from '../../../../assets/icons/Notebook.svg?react';
import Arrow_Right_SM from '../../../../assets/icons/Arrow_Right_SM.svg?react';
import HomeCertAdmin from '../ui/ExpiringCertificates';

const ExpiringCertificate = () => {
  return (
    <section className="home-top-main-right">
      <div className="home-top-main-right-header">
        <div className="home-top-main-right-header-main">
          <header>Expiring Certificates</header>
          <Notebook style={{ color: 'var(--black-color)', width: '20px', height: '20px' }} />
        </div>
        <Link to="/admin/certificate">
          <button className="home-top-main-right-header-btn">
            <Arrow_Right_SM
              style={{ color: 'var(--black-color)', width: '24px', height: '24px', '--stroke-width': '5' }}
            />
          </button>
        </Link>
      </div>
      <HomeCertAdmin />
    </section>
  );
};

export default ExpiringCertificate;