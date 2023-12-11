import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Settings from './pages/Settings';
import ZeroDevWrapper from './ZeroDevWrapper';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css'
import App from './App';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
        id: 'home',
      },
      {
        path: '/settings',
        element: <Settings />,
        id: 'settings',
      },
    ],
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
      <RouterProvider router={router} />
    </ZeroDevWrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
