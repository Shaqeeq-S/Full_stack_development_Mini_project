import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageBackgroundAnimation from '../components/common/PageBackgroundAnimation';
import { Droplet, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await login(formData);

      if (res.success && res.user) {
        notifySuccess('Login successful! Redirecting...');
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else if (res.user.role === 'donor') {
          navigate('/donor-dashboard', { replace: true });
        } else {
          navigate('/recipient-dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <Navbar />

      {/* Animated Floating Healthcare & Blood Background */}
      <PageBackgroundAnimation variant="default" showEcg={true} />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-xl shadow-red-500/5 border border-slate-200/80 transition-all hover:shadow-2xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-md shadow-red-200 animate-float-slow">
              <Droplet className="w-7 h-7 fill-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Sign in to BloodConnect
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Access your donor profile, requests or management console
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
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
                  className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-200 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

<div className="text-center text-xs text-slate-500">
  Don't have an account yet?{' '}
  <Link to="/register" className="font-semibold text-red-600 hover:underline">
    Register now
  </Link>
</div>
      </div>

      <Footer />
    </div>
  </div>
);

};

export default Login;
