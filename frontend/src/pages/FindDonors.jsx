import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { donorService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Droplet,
  MapPin,
  CheckCircle,
  Filter,
  Info,
  Calendar,
  AlertCircle,
  Send,
  Heart
} from 'lucide-react';
import { ALL_BLOOD_GROUPS, formatDate } from '../utils/compatibility';

const FindDonors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [pincode, setPincode] = useState(searchParams.get('pincode') || '');
  const [exactMatch, setExactMatch] = useState(false);

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compatibilityNote, setCompatibilityNote] = useState('');

  // Request modal state
  const [selectedDonor, setSelectedDonor] = useState(null);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (bloodGroup) params.bloodGroup = bloodGroup;
      if (city) params.city = city;
      if (state) params.state = state;
      if (pincode) params.pincode = pincode;
      params.exactMatch = exactMatch ? 'true' : 'false';

      const res = await donorService.searchDonors(params);

      if (res.success) {
        setDonors(res.data || []);
        setCompatibilityNote(res.compatibilityNote || '');
      }
    } catch (err) {
      console.error('Donor search error:', err);
      setError('Failed to search donors. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [exactMatch]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (bloodGroup) newParams.bloodGroup = bloodGroup;
    if (city) newParams.city = city;
    if (state) newParams.state = state;
    if (pincode) newParams.pincode = pincode;
    setSearchParams(newParams);
    performSearch();
  };

  const handleReset = () => {
    setBloodGroup('');
    setCity('');
    setState('');
    setPincode('');
    setExactMatch(false);
    setSearchParams({});
    setTimeout(() => {
      donorService.searchDonors({}).then((res) => {
        setDonors(res.data || []);
      });
    }, 100);
  };

  const handleRequestDonor = (donor) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/find-donors' } } });
      return;
    }
    // Navigate to create-request pre-filling the blood group and city
    navigate(`/create-request?bloodGroup=${encodeURIComponent(donor.bloodGroup)}&city=${encodeURIComponent(donor.city)}&donorName=${encodeURIComponent(donor.name)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold mb-2">
                <Droplet className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                Verified Donor Network
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Find Blood Donors
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Filter by blood group and location. Only active, available donors are shown.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/create-request')}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-sm shadow-red-200 transition flex items-center gap-2"
              >
                <Droplet className="w-4 h-4 fill-white" />
                Post Blood Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Medical disclaimer note */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
          <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
          <div>
            <span className="font-bold">Medical Cross-Matching Notice: </span>
            {compatibilityNote ||
              'Final compatibility and donor eligibility must be confirmed by a hospital or certified blood bank.'}
            <span className="block mt-0.5 text-amber-700">
              For privacy protection, donors' residential street addresses and phone numbers are kept confidential until request confirmation.
            </span>
          </div>
        </div>

        {/* Search & Filter Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Recipient Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="">All Blood Groups</option>
                  {ALL_BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore, Mumbai"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 560038"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Filter controls row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="exactMatch"
                  checked={exactMatch}
                  onChange={(e) => setExactMatch(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-slate-300"
                />
                <label htmlFor="exactMatch" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Restrict to <strong>exact</strong> blood group match only (uncheck to include compatible groups like O-)
                </label>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition w-1/2 sm:w-auto"
                >
                  Clear Filters
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5 w-1/2 sm:w-auto"
                >
                  <Search className="w-3.5 h-3.5" />
                  Apply Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Count & Status */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">
            {loading ? 'Searching donors...' : `Found ${donors.length} active available donor(s)`}
          </p>
          {bloodGroup && (
            <span className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full font-medium border border-red-200">
              Showing compatible donors for recipient: <strong>{bloodGroup}</strong>
            </span>
          )}
        </div>

        {/* Donors Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-xs text-slate-500 font-medium">Finding available donors near you...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No matching donors found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Try broadening your location search or unchecking "exact blood match" to discover compatible types.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => navigate('/create-request')}
                className="px-4 py-2 bg-red-600 rounded-xl text-xs font-semibold text-white hover:bg-red-700"
              >
                Post an Emergency Request
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <div
                key={donor._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{donor.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {donor.city}, {donor.state} ({donor.pincode})
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-extrabold text-lg flex items-center justify-center shadow-sm shadow-red-200">
                        {donor.bloodGroup}
                      </div>
                      {donor.isExactMatch ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block mt-1">
                          Exact Match
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 block mt-1">
                          Compatible
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Availability:</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Available Now
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Last Donation:</span>
                      <span className="font-medium text-slate-700">
                        {donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'Eligible'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleRequestDonor(donor)}
                    className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-2 border border-red-200 hover:border-transparent"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Request Donor for Transfusion
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FindDonors;
