import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import type { RootState, AppDispatch } from './store';
import { fetchProfile } from './features/auth/authSlice';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Landing from './pages/landing/Landing';
import UserDashboard from './pages/user/Dashboard';
import SearchRide from './pages/user/SearchRide';
import Payment from './pages/user/Payment';
import LiveMap from './pages/user/LiveMap';
import AdminDashboard from './pages/admin/Dashboard';
import IntroAnimation from './pages/landing/IntroAnimation';
import Profile from './pages/user/Profile';
import { ThemeProvider } from './contexts/ThemeContext';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <div className="pt-16">
      {children}
    </div>
  </>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
  // Only show full page spinner on initial load when we don't know who the user is yet
  if (loading && !user) {
    return <div className="min-h-screen flex items-center justify-center bg-app-bg"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Redirects already-authenticated users away from public-only pages (e.g. /login)
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
  // Only show full page spinner on initial load when we don't know who the user is yet
  if (loading && !user) {
    return <div className="min-h-screen flex items-center justify-center bg-app-bg"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }
  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('hasSeenIntro');
  });

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);



  const handleIntroComplete = () => {
    sessionStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
  };

  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <Router>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        
        <Route path="/login" element={<PublicOnlyRoute><Layout><Login /></Layout></PublicOnlyRoute>} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <UserDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/search" element={
          <Layout>
            <SearchRide />
          </Layout>
        } />

        <Route path="/payment/:bookingId" element={
          <ProtectedRoute>
            <Layout>
              <Payment />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/live/:bookingId" element={
          <ProtectedRoute>
            <Navbar />
            <LiveMap />
          </ProtectedRoute>
        } />
        

        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
