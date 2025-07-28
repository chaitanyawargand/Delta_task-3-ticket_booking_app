import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Userprovider } from './Context/Usercontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Userprovider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </Userprovider>
);
