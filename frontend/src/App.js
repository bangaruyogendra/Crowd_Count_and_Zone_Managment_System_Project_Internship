import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import LoginRegister from './Components/LoginRegister/LoginRegister';
import PasswordReset from './Components/LoginRegister/PasswordReset';
import PasswordResetConfirm from './Components/LoginRegister/PasswordResetConfirm';
import UserManagment from './Components/pages/User_Managment';
import Dashboard from './Components/pages/Dashboard';
import VideoZones from './Components/pages/VideoZones';
import CameraZones from './Components/pages/CameraZones';
import { VideoProvider } from './Components/pages/videoContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <VideoProvider>
      <Router>
        <Routes>

          {/* LOGIN / REGISTER */}
          <Route
            path="/"
            element={<LoginRegister onLoginSuccess={() => setIsLoggedIn(true)} />}
          />

          <Route path="/password-reset" element={<PasswordReset />} />

          {/* RESET PASSWORD CONFIRM (from email link) */}
          <Route path="/reset-password/:uidb64/:token" element={<PasswordResetConfirm />} />

      
          {isLoggedIn && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/videozones" element={<VideoZones />} />
              <Route path="/camerazones" element={<CameraZones />} />
              <Route path="/usermanagement" element={<UserManagment />} />
            </>
          )}

          {/* If not logged in and trying to go elsewhere */}
          {!isLoggedIn && <Route path="*" element={<Navigate to="/" />} />}

        </Routes>
      </Router>
    </VideoProvider>
  );
}

export default App;
