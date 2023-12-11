import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { useAccount } from 'wagmi';
import './App.css';

function App() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="App">
      <Sidebar>
        <Outlet />
      </Sidebar>
    </div>
  );
}

export default App;
