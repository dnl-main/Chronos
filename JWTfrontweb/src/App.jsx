// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router/router';

function App() {
  return (
    <div className="all">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
