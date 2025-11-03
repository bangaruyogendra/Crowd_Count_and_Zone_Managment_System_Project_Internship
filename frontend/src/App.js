import React, { useState } from 'react';
import LoginRegister from './Components/LoginRegister/LoginRegister';
import UserManagment from './Components/pages/User_Managment';
import Dashboard from './Components/pages/Dashboard';
import VideoZones from './Components/pages/VideoZones';
import CameraZones from './Components/pages/CameraZones';
import { VideoProvider } from './Components/pages/videoContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <VideoProvider>
      <div>
        {!isLoggedIn ? (
          <LoginRegister onLoginSuccess={() => setIsLoggedIn(true)} />
        ) : (
          <>

            <VideoZones />
            <CameraZones />
            <Dashboard />
          
          </>
        )}
      </div>
    </VideoProvider>
  );
}

export default App;
