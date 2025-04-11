import React, { useState } from 'react';
import './certificate.css';

import { Navbar } from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import CertificateCard from './cards/CertificateCard';

import Circle_Primary from '../../assets/icons/Circle_Primary.svg?react';
import Notebook from '../../assets/icons/Notebook.svg?react';


const Certificate = () => {
  const [overlayContent, setOverlayContent] = useState(null);

  return (
    <div className="certificate">
      <Navbar />
      <Sidebar />
      <div className="certificate-box">
        <main className="certificate-box-in">
          <header className="certificate-header">
            <Notebook 
              style={{ width: '32px', height: '32px', '--stroke-width': '4px' }} 
            />
            <p>Certificate tracking</p>
          </header>
          
          <section className="certificate-tabs">
            <button className="certificate-tabs-all">
              <Circle_Primary style={{ width: '20px', height: '20px' }} />
              <p>All</p>
            </button>
            <button className="certificate-tabs-complete">
              <Circle_Primary style={{ width: '20px', height: '20px' }} />
              <p>Complete</p>
            </button>
            <button className="certificate-tabs-incomplete">
              <Circle_Primary style={{ width: '20px', height: '20px' }} />
              <p>Incomplete</p>
            </button>
          </section>
          
          <section className="certificate-categories">
            <p>Name and position</p>
            <p>Medical</p>
            <p>Training</p>
            <p>Certificate</p>
            <p>Training 2</p>
          </section>

          <section className="certificate-cards">
            <CertificateCard />
            <CertificateCard />
            <CertificateCard />
          </section>
        </main>
      </div>
      {overlayContent && <div className="overlay-container">{overlayContent}</div>}
    </div>
  );
};

export default Certificate;
