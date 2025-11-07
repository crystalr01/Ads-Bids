import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdvertiserDashboard from './components/Advertiser/AdvertiserDashboard';
import ViewerDashboard from './components/Viewer/ViewerDashboard';
import AdView from './components/Viewer/AdView';
import LandingPage from './components/LandingPage';

const PrivateRoute = ({ children, allowedRole }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const DashboardRouter = () => {
  const { userRole } = useAuth();

  if (userRole === 'advertiser') {
    return <AdvertiserDashboard />;
  } else if (userRole === 'viewer') {
    return <ViewerDashboard />;
  }

  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardRouter />
              </PrivateRoute>
            }
          />
          <Route path="/view/:adId/:viewerId" element={<AdView />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
