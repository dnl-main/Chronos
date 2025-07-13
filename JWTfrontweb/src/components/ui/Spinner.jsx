// import React from 'react';
// import './Spinner.css';

// const Spinner = () => {
//   return (
//     <div className="spinner-container">
//       <div className="spinner"></div>
//     </div>
//   );
// };

// export default Spinner;

import React from 'react';
import './Spinner.css';

const Spinner = ({ className = '' }) => {
  return (
    <div className={`spinner-container ${className}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
