import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import {
  Droplet,
  Menu,
  X,
  User,
  LogOut,
  PlusCircle,
  Search,
  LayoutDashboard,
  Heart
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin-dashboard';
    if (user.role === 'donor') return '/donor-dashboard';
    return '/recipient-dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoImg} alt="BloodConnect Logo" className="h-10 w-auto object-contain" />
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-red-600 transition">
                Blood<span className="text-red-600">Connect</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-red-100 text-red-700 rounded ml-2">
                Emergency
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/find-donors"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                isActive('/find-donors') ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Donors
            </Link>

            {isAuthenticated && user?.role === 'recipient' && (
              <>
                <Link
                  to="/create-request"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                    isActive('/create-request') ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-red-600" />
                  Post Request
                </Link>
                <Link
                  to="/my-requests"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/my-requests') ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Requests
                </Link>
              </>
            )}

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                  location.pathname.includes('dashboard') ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* User Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-full text-xs font-semibold text-slate-700 transition"
                >
                  <Avatar src={user?.avatar} name={user?.name} size="xs" />
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-white text-red-600 border border-slate-200">
                    {user?.role}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm shadow-red-200 transition flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  Become a Donor
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/find-donors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Find Blood Donors
          </Link>
          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
            >
              My Dashboard ({user.role})
            </Link>
          )}
          {isAuthenticated && user?.role === 'recipient' && (
            <>
              <Link
                to="/create-request"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Create Blood Request
              </Link>
              <Link
                to="/my-requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                My Requests
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar src={user?.avatar} name={user?.name} size="sm" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-3 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-3 bg-red-600 rounded-lg text-sm font-semibold text-white hover:bg-red-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
