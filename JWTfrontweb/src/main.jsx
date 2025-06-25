// src/main.jsx
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider} from "@tanstack/react-query";

import App from './App.jsx';
import './index.css';
import setupAxios from './app/services/axiosConfig.js';

// Configure Axios with baseURL and token
setupAxios();

const queryClient = new QueryClient()

const rootElement = document.getElementById('root');
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
