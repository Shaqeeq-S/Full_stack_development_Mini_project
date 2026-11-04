import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
  User,
  Mail,
  Phone,
  Droplet,
  MapPin,
  Shield,
  Save,
  Calendar,
  Heart,
  CheckCircle
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || user.donorProfile?.city || '',
        state: user.state || user.donorProfile?.state || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      notifyError('Name and email are required.');
      return;
    }
    setLoading(true);
    try {
      await updateUser(formData);
      notifySuccess('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      notifyError(err?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <DashboardLayout title="My Profile" subtitle="View and update your personal information.">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/40">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user?.name || 'User'}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-semibold uppercase">
                    {user?.role || 'Member'}
                  </span>
                  {user?.donorProfile?.bloodGroup && (
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Droplet className="w-3 h-3 fill-white" />
                      {user.donorProfile.bloodGroup}
                    </span>
                  )}
                  {user?.donorProfile?.isAvailable && (
                    <span className="text-xs bg-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Member Since</span>
              </div>
              <p className="text-xs font-semibold text-slate-700">{memberSince}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Role</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 capitalize">{user?.role || 'N/A'}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Droplet className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Blood Group</span>
              </div>
              <p className="text-xs font-bold text-red-600">{user?.donorProfile?.bloodGroup || 'Not Set'}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                <Heart className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Donations</span>
              </div>
              <p className="text-xs font-semibold text-slate-700">{user?.donorProfile?.totalDonations || 0}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Edit Personal Information</h3>
          <p className="text-xs text-slate-500 mb-6">Update your name, contact details and location.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="you@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="+91 9876543210"
                />
              </div>

              {/* City */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="e.g. Mumbai"
                />
              </div>

              {/* State */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="e.g. Maharashtra"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center gap-2 disabled:opacity-60 shadow-sm shadow-red-200 transition"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
