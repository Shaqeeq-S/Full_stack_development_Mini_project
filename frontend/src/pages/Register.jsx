import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageBackgroundAnimation from '../components/common/PageBackgroundAnimation';
import Avatar from '../components/common/Avatar';
import {
  Droplet,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Camera,
  Upload
} from 'lucide-react';
import { ALL_BLOOD_GROUPS } from '../utils/compatibility';

const PRESET_REGISTER_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'donor', // 'donor' or 'recipient'
    avatar: '',
    city: '',
    state: '',
    pincode: '',
    // Donor specific
    bloodGroup: 'O+',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    address: '',
    lastDonationDate: '',
    isAvailable: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.role === 'donor') {
      if (!formData.bloodGroup || !formData.dateOfBirth || !formData.address) {
        setError('Please fill in all mandatory donor fields (Blood Group, DOB, Address)');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');

      const res = await register(formData);

      if (res.success && res.user) {
        if (res.user.role === 'donor') {
          navigate('/donor-dashboard', { replace: true });
        } else {
          navigate('/recipient-dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      const msg =
        err.response?.data?.message ||
        'Registration failed. Please check the input fields and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Photo file size exceeds 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <Navbar />

      {/* Floating Animated Background */}
      <PageBackgroundAnimation variant="default" showEcg={true} />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-xl shadow-red-500/5 border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-red-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-md shadow-red-200 animate-float-slow">
              <Droplet className="w-7 h-7 fill-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Create an Account
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Join BloodConnect as a voluntary donor or recipient
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Option Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group shrink-0">
                <Avatar
                  src={formData.avatar}
                  name={formData.name || 'User'}
                  size="xl"
                  className="ring-4 ring-white shadow-md"
                />
                <label className="absolute -bottom-1 -right-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md cursor-pointer transition">
                  <Camera className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Profile Picture (Optional)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload your photo or select one of the suggested avatars below.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  {PRESET_REGISTER_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, avatar: preset }))}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition hover:scale-110 ${
                        formData.avatar === preset ? 'border-red-600 ring-2 ring-red-400' : 'border-slate-200'
                      }`}
                    >
                      <img src={preset} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, avatar: '' }))}
                      className="text-[11px] text-red-600 hover:underline font-semibold ml-2"
                    >
                      Clear Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'donor' })}
                  className={`p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition ${
                    formData.role === 'donor'
                      ? 'border-red-600 bg-red-50 text-red-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Droplet
                    className={`w-4 h-4 ${
                      formData.role === 'donor' ? 'fill-red-600 text-red-600' : 'text-slate-400'
                    }`}
                  />
                  Blood Donor
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'recipient' })}
                  className={`p-3.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition ${
                    formData.role === 'recipient'
                      ? 'border-red-600 bg-red-50 text-red-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User
                    className={`w-4 h-4 ${
                      formData.role === 'recipient' ? 'text-red-600' : 'text-slate-400'
                    }`}
                  />
                  Blood Recipient / Patient
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Bangalore"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Karnataka"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 560038"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Donor Specific Section */}
            {formData.role === 'donor' && (
              <div className="p-5 bg-red-50/60 border border-red-200/80 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-red-900 border-b border-red-200/60 pb-2">
                  <Droplet className="w-4 h-4 fill-red-600 text-red-600" />
                  <span>Donor Medical & Profile Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Blood Group *
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      {ALL_BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required={formData.role === 'donor'}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Residential Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required={formData.role === 'donor'}
                      placeholder="Street, locality (kept private from public search)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Last Blood Donation Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="lastDonationDate"
                      value={formData.lastDonationDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-slate-300"
                  />
                  <label htmlFor="isAvailable" className="text-xs font-medium text-slate-700 cursor-pointer">
                    I am currently active and available to respond to emergency blood calls
                  </label>
                </div>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-200 transition focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered on BloodConnect?{' '}
            <Link to="/login" className="font-semibold text-red-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
