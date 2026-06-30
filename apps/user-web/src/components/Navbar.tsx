import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logout } from '../features/auth/authSlice';
import { Car } from 'lucide-react';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="fixed top-0 w-full bg-app-bg/80 backdrop-blur-xl z-50 border-b border-app-border transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-app-text">RideSync</span>
        </Link>
        
        {isLandingPage && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-app-muted">
            <a href="#features" className="hover:text-app-text transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-app-text transition-colors">How it Works</a>
            <a href="#tech" className="hover:text-app-text transition-colors">Technology</a>
            <a href="#autoshift" className="relative group flex items-center gap-2 px-3 py-1.5 rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-app-border hover:border-app-text transition-all bg-app-surface/60 backdrop-blur-md">
              <span className="relative z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">NEW</span>
              <span className="relative z-10 text-app-text font-bold tracking-wide text-sm">AutoShift™</span>
              <motion.div animate={{ opacity: [0, 0.05, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-blue-600" />
            </a>
          </div>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-base font-medium text-app-muted hover:text-blue-600 transition-colors hidden md:block">Dashboard</Link>
              <UserMenu />
            </>
          ) : (
            <Link to="/login" className="text-base font-medium bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
