import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import ZeroDevWrapper from './ZeroDevWrapper';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import './index.css';
import reportWebVitals from './reportWebVitals';
import '@mantine/core/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    id: 'home',
  },
  {
    path: '/signin',
    element: <SignIn />,
    id: 'signin',
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ZeroDevWrapper>
      <MantineProvider>
        <div className="h-screen w-screen">
          <RouterProvider router={router} />
        </div>
      </MantineProvider>
    </ZeroDevWrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
