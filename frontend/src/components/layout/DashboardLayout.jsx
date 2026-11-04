import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import AvatarUploadModal from '../common/AvatarUploadModal';
import PageBackgroundAnimation from '../common/PageBackgroundAnimation';
import {
  LayoutDashboard,
  Users,
  Heart,
  Droplet,
  FileText,
  PlusCircle,
  Search,
  LogOut,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  Camera
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const DashboardLayout = ({ children, title, subtitle, activeTab }) => {
  const { user, logout, toggleDonorAvailability } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvailabilityToggle = async () => {
    if (!user || user.role !== 'donor') return;
    try {
      setUpdatingAvailability(true);
      await toggleDonorAvailability();
    } catch (error) {
      console.error('Failed to update availability:', error);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const getNavLinks = () => {
    const profileLink = { label: 'My Profile', path: '/profile', icon: UserCheck };
    if (user?.role === 'donor') {
      return [
        { label: 'Donor Overview', path: '/donor-dashboard', icon: LayoutDashboard },
        { label: 'Find Donors', path: '/find-donors', icon: Search },
        profileLink,
      ];
    }
    if (user?.role === 'recipient') {
      return [
        { label: 'Overview', path: '/recipient-dashboard', icon: LayoutDashboard },
        { label: 'Post Blood Request', path: '/create-request', icon: PlusCircle },
        { label: 'My Requests', path: '/my-requests', icon: FileText },
        { label: 'Search Donors', path: '/find-donors', icon: Search },
        profileLink,
      ];
    }
    if (user?.role === 'admin') {
      return [
        { label: 'Admin Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
        { label: 'Find Donors', path: '/find-donors', icon: Search },
        profileLink,
      ];
    }
    return [];
  };

  const links = getNavLinks();
  const isAvailable = user?.donorProfile?.isAvailable;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile top header */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1.5">
            <img src={logoImg} alt="BloodConnect" className="h-7 w-auto object-contain" />
            <span className="font-bold text-slate-900 text-sm">BloodConnect</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAvatarModalOpen(true)}
            title="Change Profile Picture"
            className="relative"
          >
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <span className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-0.5">
              <Camera className="w-2.5 h-2.5" />
            </span>
          </button>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-700 uppercase">
            {user?.role}
          </span>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-500 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoImg} alt="BloodConnect" className="h-8 w-auto object-contain group-hover:scale-105 transition" />
              <span className="text-lg font-bold text-slate-900">
                Blood<span className="text-red-600">Connect</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile capsule in sidebar with Photo Option */}
          <div className="p-4 mx-3 my-3 bg-slate-50/90 rounded-2xl border border-slate-200/80 shadow-sm relative group">
            <div className="flex items-center gap-3">
              {/* Profile Avatar with click-to-change icon */}
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                title="Click to change profile picture"
                className="relative group/avatar cursor-pointer"
              >
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="md"
                  className="group-hover/avatar:ring-red-400 transition"
                />
                <div className="absolute inset-0 bg-slate-900/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition flex items-center justify-center text-white">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </button>

              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-red-100 text-red-700">
                    {user?.role}
                  </span>
                  {user?.donorProfile?.bloodGroup && (
                    <span className="text-[11px] font-bold text-slate-700 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {user.donorProfile.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAvatarModalOpen(true)}
              className="mt-2 text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
            >
              <Camera className="w-3 h-3" />
              <span>Change profile picture</span>
            </button>

            {/* Quick Donor Availability Switch */}
            {user?.role === 'donor' && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <button
                    onClick={handleAvailabilityToggle}
                    disabled={updatingAvailability}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                      }`}
                    />
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation links */}
          <nav className="px-3 py-2 space-y-1">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {links.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-red-50 text-red-600 font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-red-600' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            <Heart className="w-4 h-4 text-slate-400" />
            Home Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Ambient page background animation */}
        <PageBackgroundAnimation variant="default" showEcg={false} />

        {/* Top bar inside main */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'donor' && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <span className="text-slate-500 font-medium">Donation Availability:</span>
                <button
                  onClick={handleAvailabilityToggle}
                  disabled={updatingAvailability}
                  className={`px-2.5 py-0.5 rounded-full font-bold transition flex items-center gap-1 ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                  {isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>
            )}

            {user?.role === 'recipient' && (
              <Link
                to="/create-request"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                New Blood Request
              </Link>
            )}

            {/* Quick avatar click in topbar */}
            <button
              onClick={() => setAvatarModalOpen(true)}
              title="Change Profile Picture"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            >
              <Avatar src={user?.avatar} name={user?.name} size="xs" />
              <span className="text-xs font-bold text-slate-700">{user?.name?.split(' ')[0]}</span>
              <Camera className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Content Children */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative z-10">
          {children}
        </div>
      </main>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSaveSuccess={(msg) => setToastMessage(msg)}
      />
    </div>
  );
};

export default DashboardLayout;
